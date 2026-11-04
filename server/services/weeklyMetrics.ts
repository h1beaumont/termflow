import { db } from '../db';
import { leads, viewings, deposits, contracts, callLogs, properties, rooms, conversations, messages, approvals } from '@shared/schema';
import { eq, gte, lte, and, sql, inArray, or, isNull } from 'drizzle-orm';
import { startOfWeek, endOfWeek, subWeeks, format } from 'date-fns';

// ============================================================================
// SECURITY MODEL: Multi-Tenant Data Isolation
// ============================================================================
// 
// CRITICAL: This file calculates weekly metrics for landlords. ALL queries MUST 
// be properly scoped by landlord_id to prevent data leakage between tenants.
//
// Security Mechanisms:
// 1. landlordId parameter is REQUIRED for all metric calculations
// 2. propertyFilter is constructed using landlord-owned properties only (lines 133-150)
// 3. All queries join through leads → properties → landlord verification
// 4. callLogs queries filter directly by landlord_id (no join needed)
// 5. Optional propertyId is validated against landlord ownership before use
//
// Data Access Pattern:
// - Fetch all property IDs owned by landlordId
// - Create propertyFilter that ensures leads.propertyId is in landlord's properties
// - All subsequent queries use this propertyFilter to prevent cross-tenant access
//
// Audit Trail:
// - Lines 133-150: Property ownership verification and filter construction
// - Lines 153-261: All lead-based metrics use propertyFilter
// - Lines 267-290: Call logs filter directly by landlord_id
// - Lines 293-296: Occupancy calculations verify property ownership
// - Lines 299-438: All derived metrics use propertyFilter through joins
//
// ============================================================================

interface WeeklyMetrics {
  occupancyForecast: number;
  targetOccupancy: number;
  deltaVsLastWeek: number;
  depositsTaken: number;
  depositValue: number;
  contractsSigned: number;
  contractValue: number;
  newLeads: number;
  medianReplyTime: string;
  viewingsBooked: number;
  noShows: number;
  applicationsStarted: number;
  awaitingApprovals: number;
  paymentFailures: number;
  rtrFailed: number;
  topSource: string;
  topSourceConv: number;
  slowStage: string;
  slowStageTime: string;
  callScoreAvg: number;
  improvementVsLastWeek: number;
  thisWeekViewings: number;
}

// Helper function to calculate occupancy for a specific time period
async function calculateOccupancyForPeriod(
  landlordId: string,
  propertyId?: string,
  startDate?: Date,
  endDate?: Date
): Promise<number> {
  // Helper to get total rooms count
  const getTotalRooms = async (): Promise<number> => {
    if (propertyId) {
      const property = await db.query.properties.findFirst({
        where: and(
          eq(properties.id, propertyId),
          eq(properties.landlordId, landlordId)
        ),
        with: { rooms: true },
      });
      return property?.rooms.length || 0;
    } else {
      const allProperties = await db.query.properties.findMany({
        where: eq(properties.landlordId, landlordId),
        with: { rooms: true },
      });
      return allProperties.reduce((sum, p) => sum + p.rooms.length, 0);
    }
  };

  // Historical calculation using contracts
  if (startDate && endDate) {
    // Count active contracts during the specified period
    const activeContracts = await db.select({ 
      count: sql<number>`count(DISTINCT ${contracts.roomId})` 
    })
      .from(contracts)
      .innerJoin(rooms, eq(contracts.roomId, rooms.id))
      .innerJoin(properties, eq(rooms.propertyId, properties.id))
      .where(and(
        eq(properties.landlordId, landlordId),
        propertyId ? eq(properties.id, propertyId) : sql`true`,
        lte(contracts.startDate, endDate),  // Started before/during period
        or(
          gte(contracts.endDate, startDate), // Ended after/during period
          isNull(contracts.endDate)           // Or still active
        ),
        eq(contracts.status, 'active')
      ));
    
    const occupiedCount = Number(activeContracts[0]?.count || 0);
    const totalRooms = await getTotalRooms();
    return totalRooms > 0 ? Math.round((occupiedCount / totalRooms) * 100) : 0;
  }
  
  // Current snapshot - use room status
  if (propertyId) {
    // Single property occupancy - with ownership verification
    const property = await db.query.properties.findFirst({
      where: and(
        eq(properties.id, propertyId),
        eq(properties.landlordId, landlordId) // Verify landlord owns this property
      ),
      with: {
        rooms: true,
      },
    });
    
    if (property) {
      const totalRooms = property.rooms.length;
      const occupiedRooms = property.rooms.filter(r => r.status === 'occupied').length;
      return totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
    }
    return 0;
  } else {
    // Portfolio-wide occupancy - only landlord's properties
    const allProperties = await db.query.properties.findMany({
      where: eq(properties.landlordId, landlordId),
      with: {
        rooms: true,
      },
    });
    
    let totalRooms = 0;
    let occupiedRooms = 0;
    
    allProperties.forEach(property => {
      totalRooms += property.rooms.length;
      occupiedRooms += property.rooms.filter(r => r.status === 'occupied').length;
    });
    
    return totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
  }
}

export async function calculateWeeklyMetrics(
  landlordId: string,
  propertyId?: string
): Promise<WeeklyMetrics> {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
  const lastWeekStart = subWeeks(weekStart, 1);
  const lastWeekEnd = subWeeks(weekEnd, 1);
  
  // SECURITY FIX: Get all property IDs owned by this landlord
  const landlordProperties = await db.select({ id: properties.id })
    .from(properties)
    .where(eq(properties.landlordId, landlordId));
  
  const landlordPropertyIds = landlordProperties.map(p => p.id);
  
  // SECURITY FIX: Create secure property filter
  // If propertyId specified, verify landlord owns it AND filter by it
  // If no propertyId, filter by all landlord's properties
  const propertyFilter = propertyId 
    ? and(
        eq(leads.propertyId, propertyId),
        inArray(leads.propertyId, landlordPropertyIds) // Verify ownership
      )
    : (landlordPropertyIds.length > 0 
        ? inArray(leads.propertyId, landlordPropertyIds)
        : sql`false` // No properties = no data
      );
  
  // New Leads - with landlord scoping
  const newLeadsData = await db.select({ count: sql<number>`count(*)` })
    .from(leads)
    .where(and(
      gte(leads.createdAt, weekStart),
      lte(leads.createdAt, weekEnd),
      propertyFilter
    ));
  
  const newLeads = Number(newLeadsData[0]?.count || 0);
  
  // Deposits - with landlord scoping via leads
  const depositsData = await db.select({
    count: sql<number>`count(*)`,
    total: sql<number>`sum(amount)`,
  })
    .from(deposits)
    .innerJoin(leads, eq(deposits.leadId, leads.id))
    .where(and(
      gte(deposits.createdAt, weekStart),
      lte(deposits.createdAt, weekEnd),
      eq(deposits.status, 'paid'),
      propertyFilter
    ));
  
  const depositsTaken = Number(depositsData[0]?.count || 0);
  const depositValue = Number(depositsData[0]?.total || 0);
  
  // Contracts - with landlord scoping via leads
  const contractsData = await db.select({
    count: sql<number>`count(*)`,
    total: sql<number>`sum(CAST(total_rent_value AS NUMERIC))`,
  })
    .from(contracts)
    .innerJoin(leads, eq(contracts.leadId, leads.id))
    .where(and(
      gte(contracts.createdAt, weekStart),
      lte(contracts.createdAt, weekEnd),
      eq(contracts.status, 'fully_signed'),
      propertyFilter
    ));
  
  const contractsSigned = Number(contractsData[0]?.count || 0);
  const contractValue = Number(contractsData[0]?.total || 0);
  
  // Viewings - with landlord scoping via leads
  const viewingsData = await db.select({ count: sql<number>`count(*)` })
    .from(viewings)
    .innerJoin(leads, eq(viewings.leadId, leads.id))
    .where(and(
      gte(viewings.scheduledAt, weekStart),
      lte(viewings.scheduledAt, weekEnd),
      propertyFilter
    ));
  
  const viewingsBooked = Number(viewingsData[0]?.count || 0);
  
  // No Shows - with landlord scoping via leads
  const noShowsData = await db.select({ count: sql<number>`count(*)` })
    .from(viewings)
    .innerJoin(leads, eq(viewings.leadId, leads.id))
    .where(and(
      gte(viewings.scheduledAt, weekStart),
      lte(viewings.scheduledAt, weekEnd),
      eq(viewings.status, 'no_show'),
      propertyFilter
    ));
  
  const noShows = Number(noShowsData[0]?.count || 0);
  
  // Applications Started - with landlord scoping via leads
  const applicationsData = await db.select({ count: sql<number>`count(*)` })
    .from(contracts)
    .innerJoin(leads, eq(contracts.leadId, leads.id))
    .where(and(
      gte(contracts.createdAt, weekStart),
      lte(contracts.createdAt, weekEnd),
      propertyFilter
    ));
  
  const applicationsStarted = Number(applicationsData[0]?.count || 0);
  
  // SECURITY FIX: Approvals - with landlord scoping via leads and properties
  const approvalsData = await db.select({ count: sql<number>`count(*)` })
    .from(approvals)
    .innerJoin(leads, eq(approvals.leadId, leads.id))
    .where(and(
      eq(approvals.status, 'pending'),
      propertyFilter
    ));
  
  const awaitingApprovals = Number(approvalsData[0]?.count || 0);
  
  // Payment Failures - with landlord scoping via leads
  const paymentFailuresData = await db.select({ count: sql<number>`count(*)` })
    .from(deposits)
    .innerJoin(leads, eq(deposits.leadId, leads.id))
    .where(and(
      eq(deposits.status, 'failed'),
      propertyFilter
    ));
  
  const paymentFailures = Number(paymentFailuresData[0]?.count || 0);
  
  // RTR Failed - with landlord scoping
  const rtrFailedData = await db.select({ count: sql<number>`count(*)` })
    .from(leads)
    .where(and(
      eq(leads.rtrStatus, 'failed'),
      propertyFilter
    ));
  
  const rtrFailed = Number(rtrFailedData[0]?.count || 0);
  
  // Call Score - already properly scoped by landlordId
  const callScoreData = await db.select({
    avg: sql<number>`avg(ai_quality_score)`,
  })
    .from(callLogs)
    .where(and(
      gte(callLogs.callTime, weekStart),
      lte(callLogs.callTime, weekEnd),
      eq(callLogs.landlordId, landlordId)
    ));
  
  const callScoreAvg = Math.round(Number(callScoreData[0]?.avg || 0));
  
  const lastWeekCallScoreData = await db.select({
    avg: sql<number>`avg(ai_quality_score)`,
  })
    .from(callLogs)
    .where(and(
      gte(callLogs.callTime, lastWeekStart),
      lte(callLogs.callTime, lastWeekEnd),
      eq(callLogs.landlordId, landlordId)
    ));
  
  const lastWeekCallScore = Math.round(Number(lastWeekCallScoreData[0]?.avg || 0));
  const improvementVsLastWeek = callScoreAvg - lastWeekCallScore;
  
  // FIXED: Portfolio and single property occupancy calculation with historical comparison
  const occupancyForecast = await calculateOccupancyForPeriod(landlordId, propertyId); // Current occupancy
  const lastWeekOccupancy = await calculateOccupancyForPeriod(landlordId, propertyId, lastWeekStart, lastWeekEnd); // Historical
  const targetOccupancy = 90;
  const deltaVsLastWeek = occupancyForecast - lastWeekOccupancy;
  
  // REAL METRIC: Median Reply Time - with landlord scoping via leads
  let medianReplyTime = 'N/A';
  try {
    const replyTimesData = await db.select({
      leadId: conversations.leadId,
      firstReply: sql<Date>`MIN(${messages.createdAt})`,
      leadCreated: leads.createdAt,
    })
      .from(conversations)
      .innerJoin(messages, and(
        eq(messages.conversationId, conversations.id),
        eq(messages.role, 'assistant') // First assistant reply
      ))
      .innerJoin(leads, eq(conversations.leadId, leads.id))
      .where(and(
        gte(leads.createdAt, weekStart),
        lte(leads.createdAt, weekEnd),
        propertyFilter
      ))
      .groupBy(conversations.leadId, leads.createdAt);
    
    if (replyTimesData.length > 0) {
      const times = replyTimesData.map(rt => {
        const diff = new Date(rt.firstReply).getTime() - new Date(rt.leadCreated).getTime();
        return diff / 1000 / 60; // minutes
      });
      
      times.sort((a, b) => a - b);
      const median = times[Math.floor(times.length / 2)] || 0;
      
      const hours = Math.floor(median / 60);
      const minutes = Math.round(median % 60);
      medianReplyTime = `${hours}h ${minutes}m`;
    }
  } catch (error) {
    console.error('Error calculating median reply time:', error);
  }
  
  // REAL METRIC: Top Source and Conversion - with landlord scoping
  let topSource = 'Direct';
  let topSourceConv = 0;
  try {
    const sourceConversionsData = await db.select({
      source: leads.source,
      totalLeads: sql<number>`count(DISTINCT ${leads.id})`,
      viewings: sql<number>`count(DISTINCT ${viewings.id})`,
    })
      .from(leads)
      .leftJoin(viewings, eq(viewings.leadId, leads.id))
      .where(and(
        gte(leads.createdAt, weekStart),
        lte(leads.createdAt, weekEnd),
        propertyFilter
      ))
      .groupBy(leads.source);
    
    if (sourceConversionsData.length > 0) {
      const topSourceData = sourceConversionsData.reduce((max, curr) => 
        Number(curr.totalLeads) > Number(max?.totalLeads || 0) ? curr : max
      );
      
      topSource = topSourceData?.source || 'Direct';
      const totalLeads = Number(topSourceData?.totalLeads || 0);
      const totalViewings = Number(topSourceData?.viewings || 0);
      topSourceConv = totalLeads > 0 
        ? Math.round((totalViewings / totalLeads) * 100)
        : 0;
    }
  } catch (error) {
    console.error('Error calculating top source conversion:', error);
  }
  
  // REAL METRIC: Slowest Stage - with landlord scoping
  let slowStage = 'Lead → Viewing';
  let slowStageTime = 'N/A';
  try {
    const stageDurationsData = await db.select({
      leadId: leads.id,
      leadCreated: leads.createdAt,
      viewingScheduled: sql<Date>`MIN(${viewings.scheduledAt})`,
      contractCreated: sql<Date>`MIN(${contracts.createdAt})`,
      depositPaid: sql<Date>`MIN(${deposits.paidAt})`,
    })
      .from(leads)
      .leftJoin(viewings, eq(viewings.leadId, leads.id))
      .leftJoin(contracts, eq(contracts.leadId, leads.id))
      .leftJoin(deposits, eq(deposits.leadId, leads.id))
      .where(and(
        gte(leads.createdAt, weekStart),
        lte(leads.createdAt, weekEnd),
        propertyFilter
      ))
      .groupBy(leads.id, leads.createdAt);
    
    const stages: { [key: string]: number[] } = {
      'Lead → Viewing': [],
      'Viewing → Contract': [],
      'Contract → Deposit': [],
    };
    
    stageDurationsData.forEach(row => {
      if (row.viewingScheduled && row.leadCreated) {
        const diff = new Date(row.viewingScheduled).getTime() - new Date(row.leadCreated).getTime();
        stages['Lead → Viewing'].push(diff / 1000 / 60 / 60 / 24); // days
      }
      if (row.contractCreated && row.viewingScheduled) {
        const diff = new Date(row.contractCreated).getTime() - new Date(row.viewingScheduled).getTime();
        stages['Viewing → Contract'].push(diff / 1000 / 60 / 60 / 24);
      }
      if (row.depositPaid && row.contractCreated) {
        const diff = new Date(row.depositPaid).getTime() - new Date(row.contractCreated).getTime();
        stages['Contract → Deposit'].push(diff / 1000 / 60 / 60 / 24);
      }
    });
    
    let maxAvg = 0;
    Object.entries(stages).forEach(([stage, times]) => {
      if (times.length > 0) {
        const avg = times.reduce((a, b) => a + b, 0) / times.length;
        if (avg > maxAvg) {
          maxAvg = avg;
          slowStage = stage;
          slowStageTime = `${avg.toFixed(1)} days`;
        }
      }
    });
  } catch (error) {
    console.error('Error calculating slowest stage:', error);
  }
  
  // Upcoming viewings this week - with landlord scoping
  const upcomingViewingsData = await db.select({ count: sql<number>`count(*)` })
    .from(viewings)
    .innerJoin(leads, eq(viewings.leadId, leads.id))
    .where(and(
      gte(viewings.scheduledAt, new Date()),
      lte(viewings.scheduledAt, weekEnd),
      propertyFilter
    ));
  
  const thisWeekViewings = Number(upcomingViewingsData[0]?.count || 0);
  
  return {
    occupancyForecast,
    targetOccupancy,
    deltaVsLastWeek,
    depositsTaken,
    depositValue,
    contractsSigned,
    contractValue,
    newLeads,
    medianReplyTime,
    viewingsBooked,
    noShows,
    applicationsStarted,
    awaitingApprovals,
    paymentFailures,
    rtrFailed,
    topSource,
    topSourceConv,
    slowStage,
    slowStageTime,
    callScoreAvg,
    improvementVsLastWeek,
    thisWeekViewings,
  };
}
