import XLSX from 'xlsx';
import * as fs from 'fs';

const filePath = 'attached_assets/Stanley House Videos_1760231391871.xlsx';

// Read the Excel file
const workbook = XLSX.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Convert to JSON
const data = XLSX.utils.sheet_to_json(worksheet);

// Display the data
console.log('Excel File Contents:');
console.log('Total rows:', data.length);
console.log('\nFirst 5 rows:');
console.log(JSON.stringify(data.slice(0, 5), null, 2));

// Show all column names
if (data.length > 0) {
  console.log('\nColumn names:');
  console.log(Object.keys(data[0]));
}

// Write full data to a temp file for inspection
fs.writeFileSync('scripts/video-mapping.json', JSON.stringify(data, null, 2));
console.log('\nFull data written to scripts/video-mapping.json');
