import { LocationPage } from "./LocationPage";

export default function EdinburghLocation() {
  return (
    <LocationPage
      city="Edinburgh"
      citySlug="edinburgh"
      universities={[
        "University of Edinburgh",
        "Edinburgh Napier University",
        "Heriot-Watt University",
        "Edinburgh College of Art"
      ]}
      stats={{
        studentPopulation: "75,000+",
        pbsaProperties: "120+",
        avgOccupancyRate: "97%"
      }}
      challenges={[
        "Festival season (August) overlaps with clearing—properties get booked for short-term Airbnb instead of students",
        "High international student population (50%+) from China, USA, EU—complex visa/immigration requirements",
        "Old Town vs. New Town preferences require detailed location knowledge and personalized recommendations",
        "Premium pricing market—students expect high-quality amenities and rapid response times",
        "Scottish tenancy law differs from rest of UK—contracts must comply with Private Residential Tenancy regulations",
        "Managing 350+ enquiries per week during August clearing while competing with festival short-lets"
      ]}
      benefits={[
        "AI blocks Festival season short-let requests automatically—prioritizes academic year tenancies",
        "Multilingual support for Edinburgh's global student population (Mandarin, Spanish, French, Arabic, German)",
        "Scottish Private Residential Tenancy (PRT) compliant contract templates with automatic deposit registration",
        "Smart location recommendations based on university campus (Central Area, King's Buildings, Easter Bush)",
        "Automated viewing scheduling that accounts for Edinburgh's August Festival traffic and parking restrictions",
        "Integration with Lothian Buses routes for location-based property recommendations"
      ]}
    />
  );
}
