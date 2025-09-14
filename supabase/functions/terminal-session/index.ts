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
    const { action, sessionId, command } = await req.json();
    const e2bApiKey = Deno.env.get('E2B_API_KEY');

    if (!e2bApiKey) {
      throw new Error('E2B API key not configured');
    }

    console.log('E2B action:', action, 'sessionId:', sessionId);

    switch (action) {
      case 'create': {
        // Create a new E2B sandbox session
        const response = await fetch('https://api.e2b.dev/sessions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${e2bApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            template: 'base',
          }),
        });

        if (!response.ok) {
          const error = await response.text();
          console.error('E2B create session error:', error);
          throw new Error(`Failed to create E2B session: ${response.status}`);
        }

        const data = await response.json();
        console.log('E2B session created:', data.sessionId);

        return new Response(JSON.stringify({
          sessionId: data.sessionId,
          status: 'created',
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'execute': {
        if (!sessionId || !command) {
          throw new Error('Session ID and command are required for execution');
        }

        // Execute command in E2B session
        const response = await fetch(`https://api.e2b.dev/sessions/${sessionId}/terminal`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${e2bApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            command: command,
          }),
        });

        if (!response.ok) {
          const error = await response.text();
          console.error('E2B execute command error:', error);
          throw new Error(`Failed to execute command: ${response.status}`);
        }

        const data = await response.json();
        console.log('E2B command executed, exit code:', data.exitCode);

        return new Response(JSON.stringify({
          command,
          output: data.stdout || '',
          error: data.stderr || '',
          exitCode: data.exitCode || 0,
          executionTime: data.executionTimeMs || 0,
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'close': {
        if (!sessionId) {
          throw new Error('Session ID is required for closing');
        }

        // Close E2B session
        const response = await fetch(`https://api.e2b.dev/sessions/${sessionId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${e2bApiKey}`,
          },
        });

        if (!response.ok) {
          const error = await response.text();
          console.error('E2B close session error:', error);
          // Don't throw error for close, as session might already be closed
        }

        console.log('E2B session closed:', sessionId);

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
    console.error('Error in terminal-session function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});