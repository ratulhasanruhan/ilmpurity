import '../tiptap-editor/styles/index.css';

import { components } from './components/custom';
import { createProcessor } from './utils/processor';

interface TiptapRendererProps {
   children: string;
}

const TiptapRenderer = ({ children }: TiptapRendererProps) => {
   const processor = createProcessor({ components });
   const processed = processor.processSync(children);

   return <div className="tiptap ProseMirror !py-0">{processed.result}</div>;
};

export default TiptapRenderer;
