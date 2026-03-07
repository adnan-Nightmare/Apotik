<?php

namespace App\Exports;

use App\Models\StockProduct;
use Maatwebsite\Excel\Concerns\FromCollection;

class StockReportExport implements FromCollection
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return StockProduct::with(['medicines', 'supplier'])
            ->when(request()->q, function ($query) {
                $query->whereHas('supplier', function ($q) {
                    $q->where('name', 'like', '%' . request()->q . '%');
                });
            })->get();
    }
}
