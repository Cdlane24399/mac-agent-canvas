import { supabase } from "@/integrations/supabase/client";

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  publishedDate?: string;
}

export interface SearchResponse {
  query: string;
  results: SearchResult[];
  answer?: string;
  totalResults: number;
  error?: string;
}

export class SearchService {
  private static instance: SearchService;

  static getInstance(): SearchService {
    if (!SearchService.instance) {
      SearchService.instance = new SearchService();
    }
    return SearchService.instance;
  }

  async search(query: string, maxResults: number = 5): Promise<SearchResponse> {
    try {
      console.log('Searching for:', query);

      const { data, error } = await supabase.functions.invoke('web-search', {
        body: { query, maxResults }
      });

      if (error) {
        console.error('Search service error:', error);
        throw new Error(error.message || 'Search failed');
      }

      console.log('Search completed:', data.totalResults, 'results');

      return {
        query: data.query,
        results: data.results || [],
        answer: data.answer,
        totalResults: data.totalResults || 0,
      };
    } catch (error) {
      console.error('Error calling search service:', error);
      return {
        query,
        results: [],
        totalResults: 0,
        error: error instanceof Error ? error.message : 'Unknown search error',
      };
    }
  }
}

export const searchService = SearchService.getInstance();