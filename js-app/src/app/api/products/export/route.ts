import { NextResponse } from 'next/server';
import * as xlsx from 'xlsx';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const trace = (action: string, details: any) => {
  console.info(`[TRACE - ${new Date().toISOString()}] EXPORT_${action}:`, JSON.stringify(details));
};

export async function GET() {
  try {
    trace('ATTEMPT', {});

    // Fetch all active products
    const products = await prisma.product.findMany({
      where: { deletedAt: null },
      orderBy: { category: 'asc' }
    });

    trace('FETCHED', { totalProducts: products.length });

    // Transform to export format with calculated business logic
    const exportData = products.map((p, index) => {
      const totalSdp = p.qty * Number(p.sdp);
      const margin = Number(p.page_price) - totalSdp;
      const marginPercentage = Number(p.page_price) > 0 ? (margin / Number(p.page_price)) : 0;

      return {
        'No': index + 1,
        'Name': p.name,
        'Category': p.category,
        'Qty': p.qty,
        'SDP': Number(p.sdp),
        'Total SDP': totalSdp,
        'Page Price': Number(p.page_price),
        'SRP': Number(p.srp),
        'Margin': margin,
        'Margin %': marginPercentage,
        'Status': p.status === 'active' ? 'Publish' : 'Unpublish'
      };
    });

    // Create workbook and sheet
    const worksheet = xlsx.utils.json_to_sheet(exportData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Master Data');

    // Generate buffer
    const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    trace('SUCCESS', { bytes: buffer.length });

    // Return as downloadable file
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Disposition': `attachment; filename="product_master_data_${new Date().getTime()}.xlsx"`,
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      }
    });

  } catch (error: any) {
    trace('FAILED', { error: error.message });
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
