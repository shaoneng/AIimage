"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from "next/navigation";
import { ThemeProviderProps } from "next-themes/dist/types";
import { ThemeProvider as ColorThemeProvider } from "@/contexts/theme";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children }: any) {
  const router = useRouter();

  return (
    <NextUIProvider navigate={router.push}>
      <ColorThemeProvider>
        {children}
      </ColorThemeProvider>
    </NextUIProvider>
  );
}
