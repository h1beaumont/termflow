import { LocationPage } from "./LocationPage";

export default function LiverpoolLocation() {
  return (
    <LocationPage
      city="Liverpool"
      citySlug="liverpool"
      universities={[
        "University of Liverpool",
        "Liverpool John Moores University",
        "Liverpool Hope University",
        "Liverpool Institute for Performing Arts (LIPA)"
      ]}
      stats={{
        studentPopulation: "70,000+",
        pbsaProperties: "110+",
        avgOccupancyRate: "94%"
      }}
      challenges={[
        "Managing 300-450 enquiries per week during clearing from four Liverpool universities",
        "High international student population (42%) requiring multilingual support and visa assistance",
        "Coordinating viewings across City Centre, Baltic Triangle, and Campus locations with varying transport links",
        "Competition with Manchester for Northwest England students—instant response is crucial to win bookings",
        "Students often view 8-12 properties before deciding, requiring persistent automated follow-up",
        "Group bookings prevalent—Liverpool students frequently rent in groups of 4-6 (especially LJMU sports teams)"
      ]}
      benefits={[
        "24/7 AI-powered instant response in 30+ languages for Liverpool's diverse international community",
        "Automated viewing booking with Merseyrail and bus integration for accurate journey times to campus",
        "Smart lead prioritization filtering by budget (£85-150/week range), move-in date, and university proximity",
        "Multi-property dashboard managing viewings across City Centre, Baltic Triangle, and Kensington from one platform",
        "Automated contract generation with Liverpool-specific clauses (council tax exemption, HMO licensing for multi-occupancy)",
        "Stripe integration for instant deposit collection with automatic DPS/TDS/MyDeposits protection registration",
        "Group booking automation handling LJMU sports societies and LIPA student group reservations with multi-party signatures"
      ]}
    />
  );
}
