/**
 * Author Data Registry for TermFlow Blog
 * Defines author profiles for the TermFlow content team
 */

import alexHeadshot from "@assets/stock_images/professional_headsho_d1600ab4.jpg";
import sarahHeadshot from "@assets/stock_images/friendly_young_woman_6ba1b3c2.jpg";
import jamesHeadshot from "@assets/stock_images/professional_busines_96686da7.jpg";
import rachelHeadshot from "@assets/stock_images/professional_busines_3eac0e8f.jpg";

export interface Author {
  slug: string;
  name: string;
  title: string;
  bio: string;
  credentials: string[];
  headshot: string;
  linkedinUrl: string;
  email?: string;
}

export const authors: Record<string, Author> = {
  "alex-thompson": {
    slug: "alex-thompson",
    name: "Harry Beaumont",
    title: "Head of Product",
    bio: "Alex leads TermFlow's product strategy, bringing over 12 years of experience in PropTech and PBSA operations. Previously VP of Operations at a top-10 UK student accommodation provider, Alex has firsthand experience with the operational challenges that TermFlow solves. He's passionate about leveraging AI to eliminate administrative burden and help lettings teams focus on what matters: creating exceptional student experiences.",
    credentials: [
      "12+ years in PropTech & PBSA operations",
      "Former VP Operations at major UK PBSA provider",
      "Led digital transformation for 5,000+ bed portfolios",
      "MSc Real Estate, University of Cambridge"
    ],
    headshot: alexHeadshot,
    linkedinUrl: "https://linkedin.com/in/alex-thompson-termflow"
  },
  "sarah-chen": {
    slug: "sarah-chen",
    name: "Sarah Chen",
    title: "PBSA Operations Lead",
    bio: "Sarah specializes in operational excellence for purpose-built student accommodation. With a background in both hospitality management and property operations, she understands the unique challenges of managing high-volume student lettings. Sarah works closely with TermFlow clients to optimize their workflows, reduce admin time, and improve student satisfaction scores. Her insights have helped operators reduce viewings-to-contract conversion time by an average of 40%.",
    credentials: [
      "8+ years in PBSA operations and process optimization",
      "Certified Property Manager (CPM)",
      "Specialist in high-volume student lettings workflows",
      "BA Business Management, University of Manchester"
    ],
    headshot: sarahHeadshot,
    linkedinUrl: "https://linkedin.com/in/sarah-chen-pbsa"
  },
  "james-mckenzie": {
    slug: "james-mckenzie",
    name: "James McKenzie",
    title: "PropTech Analyst",
    bio: "James analyzes emerging trends in property technology and student accommodation markets. His research focuses on automation ROI, AI adoption in lettings, and operational benchmarking for PBSA operators. Before joining TermFlow, James spent 6 years as a consultant advising REITs and institutional investors on PropTech strategy. He regularly publishes market analysis on student housing demand, occupancy trends, and the impact of automation on operational efficiency.",
    credentials: [
      "6+ years PropTech strategy consulting",
      "Former advisor to PBSA REITs and institutional investors",
      "Published researcher on AI in property management",
      "MSc Real Estate Economics, LSE"
    ],
    headshot: jamesHeadshot,
    linkedinUrl: "https://linkedin.com/in/james-mckenzie-proptech"
  },
  "rachel-foster": {
    slug: "rachel-foster",
    name: "Rachel Foster",
    title: "Customer Success Manager",
    bio: "Rachel ensures TermFlow clients achieve maximum value from their automation investments. With experience managing operations for boutique student houses and large PBSA portfolios, she brings practical insights into implementation best practices. Rachel specializes in helping teams transition from manual workflows to AI-powered automation, with a focus on change management and user adoption. Her case studies demonstrate average time savings of 20+ hours per week for lettings teams.",
    credentials: [
      "5+ years in PBSA customer success and operations",
      "Expert in automation implementation and change management",
      "Former Operations Manager at boutique student accommodation provider",
      "BA Hospitality and Events Management, Oxford Brookes University"
    ],
    headshot: rachelHeadshot,
    linkedinUrl: "https://linkedin.com/in/rachel-foster-termflow"
  }
};

/**
 * Get author by slug
 */
export function getAuthorBySlug(slug: string): Author | undefined {
  return authors[slug];
}

/**
 * Get author by name (case-insensitive match)
 */
export function getAuthorByName(name: string): Author | undefined {
  const normalizedName = name.toLowerCase().trim();
  return Object.values(authors).find(
    author => author.name.toLowerCase() === normalizedName
  );
}

/**
 * Get all authors
 */
export function getAllAuthors(): Author[] {
  return Object.values(authors);
}

/**
 * Get author slug from name (for backward compatibility with blog posts)
 */
export function getAuthorSlugFromName(name: string): string | undefined {
  const author = getAuthorByName(name);
  return author?.slug;
}
