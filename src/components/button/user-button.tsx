"use client";

import {
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  User,
  Button,
} from "@nextui-org/react";
import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { Icon } from "@iconify/react";
import { useAppContext } from "@/contexts/app";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
export default function UserButton() {
  const router = useRouter();
  const { data: session } = useSession();
  const { user, setUser } = useAppContext();
  const t = useTranslations("Nav");
  useEffect(() => {
    if (session && session.user) {
      setUser(session.user);
    }
  }, [session, setUser, user]);

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          isBordered
          as="button"
          className="transition-transform hover:scale-110"
          color="secondary"
          name={user.nickname || user.email}
          size="sm"
          src={user.avatar_url}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="User menu actions" variant="flat">
        <DropdownItem key="profile" className="h-14 gap-2">
          <User
            name={user.nickname || user.email}
            description={user.email}
            avatarProps={{
              src: user.avatar_url,
            }}
          />
        </DropdownItem>
        {/* <DropdownItem
          key="settings"
          startContent={<Icon icon="lucide:settings" width="16" height="16" />}
        >
          My Settings
        </DropdownItem>
        <DropdownItem
          key="team_settings"
          startContent={<Icon icon="lucide:user" width="16" height="16" />}
        >
          Team Settings
        </DropdownItem>
        
        <DropdownItem
          key="system"
          startContent={<Icon icon="lucide:cpu" width="16" height="16" />}
        >
          System
        </DropdownItem>
        <DropdownItem
          key="configurations"
          startContent={
            <Icon icon="lucide:settings-2" width="16" height="16" />
          }
        >
          Configurations
        </DropdownItem>
        <DropdownItem
          key="help_and_feedback"
          startContent={
            <Icon icon="lucide:help-circle" width="16" height="16" />
          }
        >
          Help & Feedback
        </DropdownItem> */}
              <DropdownItem
          key="analytics"
          onClick={() => router.push('/dashboard')}
          startContent={<Icon icon="lucide:settings-2" width="16" height="16" />}
        >
          {t("dashboard")}
        </DropdownItem>
        <DropdownItem
          key="logout"
          color="danger"
          onClick={() => signOut()}
          startContent={<Icon icon="lucide:log-out" width="16" height="16" />}
        >
          {t("logOut")}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
