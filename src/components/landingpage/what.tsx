import React from "react";
import { Button, Tab } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { localesName } from "@/i18n/routing";

export default function What(params: { multiLanguage: string, image: string }) {
  const t = useTranslations(params.multiLanguage);

  return (
    <section className="z-20 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center w-full max-w-7xl px-4">
        <h2 className="text-3xl md:text-4xl mb-20 font-extrabold text-blue-700 text-center">
          {t("what.title")}
        </h2>
        <div className="flex flex-col md:flex-row-reverse items-center justify-between w-full">
          <div className="md:w-1/2 relative pl-2">
            <p className="sm:text-xl mb-4 sm:mb-6 text-black">
              {t("what.description")}
            </p>
            <ul className="space-y-2 text-lg sm:text-xl text-black">
              <li className="flex items-center space-x-2">
                <span className="mt-1 text-blue-700">
                  ✦
                </span>
                <div className="flex flex-col">
                  <h3 className="font-semibold text-black">
                    {t("what.itemTitle1")}
                  </h3>
                    <span className="text-lg text-gray-800">
                    {t("what.itemDescription1")}
                  </span>
                </div>
              </li>
              <li className="flex items-center">
                <span className="mr-2 text-blue-700">
                  ✦
                </span>
                <div className="flex flex-col">
                  <h3 className="font-semibold text-black">
                    {t("what.itemTitle2")}
                  </h3>
                  <span className="text-lg text-gray-800">
                    {t("what.itemDescription2")}
                  </span>
                </div>
              </li>
              <li className="flex items-center">
                  <span className="mr-2 text-blue-700">
                  ✦
                </span>
                <div className="flex flex-col">
                  <h3 className="font-semibold text-black">
                    {t("what.itemTitle3")}
                  </h3>
                  <span className="text-lg text-gray-800">
                    {t("what.itemDescription3")}
                  </span>
                </div>
              </li>
            </ul>
          </div>
          <div className="md:w-1/3 relative mt-8 md:mt-0">
            <div className="absolute -inset-1 bg-black rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <img
              src={params.image}
              alt="Why Choose Nana Banana AI"
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
