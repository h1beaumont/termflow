import { google } from 'googleapis';

let connectionSettings: any;

async function getAccessToken() {
  // Check for cached, non-expired token
  if (connectionSettings?.settings?.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  try {
    connectionSettings = await fetch(
      'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=google-calendar',
      {
        headers: {
          'Accept': 'application/json',
          'X_REPLIT_TOKEN': xReplitToken
        }
      }
    ).then(res => res.json()).then(data => data.items?.[0]);

    const accessToken = connectionSettings?.settings?.access_token || connectionSettings?.settings?.oauth?.credentials?.access_token;

    if (!connectionSettings || !accessToken) {
      throw new Error('Google Calendar not connected. Please connect your calendar in Replit integrations.');
    }
    return accessToken;
  } catch (error) {
    console.error('Failed to get Google Calendar access token:', error);
    throw new Error('Google Calendar not connected. Please connect your calendar in Replit integrations.');
  }
}

// WARNING: Never cache this client.
// Access tokens expire, so a new client must be created each time.
// Always call this function again to get a fresh client.
export async function getUncachableGoogleCalendarClient() {
  const accessToken = await getAccessToken();

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: accessToken
  });

  return google.calendar({ version: 'v3', auth: oauth2Client });
}

// Get available time slots for next 7 days (9am-5pm, Mon-Fri)
export async function getAvailableSlots(daysAhead: number = 7): Promise<Date[]> {
  const calendar = await getUncachableGoogleCalendarClient();
  
  const now = new Date();
  const startDate = new Date(now);
  startDate.setHours(0, 0, 0, 0);
  
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + daysAhead);
  
  // Get busy times from calendar
  const response = await calendar.freebusy.query({
    requestBody: {
      timeMin: startDate.toISOString(),
      timeMax: endDate.toISOString(),
      items: [{ id: 'primary' }],
    },
  });
  
  const busySlots = response.data.calendars?.primary?.busy || [];
  
  // Generate all possible 15-minute slots (9am-5pm, Mon-Fri)
  const allSlots: Date[] = [];
  const currentSlot = new Date(startDate);
  
  while (currentSlot < endDate) {
    const dayOfWeek = currentSlot.getDay();
    const hour = currentSlot.getHours();
    
    // Only weekdays (Mon-Fri), 9am-5pm
    if (dayOfWeek >= 1 && dayOfWeek <= 5 && hour >= 9 && hour < 17) {
      // Check if slot is not in the past
      if (currentSlot > now) {
        // Check if slot is not busy
        const isBusy = busySlots.some(busy => {
          const busyStart = new Date(busy.start!);
          const busyEnd = new Date(busy.end!);
          return currentSlot >= busyStart && currentSlot < busyEnd;
        });
        
        if (!isBusy) {
          allSlots.push(new Date(currentSlot));
        }
      }
    }
    
    // Move to next 15-minute slot
    currentSlot.setMinutes(currentSlot.getMinutes() + 15);
  }
  
  // Return up to 20 slots
  return allSlots.slice(0, 20);
}

// Create a demo booking event
export async function createDemoBooking(
  name: string,
  email: string,
  phone: string,
  company: string,
  propertyCount: string,
  startTime: Date
): Promise<string> {
  const calendar = await getUncachableGoogleCalendarClient();
  
  const endTime = new Date(startTime);
  endTime.setMinutes(endTime.getMinutes() + 15);
  
  const event = {
    summary: `Demo Call - ${name} (${company})`,
    description: `
Demo Call with ${name}
Company: ${company}
Email: ${email}
Phone: ${phone}
Property Count: ${propertyCount}

This is a 15-minute demo call to discuss TermFlow's AI-powered lettings automation.
    `.trim(),
    start: {
      dateTime: startTime.toISOString(),
      timeZone: 'Europe/London',
    },
    end: {
      dateTime: endTime.toISOString(),
      timeZone: 'Europe/London',
    },
    attendees: [
      { email: email },
    ],
    conferenceData: {
      createRequest: {
        requestId: `demo-${Date.now()}`,
        conferenceSolutionKey: { type: 'hangoutsMeet' },
      },
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 }, // 1 day before
        { method: 'email', minutes: 60 },      // 1 hour before
      ],
    },
  };
  
  const response = await calendar.events.insert({
    calendarId: 'primary',
    conferenceDataVersion: 1,
    requestBody: event,
    sendUpdates: 'all', // Send invite to attendees
  });
  
  return response.data.htmlLink || '';
}
