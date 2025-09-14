import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function AgentEditorTool() {
  const [code, setCode] = useState("");
  const [fileName, setFileName] = useState("index.html");

  useEffect(() => {
    // Simulate agent writing code
    const simulateCodeWriting = async () => {
      const codeToWrite = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Generated Website</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 0; 
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .container { max-width: 800px; margin: 0 auto; text-align: center; }
        .header { font-size: 2.5rem; margin-bottom: 1rem; }
        .description { font-size: 1.2rem; opacity: 0.9; }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="header">Welcome to Your AI-Built Website</h1>
        <p class="description">This website was created autonomously by an AI agent!</p>
        <button onclick="alert('Hello from AI!')">Click Me</button>
    </div>
</body>
</html>`;

      // Type out the code character by character
      for (let i = 0; i <= codeToWrite.length; i++) {
        setCode(codeToWrite.slice(0, i));
        await new Promise(resolve => setTimeout(resolve, 15));
      }
    };

    simulateCodeWriting();
  }, []);

  return (
    <div className="text-xs">
      <div className="flex items-center gap-2 mb-2 text-muted-foreground">
        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        <span className="ml-2 font-mono">{fileName}</span>
      </div>
      
      <div className="bg-editor-bg p-3 rounded-lg max-h-48 overflow-y-auto">
        <pre className="text-xs text-gray-300 font-mono leading-relaxed">
          <code>{code}</code>
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="text-white"
          >
            |
          </motion.span>
        </pre>
      </div>
    </div>
  );
}