import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ExternalLink, Clock, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import type { ToolProps } from "@/types";

interface SearchResult {
  id: string;
  title: string;
  url: string;
  snippet: string;
  timestamp: string;
}

export default function SearchTool({ isActive }: ToolProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const performSearch = async () => {
    if (!query.trim() || isSearching) return;
    
    setIsSearching(true);
    setHasSearched(true);
    
    // Simulate search delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock search results
    const mockResults: SearchResult[] = [
      {
        id: "1",
        title: "AI Development Best Practices - Complete Guide",
        url: "https://example.com/ai-development-guide",
        snippet: "Learn the essential best practices for developing AI applications, including model training, deployment strategies, and performance optimization techniques.",
        timestamp: "2 hours ago"
      },
      {
        id: "2", 
        title: "Building Agentic AI Systems with TypeScript",
        url: "https://example.com/agentic-ai-typescript",
        snippet: "A comprehensive tutorial on creating intelligent agents that can use tools and make decisions autonomously using modern TypeScript frameworks.",
        timestamp: "1 day ago"
      },
      {
        id: "3",
        title: "Terminal Integration for Web Applications",
        url: "https://example.com/terminal-web-integration", 
        snippet: "How to embed terminal functionality in web apps using xterm.js and WebSocket connections for real-time command execution.",
        timestamp: "3 days ago"
      },
      {
        id: "4",
        title: "Monaco Editor Integration Guide",
        url: "https://example.com/monaco-editor-integration",
        snippet: "Step-by-step guide to integrating Monaco Editor (VS Code's editor) into React applications with syntax highlighting and IntelliSense.",
        timestamp: "1 week ago"
      }
    ].filter(result => 
      result.title.toLowerCase().includes(query.toLowerCase()) ||
      result.snippet.toLowerCase().includes(query.toLowerCase())
    );
    
    setResults(mockResults);
    setIsSearching(false);
  };

  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="tool-panel h-full flex flex-col"
    >
      {/* Search Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Web Search</h2>
        </div>
      </div>

      {/* Search Input */}
      <div className="flex items-center gap-2 mb-6">
        <div className="flex items-center flex-1 gap-2 bg-muted rounded-2xl px-4 py-3">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && performSearch()}
            className="border-none bg-transparent px-0 focus-visible:ring-0"
            placeholder="Search the web..."
          />
        </div>
        <Button 
          onClick={performSearch}
          disabled={!query.trim() || isSearching}
          className="px-6"
        >
          {isSearching ? "Searching..." : "Search"}
        </Button>
      </div>

      {/* Search Results */}
      <div className="flex-1 overflow-y-auto">
        {isSearching && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Search className="w-6 h-6 text-primary" />
              </motion.div>
              <span className="text-muted-foreground">Searching...</span>
            </div>
          </div>
        )}

        {!isSearching && !hasSearched && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Search the Web</h3>
            <p className="text-muted-foreground">
              Enter a query to search for information across the internet.
            </p>
          </div>
        )}

        {!isSearching && hasSearched && (
          <div className="space-y-4">
            {results.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No results found for "{query}". Try a different search term.
                </p>
              </div>
            ) : (
              <>
                <div className="text-sm text-muted-foreground mb-4">
                  Found {results.length} results for "{query}"
                </div>
                
                {results.map((result) => (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200 mb-1">
                              {result.title}
                            </h3>
                            
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                              <Globe className="w-3 h-3" />
                              <span className="truncate">{result.url}</span>
                              <Clock className="w-3 h-3 ml-2" />
                              <span>{result.timestamp}</span>
                            </div>
                            
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {result.snippet}
                            </p>
                          </div>
                          
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}