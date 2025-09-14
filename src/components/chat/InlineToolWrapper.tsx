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
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="my-4 border border-border rounded-2xl overflow-hidden bg-card shadow-lg"
    >
      {/* Tool Header */}
      <div className="flex items-center justify-between p-3 bg-muted/50 border-b border-border">
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-medium text-foreground">{title}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(!isMinimized)}
            className="h-7 w-7 p-0"
          >
            {isMinimized ? (
              <Maximize2 className="w-3 h-3" />
            ) : (
              <Minimize2 className="w-3 h-3" />
            )}
          </Button>
          
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>

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
        <div className="p-4">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}