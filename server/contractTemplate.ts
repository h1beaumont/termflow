// Contract Template Generator for Stanley House Tenancy Agreements
import type { Lead, Room, Property } from "@shared/schema";
import { generateContractFromTemplate } from "./pdfManipulation";
import { storage } from "./storage";

interface ContractData {
  lead: Lead;
  room: Room;
  property: Property;
}

function escapeHtml(unsafe: string | null | undefined): string {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Generate contract - tries to use PDF template first, falls back to HTML
 */
export async function generateContract(lead: Lead, room: Room, property: Property): Promise<string | Buffer> {
  try {
    // Try to get the default PDF template for the landlord
    if (property.landlordId) {
      const templates = await storage.getContractTemplatesByLandlord(property.landlordId);
      const defaultTemplate = templates.find(t => t.isDefault) || templates[0];
      
      if (defaultTemplate && defaultTemplate.fileUrl) {
        // Use PDF template if available
        console.log('Using PDF template for contract generation:', defaultTemplate.name);
        const pdfBuffer = await generateContractFromTemplate(
          defaultTemplate.id,
          lead,
          room,
          property
        );
        return pdfBuffer;
      }
    }
  } catch (error) {
    console.error('Error using PDF template, falling back to HTML:', error);
  }
  
  // Fall back to HTML generation if no PDF template
  return generateContractHTML(lead, room, property);
}

/**
 * Legacy HTML contract generator (fallback)
 */
export function generateContractHTML(lead: Lead, room: Room, property: Property): string {
  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  
  // Calculate rent details
  const weeklyRate = Number(room.rentPerWeek);
  const totalWeeks = 52; // Standard academic year
  const totalRent = weeklyRate * totalWeeks;
  const depositAmount = Number(room.depositAmount);
  
  // Calculate instalments if applicable
  const paymentOption = lead.paymentOption || "instalments";
  const needsGuarantor = paymentOption === "instalments";
  
  let instalmentBreakdown = '';
  if (paymentOption === "instalments") {
    const instalment1 = (totalRent * 0.25).toFixed(2);
    const instalment2 = (totalRent * 0.25).toFixed(2);
    const instalment3 = (totalRent * 0.25).toFixed(2);
    const instalment4 = (totalRent * 0.25).toFixed(2);
    
    instalmentBreakdown = `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">1st Instalment</td>
        <td style="padding: 8px; border: 1px solid #ddd;">£${instalment1} (Due at move-in)</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">2nd Instalment</td>
        <td style="padding: 8px; border: 1px solid #ddd;">£${instalment2} (Due 3 months after move-in)</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">3rd Instalment</td>
        <td style="padding: 8px; border: 1px solid #ddd;">£${instalment3} (Due 6 months after move-in)</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">4th Instalment</td>
        <td style="padding: 8px; border: 1px solid #ddd;">£${instalment4} (Due 9 months after move-in)</td>
      </tr>
    `;
  }
  
  // Residential period dates
  const moveInDate = lead.moveInDate ? new Date(lead.moveInDate).toLocaleDateString('en-GB') : 'TBC';
  const residentialPeriod = `September 2025 - August 2026`;
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Assured Shorthold Tenancy Agreement</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        h1 {
          text-align: center;
          color: #1a1a1a;
          font-size: 24px;
          margin-bottom: 30px;
        }
        h2 {
          color: #1a1a1a;
          font-size: 18px;
          margin-top: 30px;
          margin-bottom: 15px;
        }
        h3 {
          color: #333;
          font-size: 16px;
          margin-top: 20px;
          margin-bottom: 10px;
        }
        .section {
          margin-bottom: 25px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 15px 0;
        }
        th, td {
          padding: 8px;
          text-align: left;
          border: 1px solid #ddd;
        }
        th {
          background-color: #f4f4f4;
          font-weight: 600;
        }
        .info-box {
          background-color: #f9f9f9;
          border-left: 4px solid #4a5568;
          padding: 15px;
          margin: 15px 0;
        }
        .warning-box {
          background-color: #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 15px;
          margin: 15px 0;
        }
        @media print {
          body {
            padding: 0;
          }
        }
      </style>
    </head>
    <body>
      <h1>Assured Shorthold Tenancy Agreement</h1>
      
      <div class="section">
        <h2>The Landlord and Landlord's Agent</h2>
        <table>
          <tr>
            <th>Landlord</th>
            <td>TALBOT STREET PROPERTY CO LIMITED</td>
          </tr>
          <tr>
            <th>Landlord's Agent</th>
            <td>Stanley House Lettings LTD – 18 The Ropewalk Nottingham NG1 5DT<br>Email: info@stanleysa.com</td>
          </tr>
        </table>
        <p>This agreement is made between the Landlord detailed above and the Tenant detailed below.</p>
      </div>

      <div class="section">
        <h2>The Tenant</h2>
        <table>
          <tr>
            <th>Name</th>
            <td>${escapeHtml(lead.name) || 'N/A'}</td>
          </tr>
          <tr>
            <th>Address</th>
            <td>TBC</td>
          </tr>
          <tr>
            <th>Phone Number</th>
            <td>${escapeHtml(lead.phone) || 'N/A'}</td>
          </tr>
          <tr>
            <th>Mobile Number</th>
            <td>${escapeHtml(lead.whatsappNumber || lead.phone) || 'N/A'}</td>
          </tr>
          <tr>
            <th>Email Address</th>
            <td>${escapeHtml(lead.email) || 'N/A'}</td>
          </tr>
          <tr>
            <th>University</th>
            <td>${escapeHtml(lead.universityName) || 'N/A'}</td>
          </tr>
          <tr>
            <th>Course</th>
            <td>${escapeHtml(lead.courseName) || 'N/A'}</td>
          </tr>
        </table>
      </div>

      ${needsGuarantor ? `
      <div class="section">
        <h2>The Guarantor</h2>
        <div class="info-box">
          <p><strong>A UK based guarantor is required for all tenants wishing to pay by instalments.</strong> If you are paying the full rent in advance before moving in, then a guarantor is not required.</p>
        </div>
        <table>
          <tr>
            <th>Name</th>
            <td>${escapeHtml(lead.guarantorName) || 'N/A'}</td>
          </tr>
          <tr>
            <th>Address</th>
            <td>${escapeHtml(lead.guarantorAddress) || 'N/A'}</td>
          </tr>
          <tr>
            <th>Phone Number</th>
            <td>${escapeHtml(lead.guarantorPhone) || 'N/A'}</td>
          </tr>
          <tr>
            <th>Mobile Number</th>
            <td>${escapeHtml(lead.guarantorMobile) || 'N/A'}</td>
          </tr>
          <tr>
            <th>Email Address</th>
            <td>${escapeHtml(lead.guarantorEmail) || 'N/A'}</td>
          </tr>
          <tr>
            <th>Guarantor D.O.B.</th>
            <td>${escapeHtml(lead.guarantorDob) || 'N/A'}</td>
          </tr>
          <tr>
            <th>Guarantor NI Number</th>
            <td>${escapeHtml(lead.guarantorNi) || 'N/A'}</td>
          </tr>
        </table>
      </div>
      ` : ''}

      <div class="section">
        <h2>Property Details</h2>
        <table>
          <tr>
            <th>Name</th>
            <td>STANLEY HOUSE</td>
          </tr>
          <tr>
            <th>Address</th>
            <td>TALBOT STREET, NOTTINGHAM, NG1 5GS</td>
          </tr>
          <tr>
            <th>Room</th>
            <td>${escapeHtml(room.roomNumber)}</td>
          </tr>
          <tr>
            <th>Room Type</th>
            <td>${escapeHtml(room.roomType)}</td>
          </tr>
        </table>
      </div>

      <div class="section">
        <h2>Definitions</h2>
        <p>In this agreement the following definitions apply:</p>
        <table>
          <tr>
            <th>Flat</th>
            <td>All that flat as set out above, excluding such rooms that are let or are intended to be let to students under assured shorthold tenancies other than this agreement.</td>
          </tr>
          <tr>
            <th>Property</th>
            <td>All that building, of which the Flat and the Room form part, as set out above.</td>
          </tr>
          <tr>
            <th>Room</th>
            <td>All that room within the Flat as set out above.</td>
          </tr>
          <tr>
            <th>Room Items</th>
            <td>Fixed Furniture, mattresses, as per the Welcome Pack Inventory, oven, hob, window coverings.</td>
          </tr>
          <tr>
            <th>Shared Areas</th>
            <td>All those parts of the Property, excluding flats containing rooms let or intended to be let to individual students, which are intended to be used in common with other occupiers.</td>
          </tr>
        </table>
      </div>

      <div class="section">
        <h2>1. Tenancy Term and Rent Charges</h2>
        
        <h3>Tenancy Dates / Residential Period</h3>
        <table>
          <tr>
            <th>Residential Period</th>
            <td>${residentialPeriod}</td>
          </tr>
          <tr>
            <th>Move-in Date</th>
            <td>${moveInDate}</td>
          </tr>
          <tr>
            <th>Deposit</th>
            <td>£${depositAmount.toFixed(2)}</td>
          </tr>
        </table>

        <h3>Rent</h3>
        <table>
          <tr>
            <th>Weekly Rate</th>
            <td>£${weeklyRate.toFixed(2)}</td>
          </tr>
          <tr>
            <th>Total Weeks</th>
            <td>${totalWeeks} weeks</td>
          </tr>
          <tr>
            <th>Total Rent</th>
            <td>£${totalRent.toFixed(2)}</td>
          </tr>
          <tr>
            <th>Payment Option Selected</th>
            <td>${paymentOption === 'instalments' ? 'Instalments' : 'Full Payment'}</td>
          </tr>
        </table>

        ${paymentOption === 'instalments' ? `
        <h3>Instalments</h3>
        <table>
          ${instalmentBreakdown}
        </table>
        ` : `
        <p><strong>Full Payment:</strong> Total rent of £${totalRent.toFixed(2)} to be paid in advance before move-in.</p>
        `}

        <p><strong>1.1.</strong> The Landlord lets and the Tenant takes the Room together with a right to use in common with others the Flat and the Shared Areas for the Residential Period at the Rent and this agreement creates an Assured Shorthold Tenancy within Part 1 Chapter II of the Housing Act 1988 as amended by Part III of the Housing Act 1996.</p>

        <p><strong>1.2.</strong> The allowance for the payment of Rent by way of instalments is made on the express condition that each payment is made in full on or before the relevant due date. If any payment is missed or if any payment is not made in full then the Landlord reserves the right to demand full payment of the total outstanding amount for all the remaining instalments immediately without further notice.</p>

        <p><strong>1.3.</strong> Included in the Rent is an allowance towards utility costs of £250 per month. The Landlord reserves the right to recharge to the Tenant any additional costs incurred above this amount for utilities (water, electricity, gas).</p>

        <p><strong>1.4.</strong> Tenants are responsible for paying any local council tax that is due, or becomes due, during the dates of this agreement. Though students are usually exempt from council tax, the Tenant agrees that they will be liable for any council tax liability that may arise.</p>

        <p><strong>1.5.</strong> Rent is always due in advance. If you fail to pay your rent in advance or on the date due the arrears process will automatically commence. Interest will be charged on any outstanding sum at the daily interest of 3% above the Bank of England Base Rate.</p>
      </div>

      <div class="section">
        <h2>2. Reservation Rent & Deposit</h2>
        <p><strong>2.1.</strong> The Tenant is required to provide a Deposit for the amount detailed above at the commencement of the Residential Period.</p>

        <p><strong>2.2.</strong> The Deposit will be held in trust as security against any damage to the Room, the Flat or the Property (fair wear and tear excepted), any damage to the furnishings or other equipment provided (fair wear and tear excepted) and any unpaid Rent or other charges incurred during the duration of this agreement.</p>

        <p><strong>2.3.</strong> The Deposit will be managed in accordance with tenancy deposit protection legislation and will be registered within 30 days of the commencement of the Residential Period.</p>

        <div class="info-box">
          <p>As a tenant at the Room, your Deposit is secured in a Tenancy Deposit Scheme. This will ensure that your Deposit is held in trust and in the event that any disputes occur you will have the Tenancy Deposit Scheme to help out.</p>
        </div>
      </div>

      <div class="section">
        <h2>3. Termination of the Tenancy</h2>
        <p><strong>3.1.</strong> The Tenant will arrange a suitable time with the Landlord's Agent for an inspection of the Room. The Landlord's Agent will tell the Tenant within 10 working days of the end date if they propose to make any deductions from the deposit.</p>

        <p><strong>3.2.</strong> If the Tenant signs the vacating inspection sheet, the Deposit will be returned within 14 days net of any agreed deductions.</p>

        <div class="warning-box">
          <p><strong>Important:</strong> If any of the following clauses are breached you will be asked to attend a meeting with the Accommodation Team. Breaching of any of these clauses could result in the termination of your agreement at full financial cost to the tenant.</p>
        </div>
      </div>

      <div class="section">
        <h2>4. The Accommodation</h2>
        <p><strong>4.1.</strong> The Tenant will:</p>
        <ul>
          <li>Agree to adhere to and obey the rules and regulations of the Property as may be made and varied from time to time.</li>
          <li>Pay the rent in the manner due and at the times specified regardless of whether this is demanded or not.</li>
          <li>Keep the interior of the Flat together with all fixtures and fittings in good condition and not to alter the Flat or make any holes or affix anything to the walls ceiling and floors.</li>
          <li>Not change the internal or external colour of the Flat.</li>
          <li>Not carry on any trade, profession or business on or from the Flat and to use the Room as a single private residence only.</li>
          <li>Not assign or sub-let the Room or any part thereof, or permit any other person to reside in, or occupy, the Room.</li>
          <li>Not keep any animal, bird or reptile at the Flat.</li>
          <li>Not cause or allow any visitors to cause a nuisance or annoyance to other persons/tenants in the residence.</li>
          <li>Be responsible for their own washing up, clearance of debris, grease and spillages.</li>
          <li>Not commit or allow any visitor to commit any form of criminal offence, harassment, or nuisance.</li>
          <li>Not permit any television, hi-fi, radio, musical instrument, or other sound producing equipment to be audible outside the Room between the hours of 10.30pm and 8.00am.</li>
          <li>Not use a paraffin or portable gas heater or candles within the Flat.</li>
          <li>Not tamper with any fire fighting/prevention equipment, including fire extinguishers, fire blankets, and fire alarms.</li>
          <li>Not smoke in any part of the Property.</li>
        </ul>
      </div>

      ${needsGuarantor ? `
      <div class="section">
        <h2>5. The Guarantor</h2>
        <p><strong>5.1.</strong> The Guarantor guarantees the payment by the Tenant to the Landlord of the Rent and any other monies payable under this agreement and the performance and observance by the Tenant of the terms and provisions of this agreement.</p>

        <p><strong>5.2.</strong> If the Tenant shall default in the payment of the Rent or any other monies payable under the said agreement, the Guarantor will, upon written demand by the Landlord, immediately pay the Rent and any other monies that shall be due to the Landlord.</p>

        <p><strong>5.3.</strong> This Guarantee shall continue in effect until all sums whatsoever payable by the Tenant under the agreement have been paid in full and this Guarantee shall not be terminated by the death or bankruptcy of the Tenant.</p>
      </div>
      ` : ''}

      <div class="section">
        <h2>6. Access by the Landlord</h2>
        <p><strong>6.1.</strong> The Tenant will permit the Landlord and Landlord's Agent and their agents, together with any necessary contractors and workmen, to enter the Flat and the Room at all reasonable times upon 24 hours' notice (or in the event of an emergency at any time without notice).</p>
      </div>

      <div class="section">
        <h2>7. At the end of the Tenancy</h2>
        <p><strong>7.1.</strong> The Tenant will attend a check-out inspection arranged by the Landlord's Agent and sign a copy of the inspection report.</p>
        
        <p><strong>7.2.</strong> The Tenant will hand over to the Landlord or his agents by 12 noon on the last day of this agreement all keys, fobs, door entry cards, or any other access devices.</p>
      </div>

      <div class="section">
        <h2>8. The Landlord</h2>
        <p><strong>8.1.</strong> The Landlord is entitled to terminate this agreement and obtain a court order to enter the Room and evict the Tenant if:</p>
        <ul>
          <li>Any instalment of Rent is not received in full within 14 days of the date when it has fallen due, OR</li>
          <li>The Tenant fails to comply with any of the Tenant's obligations under this Agreement, OR</li>
          <li>The Tenant becomes bankrupt or an interim receiver of his property is appointed.</li>
        </ul>
      </div>

      <div class="section" style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #333;">
        <p><strong>Agreement Date:</strong> ${today}</p>
        <p>This agreement is subject to the terms and conditions outlined above.</p>
      </div>
    </body>
    </html>
  `;
}
