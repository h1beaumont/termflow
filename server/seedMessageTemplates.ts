import fs from 'fs';
import { parse } from 'csv-parse/sync';
import { db } from './db';
import { messageTemplateVariants } from '@shared/schema';

// Extract all {variable} patterns from text
function extractVariables(text: string): string[] {
  const variablePattern = /\{(\w+)\}/g;
  const variables: string[] = [];
  let match;
  
  while ((match = variablePattern.exec(text)) !== null) {
    if (!variables.includes(match[1])) {
      variables.push(match[1]);
    }
  }
  
  return variables;
}

// Parse eligibility flags from comma-separated string
function parseEligibilityFlags(flagsString: string): string[] {
  if (!flagsString || flagsString.trim() === '') {
    return [];
  }
  return flagsString.split(',').map(flag => flag.trim()).filter(flag => flag.length > 0);
}

async function seedMessageTemplates() {
  console.log('🌱 Starting message template import...\n');
  
  // CSV file paths
  const whatsappCsvPath = 'attached_assets/extracted/whatsapp_templates.csv';
  const emailCsvPath = 'attached_assets/extracted/email_templates.csv';
  
  let totalImported = 0;
  const templatesProcessed: string[] = [];
  
  // Process WhatsApp templates
  console.log('📱 Processing WhatsApp templates...');
  const whatsappCsv = fs.readFileSync(whatsappCsvPath, 'utf-8');
  const whatsappRecords = parse(whatsappCsv, {
    columns: true,
    skip_empty_lines: true,
  });
  
  for (const record of whatsappRecords) {
    const variables = extractVariables(record.text);
    const eligibilityFlags = parseEligibilityFlags(record.eligibility_flags);
    
    const templateData = {
      templateKey: record.id,
      stage: record.stage,
      channel: record.channel,
      toneOrSubject: record.tone_or_subject,
      textContent: record.text,
      variables,
      eligibilityFlags,
      isActive: true,
    };
    
    // Upsert (insert or update if templateKey exists)
    await db
      .insert(messageTemplateVariants)
      .values(templateData)
      .onConflictDoUpdate({
        target: messageTemplateVariants.templateKey,
        set: {
          stage: templateData.stage,
          channel: templateData.channel,
          toneOrSubject: templateData.toneOrSubject,
          textContent: templateData.textContent,
          variables: templateData.variables,
          eligibilityFlags: templateData.eligibilityFlags,
          isActive: templateData.isActive,
          updatedAt: new Date(),
        },
      });
    
    templatesProcessed.push(`${record.id} (${record.channel})`);
    totalImported++;
  }
  
  console.log(`✅ Imported ${whatsappRecords.length} WhatsApp templates\n`);
  
  // Process Email templates
  console.log('📧 Processing Email templates...');
  const emailCsv = fs.readFileSync(emailCsvPath, 'utf-8');
  const emailRecords = parse(emailCsv, {
    columns: true,
    skip_empty_lines: true,
  });
  
  for (const record of emailRecords) {
    const variables = extractVariables(record.text);
    const eligibilityFlags = parseEligibilityFlags(record.eligibility_flags);
    
    const templateData = {
      templateKey: record.id,
      stage: record.stage,
      channel: record.channel,
      toneOrSubject: record.tone_or_subject,
      textContent: record.text,
      variables,
      eligibilityFlags,
      isActive: true,
    };
    
    // Upsert (insert or update if templateKey exists)
    await db
      .insert(messageTemplateVariants)
      .values(templateData)
      .onConflictDoUpdate({
        target: messageTemplateVariants.templateKey,
        set: {
          stage: templateData.stage,
          channel: templateData.channel,
          toneOrSubject: templateData.toneOrSubject,
          textContent: templateData.textContent,
          variables: templateData.variables,
          eligibilityFlags: templateData.eligibilityFlags,
          isActive: templateData.isActive,
          updatedAt: new Date(),
        },
      });
    
    templatesProcessed.push(`${record.id} (${record.channel})`);
    totalImported++;
  }
  
  console.log(`✅ Imported ${emailRecords.length} Email templates\n`);
  
  // Summary
  console.log('📊 Import Summary:');
  console.log(`   Total templates processed: ${totalImported}`);
  console.log(`   - WhatsApp templates: ${whatsappRecords.length}`);
  console.log(`   - Email templates: ${emailRecords.length}`);
  console.log('\n✨ Template import completed successfully!');
  
  // Show sample of imported templates
  console.log('\n📝 Sample of imported templates:');
  templatesProcessed.slice(0, 5).forEach(t => console.log(`   - ${t}`));
  if (templatesProcessed.length > 5) {
    console.log(`   ... and ${templatesProcessed.length - 5} more`);
  }
}

// Run the seed function
seedMessageTemplates()
  .then(() => {
    console.log('\n✅ Script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error importing templates:', error);
    process.exit(1);
  });
