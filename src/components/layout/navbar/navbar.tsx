"use client";

import type { NavbarProps } from "@nextui-org/react";

import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Link,
  cn,
} from "@nextui-org/react";
import Locales from "../../locales";
import { useLocale } from "next-intl";
import LoginButton from "@/components/button/login-button";
import UserButton from "../../button/user-button";
import { useAppContext } from "@/contexts/app";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Icon } from "@iconify/react/dist/iconify.js";

const BasicNavbar = React.forwardRef<HTMLElement, NavbarProps>(
  ({ classNames = {}, ...props }, ref) => {
    const { data: session } = useSession();
    const locale = useLocale();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const { user, setUser } = useAppContext();
    const [activeTag, setActiveTag] = useState("home");
    const pathname = usePathname();
    const t = useTranslations("Nav");

    useEffect(() => {
      if (session && session.user) {
        setUser(session.user);
      }
      if (pathname.endsWith("/")) {
        setActiveTag("home");
      } else if (pathname.includes("text-to-image")) {
        setActiveTag("text-to-image");
      } else if (pathname.includes("pricing")) {
        setActiveTag("pricing");
      }
    }, [pathname, session, setUser]);

    const handleTagClick = (tag: string) => {
      setActiveTag(tag);
      setIsMenuOpen(false); // Close menu after clicking
    };

    return (
      <Navbar
        ref={ref}
        {...props}
        classNames={{
          base: cn("border-default-100 bg-transparent text-black"),
          wrapper:
            "w-full max-w-7xl lg:px-0 justify-center md:h-[100px] h-[70px]",
          item: "md:flex", // Removed hidden to show on mobile
          ...classNames,
        }}
        // height="100px"
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
      >
        <NavbarBrand>
          <img
            src="/logo.jpeg"
            alt="logo"
            className="w-9 h-9 md:w-11 md:h-11 mr-2 mb-1 ml-1"
            loading="lazy"
          />
          <p className="text-2xl font-bold hidden lg:block text-blue-700">
            AI Video Generator
          </p>
        </NavbarBrand>

        <NavbarContent className="hidden md:flex" justify="center">
          <NavbarItem onClick={() => handleTagClick("home")}>
            <Link
              aria-current="page"
              className={cn(
                "text-black mx-4",
                activeTag === "home" ? "text-black font-bold" : ""
              )}
              href={`/${locale}`}
              size="md"
            >
              {t("home")}
            </Link>
          </NavbarItem>
          <NavbarItem onClick={() => handleTagClick("pricing")}>
            <Link
              className={cn(
                "text-black mx-4",
                activeTag === "text-to-image" ? "text-black font-bold" : ""
              )}
              href={`/${locale}/text-to-image`}
              size="md"
            >
              {t("text-to-image")}
            </Link>
          </NavbarItem>
          <NavbarItem onClick={() => handleTagClick("pricing")}>
            <Link
              className={cn(
                "text-black mx-4",
                activeTag === "pricing" ? "text-black font-bold" : ""
              )}
              href={`/${locale}/pricing`}
              size="md"
            >
              {t("pricing")}
            </Link>
          </NavbarItem>
        </NavbarContent>

        <NavbarContent
          className="hidden md:flex justify-center items-center"
          justify="end"
        >
          <Locales />
          {user ? (
            <div className="flex flex-row gap-2">
              <button className="flex justify-center items-center gap-3 mr-6 hover:scale-110 transition-all duration-300">
                <a href={`/${locale}/dashboard`}>
                  My creations
                  {/* <Icon
                    icon="lucide:settings-2"
                    className="w-[1.3em] h-[1.3em] text-black"
                  /> */}
                </a>
              </button>
              <UserButton />
            </div>
          ) : (
            <LoginButton />
          )}
        </NavbarContent>

        <NavbarMenuToggle className="text-black md:hidden" />

        <NavbarMenu
          className="top-[calc(var(--navbar-height)_-_1px)] max-h-fit bg-white pb-6 pt-6 shadow-medium backdrop-blur-md backdrop-saturate-150 text-black mx-1"
          motionProps={{
            initial: { opacity: 0, y: -20 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -20 },
            transition: {
              ease: "easeInOut",
              duration: 0.2,
            },
          }}
        >
          <div className="flex flex-col w-full px-6">
            {[
              { tag: "home", path: "" },
              { tag: "text-to-image", path: "text-to-image" },
              { tag: "pricing", path: "pricing" },
            ].map(({ tag, path }) => (
              <NavbarMenuItem
                key={tag}
                className="w-full"
                onClick={() => {
                  setIsMenuOpen(false);
                  handleTagClick(tag);
                }}
              >
                <Link
                  className={cn(
                    "text-black",
                    activeTag === tag ? "text-black font-bold" : ""
                  )}
                  href={`/${locale}/${path}`}
                  size="lg"
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleTagClick(tag);
                  }}
                >
                  {t(tag)}
                </Link>
              </NavbarMenuItem>
            ))}

            <div className="flex flex-row gap-2">
              <button className="flex justify-center items-center gap-3 mr-6 hover:scale-110 transition-all duration-300 pt-2">
                <a href={`/${locale}/dashboard`}>
                  My creations
                  {/* <Icon
                    icon="lucide:settings-2"
                    className="w-[1.3em] h-[1.3em] text-black"
                  /> */}
                </a>
              </button>
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <div>{user ? <UserButton /> : <LoginButton />}</div>
            </div>
          </div>
        </NavbarMenu>
      </Navbar>
    );
  }
);

BasicNavbar.displayName = "BasicNavbar";

export default BasicNavbar;
