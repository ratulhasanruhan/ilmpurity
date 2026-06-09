import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import FooterEditor from '@/layouts/footer/footer-editor';
import FooterPreview from '@/layouts/footer/footer-preview';
import { SharedData } from '@/types/global';
import { usePage } from '@inertiajs/react';
import { Edit, Eye, X } from 'lucide-react';
import { useState } from 'react';
import { SystemProps } from '../index';

const Footer = () => {
   const { props } = usePage<SystemProps & SharedData>();
   const { footer, translate } = props;
   const { settings, button } = translate;
   const [showEditor, setShowEditor] = useState(false);

   if (!footer) {
      return (
         <Card>
            <CardContent className="flex items-center justify-center py-8">
               <p className="text-muted-foreground">{settings.footer_config_not_found}</p>
            </CardContent>
         </Card>
      );
   }

   return (
      <Card>
         <CardHeader>
            <div className="flex items-center justify-between">
               <div>
                  <CardTitle className="flex items-center gap-2">
                     <Eye className="h-5 w-5" />
                     {settings.live_footer_preview}
                  </CardTitle>
                  <CardDescription className="hidden sm:block">
                     {settings.interactive_preview} {footer.title} ({footer.slug})
                  </CardDescription>
               </div>

               {showEditor ? (
                  <Button onClick={() => setShowEditor(false)} variant="outline">
                     <X className="mr-2 h-4 w-4" />
                     {button.close}
                  </Button>
               ) : (
                  <Button onClick={() => setShowEditor(true)} className="flex items-center gap-2">
                     <Edit className="h-4 w-4" />
                     {button.edit_footer}
                  </Button>
               )}
            </div>
         </CardHeader>

         <Separator />

         {showEditor ? (
            <FooterEditor footer={footer} />
         ) : (
            <CardContent className="p-5">
               <FooterPreview />
            </CardContent>
         )}
      </Card>
   );
};

export default Footer;
