'use client';

import '../tiptap-editor/styles/index.css';

import { createElement, Fragment, useEffect, useState } from 'react';
import { components } from './components/custom';
import { createProcessor } from './utils/processor';

interface TiptapRendererProps {
   children: string;
}

const TiptapRenderer = ({ children }: TiptapRendererProps) => {
   const [Content, setContent] = useState(createElement(Fragment));

   useEffect(
      function () {
         (async function () {
            const processor = createProcessor({ components });
            const output = await processor.process(children);

            setContent(output.result);
         })();
      },
      [children],
   );

   return <div className="tiptap ProseMirror !py-0">{Content}</div>;
};

export default TiptapRenderer;
