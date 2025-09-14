export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  component: React.ComponentType<ToolProps>;
}

export interface ToolProps {
  isActive: boolean;
  onMessage?: (message: string) => void;
}

export interface AIMessage {
  id: string;
  type: 'user' | 'assistant' | 'tool-call';
  content: string;
  toolId?: string;
  timestamp: Date;
}

export interface AgentAction {
  type: 'use-tool' | 'respond' | 'search' | 'file-operation';
  toolId?: string;
  parameters?: Record<string, any>;
  reasoning?: string;
}