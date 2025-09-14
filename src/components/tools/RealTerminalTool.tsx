import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Terminal, AlertCircle, Play, CheckCircle2, Zap } from "lucide-react";
import { useTerminal } from "@/hooks/useTerminal";
import { Button } from "@/components/ui/button";

export default function RealTerminalTool() {
  const [currentCommand, setCurrentCommand] = useState("");
  const { 
    session, 
    commands, 
    isLoading, 
    error, 
    createSession, 
    executeCommand, 
    closeSession, 
    clearError,
    hasActiveSession 
  } = useTerminal();
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-create session when component mounts
    if (!hasActiveSession && !session) {
      handleCreateSession();
    }
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new commands are added
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [commands]);

  const handleCreateSession = async () => {
    clearError();
    await createSession();
  };

  const handleExecuteCommand = async () => {
    if (!currentCommand.trim()) return;
    
    clearError();
    await executeCommand(currentCommand);
    setCurrentCommand("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleExecuteCommand();
    }
  };

  return (
    <div className="h-full flex flex-col font-mono">
      {/* Header */}
      <div className="flex items-center gap-2 p-3 border-b border-border">
        <Zap className="w-4 h-4 text-primary" />
        <span className="font-medium text-sm">Execute Command</span>
        {session && (
          <div className="flex items-center gap-1 ml-auto">
            <CheckCircle2 className="w-3 h-3 text-green-500" />
            <span className="text-xs text-green-500 font-normal">Command executed successfully</span>
          </div>
        )}
      </div>

      {/* Session Status */}
      <div className="p-3 border-b border-border">
        <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
          <Terminal className="w-4 h-4 text-primary" />
          <div className="flex-1">
            <div className="text-sm font-medium">Terminal</div>
            <div className="text-xs text-muted-foreground">
              {session ? `Session: ${session.sessionId.slice(0, 8)}...` : 'No active session'}
            </div>
          </div>
          {!session && (
            <Button
              onClick={handleCreateSession}
              disabled={isLoading}
              size="sm"
              className="h-7 px-3 text-xs"
            >
              Create Session
            </Button>
          )}
        </div>
      </div>

      {/* Terminal Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Error Display */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive border-b border-border">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Terminal Output */}
        <div className="flex-1 bg-black text-green-400 p-4 overflow-y-auto">
          <div className="space-y-3">
            {commands.map((cmd, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                {/* Command */}
                <div className="flex items-center gap-2">
                  <span className="text-blue-400 text-sm">root@4f645270-eac0-472f-aec2-c9a62bed9780</span>
                  <span className="text-white">:</span>
                  <span className="text-blue-400">/workspace</span>
                  <span className="text-white">$</span>
                  <span className="text-green-400 font-medium">{cmd.command}</span>
                </div>

                {/* Output */}
                {cmd.output && (
                  <div className="text-gray-300 whitespace-pre-wrap text-sm leading-relaxed ml-4 bg-gray-900/50 p-2 rounded border-l-2 border-green-400/30">
                    {cmd.output}
                  </div>
                )}

                {/* Error */}
                {cmd.error && (
                  <div className="text-red-400 whitespace-pre-wrap text-sm leading-relaxed ml-4 bg-red-900/20 p-2 rounded border-l-2 border-red-400/50">
                    {cmd.error}
                  </div>
                )}

                {/* Execution Info */}
                <div className="text-gray-500 text-xs ml-4 flex items-center gap-4">
                  <span>Exit code: {cmd.exitCode}</span>
                  <span>•</span>
                  <span>Execution time: {cmd.executionTime}ms</span>
                </div>
              </motion.div>
            ))}

            {/* Current Input */}
            {session && (
              <div className="flex items-center gap-2 mt-4">
                <span className="text-blue-400 text-sm">root@4f645270-eac0-472f-aec2-c9a62bed9780</span>
                <span className="text-white">:</span>
                <span className="text-blue-400">/workspace</span>
                <span className="text-white">$</span>
                <input
                  type="text"
                  value={currentCommand}
                  onChange={(e) => setCurrentCommand(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter command..."
                  disabled={isLoading || !session}
                  className="flex-1 bg-transparent border-none outline-none text-green-400 text-sm ml-2"
                />
                {isLoading && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="text-green-400 text-sm"
                  >
                    |
                  </motion.span>
                )}
              </div>
            )}

            <div ref={terminalEndRef} />
          </div>
        </div>

        {/* Command Input Bar */}
        {session && (
          <div className="p-3 border-t border-border bg-muted/20">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Terminal className="w-3 h-3" />
                <span>Command</span>
              </div>
              <div className="flex-1 flex items-center gap-2">
                <input
                  type="text"
                  value={currentCommand}
                  onChange={(e) => setCurrentCommand(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a command..."
                  disabled={isLoading || !session}
                  className="flex-1 text-sm bg-background border border-border rounded px-2 py-1 outline-none focus:ring-1 focus:ring-primary"
                />
                <Button
                  onClick={handleExecuteCommand}
                  disabled={!currentCommand.trim() || isLoading || !session}
                  size="sm"
                  className="h-7 px-3"
                >
                  <Play className="w-3 h-3 mr-1" />
                  Run
                </Button>
              </div>
              <div className="text-xs text-muted-foreground">
                9/14/2025, 1:56:32 AM
              </div>
            </div>
          </div>
        )}

        {/* Session Status Footer */}
        {session && (
          <div className="p-2 bg-muted/10 border-t border-border">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Live E2B terminal session active</span>
              </div>
              <div className="flex items-center gap-2">
                <span>{commands.length}/32</span>
                <Button
                  onClick={closeSession}
                  variant="outline"
                  size="sm"
                  className="h-6 px-2 text-xs"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}