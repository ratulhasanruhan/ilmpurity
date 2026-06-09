import ChunkedUploaderInput from '@/components/chunked-uploader-input';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

interface Props {
   data: any;
   errors: any;
   setData: (key: string, value: any) => void;
   isSubmit: boolean;
   setIsFileSelected: (value: boolean) => void;
   setIsFileUploaded: (value: boolean) => void;
   setIsSubmit: (value: boolean) => void;
}

const ListeningForm = ({ data, setData, errors, isSubmit, setIsFileSelected, setIsFileUploaded, setIsSubmit }: Props) => {
   const [audioSource, setAudioSource] = useState<'url' | 'upload'>(data.options?.audio_source || 'url');

   const updateAudioSource = (source: 'url' | 'upload') => {
      setAudioSource(source);
      setData('options', {
         ...data.options,
         audio_source: source,
         audio_url: source === 'url' ? data.options?.audio_url || '' : '',
      });
   };

   return (
      <div className="space-y-4">
         <div>
            <Label>Instructions</Label>
            <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-900">
               <p className="mb-1 font-medium">How listening questions work:</p>
               <p>• Upload or link to an audio file</p>
               <p>• Students listen to the audio and answer the question</p>
               <p>• You can use multiple choice options or short answer</p>
            </div>
         </div>

         <div>
            <Label>Audio Source</Label>
            <RadioGroup value={audioSource} onValueChange={(value: 'url' | 'upload') => updateAudioSource(value)} className="flex gap-4 pt-2">
               <div className="flex items-center space-x-2">
                  <RadioGroupItem value="url" id="url" />
                  <Label htmlFor="url" className="cursor-pointer font-normal">
                     Audio URL
                  </Label>
               </div>
               <div className="flex items-center space-x-2">
                  <RadioGroupItem value="upload" id="upload" />
                  <Label htmlFor="upload" className="cursor-pointer font-normal">
                     Upload File
                  </Label>
               </div>
            </RadioGroup>
         </div>

         {audioSource === 'url' ? (
            <div>
               <Label>Audio URL *</Label>
               <Input
                  type="url"
                  placeholder="https://example.com/audio.mp3"
                  value={data.options?.audio_url || ''}
                  onChange={(e) =>
                     setData('options', {
                        ...data.options,
                        audio_url: e.target.value,
                     })
                  }
               />
               <p className="mt-1 text-xs text-gray-500">Direct link to an audio file (mp3, wav, ogg)</p>
            </div>
         ) : (
            <div className="space-y-3">
               <div>
                  <Label>Upload Audio File *</Label>
                  <ChunkedUploaderInput
                     isSubmit={isSubmit}
                     filetype="audio"
                     delayUpload={true}
                     onFileSelected={(file) => {
                        setIsFileSelected(true); // Mark that a new file was selected (parent state)
                     }}
                     onFileUploaded={(fileData) => {
                        setIsFileUploaded(true);
                        setData('options', {
                           ...data.options,
                           new_audio_url: fileData.file_url,
                        });
                     }}
                     onError={(errors) => {
                        setIsSubmit(false);
                        setIsFileSelected(false);
                     }}
                     onCancelUpload={() => {
                        setIsSubmit(false);
                        setIsFileSelected(false);
                     }}
                  />
                  <p className="mt-1 text-xs text-gray-500">Supported formats: MP3, WAV, OGG (Max 100MB)</p>
               </div>
            </div>
         )}

         <div>
            <Label>Answer Instructions</Label>
            <Textarea
               placeholder="What should students answer after listening? (e.g., 'Summarize the main points' or 'Answer the following questions')"
               rows={3}
               value={data.options?.instructions || ''}
               onChange={(e) =>
                  setData('options', {
                     ...data.options,
                     instructions: e.target.value,
                  })
               }
            />
         </div>

         <InputError message={errors.options} />
      </div>
   );
};

export default ListeningForm;
