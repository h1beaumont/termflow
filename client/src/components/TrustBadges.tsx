import { Shield, Flag, Award, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TrustBadgesProps {
  variant?: "header" | "hero";
  className?: string;
}

export function TrustBadges({ variant = "hero", className = "" }: TrustBadgesProps) {
  const badges = [
    {
      icon: Shield,
      text: "GDPR Compliant",
      testId: "badge-gdpr-compliant"
    },
    {
      icon: Flag,
      text: "UK-Based & Hosted",
      testId: "badge-uk-based"
    },
    {
      icon: Award,
      text: "ISO 27001 Ready",
      testId: "badge-iso-27001"
    },
    {
      icon: Lock,
      text: "Stripe Secure Payments",
      testId: "badge-stripe-secure"
    }
  ];

  const isHeader = variant === "header";

  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-3 ${className}`}
      data-testid="trust-badges-container"
    >
      {badges.map((badge) => {
        const Icon = badge.icon;
        return (
          <Badge
            key={badge.testId}
            variant="outline"
            className={`${
              isHeader
                ? "px-2 py-1 text-xs"
                : "px-4 py-2 text-sm"
            } font-semibold border-primary/30 bg-primary/5`}
            data-testid={badge.testId}
          >
            <Icon className={`${isHeader ? "h-3 w-3" : "h-4 w-4"} mr-2 text-primary`} />
            {badge.text}
          </Badge>
        );
      })}
    </div>
  );
}
