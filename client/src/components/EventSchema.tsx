import { Helmet } from "react-helmet-async";

interface EventSchemaProps {
  name: string;
  description: string;
  startDate?: string; // ISO date format
  endDate?: string; // ISO date format
  location?: {
    type: "VirtualLocation" | "Place";
    name?: string;
    url?: string;
    address?: {
      addressCountry?: string;
      addressLocality?: string;
    };
  };
  organizer?: {
    name: string;
    url?: string;
  };
  performer?: {
    name: string;
    jobTitle?: string;
  };
  offers?: {
    price?: string;
    priceCurrency?: string;
    availability?: string;
    url?: string;
    validFrom?: string;
  };
  eventStatus?: "EventScheduled" | "EventCancelled" | "EventPostponed" | "EventRescheduled";
  eventAttendanceMode?: "OnlineEventAttendanceMode" | "OfflineEventAttendanceMode" | "MixedEventAttendanceMode";
  image?: string;
}

export function EventSchema({
  name,
  description,
  startDate,
  endDate,
  location = { type: "VirtualLocation", name: "Online" },
  organizer = { name: "TermFlow", url: "https://termflow.co.uk" },
  performer,
  offers,
  eventStatus = "EventScheduled",
  eventAttendanceMode = "OnlineEventAttendanceMode",
  image = "https://termflow.co.uk/og-image.png",
}: EventSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": name,
    "description": description,
    "image": image,
    "eventStatus": `https://schema.org/${eventStatus}`,
    "eventAttendanceMode": `https://schema.org/${eventAttendanceMode}`,
    ...(startDate && { "startDate": startDate }),
    ...(endDate && { "endDate": endDate }),
    "location": location.type === "VirtualLocation" 
      ? {
          "@type": "VirtualLocation",
          "url": location.url || "https://termflow.co.uk/demo"
        }
      : {
          "@type": "Place",
          "name": location.name,
          ...(location.address && {
            "address": {
              "@type": "PostalAddress",
              ...(location.address.addressCountry && { "addressCountry": location.address.addressCountry }),
              ...(location.address.addressLocality && { "addressLocality": location.address.addressLocality })
            }
          })
        },
    "organizer": {
      "@type": "Organization",
      "name": organizer.name,
      ...(organizer.url && { "url": organizer.url })
    },
    ...(performer && {
      "performer": {
        "@type": "Person",
        "name": performer.name,
        ...(performer.jobTitle && { "jobTitle": performer.jobTitle })
      }
    }),
    ...(offers && {
      "offers": {
        "@type": "Offer",
        ...(offers.price && { "price": offers.price }),
        ...(offers.priceCurrency && { "priceCurrency": offers.priceCurrency }),
        ...(offers.availability && { "availability": offers.availability }),
        ...(offers.url && { "url": offers.url }),
        ...(offers.validFrom && { "validFrom": offers.validFrom })
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