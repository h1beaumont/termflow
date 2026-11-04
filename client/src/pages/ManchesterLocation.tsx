import { LocationPage } from "./LocationPage";

export default function ManchesterLocation() {
  return (
    <LocationPage
      city="Manchester"
      citySlug="manchester"
      universities={[
        "University of Manchester",
        "Manchester Metropolitan University",
        "University of Salford",
        "Royal Northern College of Music"
      ]}
      stats={{
        studentPopulation: "100,000+",
        pbsaProperties: "200+",
        avgOccupancyRate: "94%"
      }}
      challenges={[
        "Clearing season spike to 400+ enquiries per week from UoM and MMU students",
        "High competition between city centre and Fallowfield/Withington properties",
        "Managing group bookings from societies and sports teams (5-8 students)",
        "International students (40% of market) need support with NHS registration, bank accounts, visas",
        "Price-sensitive market—students compare 10+ properties before deciding",
        "Northern Quarter vs. Oxford Road vs. Fallowfield location preferences require personalized recommendations"
      ]}
      benefits={[
        "AI handles group booking enquiries automatically—captures all student details, coordinates viewing times",
        "Multilingual support for Manchester's Chinese, Indian, Nigerian, and Middle Eastern student populations",
        "Automated price comparison tools—show how your property stacks up vs. nearby competition",
        "Smart location recommendations based on student's course (e.g., Engineering → Fallowfield, Business → City Centre)",
        "Integration with UoM and MMU academic calendars for move-in/move-out automation",
        "Automated deposit collection and protection with Manchester-specific tenancy agreement templates"
      ]}
    />
  );
}
