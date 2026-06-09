import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import axios from 'axios';
import { AlertCircle, CheckCircle, Loader2, Upload, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface ChunkedUploaderProps {
   onFileUploaded: (fileData: UploadedFileData) => void;
   onError?: (error: string) => void;
   acceptedFileTypes?: string;
   maxFileSize?: number; // in bytes
   chunkSize?: number; // in bytes
   courseId?: number;
   sectionId?: number;
   type?: 'lesson' | 'attachment';
   buttonText?: string;
}

export interface UploadedFileData {
   file_path: string;
   signed_url: string;
   mime_type: string;
   file_name: string;
   file_size: number;
}

const ChunkedUploader: React.FC<ChunkedUploaderProps> = ({
   onFileUploaded,
   onError,
   acceptedFileTypes = '*/*', // Accept all file types by default
   maxFileSize = 1024 * 1024 * 512, // 512MB
   chunkSize = 5 * 1024 * 1024, // 5MB chunks - smaller chunks for better reliability
   courseId,
   sectionId,
   type = 'lesson',
   buttonText = 'Upload File',
}) => {
   const [file, setFile] = useState<File | null>(null);
   const [uploadId, setUploadId] = useState<number | null>(null);
   const [uploadProgress, setUploadProgress] = useState<number>(0);
   const [uploadStatus, setUploadStatus] = useState<'idle' | 'initializing' | 'uploading' | 'completing' | 'completed' | 'error'>('idle');
   const [errorMessage, setErrorMessage] = useState<string>('');
   const fileInputRef = useRef<HTMLInputElement>(null);
   const abortControllerRef = useRef<AbortController | null>(null);

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

   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files.length > 0) {
         const selectedFile = event.target.files[0];

         // Validate file type
         if (acceptedFileTypes && !acceptedFileTypes.split(',').some((type) => selectedFile.type.match(type.replace('*', '.*')))) {
            setErrorMessage(`File type not accepted. Please upload one of these types: ${acceptedFileTypes}`);
            return;
         }

         // Validate file size
         if (selectedFile.size > maxFileSize) {
            setErrorMessage(`File is too large. Maximum file size is ${maxFileSize / (1024 * 1024)} MB`);
            return;
         }

         setFile(selectedFile);
         setErrorMessage('');
         setUploadStatus('idle');
         setUploadProgress(0);
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
               filename: file.name,
               filesize: file.size,
               mimetype: file.type,
               total_chunks: totalChunks,
               type: type,
               course_id: courseId,
               course_section_id: sectionId,
            },
            {
               timeout: 60000, // 60 seconds timeout for initialization request
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
            {},
            {
               timeout: 60000, // 60 seconds timeout for completion request
            },
         );

         if (response.data.success) {
            setUploadStatus('completed');

            const fileData: UploadedFileData = {
               file_path: response.data.file_path,
               signed_url: response.data.signed_url,
               mime_type: response.data.mime_type,
               file_name: response.data.file_name,
               file_size: response.data.file_size,
            };

            onFileUploaded(fileData);

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
         // Abort any in-progress network requests
         if (abortControllerRef.current) {
            abortControllerRef.current.abort();
         }

         try {
            // Inform the server to abort the multipart upload
            await axios.delete(`/dashboard/uploads/chunked/${uploadId}/abort`);
         } catch (error) {
            // Error aborting upload
         }

         // Reset UI state
         setUploadStatus('idle');
         setUploadProgress(0);
         if (fileInputRef.current) fileInputRef.current.value = '';
         setFile(null);
      }
   };

   const triggerFileInput = () => {
      fileInputRef.current?.click();
   };

   const renderStatus = () => {
      switch (uploadStatus) {
         case 'initializing':
            return (
               <div className="text-muted-foreground flex items-center text-sm">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Initializing upload...
               </div>
            );
         case 'uploading':
            return (
               <div className="text-muted-foreground flex items-center text-sm">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading file chunks...
               </div>
            );
         case 'completing':
            return (
               <div className="text-muted-foreground flex items-center text-sm">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Finalizing upload...
               </div>
            );
         case 'completed':
            return (
               <div className="flex items-center text-sm text-green-600">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Upload completed successfully
               </div>
            );
         case 'error':
            return (
               <div className="text-destructive flex items-center text-sm">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Error: {errorMessage}
               </div>
            );
         default:
            return null;
      }
   };

   return (
      <Card className="mb-4">
         <CardContent className="p-6">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept={acceptedFileTypes} className="hidden" />

            <div className="flex flex-col gap-4">
               {file ? (
                  <>
                     <div>
                        <h4 className="text-sm font-medium">Selected File:</h4>
                        <p className="text-muted-foreground text-sm">
                           {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                        </p>
                     </div>

                     {uploadStatus !== 'idle' && uploadStatus !== 'completed' && (
                        <div className="space-y-2">
                           <Progress value={uploadProgress} className="h-2 w-full" />
                           <span className="text-muted-foreground text-xs">{uploadProgress}%</span>
                        </div>
                     )}

                     <div className="mt-2">{renderStatus()}</div>

                     <div className="mt-4 flex gap-2">
                        {uploadStatus === 'idle' && (
                           <Button onClick={initiateUpload} className="gap-2">
                              <Upload className="h-4 w-4" />
                              Start Upload
                           </Button>
                        )}

                        {(uploadStatus === 'uploading' || uploadStatus === 'initializing' || uploadStatus === 'completing') && (
                           <Button variant="destructive" onClick={cancelUpload} className="gap-2">
                              <X className="h-4 w-4" />
                              Cancel Upload
                           </Button>
                        )}

                        {(uploadStatus === 'idle' || uploadStatus === 'completed' || uploadStatus === 'error') && (
                           <Button variant="outline" onClick={triggerFileInput} className="gap-2">
                              Select Different File
                           </Button>
                        )}
                     </div>
                  </>
               ) : (
                  <Button onClick={triggerFileInput} className="gap-2">
                     <Upload className="h-4 w-4" />
                     {buttonText}
                  </Button>
               )}

               {errorMessage && uploadStatus === 'idle' && (
                  <Alert variant="destructive">
                     <AlertCircle className="h-4 w-4" />
                     <AlertTitle>Upload Error</AlertTitle>
                     <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
               )}
            </div>
         </CardContent>
      </Card>
   );
};

export default ChunkedUploader;
