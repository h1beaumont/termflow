import { LocationPage } from "./LocationPage";

export default function BirminghamLocation() {
  return (
    <LocationPage
      city="Birmingham"
      citySlug="birmingham"
      universities={[
        "University of Birmingham",
        "Aston University",
        "Birmingham City University",
        "University College Birmingham",
        "Newman University"
      ]}
      stats={{
        studentPopulation: "80,000+",
        pbsaProperties: "150+",
        avgOccupancyRate: "95%"
      }}
      challenges={[
        "Managing 300-500 enquiries per week from five major universities during clearing season",
        "High international student population (45% of market) requiring multilingual support and visa guidance",
        "Competing with nearby cities (Coventry, Wolverhampton) for student accommodation demand",
        "Coordinating viewings across dispersed campus locations (Edgbaston, City Centre, Selly Oak)",
        "Price-sensitive market—students compare 8-12 properties before committing",
        "Complex group bookings from sports societies and student unions (4-8 students per group)"
      ]}
      benefits={[
        "24/7 AI-powered instant response in 30+ languages for Birmingham's diverse international community",
        "Automated viewing booking synced across all Birmingham properties and campus locations",
        "Smart lead prioritization filtering students by budget (£90-180/week range), move-in date, and university",
        "Multi-property dashboard managing viewings across Edgbaston, Selly Oak, and City Centre from one platform",
        "Automated contract generation with Birmingham-specific clauses (council tax exemption, HMO compliance for Selly Oak)",
        "Stripe integration for secure deposit collection with automatic TDS/DPS protection registration",
        "Group booking automation handling sports teams and society group reservations with multi-signature support"
      ]}
    />
  );
}
