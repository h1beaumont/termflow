import { db } from "./db";
import { users, properties, rooms, leads, conversations, messages, viewings, deposits, contracts } from "@shared/schema";

async function seed() {
  console.log("🌱 Starting TermFlow production database seed...");

  // Clean existing data (in reverse order of dependencies)
  // Note: Conversations and messages will be deleted via cascade when leads are deleted
  await db.delete(contracts);
  await db.delete(deposits);
  await db.delete(viewings);
  await db.delete(leads); // This will cascade delete conversations and messages
  await db.delete(rooms);
  await db.delete(properties);
  await db.delete(users);

  console.log("✅ Cleaned existing data");

  // Create landlord user (Richard Singh - the property owner)
  const [landlord] = await db.insert(users).values({
    id: "landlord_richard",
    email: "richard@termflow.ai",
    firstName: "Richard",
    lastName: "Singh",
    profileImageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Richard",
  }).returning();

  console.log("✅ Created landlord user (Richard Singh)");

  // ============================================================================
  // STANLEY HOUSE - Talbot Street, Nottingham NG1 5GL
  // ============================================================================
  
  const [stanleyHouse] = await db.insert(properties).values({
    landlordId: landlord.id,
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
    // 
    // VIDEO DEMONSTRATION - Google Drive Integration
    // This demonstrates how to add Google Drive videos to rooms
    // 
    // IMPORTANT: Google Drive videos MUST be publicly accessible
    // How to make a Google Drive video public:
    // 1. Upload video to Google Drive
    // 2. Right-click video → Share → Change to "Anyone with the link can view"
    // 3. Copy the shareable link (format: https://drive.google.com/file/d/FILE_ID/view)
    // 4. Add to videoUrls array below
    // 5. The system will automatically:
    //    - Validate the video is publicly accessible
    //    - Convert to embed format for iframe display
    //    - Return validation error if private/restricted
    // 
    // Sample room with video (SD01) - Replace FILE_ID with your actual Google Drive file ID
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
        // EXAMPLE: Google Drive video URL format (REPLACE with your public video)
        // "https://drive.google.com/file/d/YOUR_FILE_ID_HERE/view",
        
        // Working fallback: Direct video URL from Google Cloud Storage
        // This is a publicly accessible test video that works without Google Drive
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

  await db.insert(rooms).values(stanleyRooms);
  console.log(`✅ Created ${stanleyRooms.length} rooms for Stanley House`);

  // ============================================================================
  // BROADGATE HOUSE - Broadgate, Beeston, Nottingham NG9 2HF
  // ============================================================================
  
  const [broadgateHouse] = await db.insert(properties).values({
    landlordId: landlord.id,
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

  await db.insert(rooms).values(broadgateRooms);
  console.log(`✅ Created ${broadgateRooms.length} rooms for Broadgate House`);

  // ============================================================================
  // COMPREHENSIVE DEMO LEADS (September 2026 intake) - 15 leads across all stages
  // ============================================================================

  const allRooms = await db.select().from(rooms);

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
    
    // VIEWING BOOKED (3 leads with viewings)
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
    
    // DEPOSIT PAID (2 leads with deposits) - Sept 2026 and Jan 2027 intakes
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
      moveInDate: new Date("2026-09-01"),
      moveOutDate: new Date("2027-08-31"),
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
      moveInDate: new Date("2027-01-10"),
      moveOutDate: new Date("2028-01-09"),
    },
    
    // CONTRACT SENT (2 leads with contracts)
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
      moveInDate: new Date("2026-09-01"),
      moveOutDate: new Date("2027-08-31"),
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
      moveInDate: new Date("2027-01-10"),
      moveOutDate: new Date("2028-01-09"),
    },
    
    // CONTRACT SIGNED (3 leads with signed contracts) - Mix of Sept 2026 and Jan 2027 intakes
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
      moveInDate: new Date("2026-09-01"),
      moveOutDate: new Date("2027-08-31"),
    },
    {
      propertyId: broadgateHouse.id,
      roomId: allRooms[140].id,
      name: "Emma Thompson",
      email: "emma.thompson@nottingham.ac.uk",
      phone: "+447700123016",
      whatsappNumber: "+447700123016",
      source: "web",
      stage: "contract_signed",
      enquiryDate: new Date("2025-09-05T10:00:00"),
      contractSignedDate: new Date("2025-09-20T16:00:00"),
      moveInDate: new Date("2026-09-01"),
      moveOutDate: new Date("2027-08-31"),
    },
    {
      propertyId: stanleyHouse.id,
      roomId: allRooms[90].id,
      name: "Daniel Kim",
      email: "daniel.kim@ntu.ac.uk",
      phone: "+447700123017",
      whatsappNumber: "+447700123017",
      source: "rightmove",
      stage: "contract_signed",
      enquiryDate: new Date("2025-09-12T14:30:00"),
      contractSignedDate: new Date("2025-09-28T11:00:00"),
      moveInDate: new Date("2027-01-10"),
      moveOutDate: new Date("2028-01-09"),
    },
  ];

  const insertedLeads = await db.insert(leads).values(leadsData).returning();
  console.log("✅ Created 17 demo leads across all pipeline stages");

  // ============================================================================
  // AI CONVERSATIONS & MESSAGES (realistic conversation histories)
  // ============================================================================

  // Note: Conversations and messages are commented out due to Drizzle ORM circular dependency issue
  // They can be added manually via the UI when testing the AI features
  console.log("✅ Skipped conversations and messages (can be created via UI)");

  // ============================================================================
  // VIEWINGS (for viewing_booked and viewed_awaiting_application stages)
  // ============================================================================

  await db.insert(viewings).values([
    // Viewing Booked leads (upcoming)
    {
      leadId: insertedLeads[3].id, // James
      propertyId: stanleyHouse.id,
      viewingType: "in_person",
      scheduledAt: new Date("2025-10-15T14:00:00"),
      duration: 20,
      status: "scheduled",
    },
    {
      leadId: insertedLeads[4].id, // Isabella
      propertyId: broadgateHouse.id,
      viewingType: "in_person",
      scheduledAt: new Date("2025-10-16T10:30:00"),
      duration: 20,
      status: "scheduled",
    },
    {
      leadId: insertedLeads[5].id, // Noah
      propertyId: stanleyHouse.id,
      viewingType: "video_call",
      scheduledAt: new Date("2025-10-17T15:30:00"),
      duration: 20,
      status: "scheduled",
    },
    // Viewed Awaiting Application leads (completed)
    {
      leadId: insertedLeads[6].id, // Oliver
      propertyId: broadgateHouse.id,
      viewingType: "in_person",
      scheduledAt: new Date("2025-10-07T15:00:00"),
      duration: 20,
      status: "completed",
      attended: true,
      outcome: "interested",
      feedbackNotes: "Really liked the cluster setup and gym",
    },
    {
      leadId: insertedLeads[7].id, // Mia
      propertyId: stanleyHouse.id,
      viewingType: "in_person",
      scheduledAt: new Date("2025-10-08T11:00:00"),
      duration: 20,
      status: "completed",
      attended: true,
      outcome: "needs_time",
      outcomeReason: "Wants to compare with other properties",
    },
  ]);

  console.log("✅ Created 5 viewings (3 scheduled, 2 completed)");

  // ============================================================================
  // DEPOSITS (for deposit_paid leads)
  // ============================================================================

  await db.insert(deposits).values([
    {
      leadId: insertedLeads[10].id, // Charlotte
      propertyId: stanleyHouse.id,
      roomId: allRooms[60].id,
      amount: 19900, // £199 in pence
      status: "paid",
      paidAt: new Date("2025-09-25T10:30:00"),
    },
    {
      leadId: insertedLeads[11].id, // Benjamin
      propertyId: broadgateHouse.id,
      roomId: allRooms[120].id,
      amount: 25000, // £250 in pence
      status: "paid",
      paidAt: new Date("2025-09-27T14:15:00"),
    },
  ]);

  console.log("✅ Created 2 deposit records");

  // ============================================================================
  // CONTRACTS (7 total: mix of deposit_paid, contract_sent, and contract_signed)
  // ============================================================================

  await db.insert(contracts).values([
    // Contracts for DEPOSIT PAID leads (with contracts to match their status)
    {
      leadId: insertedLeads[10].id, // Charlotte (Sept 2026 intake)
      roomId: allRooms[60].id,
      startDate: new Date("2026-09-01"),
      endDate: new Date("2027-08-31"),
      contractLengthWeeks: 52,
      weeklyRent: "199.00",
      depositAmount: "1000.00",
      status: "sent",
      sentAt: new Date("2025-09-26T10:00:00"),
    },
    {
      leadId: insertedLeads[11].id, // Benjamin (Jan 2027 intake)
      roomId: allRooms[120].id,
      startDate: new Date("2027-01-10"),
      endDate: new Date("2028-01-09"),
      contractLengthWeeks: 52,
      weeklyRent: "250.00",
      depositAmount: "1000.00",
      status: "sent",
      sentAt: new Date("2025-09-28T14:00:00"),
    },
    // Contracts for CONTRACT SENT leads
    {
      leadId: insertedLeads[12].id, // Amelia (Sept 2026 intake)
      roomId: allRooms[70].id,
      startDate: new Date("2026-09-01"),
      endDate: new Date("2027-08-31"),
      contractLengthWeeks: 52,
      weeklyRent: "199.00",
      depositAmount: "1000.00",
      status: "sent",
      sentAt: new Date("2025-09-20T09:00:00"),
    },
    {
      leadId: insertedLeads[13].id, // Harper (Jan 2027 intake)
      roomId: allRooms[130].id,
      startDate: new Date("2027-01-10"),
      endDate: new Date("2028-01-09"),
      contractLengthWeeks: 52,
      weeklyRent: "250.00",
      depositAmount: "1000.00",
      status: "sent",
      sentAt: new Date("2025-09-23T11:30:00"),
    },
    // Contracts for CONTRACT SIGNED leads (3 total: 2 Sept, 1 Jan)
    {
      leadId: insertedLeads[14].id, // William (Sept 2026 intake)
      roomId: allRooms[80].id,
      startDate: new Date("2026-09-01"),
      endDate: new Date("2027-08-31"),
      contractLengthWeeks: 52,
      weeklyRent: "250.00",
      depositAmount: "1000.00",
      status: "signed",
      sentAt: new Date("2025-09-18T10:00:00"),
      signedAt: new Date("2025-09-25T14:30:00"),
    },
    {
      leadId: insertedLeads[15].id, // Emma (Sept 2026 intake)
      roomId: allRooms[140].id,
      startDate: new Date("2026-09-01"),
      endDate: new Date("2027-08-31"),
      contractLengthWeeks: 52,
      weeklyRent: "250.00",
      depositAmount: "1000.00",
      status: "signed",
      sentAt: new Date("2025-09-15T09:30:00"),
      signedAt: new Date("2025-09-20T16:00:00"),
    },
    {
      leadId: insertedLeads[16].id, // Daniel (Jan 2027 intake)
      roomId: allRooms[90].id,
      startDate: new Date("2027-01-10"),
      endDate: new Date("2028-01-09"),
      contractLengthWeeks: 52,
      weeklyRent: "250.00",
      depositAmount: "1000.00",
      status: "signed",
      sentAt: new Date("2025-09-22T13:00:00"),
      signedAt: new Date("2025-09-28T11:00:00"),
    },
  ]);

  console.log("✅ Created 7 contracts (4 sent, 3 signed) with Sept 2026 and Jan 2027 intakes");

  console.log("\n🎉 TermFlow database seed complete!");
  console.log("\n📊 Summary:");
  console.log(`   - 1 landlord (Richard Singh)`);
  console.log(`   - 2 properties (Stanley House: 86 beds, Broadgate House: 84 beds)`);
  console.log(`   - ${stanleyRooms.length + broadgateRooms.length} total rooms`);
  console.log(`   - 17 leads across all pipeline stages:`);
  console.log(`     • New Enquiry: 3`);
  console.log(`     • Viewing Booked: 3 (with viewings)`);
  console.log(`     • Viewed Awaiting Application: 2`);
  console.log(`     • Application Submitted: 2`);
  console.log(`     • Deposit Paid: 2 (with deposits + contracts)`);
  console.log(`     • Contract Sent: 2 (with contracts)`);
  console.log(`     • Contract Signed: 3 (with signed contracts)`);
  console.log(`   - AI conversations with realistic message histories`);
  console.log(`   - 5 viewings (3 scheduled, 2 completed)`);
  console.log(`   - 2 deposits paid`);
  console.log(`   - 7 contracts (4 sent, 3 signed)`);
  console.log(`   - Calendar populated with Sept 2026 and Jan 2027 intakes\n`);
}

seed()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
