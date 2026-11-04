import { Helmet } from "react-helmet-async";

interface ProfessionalServiceSchemaProps {
  name: string;
  description: string;
  serviceType: string;
  provider?: {
    name: string;
    url?: string;
    telephone?: string;
    email?: string;
    address?: {
      addressCountry: string;
      addressRegion?: string;
      addressLocality?: string;
    };
  };
  areaServed?: string | string[]; // Can be country codes or names
  hasOfferCatalog?: {
    name: string;
    itemListElement: {
      name: string;
      description: string;
      price?: string;
      priceCurrency?: string;
    }[];
  };
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
  priceRange?: string;
  availableLanguage?: string[];
  termsOfService?: string;
  category?: string;
}

export function ProfessionalServiceSchema({
  name,
  description,
  serviceType,
  provider = {
    name: "TermFlow",
    url: "https://termflow.co.uk",
    email: "hello@termflow.co.uk",
    address: { addressCountry: "GB" }
  },
  areaServed = ["GB", "IE"],
  hasOfferCatalog,
  aggregateRating,
  priceRange = "£99-£499",
  availableLanguage = ["en", "zh", "ar", "es", "fr", "pt", "hi", "de"],
  termsOfService = "https://termflow.co.uk/legal/terms",
  category = "Property Management Automation"
}: ProfessionalServiceSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": name,
    "description": description,
    "serviceType": serviceType,
    "category": category,
    "provider": {
      "@type": "Organization",
      "name": provider.name,
      ...(provider.url && { "url": provider.url }),
      ...(provider.telephone && { "telephone": provider.telephone }),
      ...(provider.email && { "email": provider.email }),
      ...(provider.address && {
        "address": {
          "@type": "PostalAddress",
          "addressCountry": provider.address.addressCountry,
          ...(provider.address.addressRegion && { "addressRegion": provider.address.addressRegion }),
          ...(provider.address.addressLocality && { "addressLocality": provider.address.addressLocality })
        }
      })
    },
    "areaServed": Array.isArray(areaServed) 
      ? areaServed.map(area => ({
          "@type": "Country",
          "name": area
        }))
      : {
          "@type": "Country",
          "name": areaServed
        },
    ...(hasOfferCatalog && {
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": hasOfferCatalog.name,
        "itemListElement": hasOfferCatalog.itemListElement.map(item => ({
          "@type": "Offer",
          "name": item.name,
          "description": item.description,
          ...(item.price && { 
            "price": item.price,
            "priceCurrency": item.priceCurrency || "GBP"
          })
        }))
      }
    }),
    ...(false && aggregateRating && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": aggregateRating.ratingValue,
        "reviewCount": aggregateRating.reviewCount,
        "bestRating": 5,
        "worstRating": 1
      }
    }),
    ...(priceRange && { "priceRange": priceRange }),
    ...(availableLanguage && availableLanguage.length > 0 && {
      "availableLanguage": availableLanguage.map(lang => ({
        "@type": "Language",
        "name": lang
      }))
    }),
    ...(termsOfService && { "termsOfService": termsOfService })
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}