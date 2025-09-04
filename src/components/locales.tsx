import { useRouter } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@nextui-org/react";
import type { Selection } from "@nextui-org/react";
import React from "react";
import { localesName } from "@/i18n/routing";

export default function Locales() { 
    const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set(["text"]));
    const router = useRouter();
    const pathname = usePathname();
    const locale = useLocale();

    const changeLanguage = (selectedLocale: string) => {
        if (selectedLocale !== locale) {
          // Remove the locale from the pathname if it exists
          let newPathName = pathname.replace(`/${locale}`, '');
          
          // Ensure the pathname starts with a slash
          if (!newPathName.startsWith('/')) {
            newPathName = '/' + newPathName;
          }
          
          // Use the router's push method with the locale option
          router.push(newPathName, { locale: selectedLocale as any });
        }
      };

      return (
        <Dropdown>
          <DropdownTrigger>
            <Button 
              variant="light"
              className="capitalize"
              startContent={<span role="img" aria-label="globe" className="">🌏</span>}
              style={{ color: '#000000' }}
             >
              {locale.toUpperCase()}
            </Button>
          </DropdownTrigger>
          <DropdownMenu 
            variant="faded"
            disallowEmptySelection
            selectionMode="single"
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
          >
            {Object.keys(localesName).map((item) => (
              <DropdownItem key={item} onClick={() => changeLanguage(item)} style={{ color: '#000000' }}>
                {localesName[item as keyof typeof localesName]}
              </DropdownItem>
            ))}
          </DropdownMenu>   
        </Dropdown>
      );
}