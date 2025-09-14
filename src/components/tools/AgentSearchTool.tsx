import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, ExternalLink } from "lucide-react";

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

export default function AgentSearchTool() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(true);

  useEffect(() => {
    // Simulate agent performing searches
    const simulateSearch = async () => {
      const searches = [
        {
          query: "best practices web development 2024",
          results: [
            {
              title: "Modern Web Development Best Practices",
              url: "https://web.dev/best-practices",
              snippet: "Comprehensive guide to building fast, accessible, and secure websites..."
            },
            {
              title: "Web Performance Optimization 2024",
              url: "https://developers.google.com/web/performance",
              snippet: "Latest techniques for optimizing web application performance..."
            }
          ]
        },
        {
          query: "React TypeScript project structure",
          results: [
            {
              title: "React TypeScript Project Setup",
              url: "https://react-typescript-cheatsheet.netlify.app",
              snippet: "Complete guide to structuring React applications with TypeScript..."
            }
          ]
        }
      ];

      for (const search of searches) {
        setQuery(search.query);
        setIsSearching(true);
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setResults(search.results);
        setIsSearching(false);
        
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    };

    simulateSearch();
  }, []);

  return (
    <div className="text-xs">
      {/* Search Bar */}
      <div className="flex items-center gap-2 p-2 bg-muted rounded-lg mb-2">
        <Search className="w-3 h-3 text-muted-foreground" />
        <span className="text-xs text-muted-foreground font-mono">
          {query || "Initializing search..."}
        </span>
        {isSearching && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-3 h-3 border border-primary border-t-transparent rounded-full"
          />
        )}
      </div>

      {/* Search Results */}
      <div className="space-y-2 max-h-32 overflow-y-auto">
        {results.map((result, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-2 bg-background rounded border border-border"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="text-xs font-medium text-primary mb-1 truncate">
                  {result.title}
                </div>
                <div className="text-xs text-muted-foreground mb-1 truncate">
                  {result.url}
                </div>
                <div className="text-xs text-foreground leading-relaxed">
                  {result.snippet}
                </div>
              </div>
              <ExternalLink className="w-3 h-3 text-muted-foreground flex-shrink-0" />
            </div>
          </motion.div>
        ))}
        
        {results.length > 0 && !isSearching && (
          <div className="text-xs text-green-500 text-center p-1">
            ✓ {results.length} relevant results found
          </div>
        )}
      </div>
    </div>
  );
}