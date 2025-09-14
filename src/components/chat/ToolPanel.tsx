import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import AgentTerminalTool from "@/components/tools/AgentTerminalTool";
import AgentEditorTool from "@/components/tools/AgentEditorTool";
import AgentBrowserTool from "@/components/tools/AgentBrowserTool";
import AgentSearchTool from "@/components/tools/AgentSearchTool";
import AgentFilesTool from "@/components/tools/AgentFilesTool";

interface ActiveTool {
  id: string;
  type: 'terminal' | 'editor' | 'browser' | 'search' | 'files';
  messageId: string;
}

interface ToolPanelProps {
  activeTool: ActiveTool | null;
  onClose: () => void;
}

const toolNames = {
  terminal: "Terminal",
  editor: "Code Editor", 
  browser: "Web Browser",
  search: "Web Search",
  files: "File Manager"
};

export default function ToolPanel({ activeTool, onClose }: ToolPanelProps) {
  if (!activeTool) return null;

  const renderToolComponent = (tool: ActiveTool) => {
    switch (tool.type) {
      case 'terminal':
        return <AgentTerminalTool />;
      case 'editor':
        return <AgentEditorTool />;
      case 'browser':
        return <AgentBrowserTool />;
      case 'search':
        return <AgentSearchTool />;
      case 'files':
        return <AgentFilesTool />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="w-[480px] h-full bg-background flex flex-col p-6"
    >
      {/* Tool Container */}
      <div className="h-full bg-background rounded-2xl border border-border flex flex-col overflow-hidden">
        {/* Tool Header */}
        <div className="flex items-center justify-between p-4">
          <h3 className="font-semibold text-foreground">{toolNames[activeTool.type]}</h3>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Tool Content */}
        <div className="flex-1 overflow-hidden">
          {renderToolComponent(activeTool)}
        </div>
      </div>
    </motion.div>
  );
}