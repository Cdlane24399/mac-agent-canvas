import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, maxResults = 5 } = await req.json();
    const tavilyApiKey = Deno.env.get('TAVILY_API_KEY');

    if (!tavilyApiKey) {
      throw new Error('Tavily API key not configured');
    }

    if (!query) {
      throw new Error('Query parameter is required');
    }

    console.log('Searching with Tavily:', query);

    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tavilyApiKey}`,
      },
      body: JSON.stringify({
        query: query,
        search_depth: "basic",
        include_answer: true,
        include_images: false,
        include_raw_content: false,
        max_results: maxResults,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Tavily API error:', errorText);
      throw new Error(`Tavily API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Tavily response received:', data.results?.length || 0, 'results');

    const formattedResults = data.results?.map((result: any) => ({
      title: result.title || '',
      url: result.url || '',
      snippet: result.content || '',
      publishedDate: result.published_date || null,
    })) || [];

    return new Response(JSON.stringify({
      query,
      results: formattedResults,
      answer: data.answer || null,
      totalResults: formattedResults.length,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in web-search function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        query: null,
        results: [],
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});