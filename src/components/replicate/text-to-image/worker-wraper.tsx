import Worker from "@/components/replicate/text-to-image/worker";
import { getEffectById } from "@/backend/service/effect";
import { Effect } from "@/backend/type/type";

export default async function WorkerWraper(params: {
  effectId: string;
  multiLanguage: string;
  outputDefaultImage: string;
}) {
  let effect: Effect | null = null;
  try {
    effect = await getEffectById(Number(params.effectId));
  } catch (_) {
    effect = null;
  }
  if (!effect) {
    effect = {
      id: 0,
      name: "Text-to-Image",
      type: 1,
      des: "",
      platform: "google",
      link: "",
      api: "models/gemini-2.5-flash-image-preview",
      is_open: 1,
      link_name: "text-to-image",
      credit: 1,
      created_at: new Date(),
      model: "models/gemini-2.5-flash-image-preview",
      version: "",
      pre_prompt: ""
    } as Effect;
  }
  return (
    <div className="flex flex-col w-full p-4 max-w-7xl rounded-lg mt-6">
      <Worker
        model={effect.model}
        effect_link_name={effect.link_name}
        version={effect.version}
        credit={effect.credit}
        defaultImage={params.outputDefaultImage}
        lang={params.multiLanguage}
      />
    </div>
  );
}
