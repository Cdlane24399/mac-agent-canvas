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
    const { action, sessionId, url, selector, text, screenshot } = await req.json();
    const hyperbrowserApiKey = Deno.env.get('HYPERBROWSER_API_KEY');

    if (!hyperbrowserApiKey) {
      throw new Error('Hyperbrowser API key not configured');
    }

    console.log('Hyperbrowser action:', action, 'sessionId:', sessionId);

    const baseHeaders = {
      'Authorization': `Bearer ${hyperbrowserApiKey}`,
      'Content-Type': 'application/json',
    };

    switch (action) {
      case 'create': {
        const response = await fetch('https://api.hyperbrowser.ai/sessions', {
          method: 'POST',
          headers: baseHeaders,
          body: JSON.stringify({
            browserType: 'chromium',
            viewport: { width: 1280, height: 720 },
            headless: false,
          }),
        });

        if (!response.ok) {
          const error = await response.text();
          console.error('Hyperbrowser create session error:', error);
          throw new Error(`Failed to create browser session: ${response.status}`);
        }

        const data = await response.json();
        console.log('Hyperbrowser session created:', data.sessionId);

        return new Response(JSON.stringify({
          sessionId: data.sessionId,
          status: 'created',
          previewUrl: data.previewUrl || null,
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'navigate': {
        if (!sessionId || !url) {
          throw new Error('Session ID and URL are required for navigation');
        }

        const response = await fetch(`https://api.hyperbrowser.ai/sessions/${sessionId}/navigate`, {
          method: 'POST',
          headers: baseHeaders,
          body: JSON.stringify({ url }),
        });

        if (!response.ok) {
          const error = await response.text();
          console.error('Hyperbrowser navigate error:', error);
          throw new Error(`Failed to navigate: ${response.status}`);
        }

        const data = await response.json();
        
        return new Response(JSON.stringify({
          url: data.url || url,
          title: data.title || '',
          status: 'navigated',
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'click': {
        if (!sessionId || !selector) {
          throw new Error('Session ID and selector are required for clicking');
        }

        const response = await fetch(`https://api.hyperbrowser.ai/sessions/${sessionId}/click`, {
          method: 'POST',
          headers: baseHeaders,
          body: JSON.stringify({ selector }),
        });

        if (!response.ok) {
          const error = await response.text();
          console.error('Hyperbrowser click error:', error);
          throw new Error(`Failed to click element: ${response.status}`);
        }

        return new Response(JSON.stringify({
          action: 'click',
          selector,
          status: 'completed',
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'type': {
        if (!sessionId || !selector || !text) {
          throw new Error('Session ID, selector, and text are required for typing');
        }

        const response = await fetch(`https://api.hyperbrowser.ai/sessions/${sessionId}/type`, {
          method: 'POST',
          headers: baseHeaders,
          body: JSON.stringify({ selector, text }),
        });

        if (!response.ok) {
          const error = await response.text();
          console.error('Hyperbrowser type error:', error);
          throw new Error(`Failed to type text: ${response.status}`);
        }

        return new Response(JSON.stringify({
          action: 'type',
          selector,
          text,
          status: 'completed',
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'screenshot': {
        if (!sessionId) {
          throw new Error('Session ID is required for screenshot');
        }

        const response = await fetch(`https://api.hyperbrowser.ai/sessions/${sessionId}/screenshot`, {
          method: 'POST',
          headers: baseHeaders,
        });

        if (!response.ok) {
          const error = await response.text();
          console.error('Hyperbrowser screenshot error:', error);
          throw new Error(`Failed to take screenshot: ${response.status}`);
        }

        const data = await response.json();

        return new Response(JSON.stringify({
          action: 'screenshot',
          imageUrl: data.imageUrl || null,
          status: 'completed',
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'close': {
        if (!sessionId) {
          throw new Error('Session ID is required for closing');
        }

        const response = await fetch(`https://api.hyperbrowser.ai/sessions/${sessionId}`, {
          method: 'DELETE',
          headers: baseHeaders,
        });

        if (!response.ok) {
          const error = await response.text();
          console.error('Hyperbrowser close session error:', error);
          // Don't throw error for close, as session might already be closed
        }

        console.log('Hyperbrowser session closed:', sessionId);

        return new Response(JSON.stringify({
          sessionId,
          status: 'closed',
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }

  } catch (error) {
    console.error('Error in browser-session function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});