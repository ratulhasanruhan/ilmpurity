import InputError from '@/components/input-error';
import { cn } from '@/lib/utils';
import Tagify from '@yaireo/tagify';
import '@yaireo/tagify/dist/tagify.css';
import { useEffect, useRef, useState } from 'react';

interface Props {
   value?: string;
   maxTags?: number;
   whitelist?: string[];
   placeholder?: string;
   onChange?: (values: string[]) => void;
   enforceWhitelist?: boolean;
   defaultTags?: string[];
   className?: string;
}

const TagInput = (props: Props) => {
   const { value, onChange, placeholder, whitelist, maxTags, enforceWhitelist, defaultTags, className } = props;

   const tagRef = useRef<any>(null);
   const inputRef = useRef<HTMLInputElement>(null);
   const [errorMessage, setErrorMessage] = useState<string>('');

   useEffect(() => {
      if (inputRef.current) {
         // Destroy existing instance if it exists
         if (tagRef.current) {
            tagRef.current.destroy();
         }

         tagRef.current = new Tagify(inputRef.current, {
            maxTags: maxTags || 10,
            whitelist: whitelist || [],
            dropdown: { enabled: 1 },
            enforceWhitelist: enforceWhitelist || false,
            callbacks: {
               change: (e: any) => {
                  const tags = e.detail.tagify.value.map((tag: any) => tag.value);
                  onChange?.(tags);
                  setErrorMessage('');
               },
               invalid: (e: any) => {
                  setErrorMessage(e.detail.message);
               },
            },
            texts: {
               empty: 'Tag field is required',
               exceed: 'Maximum number of tags exceeded',
               pattern: 'The tag is invalid',
               duplicate: 'Tag is already exists',
            },
            // Allow more flexible pattern - letters, numbers, spaces, and common punctuation
            pattern: /^.{1,}$/,
         });
      }

      return () => {
         if (tagRef.current) {
            tagRef.current.destroy();
            tagRef.current = null;
         }
      };
   }, [whitelist, enforceWhitelist, maxTags]);

   // Handle defaultTags changes separately to avoid full re-initialization
   useEffect(() => {
      if (tagRef.current && defaultTags) {
         // Get current tags
         const currentTags = tagRef.current.value.map((tag: any) => tag.value);
         const newTags = defaultTags.filter((tag: string) => tag && tag.trim() !== '');

         // Only update if tags are different
         if (JSON.stringify(currentTags) !== JSON.stringify(newTags)) {
            tagRef.current.removeAllTags();
            if (newTags.length > 0) {
               tagRef.current.addTags(newTags);
            }
         }
      }
   }, [defaultTags]);

   return (
      <div className="w-full [&>tags]:!h-auto">
         <input
            ref={inputRef}
            defaultValue={value || ''}
            placeholder={placeholder || 'Enter tags...'}
            className={cn(
               'border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
               'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
               'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
               className,
            )}
         />

         {errorMessage && <InputError message={errorMessage} />}
      </div>
   );
};

export default TagInput;
