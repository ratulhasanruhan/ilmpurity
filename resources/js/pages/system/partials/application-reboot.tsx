import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { router, useForm } from '@inertiajs/react';
import { Power } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function ApplicationReboot() {
   const { post, processing } = useForm();

   const handleReboot: FormEventHandler = (e) => {
      e.preventDefault();

      post(route('system.reboot'));
   };

   return (
      <Card className="border-2">
         <CardHeader className="p-4 sm:p-6">
            <h2 className="flex items-center gap-2 text-xl font-semibold">
               <Power className="text-warning h-5 w-5" />
               Application Reboot
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">Reboot your application to apply changes</p>
         </CardHeader>

         <CardContent className="space-y-6 p-4 pt-0 sm:p-6 sm:pt-0">
            {/* Actions to be performed */}
            <Card className="border-yellow-200 bg-yellow-50">
               <CardHeader className="p-4">
                  <CardTitle className="text-lg text-yellow-900">System Operations</CardTitle>
                  <CardDescription className="text-yellow-700">The following operations will be performed:</CardDescription>
               </CardHeader>
               <CardContent className="space-y-2 p-4 text-sm text-yellow-800">
                  <div className="flex items-center gap-2">
                     <span className="font-semibold">1.</span>
                     <span>Clear and rebuild application cache, route, view and config</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <span className="font-semibold">5.</span>
                     <span>Bring application out of maintenance mode</span>
                  </div>
               </CardContent>
            </Card>

            {/* Reboot Button */}
            <div className="flex items-center gap-4">
               <form onSubmit={handleReboot} className="space-y-4">
                  <Button type="submit" className="bg-orange-600 text-white hover:bg-orange-700" disabled={processing}>
                     <Power className="h-4 w-4" />
                     {processing ? 'Rebooting System...' : 'Reboot System'}
                  </Button>
               </form>

               <Button onClick={() => router.post(route('system.reboot'))}>
                  <Power className="h-4 w-4" />
                  Clear System Cache
               </Button>
            </div>
         </CardContent>
      </Card>
   );
}
