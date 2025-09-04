import React from "react";
import { useTranslations } from "next-intl";
export default function TopHero(params: {
  multiLanguage: string;
  locale: string;
}) {
  const t = useTranslations(params.multiLanguage);

  return (
    <section className="z-20 flex flex-col items-center justify-center">
      <div className="text-center mb-2">
        <h1 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight text-blue-600">
          <p> {t("top.subTitle")} </p>
        </h1>
      </div>
      <p className="text-center font-sm text-[gray-700] lg:w-[900px] sm:text-[20px] md:mb-3 ">
        {t("top.description")}
      </p>
    </section>
  );
}
