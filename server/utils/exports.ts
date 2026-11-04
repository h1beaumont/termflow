import { format } from 'date-fns';
import crypto from 'crypto';

interface LeadExportData {
  name: string;
  email: string;
  phone: string;
  propertyName: string;
  roomType: string;
  status: string;
  source: string;
  createdAt: Date;
}

export function generateLeadsCSV(leads: LeadExportData[]): string {
  const headers = ['Name', 'Email', 'Phone', 'Property', 'Room Type', 'Status', 'Source', 'Date'];
  const rows = leads.map(lead => [
    lead.name,
    lead.email,
    lead.phone || '',
    lead.propertyName,
    lead.roomType || '',
    lead.status,
    lead.source || 'Direct',
    format(new Date(lead.createdAt), 'yyyy-MM-dd HH:mm'),
  ]);
  
  return [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');
}

interface ViewingEvent {
  title: string;
  startTime: Date;
  endTime: Date;
  location: string;
  description: string;
}

export function generateICS(viewings: ViewingEvent[]): string {
  const events = viewings.map(v => {
    const formatDate = (date: Date) => {
      return format(date, "yyyyMMdd'T'HHmmss'Z'");
    };
    
    return [
      'BEGIN:VEVENT',
      `DTSTART:${formatDate(v.startTime)}`,
      `DTEND:${formatDate(v.endTime)}`,
      `SUMMARY:${v.title}`,
      `LOCATION:${v.location}`,
      `DESCRIPTION:${v.description}`,
      `UID:${crypto.randomUUID()}@termflow.com`,
      'END:VEVENT',
    ].join('\r\n');
  }).join('\r\n');
  
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//TermFlow//Weekly Summary//EN',
    'CALSCALE:GREGORIAN',
    events,
    'END:VCALENDAR',
  ].join('\r\n');
}
