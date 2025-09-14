import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Folder, FileText, FolderOpen, Plus, Check } from "lucide-react";

interface FileItem {
  name: string;
  type: 'file' | 'folder';
  size?: string;
  status?: 'created' | 'modified' | 'unchanged';
}

export default function AgentFilesTool() {
  const [currentPath, setCurrentPath] = useState("/project");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [action, setAction] = useState("");

  useEffect(() => {
    // Simulate agent file operations
    const simulateFileOperations = async () => {
      const operations = [
        {
          action: "Scanning project structure...",
          path: "/project",
          files: [
            { name: "src", type: "folder" as const },
            { name: "public", type: "folder" as const },
            { name: "package.json", type: "file" as const, size: "2.1 KB" },
            { name: "README.md", type: "file" as const, size: "1.5 KB" }
          ]
        },
        {
          action: "Creating new components...",
          path: "/project/src/components",
          files: [
            { name: "Header.tsx", type: "file" as const, size: "1.2 KB", status: "created" as const },
            { name: "Footer.tsx", type: "file" as const, size: "0.8 KB", status: "created" as const },
            { name: "Layout.tsx", type: "file" as const, size: "2.1 KB", status: "created" as const }
          ]
        },
        {
          action: "Updating existing files...",
          path: "/project",
          files: [
            { name: "package.json", type: "file" as const, size: "2.3 KB", status: "modified" as const },
            { name: "tsconfig.json", type: "file" as const, size: "0.9 KB", status: "modified" as const }
          ]
        }
      ];

      for (const operation of operations) {
        setAction(operation.action);
        setCurrentPath(operation.path);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setFiles(operation.files);
        
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      setAction("File operations completed ✓");
    };

    simulateFileOperations();
  }, []);

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'created':
        return <Plus className="w-3 h-3 text-green-500" />;
      case 'modified':
        return <Check className="w-3 h-3 text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'created':
        return 'text-green-500';
      case 'modified':
        return 'text-blue-500';
      default:
        return 'text-foreground';
    }
  };

  return (
    <div className="text-xs">
      {/* Current Action */}
      <div className="flex items-center gap-2 p-2 bg-muted rounded-lg mb-2">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-3 h-3 border border-primary border-t-transparent rounded-full"
        />
        <span className="text-xs text-muted-foreground">{action}</span>
      </div>

      {/* File Path */}
      <div className="text-xs text-muted-foreground mb-2 font-mono">
        {currentPath}
      </div>

      {/* File List */}
      <div className="space-y-1 max-h-32 overflow-y-auto">
        {files.map((file, index) => (
          <motion.div
            key={`${file.name}-${index}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex items-center gap-2 p-1 rounded ${
              file.status ? 'bg-muted/50' : ''
            }`}
          >
            {file.type === 'folder' ? (
              <FolderOpen className="w-3 h-3 text-blue-400" />
            ) : (
              <FileText className="w-3 h-3 text-muted-foreground" />
            )}
            
            <span className={`flex-1 ${getStatusColor(file.status)}`}>
              {file.name}
            </span>
            
            {file.size && (
              <span className="text-xs text-muted-foreground">
                {file.size}
              </span>
            )}
            
            {getStatusIcon(file.status)}
          </motion.div>
        ))}
      </div>
    </div>
  );
}