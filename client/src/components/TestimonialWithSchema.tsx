import { Helmet } from "react-helmet-async";
import { Card, CardHeader, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

export interface TestimonialData {
  name: string;
  role: string;
  company?: string;
  avatar?: string;
  avatarFallback: string;
  rating: number;
  text: string;
  location?: string;
  portfolioSize?: string;
  date?: string; // ISO date format
}

interface TestimonialWithSchemaProps {
  testimonial?: TestimonialData;
  testId?: string;
}

export function TestimonialWithSchema({ testimonial, testId = "testimonial" }: TestimonialWithSchemaProps) {
  return null;
  // Handle undefined testimonial
  if (!testimonial) {
    return null;
  }

  // Generate JSON-LD structured data for Review
  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": {
      "@type": "SoftwareApplication",
      "name": "TermFlow",
      "applicationCategory": "Property Management Software",
      "description": "AI-powered lettings automation platform for PBSA landlords"
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": testimonial.rating || 5,
      "bestRating": 5,
      "worstRating": 1
    },
    "author": {
      "@type": "Person",
      "name": testimonial.name || "Anonymous",
      ...(testimonial.role && { "jobTitle": testimonial.role })
    },
    "reviewBody": testimonial.text || "",
    ...(testimonial.date && { "datePublished": testimonial.date })
  };

  const displayLocation = testimonial.portfolioSize && testimonial.location 
    ? `${testimonial.portfolioSize}, ${testimonial.location}`
    : testimonial.location || testimonial.portfolioSize;

  return (
    <>
      {/* JSON-LD Structured Data */}
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(reviewSchema)}
        </script>
      </Helmet>

      {/* Testimonial Card */}
      <Card className="hover-elevate h-full" data-testid={`card-${testId}`}>
        <CardHeader>
          <div className="flex items-center gap-3 mb-4">
            <Avatar data-testid={`avatar-${testId}`}>
              {testimonial.avatar && <AvatarImage src={testimonial.avatar} alt={testimonial.name} loading="lazy" />}
              <AvatarFallback>{testimonial.avatarFallback}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold" data-testid={`text-${testId}-name`}>
                {testimonial.name}
              </div>
              <div className="text-sm text-muted-foreground" data-testid={`text-${testId}-role`}>
                {testimonial.company ? `${testimonial.role}, ${testimonial.company}` : testimonial.role}
              </div>
            </div>
          </div>
          <div className="flex gap-1 mb-3" data-testid={`rating-${testId}`}>
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-4 w-4 ${i < testimonial.rating ? 'fill-primary text-primary' : 'text-muted-foreground'}`} 
              />
            ))}
          </div>
          <CardDescription className="text-base leading-relaxed">
            "{testimonial.text}"
          </CardDescription>
          {displayLocation && (
            <div className="mt-4">
              <Badge variant="secondary" data-testid={`badge-${testId}-location`}>
                {displayLocation}
              </Badge>
            </div>
          )}
        </CardHeader>
      </Card>
    </>
  );
}
