import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/layout/Sidebar";
import ChatTool from "@/components/tools/ChatTool";
import TerminalTool from "@/components/tools/TerminalTool";
import EditorTool from "@/components/tools/EditorTool";
import BrowserTool from "@/components/tools/BrowserTool";
import SearchTool from "@/components/tools/SearchTool";
import FilesTool from "@/components/tools/FilesTool";
import { useAgent } from "@/hooks/useAgent";

const tools = {
  chat: ChatTool,
  terminal: TerminalTool,
  editor: EditorTool,
  browser: BrowserTool,
  search: SearchTool,
  files: FilesTool,
};

export default function AgenticApp() {
  const [activeToolId, setActiveToolId] = useState('chat');
  const { state: agentState, processUserRequest } = useAgent();

  const handleToolSelect = useCallback((toolId: string) => {
    setActiveToolId(toolId);
  }, []);

  const handleChatMessage = useCallback(async (toolId: string) => {
    // When AI suggests a tool, switch to it
    setActiveToolId(toolId);
  }, []);

  const ActiveTool = tools[activeToolId as keyof typeof tools];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <Sidebar 
        activeToolId={activeToolId}
        onToolSelect={handleToolSelect}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Status Bar */}
        <div className="h-12 bg-muted/50 border-b border-border flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h1 className="font-semibold text-foreground">
              Agentic AI Workspace
            </h1>
            <div className="text-sm text-muted-foreground">
              {activeToolId.charAt(0).toUpperCase() + activeToolId.slice(1)} Tool Active
            </div>
          </div>
          
          {agentState.isProcessing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 text-sm text-primary"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full"
              />
              AI Processing...
            </motion.div>
          )}
        </div>

        {/* Tool Container */}
        <div className="flex-1 p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeToolId}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <ActiveTool 
                isActive={true}
                onMessage={activeToolId === 'chat' ? handleChatMessage : undefined}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}