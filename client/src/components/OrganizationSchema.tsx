import { Helmet } from "react-helmet-async";

export function OrganizationSchema() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "TermFlow",
    "url": "https://termflow.co.uk",
    "logo": "https://termflow.co.uk/logo.png",
    "description": "AI-powered lettings automation platform for student accommodation (PBSA) landlords. Automate enquiries, viewings, contracts, and deposits with 24/7 multilingual AI assistant.",
    "foundingDate": "2024",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Sales",
      "availableLanguage": ["English"],
      "areaServed": "GB"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "GB"
    },
    "sameAs": [
      "https://www.linkedin.com/company/termflow"
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
    </Helmet>
  );
}
