// TODO: Update address placeholders with real registered office details before production launch
// This must match the Companies House registered address

export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "TermFlow Software Limited",
    "url": "https://termflow.ai",
    "logo": "https://termflow.ai/logo.png",
    "image": "https://termflow.ai/og-image.png",
    "foundingDate": "2023",
    "description": "AI-powered lettings automation for student accommodation operators in the UK and Ireland",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "[To be added - Registered office street address]",
      "addressLocality": "[To be added - City]",
      "postalCode": "[To be added - Postal code]",
      "addressRegion": "England",
      "addressCountry": "GB"
    },
    "priceRange": "£99 - £499",
    "email": "hello@termflow.ai",
    "areaServed": [
      {
        "@type": "Country",
        "name": "United Kingdom"
      },
      {
        "@type": "Country",
        "name": "Ireland"
      }
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Sales",
      "email": "hello@termflow.ai"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
