import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Globe, Lock } from "lucide-react";

export default function AgentBrowserTool() {
  const [currentUrl, setCurrentUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [pageContent, setPageContent] = useState("");

  useEffect(() => {
    // Simulate agent browsing
    const simulateBrowsing = async () => {
      const sites = [
        { url: "https://docs.react.dev", content: "React Documentation - Learning React hooks and components..." },
        { url: "https://tailwindcss.com/docs", content: "Tailwind CSS Documentation - Utility-first CSS framework..." },
        { url: "https://developer.mozilla.org", content: "MDN Web Docs - Web development resources and tutorials..." }
      ];

      for (const site of sites) {
        setIsLoading(true);
        setCurrentUrl(site.url);
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setIsLoading(false);
        setPageContent(site.content);
        
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    };

    simulateBrowsing();
  }, []);

  return (
    <div className="text-xs">
      {/* Browser Chrome */}
      <div className="flex items-center gap-2 p-2 bg-muted rounded-t-lg border-b border-border">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </div>
        
        <div className="flex items-center flex-1 gap-2 bg-background rounded px-2 py-1">
          <Lock className="w-3 h-3 text-green-500" />
          <span className="text-xs font-mono text-muted-foreground truncate">
            {currentUrl || "about:blank"}
          </span>
        </div>
        
        <Globe className="w-3 h-3 text-muted-foreground" />
      </div>

      {/* Browser Content */}
      <div className="bg-background p-3 rounded-b-lg max-h-32 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-3 h-3 border border-primary border-t-transparent rounded-full"
            />
            <span className="text-xs">Loading...</span>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-xs text-foreground font-medium">
              Page Analysis Complete
            </div>
            <div className="text-xs text-muted-foreground leading-relaxed">
              {pageContent}
            </div>
            <div className="text-xs text-green-500">
              ✓ Data extracted successfully
            </div>
          </div>
        )}
      </div>
    </div>
  );
}