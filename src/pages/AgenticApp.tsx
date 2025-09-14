import ChatInterface from "@/components/chat/ChatInterface";

export default function AgenticApp() {
  return (
    <div className="min-h-screen bg-background">
      {/* Status Bar */}
      <div className="h-12 bg-muted/50 border-b border-border flex items-center justify-center px-6">
        <h1 className="font-semibold text-foreground">
          Agentic AI Workspace
        </h1>
      </div>

      {/* Main Chat Interface */}
      <div className="h-[calc(100vh-3rem)]">
        <ChatInterface />
      </div>
    </div>
  );
}