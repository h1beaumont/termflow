import { google } from 'googleapis';

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
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

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=google-calendar',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('Google Calendar not connected');
  }
  return accessToken;
}

// WARNING: Never cache this client.
// Access tokens expire, so a new client must be created each time.
// Always call this function again to get a fresh client.
async function getUncachableGoogleCalendarClient() {
  const accessToken = await getAccessToken();

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: accessToken
  });

  return google.calendar({ version: 'v3', auth: oauth2Client });
}

export class GoogleCalendarService {
  // Create a viewing event in Google Calendar
  async createViewingEvent(viewing: {
    scheduledAt: Date;
    duration: number;
    viewingType: string;
    lead: { firstName: string; lastName: string; email: string | null; phone: string };
    property: { name: string; address: string };
  }) {
    try {
      const calendar = await getUncachableGoogleCalendarClient();
      
      const startTime = new Date(viewing.scheduledAt);
      const endTime = new Date(startTime.getTime() + viewing.duration * 60000);
      
      const attendees = viewing.lead.email 
        ? [{ email: viewing.lead.email }] 
        : [];
      
      const event = {
        summary: `Viewing: ${viewing.property.name}`,
        description: `Property viewing for ${viewing.lead.firstName} ${viewing.lead.lastName}\nPhone: ${viewing.lead.phone}\nType: ${viewing.viewingType}`,
        location: viewing.property.address,
        start: {
          dateTime: startTime.toISOString(),
          timeZone: 'Europe/London',
        },
        end: {
          dateTime: endTime.toISOString(),
          timeZone: 'Europe/London',
        },
        attendees,
        conferenceData: viewing.viewingType === 'video_call' ? {
          createRequest: {
            requestId: `viewing-${Date.now()}`,
            conferenceSolutionKey: { type: 'hangoutsMeet' }
          }
        } : undefined,
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 }, // 24 hours before
            { method: 'popup', minutes: 60 }, // 1 hour before
          ],
        },
      };

      const response = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: event,
        conferenceDataVersion: viewing.viewingType === 'video_call' ? 1 : undefined,
      });

      const googleMeetLink = response.data.conferenceData?.entryPoints?.[0]?.uri;

      return {
        eventId: response.data.id!,
        meetLink: googleMeetLink || null,
        htmlLink: response.data.htmlLink || null,
      };
    } catch (error: any) {
      console.error('Error creating calendar event:', error);
      throw new Error(`Failed to create calendar event: ${error.message}`);
    }
  }

  // Update a viewing event
  async updateViewingEvent(eventId: string, updates: {
    scheduledAt?: Date;
    duration?: number;
    status?: string;
  }) {
    try {
      const calendar = await getUncachableGoogleCalendarClient();
      
      if (updates.status === 'cancelled') {
        // Delete the event if cancelled
        await calendar.events.delete({
          calendarId: 'primary',
          eventId: eventId,
        });
        return { deleted: true };
      }

      // Update the event
      const event = await calendar.events.get({
        calendarId: 'primary',
        eventId: eventId,
      });

      const updatePayload: any = {};

      if (updates.scheduledAt && updates.duration) {
        const startTime = new Date(updates.scheduledAt);
        const endTime = new Date(startTime.getTime() + updates.duration * 60000);
        
        updatePayload.start = {
          dateTime: startTime.toISOString(),
          timeZone: 'Europe/London',
        };
        updatePayload.end = {
          dateTime: endTime.toISOString(),
          timeZone: 'Europe/London',
        };
      }

      const response = await calendar.events.patch({
        calendarId: 'primary',
        eventId: eventId,
        requestBody: updatePayload,
      });

      return {
        eventId: response.data.id!,
        htmlLink: response.data.htmlLink || null,
      };
    } catch (error: any) {
      console.error('Error updating calendar event:', error);
      throw new Error(`Failed to update calendar event: ${error.message}`);
    }
  }

  // Delete a viewing event
  async deleteViewingEvent(eventId: string) {
    try {
      const calendar = await getUncachableGoogleCalendarClient();
      
      await calendar.events.delete({
        calendarId: 'primary',
        eventId: eventId,
      });

      return { deleted: true };
    } catch (error: any) {
      console.error('Error deleting calendar event:', error);
      throw new Error(`Failed to delete calendar event: ${error.message}`);
    }
  }
}
