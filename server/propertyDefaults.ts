import { db } from "./db";
import { properties, rooms, leads, viewings, deposits, contracts, callLogs, aiLearningMetrics } from "@shared/schema";
import { subDays, subHours } from "date-fns";

/**
 * Creates default Stanley House and Broadgate House properties with all rooms
 * This is used during landlord onboarding to provide demo properties for the proof of concept
 * 
 * ERROR HANDLING FIX: Wrapped in transaction with comprehensive error handling
 * If ANY insert fails, ALL changes are rolled back to maintain data consistency
 * 
 * @param landlordId - The ID of the landlord to assign the properties to
 * @returns Promise with the created properties
 * @throws Error if any insert fails (with automatic rollback)
 */
export async function createDefaultProperties(landlordId: string) {
  console.log(`🏢 Creating default properties for landlord ${landlordId}...`);

  try {
    // TRANSACTION FIX: Wrap all inserts in a transaction for atomicity
    // If any insert fails, all changes are automatically rolled back
    return await db.transaction(async (tx) => {

      // ============================================================================
      // STANLEY HOUSE - Talbot Street, Nottingham NG1 5GL
      // ============================================================================
      
      const [stanleyHouse] = await tx.insert(properties).values({
    landlordId,
    name: "Stanley House",
    address: "Talbot Street",
    city: "Nottingham",
    postcode: "NG1 5GL",
    description: "Luxury student accommodation in the heart of Nottingham. 2-minute walk from Nottingham Trent University city campus. Features include communal lounges, cinema room, gym, outdoor space, and 43\" smart TVs in every studio. All bills inclusive with ultra-high-speed WiFi.",
    propertyType: "student_accommodation",
    totalBedrooms: 86,
    heroImageUrl: "https://stanleystudentliving.co.uk/assets/images/bsp-stanley-1-1606x903.webp",
    imageUrls: [
      "https://stanleystudentliving.co.uk/assets/images/stanley-house-single-occupancy-10-2000x1125.webp",
      "https://stanleystudentliving.co.uk/assets/images/comm-lounge-2-1-804x537.webp",
      "https://stanleystudentliving.co.uk/assets/images/cinema-13.webp",
      "https://stanleystudentliving.co.uk/assets/images/gym-11.webp",
    ],
    isActive: true,
  }).returning();

  // Stanley House Room Types
  const stanleyRooms = [
    // En Suites (15 rooms)
    ...Array.from({ length: 15 }, (_, i) => ({
      propertyId: stanleyHouse.id,
      roomNumber: `EN${String(i + 1).padStart(2, '0')}`,
      roomType: "en_suite",
      rentPerWeek: "175.00",
      depositAmount: "1000.00",
      size: 22,
      features: ["Ensuite bathroom", "Double bed", "Desk & chair", "Wardrobe", "High-speed WiFi", "All bills inclusive"],
      status: "available" as const,
      availableFrom: new Date("2026-09-01"),
    })),
    
    // Premium Studios (20 rooms)
    ...Array.from({ length: 20 }, (_, i) => ({
      propertyId: stanleyHouse.id,
      roomNumber: `PS${String(i + 1).padStart(2, '0')}`,
      roomType: "premium_studio",
      rentPerWeek: "199.00",
      rentPerWeekDual: "99.50",
      depositAmount: "1000.00",
      size: 22,
      features: ["Private kitchen", "Ensuite bathroom", "43\" Smart TV", "Double bed", "Desk & chair", "4-ring induction hob"],
      isDualOccupancy: true,
      status: "available" as const,
      availableFrom: new Date("2026-09-01"),
      videoUrls: ["https://drive.google.com/file/d/130PvFSWFkshD_SaI5OtglasAY9pWwHHy/preview"],
    })),
    
    // Premium Plus Studios (18 rooms)
    ...Array.from({ length: 18 }, (_, i) => ({
      propertyId: stanleyHouse.id,
      roomNumber: `PP${String(i + 1).padStart(2, '0')}`,
      roomType: "premium_plus_studio",
      rentPerWeek: "204.00",
      rentPerWeekDual: "102.00",
      depositAmount: "1000.00",
      size: 27,
      features: ["Private kitchen", "Ensuite bathroom", "43\" Smart TV", "Double bed", "Desk & chair", "Extra space"],
      isDualOccupancy: true,
      status: "available" as const,
      availableFrom: new Date("2026-09-01"),
    })),
    
    // Deluxe Studios (15 rooms)
    ...Array.from({ length: 15 }, (_, i) => ({
      propertyId: stanleyHouse.id,
      roomNumber: `DX${String(i + 1).padStart(2, '0')}`,
      roomType: "deluxe_studio",
      rentPerWeek: "225.00",
      rentPerWeekDual: "112.50",
      depositAmount: "1000.00",
      size: 35,
      features: ["Large private kitchen", "Luxury ensuite", "43\" Smart TV", "King bed", "Study desk", "Premium appliances"],
      isDualOccupancy: true,
      status: "available" as const,
      availableFrom: new Date("2026-09-01"),
    })),
    
    // Super Deluxe Studios (18 rooms)
    {
      propertyId: stanleyHouse.id,
      roomNumber: "SD01",
      roomType: "super_deluxe_studio",
      rentPerWeek: "250.00",
      rentPerWeekDual: "125.00",
      depositAmount: "1000.00",
      size: 39,
      features: ["Premium kitchen", "Luxury ensuite", "43\" Smart TV", "King bed", "Study area", "Extra living space"],
      isDualOccupancy: true,
      status: "available" as const,
      availableFrom: new Date("2026-09-01"),
      imageUrls: [
        "https://stanleystudentliving.co.uk/assets/images/stanley-house-single-occupancy-10-2000x1125.webp"
      ],
      videoUrls: [
        "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
      ],
    },
    // Remaining Super Deluxe Studios (17 more rooms)
    ...Array.from({ length: 17 }, (_, i) => ({
      propertyId: stanleyHouse.id,
      roomNumber: `SD${String(i + 2).padStart(2, '0')}`,
      roomType: "super_deluxe_studio",
      rentPerWeek: "250.00",
      rentPerWeekDual: "125.00",
      depositAmount: "1000.00",
      size: 39,
      features: ["Premium kitchen", "Luxury ensuite", "43\" Smart TV", "King bed", "Study area", "Extra living space"],
      isDualOccupancy: true,
      status: "available" as const,
      availableFrom: new Date("2026-09-01"),
    })),
  ];

      await tx.insert(rooms).values(stanleyRooms);
      console.log(`✅ Created Stanley House with ${stanleyRooms.length} rooms`);

      // ============================================================================
      // BROADGATE HOUSE - Broadgate, Beeston, Nottingham NG9 2HF
      // ============================================================================
      
      const [broadgateHouse] = await tx.insert(properties).values({
    landlordId,
    name: "Broadgate House",
    address: "Broadgate, Beeston",
    city: "Nottingham",
    postcode: "NG9 2HF",
    description: "84-bed luxury student accommodation near University of Nottingham. 0.4 miles from campus, 4-minute walk to tram station. Features games room, gym, cinema, communal kitchen/lounge, and outdoor space. All bills inclusive.",
    propertyType: "student_accommodation",
    totalBedrooms: 84,
    heroImageUrl: "https://broadgatestudentliving.co.uk/assets/images/high-res-1-photo.jpg",
    imageUrls: [
      "https://broadgatestudentliving.co.uk/assets/images/broadgate-11.jpg",
      "https://broadgatestudentliving.co.uk/assets/images/broadgate-21.jpg",
      "https://broadgatestudentliving.co.uk/assets/images/broadgate-44.jpg",
    ],
    isActive: true,
  }).returning();

  // Broadgate House Room Types
  const broadgateRooms = [
    // Cluster Rooms - 3 bed (12 clusters = 36 rooms)
    ...Array.from({ length: 36 }, (_, i) => ({
      propertyId: broadgateHouse.id,
      roomNumber: `C3-${String(i + 1).padStart(2, '0')}`,
      roomType: "cluster_3bed",
      rentPerWeek: "175.00",
      depositAmount: "1000.00",
      size: 12,
      features: ["Ensuite bedroom", "Shared kitchen", "Shared lounge", "Study desk", "High-speed WiFi"],
      status: "available" as const,
      availableFrom: new Date("2026-09-01"),
    })),
    
    // Cluster Rooms - 4 bed (6 clusters = 24 rooms)
    ...Array.from({ length: 24 }, (_, i) => ({
      propertyId: broadgateHouse.id,
      roomNumber: `C4-${String(i + 1).padStart(2, '0')}`,
      roomType: "cluster_4bed",
      rentPerWeek: "175.00",
      depositAmount: "1000.00",
      size: 12,
      features: ["Ensuite bedroom", "Shared kitchen", "Shared lounge", "Study desk", "High-speed WiFi"],
      status: "available" as const,
      availableFrom: new Date("2026-09-01"),
    })),
    
    // Studios (24 rooms)
    ...Array.from({ length: 24 }, (_, i) => ({
      propertyId: broadgateHouse.id,
      roomNumber: `ST${String(i + 1).padStart(2, '0')}`,
      roomType: "studio",
      rentPerWeek: "250.00",
      depositAmount: "1000.00",
      size: 25,
      features: ["Private kitchen", "Ensuite bathroom", "Double bed", "Study desk", "4-ring induction hob"],
      status: "available" as const,
      availableFrom: new Date("2026-09-01"),
    })),
  ];

      await tx.insert(rooms).values(broadgateRooms);
      console.log(`✅ Created Broadgate House with ${broadgateRooms.length} rooms`);

      // ============================================================================
      // DEMO LEADS (15 leads across all stages for dashboard demonstration)
      // ============================================================================

      const allRooms = await tx.select().from(rooms);

  const leadsData = [
    // NEW ENQUIRY (3 leads)
    {
      propertyId: stanleyHouse.id,
      roomId: allRooms[0].id,
      name: "Emily Williams",
      email: "emily.williams@ntu.ac.uk",
      phone: "+447700123001",
      whatsappNumber: "+447700123001",
      source: "whatsapp",
      stage: "new_enquiry",
      enquiryDate: new Date("2025-10-10T14:30:00"),
    },
    {
      propertyId: broadgateHouse.id,
      roomId: allRooms[86].id,
      name: "Lucas Anderson",
      email: "lucas.anderson@nottingham.ac.uk",
      phone: "+447700123002",
      whatsappNumber: "+447700123002",
      source: "web",
      stage: "new_enquiry",
      enquiryDate: new Date("2025-10-11T09:15:00"),
    },
    {
      propertyId: stanleyHouse.id,
      roomId: allRooms[10].id,
      name: "Ava Johnson",
      email: "ava.johnson@student.ac.uk",
      phone: "+447700123003",
      whatsappNumber: "+447700123003",
      source: "rightmove",
      stage: "new_enquiry",
      enquiryDate: new Date("2025-10-12T16:45:00"),
    },
    
    // VIEWING BOOKED (3 leads)
    {
      propertyId: stanleyHouse.id,
      roomId: allRooms[20].id,
      name: "James Thompson",
      email: "james.t@nottingham.ac.uk",
      phone: "+447700123004",
      whatsappNumber: "+447700123004",
      source: "web",
      stage: "viewing_booked",
      enquiryDate: new Date("2025-10-08T10:15:00"),
      viewingDate: new Date("2025-10-15T14:00:00"),
    },
    {
      propertyId: broadgateHouse.id,
      roomId: allRooms[95].id,
      name: "Isabella Rodriguez",
      email: "isabella.r@ntu.ac.uk",
      phone: "+447700123005",
      whatsappNumber: "+447700123005",
      source: "whatsapp",
      stage: "viewing_booked",
      enquiryDate: new Date("2025-10-09T13:20:00"),
      viewingDate: new Date("2025-10-16T10:30:00"),
    },
    {
      propertyId: stanleyHouse.id,
      roomId: allRooms[30].id,
      name: "Noah Davis",
      email: "noah.davis@student.ac.uk",
      phone: "+447700123006",
      whatsappNumber: "+447700123006",
      source: "zoopla",
      stage: "viewing_booked",
      enquiryDate: new Date("2025-10-10T11:00:00"),
      viewingDate: new Date("2025-10-17T15:30:00"),
    },
    
    // VIEWED AWAITING APPLICATION (2 leads)
    {
      propertyId: broadgateHouse.id,
      roomId: allRooms[100].id,
      name: "Oliver Martinez",
      email: "oliver.m@ntu.ac.uk",
      phone: "+447700123007",
      whatsappNumber: "+447700123007",
      source: "whatsapp",
      stage: "viewed_awaiting_application",
      enquiryDate: new Date("2025-10-01T11:00:00"),
      viewingDate: new Date("2025-10-07T15:00:00"),
    },
    {
      propertyId: stanleyHouse.id,
      roomId: allRooms[40].id,
      name: "Mia Wilson",
      email: "mia.wilson@nottingham.ac.uk",
      phone: "+447700123008",
      whatsappNumber: "+447700123008",
      source: "web",
      stage: "viewed_awaiting_application",
      enquiryDate: new Date("2025-10-03T14:30:00"),
      viewingDate: new Date("2025-10-08T11:00:00"),
    },
    
    // APPLICATION SUBMITTED (2 leads)
    {
      propertyId: broadgateHouse.id,
      roomId: allRooms[110].id,
      name: "Sophie Chen",
      email: "sophie.chen@student.ac.uk",
      phone: "+447700123009",
      whatsappNumber: "+447700123009",
      source: "email",
      stage: "application_submitted",
      enquiryDate: new Date("2025-09-28T09:00:00"),
      applicationDate: new Date("2025-10-05T16:30:00"),
    },
    {
      propertyId: stanleyHouse.id,
      roomId: allRooms[50].id,
      name: "Ethan Brown",
      email: "ethan.brown@ntu.ac.uk",
      phone: "+447700123010",
      whatsappNumber: "+447700123010",
      source: "whatsapp",
      stage: "application_submitted",
      enquiryDate: new Date("2025-09-30T10:15:00"),
      applicationDate: new Date("2025-10-06T14:00:00"),
    },
    
    // DEPOSIT PAID (2 leads)
    {
      propertyId: stanleyHouse.id,
      roomId: allRooms[60].id,
      name: "Charlotte Taylor",
      email: "charlotte.taylor@nottingham.ac.uk",
      phone: "+447700123011",
      whatsappNumber: "+447700123011",
      source: "web",
      stage: "deposit_paid",
      enquiryDate: new Date("2025-09-20T13:00:00"),
      depositPaid: true,
      depositAmount: "1000.00",
    },
    {
      propertyId: broadgateHouse.id,
      roomId: allRooms[120].id,
      name: "Benjamin Lee",
      email: "benjamin.lee@student.ac.uk",
      phone: "+447700123012",
      whatsappNumber: "+447700123012",
      source: "rightmove",
      stage: "deposit_paid",
      enquiryDate: new Date("2025-09-22T15:30:00"),
      depositPaid: true,
      depositAmount: "1000.00",
    },
    
    // CONTRACT SENT (2 leads)
    {
      propertyId: stanleyHouse.id,
      roomId: allRooms[70].id,
      name: "Amelia Patel",
      email: "amelia.patel@nottingham.ac.uk",
      phone: "+447700123013",
      whatsappNumber: "+447700123013",
      source: "web",
      stage: "contract_sent",
      enquiryDate: new Date("2025-09-15T13:00:00"),
      contractSignedDate: null,
    },
    {
      propertyId: broadgateHouse.id,
      roomId: allRooms[130].id,
      name: "Harper White",
      email: "harper.white@ntu.ac.uk",
      phone: "+447700123014",
      whatsappNumber: "+447700123014",
      source: "zoopla",
      stage: "contract_sent",
      enquiryDate: new Date("2025-09-18T10:00:00"),
      contractSignedDate: null,
    },
    
    // CONTRACT SIGNED (1 lead)
    {
      propertyId: stanleyHouse.id,
      roomId: allRooms[80].id,
      name: "William Garcia",
      email: "william.garcia@student.ac.uk",
      phone: "+447700123015",
      whatsappNumber: "+447700123015",
      source: "web",
      stage: "contract_signed",
      enquiryDate: new Date("2025-09-10T09:00:00"),
      contractSignedDate: new Date("2025-09-25T14:30:00"),
    },
  ];

      const insertedLeads = await tx.insert(leads).values(leadsData).returning();
      console.log(`✅ Created 15 demo leads across all pipeline stages`);

      // ============================================================================
      // VIEWINGS (for leads with viewing_booked stage)
      // ============================================================================

      await tx.insert(viewings).values([
    {
      leadId: insertedLeads[3].id, // James Thompson
      propertyId: stanleyHouse.id,
      viewingType: "in_person",
      scheduledAt: new Date("2025-10-15T14:00:00"),
      duration: 20,
      status: "scheduled",
    },
    {
      leadId: insertedLeads[4].id, // Isabella Rodriguez
      propertyId: broadgateHouse.id,
      viewingType: "in_person",
      scheduledAt: new Date("2025-10-16T10:30:00"),
      duration: 20,
      status: "scheduled",
    },
    {
      leadId: insertedLeads[5].id, // Noah Davis
      propertyId: stanleyHouse.id,
      viewingType: "video",
      scheduledAt: new Date("2025-10-17T15:30:00"),
      duration: 15,
      status: "scheduled",
    },
  ]);

      console.log(`✅ Created 3 scheduled viewings`);

      // ============================================================================
      // DEPOSITS (for leads with deposit_paid stage)
      // ============================================================================

      await tx.insert(deposits).values([
    {
      leadId: insertedLeads[10].id, // Charlotte Taylor
      amount: "1000.00",
      status: "paid",
      stripePaymentIntentId: "pi_demo_charlotte_" + Date.now(),
      paidAt: new Date("2025-09-25T10:30:00"),
    },
    {
      leadId: insertedLeads[11].id, // Benjamin Lee
      amount: "1000.00",
      status: "paid",
      stripePaymentIntentId: "pi_demo_benjamin_" + Date.now(),
      paidAt: new Date("2025-09-27T14:15:00"),
    },
  ]);

      console.log(`✅ Created 2 deposit payments`);

      // ============================================================================
      // CONTRACTS (for leads with contract_sent/signed stages + testing)
      // ============================================================================

      const insertedContracts = await tx.insert(contracts).values([
    // Contract 1 - Draft status, NO contractUrl (for upload testing)
    {
      leadId: insertedLeads[10].id, // Charlotte Taylor
      roomId: allRooms[60].id, // Stanley House Deluxe Studio
      startDate: new Date("2026-09-01"),
      endDate: new Date("2027-06-30"),
      contractLengthWeeks: 43,
      weeklyRent: "225.00",
      depositAmount: "1000.00",
      isDualOccupancy: false,
      status: "draft",
      approvalStatus: "pending",
      rightToRentStatus: "not_started",
      depositChargeStatus: "not_charged",
      tenantSignatureStatus: "not_signed",
      landlordSignatureStatus: "not_signed",
      // No contractUrl - needs upload
    },
    // Contract 2 - Draft status, NO contractUrl (for upload testing)
    {
      leadId: insertedLeads[11].id, // Benjamin Lee
      roomId: allRooms[120].id, // Broadgate House Studio
      startDate: new Date("2026-09-01"),
      endDate: new Date("2027-07-31"),
      contractLengthWeeks: 48,
      weeklyRent: "250.00",
      depositAmount: "1000.00",
      isDualOccupancy: false,
      status: "draft",
      approvalStatus: "pending",
      rightToRentStatus: "not_started",
      depositChargeStatus: "not_charged",
      tenantSignatureStatus: "not_signed",
      landlordSignatureStatus: "not_signed",
      // No contractUrl - needs upload
    },
    // Contract 3 - Signed status, HAS contractUrl (existing document)
    {
      leadId: insertedLeads[12].id, // Amelia Patel
      roomId: allRooms[70].id, // Stanley House Deluxe Studio
      startDate: new Date("2026-09-01"),
      endDate: new Date("2027-08-31"),
      contractLengthWeeks: 52,
      weeklyRent: "225.00",
      depositAmount: "1000.00",
      isDualOccupancy: false,
      status: "signed",
      approvalStatus: "approved",
      rightToRentStatus: "passed",
      rightToRentCheckedAt: new Date("2025-09-16T10:00:00"),
      depositChargeStatus: "charged",
      depositChargedAt: new Date("2025-09-20T14:30:00"),
      tenantSignatureStatus: "signed",
      tenantSignedAt: new Date("2025-09-18T16:45:00"),
      landlordSignatureStatus: "signed",
      landlordSignedAt: new Date("2025-09-19T09:20:00"),
      contractUrl: "https://example.com/contracts/amelia-patel.pdf",
      sentAt: new Date("2025-09-15T13:00:00"),
      signedAt: new Date("2025-09-19T09:20:00"),
    },
    // Contract 4 - Active status, HAS contractUrl (dual occupancy)
    {
      leadId: insertedLeads[13].id, // Harper White
      roomId: allRooms[130].id, // Broadgate House Studio
      startDate: new Date("2026-09-01"),
      endDate: new Date("2027-08-31"),
      contractLengthWeeks: 52,
      weeklyRent: "250.00",
      depositAmount: "1000.00",
      isDualOccupancy: true,
      status: "active",
      approvalStatus: "approved",
      rightToRentStatus: "passed",
      rightToRentCheckedAt: new Date("2025-09-19T11:30:00"),
      depositChargeStatus: "charged",
      depositChargedAt: new Date("2025-09-22T10:00:00"),
      tenantSignatureStatus: "signed",
      tenantSignedAt: new Date("2025-09-20T14:15:00"),
      landlordSignatureStatus: "signed",
      landlordSignedAt: new Date("2025-09-21T10:00:00"),
      contractUrl: "https://example.com/contracts/harper-white.pdf",
      sentAt: new Date("2025-09-18T10:00:00"),
      signedAt: new Date("2025-09-21T10:00:00"),
      sequenceCompletedAt: new Date("2025-09-22T10:00:00"),
    },
    // Contract 5 - Signed status, HAS contractUrl (premium studio)
    {
      leadId: insertedLeads[14].id, // William Garcia
      roomId: allRooms[80].id, // Stanley House Super Deluxe Studio
      startDate: new Date("2026-09-01"),
      endDate: new Date("2027-08-31"),
      contractLengthWeeks: 52,
      weeklyRent: "250.00",
      depositAmount: "1000.00",
      isDualOccupancy: false,
      status: "signed",
      approvalStatus: "approved",
      rightToRentStatus: "passed",
      rightToRentCheckedAt: new Date("2025-09-23T15:00:00"),
      depositChargeStatus: "charged",
      depositChargedAt: new Date("2025-09-26T11:00:00"),
      tenantSignatureStatus: "signed",
      tenantSignedAt: new Date("2025-09-25T14:30:00"),
      landlordSignatureStatus: "signed",
      landlordSignedAt: new Date("2025-09-26T09:00:00"),
      contractUrl: "https://example.com/contracts/william-garcia.pdf",
      sentAt: new Date("2025-09-22T09:00:00"),
      signedAt: new Date("2025-09-26T09:00:00"),
    },
  ]).returning();

      console.log(`✅ Created 5 contracts (2 draft for upload testing, 2 signed, 1 active)`);

      console.log(`🎉 Default properties created successfully: ${stanleyRooms.length + broadgateRooms.length} total rooms`);

      return {
        stanleyHouse,
        broadgateHouse,
        totalRooms: stanleyRooms.length + broadgateRooms.length,
        totalLeads: insertedLeads.length,
        leadIds: insertedLeads.map(l => l.id),
        contractIds: insertedContracts.map(c => c.id),
      };
    }); // End of transaction
  } catch (error: any) {
    // COMPREHENSIVE ERROR HANDLING: Log detailed error and rollback transaction
    console.error(`❌ Failed to create default properties for landlord ${landlordId}:`, {
      error: error.message,
      code: error.code,
      stack: error.stack,
    });
    
    // Transaction is automatically rolled back on error
    throw new Error(`Failed to create default properties: ${error.message}`);
  }
}

/**
 * Creates comprehensive demo call logs for AI Sales Trainer
 * This populates the AI Sales Trainer page with realistic coaching data
 * 
 * ERROR HANDLING FIX: Wrapped in transaction with comprehensive error handling
 * If ANY insert fails, ALL changes are rolled back to maintain data consistency
 * 
 * @param landlordId - The ID of the landlord
 * @param leadIds - Array of lead IDs to link calls to
 * @throws Error if any insert fails (with automatic rollback)
 */
export async function createDefaultCallLogs(landlordId: string, leadIds: string[]) {
  console.log(`📞 Creating demo call logs for AI Sales Trainer...`);

  try {
    // TRANSACTION FIX: Wrap all inserts in a transaction for atomicity
    return await db.transaction(async (tx) => {

  const callLogsData = [
    // Call 1 - High performing call with coaching
    {
      landlordId,
      leadId: leadIds[0],
      callId: `demo_call_${Date.now()}_1`,
      callerNumber: "+447700123001",
      clientNumber: "+441158470000",
      callDuration: 420,
      callTimestamp: subDays(new Date(), 2),
      callScore: 92,
      customerSentiment: "positive",
      callSummary: "Student enquiry about premium studio at Stanley House. Strong interest shown in bills-inclusive package and proximity to NTU campus. Booking arranged for viewing on Friday.",
      actionItems: "1. Send viewing confirmation via WhatsApp\n2. Prepare room tour highlighting gym and cinema facilities\n3. Have dual occupancy pricing ready",
      staffReviewed: true,
      aiCoachSummary: "Excellent rapport building in opening 90 seconds. Agent successfully identified student's budget constraints early and positioned dual occupancy option effectively. Strong active listening demonstrated when student mentioned fitness interests - immediately highlighted gym facilities. Minor improvement: could have preemptively addressed parking question that came up at 6min mark.",
      conversionOpportunities: [
        { opportunity: "Student expressed budget concerns around £200/week - successfully offered dual occupancy option reducing to £99.50pp", confidence: 0.92 },
        { opportunity: "Mentioned starting in September 2026 - could have created urgency by mentioning limited availability", confidence: 0.78 },
        { opportunity: "Asked about gym access - perfect moment to upsell premium facilities and 24/7 access", confidence: 0.88 }
      ],
      missedTalkingPoints: [
        { point: "All-inclusive bills package saves £600-800/year vs competitors", confidence: 0.85 },
        { point: "Cinema room available for private bookings", confidence: 0.72 }
      ],
      skillFocusAreas: [
        { skill: "Objection Handling", priority: "medium" },
        { skill: "Value Proposition", priority: "high" }
      ],
      improvementScore: 15,
    },
    
    // Call 2 - Good call with room for improvement
    {
      landlordId,
      leadId: leadIds[1],
      callId: `demo_call_${Date.now()}_2`,
      callerNumber: "+447700123002",
      clientNumber: "+441158470000",
      callDuration: 285,
      callTimestamp: subDays(new Date(), 5),
      callScore: 78,
      customerSentiment: "neutral",
      callSummary: "International student from China asking about cluster rooms at Broadgate House. Questions about safety, transport links, and payment options. Viewing scheduled for next Tuesday.",
      actionItems: "1. Email transport map and tram timetable\n2. Prepare international student welcome pack\n3. Share payment installment options",
      staffReviewed: false,
      aiCoachSummary: "Good handling of international student concerns, particularly around safety and transport. Agent provided clear information about tram station proximity (4min walk). However, missed opportunity to highlight our established Chinese student community. Could improve by having testimonials from current international students ready to share.",
      conversionOpportunities: [
        { opportunity: "Student asked about safety - could have emphasized 24/7 security system and CCTV coverage", confidence: 0.89 },
        { opportunity: "Expressed concern about making friends - perfect moment to mention communal areas and social events", confidence: 0.81 },
        { opportunity: "Asked about payment - could have offered guarantor-free option for international students", confidence: 0.76 }
      ],
      missedTalkingPoints: [
        { point: "International student support services", confidence: 0.84 },
        { point: "Existing Chinese student community at property", confidence: 0.79 },
        { point: "Airport pickup service available", confidence: 0.73 }
      ],
      skillFocusAreas: [
        { skill: "Cultural Awareness", priority: "high" },
        { skill: "Community Building", priority: "medium" }
      ],
      improvementScore: 8,
    },
    
    // Call 3 - Average performance
    {
      landlordId,
      leadId: leadIds[2],
      callId: `demo_call_${Date.now()}_3`,
      callerNumber: "+447700123003",
      clientNumber: "+441158470000",
      callDuration: 195,
      callTimestamp: subDays(new Date(), 8),
      callScore: 65,
      customerSentiment: "neutral",
      callSummary: "Quick enquiry about en-suite availability. Student seemed rushed. Basic information provided about pricing and location.",
      actionItems: "1. Follow up via WhatsApp with property video\n2. Send available room list",
      staffReviewed: true,
      aiCoachSummary: "Call felt transactional rather than consultative. Agent provided accurate information but didn't probe to understand student's needs. When student mentioned being 'in a rush', agent should have offered to schedule callback rather than rushing through details. Missed chance to build rapport.",
      conversionOpportunities: [
        { opportunity: "Student mentioned being first-year - could have highlighted social aspects and study spaces", confidence: 0.82 },
        { opportunity: "Asked only about price - should have explored budget and value perception", confidence: 0.77 }
      ],
      missedTalkingPoints: [
        { point: "Virtual viewing available if too busy for in-person", confidence: 0.88 },
        { point: "Flexible viewing times including weekends", confidence: 0.81 }
      ],
      skillFocusAreas: [
        { skill: "Needs Assessment", priority: "high" },
        { skill: "Relationship Building", priority: "high" }
      ],
      improvementScore: -5,
    },

    // Call 4 - Strong closer
    {
      landlordId,
      leadId: leadIds[3],
      callId: `demo_call_${Date.now()}_4`,
      callerNumber: "+447700123004",
      clientNumber: "+441158470000",
      callDuration: 380,
      callTimestamp: subDays(new Date(), 10),
      callScore: 88,
      customerSentiment: "positive",
      callSummary: "Parent calling on behalf of daughter. Discussed safety features, cleaning schedules, and lease terms. Successfully booked viewing and secured verbal commitment.",
      actionItems: "1. Email safety certificate and fire safety info to parent\n2. Include daughter on viewing confirmation\n3. Prepare contract terms document",
      staffReviewed: true,
      aiCoachSummary: "Excellent adaptation when realizing caller was parent not student. Agent shifted focus to safety, value for money, and peace of mind - exactly what parents prioritize. Strong close with clear next steps. Only minor point: could have asked to speak with daughter briefly to build direct relationship.",
      conversionOpportunities: [
        { opportunity: "Parent concerned about cleaning - highlighted weekly professional cleaning included", confidence: 0.91 },
        { opportunity: "Asked about emergency procedures - perfect opportunity to detail our 24/7 support", confidence: 0.87 },
        { opportunity: "Worried about daughter being far from home - could have mentioned parent portal access", confidence: 0.79 }
      ],
      missedTalkingPoints: [
        { point: "Parent guarantee option instead of student guarantor", confidence: 0.86 },
        { point: "Monthly photo updates service for concerned parents", confidence: 0.74 }
      ],
      skillFocusAreas: [
        { skill: "Stakeholder Management", priority: "medium" },
        { skill: "Closing Techniques", priority: "medium" }
      ],
      improvementScore: 12,
    },

    // Call 5 - Needs improvement
    {
      landlordId,
      leadId: leadIds[4],
      callId: `demo_call_${Date.now()}_5`,
      callerNumber: "+447700123005",
      clientNumber: "+441158470000",
      callDuration: 240,
      callTimestamp: subDays(new Date(), 12),
      callScore: 58,
      customerSentiment: "negative",
      callSummary: "Student complained about pricing being higher than competitors. Agent defended price but didn't effectively communicate value. Call ended without booking.",
      actionItems: "1. Review competitor pricing\n2. Send value comparison document\n3. Manager to follow up",
      staffReviewed: false,
      aiCoachSummary: "Defensive posture when pricing objection raised. Agent should acknowledge concern first, then pivot to value rather than justifying price. Missed multiple opportunities to discuss bills-inclusive saving of £80-100/month. When student mentioned 'cheaper option on Zoopla', should have asked specifics to properly position our offering.",
      conversionOpportunities: [
        { opportunity: "Student price-shopping - should have calculated total cost of ownership comparison", confidence: 0.93 },
        { opportunity: "Mentioned Zoopla listing - could have highlighted risks of hidden costs", confidence: 0.84 },
        { opportunity: "Focused only on weekly rent - needed to show annual value and included amenities", confidence: 0.89 }
      ],
      missedTalkingPoints: [
        { point: "Bills included saves £80-100/month vs separate contracts", confidence: 0.95 },
        { point: "No agency fees or admin charges", confidence: 0.91 },
        { point: "Free gym membership worth £300/year", confidence: 0.87 },
        { point: "High-speed WiFi included (competitors charge £25/month)", confidence: 0.82 }
      ],
      skillFocusAreas: [
        { skill: "Objection Handling", priority: "high" },
        { skill: "Value-Based Selling", priority: "high" },
        { skill: "Competitive Positioning", priority: "high" }
      ],
      improvementScore: -12,
    },

    // Call 6 - Technical proficiency
    {
      landlordId,
      leadId: leadIds[5],
      callId: `demo_call_${Date.now()}_6`,
      callerNumber: "+447700123006",
      clientNumber: "+441158470000",
      callDuration: 315,
      callTimestamp: subDays(new Date(), 15),
      callScore: 82,
      customerSentiment: "positive",
      callSummary: "Engineering student very detail-oriented. Asked technical questions about internet speed, study facilities, and noise policies. Viewing booked after thorough discussion.",
      actionItems: "1. Send tech specs for WiFi infrastructure\n2. Share quiet hours policy document\n3. Prepare study room availability calendar",
      staffReviewed: true,
      aiCoachSummary: "Agent demonstrated strong product knowledge when faced with technical questions. Good patience with detail-oriented student. Successfully positioned gigabit WiFi as key differentiator. Could improve by offering to connect student with current engineering students as social proof.",
      conversionOpportunities: [
        { opportunity: "Student emphasized need for fast internet - highlighted gigabit WiFi for video calls and downloads", confidence: 0.94 },
        { opportunity: "Asked about study spaces - could have mentioned 24/7 access and individual study pods", confidence: 0.83 },
        { opportunity: "Concerned about noise - perfect time to discuss our engineering student cluster", confidence: 0.79 }
      ],
      missedTalkingPoints: [
        { point: "Dedicated maker space for engineering projects", confidence: 0.81 },
        { point: "Printing credits included in rent", confidence: 0.77 }
      ],
      skillFocusAreas: [
        { skill: "Product Knowledge", priority: "low" },
        { skill: "Peer Referrals", priority: "medium" }
      ],
      improvementScore: 9,
    },

    // Call 7 - Group booking opportunity
    {
      landlordId,
      leadId: leadIds[6],
      callId: `demo_call_${Date.now()}_7`,
      callerNumber: "+447700123007",
      clientNumber: "+441158470000",
      callDuration: 455,
      callTimestamp: subDays(new Date(), 18),
      callScore: 85,
      customerSentiment: "positive",
      callSummary: "Student looking for accommodation for group of 4 friends. Discussed cluster options vs individual studios. Agent suggested mixed solution. Group viewing arranged.",
      actionItems: "1. Block 4 rooms in same cluster for viewing\n2. Prepare group booking discount info\n3. Send cluster floor plans",
      staffReviewed: false,
      aiCoachSummary: "Excellent recognition of group booking opportunity. Agent proactively suggested keeping friends together in same cluster. Good upselling when mentioning private studios for those wanting more privacy. Could have offered early bird group discount to create urgency.",
      conversionOpportunities: [
        { opportunity: "Group of 4 friends - offered adjacent rooms in cluster", confidence: 0.96 },
        { opportunity: "Two students wanted private space - suggested studios in same building", confidence: 0.88 },
        { opportunity: "Asked about booking all together - could have offered group discount incentive", confidence: 0.91 }
      ],
      missedTalkingPoints: [
        { point: "10% group booking discount for 3+ friends", confidence: 0.93 },
        { point: "Refer-a-friend scheme £50 per successful referral", confidence: 0.87 }
      ],
      skillFocusAreas: [
        { skill: "Upselling", priority: "low" },
        { skill: "Urgency Creation", priority: "medium" }
      ],
      improvementScore: 11,
    },

    // Call 8 - Late-night enquiry
    {
      landlordId,
      leadId: leadIds[7],
      callId: `demo_call_${Date.now()}_8`,
      callerNumber: "+447700123008",
      clientNumber: "+441158470000",
      callDuration: 180,
      callTimestamp: subHours(subDays(new Date(), 20), 22),
      callScore: 71,
      customerSentiment: "neutral",
      callSummary: "Quick evening call from student who just received university offer. Excited but time-constrained. Basic info provided, follow-up scheduled.",
      actionItems: "1. Send congratulations message via WhatsApp\n2. Share 'new student guide' resource\n3. Book callback for detailed discussion",
      staffReviewed: true,
      aiCoachSummary: "Agent appropriately recognized student's excitement and time constraints. Good decision to schedule proper follow-up rather than rushing. However, could have sent instant WhatsApp with virtual tour link to maintain engagement overnight.",
      conversionOpportunities: [
        { opportunity: "Student just got university offer - high motivation, should have secured viewing ASAP", confidence: 0.86 },
        { opportunity: "Called at 10pm showing urgency - could have offered next-day viewing", confidence: 0.82 }
      ],
      missedTalkingPoints: [
        { point: "Early bird discount for confirmed offer holders", confidence: 0.88 },
        { point: "Virtual viewing available immediately", confidence: 0.85 }
      ],
      skillFocusAreas: [
        { skill: "Urgency Recognition", priority: "high" },
        { skill: "Digital Engagement", priority: "medium" }
      ],
      improvementScore: 4,
    },

    // Call 9 - Simple info call (no coaching)
    {
      landlordId,
      leadId: leadIds[8],
      callId: `demo_call_${Date.now()}_9`,
      callerNumber: "+447700123009",
      clientNumber: "+441158470000",
      callDuration: 120,
      callTimestamp: subDays(new Date(), 22),
      callScore: 68,
      customerSentiment: "neutral",
      callSummary: "Brief enquiry about deposit amounts and payment dates. Information provided, student to call back.",
      actionItems: "1. Send deposit protection scheme certificate\n2. Email payment schedule options",
      staffReviewed: false,
    },

    // Call 10 - Returning student (no coaching)
    {
      landlordId,
      leadId: leadIds[9],
      callId: `demo_call_${Date.now()}_10`,
      callerNumber: "+447700123010",
      clientNumber: "+441158470000",
      callDuration: 265,
      callTimestamp: subDays(new Date(), 24),
      callScore: 79,
      customerSentiment: "positive",
      callSummary: "Second-year student returning. Discussed room upgrade options. Very familiar with property already.",
      actionItems: "1. Check premium studio availability\n2. Send returning student loyalty discount\n3. Process room swap request",
      staffReviewed: true,
    },

    // Call 11 - Parent call with coaching
    {
      landlordId,
      leadId: leadIds[10],
      callId: `demo_call_${Date.now()}_11`,
      callerNumber: "+447700123011",
      clientNumber: "+441158470000",
      callDuration: 395,
      callTimestamp: subDays(new Date(), 26),
      callScore: 90,
      customerSentiment: "positive",
      callSummary: "Concerned parent asking detailed questions about security, contracts, and student welfare. Agent provided reassurance and comprehensive answers. Deposit paid during call.",
      actionItems: "1. Email all certifications (gas, electric, fire)\n2. Send parent information pack\n3. Process deposit payment",
      staffReviewed: true,
      aiCoachSummary: "Outstanding call handling with parent. Agent recognized key concerns (safety, legality, welfare) and addressed each methodically with evidence. Excellent trust-building when offering to arrange call with current parent of tenant. Strong close by processing deposit immediately while parent had confidence.",
      conversionOpportunities: [
        { opportunity: "Parent worried about contracts - immediately offered to email landlord-approved legal review", confidence: 0.94 },
        { opportunity: "Asked about safety record - shared zero incident history and certificates", confidence: 0.92 },
        { opportunity: "Concerned about welfare - offered parent portal with emergency contact access", confidence: 0.89 }
      ],
      missedTalkingPoints: [
        { point: "Insurance partnership offering student contents cover", confidence: 0.79 }
      ],
      skillFocusAreas: [
        { skill: "Trust Building", priority: "low" },
        { skill: "Evidence-Based Selling", priority: "low" }
      ],
      improvementScore: 18,
    },

    // Call 12 - Quick follow-up (no coaching)
    {
      landlordId,
      leadId: leadIds[11],
      callId: `demo_call_${Date.now()}_12`,
      callerNumber: "+447700123012",
      clientNumber: "+441158470000",
      callDuration: 145,
      callTimestamp: subDays(new Date(), 28),
      callScore: 72,
      customerSentiment: "positive",
      callSummary: "Follow-up call after viewing. Student confirming interest and asking about next steps. Application process explained.",
      actionItems: "1. Send application link via email\n2. Share guarantor form\n3. Schedule contract signing appointment",
      staffReviewed: false,
    },

    // Call 13 - Complex negotiation with coaching
    {
      landlordId,
      leadId: leadIds[12],
      callId: `demo_call_${Date.now()}_13`,
      callerNumber: "+447700123013",
      clientNumber: "+441158470000",
      callDuration: 510,
      callTimestamp: subDays(new Date(), 29),
      callScore: 75,
      customerSentiment: "neutral",
      callSummary: "Student negotiating on price and trying to reduce contract length from 51 to 44 weeks. Agent held firm on pricing but offered flexibility on move-in date to reduce total cost.",
      actionItems: "1. Send revised quote with flexible move-in\n2. Calculate total savings from later start\n3. Set deadline for decision",
      staffReviewed: true,
      aiCoachSummary: "Good negotiation stance maintaining price integrity while finding creative solutions. Agent correctly understood student's real concern was total cost, not weekly rate. Smart pivot to adjust move-in date rather than discount rent. However, could have been clearer about the deadline for holding the room at current price.",
      conversionOpportunities: [
        { opportunity: "Student wanted 44 weeks instead of 51 - offered flexible start date to reduce overlap", confidence: 0.91 },
        { opportunity: "Focused on weekly price - should have shown total cost comparison with competitors", confidence: 0.84 },
        { opportunity: "Mentioned other viewings lined up - could have created urgency with limited availability", confidence: 0.88 }
      ],
      missedTalkingPoints: [
        { point: "Early termination clause available with 8 weeks notice", confidence: 0.83 },
        { point: "Sublet policy allows finding replacement tenant", confidence: 0.79 }
      ],
      skillFocusAreas: [
        { skill: "Negotiation", priority: "medium" },
        { skill: "Creative Problem Solving", priority: "low" },
        { skill: "Deadline Setting", priority: "high" }
      ],
      improvementScore: 6,
    },

    // Call 14 - International postgrad (no coaching)
    {
      landlordId,
      leadId: leadIds[13],
      callId: `demo_call_${Date.now()}_14`,
      callerNumber: "+447700123014",
      clientNumber: "+441158470000",
      callDuration: 290,
      callTimestamp: subDays(new Date(), 30),
      callScore: 81,
      customerSentiment: "positive",
      callSummary: "Postgraduate student from India. Discussed studio options, payment plans, and guarantor alternatives. Video viewing arranged.",
      actionItems: "1. Send virtual tour link\n2. Share international student payment guide\n3. Email guarantor-free deposit option",
      staffReviewed: false,
    },

    // Call 15 - Urgent clearing call with coaching
    {
      landlordId,
      leadId: leadIds[14],
      callId: `demo_call_${Date.now()}_15`,
      callerNumber: "+447700123015",
      clientNumber: "+441158470000",
      callDuration: 340,
      callTimestamp: subDays(new Date(), 30),
      callScore: 95,
      customerSentiment: "positive",
      callSummary: "Clearing student who just got Nottingham place needs urgent accommodation. Agent fast-tracked entire process, arranged same-day viewing, and secured deposit within 2 hours of initial call.",
      actionItems: "1. Fast-track contract preparation\n2. Arrange urgent Right to Rent check\n3. Coordinate move-in for next week",
      staffReviewed: true,
      aiCoachSummary: "Exceptional performance under pressure. Agent immediately recognized clearing urgency and activated fast-track protocol. Brilliant decision to handle deposit during viewing to secure placement. Perfect balance of speed and thoroughness - student felt supported not rushed. This is benchmark performance for urgent enquiries.",
      conversionOpportunities: [
        { opportunity: "Clearing student with immediate need - activated same-day viewing protocol", confidence: 0.98 },
        { opportunity: "Student worried about losing place - processed deposit on-site during viewing", confidence: 0.96 },
        { opportunity: "Asked if rooms still available - created confidence by showing real-time availability", confidence: 0.93 }
      ],
      missedTalkingPoints: [],
      skillFocusAreas: [
        { skill: "Urgency Response", priority: "low" },
        { skill: "Process Optimization", priority: "low" }
      ],
      improvementScore: 20,
    },
  ];

      const insertedCallLogs = await tx.insert(callLogs).values(callLogsData).returning();
      console.log(`✅ Created ${insertedCallLogs.length} demo call logs with AI coaching insights`);

      // ============================================================================
      // AI LEARNING METRICS - Performance trends over time
      // ============================================================================

  const learningMetricsData = [];
  const today = new Date();

  // Create 20 metrics over past 30 days showing improvement trend
  for (let i = 19; i >= 0; i--) {
    const metricDate = subDays(today, i * 1.5); // Spread over 30 days
    const periodStart = subDays(metricDate, 7);
    const periodEnd = metricDate;
    
    // Simulate improving performance over time
    const progressFactor = (20 - i) / 20; // 0 to 1 as we get closer to today
    
    learningMetricsData.push({
      landlordId,
      metricType: 'avg_call_score',
      periodStart,
      periodEnd,
      value: (65 + progressFactor * 18).toFixed(2), // 65 -> 83 improvement
      previousValue: i < 19 ? (65 + ((20 - i - 1) / 20) * 18).toFixed(2) : "62.00",
      trend: progressFactor > 0.5 ? 'improving' : (progressFactor > 0.3 ? 'stable' : 'improving'),
      dataPoints: Math.floor(3 + progressFactor * 9), // 3 -> 12 calls analyzed
    });
  }

      await tx.insert(aiLearningMetrics).values(learningMetricsData).returning();
      console.log(`✅ Created ${learningMetricsData.length} AI learning metrics showing performance trends`);

      return {
        callLogsCreated: insertedCallLogs.length,
        metricsCreated: learningMetricsData.length,
      };
    }); // End of transaction
  } catch (error: any) {
    // COMPREHENSIVE ERROR HANDLING: Log detailed error and rollback transaction
    console.error(`❌ Failed to create call logs for landlord ${landlordId}:`, {
      error: error.message,
      code: error.code,
      stack: error.stack,
    });
    
    // Transaction is automatically rolled back on error
    throw new Error(`Failed to create call logs: ${error.message}`);
  }
}
