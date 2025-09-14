import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Home, 
  Lock, 
  MoreHorizontal, 
  Star, 
  Shield, 
  Globe,
  AlertCircle,
  Camera,
  ExternalLink
} from "lucide-react";
import { useBrowser } from "@/hooks/useBrowser";
import { Button } from "@/components/ui/button";

export default function RealBrowserTool() {
  const [urlInput, setUrlInput] = useState("");
  const {
    session,
    currentUrl,
    currentTitle,
    actionLog,
    isLoading,
    error,
    createSession,
    navigate,
    takeScreenshot,
    closeSession,
    clearError,
    hasActiveSession,
    previewUrl
  } = useBrowser();

  useEffect(() => {
    // Auto-create session when component mounts
    if (!hasActiveSession && !session) {
      handleCreateSession();
    }
  }, []);

  const handleCreateSession = async () => {
    clearError();
    await createSession();
  };

  const handleNavigate = async () => {
    if (!urlInput.trim()) return;
    
    clearError();
    let url = urlInput;
    
    // Add protocol if missing
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    await navigate(url);
    setUrlInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleNavigate();
    }
  };

  const handleScreenshot = async () => {
    clearError();
    await takeScreenshot();
  };

  return (
    <div className="text-xs bg-background border border-border rounded-lg overflow-hidden">
      {/* Session Status */}
      {!session && (
        <div className="flex items-center gap-2 p-2 bg-muted/50 border-b">
          <Globe className="w-3 h-3 text-primary" />
          <span className="text-xs">No active browser session</span>
          <Button
            onClick={handleCreateSession}
            disabled={isLoading}
            size="sm"
            className="h-5 px-2 text-xs ml-auto"
          >
            Create Session
          </Button>
        </div>
      )}

      {/* Chrome Browser Top Bar */}
      {session && (
        <div className="bg-muted/50 p-1 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="text-xs font-medium text-muted-foreground">Live Browser Session</div>
            <div className="flex items-center gap-1">
              <Button
                onClick={handleScreenshot}
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0"
                disabled={isLoading}
              >
                <Camera className="w-3 h-3" />
              </Button>
              {previewUrl && (
                <a 
                  href={previewUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="h-5 w-5 p-0 flex items-center justify-center hover:bg-muted rounded"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Chrome Navigation Bar */}
      {session && (
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
              <input
                type="text"
                value={urlInput || currentUrl}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter URL..."
                disabled={isLoading}
                className="text-xs font-mono text-muted-foreground bg-transparent border-none outline-none flex-1"
              />
              <Star className="w-3 h-3 text-muted-foreground/50" />
            </div>
            
            <MoreHorizontal className="w-4 h-4 text-muted-foreground/50" />
          </div>
        </div>
      )}

      {/* Tab Bar */}
      {session && (
        <div className="bg-muted/20 px-2 py-1 border-b border-border">
          <div className="flex items-center gap-1">
            <div className="bg-background border border-border rounded-t-md px-3 py-1 text-xs max-w-48 truncate">
              <div className="flex items-center gap-2">
                <Globe className="w-3 h-3 text-muted-foreground" />
                <span className="truncate">{currentTitle || "New Tab"}</span>
              </div>
            </div>
            <div className="w-6 h-6 flex items-center justify-center text-muted-foreground/50">
              <span className="text-xs">+</span>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="flex items-center gap-2 p-2 bg-destructive/10 text-destructive border-b">
          <AlertCircle className="w-3 h-3" />
          <span className="text-xs">{error}</span>
        </div>
      )}

      {/* Browser Content */}
      <div className="bg-background p-3 min-h-24 max-h-48 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-3 h-3 border border-primary border-t-transparent rounded-full"
            />
            <span className="text-xs">Browser action in progress...</span>
          </div>
        ) : session ? (
          <div className="space-y-2">
            <div className="text-xs text-foreground font-medium">
              Live Browser Automation Active
            </div>
            
            {currentUrl && (
              <div className="text-xs">
                <span className="font-medium">Current URL:</span>
                <div className="text-muted-foreground font-mono">{currentUrl}</div>
              </div>
            )}

            {previewUrl && (
              <div className="text-xs">
                <span className="font-medium">Live Preview:</span>
                <a 
                  href={previewUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline ml-1"
                >
                  View in new tab →
                </a>
              </div>
            )}
            
            <div className="text-xs font-medium mt-3">Action Log:</div>
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
              <div className="text-xs text-green-500 flex items-center gap-1 mt-2">
                ✓ Browser session active
              </div>
            )}
          </div>
        ) : (
          <div className="text-xs text-muted-foreground text-center p-4">
            Create a browser session to start browsing
          </div>
        )}
      </div>

      {/* Session Controls */}
      {session && (
        <div className="border-t p-2 bg-muted/20">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Session: {session.sessionId.slice(0, 8)}...</span>
            <Button
              onClick={closeSession}
              variant="outline"
              size="sm"
              className="h-5 px-2 text-xs"
            >
              Close Session
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}