import { Calendar } from "lucide-react";

interface LastUpdatedProps {
  date: string; // Format: "January 20, 2025" or "2025-01-20"
  className?: string;
}

export function LastUpdated({ date, className = "" }: LastUpdatedProps) {
  return (
    <div 
      className={`flex items-center gap-2 text-sm text-muted-foreground ${className}`}
      data-testid="last-updated"
    >
      <Calendar className="w-4 h-4" />
      <span>Last updated: {date}</span>
    </div>
  );
}
