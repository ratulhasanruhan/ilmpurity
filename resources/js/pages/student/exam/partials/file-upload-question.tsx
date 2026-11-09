import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import { FileText, Upload } from 'lucide-react';
import { useState } from 'react';

interface Props {
   attemptId: number | string;
   question: ExamQuestion;
   answer: any;
   onAnswerChange: (answer: any) => void;
}

const FileUploadQuestion = ({ attemptId, question, answer, onAnswerChange }: Props) => {
   const [uploading, setUploading] = useState(false);
   const [error, setError] = useState<string | null>(null);

   const handleFile = (file: File | null) => {
      if (!file) return;

      const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
      if (!allowed.includes(file.type)) {
         setError('Upload a JPG, PNG, WEBP image, or a PDF.');
         return;
      }

      if (file.size > 10 * 1024 * 1024) {
         setError('The file must be 10 MB or smaller.');
         return;
      }

      setError(null);
      setUploading(true);

      const payload = new FormData();
      payload.append('question_id', String(question.id));
      payload.append('file', file);

      router.post(route('exam-attempts.answer', attemptId), payload, {
         forceFormData: true,
         preserveScroll: true,
         preserveState: true,
         onSuccess: (page) => {
            const savedAttempt = page.props.attempt as ExamAttempt | undefined;
            const saved = savedAttempt?.attempt_answers?.find((item) => item.exam_question_id === question.id);
            onAnswerChange({
               ...(saved?.answer_data || {}),
               id: saved?.id,
               file_name: saved?.answer_data?.file_name || file.name,
               mime: saved?.answer_data?.mime || file.type,
               uploaded: true,
            });
         },
         onError: (errors) => {
            setError(errors.file || errors.question_id || 'The file could not be uploaded.');
         },
         onFinish: () => setUploading(false),
      });
   };

   return (
      <div className="space-y-4">
         <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
            Upload a photo of your written answer, or a PDF. JPG, PNG, WEBP, and PDF files up to 10 MB are accepted.
         </div>

         <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-8 text-center hover:bg-gray-100">
            <Upload className="mb-2 h-6 w-6 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">{uploading ? 'Uploading...' : 'Choose image or PDF'}</span>
            <input
               type="file"
               accept=".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf"
               className="hidden"
               disabled={uploading}
               onChange={(e) => handleFile(e.target.files?.[0] || null)}
            />
         </label>

         {(answer?.file_name || answer?.uploaded) && (
            <div className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800">
               <FileText className="h-4 w-4" />
               <span>{answer.file_name || 'Answer file uploaded'}</span>
            </div>
         )}

         {answer?.file_path && answer?.id && (
            <Button variant="outline" asChild>
               <a href={route('exam-attempts.answer-file', answer.id)} target="_blank" rel="noreferrer">
                  View uploaded file
               </a>
            </Button>
         )}

         {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
   );
};

export default FileUploadQuestion;
