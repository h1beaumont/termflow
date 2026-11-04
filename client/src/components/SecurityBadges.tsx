import { Shield, Lock, CheckCircle, Award } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SecurityBadgesProps {
  variant?: "horizontal" | "vertical";
  size?: "sm" | "md" | "lg";
  showLabels?: boolean;
}

export function SecurityBadges({ variant = "horizontal", size = "md", showLabels = true }: SecurityBadgesProps) {
  const iconSize = size === "sm" ? "h-4 w-4" : size === "lg" ? "h-6 w-6" : "h-5 w-5";
  const textSize = size === "sm" ? "text-xs" : size === "lg" ? "text-sm" : "text-xs";
  
  const badges = [
    {
      id: "gdpr",
      icon: <Shield className={iconSize} />,
      label: "GDPR Compliant",
      description: "Fully compliant with EU General Data Protection Regulation. Your data privacy is our priority.",
      testId: "badge-gdpr"
    },
    {
      id: "ssl",
      icon: <Lock className={iconSize} />,
      label: "SSL Encrypted",
      description: "Bank-grade 256-bit SSL encryption protects all data transmission.",
      testId: "badge-ssl"
    },
    {
      id: "iso",
      icon: <Award className={iconSize} />,
      label: "ISO 27001",
      description: "Information security management certified to international standards.",
      testId: "badge-iso"
    },
    {
      id: "stripe",
      icon: <CheckCircle className={iconSize} />,
      label: "Stripe Verified",
      description: "PCI DSS compliant payment processing through Stripe.",
      testId: "badge-stripe"
    }
  ];

  return (
    <div 
      className={`flex ${variant === "vertical" ? "flex-col" : "flex-row flex-wrap"} items-center gap-4`}
      data-testid="security-badges"
    >
      {badges.map((badge) => (
        <Tooltip key={badge.id}>
          <TooltipTrigger asChild>
            <div 
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-help"
              data-testid={badge.testId}
            >
              {badge.icon}
              {showLabels && (
                <span className={`${textSize} font-medium whitespace-nowrap`}>
                  {badge.label}
                </span>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs">{badge.description}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
