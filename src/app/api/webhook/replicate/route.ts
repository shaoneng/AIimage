import {
  getEffectResultByOriginalId,
  updateEffectResult,
  updateEffectResultError,
} from "@/backend/service/effect_result";
import { reducePeriodRemainCountByUserId } from "@/backend/service/credit_usage";

export const maxDuration = 60;

export async function POST(req: Request, res: Response) {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const webhookData = await req.json();
    const effectResult = await getEffectResultByOriginalId(webhookData.id);
    if (!effectResult) {
      return Response.json(
        { error: "Effect result not found" },
        { status: 500 }
      );
    }

    const runningTime =
      (webhookData.completed_at
        ? new Date(webhookData.completed_at).getTime() -
          new Date(webhookData.created_at).getTime()
        : -1) / 1000;

    if (webhookData.status === "succeeded") {
      let output = processWebhookOutput(
        webhookData.output,
        effectResult.effect_name
      );

      if (effectResult.status === "succeeded") {
        if (
          effectResult.url === "" ||
          effectResult.url === null ||
          effectResult.url === undefined
        ) {
          await updateEffectResult(
            effectResult.original_id,
            webhookData.status,
            runningTime,
            new Date(),
            output
          );
        }
      } else {
        await updateEffectResult(
          effectResult.original_id,
          webhookData.status,
          runningTime,
          new Date(),
          output
        );
      }
      reducePeriodRemainCountByUserId(
        effectResult.user_id,
        effectResult.credit
      );
    } else if (webhookData.status === "failed") {
      await updateEffectResultError(
        effectResult.original_id,
        webhookData.status,
        -1,
        new Date(),
        ""
      );
      console.error("Error message:", webhookData.error);
    }

    return Response.json({ message: "Webhook received" }, { status: 200 });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

function processWebhookOutput(output: any, effect_name: string) {
  // Handle case where output is an object with images array
  if (output && typeof output === "object" && "images" in output) {
    return output.images[0];
  }

  // Handle case where output is an object with image property
  if (output && typeof output === "object" && "image" in output) {
    return output.image;
  }

  // Handle case where output is an array
  if (Array.isArray(output)) {
    if (effect_name === "face-to-sticker") {
      return output[1];
    }
    if (
      effect_name === "flux-canny-pro" ||
      effect_name === "flux-canny-dev" ||
      effect_name === "flux-depth-pro"
    ) {
      return output[0];
    }
    if (effect_name === "chat-with-images") {
      return formatArticleFromWords(output);
    }
    return output[0];
  }

  // Return as-is if neither case matches
  return output;
}

// Utility function to format array of words into a formatted article
function formatArticleFromWords(words: string[]): string {
  if (!Array.isArray(words) || words.length === 0) {
    return "";
  }

  // Join words and trim extra spaces
  const text = words.join("").replace(/\s+/g, " ").trim();

  // Capitalize first letter of sentences
  const formattedText = text.replace(/(^\w|\.\s+\w)/g, (letter) =>
    letter.toUpperCase()
  );

  // Add paragraph breaks after periods
  const paragraphs = formattedText
    .split(". ")
    .map((p) => p.trim())
    .filter((p) => p.length > 0)
    .join(".\n\n");

  return paragraphs;
}
