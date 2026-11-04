import { Link } from "wouter";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb" data-testid="breadcrumb">
      {items.map((item, index) => (
        <div key={item.url} className="flex items-center gap-2">
          {index > 0 && <ChevronRight className="w-4 h-4" />}
          {index < items.length - 1 ? (
            // Check if URL is a placeholder (# or empty)
            item.url === "#" || !item.url ? (
              <span className="text-muted-foreground" data-testid={`breadcrumb-section-${index}`}>
                {item.name}
              </span>
            ) : (
              <Link href={item.url} className="hover:text-foreground transition-colors" data-testid={`breadcrumb-link-${index}`}>
                {item.name}
              </Link>
            )
          ) : (
            <span className="text-foreground font-medium" data-testid={`breadcrumb-current-${index}`}>
              {item.name}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
