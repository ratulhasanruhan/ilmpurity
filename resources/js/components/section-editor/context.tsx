import React, { createContext, ReactNode, useContext, useState } from 'react';

interface SectionEditorContextType {
   section: PageSection;

   // Dialog state
   open: boolean;
   setOpen: (value: boolean) => void;

   // Form submission state
   isSubmit: boolean;
   setIsSubmit: (value: boolean) => void;
}

const SectionEditorContext = createContext<SectionEditorContextType | undefined>(undefined);

interface SectionEditorProviderProps {
   children: ReactNode;
   section: PageSection;
   onSuccess?: () => void;
   onError?: (errors: any) => void;
}

export const SectionEditorProvider: React.FC<SectionEditorProviderProps> = ({ children, section, onSuccess, onError }) => {
   // Dialog state
   const [open, setOpen] = useState(false);

   // Form submission state
   const [isSubmit, setIsSubmit] = useState(false);

   const contextValue: SectionEditorContextType = {
      section,
      // Dialog state
      open,
      setOpen,

      // Form submission state
      isSubmit,
      setIsSubmit,
   };

   return <SectionEditorContext.Provider value={contextValue}>{children}</SectionEditorContext.Provider>;
};

// Custom hook to use the context
export const useSectionEditor = () => {
   const context = useContext(SectionEditorContext);
   if (context === undefined) {
      throw new Error('useSectionEditor must be used within a SectionEditorProvider');
   }
   return context;
};
