import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Terminal, AlertCircle, Play } from "lucide-react";
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
    <div className="font-mono text-xs">
      {/* Session Status */}
      <div className="flex items-center gap-2 mb-2 p-2 bg-muted/50 rounded">
        <Terminal className="w-3 h-3 text-primary" />
        <span className="text-xs">
          {session ? `Session: ${session.sessionId.slice(0, 8)}...` : 'No active session'}
        </span>
        {!session && (
          <Button
            onClick={handleCreateSession}
            disabled={isLoading}
            size="sm"
            className="h-5 px-2 text-xs"
          >
            Create Session
          </Button>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="flex items-center gap-2 p-2 bg-destructive/10 rounded text-destructive mb-2">
          <AlertCircle className="w-3 h-3" />
          <span className="text-xs">{error}</span>
        </div>
      )}

      {/* Terminal Output */}
      <div className="bg-terminal-bg text-terminal-text p-3 rounded-lg max-h-48 overflow-y-auto border">
        {commands.map((cmd, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3"
          >
            <div className="flex items-center gap-2 text-green-400">
              <span className="text-blue-400">$</span>
              <span className="text-white">{cmd.command}</span>
            </div>
            {cmd.output && (
              <div className="text-gray-300 whitespace-pre-wrap text-xs mt-1 ml-4">
                {cmd.output}
              </div>
            )}
            {cmd.error && (
              <div className="text-red-400 whitespace-pre-wrap text-xs mt-1 ml-4">
                {cmd.error}
              </div>
            )}
            <div className="text-gray-500 text-xs mt-1 ml-4">
              Exit code: {cmd.exitCode} | Execution time: {cmd.executionTime}ms
            </div>
          </motion.div>
        ))}

        {/* Current Input */}
        {session && (
          <div className="flex items-center gap-2">
            <span className="text-blue-400">$</span>
            <input
              type="text"
              value={currentCommand}
              onChange={(e) => setCurrentCommand(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter command..."
              disabled={isLoading || !session}
              className="flex-1 bg-transparent border-none outline-none text-white text-xs"
            />
            {isLoading && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="text-green-400"
              >
                |
              </motion.span>
            )}
            {currentCommand && !isLoading && (
              <Button
                onClick={handleExecuteCommand}
                size="sm"
                className="h-5 px-2 text-xs"
                disabled={!session}
              >
                <Play className="w-3 h-3" />
              </Button>
            )}
          </div>
        )}

        <div ref={terminalEndRef} />
      </div>

      {/* Session Info */}
      {session && (
        <div className="mt-2 text-xs text-muted-foreground flex items-center justify-between">
          <span>Live E2B terminal session active</span>
          <Button
            onClick={closeSession}
            variant="outline"
            size="sm"
            className="h-5 px-2 text-xs"
          >
            Close Session
          </Button>
        </div>
      )}
    </div>
  );
}