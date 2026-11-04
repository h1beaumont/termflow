import puppeteer from 'puppeteer';

export interface ScrapedWebsiteData {
  url: string;
  title: string;
  description: string;
  metaKeywords: string;
  headings: string[];
  mainContent: string;
  images: string[];
  links: string[];
  socialLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  contactInfo: {
    emails: string[];
    phones: string[];
  };
  pricingInfo: {
    prices: string[];
    roomTypes: string[];
    amenities: string[];
  };
  scrapedAt: string;
  success: boolean;
  error?: string;
}

export async function scrapeWebsite(url: string): Promise<ScrapedWebsiteData> {
  console.log(`[WebScraper] Starting scrape for: ${url}`);
  
  let browser;
  try {
    // Normalize URL
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    
    // Set timeout and navigate
    await page.goto(url, { 
      waitUntil: 'networkidle2', 
      timeout: 30000 
    });

    // Extract comprehensive data
    const scrapedData = await page.evaluate(() => {
      // Helper function to extract text content
      const getText = (selector: string): string => {
        const el = document.querySelector(selector);
        return el?.textContent?.trim() || '';
      };

      // Helper to extract all matching elements
      const getTexts = (selector: string): string[] => {
        return Array.from(document.querySelectorAll(selector))
          .map(el => el.textContent?.trim())
          .filter((text): text is string => Boolean(text));
      };

      // Extract meta information
      const title = document.title || '';
      const description = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
      const metaKeywords = document.querySelector('meta[name="keywords"]')?.getAttribute('content') || '';

      // Extract headings
      const headings = [
        ...getTexts('h1'),
        ...getTexts('h2'),
        ...getTexts('h3'),
      ];

      // Extract main content (paragraphs, main sections)
      const paragraphs = getTexts('p');
      const mainSections = getTexts('main, article, section');
      const mainContent = [...paragraphs, ...mainSections]
        .slice(0, 50) // Limit to prevent too much data
        .join(' ')
        .substring(0, 5000); // Max 5000 chars

      // Extract images
      const images = Array.from(document.querySelectorAll('img'))
        .map(img => img.src)
        .filter(src => src && !src.startsWith('data:'))
        .slice(0, 20); // Limit to 20 images

      // Extract links
      const links = Array.from(document.querySelectorAll('a'))
        .map(a => a.href)
        .filter(href => href && href.startsWith('http'))
        .slice(0, 30); // Limit to 30 links

      // Extract social media links
      const socialLinks: any = {};
      links.forEach(link => {
        if (link.includes('facebook.com')) socialLinks.facebook = link;
        if (link.includes('twitter.com') || link.includes('x.com')) socialLinks.twitter = link;
        if (link.includes('instagram.com')) socialLinks.instagram = link;
        if (link.includes('linkedin.com')) socialLinks.linkedin = link;
      });

      // Extract contact information
      const bodyText = document.body.innerText;
      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
      const phoneRegex = /(?:\+44|0)[0-9\s()-]{9,15}/g;
      
      const emails = Array.from(new Set(bodyText.match(emailRegex) || [])).slice(0, 5);
      const phones = Array.from(new Set(bodyText.match(phoneRegex) || []))
        .map(p => p.trim())
        .filter(p => p.length > 8)
        .slice(0, 5);

      // Extract pricing information
      // Comprehensive UK lettings price patterns
      // Supports: £XXX pw/pcw/ppw/pppw, £XXX pm/pcm/ppm/pppm, £XXX per week/month/calendar week/month, etc.
      const priceRegex = /£\s*\d+(?:,\d{3})*(?:\.\d{2})?(?:\s*(?:\/(?:week|month|wk|w|m)|(?:\bpw\b|\bp\.w\b|\bpcw\b|\bp\.c\.w\b|\bppw\b|\bp\.p\.w\b|\bpppw\b|\bp\.p\.p\.w\b|\bpm\b|\bp\.m\b|\bpcm\b|\bp\.c\.m\b|\bppm\b|\bp\.p\.m\b|\bpppm\b|\bp\.p\.p\.m\b|\bweekly\b|\bmonthly\b|\bper\s+week\b|\bper\s+month\b|\bper\s+calendar\s+week\b|\bper\s+calendar\s+month\b|\bper\s+person\s+per\s+week\b|\bper\s+person\s+per\s+month\b)))?/gi;
      const prices = Array.from(new Set(bodyText.match(priceRegex) || []))
        .slice(0, 20);

      // Extract room types - common student accommodation terms
      const roomTypeKeywords = ['studio', 'ensuite', 'en-suite', 'shared', 'twin', 'cluster', 'apartment', 'flat', 'room', 'bedroom'];
      const roomTypesSet = new Set<string>(); // Use Set with lowercase for deduplication
      
      roomTypeKeywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}[\\w\\s-]*(?:room|flat|apartment|studio)?\\b`, 'gi');
        const matches = bodyText.match(regex) || [];
        matches.forEach(match => {
          const normalized = match.toLowerCase().trim();
          if (normalized.length < 50 && normalized.length > 2) {
            roomTypesSet.add(normalized);
          }
        });
      });
      
      // Convert to array and capitalize for better presentation
      const roomTypes = Array.from(roomTypesSet).map(type => 
        type.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
      );

      // Extract amenities - common student accommodation features
      const amenityKeywords = [
        'wifi', 'internet', 'gym', 'cinema', 'laundry', 'bike storage', 'parking',
        'common room', 'study room', 'bills included', 'utilities included',
        'all inclusive', '24/7 security', 'concierge', 'contents insurance'
      ];
      const amenities: string[] = [];
      
      amenityKeywords.forEach(keyword => {
        if (bodyText.toLowerCase().includes(keyword.toLowerCase())) {
          amenities.push(keyword);
        }
      });

      return {
        title,
        description,
        metaKeywords,
        headings,
        mainContent,
        images,
        links,
        socialLinks,
        contactInfo: { emails, phones },
        pricingInfo: {
          prices: prices.slice(0, 15),
          roomTypes: roomTypes.slice(0, 10),
          amenities: amenities.slice(0, 15),
        },
      };
    });

    await browser.close();

    console.log(`[WebScraper] Successfully scraped: ${url}`);
    console.log(`[WebScraper] Extracted: ${scrapedData.headings.length} headings, ${scrapedData.images.length} images`);

    return {
      url,
      ...scrapedData,
      scrapedAt: new Date().toISOString(),
      success: true,
    };

  } catch (error: any) {
    console.error(`[WebScraper] Error scraping ${url}:`, error.message);
    
    if (browser) {
      await browser.close();
    }

    return {
      url,
      title: '',
      description: '',
      metaKeywords: '',
      headings: [],
      mainContent: '',
      images: [],
      links: [],
      socialLinks: {},
      contactInfo: { emails: [], phones: [] },
      pricingInfo: { prices: [], roomTypes: [], amenities: [] },
      scrapedAt: new Date().toISOString(),
      success: false,
      error: error.message,
    };
  }
}

export async function scrapeMultipleWebsites(
  urls: string[],
  onProgress?: (current: number, total: number, url: string) => void
): Promise<ScrapedWebsiteData[]> {
  console.log(`[WebScraper] Scraping ${urls.length} websites...`);
  
  const results: ScrapedWebsiteData[] = [];
  
  // Scrape sequentially to avoid overwhelming resources
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    
    // Report progress
    if (onProgress) {
      onProgress(i + 1, urls.length, url);
    }
    
    const result = await scrapeWebsite(url);
    results.push(result);
    
    // Small delay between scrapes
    if (i < urls.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  const successCount = results.filter(r => r.success).length;
  console.log(`[WebScraper] Completed: ${successCount}/${urls.length} successful`);
  
  return results;
}

export function estimateScrapingTime(urlCount: number): { seconds: number; display: string } {
  // Average 30-45 seconds per URL (30s timeout + processing + 1s delay)
  const avgSecondsPerUrl = 35;
  const totalSeconds = urlCount * avgSecondsPerUrl;
  
  if (totalSeconds < 60) {
    return { seconds: totalSeconds, display: `${totalSeconds}-${totalSeconds + 15} seconds` };
  } else {
    const minutes = Math.ceil(totalSeconds / 60);
    return { seconds: totalSeconds, display: `${minutes}-${minutes + 1} minutes` };
  }
}

// Generate AI-friendly summary from scraped data
export function generateWebsiteSummary(scrapedData: ScrapedWebsiteData[]): string {
  if (scrapedData.length === 0) return '';
  
  const summaries = scrapedData
    .filter(data => data.success)
    .map(data => {
      const parts = [
        `Website: ${data.url}`,
        data.title ? `Title: ${data.title}` : '',
        data.description ? `Description: ${data.description}` : '',
        data.headings.length > 0 ? `Key Topics: ${data.headings.slice(0, 5).join(', ')}` : '',
        
        // PRICING INFORMATION - Prioritized for AI
        data.pricingInfo.prices.length > 0 ? `\n🔑 PRICING FOUND: ${data.pricingInfo.prices.join(', ')}` : '',
        data.pricingInfo.roomTypes.length > 0 ? `🔑 ROOM TYPES FOUND: ${data.pricingInfo.roomTypes.slice(0, 8).join(', ')}` : '',
        data.pricingInfo.amenities.length > 0 ? `🔑 AMENITIES FOUND: ${data.pricingInfo.amenities.join(', ')}` : '',
        
        data.contactInfo.emails.length > 0 ? `\nContact Emails: ${data.contactInfo.emails.join(', ')}` : '',
        data.contactInfo.phones.length > 0 ? `Contact Phones: ${data.contactInfo.phones.join(', ')}` : '',
        data.mainContent ? `\nContent Preview: ${data.mainContent.substring(0, 500)}...` : '',
      ];
      
      return parts.filter(Boolean).join('\n');
    });
  
  return summaries.join('\n\n---\n\n');
}
