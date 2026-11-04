// Custom authentication service - Google OAuth + Email/Password
// Zero Replit branding - fully branded TermFlow auth experience

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { Express, RequestHandler } from "express";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";
import rateLimit from "express-rate-limit";

const BCRYPT_ROUNDS = 12;
const EMAIL_VERIFICATION_EXPIRY_HOURS = 24;
const PASSWORD_RESET_EXPIRY_HOURS = 1;

// Rate limiters for auth endpoints
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: "Too many login attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

export const signupRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 signups per hour per IP
  message: "Too many accounts created, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

export const passwordResetRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 password reset requests per hour
  message: "Too many password reset requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Session configuration
export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  
  const isProduction = process.env.NODE_ENV === 'production';
  
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: sessionTtl,
    },
  });
}

// Password hashing utilities
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Token generation for email verification and password reset
export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function generateTokenExpiry(hours: number): Date {
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + hours);
  return expiry;
}

// Setup Google OAuth strategy
function setupGoogleStrategy() {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.warn("⚠️  Google OAuth not configured - missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET");
    return;
  }

  const callbackURL = process.env.GOOGLE_CALLBACK_URL || 
    `${process.env.NODE_ENV === 'production' ? 'https' : 'http'}://${process.env.REPLIT_DOMAINS?.split(',')[0] || 'localhost:5000'}/api/auth/google/callback`;

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL,
        scope: ['profile', 'email'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(new Error('No email provided by Google'));
          }

          // Check if user exists
          let user = await storage.getUserByEmail(email);

          if (user) {
            // Update OAuth provider info
            user = await storage.updateUser(user.id, {
              oauthProvider: 'google',
              oauthProviderId: profile.id,
              profileImageUrl: profile.photos?.[0]?.value || user.profileImageUrl,
              lastLoginAt: new Date(),
            });
          } else {
            // Create new user from Google profile
            user = await storage.createUser({
              email,
              firstName: profile.name?.givenName || '',
              lastName: profile.name?.familyName || '',
              profileImageUrl: profile.photos?.[0]?.value,
              emailVerified: true, // Google emails are verified
              oauthProvider: 'google',
              oauthProviderId: profile.id,
              lastLoginAt: new Date(),
            });
          }

          return done(null, user);
        } catch (error) {
          return done(error as Error);
        }
      }
    )
  );
}

// Setup Local (email/password) strategy
function setupLocalStrategy() {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      async (email, password, done) => {
        try {
          const user = await storage.getUserByEmail(email.toLowerCase());

          if (!user) {
            return done(null, false, { message: 'Invalid email or password' });
          }

          if (!user.passwordHash) {
            return done(null, false, { 
              message: 'Please sign in with Google or reset your password' 
            });
          }

          const isValidPassword = await comparePassword(password, user.passwordHash);
          if (!isValidPassword) {
            return done(null, false, { message: 'Invalid email or password' });
          }

          if (!user.emailVerified) {
            return done(null, false, { 
              message: 'Please verify your email before signing in' 
            });
          }

          // Update last login
          await storage.updateUser(user.id, { lastLoginAt: new Date() });

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
}

// Passport serialization
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await storage.getUser(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Initialize authentication
export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  setupGoogleStrategy();
  setupLocalStrategy();

  console.log("✅ Custom authentication initialized (Google OAuth + Email/Password)");
}

// Auth middleware - protect routes
export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};

// Optional auth middleware - user info if authenticated, but doesn't block
export const optionalAuth: RequestHandler = (req, res, next) => {
  next();
};
