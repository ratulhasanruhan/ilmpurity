import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useLang } from '@/hooks/use-lang';
import { ReactNode } from 'react';
import { SectionEditorProvider, useSectionEditor } from './context';
import EditorForm from './form';

interface Props {
   section: PageSection;
   actionComponent: ReactNode;
}

const SectionEditor = ({ section, actionComponent }: Props) => {
   return (
      <SectionEditorProvider section={section}>
         <SectionEditorContent actionComponent={actionComponent} />
      </SectionEditorProvider>
   );
};

// Separate component to use the context
const SectionEditorContent = ({ actionComponent }: { actionComponent: ReactNode }) => {
   const { button, frontend } = useLang();
   const { open, setOpen, isSubmit, section } = useSectionEditor();

   return (
      <Dialog open={open} onOpenChange={(value) => !isSubmit && setOpen(value)}>
         <DialogTrigger asChild>{actionComponent}</DialogTrigger>

         <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
               <DialogTitle className="text-lg font-medium">
                  {button.update} {section.name} {frontend.section}
               </DialogTitle>
            </DialogHeader>

            <EditorForm />
         </DialogContent>
      </Dialog>
   );
};

export default SectionEditor;
