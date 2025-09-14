import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Code, Save, FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { ToolProps } from "@/types";

interface EditorFile {
  id: string;
  name: string;
  content: string;
  language: string;
  isDirty: boolean;
}

export default function EditorTool({ isActive }: ToolProps) {
  const [files, setFiles] = useState<EditorFile[]>([
    {
      id: "1",
      name: "example.ts",
      content: `// Welcome to the AI Code Editor
interface User {
  id: string;
  name: string;
  email: string;
}

const createUser = (userData: Partial<User>): User => {
  return {
    id: Math.random().toString(36),
    name: userData.name || 'Anonymous',
    email: userData.email || '',
  };
};

console.log('AI Editor Ready!');`,
      language: "typescript",
      isDirty: false,
    }
  ]);
  const [activeFileId, setActiveFileId] = useState("1");
  const [newFileName, setNewFileName] = useState("");
  const [showNewFile, setShowNewFile] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const activeFile = files.find(f => f.id === activeFileId);

  const updateFileContent = (content: string) => {
    setFiles(prev => prev.map(file => 
      file.id === activeFileId 
        ? { ...file, content, isDirty: true }
        : file
    ));
  };

  const saveFile = () => {
    setFiles(prev => prev.map(file => 
      file.id === activeFileId 
        ? { ...file, isDirty: false }
        : file
    ));
  };

  const createNewFile = () => {
    if (!newFileName.trim()) return;
    
    const extension = newFileName.split('.').pop() || 'txt';
    const language = getLanguageFromExtension(extension);
    
    const newFile: EditorFile = {
      id: Date.now().toString(),
      name: newFileName,
      content: `// New ${language} file\n`,
      language,
      isDirty: false,
    };
    
    setFiles(prev => [...prev, newFile]);
    setActiveFileId(newFile.id);
    setNewFileName("");
    setShowNewFile(false);
  };

  const getLanguageFromExtension = (ext: string): string => {
    const languages: Record<string, string> = {
      'ts': 'typescript',
      'js': 'javascript',
      'tsx': 'typescript',
      'jsx': 'javascript',
      'py': 'python',
      'html': 'html',
      'css': 'css',
      'json': 'json',
      'md': 'markdown',
    };
    return languages[ext] || 'text';
  };

  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="tool-panel h-full flex flex-col"
    >
      {/* Editor Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Code className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Code Editor</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowNewFile(true)}
          >
            <Plus className="w-4 h-4" />
          </Button>
          {activeFile?.isDirty && (
            <Button 
              variant="default" 
              size="sm" 
              onClick={saveFile}
              className="gap-2"
            >
              <Save className="w-4 h-4" />
              Save
            </Button>
          )}
        </div>
      </div>

      {/* New File Input */}
      {showNewFile && (
        <div className="flex items-center gap-2 mb-4 p-3 bg-muted rounded-xl">
          <FileText className="w-4 h-4 text-muted-foreground" />
          <Input
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            placeholder="filename.ts"
            onKeyDown={(e) => {
              if (e.key === 'Enter') createNewFile();
              if (e.key === 'Escape') setShowNewFile(false);
            }}
            className="flex-1"
            autoFocus
          />
          <Button size="sm" onClick={createNewFile}>Create</Button>
        </div>
      )}

      {/* File Tabs */}
      <Tabs value={activeFileId} onValueChange={setActiveFileId} className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start bg-muted rounded-xl p-1">
          {files.map((file) => (
            <TabsTrigger 
              key={file.id} 
              value={file.id}
              className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <FileText className="w-3 h-3" />
              {file.name}
              {file.isDirty && <div className="w-1 h-1 bg-primary rounded-full" />}
            </TabsTrigger>
          ))}
        </TabsList>

        {files.map((file) => (
          <TabsContent 
            key={file.id} 
            value={file.id} 
            className="flex-1 mt-4 editor-container"
          >
            <textarea
              ref={textareaRef}
              value={file.content}
              onChange={(e) => updateFileContent(e.target.value)}
              className="w-full h-full p-4 bg-transparent text-foreground font-mono text-sm resize-none focus:outline-none"
              placeholder="Start coding..."
              spellCheck={false}
            />
          </TabsContent>
        ))}
      </Tabs>
    </motion.div>
  );
}