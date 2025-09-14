import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, RotateCcw, Home, Lock, MoreHorizontal, Star, Shield, Globe } from "lucide-react";

export default function AgentBrowserTool() {
  const [currentUrl, setCurrentUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [pageTitle, setPageTitle] = useState("");
  const [actionLog, setActionLog] = useState<string[]>([]);

  useEffect(() => {
    // Simulate agent browser automation
    const simulateBrowserAutomation = async () => {
      const actions = [
        {
          url: "https://github.com/login",
          title: "Sign in to GitHub",
          action: "Navigating to GitHub login page"
        },
        {
          url: "https://github.com/login",
          title: "Sign in to GitHub",
          action: "Filling login credentials"
        },
        {
          url: "https://github.com/dashboard",
          title: "GitHub Dashboard",
          action: "Successfully logged in, accessing dashboard"
        },
        {
          url: "https://github.com/new",
          title: "Create a new repository",
          action: "Clicking 'New repository' button"
        },
        {
          url: "https://github.com/new",
          title: "Create a new repository",
          action: "Configuring repository settings"
        }
      ];

      for (const step of actions) {
        setIsLoading(true);
        setCurrentUrl(step.url);
        setPageTitle(step.title);
        
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setIsLoading(false);
        setActionLog(prev => [...prev, step.action]);
        
        await new Promise(resolve => setTimeout(resolve, 1200));
      }
    };

    simulateBrowserAutomation();
  }, []);

  return (
    <div className="text-xs bg-background border border-border rounded-lg overflow-hidden">
      {/* Chrome Browser Top Bar */}
      <div className="bg-muted/50 p-1 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="text-xs font-medium text-muted-foreground">AI Agent Browser</div>
          <div className="w-12"></div>
        </div>
      </div>

      {/* Chrome Navigation Bar */}
      <div className="bg-muted/30 p-2 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <ChevronLeft className="w-4 h-4 text-muted-foreground/50" />
            <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
            <RotateCcw className="w-4 h-4 text-muted-foreground/50" />
            <Home className="w-4 h-4 text-muted-foreground/50" />
          </div>
          
          <div className="flex items-center flex-1 gap-1 bg-background rounded-full px-3 py-1 border border-border">
            <div className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-green-500" />
              <Shield className="w-3 h-3 text-muted-foreground/70" />
            </div>
            <span className="text-xs font-mono text-muted-foreground truncate flex-1">
              {currentUrl || "chrome://newtab"}
            </span>
            <Star className="w-3 h-3 text-muted-foreground/50" />
          </div>
          
          <MoreHorizontal className="w-4 h-4 text-muted-foreground/50" />
        </div>
      </div>

      {/* Tab Bar */}
      <div className="bg-muted/20 px-2 py-1 border-b border-border">
        <div className="flex items-center gap-1">
          <div className="bg-background border border-border rounded-t-md px-3 py-1 text-xs max-w-48 truncate">
            <div className="flex items-center gap-2">
              <Globe className="w-3 h-3 text-muted-foreground" />
              <span className="truncate">{pageTitle || "New Tab"}</span>
            </div>
          </div>
          <div className="w-6 h-6 flex items-center justify-center text-muted-foreground/50">
            <span className="text-xs">+</span>
          </div>
        </div>
      </div>

      {/* Browser Content */}
      <div className="bg-background p-3 min-h-24 max-h-32 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-3 h-3 border border-primary border-t-transparent rounded-full"
            />
            <span className="text-xs">Loading page...</span>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-xs text-foreground font-medium">
              Browser Automation Active
            </div>
            {actionLog.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xs text-muted-foreground bg-muted/30 rounded px-2 py-1"
              >
                {action}
              </motion.div>
            ))}
            {actionLog.length > 0 && (
              <div className="text-xs text-green-500 flex items-center gap-1">
                ✓ Browser automation in progress
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}