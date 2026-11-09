import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Props {
   data: any;
   setData: (key: string, value: any) => void;
}

const FileUploadForm = ({ data, setData }: Props) => {
   return (
      <div className="space-y-4">
         <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-900">
            <p className="mb-1 font-medium">Creative question (CQ)</p>
            <p>Students submit one image (JPG, PNG, WEBP) or a PDF. You review the file and assign marks.</p>
         </div>

         <div>
            <Label>Grading notes (optional)</Label>
            <Textarea
               rows={4}
               placeholder="What should a full-mark answer include?"
               value={data.options?.sample_answer || ''}
               onChange={(e) =>
                  setData('options', {
                     ...data.options,
                     sample_answer: e.target.value,
                  })
               }
            />
         </div>
      </div>
   );
};

export default FileUploadForm;
