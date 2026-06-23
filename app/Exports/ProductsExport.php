<?php

namespace App\Exports;

use App\Models\Product;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;

class ProductsExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithColumnFormatting, ShouldAutoSize
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return Product::all();
    }

    public function headings(): array
    {
        return [
            'Category',
            'Product',
            'Qty',
            'SDP',
            'Total SDP',
            'Page Price',
            'SRP',
            'Margin ($)',
            'Margin (%)'
        ];
    }

    public function map($product): array
    {
        $qty = $product->qty ?? 0;
        $sdp = $product->sdp ?? 0;
        $pagePrice = $product->page_price ?? 0;
        $srp = $product->srp ?? 0;

        $totalSdp = $qty * $sdp;
        $margin = $pagePrice - $totalSdp;
        $marginPercentage = $pagePrice > 0 ? ($margin / $pagePrice) : 0; // Excel percentage is 0.xx

        return [
            $product->category,
            $product->name,
            $qty,
            $sdp,
            $totalSdp,
            $pagePrice,
            $srp,
            $margin,
            $marginPercentage
        ];
    }

    public function styles(Worksheet $sheet)
    {
        $sheet->freezePane('A2');

        $headerStyle = [
            'font' => [
                'bold' => true,
            ]
        ];

        $sheet->getStyle('A1:I1')->applyFromArray($headerStyle);

        // Background colors
        // Total SDP (E1) -> Yellow
        $sheet->getStyle('E1')->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFFF00');
        // Page Price (F1) -> Orange
        $sheet->getStyle('F1')->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFFFA500');
        // SRP (G1) -> Green
        $sheet->getStyle('G1')->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FF90EE90');

        return [];
    }

    public function columnFormats(): array
    {
        return [
            'D' => NumberFormat::FORMAT_NUMBER_00, // SDP
            'E' => NumberFormat::FORMAT_NUMBER_00, // Total SDP
            'F' => NumberFormat::FORMAT_NUMBER_00, // Page Price
            'G' => NumberFormat::FORMAT_NUMBER_00, // SRP
            'H' => NumberFormat::FORMAT_NUMBER_00, // Margin ($)
            'I' => NumberFormat::FORMAT_PERCENTAGE_00, // Margin (%)
        ];
    }
}
