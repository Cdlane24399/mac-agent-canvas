import { useState, useCallback, useEffect } from 'react';
import { terminalService, type TerminalSession, type CommandResult } from '@/services/terminal/terminalService';

export function useTerminal() {
  const [session, setSession] = useState<TerminalSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [commands, setCommands] = useState<CommandResult[]>([]);

  const createSession = useCallback(async (): Promise<TerminalSession | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const newSession = await terminalService.createSession();
      setSession(newSession);
      setCommands([]); // Reset commands for new session
      return newSession;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create terminal session';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const executeCommand = useCallback(async (command: string): Promise<CommandResult | null> => {
    if (!session) {
      setError('No active terminal session. Please create a session first.');
      return null;
    }

    if (!command.trim()) {
      setError('Command cannot be empty');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await terminalService.executeCommand(command);
      setCommands(prev => [...prev, result]);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Command execution failed';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  const closeSession = useCallback(async (): Promise<void> => {
    if (!session) return;

    try {
      await terminalService.closeSession();
      setSession(null);
      setCommands([]);
    } catch (err) {
      console.error('Failed to close session:', err);
      // Don't set error for close operations
    }
  }, [session]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (session) {
        terminalService.closeSession().catch(console.error);
      }
    };
  }, [session]);

  return {
    session,
    commands,
    isLoading,
    error,
    createSession,
    executeCommand,
    closeSession,
    clearError: () => setError(null),
    hasActiveSession: terminalService.hasActiveSession(),
  };
}