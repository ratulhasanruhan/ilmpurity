import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
   plugins: [
      laravel({
         input: ['resources/css/app.css', 'resources/js/app.tsx'],
         ssr: 'resources/js/ssr.tsx',
         refresh: true,
      }),
      react(),
      tailwindcss(),
   ],
   esbuild: {
      jsx: 'automatic',
   },
   resolve: {
      alias: {
         'ziggy-js': resolve(__dirname, 'vendor/tightenco/ziggy'),
      },
   },
   build: {
      rollupOptions: {
         output: {
            manualChunks(id) {
               // Vendor libraries
               if (id.includes('node_modules')) {
                  if (id.includes('react') || id.includes('@inertiajs')) {
                     return 'vendor';
                  }
               }

               // // Only chunk large directories, not intro pages
               // if (id.includes('/pages/dashboard/')) {
               //    return 'pages-dashboard';
               // }
               // Let intro and inner pages remain as individual files
            },
         },
      },
      chunkSizeWarningLimit: 3000,
   },
});
