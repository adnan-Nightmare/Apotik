<?php

namespace App\Exports;

use App\Models\StockProduct;
use Maatwebsite\Excel\Concerns\FromCollection;

class PembelianReportExport implements FromCollection
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return StockProduct::with(['medicines', 'supplier'])->latest()->get();
    }
}
