import { ChangeEvent } from 'react';

export const onHandleChange = (
   event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
   setData: (key: string, value: unknown) => void,
   setPreview?: (value: string) => void,
) => {
   const target = event.target as HTMLInputElement;

   if (target.type === 'file') {
      const files = target.files;
      if (files && files[0]) {
         setData(target.name, files[0]);
         setPreview?.(URL.createObjectURL(files[0]));
      }
   } else {
      setData(target.name, target.value);
   }
};
