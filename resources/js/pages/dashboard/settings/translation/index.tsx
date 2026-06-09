import DeleteModal from '@/components/inertia/delete-modal';
import Switch from '@/components/switch';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Dashboard from '@/layouts/dashboard/layout';
import { SharedData } from '@/types/global';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import { ReactNode } from 'react';
import AddLanguage from './partials/add-language';

const Index = () => {
   const { props } = usePage<SharedData>();
   const { translate } = props;
   const { settings, common } = translate;

   const languageStatus = (lang: Language, checked: boolean) => {
      router.put(
         route('language.update', lang.id),
         { is_active: checked },
         {
            preserveScroll: true,
         },
      );
   };

   const defaultLanguage = (lang: Language) => {
      router.post(route('language.default', lang.id), {
         preserveScroll: true,
      });
   };

   return (
      <>
         <Head title={settings.language_settings} />

         <Card className="mx-auto w-full max-w-[1000px] space-y-6 p-6">
            <div className="flex items-center justify-between border-b border-b-gray-200 pb-6">
               <p className="text-lg font-bold text-gray-900">{settings.language_settings}</p>
               <AddLanguage />
            </div>

            <div className="rounded-md bg-blue-50 p-4 text-sm text-blue-700">
               <div className="mb-2 font-medium">Translation Scope Information</div>
               <ul className="list-disc space-y-1 pl-5">
                  <li>Translations will be applied to dashboard interfaces (admin, instructor, student).</li>
                  <li>Public pages are not affected by these translations as they are fully customizable through the page editor.</li>
               </ul>
            </div>

            <div className="flex flex-col gap-5">
               {props.langs.map((lang) =>
                  lang.is_default ? (
                     <div key={lang.code} className="mb-5 flex items-center justify-between rounded-md border border-gray-300 p-5">
                        <h6 className="text-xl">
                           {lang.name} ({lang.nativeName})
                        </h6>

                        <div className="flex items-center">
                           <span className="mr-4 rounded-full bg-blue-50 px-2 py-0.5 text-sm font-medium">{common.default}</span>
                           <Link href={route('language.edit', lang.code)}>
                              <Button size="icon" variant="secondary" className="mr-3 h-7 w-7 rounded-full text-blue-500">
                                 <Pencil className="h-4 w-4" />
                              </Button>
                           </Link>
                           <Switch disabled checked name={lang.code} />
                        </div>
                     </div>
                  ) : (
                     <div key={lang.code} className="flex items-center justify-between rounded-md border border-gray-300 p-5">
                        <h6 className="text-xl">
                           {lang.name} ({lang.nativeName})
                        </h6>

                        <div className="flex items-center gap-3">
                           {lang.is_active ? (
                              <Button onClick={() => defaultLanguage(lang)} size="sm" variant="secondary" className="rounded-full">
                                 Set Default
                              </Button>
                           ) : null}

                           <Link href={route('language.edit', lang.code)}>
                              <Button size="icon" variant="secondary" className="h-7 w-7 rounded-full text-blue-500">
                                 <Pencil className="h-4 w-4" />
                              </Button>
                           </Link>

                           <DeleteModal
                              routePath={route('language.destroy', lang.id)}
                              actionComponent={
                                 <Button size="icon" variant="ghost" className="bg-destructive/8 hover:bg-destructive/6 h-8 w-8 rounded-full p-0">
                                    <Trash2 className="text-destructive text-sm" />
                                 </Button>
                              }
                           />

                           <Switch
                              name={lang.code}
                              defaultChecked={lang.is_active}
                              onCheckedChange={(checked) => languageStatus(lang, checked)}
                              className="cursor-pointer"
                           />
                        </div>
                     </div>
                  ),
               )}
            </div>
         </Card>
      </>
   );
};

Index.layout = (page: ReactNode) => <Dashboard children={page} />;

export default Index;
