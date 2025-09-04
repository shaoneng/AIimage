
import React from "react";
import { useMediaQuery } from "usehooks-ts";

import ScrollingBanner from "./scrolling-banner";
import UserReview from "./user-review";
import { useTranslations } from "next-intl";
import { testimonials } from "./data";


/**
 *  This example requires installing the `usehooks-ts` package:
 * `npm install usehooks-ts`
 *
 * import {useMediaQuery} from "usehooks-ts";
 */
export default function Component() {
  const t = useTranslations("HomePage.testimonials");
  // Split testimonials into two rows
  const topRow = testimonials.slice(0, 10);
  const bottomRow = testimonials.slice(10, 20);

  return (
    <section className="mx-auto w-full max-w-6xl gap-20 sm:gap-16">
      <div className="text-center mb-20">
        <h2 className="text-3xl md:text-4xl py-4 font-extrabold sm:mb-2 text-blue-700">
          {t("title")}
        </h2>
        {/* <p className="text-base sm:text-xl mb-4 text-gray-800 dark:text-gray-100 leading-relaxed">
          {t('description')}
        </p> */}
      </div>
      <div className="flex flex-col gap-4">
        <ScrollingBanner
          isVertical={false}
          duration={100}
          shouldPauseOnHover={false}
          className="w-full"
        >
          {topRow.map((testimonial, index) => (
            <UserReview
              key={`top-${testimonial.name}-${index}`}
              {...testimonial}
              className="w-[300px] h-[200px]" // Fixed dimensions
            />
          ))}
        </ScrollingBanner>

        <ScrollingBanner
          isVertical={false}
          duration={100}
          shouldPauseOnHover={false}
          className="w-full"
          isReverse
        >
          {bottomRow.map((testimonial, index) => (
            <UserReview
              key={`bottom-${testimonial.name}-${index}`}
              {...testimonial}
              className="w-[300px] h-[200px]" // Fixed dimensions
            />
          ))}
        </ScrollingBanner>
      </div>
    </section>
  );
}
