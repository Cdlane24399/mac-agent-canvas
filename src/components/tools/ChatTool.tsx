import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import AICallout from "@/components/ai/AICallout";
import type { ToolProps, AIMessage } from "@/types";

export default function ChatTool({ isActive, onMessage }: ToolProps) {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: "1",
      type: "assistant", 
      content: "Hello! I'm your AI assistant. I can help you with various tasks using the available tools like terminal, editor, browser, search, and file management. What would you like to do?",
      timestamp: new Date()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
    await simulateAIResponse(currentMessage);
    setIsProcessing(false);
  };

  const simulateAIResponse = async (userInput: string) => {
    // Simulate thinking time
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Determine tool to use based on input
    let toolId: string | undefined;
    let response = "";
    
    if (userInput.toLowerCase().includes('terminal') || userInput.toLowerCase().includes('command')) {
      toolId = 'terminal';
      response = "I'll help you with terminal commands. Let me open the terminal tool for you.";
    } else if (userInput.toLowerCase().includes('code') || userInput.toLowerCase().includes('edit')) {
      toolId = 'editor';
      response = "I'll open the code editor so we can work on your files.";
    } else if (userInput.toLowerCase().includes('browse') || userInput.toLowerCase().includes('web')) {
      toolId = 'browser';
      response = "Let me open the browser tool to help you navigate the web.";
    } else if (userInput.toLowerCase().includes('search')) {
      toolId = 'search';
      response = "I'll use the web search tool to find information for you.";
    } else if (userInput.toLowerCase().includes('file') || userInput.toLowerCase().includes('folder')) {
      toolId = 'files';
      response = "Let me access the file system to help you manage your files.";
    } else {
      response = "I understand you want help with: " + userInput + ". I can use various tools to assist you. Would you like me to use the terminal, editor, browser, search, or file tools?";
    }

    // Add AI response
    const aiMessage: AIMessage = {
      id: (Date.now() + 1).toString(),
      type: "assistant",
      content: response,
      toolId,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMessage]);

    // Trigger tool if needed
    if (toolId && onMessage) {
      onMessage(toolId);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="tool-panel h-full flex flex-col"
    >
      {/* Chat Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">AI Assistant</h2>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
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
            
            <div className={`flex-1 max-w-[80%] ${
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
              
              {message.toolId && (
                <div className="mt-2">
                  <AICallout 
                    message="Tool selected"
                    action={`Opening ${message.toolId} tool`}
                  />
                </div>
              )}
              
              <div className="text-xs text-muted-foreground mt-1">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </motion.div>
        ))}
        
        {isProcessing && (
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary-foreground" />
            </div>
            <AICallout message="Analyzing your request..." isThinking />
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Textarea
            ref={textareaRef}
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything... I can use tools to help you!"
            disabled={isProcessing}
            className="min-h-[60px] max-h-32 resize-none bg-muted border-border"
            rows={2}
          />
        </div>
        <Button 
          onClick={sendMessage}
          disabled={!currentMessage.trim() || isProcessing}
          size="lg"
          className="h-[60px] px-4"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}