import { motion } from "framer-motion";
import { 
  Terminal, 
  Code, 
  Globe, 
  Search, 
  MessageSquare, 
  FileText,
  Bot
} from "lucide-react";

interface SidebarProps {
  activeToolId: string;
  onToolSelect: (toolId: string) => void;
}

const tools = [
  { id: 'chat', name: 'AI Chat', icon: MessageSquare },
  { id: 'terminal', name: 'Terminal', icon: Terminal },
  { id: 'editor', name: 'Editor', icon: Code },
  { id: 'browser', name: 'Browser', icon: Globe },
  { id: 'search', name: 'Search', icon: Search },
  { id: 'files', name: 'Files', icon: FileText },
];

export default function Sidebar({ activeToolId, onToolSelect }: SidebarProps) {
  return (
    <div className="w-16 bg-muted border-r border-border flex flex-col items-center py-4 space-y-4">
      {/* AI Agent Logo */}
      <motion.div 
        className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center mb-4"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Bot className="w-6 h-6 text-primary-foreground" />
      </motion.div>

      {/* Tool Navigation */}
      <div className="space-y-2">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeToolId === tool.id;
          
          return (
            <motion.button
              key={tool.id}
              onClick={() => onToolSelect(tool.id)}
              className={`
                w-12 h-12 rounded-2xl flex items-center justify-center
                transition-all duration-200 relative group
                ${isActive 
                  ? 'bg-primary text-primary-foreground shadow-lg' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={tool.name}
            >
              <Icon className="w-5 h-5" />
              
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-primary rounded-full"
                  layoutId="activeIndicator"
                />
              )}
              
              {/* Tooltip */}
              <div className="absolute left-16 bg-card border border-border rounded-xl px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                <span className="text-sm font-medium">{tool.name}</span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}