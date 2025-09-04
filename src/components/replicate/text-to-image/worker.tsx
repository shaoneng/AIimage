"use client";

import React, { useState, useEffect } from "react";
import { Button, Textarea, Select, SelectItem } from "@nextui-org/react";
import Prediction from "@/backend/type/domain/replicate";
import { useAppContext } from "@/contexts/app";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { handleApiErrors } from "@/components/replicate/common-logic/response";
import Output from "@/components/replicate/text-to-image/img-output";
import { UserSubscriptionInfo } from "@/backend/type/domain/user_subscription_info";
import CreditInfo from "@/components/landingpage/credit-info";
import { useTranslations } from "next-intl";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function Worker(props: {
  model: string;
  effect_link_name: string;
  version: string | null;
  credit: number;
  promptTips?: string;
  defaultImage?: string;
  lang?: string;
}) {
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState<boolean>(false);
  const [outputFormat, setOutputFormat] = useState<string>("png");
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const width = 1024;
  const height = 1024;
  const [userSubscriptionInfo, setUserSubscriptionInfo] =
    useState<UserSubscriptionInfo | null>(null);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const { user } = useAppContext();
  const router = useRouter();
  const t = useTranslations(props.lang || "index");

  useEffect(() => {
    if (user?.uuid) {
      fetchUserSubscriptionInfo();
    }
  }, [user?.uuid]);

  const fetchUserSubscriptionInfo = async () => {
    if (!user?.uuid) return;
    const userSubscriptionInfo = await fetch(
      "/api/user/get_user_subscription_info",
      {
        method: "POST",
        body: JSON.stringify({ user_id: user.uuid }),
      }
    ).then((res) => {
      if (!res.ok) throw new Error("Failed to fetch user subscription info");
      return res.json();
    });
    setUserSubscriptionInfo(userSubscriptionInfo);
    setIsSubscribed(userSubscriptionInfo.subscription_status === "active");
  };

  const handleGenerate = async () => {
    let newPrediction: Prediction;
    if (props.credit > 0) {
      if (
        typeof userSubscriptionInfo?.remain_count === "number" &&
        userSubscriptionInfo.remain_count < props.credit
      ) {
        toast.warning("No credit left");
        return;
      }
    }

    if (prompt.length === 0) {
      toast.warning("Please enter a prompt");
      return;
    }
    // step1: create prediction
    try {
      setGenerating(true);
      const response = await fetch("/api/predictions/text_to_image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: props.model,
          version: props.version,
          prompt,
          width,
          height,
          output_format: outputFormat,
          aspect_ratio: "custom",
          user_id: user?.uuid,
          user_email: user?.email,
          effect_link_name: props.effect_link_name,
          credit: props.credit,
        }),
      });
      newPrediction = await response.json();
      const canContinue = await handleApiErrors({
        response,
        newPrediction,
        router,
      });
      if (!canContinue) {
        return;
      }
      setPrediction(newPrediction);
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("An error occurred while generating the image.");
      setGenerating(false);
      return;
    }

    // step2: wait for prediction to be succeeded or failed
    while (
      newPrediction.status !== "succeeded" &&
      newPrediction.status !== "failed"
    ) {
      await sleep(1500);
      const response = await fetch("/api/predictions/" + newPrediction.id);
      newPrediction = await response.json();
      if (response.status !== 200) {
        setError(newPrediction.detail);
        return;
      }
      setPrediction(newPrediction);
    }
    // update effect result
    const runningTime =
      (newPrediction.created_at
        ? new Date().getTime() - new Date(newPrediction.created_at).getTime()
        : -1) / 1000;
    fetch("/api/effect_result/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        original_id: newPrediction.id,
        status: newPrediction.status,
        running_time: runningTime,
        updated_at: new Date(),
        original_image_url: "",
        object_key: newPrediction.id.substring(0, 8),
      }),
    });
    await sleep(4000);
    setGenerating(false);
    fetchUserSubscriptionInfo();
  };

  return (
    <>
      <div
        className="container mx-auto flex flex-col md:flex-row my-4 px-4 py-8 rounded-lg shadow-lg bg-white border-1 border-blue-200 rounded-lg shadow-lg shadow-blue-200 bg-white"
        style={{
          boxShadow:
            "0 0 20px rgba(59, 130, 246, 0.3), 0 0 40px rgba(59, 130, 246, 0.1)",
        }}
      >
        <div className="w-full md:w-1/2 md:px-6 md:border-r border-divider border-default-300">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {t("input.title")}
              </h2>
              <div className="flex items-center gap-3">
                <CreditInfo
                  credit={userSubscriptionInfo?.remain_count?.toString() || ""}
                />
              </div>
            </div>
            <label className="block ml-1 text-sm mb-2">Prompt</label>
            <Textarea
              className="min-h-[40px]"
              minRows={5}
              placeholder={props.promptTips || "Enter a prompt here"}
              radius="lg"
              variant="bordered"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              aria-label="Prompt"
            />
          </div>

          <div className="mb-6">
            <label className="block ml-1 text-sm mb-2">Output Format</label>
            <Select
              placeholder="Choose a format"
              className="max-w-xs"
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value)}
              aria-label="Output Format"
            >
              <SelectItem key="webp" value="webp">
                WEBP
              </SelectItem>
              <SelectItem key="jpg" value="jpg">
                JPG
              </SelectItem>
              <SelectItem key="png" value="png">
                PNG
              </SelectItem>
            </Select>
          </div>

          {generating ? (
            <Button
              isLoading
              className="w-full mt-4 bg-indigo-600 text-white hover:bg-indigo-700 transition duration-200"
            >
              {prediction
                ? prediction.status === "succeeded"
                  ? "Processing..."
                  : prediction.status
                : "Processing..."}
            </Button>
          ) : (
            <Button
              className="w-full mt-4 bg-blue-600 text-white hover:bg-blue-700 transition duration-200"
              onClick={handleGenerate}
            >
              Generate Image（1 credit）
            </Button>
          )}
        </div>

        {/* output */}
        <Output
          error={error || ""}
          prediction={prediction}
          defaultImage={props.defaultImage || ""}
          showImage={null}
        />
      </div>
    </>
  );
}
