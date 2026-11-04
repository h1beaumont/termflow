import { Request, Response, NextFunction } from 'express';
import { IStorage } from './storage';

export function requireFeatureFlag(featureKey: string, storage: IStorage) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // CRITICAL FIX: Get database user, not Replit auth user
      const authUser = req.user as any;
      if (!authUser?.claims?.email) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
      
      // Get the actual database user by email
      const dbUser = await storage.getUserByEmail(authUser.claims.email);
      if (!dbUser) {
        return res.status(401).json({ error: 'User not found in database' });
      }
      
      // Now use the database user ID for feature flag lookup
      const landlordId = dbUser.id;
      const enabled = await storage.getFeatureFlag(landlordId, featureKey);
      
      if (!enabled) {
        return res.status(403).json({
          error: 'Feature not enabled',
          featureKey,
          message: `This feature requires ${featureKey} to be enabled in Feature Flags settings`
        });
      }
      
      // Feature is enabled, allow access
      next();
    } catch (error) {
      console.error('Error checking feature flag:', error);
      res.status(500).json({ error: 'Failed to check feature access' });
    }
  };
}
