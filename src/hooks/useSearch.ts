import { useState, useCallback } from 'react';
import { searchService, type SearchResponse } from '@/services/search/searchService';

export function useSearch() {
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string, maxResults?: number): Promise<SearchResponse | null> => {
    if (!query.trim()) {
      setError('Query cannot be empty');
      return null;
    }

    setIsSearching(true);
    setError(null);

    try {
      const response = await searchService.search(query, maxResults);
      
      if (response.error) {
        setError(response.error);
      } else {
        setResults(response);
      }
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      setError(errorMessage);
      return null;
    } finally {
      setIsSearching(false);
    }
  }, []);

  return {
    search,
    isSearching,
    results,
    error,
    clearResults: () => setResults(null),
    clearError: () => setError(null),
  };
}