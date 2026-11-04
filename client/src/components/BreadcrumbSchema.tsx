import { Helmet } from "react-helmet-async";

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items
      .filter(item => item.url && item.url !== "#") // Skip placeholders
      .map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        // Always emit absolute URLs
        "item": item.url.startsWith('http') 
          ? item.url 
          : `https://termflow.co.uk${item.url.startsWith('/') ? item.url : '/' + item.url}`
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
