import { Helmet } from "react-helmet-async";
import { CaseStudy } from "@/data/caseStudies";

interface CaseStudySchemaProps {
  caseStudy: CaseStudy;
}

export function CaseStudySchema({ caseStudy }: CaseStudySchemaProps) {
  return null;
  // Generate JSON-LD structured data for Case Study
  const caseStudySchema = {
    "@context": "https://schema.org",
    "@type": "CaseStudy",
    "headline": caseStudy.title,
    "description": caseStudy.metaDescription,
    "about": {
      "@type": "Thing",
      "name": "PBSA Lettings Automation",
      "description": "Purpose-Built Student Accommodation lettings and property management automation"
    },
    "author": {
      "@type": "Organization",
      "name": "TermFlow",
      "url": "https://termflow.com"
    },
    "datePublished": caseStudy.publishDate,
    "provider": {
      "@type": "Organization",
      "name": "TermFlow",
      "description": "AI-powered lettings automation platform for PBSA landlords"
    },
    "participant": {
      "@type": "Organization",
      "name": caseStudy.propertyName,
      "location": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": caseStudy.location
        }
      }
    },
    "result": caseStudy.results.map(result => ({
      "@type": "QuantitativeValue",
      "name": result.metric,
      "value": result.after,
      "previousValue": result.before,
      "unitText": result.improvement
    })),
    "review": {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": 5,
        "bestRating": 5
      },
      "author": {
        "@type": "Person",
        "name": caseStudy.testimonial.author,
        "jobTitle": caseStudy.testimonial.role,
        "worksFor": {
          "@type": "Organization",
          "name": caseStudy.testimonial.company
        }
      },
      "reviewBody": caseStudy.testimonial.quote,
      "itemReviewed": {
        "@type": "SoftwareApplication",
        "name": "TermFlow",
        "applicationCategory": "Property Management Software"
      }
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(caseStudySchema)}
      </script>
    </Helmet>
  );
}
