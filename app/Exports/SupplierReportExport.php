<?php

namespace App\Exports;

use App\Models\StockProduct;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class SupplierReportExport implements FromCollection, WithMapping, WithHeadings
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return StockProduct::with('supplier')
            ->selectRaw('supplier_id, COUNT(*) as jumlah_pembelian, SUM(stock_quantity) as total_obat')
            ->groupBy('supplier_id')
            ->get();
    }

    public function map($row): array{
        return [
            $row->supplier->name,
            $row->jumlah_pembelian,
            $row->total_obat
        ];
    }

    public function headings(): array
    {
        return [
            'Nama Supplier',
            'Jumlah Pembelian',
            'Total Obat',
        ];
    }
}
