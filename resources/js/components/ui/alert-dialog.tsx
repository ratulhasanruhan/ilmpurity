import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

interface AlertDialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface AlertDialogActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

interface AlertDialogCancelProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const AlertDialog: React.FC<AlertDialogProps> = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/80" 
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-50">
        {children}
      </div>
    </div>
  );
};

const AlertDialogContent: React.FC<AlertDialogContentProps> = ({ className, children, ...props }) => (
  <div
    className={cn(
      "w-full max-w-lg bg-white border rounded-lg shadow-lg p-6 space-y-4",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

const AlertDialogHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ 
  className, 
  children, 
  ...props 
}) => (
  <div
    className={cn("space-y-2", className)}
    {...props}
  >
    {children}
  </div>
);

const AlertDialogFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ 
  className, 
  children, 
  ...props 
}) => (
  <div
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
    {...props}
  >
    {children}
  </div>
);

const AlertDialogTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ 
  className, 
  children, 
  ...props 
}) => (
  <h2
    className={cn("text-lg font-semibold", className)}
    {...props}
  >
    {children}
  </h2>
);

const AlertDialogDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ 
  className, 
  children, 
  ...props 
}) => (
  <p
    className={cn("text-sm text-gray-600", className)}
    {...props}
  >
    {children}
  </p>
);

const AlertDialogAction: React.FC<AlertDialogActionProps> = ({ 
  className, 
  children, 
  ...props 
}) => (
  <Button
    className={cn("", className)}
    {...props}
  >
    {children}
  </Button>
);

const AlertDialogCancel: React.FC<AlertDialogCancelProps> = ({ 
  className, 
  children, 
  ...props 
}) => (
  <Button
    variant="outline"
    className={cn("mt-2 sm:mt-0", className)}
    {...props}
  >
    {children}
  </Button>
);

// For compatibility, create empty components for unused exports
const AlertDialogTrigger = () => null;
const AlertDialogPortal = () => null;
const AlertDialogOverlay = () => null;

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}