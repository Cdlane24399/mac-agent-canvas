import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Copy, FileDown, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AgentEditorTool() {
  const [code, setCode] = useState("");
  const [fileName, setFileName] = useState("index.ts");
  const [lineCount, setLineCount] = useState(0);

  useEffect(() => {
    // TypeScript interfaces code
    const codeToWrite = `export interface Task {
  id: string;
  title: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
  type: 'image' | 'slides' | 'webpage' | 'document' | 'video' | 'visualization';
  description?: string;
  result?: string;
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  taskId?: string;
}

export interface BrowserAction {
  id: string;
  action: string;
  timestamp: Date;
  screenshot?: string;
  url?: string;
  description?: string;
}

export interface UseCase {
  id: string;
  name: string;
  type: 'image' | 'slides' | 'webpage' | 'document' | 'video' | 'visualization';
  description: string;
  featured: boolean;
  category: 'featured' | 'research' | 'data' | 'edu' | 'productivity' | 'programming';
}

export interface KnowledgeItem {
  id: string;
  title: string;
  url: string;
  type: 'webpage' | 'document' | 'reference';
  addedAt: Date;
  status: 'suggested' | 'saved';
}`;

    // Type out the code character by character
    const typeCode = async () => {
      for (let i = 0; i <= codeToWrite.length; i++) {
        const currentCode = codeToWrite.slice(0, i);
        setCode(currentCode);
        setLineCount(currentCode.split('\n').length);
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    };

    typeCode();
  }, []);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div className="flex items-center gap-3">
          <FileText className="w-4 h-4 text-primary" />
          <span className="font-medium text-sm">Create File</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-7 px-2">
            <Copy className="w-3 h-3 mr-1" />
            Copy
          </Button>
          <Button variant="outline" size="sm" className="h-7 px-2">
            <FileDown className="w-3 h-3 mr-1" />
            Source
          </Button>
          <Button variant="outline" size="sm" className="h-7 px-2">
            <Eye className="w-3 h-3 mr-1" />
            Preview
          </Button>
        </div>
      </div>

      {/* File Tab */}
      <div className="flex items-center gap-2 p-2 bg-muted/30 border-b border-border">
        <div className="flex items-center gap-2 bg-background px-3 py-1 rounded-md border border-border">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="ml-2 font-mono text-sm">{fileName}</span>
        </div>
      </div>
      
      {/* Code Editor */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full bg-gray-900 text-gray-100 font-mono text-sm">
          <div className="flex h-full">
            {/* Line Numbers */}
            <div className="bg-gray-800 px-3 py-4 text-gray-500 text-right border-r border-gray-700 min-w-[3rem]">
              {Array.from({ length: Math.max(lineCount, 1) }, (_, i) => (
                <div key={i + 1} className="leading-6">
                  {i + 1}
                </div>
              ))}
            </div>
            
            {/* Code Content */}
            <div className="flex-1 p-4 overflow-auto">
              <pre className="leading-6">
                <code className="text-gray-100">
                  {code.split('\n').map((line, index) => (
                    <div key={index} className="min-h-[1.5rem]">
                      {line.split(' ').map((word, wordIndex) => {
                        let className = 'text-gray-100';
                        
                        // Syntax highlighting
                        if (word === 'export' || word === 'interface') {
                          className = 'text-blue-400';
                        } else if (word.includes(':') && word !== ':') {
                          className = 'text-green-400';
                        } else if (word.includes("'") || word.includes('"')) {
                          className = 'text-yellow-300';
                        } else if (word === 'string' || word === 'Date' || word === 'boolean') {
                          className = 'text-purple-400';
                        }
                        
                        return (
                          <span key={wordIndex} className={className}>
                            {word}{wordIndex < line.split(' ').length - 1 ? ' ' : ''}
                          </span>
                        );
                      })}
                    </div>
                  ))}
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="text-white bg-white"
                  >
                    |
                  </motion.span>
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-2 bg-muted/10 border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>TYPESCRIPT</span>
            <span>•</span>
            <span>UTF-8</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Ln {lineCount}, Col 1</span>
            <span>•</span>
            <span>9/14/2025, 1:53:39 AM</span>
          </div>
        </div>
      </div>
    </div>
  );
}