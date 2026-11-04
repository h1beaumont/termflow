// PDF Manipulation Service for Contract Templates
import { PDFDocument, PDFPage, rgb, StandardFonts, PDFFont } from 'pdf-lib';
import { loadPDFFromStorage } from './fileStorage';
import type { ContractTemplate, Lead, Room, Property } from '@shared/schema';
import { storage } from './storage';

interface FieldData {
  [key: string]: string | number | boolean;
}

interface PDFField {
  id: string;
  type: 'text' | 'date' | 'number' | 'signature' | 'checkbox';
  x: number;
  y: number;
  width: number;
  height: number;
  page: number;
  placeholder?: string;
}

/**
 * Generate contract from template with filled data
 */
export async function generateContractFromTemplate(
  templateId: string,
  lead: Lead,
  room: Room,
  property: Property
): Promise<Buffer> {
  try {
    // 1. Get template from database
    const template = await storage.getContractTemplate(templateId);
    if (!template) {
      throw new Error('Contract template not found');
    }

    // 2. Load PDF from storage
    const pdfBuffer = await loadPDFFromStorage(template.fileUrl);

    // 3. Prepare data for filling
    const data = prepareContractData(lead, room, property);

    // 4. Fill PDF fields with data
    const filledPDF = await fillPDFFields(pdfBuffer, template.fields as PDFField[], data);

    // 5. Return filled PDF buffer
    return filledPDF;
  } catch (error) {
    console.error('Error generating contract from template:', error);
    throw new Error('Failed to generate contract from template');
  }
}

/**
 * Prepare contract data from lead, room, and property
 */
function prepareContractData(lead: Lead, room: Room, property: Property): FieldData {
  const today = new Date();
  const moveInDate = lead.moveInDate ? new Date(lead.moveInDate) : today;
  const weeklyRate = Number(room.rentPerWeek);
  const totalWeeks = 52; // Standard academic year
  const totalRent = weeklyRate * totalWeeks;
  const depositAmount = Number(room.depositAmount);

  // Calculate instalments if applicable
  const paymentOption = lead.paymentOption || "instalments";
  
  let instalment1 = 0, instalment2 = 0, instalment3 = 0, instalment4 = 0;
  if (paymentOption === "instalments") {
    instalment1 = totalRent * 0.25;
    instalment2 = totalRent * 0.25;
    instalment3 = totalRent * 0.25;
    instalment4 = totalRent * 0.25;
  }

  // Return all possible field values
  return {
    // Tenant Information
    tenantName: lead.name || '',
    tenantEmail: lead.email || '',
    tenantPhone: lead.phone || '',
    tenantAddress: '', // Leads don't have addresses in the schema
    tenantUniversity: lead.universityName || '',
    tenantCourse: lead.courseName || '',
    tenantYearOfStudy: lead.yearOfStudy || '',
    
    // Property Information
    propertyName: property.name,
    propertyAddress: property.address,
    propertyPostcode: property.postcode,
    propertyType: property.propertyType,
    
    // Room Information
    roomNumber: room.roomNumber,
    roomType: room.roomType,
    
    // Financial Information
    weeklyRent: `£${weeklyRate.toFixed(2)}`,
    totalRent: `£${totalRent.toFixed(2)}`,
    depositAmount: `£${depositAmount.toFixed(2)}`,
    
    // Instalment Information
    instalment1: `£${instalment1.toFixed(2)}`,
    instalment2: `£${instalment2.toFixed(2)}`,
    instalment3: `£${instalment3.toFixed(2)}`,
    instalment4: `£${instalment4.toFixed(2)}`,
    
    // Dates
    todayDate: today.toLocaleDateString('en-GB'),
    moveInDate: moveInDate.toLocaleDateString('en-GB'),
    academicYear: 'September 2025 - August 2026',
    
    // Guarantor Information (if applicable)
    guarantorName: lead.guarantorName || '',
    guarantorEmail: lead.guarantorEmail || '',
    guarantorPhone: lead.guarantorPhone || '',
    guarantorAddress: lead.guarantorAddress || '',
    
    // Payment Method
    paymentOption: paymentOption,
    needsGuarantor: paymentOption === "instalments",
    
    // Landlord Information
    landlordName: 'TALBOT STREET PROPERTY CO LIMITED',
    landlordAgent: 'Stanley House Lettings LTD',
    landlordAddress: '18 The Ropewalk Nottingham NG1 5DT',
    landlordEmail: 'info@stanleysa.com',
  };
}

/**
 * Fill PDF fields with data
 */
async function fillPDFFields(
  pdfBuffer: Buffer,
  fields: PDFField[],
  data: FieldData
): Promise<Buffer> {
  try {
    // Load the existing PDF
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const pages = pdfDoc.getPages();
    
    // Embed font for text fields
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    // Process each field
    if (fields && Array.isArray(fields)) {
      for (const field of fields) {
        // Get the value from data
        const value = getFieldValue(field.placeholder || field.id, data);
        
        if (value !== undefined && value !== null && value !== '') {
          // Get the page (0-indexed)
          const pageIndex = (field.page || 1) - 1;
          if (pageIndex >= 0 && pageIndex < pages.length) {
            const page = pages[pageIndex];
            
            // Draw based on field type
            await drawFieldValue(page, field, value, helvetica, helveticaBold);
          }
        }
      }
    }
    
    // Save and return the modified PDF
    const filledPDFBytes = await pdfDoc.save();
    return Buffer.from(filledPDFBytes);
  } catch (error) {
    console.error('Error filling PDF fields:', error);
    throw new Error('Failed to fill PDF fields');
  }
}

/**
 * Get field value from data based on placeholder text
 */
function getFieldValue(placeholder: string, data: FieldData): string {
  if (!placeholder) return '';
  
  // Try to match common placeholder patterns
  const lowerPlaceholder = placeholder.toLowerCase();
  
  // Direct key match
  for (const [key, value] of Object.entries(data)) {
    if (lowerPlaceholder.includes(key.toLowerCase())) {
      return value?.toString() || '';
    }
  }
  
  // Pattern matching for common fields
  if (lowerPlaceholder.includes('tenant') && lowerPlaceholder.includes('name')) {
    return data.tenantName?.toString() || '';
  }
  if (lowerPlaceholder.includes('email')) {
    return data.tenantEmail?.toString() || '';
  }
  if (lowerPlaceholder.includes('phone') || lowerPlaceholder.includes('mobile')) {
    return data.tenantPhone?.toString() || '';
  }
  if (lowerPlaceholder.includes('address')) {
    if (lowerPlaceholder.includes('property')) {
      return data.propertyAddress?.toString() || '';
    }
    return data.tenantAddress?.toString() || '';
  }
  if (lowerPlaceholder.includes('room')) {
    return data.roomNumber?.toString() || '';
  }
  if (lowerPlaceholder.includes('weekly') && lowerPlaceholder.includes('rent')) {
    return data.weeklyRent?.toString() || '';
  }
  if (lowerPlaceholder.includes('total') && lowerPlaceholder.includes('rent')) {
    return data.totalRent?.toString() || '';
  }
  if (lowerPlaceholder.includes('deposit')) {
    return data.depositAmount?.toString() || '';
  }
  if (lowerPlaceholder.includes('date')) {
    if (lowerPlaceholder.includes('move')) {
      return data.moveInDate?.toString() || '';
    }
    return data.todayDate?.toString() || '';
  }
  
  // Return placeholder text if no match found
  return '';
}

/**
 * Draw field value on PDF page
 */
async function drawFieldValue(
  page: PDFPage,
  field: PDFField,
  value: string,
  font: PDFFont,
  boldFont: PDFFont
): Promise<void> {
  try {
    const { height } = page.getSize();
    
    // Convert coordinates (PDF uses bottom-left origin, but UI uses top-left)
    const x = field.x;
    const y = height - field.y - field.height; // Convert from top-left to bottom-left
    
    // Choose font based on field type or importance
    const useFont = field.type === 'signature' ? boldFont : font;
    
    // Calculate font size to fit the field
    let fontSize = 12;
    if (field.height < 20) {
      fontSize = 10;
    } else if (field.height < 15) {
      fontSize = 8;
    }
    
    // Handle different field types
    switch (field.type) {
      case 'text':
      case 'date':
      case 'number':
        // Draw text
        page.drawText(value, {
          x: x,
          y: y + (field.height / 2) - (fontSize / 2), // Center vertically
          size: fontSize,
          font: useFont,
          color: rgb(0, 0, 0),
          maxWidth: field.width,
        });
        break;
        
      case 'signature':
        // Draw signature (just text for now, could be enhanced with image signatures)
        page.drawText(value, {
          x: x,
          y: y + (field.height / 2) - (fontSize / 2),
          size: fontSize * 1.2,
          font: boldFont,
          color: rgb(0, 0, 0.5),
          maxWidth: field.width,
        });
        break;
        
      case 'checkbox':
        // Draw checkbox (X if true/checked)
        if (value === 'true' || value === '1' || value.toLowerCase() === 'yes') {
          page.drawText('✓', {
            x: x + (field.width / 2) - 6,
            y: y + (field.height / 2) - 6,
            size: 14,
            font: font,
            color: rgb(0, 0, 0),
          });
        }
        break;
        
      default:
        // Default to text
        page.drawText(value, {
          x: x,
          y: y + (field.height / 2) - (fontSize / 2),
          size: fontSize,
          font: useFont,
          color: rgb(0, 0, 0),
          maxWidth: field.width,
        });
    }
  } catch (error) {
    console.error('Error drawing field value:', error);
    // Don't throw, just skip this field
  }
}