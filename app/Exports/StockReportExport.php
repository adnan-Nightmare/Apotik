<?php

namespace App\Exports;

use App\Models\medicines;
use App\Models\StockProduct;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class StockReportExport implements FromCollection, WithMapping, WithHeadings
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return medicines::with(['kategori', 'satuan', 'stockTotal'])->get();
    }

    public function map($row): array{
        // dd($row);
        return [
            $row->nama_obat,
            $row->kategori->nama_kategori,
            $row->satuan->nama_satuan,
            $row->stockTotal->total_stock ?? 0,
        ];
    }

    public function headings(): array
    {
        return [
            'Nama Obat',
            'Kategori',
            'Satuan',
            'Stok Obat',
        ];
    }
}
