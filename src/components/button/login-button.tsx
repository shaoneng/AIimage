"use client";

import { Button } from "@nextui-org/react";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";

export default function () {
  const t = useTranslations("Nav");
  return (
    <Button
      className="capitalize text-black rounded-full"
      onClick={() => signIn("google")}
    >
      {t("login")}
    </Button>
  );
}
