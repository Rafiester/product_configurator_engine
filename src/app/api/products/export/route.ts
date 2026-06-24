import { NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

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

    // Create ExcelJS workbook & worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Master Data');

    // Configure headers and columns matching Laravel
    worksheet.columns = [
      { header: 'Category', key: 'category', width: 22 },
      { header: 'Product', key: 'product', width: 35 },
      { header: 'Qty', key: 'qty', width: 10 },
      { header: 'SDP', key: 'sdp', width: 14 },
      { header: 'Total SDP', key: 'totalSdp', width: 16 },
      { header: 'Page Price', key: 'pagePrice', width: 16 },
      { header: 'SRP', key: 'srp', width: 16 },
      { header: 'Margin ($)', key: 'margin', width: 14 },
      { header: 'Margin (%)', key: 'marginPercentage', width: 14 }
    ];

    // Format headers
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

    // Set background colors for header cells
    // Total SDP (E1) -> Yellow (FFFF00)
    headerRow.getCell(5).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFFF00' }
    };
    // Page Price (F1) -> Orange (FFA500)
    headerRow.getCell(6).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFA500' }
    };
    // SRP (G1) -> Green (90EE90)
    headerRow.getCell(7).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF90EE90' }
    };

    // Populate rows
    products.forEach((p) => {
      const qty = p.qty || 0;
      const sdp = Number(p.sdp) || 0;
      const pagePrice = Number(p.page_price) || 0;
      const srp = Number(p.srp) || 0;

      const totalSdp = qty * sdp;
      const margin = pagePrice - totalSdp;
      const marginPercentage = pagePrice > 0 ? (margin / pagePrice) : 0; // percentage formatting will multiply by 100 in excel

      const row = worksheet.addRow({
        category: p.category,
        product: p.name,
        qty: qty,
        sdp: sdp,
        totalSdp: totalSdp,
        pagePrice: pagePrice,
        srp: srp,
        margin: margin,
        marginPercentage: marginPercentage
      });

      // Align cells
      row.getCell(1).alignment = { horizontal: 'left' };
      row.getCell(2).alignment = { horizontal: 'left' };
      row.getCell(3).alignment = { horizontal: 'center' };
      row.getCell(4).alignment = { horizontal: 'right' };
      row.getCell(5).alignment = { horizontal: 'right' };
      row.getCell(6).alignment = { horizontal: 'right' };
      row.getCell(7).alignment = { horizontal: 'right' };
      row.getCell(8).alignment = { horizontal: 'right' };
      row.getCell(9).alignment = { horizontal: 'right' };

      // Number formatting to 2 decimal digits
      row.getCell(4).numFmt = '0.00';
      row.getCell(5).numFmt = '0.00';
      row.getCell(6).numFmt = '0.00';
      row.getCell(7).numFmt = '0.00';
      row.getCell(8).numFmt = '0.00';
      row.getCell(9).numFmt = '0.00%';
    });

    // Freeze top header row (A2 split)
    worksheet.views = [
      { state: 'frozen', ySplit: 1 }
    ];

    // Generate output buffer
    const buffer = await workbook.xlsx.writeBuffer();

    trace('SUCCESS', { bytes: buffer.byteLength });

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
