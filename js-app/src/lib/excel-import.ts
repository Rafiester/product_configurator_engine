// Helper utilities for importing Master Data from Excel
// Uses the xlsx package to parse sheets and safely convert them to Prisma types.

import * as xlsx from 'xlsx';

export interface ProductImportRow {
  name: string;
  category: string;
  qty: number;
  sdp: number;
  page_price: number;
  srp: number;
  status: string;
}

export function parseProductExcel(buffer: Buffer): ProductImportRow[] {
  const workbook = xlsx.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  
  // Extract raw JSON
  const rawData = xlsx.utils.sheet_to_json(sheet) as any[];

  return rawData.map(row => {
    // Helper to get value ignoring case and spaces
    const getValue = (keys: string[]) => {
      const rowKeys = Object.keys(row);
      for (const targetKey of keys) {
        const foundKey = rowKeys.find(k => k.toLowerCase().replace(/\s+/g, '') === targetKey.toLowerCase().replace(/\s+/g, ''));
        if (foundKey) return row[foundKey];
      }
      return undefined;
    };

    return {
      name: String(getValue(['product', 'productname', 'name']) || '').trim(),
      category: String(getValue(['category']) || '').trim(),
      qty: Number(getValue(['qty', 'quantity']) || 1),
      sdp: sanitizeCurrency(getValue(['sdp'])),
      page_price: sanitizeCurrency(getValue(['pageprice', 'page_price'])),
      srp: sanitizeCurrency(getValue(['srp'])),
      status: 'active',
    };
  }).filter(row => row.name && row.category); // skip empty rows
}

function sanitizeCurrency(value: any): number {
  if (!value) return 0;
  if (typeof value === 'number') return value;
  // Remove "RM", spaces, and commas
  const stringVal = String(value).replace(/RM/g, '').replace(/,/g, '').trim();
  const parsed = parseFloat(stringVal);
  return isNaN(parsed) ? 0 : parsed;
}

// Logic for skipping duplicates in memory
export function filterDuplicates(
  incomingRows: ProductImportRow[], 
  existingProducts: { name: string, category: string }[]
): ProductImportRow[] {
  return incomingRows.filter(incoming => {
    const isDuplicate = existingProducts.some(existing => 
      existing.name.toLowerCase() === incoming.name.toLowerCase() &&
      existing.category.toLowerCase() === incoming.category.toLowerCase()
    );
    return !isDuplicate;
  });
}
