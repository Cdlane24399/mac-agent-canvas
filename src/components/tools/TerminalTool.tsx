import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Terminal as TerminalIcon, Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ToolProps } from "@/types";

interface Command {
  command: string;
  output: string;
  timestamp: Date;
  isError?: boolean;
}

export default function TerminalTool({ isActive }: ToolProps) {
  const [commands, setCommands] = useState<Command[]>([
    {
      command: "echo 'Welcome to AI Terminal'",
      output: "Welcome to AI Terminal\nType commands to interact with your system.",
      timestamp: new Date(),
    }
  ]);
  const [currentCommand, setCurrentCommand] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commands]);

  const executeCommand = async () => {
    if (!currentCommand.trim() || isExecuting) return;
    
    setIsExecuting(true);
    const cmd = currentCommand.trim();
    
    // Simulate command execution
    const newCommand: Command = {
      command: cmd,
      output: await simulateCommand(cmd),
      timestamp: new Date(),
      isError: cmd.includes('error') || cmd.includes('fail')
    };
    
    setCommands(prev => [...prev, newCommand]);
    setCurrentCommand("");
    setIsExecuting(false);
  };

  const simulateCommand = async (cmd: string): Promise<string> => {
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    // Mock command responses
    if (cmd.startsWith('ls')) {
      return "Desktop\nDocuments\nDownloads\nMusic\nPictures\nVideos";
    } else if (cmd.startsWith('pwd')) {
      return "/Users/user";
    } else if (cmd.startsWith('whoami')) {
      return "user";
    } else if (cmd.startsWith('date')) {
      return new Date().toString();
    } else if (cmd.startsWith('echo')) {
      return cmd.substring(5).replace(/['"]/g, '');
    } else if (cmd === 'clear') {
      setCommands([]);
      return "";
    } else {
      return `Command executed: ${cmd}\n[Simulated output - Connect to real terminal for actual execution]`;
    }
  };

  const clearTerminal = () => {
    setCommands([]);
  };

  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="tool-panel h-full flex flex-col"
    >
      {/* Terminal Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Terminal</h2>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={clearTerminal}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Terminal Output */}
      <div 
        ref={terminalRef}
        className="terminal-container flex-1 p-4 font-mono text-sm overflow-y-auto max-h-96"
      >
        {commands.map((cmd, index) => (
          <div key={index} className="mb-3">
            <div className="flex items-center gap-2 text-terminal-text">
              <span className="text-primary">$</span>
              <span>{cmd.command}</span>
            </div>
            {cmd.output && (
              <div className={`mt-1 whitespace-pre-wrap ${
                cmd.isError ? 'text-destructive' : 'text-muted-foreground'
              }`}>
                {cmd.output}
              </div>
            )}
          </div>
        ))}
        
        {isExecuting && (
          <div className="flex items-center gap-2 text-terminal-text animate-pulse">
            <span className="text-primary">$</span>
            <span>Executing...</span>
          </div>
        )}
      </div>

      {/* Command Input */}
      <div className="flex items-center gap-2 mt-4">
        <span className="text-primary font-mono">$</span>
        <Input
          value={currentCommand}
          onChange={(e) => setCurrentCommand(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && executeCommand()}
          placeholder="Enter command..."
          disabled={isExecuting}
          className="flex-1 font-mono bg-muted border-border"
        />
        <Button 
          onClick={executeCommand}
          disabled={!currentCommand.trim() || isExecuting}
          size="sm"
          className="px-3"
        >
          <Play className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}