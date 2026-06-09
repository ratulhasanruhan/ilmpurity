import InputError from '@/components/input-error';
import LoadingButton from '@/components/loading-button';
import { theme } from '@/components/text-editor/source-editor/theme';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SharedData } from '@/types/global';
import { autocompletion, closeBrackets, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { css } from '@codemirror/lang-css';
import { bracketMatching } from '@codemirror/language';
import { highlightSelectionMatches } from '@codemirror/search';
import { EditorState } from '@codemirror/state';
import { EditorView, highlightActiveLine, highlightActiveLineGutter, keymap, lineNumbers } from '@codemirror/view';
import { useForm, usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { SystemProps } from '..';

const Style = () => {
   const { props } = usePage<SharedData & SystemProps>();
   const { translate } = props;
   const { settings, button } = translate;
   const initialFields = props.system.fields as SystemFields;

   const { data, setData, post, errors, processing } = useForm({
      ...(props.system.fields as SystemFields),
      global_style: initialFields.global_style,
   });

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      post(route('settings.system.update', { id: props.system.id }), {
         showProgress: false,
         preserveScroll: true,
      });
   };

   // CodeMirror editor for CSS content
   const editorRef = useRef<HTMLDivElement>(null);
   const viewRef = useRef<EditorView | null>(null);

   useEffect(() => {
      if (!editorRef.current) return;

      const startDoc = (data.global_style as string) || '';

      const state = EditorState.create({
         doc: startDoc,
         extensions: [
            lineNumbers(),
            highlightActiveLine(),
            highlightActiveLineGutter(),
            css(),
            theme,
            history(),
            bracketMatching(),
            closeBrackets(),
            autocompletion(),
            highlightSelectionMatches(),
            keymap.of([...defaultKeymap, ...historyKeymap, ...completionKeymap, ...closeBracketsKeymap]),
            EditorView.updateListener.of((v) => {
               if (v.docChanged) {
                  const value = v.state.doc.toString();
                  setData('global_style', value);
               }
            }),
            EditorView.lineWrapping,
         ],
      });

      const view = new EditorView({ state, parent: editorRef.current });
      viewRef.current = view;

      return () => view.destroy();
   }, [editorRef]);

   return (
      <Card>
         <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2">{settings.custom_global_style}</CardTitle>
            <CardDescription className="hidden sm:block">{settings.css_description}</CardDescription>
         </CardHeader>

         <Separator />

         <CardContent className="p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
               {/* CSS Editor */}
               <div>
                  {/* Fix focus area: set fixed height so editor fills the box; click-to-focus wrapper */}
                  <div
                     ref={editorRef}
                     className="h-[420px] w-full rounded-md border"
                     onMouseDown={(e) => {
                        // If click is not handled by the editor (e.g., on padding/edges), ensure focus
                        // We allow CodeMirror internal handling when the target is inside .cm-editor
                        const target = e.target as HTMLElement;
                        if (!target.closest('.cm-editor')) {
                           e.preventDefault();
                           viewRef.current?.focus();
                        }
                     }}
                  />

                  <InputError message={errors.global_style} />
               </div>

               <div className="flex justify-end">
                  <LoadingButton loading={processing} type="submit">
                     {button.save_changes}
                  </LoadingButton>
               </div>
            </form>
         </CardContent>
      </Card>
   );
};

export default Style;
