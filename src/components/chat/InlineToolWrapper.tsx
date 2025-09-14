import { motion } from "framer-motion";
import { X, Minimize2, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface InlineToolWrapperProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClose?: () => void;
  defaultMinimized?: boolean;
}

export default function InlineToolWrapper({ 
  title, 
  icon, 
  children, 
  onClose,
  defaultMinimized = false 
}: InlineToolWrapperProps) {
  const [isMinimized, setIsMinimized] = useState(defaultMinimized);

  return (
    <div className="my-3 max-w-2xl space-y-2">
      {/* Tool Header Bubble */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted/50 border border-border rounded-full shadow-sm"
      >
        {icon}
        <span className="text-xs font-medium text-foreground">AI Agent: {title}</span>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-muted-foreground">Working...</span>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMinimized(!isMinimized)}
          className="h-5 w-5 p-0 ml-1 text-muted-foreground hover:text-foreground"
        >
          {isMinimized ? (
            <Maximize2 className="w-2.5 h-2.5" />
          ) : (
            <Minimize2 className="w-2.5 h-2.5" />
          )}
        </Button>
      </motion.div>

      {/* Tool Content */}
      <motion.div
        initial={false}
        animate={{ 
          height: isMinimized ? 0 : "auto",
          opacity: isMinimized ? 0 : 1 
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-border rounded-xl overflow-hidden bg-card shadow-sm"
        >
          <div className="p-3 max-h-64 overflow-hidden">
            {children}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}