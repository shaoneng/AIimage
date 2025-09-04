import { getTranslations } from "next-intl/server";
import { getDomain } from "@/config/domain";

export async function getMetadata(
  locale: string,
  dir: string,
  canonicalTail: string
) {
  const t = await getTranslations(dir);
  const baseUrl = getDomain();
  let canonical = `${baseUrl}/${locale}`;
  if (locale === "" || locale === "en") {
    canonical = `${baseUrl}` + "/";
  }
  if (canonicalTail !== "") {
    canonical = canonical + canonicalTail;
  }
  return {
    title: t("title"),
    description: t("description"),
    icons: {
      rel: "icon",
      icon: "/logo.jpeg",
    },
    alternates: {
      canonical: canonical,
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: canonical,
      images: [
        {
          url: "",
          width: 800,
          height: 600,
          alt: t("title"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      image: "",
    },
  };
}
