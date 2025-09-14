import { useState } from "react";
import { motion } from "framer-motion";
import { 
  FileText, 
  Folder, 
  FolderOpen, 
  Upload, 
  Download,
  Edit,
  Trash2,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import type { ToolProps } from "@/types";

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: string;
  modified: string;
  path: string;
}

export default function FilesTool({ isActive }: ToolProps) {
  const [currentPath, setCurrentPath] = useState("/Users/user");
  const [files, setFiles] = useState<FileItem[]>([
    {
      id: "1",
      name: "Documents",
      type: "folder",
      modified: "Today",
      path: "/Users/user/Documents"
    },
    {
      id: "2", 
      name: "Desktop",
      type: "folder",
      modified: "Today",
      path: "/Users/user/Desktop"
    },
    {
      id: "3",
      name: "Downloads",
      type: "folder", 
      modified: "Yesterday",
      path: "/Users/user/Downloads"
    },
    {
      id: "4",
      name: "project.json",
      type: "file",
      size: "2.1 KB",
      modified: "2 hours ago",
      path: "/Users/user/project.json"
    },
    {
      id: "5",
      name: "README.md",
      type: "file",
      size: "1.5 KB", 
      modified: "1 day ago",
      path: "/Users/user/README.md"
    }
  ]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const navigateToFolder = (folder: FileItem) => {
    if (folder.type === 'folder') {
      setCurrentPath(folder.path);
      // In a real implementation, this would fetch folder contents
    }
  };

  const navigateUp = () => {
    const parentPath = currentPath.split('/').slice(0, -1).join('/') || '/';
    setCurrentPath(parentPath);
  };

  const createFolder = () => {
    if (!newFolderName.trim()) return;
    
    const newFolder: FileItem = {
      id: Date.now().toString(),
      name: newFolderName,
      type: 'folder',
      modified: 'Now',
      path: `${currentPath}/${newFolderName}`
    };
    
    setFiles(prev => [...prev, newFolder]);
    setNewFolderName("");
    setShowNewFolder(false);
  };

  const deleteFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    setSelectedFile(null);
  };

  const handleFileUpload = () => {
    // In a real implementation, this would open file picker
    console.log("File upload triggered");
  };

  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="tool-panel h-full flex flex-col"
    >
      {/* Files Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">File System</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowNewFolder(true)}
          >
            <Plus className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleFileUpload}
          >
            <Upload className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Path Breadcrumb */}
      <div className="flex items-center gap-2 mb-4 p-3 bg-muted rounded-xl">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={navigateUp}
          disabled={currentPath === '/'}
        >
          ←
        </Button>
        <span className="font-mono text-sm text-muted-foreground">
          {currentPath}
        </span>
      </div>

      {/* New Folder Input */}
      {showNewFolder && (
        <div className="flex items-center gap-2 mb-4 p-3 bg-muted rounded-xl">
          <Folder className="w-4 h-4 text-muted-foreground" />
          <Input
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="New folder name"
            onKeyDown={(e) => {
              if (e.key === 'Enter') createFolder();
              if (e.key === 'Escape') setShowNewFolder(false);
            }}
            className="flex-1"
            autoFocus
          />
          <Button size="sm" onClick={createFolder}>Create</Button>
        </div>
      )}

      {/* File List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {files.map((file) => (
          <motion.div
            key={file.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card 
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedFile === file.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => {
                setSelectedFile(file.id);
                if (file.type === 'folder') {
                  navigateToFolder(file);
                }
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {file.type === 'folder' ? (
                      <FolderOpen className="w-5 h-5 text-blue-500" />
                    ) : (
                      <FileText className="w-5 h-5 text-muted-foreground" />
                    )}
                    
                    <div>
                      <div className="font-medium">{file.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {file.size && `${file.size} • `}Modified {file.modified}
                      </div>
                    </div>
                  </div>
                  
                  {selectedFile === file.id && (
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteFile(file.id);
                        }}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        
        {files.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Folder className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Empty Folder</h3>
            <p className="text-muted-foreground">
              This folder is empty. Upload files or create new folders to get started.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}