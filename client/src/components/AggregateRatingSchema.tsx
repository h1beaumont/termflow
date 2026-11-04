import { Helmet } from "react-helmet-async";

interface AggregateRatingSchemaProps {
  itemReviewed: {
    type: "Product" | "Service" | "SoftwareApplication" | "Organization";
    name: string;
    description?: string;
    url?: string;
    image?: string;
  };
  ratingValue: number;
  reviewCount: number;
  bestRating?: number;
  worstRating?: number;
  reviews?: {
    author: string;
    rating: number;
    reviewBody: string;
    datePublished?: string;
  }[];
}

export function AggregateRatingSchema({
  itemReviewed,
  ratingValue,
  reviewCount,
  bestRating = 5,
  worstRating = 1,
  reviews = []
}: AggregateRatingSchemaProps) {
  return null;
  const schema = {
    "@context": "https://schema.org",
    "@type": "AggregateRating",
    "itemReviewed": {
      "@type": itemReviewed.type,
      "name": itemReviewed.name,
      ...(itemReviewed.description && { "description": itemReviewed.description }),
      ...(itemReviewed.url && { "url": itemReviewed.url }),
      ...(itemReviewed.image && { "image": itemReviewed.image })
    },
    "ratingValue": ratingValue,
    "reviewCount": reviewCount,
    "bestRating": bestRating,
    "worstRating": worstRating,
    ...(reviews.length > 0 && {
      "review": reviews.map(review => ({
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": review.author
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": review.rating,
          "bestRating": bestRating,
          "worstRating": worstRating
        },
        "reviewBody": review.reviewBody,
        ...(review.datePublished && { "datePublished": review.datePublished })
      }))
    })
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}