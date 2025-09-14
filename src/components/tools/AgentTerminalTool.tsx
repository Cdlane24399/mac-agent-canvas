import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Command {
  command: string;
  output: string;
  timestamp: Date;
}

export default function AgentTerminalTool() {
  const [commands, setCommands] = useState<Command[]>([]);
  const [currentCommand, setCurrentCommand] = useState("");

  useEffect(() => {
    // Simulate agent running commands automatically
    const simulateAgentCommands = async () => {
      const agentCommands = [
        { cmd: "pwd", output: "/Users/user/project" },
        { cmd: "ls -la", output: "total 24\ndrwxr-xr-x  8 user  staff   256 Dec 14 10:30 .\ndrwxr-xr-x  3 user  staff    96 Dec 14 10:25 ..\n-rw-r--r--  1 user  staff  1024 Dec 14 10:30 package.json\n-rw-r--r--  1 user  staff  2048 Dec 14 10:30 src/\n-rw-r--r--  1 user  staff   512 Dec 14 10:30 README.md" },
        { cmd: "npm install", output: "Installing dependencies...\n✓ Installed 42 packages in 3.2s" },
        { cmd: "npm run build", output: "Building project...\n✓ Build completed successfully\n✓ Output: dist/" }
      ];

      for (let i = 0; i < agentCommands.length; i++) {
        const { cmd, output } = agentCommands[i];
        
        // Show command being typed
        setCurrentCommand(cmd);
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Execute command
        setCommands(prev => [...prev, {
          command: cmd,
          output,
          timestamp: new Date()
        }]);
        setCurrentCommand("");
        
        await new Promise(resolve => setTimeout(resolve, 1200));
      }
    };

    simulateAgentCommands();
  }, []);

  return (
    <div className="font-mono text-xs">
      <div className="bg-terminal-bg text-terminal-text p-3 rounded-lg max-h-48 overflow-y-auto">
        {commands.map((cmd, index) => (
          <div key={index} className="mb-2">
            <div className="flex items-center gap-2 text-green-400">
              <span>$</span>
              <span>{cmd.command}</span>
            </div>
            <div className="text-gray-300 whitespace-pre-wrap text-xs mt-1 ml-3">
              {cmd.output}
            </div>
          </div>
        ))}
        
        {currentCommand && (
          <div className="flex items-center gap-2 text-green-400">
            <span>$</span>
            <motion.span
              initial={{ width: 0 }}
              animate={{ width: "auto" }}
              className="overflow-hidden"
            >
              {currentCommand}
            </motion.span>
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              |
            </motion.span>
          </div>
        )}
      </div>
    </div>
  );
}