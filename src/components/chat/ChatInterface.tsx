import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Bot, User, Terminal, Code, Globe, Search, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import AICallout from "@/components/ai/AICallout";
import InlineToolWrapper from "./InlineToolWrapper";
import AgentTerminalTool from "@/components/tools/AgentTerminalTool";
import AgentEditorTool from "@/components/tools/AgentEditorTool";
import AgentBrowserTool from "@/components/tools/AgentBrowserTool";
import AgentSearchTool from "@/components/tools/AgentSearchTool";
import AgentFilesTool from "@/components/tools/AgentFilesTool";
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
      content: "Hello! I'm your autonomous AI agent. I can help you complete complex tasks by intelligently using multiple tools in sequence:\n\n🤖 **Agentic Workflows:**\n• Website/App Development - I'll research, code, and test automatically\n• Research Projects - I'll search, browse, compile, and organize information\n• Code Analysis - I'll examine files, analyze code, run diagnostics\n• Deployment Tasks - I'll build, deploy, and verify applications\n\n📋 **Available Tools:**\n🖥️ Terminal | 💻 Code Editor | 🌐 Browser | 🔍 Search | 📁 Files\n\nJust describe what you want to accomplish, and I'll autonomously execute the complete workflow using whatever tools are needed. Try something like:\n• \"Build me a modern website\"\n• \"Research AI development trends\" \n• \"Deploy my application\"\n• \"Analyze my code for issues\"",
      timestamp: new Date()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTools, setActiveTools] = useState<ActiveTool[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

    // Simulate AI processing and tool selection
    await simulateAIResponse(currentMessage, userMessage.id);
    setIsProcessing(false);
  };

  const simulateAIResponse = async (userInput: string, userMessageId: string) => {
    // Simulate thinking time
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Determine tool to use based on input
    let toolType: ActiveTool['type'] | null = null;
    let response = "";
    
    const lowerInput = userInput.toLowerCase();

    if (lowerInput.includes('terminal') || lowerInput.includes('command') || lowerInput.includes('shell')) {
      toolType = 'terminal';
      response = "I'll open the terminal for you to execute commands.";
    } else if (lowerInput.includes('code') || lowerInput.includes('edit') || lowerInput.includes('file')) {
      toolType = 'editor';
      response = "Opening the code editor for you.";
    } else if (lowerInput.includes('browse') || lowerInput.includes('web') || lowerInput.includes('website')) {
      toolType = 'browser';
      response = "Let me open the web browser for you.";
    } else if (lowerInput.includes('search')) {
      toolType = 'search';
      response = "I'll help you search for information.";
    } else if (lowerInput.includes('folder') || lowerInput.includes('directory') || lowerInput.includes('files')) {
      toolType = 'files';
      response = "Opening the file manager for you.";
    } else {
      response = `I understand you want help with: "${userInput}". I can use various tools to assist you:\n\n• **Terminal** - for running commands\n• **Editor** - for coding and file editing\n• **Browser** - for web browsing\n• **Search** - for finding information\n• **Files** - for file management\n\nWhich tool would you like me to open?`;
    }

    const aiMessageId = (Date.now() + 1).toString();
    
    // Add AI response
    const aiMessage: AIMessage = {
      id: aiMessageId,
      type: "assistant",
      content: response,
      toolId: toolType || undefined,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMessage]);

    // Add tool if needed
    if (toolType) {
      const newTool: ActiveTool = {
        id: Date.now().toString() + toolType,
        type: toolType,
        messageId: aiMessageId
      };
      
      setActiveTools(prev => [...prev, newTool]);
    }
  };

  const closeTool = (toolId: string) => {
    setActiveTools(prev => prev.filter(tool => tool.id !== toolId));
  };

  const renderToolComponent = (tool: ActiveTool) => {
    switch (tool.type) {
      case 'terminal':
        return <AgentTerminalTool />;
      case 'editor':
        return <AgentEditorTool />;
      case 'browser':
        return <AgentBrowserTool />;
      case 'search':
        return <AgentSearchTool />;
      case 'files':
        return <AgentFilesTool />;
      default:
        return null;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
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

      {/* Messages and Tools */}
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
                </div>
              </motion.div>

              {/* Inline Tools for this message */}
              {activeTools
                .filter(tool => tool.messageId === message.id)
                .map(tool => (
                  <InlineToolWrapper
                    key={tool.id}
                    title={toolNames[tool.type]}
                    icon={toolIcons[tool.type]}
                    onClose={() => closeTool(tool.id)}
                  >
                    {renderToolComponent(tool)}
                  </InlineToolWrapper>
                ))}
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
  );
}