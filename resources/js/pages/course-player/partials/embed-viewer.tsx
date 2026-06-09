import { HTMLAttributes, useEffect, useRef } from 'react';

interface Props extends HTMLAttributes<HTMLIFrameElement> {
   src: string;
}

const EmbedViewer = (props: Props) => {
   const containerRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      if (!containerRef.current) return;

      const iframe = containerRef.current.querySelector('iframe');
      if (iframe) {
         iframe.style.width = '100%';
         iframe.style.height = '100%';
         iframe.style.border = 'none';
      }
   }, [props.src]);

   return (
      <div
         ref={containerRef}
         className="relative h-full w-full overflow-hidden"
         dangerouslySetInnerHTML={{
            __html: props.src || '',
         }}
      />
   );
};

export default EmbedViewer;
