import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const BackupDownloader = ({ backup }: { backup: ApplicationBackup }) => {
   const handleDownload = async (id: number | string) => {
      try {
         // Show loading state
         const downloadBtn = document.getElementById(`download-btn-${id}`);
         if (downloadBtn) {
            // downloadBtn.disabled = true;
            downloadBtn.innerHTML = '<span class="animate-spin mr-1">↻</span> Downloading...';
         }

         // Trigger file download
         const response = await fetch(`/system/backup/${id}/download`, {
            method: 'GET',
            headers: {
               Accept: 'application/zip',
               'X-Requested-With': 'XMLHttpRequest',
               'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
            },
         });

         if (!response.ok) {
            throw new Error('Download failed');
         }

         // Get the filename from content-disposition header
         const contentDisposition = response.headers.get('content-disposition');
         const filename = contentDisposition ? contentDisposition.split('filename=')[1].replace(/"/g, '') : `backup_${id}.zip`;

         // Create blob and download
         const blob = await response.blob();
         const url = window.URL.createObjectURL(blob);
         const a = document.createElement('a');
         a.href = url;
         a.download = filename;
         document.body.appendChild(a);
         a.click();

         // Cleanup
         window.URL.revokeObjectURL(url);
         document.body.removeChild(a);
      } catch (error) {
         console.error('Download failed:', error);
         alert('Failed to download backup. Please try again.');
      } finally {
         // Reset button state
         const downloadBtn = document.getElementById(`download-btn-${id}`);
         if (downloadBtn) {
            // downloadBtn.disabled = false;
            downloadBtn.innerHTML =
               '<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg><span class="ml-1">Download</span>';
         }
      }
   };

   return (
      // Update your button JSX:
      <Button id={`download-btn-${backup.id}`} variant="ghost" onClick={() => handleDownload(backup.id)}>
         <Download className="h-4 w-4" />
         <span className="text-sm">Download</span>
      </Button>
   );
};

export default BackupDownloader;
