import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, ExternalLink, AlertCircle, Globe, CheckCircle2 } from "lucide-react";
import { useSearch } from "@/hooks/useSearch";
import { Button } from "@/components/ui/button";

export default function RealSearchTool() {
  const [query, setQuery] = useState("");
  const { search, isSearching, results, error, clearError } = useSearch();

  useEffect(() => {
    // Auto-start with a sample search
    if (!results && !isSearching) {
      performInitialSearch();
    }
  }, []);

  const performInitialSearch = async () => {
    await search("latest web development trends 2024");
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    clearError();
    await search(query);
  };

  // Mock images for demonstration (in real implementation, these would come from search results)
  const mockImages = [
    { url: "https://via.placeholder.com/150x100/3b82f6/ffffff?text=Chart+1", alt: "Market Chart 1" },
    { url: "https://via.placeholder.com/150x100/8b5cf6/ffffff?text=Chart+2", alt: "Market Chart 2" },
    { url: "https://via.placeholder.com/150x100/06b6d4/ffffff?text=Report", alt: "Market Report" },
    { url: "https://via.placeholder.com/150x100/10b981/ffffff?text=Analytics", alt: "Analytics Dashboard" }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 p-3 border-b border-border">
        <Search className="w-4 h-4 text-primary" />
        <span className="font-medium text-sm">Web Search</span>
        {results && !isSearching && (
          <div className="flex items-center gap-1 ml-auto">
            <CheckCircle2 className="w-3 h-3 text-green-500" />
            <span className="text-xs text-green-500">Search completed successfully</span>
          </div>
        )}
      </div>

      {/* Search Input */}
      <div className="p-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 p-2 bg-muted rounded-lg">
            <Search className="w-3 h-3 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search the web..."
              className="flex-1 text-sm bg-transparent border-none outline-none text-foreground"
              disabled={isSearching}
            />
          </div>
          <Button 
            onClick={handleSearch}
            disabled={isSearching || !query.trim()}
            size="sm"
            className="h-8 px-3"
          >
            Search
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Loading State */}
        {isSearching && (
          <div className="flex items-center gap-2 p-3 bg-muted/50 text-muted-foreground">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full"
            />
            <span className="text-sm">Searching the web...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Images Section */}
        {results && results.results.length > 0 && (
          <div className="p-3">
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Globe className="w-3 h-3" />
              Images
            </h4>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {mockImages.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group cursor-pointer bg-muted rounded-lg overflow-hidden hover:ring-2 hover:ring-primary/50 transition-all"
                >
                  <img 
                    src={image.url} 
                    alt={image.alt}
                    className="w-full h-20 object-cover"
                  />
                  <div className="absolute top-1 right-1">
                    <ExternalLink className="w-3 h-3 text-white/80 group-hover:text-white" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        {results && (
          <div className="p-3">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium">Search Results ({results.results.length})</h4>
              <span className="text-xs text-muted-foreground">9/14/2025</span>
            </div>
            
            <div className="space-y-3">
              {results.results.map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group cursor-pointer"
                >
                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Globe className="w-3 h-3 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-primary hover:underline line-clamp-1 mb-1">
                            {result.title}
                          </div>
                          <div className="text-xs text-muted-foreground mb-2 line-clamp-1">
                            {result.url}
                          </div>
                          <div className="text-sm text-foreground leading-relaxed line-clamp-2">
                            {result.snippet}
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Results Summary */}
            <div className="mt-4 p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-green-500 font-medium">{results.results.length} results</span>
              </div>
            </div>
          </div>
        )}

        {/* AI Summary */}
        {results?.answer && (
          <div className="p-3 border-t border-border">
            <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
              <div className="text-sm font-medium text-primary mb-2">AI Summary:</div>
              <div className="text-sm text-foreground leading-relaxed">{results.answer}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}