<?php

namespace App\Exports;

use App\Models\StockProduct;
use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class KadaluarsaReportExport implements FromCollection, WithMapping, WithHeadings
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return StockProduct::with('medicines')->whereDate('kadaluarsa', '<=', Carbon::today()->addDays(30))->orderBy('kadaluarsa', 'asc')->get();
    }

    public function map($row): array{
        return [
            $row->nomor_batch,
            $row->medicines->nama_obat,
            $row->stock_quantity,
            $row->kadaluarsa
        ];
    }

    public function headings(): array
    {
        return [
            'Nomor Batch',
            'Nama Obat',
            'Stok Obat',
            'Tanggal Kadaluarsa',
        ];
    }
}
