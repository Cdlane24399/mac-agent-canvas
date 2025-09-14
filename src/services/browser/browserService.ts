import { supabase } from "@/integrations/supabase/client";

export interface BrowserSession {
  sessionId: string;
  status: string;
  previewUrl?: string;
}

export interface NavigationResult {
  url: string;
  title: string;
  status: string;
}

export interface ActionResult {
  action: string;
  selector?: string;
  text?: string;
  imageUrl?: string;
  status: string;
}

export class BrowserService {
  private static instance: BrowserService;
  private currentSessionId: string | null = null;
  private previewUrl: string | null = null;

  static getInstance(): BrowserService {
    if (!BrowserService.instance) {
      BrowserService.instance = new BrowserService();
    }
    return BrowserService.instance;
  }

  async createSession(): Promise<BrowserSession> {
    try {
      console.log('Creating new browser session...');

      const { data, error } = await supabase.functions.invoke('browser-session', {
        body: { action: 'create' }
      });

      if (error) {
        console.error('Browser session creation error:', error);
        throw new Error(error.message || 'Failed to create browser session');
      }

      this.currentSessionId = data.sessionId;
      this.previewUrl = data.previewUrl;
      console.log('Browser session created:', this.currentSessionId);

      return {
        sessionId: data.sessionId,
        status: data.status,
        previewUrl: data.previewUrl,
      };
    } catch (error) {
      console.error('Error creating browser session:', error);
      throw error;
    }
  }

  async navigate(url: string, sessionId?: string): Promise<NavigationResult> {
    try {
      const targetSessionId = sessionId || this.currentSessionId;
      
      if (!targetSessionId) {
        throw new Error('No active browser session. Please create a session first.');
      }

      console.log('Navigating to:', url, 'in session:', targetSessionId);

      const { data, error } = await supabase.functions.invoke('browser-session', {
        body: { 
          action: 'navigate',
          sessionId: targetSessionId,
          url: url,
        }
      });

      if (error) {
        console.error('Navigation error:', error);
        throw new Error(error.message || 'Failed to navigate');
      }

      console.log('Navigation completed to:', data.url);

      return {
        url: data.url,
        title: data.title || '',
        status: data.status,
      };
    } catch (error) {
      console.error('Error navigating:', error);
      throw error;
    }
  }

  async click(selector: string, sessionId?: string): Promise<ActionResult> {
    try {
      const targetSessionId = sessionId || this.currentSessionId;
      
      if (!targetSessionId) {
        throw new Error('No active browser session. Please create a session first.');
      }

      console.log('Clicking element:', selector, 'in session:', targetSessionId);

      const { data, error } = await supabase.functions.invoke('browser-session', {
        body: { 
          action: 'click',
          sessionId: targetSessionId,
          selector: selector,
        }
      });

      if (error) {
        console.error('Click error:', error);
        throw new Error(error.message || 'Failed to click element');
      }

      console.log('Click completed on:', selector);

      return {
        action: data.action,
        selector: data.selector,
        status: data.status,
      };
    } catch (error) {
      console.error('Error clicking element:', error);
      throw error;
    }
  }

  async type(selector: string, text: string, sessionId?: string): Promise<ActionResult> {
    try {
      const targetSessionId = sessionId || this.currentSessionId;
      
      if (!targetSessionId) {
        throw new Error('No active browser session. Please create a session first.');
      }

      console.log('Typing text in:', selector, 'in session:', targetSessionId);

      const { data, error } = await supabase.functions.invoke('browser-session', {
        body: { 
          action: 'type',
          sessionId: targetSessionId,
          selector: selector,
          text: text,
        }
      });

      if (error) {
        console.error('Type error:', error);
        throw new Error(error.message || 'Failed to type text');
      }

      console.log('Type completed in:', selector);

      return {
        action: data.action,
        selector: data.selector,
        text: data.text,
        status: data.status,
      };
    } catch (error) {
      console.error('Error typing text:', error);
      throw error;
    }
  }

  async takeScreenshot(sessionId?: string): Promise<ActionResult> {
    try {
      const targetSessionId = sessionId || this.currentSessionId;
      
      if (!targetSessionId) {
        throw new Error('No active browser session. Please create a session first.');
      }

      console.log('Taking screenshot in session:', targetSessionId);

      const { data, error } = await supabase.functions.invoke('browser-session', {
        body: { 
          action: 'screenshot',
          sessionId: targetSessionId,
        }
      });

      if (error) {
        console.error('Screenshot error:', error);
        throw new Error(error.message || 'Failed to take screenshot');
      }

      console.log('Screenshot taken');

      return {
        action: data.action,
        imageUrl: data.imageUrl,
        status: data.status,
      };
    } catch (error) {
      console.error('Error taking screenshot:', error);
      throw error;
    }
  }

  async closeSession(sessionId?: string): Promise<void> {
    try {
      const targetSessionId = sessionId || this.currentSessionId;
      
      if (!targetSessionId) {
        console.log('No active browser session to close');
        return;
      }

      console.log('Closing browser session:', targetSessionId);

      const { error } = await supabase.functions.invoke('browser-session', {
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
        this.previewUrl = null;
      }

      console.log('Browser session closed');
    } catch (error) {
      console.error('Error closing browser session:', error);
      // Don't throw error for close operations
    }
  }

  getCurrentSessionId(): string | null {
    return this.currentSessionId;
  }

  getPreviewUrl(): string | null {
    return this.previewUrl;
  }

  hasActiveSession(): boolean {
    return this.currentSessionId !== null;
  }
}

export const browserService = BrowserService.getInstance();