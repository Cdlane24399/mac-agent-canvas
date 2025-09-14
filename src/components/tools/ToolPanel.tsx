import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import RealTerminalTool from "./RealTerminalTool";
import AgentEditorTool from "./AgentEditorTool";
import RealBrowserTool from "./RealBrowserTool";
import RealSearchTool from "./RealSearchTool";
import AgentFilesTool from "./AgentFilesTool";

interface ActiveTool {
  id: string;
  type: 'terminal' | 'editor' | 'browser' | 'search' | 'files';
  messageId: string;
}

interface ToolPanelProps {
  activeTool: ActiveTool;
  onClose: () => void;
}

const toolNames = {
  terminal: "Live Terminal",
  editor: "Code Editor", 
  browser: "Live Browser",
  search: "Web Search",
  files: "File Manager"
};

export default function ToolPanel({ activeTool, onClose }: ToolPanelProps) {
  if (!activeTool) return null;

  const renderToolComponent = () => {
    switch (activeTool.type) {
      case 'terminal':
        return <RealTerminalTool />;
      case 'editor':
        return <AgentEditorTool />;
      case 'browser':
        return <RealBrowserTool />;
      case 'search':
        return <RealSearchTool />;
      case 'files':
        return <AgentFilesTool />;
      default:
        return <div className="p-4 text-center text-muted-foreground">Tool not found</div>;
    }
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      className="w-96 bg-background border-l border-border flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="font-medium text-foreground">{toolNames[activeTool.type]}</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Tool Content */}
      <div className="flex-1 overflow-hidden">
        <div className="p-4 h-full">
          {renderToolComponent()}
        </div>
      </div>
    </motion.div>
  );
}