import { LocationPage } from "./LocationPage";

export default function LondonLocation() {
  return (
    <LocationPage
      city="London"
      citySlug="london"
      universities={[
        "University College London (UCL)",
        "Imperial College London",
        "King's College London",
        "London School of Economics (LSE)",
        "Queen Mary University",
        "City, University of London",
        "University of Westminster",
        "University of Arts London"
      ]}
      stats={{
        studentPopulation: "400,000+",
        pbsaProperties: "500+",
        avgOccupancyRate: "96%"
      }}
      challenges={[
        "Handling 500-800 enquiries per week during clearing season across multiple properties",
        "Managing international students from 150+ countries with language barriers and timezone differences",
        "Coordinating viewings across London zones with transport delays and no-shows",
        "Competing with 500+ PBSA properties—response time is the difference between booking and losing the student",
        "High rental prices mean students shop around more, requiring faster follow-up to secure bookings",
        "Complex Right-to-Rent checks for EU and international students post-Brexit"
      ]}
      benefits={[
        "24/7 instant response in 25+ languages for London's diverse international student population",
        "Automated viewing booking synced with TfL journey times and property availability",
        "Smart lead prioritization—filter high-intent students (budget match, move-in date, nationality)",
        "Multi-property dashboard—manage viewings across Westminster, Camden, Tower Hamlets, etc. from one place",
        "Automated contract generation with London-specific clauses (council tax exemption, HMO compliance)",
        "Stripe integration for secure deposits with automatic TDS/DPS/MyDeposits protection registration"
      ]}
    />
  );
}
