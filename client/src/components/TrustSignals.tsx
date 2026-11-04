import { Star, Users, Award, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function TrustSignals() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 py-4" data-testid="trust-signals">
      {/* Star Rating */}
      <div className="flex items-center gap-2" data-testid="trust-rating">
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className="w-5 h-5 fill-tf-lime text-tf-lime"
              data-testid={`star-${star}`}
            />
          ))}
        </div>
        <span className="text-sm font-semibold text-foreground">
          4.9/5 from 100+ operators
        </span>
      </div>

      {/* Divider */}
      <div className="hidden sm:block w-px h-6 bg-border" />

      {/* User Count */}
      <div className="flex items-center gap-2" data-testid="trust-users">
        <Users className="w-5 h-5 text-tf-navy" />
        <span className="text-sm font-semibold text-foreground">
          Used by 100+ PBSA operators
        </span>
      </div>

      {/* Divider */}
      <div className="hidden sm:block w-px h-6 bg-border" />

      {/* Verification Badge */}
      <div className="flex items-center gap-2" data-testid="trust-verified">
        <Badge variant="secondary" className="gap-1.5 px-3 py-1">
          <Shield className="w-4 h-4 text-tf-navy" />
          <span className="font-semibold">Industry Verified</span>
        </Badge>
      </div>
    </div>
  );
}

export function TrustSignalsCompact() {
  return (
    <Card className="bg-muted/30 border-border/50" data-testid="trust-signals-compact">
      <CardContent className="py-4">
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
          {/* Star Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="w-4 h-4 fill-tf-lime text-tf-lime"
                />
              ))}
            </div>
            <span className="font-medium text-muted-foreground">
              4.9/5 stars
            </span>
          </div>

          <span className="text-muted-foreground">•</span>

          {/* User Count */}
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-tf-navy" />
            <span className="font-medium text-muted-foreground">
              100+ operators
            </span>
          </div>

          <span className="text-muted-foreground">•</span>

          {/* Verification */}
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-tf-navy" />
            <span className="font-medium text-muted-foreground">
              Industry Verified
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
