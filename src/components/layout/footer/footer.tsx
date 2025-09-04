import React from "react";
import { Divider, Link } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";
import { getDomain } from "@/config/domain";

export default function Footer({ locale }: { locale: string }) {
  const t = useTranslations("Footer");

  const domain = getDomain();

  const footerNavigation = {
    supportOptions: [
      {
        name: t("recommend.item.item1"),
        href: `${domain}/${locale}`,
      },
    ],
    multiLanguage: [{ name: "English", href: domain }],

    legal: [
      { name: t("legal.item.item1"), href: "/legal/privacy-policy" },
      { name: t("legal.item.item2"), href: "/legal/terms-of-service" },
      { name: "Partners", href: "/partners" },
    ],
    social: [
      {
        name: "Facebook",
        href: "#",
        icon: "fontisto:facebook",
      },
      {
        name: "Instagram",
        href: "#",
        icon: "fontisto:instagram",
      },
      {
        name: "Twitter",
        href: "#",
        icon: "fontisto:twitter",
      },
      {
        name: "GitHub",
        href: "#",
        icon: "fontisto:github",
      },
    ],
  };
  return (
    <footer className="flex w-full flex-col items-center text-black">
      <div className="max-w-7xl w-full px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-24 text-black mx-auto">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 md:pr-8">
            <div className="flex items-center justify-center xl:justify-start">
              <img
                src="/logo.jpeg"
                alt="AI Video Generator"
                className="w-8 h-8 mr-2"
                loading="lazy"
              />
              <span className="text-medium font-medium">
                AI Video Generator
              </span>
            </div>
            <p className="text-small text-black text-center xl:text-left">
              {t("description")}
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-4 md:gap-8">
              <div className="mt-10 md:mt-0">
                <p className="text-small font-semibold text-center xl:text-left text-black">
                  {t("recommend.title")}
                </p>
                <ul className="mt-6 space-y-4">
                  {footerNavigation.supportOptions.map((item) => (
                    <li key={item.name} className="text-center xl:text-left">
                      <Link className="text-black" href={item.href} size="sm">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <p className="text-small font-semibold text-center xl:text-left text-black">
                  {t("multiLanguage.title")}
                </p>
                <ul className="mt-6 space-y-4">
                  {footerNavigation.multiLanguage.map((item) => (
                    <li key={item.name} className="text-center xl:text-left">
                      <Link className="text-black" href={item.href} size="sm">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <p className="text-small font-semibold text-center xl:text-left text-black">
                  {t("legal.title")}
                </p>
                <ul className="mt-6 space-y-4">
                  {footerNavigation.legal.map((item) => (
                    <li key={item.name} className="text-center xl:text-left">
                      <Link className="text-black" href={item.href} size="sm">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <p className="text-small font-semibold text-center xl:text-left text-black">
                  {t("contact.title")}
                </p>
                <ul className="mt-6 space-y-4">
                  <li className="text-center xl:text-left">
                    <Link
                      href={`mailto:support@${domain.replace("https://", "")}`}
                      className="text-black text-sm"
                    >
                      <Icon icon="mdi:email" className="text-black" /> :
                      support@{domain.replace("https://", "")}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <Divider className="mt-16 sm:mt-20 lg:mt-24" />
        <div className="flex justify-center pt-8">
          <p className="text-small text-black">
            &copy; 2025 AI Video Generator. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
