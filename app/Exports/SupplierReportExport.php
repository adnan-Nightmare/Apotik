<?php

namespace App\Exports;

use App\Models\StockProduct;
use Maatwebsite\Excel\Concerns\FromCollection;

class SupplierReportExport implements FromCollection
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return StockProduct::join('suppliers', 'stock_products.supplier_id', '=', 'suppliers.id')
            ->selectRaw('suppliers.name as supplier_name, COUNT(*) as jumlah_pembelian, SUM(stock_quantity) as total_obat')
            ->groupBy('suppliers.name')
            ->get();
    }
}
