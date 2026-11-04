import { LocationPage } from "./LocationPage";

export default function GlasgowLocation() {
  return (
    <LocationPage
      city="Glasgow"
      citySlug="glasgow"
      universities={[
        "University of Glasgow",
        "University of Strathclyde",
        "Glasgow Caledonian University",
        "Royal Conservatoire of Scotland",
        "Glasgow School of Art"
      ]}
      stats={{
        studentPopulation: "90,000+",
        pbsaProperties: "140+",
        avgOccupancyRate: "95%"
      }}
      challenges={[
        "Managing 400+ enquiries per week during clearing from five major Glasgow universities",
        "High proportion of EU and international students (40%) requiring post-Brexit Right-to-Rent guidance",
        "Coordinating viewings across West End, City Centre, and Merchant City locations with transport complexities",
        "Competition with Edinburgh for Scottish and international students—response speed is critical",
        "Students often view 10+ properties before deciding, requiring consistent follow-up",
        "Group bookings common—Glasgow students frequently rent in groups of 4-6 (flats/cluster apartments)"
      ]}
      benefits={[
        "24/7 instant AI response in 25+ languages handling Glasgow's diverse international student community",
        "Automated viewing booking with Glasgow Subway and bus route integration for accurate journey times",
        "Smart lead scoring prioritizing high-intent students based on budget match, move-in urgency, and university proximity",
        "Multi-property dashboard managing viewings across West End, Merchant City, and City Centre from one system",
        "Automated contract generation with Scottish tenancy law compliance (PRT agreements, deposit schemes)",
        "Stripe integration for deposits with automatic protection via SafeDeposits Scotland or MyDeposits Scotland",
        "Post-Brexit Right-to-Rent automation with IDVT for EU students requiring visa verification"
      ]}
    />
  );
}
