import crypto from 'crypto';

interface SignedLinkData {
  action: string;
  entityId: string;
  expiresAt: Date;
  metadata?: Record<string, any>;
}

const SECRET_KEY = process.env.SIGNED_LINK_SECRET || 'change-this-in-production';

export function generateSignedLink(baseUrl: string, data: SignedLinkData): string {
  const payload = JSON.stringify({
    action: data.action,
    entityId: data.entityId,
    expiresAt: data.expiresAt.toISOString(),
    metadata: data.metadata || {},
  });
  
  const token = Buffer.from(payload).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(token)
    .digest('base64url');
  
  return `${baseUrl}?token=${token}&sig=${signature}`;
}

export function verifySignedLink(token: string, signature: string): SignedLinkData | null {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', SECRET_KEY)
      .update(token)
      .digest('base64url');
    
    if (signature !== expectedSignature) {
      return null;
    }
    
    const payload = JSON.parse(Buffer.from(token, 'base64url').toString());
    
    if (new Date() > new Date(payload.expiresAt)) {
      return null;
    }
    
    return payload as SignedLinkData;
  } catch (error) {
    return null;
  }
}
