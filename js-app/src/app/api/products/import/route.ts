import { NextResponse } from 'next/server';
import { parseProductExcel, filterDuplicates } from '@/lib/excel-import';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const trace = (action: string, details: any) => {
  console.info(`[TRACE - ${new Date().toISOString()}] IMPORT_${action}:`, JSON.stringify(details));
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
    }

    trace('ATTEMPT', { fileName: file.name, fileSize: file.size });

    // Read the file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse Excel into rows
    const incomingRows = parseProductExcel(buffer);
    trace('PARSED', { totalIncomingRows: incomingRows.length });

    if (incomingRows.length === 0) {
      return NextResponse.json({ success: false, message: 'No valid products found in Excel' }, { status: 400 });
    }

    // Fetch existing active products from DB to perform memory-based duplicate checking
    const existingProducts = await prisma.product.findMany({
      where: { deletedAt: null },
      select: { name: true, category: true }
    });

    // Filter duplicates
    const newProductsToInsert = filterDuplicates(incomingRows, existingProducts);
    const duplicatesSkipped = incomingRows.length - newProductsToInsert.length;
    
    trace('DUPLICATES_CHECKED', { 
      existingInDb: existingProducts.length, 
      duplicatesSkipped,
      newToInsert: newProductsToInsert.length 
    });

    if (newProductsToInsert.length > 0) {
      // Bulk insert using Prisma createMany
      await prisma.product.createMany({
        data: newProductsToInsert
      });
    }

    trace('SUCCESS', { imported: newProductsToInsert.length, skipped: duplicatesSkipped });

    return NextResponse.json({
      success: true,
      message: `Imported ${newProductsToInsert.length} products. Skipped ${duplicatesSkipped} duplicates.`
    });

  } catch (error: any) {
    trace('FAILED', { error: error.message });
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
