import React from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function Faq(params: { multiLanguage: string, grid: boolean }) {
  const t = useTranslations(params.multiLanguage);

  const faqs = [
    {
      title: t('FAQ.Q1'),
      content: t('FAQ.A1'),
    },
    {
      title: t('FAQ.Q2'), 
      content: t('FAQ.A2'),
    },
    {
      title: t('FAQ.Q3'),
      content: t('FAQ.A3'),
    },
    {
      title: t('FAQ.Q4'),
      content: t('FAQ.A4'),
    },
    {
      title: t('FAQ.Q5'),
      content: t('FAQ.A5'),
    },
    {
      title: t('FAQ.Q6'),
      content: t('FAQ.A6'),
    }
  ];

  const firstHalf = faqs.slice(0, Math.ceil(faqs.length / 2));
  const secondHalf = faqs.slice(Math.ceil(faqs.length / 2));

  return (
    <section className="mx-auto w-full max-w-7xl px-0">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-6">
        <h2 className="px-2 mb-10 text-3xl md:text-4xl font-extrabold leading-7 text-blue-700 text-center">
          {t('FAQ.title')}
        </h2>
        <div className={`grid grid-cols-1 gap-6 w-full ${params.grid ? 'md:grid-cols-2' : 'md:grid-cols-1'}`}>
          <div>
            {firstHalf.map((item, i) => (
              <details 
                key={i}
                className="group rounded-lg mb-3 bg-white dark:bg-black hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <summary className="cursor-pointer w-full px-6 py-4 md:py-6 flex justify-between items-center">
                  <h3 className="text-lg font-medium text-left text-black dark:text-white">
                    {item.title}
                  </h3>
                  <Icon 
                    icon="solar:alt-arrow-down-linear" 
                    width={24}
                    className="transform transition-transform group-open:rotate-180 text-black dark:text-white"
                  />
                </summary>
                <div className="px-6 pb-6 pt-0 text-base text-gray-700 dark:text-gray-300">
                  {item.content}
                </div>
              </details>
            ))}
          </div>
          <div>
            {secondHalf.map((item, i) => (
              <details
                key={i}
                className="group rounded-lg mb-3 bg-white dark:bg-black hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <summary className="cursor-pointer w-full px-6 py-4 md:py-6 flex justify-between items-center">
                  <h3 className="text-lg font-medium text-left text-black dark:text-white">
                    {item.title}
                  </h3>
                  <Icon 
                    icon="solar:alt-arrow-down-linear" 
                    width={24}
                    className="transform transition-transform group-open:rotate-180 text-black dark:text-white"
                  />
                </summary>
                <div className="px-6 pb-6 pt-0 text-base text-gray-700 dark:text-gray-300">
                  {item.content}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
