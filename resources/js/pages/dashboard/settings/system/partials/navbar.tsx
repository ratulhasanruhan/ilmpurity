import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import NavbarEditor from '@/layouts/navbar/navbar-editor';
import NavbarPreview from '@/layouts/navbar/navbar-preview';
import { SharedData } from '@/types/global';
import { usePage } from '@inertiajs/react';
import { Edit, Eye, X } from 'lucide-react';
import { useState } from 'react';
import { SystemProps } from '../index';

const Navbar = () => {
   const { props } = usePage<SystemProps & SharedData>();
   const { navbar, translate } = props;
   const { settings, button } = translate;
   const [showEditor, setShowEditor] = useState(false);

   return (
      <Card>
         <CardHeader>
            <div className="flex items-center justify-between">
               <div>
                  <CardTitle className="flex items-center gap-2">
                     <Eye className="h-5 w-5" />
                     {settings.live_navbar_preview}
                  </CardTitle>
                  <CardDescription className="hidden sm:block">
                     {settings.interactive_preview} {navbar.title} ({navbar.slug})
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
                     {button.edit_navbar}
                  </Button>
               )}
            </div>
         </CardHeader>

         <Separator />

         {showEditor ? (
            <NavbarEditor navbar={navbar} />
         ) : (
            <CardContent className="space-y-6 p-5">
               <div>
                  <p className="text-muted-foreground mb-1 text-sm">{settings.before_login}</p>
                  <NavbarPreview auth={false} navbar={navbar} />
               </div>

               <div>
                  <p className="text-muted-foreground mb-1 text-sm">{settings.after_login}</p>
                  <NavbarPreview auth={true} navbar={navbar} />
               </div>
            </CardContent>
         )}
      </Card>
   );
};

export default Navbar;
