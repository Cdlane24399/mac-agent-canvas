import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ToolHeaderProps {
  title: string;
  icon: React.ReactNode;
  onClose: () => void;
}

export default function ToolHeader({ title, icon, onClose }: ToolHeaderProps) {
  return (
    <div className="flex items-center gap-2 mt-2 p-2 bg-muted/50 rounded-lg border border-border/50">
      <div className="flex items-center gap-2 flex-1">
        {icon}
        <span className="text-sm font-medium text-foreground">{title}</span>
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      </div>
      <Button
        onClick={onClose}
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
      >
        <X className="w-3 h-3" />
      </Button>
    </div>
  );
}