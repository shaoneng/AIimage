import { defineRouting } from 'next-intl/routing';
import { createSharedPathnamesNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
    // A list of all locales that are supported
    locales: ['en'],
    // Used when no locale matches
    defaultLocale: 'en',

    
});
export const localesName = {
    en: 'English', // English
    // es: 'Español', // Spanish
    // pt: 'Português', // Portuguese
    // it: 'Italiano', // Italian
    // de: 'Deutsch', // German
    // fr: 'Français', // French
    // ar: 'العربية', // Arabic
    // ja: '日本語', // Japanese
    // ko: '한국어', // Korean
    // zh: '中文', // Chinese
}

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter} =
    createSharedPathnamesNavigation(routing);