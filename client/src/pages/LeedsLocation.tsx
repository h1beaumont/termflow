import { LocationPage } from "./LocationPage";

export default function LeedsLocation() {
  return (
    <LocationPage
      city="Leeds"
      citySlug="leeds"
      universities={[
        "University of Leeds",
        "Leeds Beckett University",
        "Leeds Arts University",
        "Leeds Trinity University"
      ]}
      stats={{
        studentPopulation: "70,000+",
        pbsaProperties: "120+",
        avgOccupancyRate: "94%"
      }}
      challenges={[
        "Clearing season spike to 350+ enquiries per week from Leeds' four universities",
        "High competition between Hyde Park, Headingley, and City Centre properties",
        "Managing group bookings from societies—Leeds students often rent in groups of 5-8",
        "International students (35% of market) need support with Right-to-Rent, bank accounts, NHS registration",
        "Price-conscious market—students shop around Leeds' 120+ PBSA properties before deciding",
        "Location preferences vary by course: Medical School → Woodhouse, Business School → City Centre, Arts → Hyde Park"
      ]}
      benefits={[
        "AI handles group booking enquiries automatically—captures all student details and coordinates viewing times for entire groups",
        "Multilingual support for Leeds' Chinese, Indian, Malaysian, and Middle Eastern student populations",
        "Automated price comparison tools showing how your property compares vs. nearby Hyde Park and Headingley competition",
        "Smart location recommendations based on student's course (Engineering → Woodhouse, Law → City Centre)",
        "Integration with Leeds Uni and Leeds Beckett academic calendars for move-in/move-out automation",
        "Automated deposit collection and protection with Leeds-specific tenancy agreement templates",
        "WhatsApp-first communication (where 55% of Leeds student enquiries happen)"
      ]}
    />
  );
}
