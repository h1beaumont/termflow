import { LocationPage } from "./LocationPage";

export default function SheffieldLocation() {
  return (
    <LocationPage
      city="Sheffield"
      citySlug="sheffield"
      universities={[
        "University of Sheffield",
        "Sheffield Hallam University",
        "Sheffield College (HE courses)"
      ]}
      stats={{
        studentPopulation: "65,000+",
        pbsaProperties: "100+",
        avgOccupancyRate: "93%"
      }}
      challenges={[
        "Clearing season spike to 250-350 enquiries per week from two major universities",
        "High competition between Broomhill, Crookes, Ecclesall Road, and City Centre properties",
        "Managing group bookings—Sheffield students often rent as established friendship groups (5-7 students)",
        "International students (30% of market) need support with visas, bank accounts, and NHS registration",
        "Price-sensitive market—students compare Sheffield's 100+ PBSA options extensively before committing",
        "Location preferences split: Engineering/Science → Broomhill, Arts/Humanities → City Centre, Hallam students → Ecclesall Road"
      ]}
      benefits={[
        "AI automation handling group enquiries automatically—coordinates viewings for all group members simultaneously",
        "Multilingual support for Sheffield's Chinese, Malaysian, Indian, and Nigerian student populations",
        "Automated price benchmarking showing how your property stacks up against Broomhill and Ecclesall Road competition",
        "Smart location recommendations based on course (Engineering → Broomhill, Business → City Centre, Health → Collegiate Crescent)",
        "Integration with Sheffield Uni and Sheffield Hallam academic calendars for seamless move-in/move-out automation",
        "Automated deposit collection with Sheffield-specific tenancy templates and TDS/MyDeposits protection",
        "Tram route and bus integration for automated directions and journey time estimates in viewing confirmations"
      ]}
    />
  );
}
