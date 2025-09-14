import { useState, useCallback } from 'react';
import type { AgentAction } from '@/types';

export interface AgentState {
  isProcessing: boolean;
  currentAction: AgentAction | null;
  reasoning: string | null;
}

export const useAgent = () => {
  const [state, setState] = useState<AgentState>({
    isProcessing: false,
    currentAction: null,
    reasoning: null
  });

  const processUserRequest = useCallback(async (input: string): Promise<AgentAction> => {
    setState(prev => ({ ...prev, isProcessing: true }));

    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // Simple rule-based tool selection (in production, this would use LLM)
    let action: AgentAction;

    const lowerInput = input.toLowerCase();

    if (lowerInput.includes('terminal') || lowerInput.includes('command') || lowerInput.includes('shell')) {
      action = {
        type: 'use-tool',
        toolId: 'terminal',
        reasoning: 'User wants to execute terminal commands',
        parameters: { command: extractCommand(input) }
      };
    } else if (lowerInput.includes('code') || lowerInput.includes('edit') || lowerInput.includes('file')) {
      action = {
        type: 'use-tool',
        toolId: 'editor',
        reasoning: 'User wants to edit code or files',
        parameters: { file: extractFilename(input) }
      };
    } else if (lowerInput.includes('browse') || lowerInput.includes('web') || lowerInput.includes('website')) {
      action = {
        type: 'use-tool',
        toolId: 'browser',
        reasoning: 'User wants to browse the web',
        parameters: { url: extractUrl(input) }
      };
    } else if (lowerInput.includes('search') || lowerInput.includes('find') || lowerInput.includes('look up')) {
      action = {
        type: 'use-tool',
        toolId: 'search',
        reasoning: 'User wants to search for information',
        parameters: { query: extractSearchQuery(input) }
      };
    } else if (lowerInput.includes('folder') || lowerInput.includes('directory') || lowerInput.includes('files')) {
      action = {
        type: 'use-tool',
        toolId: 'files',
        reasoning: 'User wants to manage files and folders',
        parameters: { path: extractPath(input) }
      };
    } else {
      action = {
        type: 'respond',
        reasoning: 'General conversation or unclear intent',
        parameters: { response: generateResponse(input) }
      };
    }

    setState(prev => ({ 
      ...prev, 
      isProcessing: false, 
      currentAction: action,
      reasoning: action.reasoning 
    }));

    return action;
  }, []);

  const clearAction = useCallback(() => {
    setState(prev => ({ ...prev, currentAction: null, reasoning: null }));
  }, []);

  return {
    state,
    processUserRequest,
    clearAction
  };
};

// Helper functions to extract parameters from user input
function extractCommand(input: string): string | null {
  const commandMatch = input.match(/(?:run|execute|command)\s+["']([^"']+)["']|`([^`]+)`/i);
  return commandMatch ? (commandMatch[1] || commandMatch[2]) : null;
}

function extractFilename(input: string): string | null {
  const fileMatch = input.match(/([a-zA-Z0-9_-]+\.[a-zA-Z]{1,4})/);
  return fileMatch ? fileMatch[1] : null;
}

function extractUrl(input: string): string | null {
  const urlMatch = input.match(/(https?:\/\/[^\s]+)/i);
  return urlMatch ? urlMatch[1] : null;
}

function extractSearchQuery(input: string): string {
  // Remove common search trigger words and return the rest
  return input
    .replace(/(?:search|find|look up|google)\s+(?:for\s+)?/gi, '')
    .trim();
}

function extractPath(input: string): string | null {
  const pathMatch = input.match(/\/[^\s]*/);
  return pathMatch ? pathMatch[0] : null;
}

function generateResponse(input: string): string {
  const responses = [
    "I understand you're asking about: " + input,
    "Let me help you with that request.",
    "I can assist you with various tasks using my available tools.",
    "Would you like me to use a specific tool to help with this?"
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}