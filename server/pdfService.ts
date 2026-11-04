/**
 * PDF GENERATION SERVICE
 * 
 * Generates PDF invoices using Puppeteer (headless Chrome)
 * Converts HTML email templates to professional PDF documents
 */

import puppeteer from 'puppeteer';
import { generateMonthlyInvoiceEmail } from './emailTemplates';

interface InvoiceData {
  landlordName: string;
  invoiceNumber: string;
  invoiceDate: string;
  billingPeriod: string;
  dueDate: string;
  subscriptionPlan: string;
  subscriptionFee: number;
  passThroughCosts: Array<{
    service: string;
    description: string;
    quantity: number;
    unitCost: number;
    totalCost: number;
  }>;
  subtotalPassThrough: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: 'paid' | 'pending' | 'overdue';
}

/**
 * Generate PDF invoice from invoice data
 */
export async function generateInvoicePDF(data: InvoiceData): Promise<Buffer> {
  let browser;
  
  try {
    // Generate HTML from template (without download link to avoid recursion)
    const html = generateMonthlyInvoiceEmail({
      ...data,
      downloadPdfLink: undefined, // Remove PDF link to avoid circular reference
    });

    // Create full HTML document with proper styling
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif;
              padding: 40px;
              background: #f9fafb;
            }
            .invoice-container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
              padding: 40px;
              border-radius: 8px;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            td, th {
              padding: 12px;
              text-align: left;
            }
            @media print {
              body {
                background: white;
                padding: 0;
              }
              .invoice-container {
                box-shadow: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            ${html}
          </div>
        </body>
      </html>
    `;

    // Launch Puppeteer
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
    
    // Set content
    await page.setContent(fullHtml, { 
      waitUntil: 'networkidle0' 
    });

    // Generate PDF
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px',
      },
    });

    return Buffer.from(pdf);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF invoice');
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

/**
 * Test PDF generation (for debugging)
 */
export async function testPDFGeneration(): Promise<Buffer> {
  const testData: InvoiceData = {
    landlordName: "Test Landlord",
    invoiceNumber: "INV-2024-001",
    invoiceDate: "Jan 1, 2024",
    billingPeriod: "Jan 1 - Jan 31, 2024",
    dueDate: "Feb 1, 2024",
    subscriptionPlan: "TermFlow Pro",
    subscriptionFee: 99.00,
    passThroughCosts: [
      {
        service: "WhatsApp Messages",
        description: "150 messages sent",
        quantity: 150,
        unitCost: 0.0042,
        totalCost: 0.63,
      },
      {
        service: "AI Conversations",
        description: "50 conversations",
        quantity: 50,
        unitCost: 0.25,
        totalCost: 12.50,
      },
    ],
    subtotalPassThrough: 13.13,
    totalAmount: 112.13,
    paymentMethod: "Visa ending in 4242",
    paymentStatus: "paid",
  };

  return generateInvoicePDF(testData);
}
