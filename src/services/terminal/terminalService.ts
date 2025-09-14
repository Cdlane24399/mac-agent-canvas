import { supabase } from "@/integrations/supabase/client";

export interface TerminalSession {
  sessionId: string;
  status: string;
}

export interface CommandResult {
  command: string;
  output: string;
  error: string;
  exitCode: number;
  executionTime: number;
}

export class TerminalService {
  private static instance: TerminalService;
  private currentSessionId: string | null = null;

  static getInstance(): TerminalService {
    if (!TerminalService.instance) {
      TerminalService.instance = new TerminalService();
    }
    return TerminalService.instance;
  }

  async createSession(): Promise<TerminalSession> {
    try {
      console.log('Creating new terminal session...');

      const { data, error } = await supabase.functions.invoke('terminal-session', {
        body: { action: 'create' }
      });

      if (error) {
        console.error('Terminal session creation error:', error);
        throw new Error(error.message || 'Failed to create terminal session');
      }

      this.currentSessionId = data.sessionId;
      console.log('Terminal session created:', this.currentSessionId);

      return {
        sessionId: data.sessionId,
        status: data.status,
      };
    } catch (error) {
      console.error('Error creating terminal session:', error);
      throw error;
    }
  }

  async executeCommand(command: string, sessionId?: string): Promise<CommandResult> {
    try {
      const targetSessionId = sessionId || this.currentSessionId;
      
      if (!targetSessionId) {
        throw new Error('No active terminal session. Please create a session first.');
      }

      console.log('Executing command:', command, 'in session:', targetSessionId);

      const { data, error } = await supabase.functions.invoke('terminal-session', {
        body: { 
          action: 'execute',
          sessionId: targetSessionId,
          command: command,
        }
      });

      if (error) {
        console.error('Command execution error:', error);
        throw new Error(error.message || 'Failed to execute command');
      }

      console.log('Command executed, exit code:', data.exitCode);

      return {
        command: data.command,
        output: data.output || '',
        error: data.error || '',
        exitCode: data.exitCode || 0,
        executionTime: data.executionTime || 0,
      };
    } catch (error) {
      console.error('Error executing command:', error);
      throw error;
    }
  }

  async closeSession(sessionId?: string): Promise<void> {
    try {
      const targetSessionId = sessionId || this.currentSessionId;
      
      if (!targetSessionId) {
        console.log('No active session to close');
        return;
      }

      console.log('Closing terminal session:', targetSessionId);

      const { error } = await supabase.functions.invoke('terminal-session', {
        body: { 
          action: 'close',
          sessionId: targetSessionId,
        }
      });

      if (error) {
        console.error('Session close error:', error);
        // Don't throw error for close operations
      }

      if (targetSessionId === this.currentSessionId) {
        this.currentSessionId = null;
      }

      console.log('Terminal session closed');
    } catch (error) {
      console.error('Error closing terminal session:', error);
      // Don't throw error for close operations
    }
  }

  getCurrentSessionId(): string | null {
    return this.currentSessionId;
  }

  hasActiveSession(): boolean {
    return this.currentSessionId !== null;
  }
}

export const terminalService = TerminalService.getInstance();