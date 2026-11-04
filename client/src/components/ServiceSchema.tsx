import { Helmet } from "react-helmet-async";

interface ServiceSchemaProps {
  name: string;
  description: string;
  provider?: {
    name: string;
    url: string;
  };
  areaServed?: string;
  serviceType?: string;
  offers?: {
    price?: string;
    priceCurrency?: string;
    description?: string;
  };
}

export function ServiceSchema({
  name,
  description,
  provider,
  areaServed = "United Kingdom",
  serviceType,
  offers,
}: ServiceSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": name,
    "description": description,
    ...(provider && {
      "provider": {
        "@type": "Organization",
        "name": provider.name,
        "url": provider.url
      }
    }),
    "areaServed": {
      "@type": "Country",
      "name": areaServed
    },
    ...(serviceType && { "serviceType": serviceType }),
    ...(offers && {
      "offers": {
        "@type": "Offer",
        ...(offers.price && { "price": offers.price }),
        ...(offers.priceCurrency && { "priceCurrency": offers.priceCurrency }),
        ...(offers.description && { "description": offers.description })
      }
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
