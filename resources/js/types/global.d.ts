import type { Config, route as routeFn } from 'ziggy-js';

declare global {
   const route: typeof routeFn;
}

export interface SharedData {
   page: Page;
   auth: Auth;
   customize: boolean;
   navbar: Navbar;
   footer: Footer;
   notifications: Notification[];
   system: Settings<SystemFields>;
   ziggy: Config & { location: string };
   flash: {
      error: string;
      warning: string;
      success: string;
   };
   langs: Language[];
   locale: string;
   direction: 'ltr' | 'rtl';
   cartCount: number;
   translate: LanguageTranslations;
   [key: string]: unknown;
}

// export type SharedData<T extends Record<string, unknown> = Record<string, unknown>> = T & {
//     auth: {
//         user: User;
//     };
//     ziggy: Config & { location: string };
//     flash: {
//         error: string;
//         warning: string;
//         success: string;
//     };
// };
