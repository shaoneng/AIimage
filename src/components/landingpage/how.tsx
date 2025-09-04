import React from "react";
import { Button, Tab } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { localesName } from "@/i18n/routing";

export default function How(params: { multiLanguage: string, image: string }) {
  const t = useTranslations(params.multiLanguage);

  return (
    <section className="z-20 flex flex-col items-center ">
      <div className="flex flex-col items-center w-full max-w-7xl px-4">
        <h2 className="text-3xl md:text-4xl mb-20 font-extrabold text-blue-700 text-center">
          {t("how.title")}
        </h2>
        <div className="flex flex-col md:flex-row items-center justify-between w-full">
          <div className="md:w-1/2 relative pr-4">
            <p className="sm:text-xl mb-4 sm:mb-6 text-black">
              {t("how.description")}
            </p>
            <ol className="space-y-4 text-lg sm:text-xl text-black">
              <li className="flex items-center">
                <span className="mr-2 text-blue-700">
                  ✦
                </span>
                <h3>{t("how.item1")}</h3>
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-blue-700">
                  ✦
                </span>
                <h3>{t("how.item2")}</h3>
              </li>
              <li className="flex items-center">
                  <span className="mr-2 text-blue-700">
                  ✦
                </span>
                <h3>{t("how.item3")}</h3>
              </li>
            </ol>
          </div>
          <div className="md:w-1/3 relative mt-8 md:mt-0">
            <div className="absolute -inset-1 bg-black rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <img
              src={params.image}
              alt="How to Use AImage"
              width={500}
              height={500}
              className="rounded-lg shadow-2xl transform hover:scale-110 transition duration-300"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
