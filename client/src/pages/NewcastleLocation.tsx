import { LocationPage } from "./LocationPage";

export default function NewcastleLocation() {
  return (
    <LocationPage
      city="Newcastle"
      citySlug="newcastle"
      universities={[
        "Newcastle University",
        "Northumbria University",
        "Newcastle College"
      ]}
      stats={{
        studentPopulation: "55,000+",
        pbsaProperties: "80+",
        avgOccupancyRate: "93%"
      }}
      challenges={[
        "Two distinct student markets—Newcastle Uni (Russell Group, more international) vs. Northumbria (UK-focused)",
        "Jesmond vs. City Centre location preferences create distinct property positioning challenges",
        "Handling 250+ enquiries per week with limited staff during clearing season",
        "Price-sensitive market—students expect value for money and compare Newcastle to cheaper northern cities",
        "International students (25%) need support navigating UK housing system and visa requirements",
        "Metro line disruptions affect viewing attendance—need flexible rescheduling"
      ]}
      benefits={[
        "AI automatically segments Newcastle Uni vs. Northumbria students and recommends appropriate properties",
        "Automated Jesmond vs. City Centre location comparison based on student preferences and budget",
        "24/7 multilingual support for Newcastle's Chinese, Indian, Nigerian, and Middle Eastern students",
        "Smart pricing recommendations based on Newcastle market rates and competitor analysis",
        "Metro integration—property recommendations highlight proximity to Yellow, Green, or Airport Metro lines",
        "Automated contract generation with Newcastle-specific clauses and deposit protection via TDS/DPS"
      ]}
    />
  );
}
