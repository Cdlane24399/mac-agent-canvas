import { useState, useCallback, useEffect } from 'react';
import { browserService, type BrowserSession, type NavigationResult, type ActionResult } from '@/services/browser/browserService';

export function useBrowser() {
  const [session, setSession] = useState<BrowserSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [currentTitle, setCurrentTitle] = useState<string>('');
  const [actionLog, setActionLog] = useState<string[]>([]);

  const createSession = useCallback(async (): Promise<BrowserSession | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const newSession = await browserService.createSession();
      setSession(newSession);
      setCurrentUrl('');
      setCurrentTitle('');
      setActionLog(['Browser session created']);
      return newSession;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create browser session';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const navigate = useCallback(async (url: string): Promise<NavigationResult | null> => {
    if (!session) {
      setError('No active browser session. Please create a session first.');
      return null;
    }

    if (!url.trim()) {
      setError('URL cannot be empty');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await browserService.navigate(url);
      setCurrentUrl(result.url);
      setCurrentTitle(result.title);
      setActionLog(prev => [...prev, `Navigated to: ${result.url}`]);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Navigation failed';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  const click = useCallback(async (selector: string): Promise<ActionResult | null> => {
    if (!session) {
      setError('No active browser session. Please create a session first.');
      return null;
    }

    if (!selector.trim()) {
      setError('Selector cannot be empty');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await browserService.click(selector);
      setActionLog(prev => [...prev, `Clicked element: ${selector}`]);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Click action failed';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  const type = useCallback(async (selector: string, text: string): Promise<ActionResult | null> => {
    if (!session) {
      setError('No active browser session. Please create a session first.');
      return null;
    }

    if (!selector.trim() || !text.trim()) {
      setError('Selector and text cannot be empty');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await browserService.type(selector, text);
      setActionLog(prev => [...prev, `Typed "${text}" in: ${selector}`]);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Type action failed';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  const takeScreenshot = useCallback(async (): Promise<ActionResult | null> => {
    if (!session) {
      setError('No active browser session. Please create a session first.');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await browserService.takeScreenshot();
      setActionLog(prev => [...prev, 'Screenshot taken']);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Screenshot failed';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  const closeSession = useCallback(async (): Promise<void> => {
    if (!session) return;

    try {
      await browserService.closeSession();
      setSession(null);
      setCurrentUrl('');
      setCurrentTitle('');
      setActionLog([]);
    } catch (err) {
      console.error('Failed to close session:', err);
      // Don't set error for close operations
    }
  }, [session]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (session) {
        browserService.closeSession().catch(console.error);
      }
    };
  }, [session]);

  return {
    session,
    currentUrl,
    currentTitle,
    actionLog,
    isLoading,
    error,
    createSession,
    navigate,
    click,
    type,
    takeScreenshot,
    closeSession,
    clearError: () => setError(null),
    hasActiveSession: browserService.hasActiveSession(),
    previewUrl: browserService.getPreviewUrl(),
  };
}