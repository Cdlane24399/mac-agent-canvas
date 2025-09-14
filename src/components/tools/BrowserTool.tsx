import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Globe, 
  ArrowLeft, 
  ArrowRight, 
  RotateCcw, 
  Home,
  Lock,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ToolProps } from "@/types";

export default function BrowserTool({ isActive }: ToolProps) {
  const [url, setUrl] = useState("https://example.com");
  const [currentUrl, setCurrentUrl] = useState("https://example.com");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = async () => {
    if (!url.trim()) return;
    
    setIsLoading(true);
    setCurrentUrl(url);
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const goHome = () => {
    setUrl("https://example.com");
    setCurrentUrl("https://example.com");
  };

  const refresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="tool-panel h-full flex flex-col"
    >
      {/* Browser Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Browser</h2>
        </div>
      </div>

      {/* Browser Chrome */}
      <div className="browser-chrome mb-4">
        {/* Navigation Controls */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" disabled>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" disabled>
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={refresh}>
            <RotateCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Button variant="ghost" size="sm" onClick={goHome}>
            <Home className="w-4 h-4" />
          </Button>
        </div>

        {/* URL Bar */}
        <div className="flex items-center flex-1 gap-2 ml-4">
          <div className="flex items-center gap-2 bg-background rounded-xl px-3 py-2 flex-1">
            <Lock className="w-4 h-4 text-green-500" />
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && navigate()}
              className="border-none bg-transparent px-0 focus-visible:ring-0"
              placeholder="Enter URL..."
            />
          </div>
          <Button variant="ghost" size="sm">
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Browser Content */}
      <div className="flex-1 bg-background rounded-2xl border border-border overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <RotateCcw className="w-6 h-6 text-primary" />
              </motion.div>
              <span className="text-muted-foreground">Loading {currentUrl}...</span>
            </div>
          </div>
        ) : (
          <div className="p-8 h-full">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                <Globe className="w-8 h-8 text-primary" />
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">Browser Tool</h3>
                <p className="text-muted-foreground">
                  This is a simulated browser interface. In a full implementation, 
                  this would render web pages using an embedded webview.
                </p>
              </div>
              
              <div className="bg-muted rounded-xl p-4">
                <div className="text-sm text-muted-foreground mb-2">Current URL:</div>
                <div className="font-mono text-sm break-all">{currentUrl}</div>
              </div>
              
              <div className="text-xs text-muted-foreground">
                Note: For security reasons, modern browsers restrict iframe embedding. 
                A production version would use Electron or similar for full web browsing.
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}