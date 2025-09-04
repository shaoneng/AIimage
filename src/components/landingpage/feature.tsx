import React from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@iconify/react";

export default function FeatureHero( params: { multiLanguage: string }) {
  const t = useTranslations(params.multiLanguage);
  const features = [
    {
      icon: "solar:hourglass-line-duotone",
      title: t('Features.feature1.title'),
      description: t('Features.feature1.description')
    },
    {
      icon: "solar:shield-check-line-duotone", 
      title: t('Features.feature2.title'),
      description: t('Features.feature2.description')
    },
    {
      icon: "solar:gallery-wide-line-duotone",
      title: t('Features.feature3.title'), 
      description: t('Features.feature3.description')
    },
    {
      icon: "solar:chart-line-duotone",
      title: t('Features.feature4.title'),
      description: t('Features.feature4.description')
    },
    {
      icon: "solar:smartphone-2-line-duotone",
      title: t('Features.feature5.title'),
      description: t('Features.feature5.description')
    },
    {
      icon: "solar:shield-check-line-duotone",
      title: t('Features.feature6.title'),
      description: t('Features.feature6.description')
    }
  ];

  return (
    <section className="z-20 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center w-full max-w-7xl px-4 gap-20 sm:gap-16">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl py-4 font-extrabold sm:mb-2 text-blue-700">
            {t('Features.heading')}
          </h2>
          {/* <p className="sm:text-xl mb-4 text-gray-800 dark:text-gray-200 leading-relaxed">
            {t('Features.subheading')}
          </p> */}
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 w-full">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="relative p-6 bg-white dark:bg-black rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-500 text-white text-bold">
                    <Icon icon={feature.icon} width={20} height={20} />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-black dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
