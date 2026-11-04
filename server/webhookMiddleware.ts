import type { Request, Response, NextFunction } from 'express';
import type { IStorage } from './storage';
import { db } from './db';
import { webhookEvents } from '@shared/schema';
import { eq, sql } from 'drizzle-orm';
import { safeLog, safeError } from './piiSanitizer';

interface WebhookConfig {
  provider: string;
  getEventId: (req: Request) => string | undefined;
  getEventType: (req: Request) => string;
  verifySignature?: (req: Request) => boolean | Promise<boolean>; // Support both sync and async
}

declare global {
  namespace Express {
    interface Request {
      webhookEvent?: any;
      stripeEvent?: any;
    }
  }
}

export function createIdempotentWebhookHandler(config: WebhookConfig, storage: IStorage) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 1. Verify signature if configured (AWAIT if Promise)
      if (config.verifySignature) {
        const isValid = await config.verifySignature(req);
        if (!isValid) {
          safeError(`${config.provider} Invalid webhook signature`, new Error('Invalid signature'));
          return res.status(401).json({ error: 'Invalid signature' });
        }
      }
      
      // 2. Extract event ID and type
      const eventId = config.getEventId(req);
      const eventType = config.getEventType(req);
      
      if (!eventId) {
        safeError(`${config.provider} Missing event ID in webhook`, new Error('Missing event ID'));
        return res.status(400).json({ error: 'Missing event ID' });
      }
      
      // 3. Record webhook event (idempotent)
      const { event, isNew } = await storage.recordWebhookEvent({
        provider: config.provider,
        eventId,
        eventType,
        rawPayload: req.body,
        headers: req.headers as any,
      });
      
      // 4. If duplicate, return 200 immediately (already processed)
      if (!isNew) {
        safeLog(`${config.provider} Duplicate webhook skipped`, { eventId });
        return res.status(200).json({ 
          received: true, 
          duplicate: true,
          message: 'Event already processed' 
        });
      }
      
      // 5. Attach event to request for handler to use
      req.webhookEvent = event;
      
      // 6. Mark as processing
      await db
        .update(webhookEvents)
        .set({ 
          status: 'processing',
          updatedAt: new Date()
        })
        .where(eq(webhookEvents.id, event.id));
      
      // 7. Continue to actual webhook handler
      next();
      
    } catch (error: any) {
      safeError(`${config.provider} Webhook middleware error`, error);
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  };
}

export async function markWebhookComplete(storage: IStorage, eventId: number) {
  await db
    .update(webhookEvents)
    .set({ 
      status: 'completed',
      processedAt: new Date(),
      updatedAt: new Date()
    })
    .where(eq(webhookEvents.id, eventId));
}

export async function markWebhookFailed(storage: IStorage, eventId: number, error: string) {
  await db
    .update(webhookEvents)
    .set({ 
      status: 'failed',
      errorMessage: error,
      retryCount: sql`${webhookEvents.retryCount} + 1`,
      updatedAt: new Date()
    })
    .where(eq(webhookEvents.id, eventId));
}
