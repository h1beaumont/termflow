import { Helmet } from "react-helmet-async";

interface Offer {
  name: string;
  description: string;
  price: string;
  priceCurrency?: string;
  priceValidUntil?: string;
  availability?: "InStock" | "OutOfStock" | "PreOrder" | "LimitedAvailability";
  url?: string;
  features?: string[];
  category?: string;
}

interface OffersSchemaProps {
  offers: Offer[];
  provider?: {
    name: string;
    url?: string;
  };
}

export function OffersSchema({ 
  offers, 
  provider = {
    name: "TermFlow",
    url: "https://termflow.co.uk"
  }
}: OffersSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "AggregateOffer",
    "priceCurrency": "GBP",
    "offerCount": offers.length,
    "lowPrice": Math.min(...offers.map(o => parseFloat(o.price) || 0)).toString(),
    "highPrice": Math.max(...offers.map(o => parseFloat(o.price) || 999)).toString(),
    "offers": offers.map(offer => ({
      "@type": "Offer",
      "name": offer.name,
      "description": offer.description,
      "price": offer.price,
      "priceCurrency": offer.priceCurrency || "GBP",
      ...(offer.priceValidUntil && { "priceValidUntil": offer.priceValidUntil }),
      "availability": `https://schema.org/${offer.availability || "InStock"}`,
      ...(offer.url && { "url": offer.url }),
      "seller": {
        "@type": "Organization",
        "name": provider.name,
        ...(provider.url && { "url": provider.url })
      },
      ...(offer.features && offer.features.length > 0 && {
        "itemOffered": {
          "@type": "Service",
          "name": offer.name,
          "description": offer.description,
          "feature": offer.features.map(feature => ({
            "@type": "PropertyValue",
            "name": feature
          }))
        }
      }),
      ...(offer.category && { "category": offer.category })
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}