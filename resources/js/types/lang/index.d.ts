// Type for language information
interface Language extends TableCommon {
   name: string;
   code: string;
   flag: string;
   nativeName: string;
   is_active: boolean;
   is_default: boolean;
   properties: LanguagesProperty[];
}

interface LanguagesProperty extends TableCommon {
   group: string;
   name: string;
   slug: string;
   properties: string;
   language_id: number | string;
   language: Language;
}

// Complete language interface combining all language files
interface LanguageTranslations {
   auth: AuthLang;
   button: ButtonLang;
   common: CommonLang;
   dashboard: DashboardLang;
   frontend: FrontendLang;
   input: InputLang;
   settings: SettingsLang;
   table: TableLang;
}

// Helper type for accessing nested translation keys
type TranslationKey =
   | `auth.${keyof AuthLang}`
   | `button.${keyof ButtonLang}`
   | `common.${keyof CommonLang}`
   | `dashboard.${keyof DashboardLang}`
   | `frontend.${keyof FrontendLang}`
   | `input.${keyof InputLang}`
   | `settings.${keyof SettingsLang}`
   | `table.${keyof TableLang}`;
