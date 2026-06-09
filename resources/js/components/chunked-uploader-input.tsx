import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { CheckCircle, Loader2 } from 'lucide-react';
import { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import InputError from './input-error';

interface ChunkedUploaderInputProps {
   storage?: 's3' | 'local';
   isSubmit: boolean;
   filetype: string;
   courseId?: string | number;
   sectionId?: string | number;
   delayUpload?: boolean;
   onError?: (message: string) => void;
   onCancelUpload?: () => void;
   onFileSelected?: (file: File) => void;
   onFileUploaded?: (fileData: any) => void;
}

export interface UploadedFileData {
   file_path: string;
   file_url: string;
   signed_url: string;
   mime_type: string;
   file_name: string;
   file_size: number;
}

const ChunkedUploaderInput: FC<ChunkedUploaderInputProps> = ({
   storage,
   isSubmit,
   courseId,
   sectionId,
   filetype,
   delayUpload = false,
   onError,
   onCancelUpload,
   onFileSelected,
   onFileUploaded,
}) => {
   // Use external file if provided, or manage internally
   const [file, setFile] = useState<File | null>(null);
   const [uploadId, setUploadId] = useState<number | null>(null);
   const [errorMessage, setErrorMessage] = useState<string>('');
   const [uploadProgress, setUploadProgress] = useState<number>(0);
   const [uploadStatus, setUploadStatus] = useState<'idle' | 'initializing' | 'uploading' | 'completing' | 'completed' | 'error'>('idle');

   const fileInputRef = useRef<HTMLInputElement>(null);
   const abortControllerRef = useRef<AbortController | null>(null);
   const maxFileSize = 1024 * 1024 * 1024;
   const chunkSize = 5 * 1024 * 1024;

   // Configure axios to automatically handle CSRF tokens
   useEffect(() => {
      // Set up axios defaults for CSRF protection
      axios.defaults.withCredentials = true;

      // Get CSRF token from cookie if available
      const token = document.cookie
         .split('; ')
         .find((row) => row.startsWith('XSRF-TOKEN='))
         ?.split('=')[1];

      if (token) {
         axios.defaults.headers.common['X-XSRF-TOKEN'] = decodeURIComponent(token);
      } else {
         // If no XSRF-TOKEN cookie, try to get it from meta tag as fallback
         const metaToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
         if (metaToken) {
            axios.defaults.headers.common['X-CSRF-TOKEN'] = metaToken;
         }
      }
   }, []);

   // Start upload automatically if external file is provided and delayUpload is false
   useEffect(() => {
      if (isSubmit) {
         initiateUpload();
      }
   }, [isSubmit]);

   const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files.length > 0) {
         const selectedFile = event.target.files[0];

         // Validate file size
         if (selectedFile.size > maxFileSize) {
            setErrorMessage(`File is too large. Maximum file size is ${maxFileSize / (1024 * 1024)} MB`);
            return;
         }

         setFile(selectedFile);
         setErrorMessage('');
         setUploadStatus('idle');
         setUploadProgress(0);

         // If using delayed upload, notify parent but don't upload yet
         if (delayUpload) {
            if (onFileSelected) {
               onFileSelected(selectedFile);
            }
         } else {
            // Upload immediately if not using delayed upload
            initiateUpload();
         }
      }
   };

   const initiateUpload = async () => {
      if (!file) return;

      setUploadStatus('initializing');
      setErrorMessage('');

      try {
         // Calculate total chunks
         const totalChunks = Math.ceil(file.size / chunkSize);

         // Initiate upload on the server
         const response = await axios.post(
            '/dashboard/uploads/chunked/initialize',
            {
               storage: storage,
               filename: file.name,
               mimetype: file.type,
               filesize: (file.size || 0) / 1024,
               filetype: filetype,
               total_chunks: totalChunks,
               course_id: courseId,
               course_section_id: sectionId,
            },
            {
               timeout: 120000, // 2 minutes timeout for initialization request
            },
         );

         if (response.data.success) {
            setUploadId(response.data.upload_id);
            await uploadChunks(response.data.upload_id, totalChunks);
         } else {
            throw new Error(response.data.message || 'Failed to initialize upload');
         }
      } catch (error: any) {
         setUploadStatus('error');
         setErrorMessage(error.response?.data?.message || error.message || 'Failed to initialize upload');
         if (onError) onError(error.response?.data?.message || error.message || 'Failed to initialize upload');
      }
   };

   const uploadChunks = async (uploadId: number, totalChunks: number) => {
      if (!file) return;

      setUploadStatus('uploading');

      // Create a new AbortController for this upload
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      try {
         const uploadedParts: { PartNumber: number; ETag: string }[] = [];
         let uploadedChunks = 0;

         // Process chunks sequentially to avoid overwhelming the server
         for (let chunkIndex = 0; chunkIndex < totalChunks && !signal.aborted; chunkIndex++) {
            const start = chunkIndex * chunkSize;
            const end = Math.min(start + chunkSize, file.size);
            const chunk = file.slice(start, end);

            // Convert chunk to base64 string instead of sending as file
            const reader = new FileReader();

            // Create a promise to handle FileReader async behavior
            const readChunk = new Promise<string>((resolve, reject) => {
               reader.onloadend = () => {
                  const base64data = reader.result as string;
                  resolve(base64data);
               };
               reader.onerror = () => reject(reader.error);
               reader.readAsDataURL(chunk);
            });

            // Wait for the chunk to be read as base64
            const base64data = await readChunk;

            // Send the chunk as base64 encoded data instead of FormData
            const response = await axios.post(
               `/dashboard/uploads/chunked/${uploadId}/chunk`,
               {
                  storage: storage,
                  chunk_data: base64data,
                  part_number: chunkIndex + 1,
                  filename: file.name,
                  mimetype: file.type,
               },
               {
                  signal: signal,
                  timeout: 120000, // 2 minute timeout for chunk uploads
                  maxContentLength: Infinity, // Allow large content
                  maxBodyLength: Infinity, // Allow large body
               },
            );

            if (response.data.success) {
               uploadedChunks++;
               const progress = Math.round((uploadedChunks / totalChunks) * 100);
               setUploadProgress(progress);

               uploadedParts.push({
                  PartNumber: chunkIndex + 1,
                  ETag: response.data.etag || '', // The server should return the ETag
               });
            } else {
               throw new Error(response.data.message || 'Failed to upload chunk');
            }
         }

         if (signal.aborted) {
            return; // Upload was cancelled
         }

         // Complete the upload
         await completeUpload(uploadId);
      } catch (error: any) {
         if (signal.aborted) {
            setUploadStatus('idle');
            setUploadProgress(0);
            return;
         }

         setUploadStatus('error');
         setErrorMessage(error.response?.data?.message || error.message || 'Failed to upload file chunks');
         if (onError) onError(error.response?.data?.message || error.message || 'Failed to upload file chunks');
      }
   };

   const completeUpload = async (uploadId: number) => {
      setUploadStatus('completing');

      try {
         const response = await axios.post(
            `/dashboard/uploads/chunked/${uploadId}/complete`,
            {
               storage: storage,
            },
            {
               timeout: 120000, // 2 minute timeout for completion request
            },
         );

         if (response.data.success) {
            setUploadStatus('completed');

            const fileData: UploadedFileData = {
               file_path: response.data.file_path,
               file_url: response.data.file_url,
               signed_url: response.data.signed_url,
               mime_type: response.data.mime_type,
               file_name: response.data.file_name,
               file_size: response.data.file_size,
            };

            onFileUploaded?.(fileData);

            // Reset the uploader state for potential future uploads
            setTimeout(() => {
               if (fileInputRef.current) fileInputRef.current.value = '';
               setFile(null);
               setUploadId(null);
               setUploadProgress(0);
               setUploadStatus('idle');
            }, 3000);
         } else {
            throw new Error(response.data.message || 'Failed to complete upload');
         }
      } catch (error: any) {
         setUploadStatus('error');
         setErrorMessage(error.response?.data?.message || error.message || 'Failed to complete upload');
         if (onError) onError(error.response?.data?.message || error.message || 'Failed to complete upload');
      }
   };

   const cancelUpload = async () => {
      if (uploadId && uploadStatus !== 'idle' && uploadStatus !== 'completed') {
         onCancelUpload?.();

         // Abort any in-progress network requests
         if (abortControllerRef.current) {
            abortControllerRef.current.abort();
         }

         try {
            // Inform the server to abort the multipart upload
            await axios.delete(`/dashboard/uploads/chunked/${uploadId}/abort`);
         } catch (error) {
            toast.error('Error aborting upload:' + error);
         }

         // Reset UI state
         setUploadStatus('idle');
         setUploadProgress(0);
         if (fileInputRef.current) fileInputRef.current.value = '';
         setFile(null);
      }
   };

   const renderStatus = () => {
      switch (uploadStatus) {
         case 'initializing':
            return (
               <div className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Initializing upload...
               </div>
            );
         case 'uploading':
            return (
               <div className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading file chunks...
               </div>
            );
         case 'completing':
            return (
               <div className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Finalizing upload...
               </div>
            );
         case 'completed':
            return (
               <div className="text-secondary-foreground flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Completed upload
               </div>
            );
         // case 'error':
         //    return (
         //       <div className="text-destructive flex items-center text-sm">
         //          <AlertCircle className="mr-2 h-4 w-4" />
         //          Error: {errorMessage}
         //       </div>
         //    );
         default:
            return null;
      }
   };

   return (
      <div>
         <div className="relative overflow-hidden rounded-sm">
            <Input
               type="file"
               name="file"
               onChange={(e) => {
                  handleFileChange(e);
                  const file = e.target.files?.[0];

                  if (file) {
                     setFile(file);
                     onFileSelected?.(file);
                  }
               }}
            />

            {uploadStatus === 'uploading' && file && (
               <div className="absolute top-0 left-0 z-10 flex h-full w-full items-center justify-between">
                  <div className="relative h-full w-full overflow-hidden bg-gray-200">
                     <div
                        className="bg-secondary absolute top-0 left-0 h-full transition-all duration-300 ease-in-out"
                        style={{ width: `${uploadProgress}%` }}
                     />
                     <div className="relative z-10 flex h-full items-center justify-between gap-2 px-2 text-xs">
                        <span>{uploadProgress}%</span>
                        {renderStatus()}
                        <span className="text-gray-800">Size: ({(file ? file.size / (1024 * 1024) : 0).toFixed(2)} MB)</span>
                     </div>
                  </div>

                  <div className="bg-gray-200">
                     <Button type="button" variant="destructive" onClick={cancelUpload} className="text-xs">
                        Cancel
                     </Button>
                  </div>
               </div>
            )}
         </div>

         {errorMessage && <InputError message={errorMessage} />}
      </div>
   );
};

export default ChunkedUploaderInput;
