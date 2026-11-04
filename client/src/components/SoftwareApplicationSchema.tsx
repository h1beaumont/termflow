import { Helmet } from "react-helmet-async";

export function SoftwareApplicationSchema() {
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "TermFlow",
    "applicationCategory": "BusinessApplication",
    "applicationSubCategory": "Property Management Software",
    "operatingSystem": "Web",
    "description": "AI-powered lettings automation platform for student accommodation (PBSA). Automate lead capture, WhatsApp conversations, viewing bookings, digital contracts, and deposit collection with 24/7 multilingual AI assistant.",
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "GBP",
      "lowPrice": "0",
      "highPrice": "499",
      "offerCount": "5",
      "offers": [
        {
          "@type": "Offer",
          "name": "Free Trial",
          "price": "0",
          "priceCurrency": "GBP",
          "availability": "https://schema.org/InStock",
          "priceValidUntil": "2025-12-31"
        },
        {
          "@type": "Offer",
          "name": "Starter",
          "price": "99",
          "priceCurrency": "GBP",
          "availability": "https://schema.org/InStock"
        },
        {
          "@type": "Offer",
          "name": "Professional",
          "price": "179",
          "priceCurrency": "GBP",
          "availability": "https://schema.org/InStock"
        },
        {
          "@type": "Offer",
          "name": "Growth",
          "price": "299",
          "priceCurrency": "GBP",
          "availability": "https://schema.org/InStock"
        },
        {
          "@type": "Offer",
          "name": "Premium",
          "price": "499",
          "priceCurrency": "GBP",
          "availability": "https://schema.org/InStock"
        }
      ]
    },
    "provider": {
      "@type": "Organization",
      "name": "TermFlow Software Limited",
      "url": "https://termflow.ai",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "GB"
      },
      "areaServed": ["GB", "IE"]
    },
    "featureList": [
      "AI conversations via WhatsApp, email, and web chat",
      "Automatic lead capture from Rightmove, Zoopla, Student.com, and 100+ portals",
      "Smart viewing booking with calendar integration",
      "Digital contracts with DocuSign e-signature",
      "Stripe payment integration for deposits and rent",
      "Multilingual support (25+ languages)",
      "Interactive floor plans with video tours",
      "Advanced analytics and reporting",
      "GDPR-compliant data storage",
      "24/7 automated tenant support"
    ],
    "softwareVersion": "2.0",
    "releaseNotes": "Production-ready platform with dual-layer A/B testing and Thompson Sampling optimization",
    "screenshot": "https://termflow.co.uk/dashboard-screenshot.png",
    "video": {
      "@type": "VideoObject",
      "name": "TermFlow Platform Demo",
      "description": "See how TermFlow automates the entire student lettings process",
      "thumbnailUrl": "https://termflow.co.uk/video-thumbnail.png"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(softwareSchema)}
      </script>
    </Helmet>
  );
}
