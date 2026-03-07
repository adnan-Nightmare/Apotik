<?php

namespace App\Exports;

use App\Models\StockProduct;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class PembelianReportExport implements FromCollection, WithMapping, WithHeadings
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return StockProduct::with(['medicines', 'supplier'])->get();
    }

    public function map($row): array{
        return [
            $row->nomor_batch,
            $row->medicines->nama_obat,
            $row->supplier->name,
            $row->stock_quantity,
            $row->harga_beli,
            $row->received_at
        ];
    }

    public function headings(): array
    {
        return [
            'Nomor Batch',
            'Nama Obat',
            'Nama Supplier',
            'Stok Obat',
            'Harga Beli',
            'Tanggal Diterima',
        ];
    }
}