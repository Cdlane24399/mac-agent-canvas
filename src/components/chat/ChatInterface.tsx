import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Terminal, Code, Globe, Search, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import AICallout from "@/components/ai/AICallout";
import ToolHeader from "./ToolHeader";
import ToolPanel from "./ToolPanel";
import { useAI } from "@/hooks/useAI";
import type { AIMessage } from "@/types";

interface ActiveTool {
  id: string;
  type: 'terminal' | 'editor' | 'browser' | 'search' | 'files';
  messageId: string;
}

const toolIcons = {
  terminal: <Terminal className="w-4 h-4 text-primary" />,
  editor: <Code className="w-4 h-4 text-primary" />,
  browser: <Globe className="w-4 h-4 text-primary" />,
  search: <Search className="w-4 h-4 text-primary" />,
  files: <FileText className="w-4 h-4 text-primary" />
};

const toolNames = {
  terminal: "Terminal",
  editor: "Code Editor", 
  browser: "Web Browser",
  search: "Web Search",
  files: "File Manager"
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: "1",
      type: "assistant", 
      content: "Hello! I'm your autonomous AI agent with real integrations. I can help you complete complex tasks using live services:\n\n🤖 **Real Service Integrations:**\n• **AI Chat** - Powered by OpenAI GPT models\n• **Web Search** - Live results via Tavily API\n• **Terminal** - Execute real commands with E2B sandboxes\n• **Browser** - Live browser automation with Hyperbrowser\n\n📋 **Available Tools:**\n🖥️ Live Terminal | 🌐 Live Browser | 🔍 Real Search | 💻 Code Editor | 📁 Files\n\nJust describe what you want to accomplish, and I'll use real services to help you. Try something like:\n• \"Search for the latest React tutorials\"\n• \"Run some terminal commands\" \n• \"Browse to GitHub and navigate around\"\n• \"Help me with coding questions\"",
      timestamp: new Date()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTools, setActiveTools] = useState<ActiveTool[]>([]);
  const [currentTool, setCurrentTool] = useState<ActiveTool | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const [aiResponse, setAiResponse] = useState("");
  const { sendMessage: sendAIMessage, isLoading: aiLoading, error: aiError } = useAI({
    streaming: true,
    onChunk: (chunk: string) => {
      setAiResponse(prev => prev + chunk);
    }
  });

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeTools]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async () => {
    if (!currentMessage.trim() || isProcessing) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      type: "user",
      content: currentMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage("");
    setIsProcessing(true);

    // Get AI processing and tool selection
    await simulateAIResponse(currentMessage, userMessage.id);
    setIsProcessing(false);
  };

  const simulateAIResponse = async (userInput: string, userMessageId: string) => {
    // Determine tool to use based on input
    let toolType: ActiveTool['type'] | null = null;
    const lowerInput = userInput.toLowerCase();

    if (lowerInput.includes('terminal') || lowerInput.includes('command') || lowerInput.includes('shell') || lowerInput.includes('run')) {
      toolType = 'terminal';
    } else if (lowerInput.includes('code') || lowerInput.includes('edit') || lowerInput.includes('file')) {
      toolType = 'editor';
    } else if (lowerInput.includes('browse') || lowerInput.includes('web') || lowerInput.includes('website') || lowerInput.includes('browser')) {
      toolType = 'browser';
    } else if (lowerInput.includes('search') || lowerInput.includes('find') || lowerInput.includes('look up')) {
      toolType = 'search';
    } else if (lowerInput.includes('folder') || lowerInput.includes('directory') || lowerInput.includes('files')) {
      toolType = 'files';
    }

    // Get AI response using real AI service
    setAiResponse("");
    const aiMessageId = (Date.now() + 1).toString();
    
    // Create placeholder message for streaming
    const aiMessage: AIMessage = {
      id: aiMessageId,
      type: "assistant",
      content: "",
      toolId: toolType || undefined,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMessage]);

    try {
      // Send message to AI with context about available tools
      const systemMessage = {
        role: 'system' as const,
        content: `You are an autonomous AI agent with access to real tools: Terminal (E2B), Web Search (Tavily), Browser Automation (Hyperbrowser), Code Editor, and File Manager. When users ask for help, you can suggest using these tools and provide helpful responses. Be concise but informative.`
      };

      const userMessage = {
        role: 'user' as const,
        content: userInput
      };

      await sendAIMessage([systemMessage, userMessage]);
      
      // Update the message with the complete response
      setMessages(prev => prev.map(msg => 
        msg.id === aiMessageId 
          ? { ...msg, content: aiResponse }
          : msg
      ));

    } catch (error) {
      console.error('AI response error:', error);
      const fallbackResponse = toolType 
        ? `I'll open the ${toolNames[toolType]} tool for you.`
        : `I can help you with that. I have access to several tools including Terminal, Browser, Search, Code Editor, and File Manager. What would you like me to do?`;
        
      setMessages(prev => prev.map(msg => 
        msg.id === aiMessageId 
          ? { ...msg, content: fallbackResponse }
          : msg
      ));
    }

    // Add tool if needed
    if (toolType) {
      const newTool: ActiveTool = {
        id: Date.now().toString() + toolType,
        type: toolType,
        messageId: aiMessageId
      };
      
      setActiveTools(prev => [...prev, newTool]);
      setCurrentTool(newTool);
    }
  };

  const closeTool = (toolId: string) => {
    setActiveTools(prev => prev.filter(tool => tool.id !== toolId));
    if (currentTool?.id === toolId) {
      setCurrentTool(null);
    }
  };

  const closeCurrentTool = () => {
    if (currentTool) {
      closeTool(currentTool.id);
    }
  };


  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex h-full">
      {/* Main Chat Area */}
      <div className={`flex flex-col transition-all duration-300 ${
        currentTool ? 'flex-1' : 'w-full'
      }`}>
        {/* Chat Header */}
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center">
            <Bot className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-foreground">AI Assistant</h1>
            <p className="text-sm text-muted-foreground">with Integrated Tools</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-2xl mx-auto space-y-4">
            {messages.map((message, index) => (
              <div key={message.id}>
                {/* Message */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${
                    message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    message.type === 'user' 
                      ? 'bg-secondary text-secondary-foreground' 
                      : 'bg-primary text-primary-foreground'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                  
                  <div className={`flex-1 ${
                    message.type === 'user' ? 'text-right' : 'text-left'
                  }`}>
                    <div className={`inline-block p-3 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                    }`}>
                      <div className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </div>
                    </div>
                    
                    <div className="text-xs text-muted-foreground mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </div>

                    {/* Tool Headers */}
                    {activeTools
                      .filter(tool => tool.messageId === message.id)
                      .map(tool => (
                        <ToolHeader
                          key={tool.id}
                          title={toolNames[tool.type]}
                          icon={toolIcons[tool.type]}
                          onClose={() => closeTool(tool.id)}
                        />
                      ))}
                  </div>
                </motion.div>
              </div>
            ))}
            
            {isProcessing && (
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </div>
                <AICallout message="Analyzing your request and selecting the best tool..." isThinking />
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input */}
        <div className="p-4">
          <div className="flex items-center gap-3 max-w-2xl mx-auto">
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me to open a tool or help with a task..."
                disabled={isProcessing}
                className="min-h-[48px] max-h-24 resize-none bg-background border-border rounded-3xl px-4 py-3 pr-12"
                rows={1}
              />
              {currentMessage.trim() && (
                <Button 
                  onClick={sendMessage}
                  disabled={isProcessing}
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 bg-white hover:bg-gray-100 text-black rounded-full shadow-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 19V5M5 12L12 5L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tool Panel */}
      <AnimatePresence>
        {currentTool && (
          <ToolPanel 
            activeTool={currentTool}
            onClose={closeCurrentTool}
          />
        )}
      </AnimatePresence>
    </div>
  );
}