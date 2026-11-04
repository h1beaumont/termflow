import { useEffect, useState, useCallback } from "react";
import { useLocation } from "wouter";
import { Search, FileText, Layers, Map, BookOpen, FolderOpen, ArrowRight } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { contentRegistry, ContentMeta } from "@/data/contentRegistry";
import { Badge } from "@/components/ui/badge";

const categoryIcons = {
  strategic: Layers,
  playbook: BookOpen,
  sector: FolderOpen,
  comparison: ArrowRight,
  guide: FileText,
  resource: FileText,
  location: Map,
};

const categoryLabels = {
  strategic: "Strategic",
  playbook: "Playbook",
  sector: "Sector",
  comparison: "Comparison",
  guide: "Guide",
  resource: "Resource",
  location: "Location",
};

export function SiteSearch() {
  const [open, setOpen] = useState(false);
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  // Keyboard shortcut (Cmd+K or Ctrl+K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Filter content based on search query
  const filteredContent = useCallback(() => {
    if (!searchQuery.trim()) {
      // Show popular/recent pages when no query
      return contentRegistry.slice(0, 8);
    }

    const query = searchQuery.toLowerCase();
    return contentRegistry.filter((item) => {
      const titleMatch = item.title.toLowerCase().includes(query);
      const descriptionMatch = item.description.toLowerCase().includes(query);
      const keywordsMatch = item.keywords.some(k => k.toLowerCase().includes(query));
      const categoryMatch = categoryLabels[item.category]?.toLowerCase().includes(query) || false;
      
      return titleMatch || descriptionMatch || keywordsMatch || categoryMatch;
    });
  }, [searchQuery]);

  const handleSelect = (path: string) => {
    setOpen(false);
    setSearchQuery("");
    setLocation(path);
  };

  // Group results by category
  const groupedResults = filteredContent().reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ContentMeta[]>);

  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 min-h-9 rounded-md border border-input bg-background hover-elevate active-elevate-2 transition-colors text-sm text-muted-foreground w-full sm:w-64"
        data-testid="button-search-trigger"
      >
        <Search className="w-4 h-4" />
        <span className="flex-1 text-left">Search...</span>
        <kbd className="pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Search Dialog */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Search TermFlow content..." 
          value={searchQuery}
          onValueChange={setSearchQuery}
          data-testid="input-search"
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          
          {Object.entries(groupedResults).map(([category, items]) => {
            const Icon = categoryIcons[category as keyof typeof categoryIcons] || FileText;
            
            return (
              <CommandGroup 
                key={category} 
                heading={categoryLabels[category as keyof typeof categoryLabels]}
              >
                {items.map((item) => (
                  <CommandItem
                    key={item.slug}
                    value={`${item.title} ${item.description} ${item.keywords.join(' ')}`}
                    onSelect={() => handleSelect(item.path)}
                    data-testid={`search-result-${item.slug}`}
                  >
                    <Icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">{item.title}</span>
                        {item.downloadable && (
                          <Badge variant="secondary" className="text-xs">PDF</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {item.description}
                      </p>
                    </div>
                    {item.readingTime && (
                      <span className="ml-2 text-xs text-muted-foreground shrink-0">
                        {item.readingTime} min
                      </span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
}
