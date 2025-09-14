import { supabase } from "@/integrations/supabase/client";

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIServiceResponse {
  content: string;
  error?: string;
}

export class AIService {
  private static instance: AIService;

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  async sendMessage(messages: ChatMessage[]): Promise<AIServiceResponse> {
    console.log('AIService: sendMessage called with', messages.length, 'messages');
    
    try {
      console.log('AIService: Invoking ai-chat function...');
      
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { messages, stream: false }
      });

      console.log('AIService: Function response:', { data, error });

      if (error) {
        console.error('AIService: AI service error:', error);
        throw new Error(error.message || 'Failed to get AI response');
      }

      const response = {
        content: data.choices[0]?.message?.content || 'No response received',
      };
      
      console.log('AIService: Returning response:', response);
      return response;
      
    } catch (error) {
      console.error('AIService: Error calling AI service:', error);
      return {
        content: '',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async sendMessageStream(
    messages: ChatMessage[], 
    onChunk: (chunk: string) => void
  ): Promise<void> {
    try {
      const response = await fetch('https://jemhwgcrocepusudmnpp.supabase.co/functions/v1/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplbWh3Z2Nyb2NlcHVzdWRtbnBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3MTU0NzYsImV4cCI6MjA3MjI5MTQ3Nn0.QjrUzFERhDqHCn2KGYuY62X_rThfawKGhsG2PB1n2xY',
        },
        body: JSON.stringify({ messages, stream: true }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No reader available');
      }

      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                onChunk(content);
              }
            } catch (e) {
              // Ignore parse errors for incomplete chunks
            }
          }
        }
      }
    } catch (error) {
      console.error('Error in streaming AI service:', error);
      throw error;
    }
  }
}

export const aiService = AIService.getInstance();