import { useState, useCallback } from 'react';
import { aiService, type ChatMessage, type AIServiceResponse } from '@/services/ai/aiService';

export interface UseAIOptions {
  onChunk?: (chunk: string) => void;
  streaming?: boolean;
}

export function useAI(options: UseAIOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (
    messages: ChatMessage[]
  ): Promise<AIServiceResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      if (options.streaming && options.onChunk) {
        await aiService.sendMessageStream(messages, options.onChunk);
        return { content: '' }; // Content is delivered via chunks
      } else {
        const response = await aiService.sendMessage(messages);
        if (response.error) {
          setError(response.error);
        }
        return response;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return { content: '', error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [options.streaming, options.onChunk]);

  return {
    sendMessage,
    isLoading,
    error,
    clearError: () => setError(null),
  };
}