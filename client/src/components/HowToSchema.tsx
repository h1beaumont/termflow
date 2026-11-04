import { Helmet } from "react-helmet-async";

interface HowToStep {
  name: string;
  text: string;
  image?: string;
  url?: string;
}

interface HowToSchemaProps {
  name: string;
  description: string;
  steps: HowToStep[];
  totalTime?: string; // ISO 8601 duration format (e.g., "PT30M" for 30 minutes)
  estimatedCost?: {
    value: string;
    currency: string;
  };
  supply?: string[];
  tool?: string[];
  image?: string;
}

export function HowToSchema({
  name,
  description,
  steps,
  totalTime,
  estimatedCost,
  supply,
  tool,
  image = "https://termflow.co.uk/og-image.png"
}: HowToSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": name,
    "description": description,
    "image": image,
    "step": steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.name,
      "text": step.text,
      ...(step.image && { "image": step.image }),
      ...(step.url && { "url": step.url })
    })),
    ...(totalTime && { "totalTime": totalTime }),
    ...(estimatedCost && {
      "estimatedCost": {
        "@type": "MonetaryAmount",
        "value": estimatedCost.value,
        "currency": estimatedCost.currency
      }
    }),
    ...(supply && supply.length > 0 && {
      "supply": supply.map(item => ({
        "@type": "HowToSupply",
        "name": item
      }))
    }),
    ...(tool && tool.length > 0 && {
      "tool": tool.map(item => ({
        "@type": "HowToTool",
        "name": item
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