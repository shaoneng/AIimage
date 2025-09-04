import React from "react";
import TopHero from "@/components/landingpage/top";
import WorkerWrapper from "@/components/replicate/text-to-image/worker-wraper";
import { getMetadata } from "@/components/seo/seo";
export async function generateMetadata({
  params,
}: {
  params: { locale?: string };
}) {
  return await getMetadata(
    params?.locale || "",
    "TextToImage.seo",
    "text-to-image"
  );
}

export default function TextToImage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const effectId = "2";
  const multiLanguage = "TextToImage";
  const outputDefaultImage = "/resources/text-to-image.jpg";

  return (
    <main className="flex flex-col items-center rounded-2xl px-3 md:rounded-3xl md:px-0">
      <div className="pt-10">
        <TopHero multiLanguage={multiLanguage} locale={locale} />
      </div>
      <div className="w-full flex justify-center items-center pt-3 pb-10">
        <WorkerWrapper
          effectId={effectId}
          multiLanguage={multiLanguage}
          outputDefaultImage={outputDefaultImage}
        />
      </div>
    </main>
  );
}
