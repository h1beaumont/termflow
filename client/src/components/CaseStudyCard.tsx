import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, TrendingUp, ArrowRight } from "lucide-react";
import { CaseStudy } from "@/data/caseStudies";

interface CaseStudyCardProps {
  caseStudy: CaseStudy;
  featured?: boolean;
}

export function CaseStudyCard({ caseStudy, featured = false }: CaseStudyCardProps) {
  // Extract key metric for quick display
  const keyResult = caseStudy.results[0];

  return (
    <Link href={`/case-studies/${caseStudy.slug}`}>
      <Card 
        className={`hover-elevate cursor-pointer h-full transition-all duration-200 ${
          featured ? 'border-tf-lime/30' : ''
        }`}
        data-testid={`card-case-study-${caseStudy.slug}`}
      >
        <CardHeader className="space-y-3">
          {featured && (
            <Badge className="bg-tf-lime text-tf-navy text-xs w-fit">
              Featured Case Study
            </Badge>
          )}
          
          <CardTitle className={`line-clamp-2 ${featured ? 'text-xl' : 'text-lg'}`}>
            {caseStudy.title}
          </CardTitle>

          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span>{caseStudy.propertyName}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{caseStudy.location} • {caseStudy.units} units</span>
            </div>
          </div>
          
          <CardDescription className="line-clamp-2 text-sm">
            {caseStudy.propertyType}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Key Result Highlight */}
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-tf-lime" />
              <span className="text-xs font-medium text-muted-foreground">
                Key Result
              </span>
            </div>
            <p className="text-sm font-semibold">
              {keyResult.metric}: <span className="text-tf-lime">{keyResult.improvement}</span>
            </p>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">View full case study</span>
            <ArrowRight className="h-4 w-4 text-tf-lime" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
