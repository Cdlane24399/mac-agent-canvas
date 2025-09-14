import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, ExternalLink, AlertCircle } from "lucide-react";
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

  return (
    <div className="text-xs">
      {/* Search Bar */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 flex items-center gap-2 p-2 bg-muted rounded-lg">
          <Search className="w-3 h-3 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search the web..."
            className="flex-1 text-xs bg-transparent border-none outline-none text-foreground"
            disabled={isSearching}
          />
        </div>
        <Button 
          onClick={handleSearch}
          disabled={isSearching || !query.trim()}
          size="sm"
          className="h-7 px-2"
        >
          Search
        </Button>
      </div>

      {/* Loading State */}
      {isSearching && (
        <div className="flex items-center gap-2 p-2 bg-muted/50 rounded text-muted-foreground">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-3 h-3 border border-primary border-t-transparent rounded-full"
          />
          <span className="text-xs">Searching the web...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex items-center gap-2 p-2 bg-destructive/10 rounded text-destructive mb-2">
          <AlertCircle className="w-3 h-3" />
          <span className="text-xs">{error}</span>
        </div>
      )}

      {/* Search Results */}
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {results?.results.map((result, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-2 bg-background rounded border border-border hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="text-xs font-medium text-primary mb-1 line-clamp-1">
                  {result.title}
                </div>
                <div className="text-xs text-muted-foreground mb-1 line-clamp-1">
                  {result.url}
                </div>
                <div className="text-xs text-foreground leading-relaxed line-clamp-2">
                  {result.snippet}
                </div>
              </div>
              <a 
                href={result.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                <ExternalLink className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              </a>
            </div>
          </motion.div>
        ))}
        
        {results && results.results.length > 0 && !isSearching && (
          <div className="text-xs text-green-500 text-center p-1">
            ✓ {results.results.length} results found for "{results.query}"
          </div>
        )}

        {results && results.results.length === 0 && !isSearching && !error && (
          <div className="text-xs text-muted-foreground text-center p-2">
            No results found. Try a different search term.
          </div>
        )}
      </div>

      {/* Answer (if available) */}
      {results?.answer && (
        <div className="mt-3 p-2 bg-primary/5 rounded border border-primary/20">
          <div className="text-xs font-medium text-primary mb-1">AI Summary:</div>
          <div className="text-xs text-foreground leading-relaxed">{results.answer}</div>
        </div>
      )}
    </div>
  );
}