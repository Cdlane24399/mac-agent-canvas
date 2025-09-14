import { motion } from "framer-motion";
import { Bot, Zap } from "lucide-react";

interface AICalloutProps {
  message: string;
  action?: string;
  isThinking?: boolean;
}

export default function AICallout({ message, action, isThinking = false }: AICalloutProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="ai-callout flex items-start gap-3"
    >
      <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
        {isThinking ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Zap className="w-4 h-4 text-primary-foreground" />
          </motion.div>
        ) : (
          <Bot className="w-4 h-4 text-primary-foreground" />
        )}
      </div>
      
      <div className="flex-1">
        <div className="text-sm font-medium text-foreground">
          {isThinking ? "AI Agent Thinking..." : "AI Agent"}
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          {message}
        </div>
        {action && (
          <div className="text-xs text-primary mt-2 font-medium">
            → {action}
          </div>
        )}
      </div>
    </motion.div>
  );
}