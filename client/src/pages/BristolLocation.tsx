import { LocationPage } from "./LocationPage";

export default function BristolLocation() {
  return (
    <LocationPage
      city="Bristol"
      citySlug="bristol"
      universities={[
        "University of Bristol",
        "University of the West of England (UWE)",
        "Bristol Old Vic Theatre School"
      ]}
      stats={{
        studentPopulation: "60,000+",
        pbsaProperties: "100+",
        avgOccupancyRate: "95%"
      }}
      challenges={[
        "Split student market—UoB students prefer Clifton/Redland, UWE students prefer Frenchay/Stoke Bishop",
        "Limited PBSA supply creates high demand—properties fill fast during clearing",
        "Handling 300+ enquiries per week across two distinct university catchment areas",
        "Competitive pricing—students expect premium quality at lower-than-London rates",
        "Transport coordination for viewings—Clifton Hill access and parking challenges",
        "International student population (30%) requires visa support and guarantor alternatives"
      ]}
      benefits={[
        "AI automatically recommends properties based on student's university (UoB vs. UWE) and budget",
        "24/7 automated response to secure bookings before competitors—Bristol market moves fast",
        "Smart viewing scheduling accounts for Bristol's hilly terrain and limited parking availability",
        "Automated contract generation with Bristol-specific clauses (council tax exemption certificates)",
        "Multilingual support for Bristol's international students from China, India, UAE, and EU",
        "Integration with First Bus routes for location-based recommendations (near U1, U2, U6 routes)"
      ]}
    />
  );
}
