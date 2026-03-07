<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\StockProduct;
use Illuminate\Http\Request;

class ReportSupplierController extends Controller
{
    public function index()
    {
        $supplierReport = StockProduct::with('supplier')
            ->selectRaw('supplier_id, COUNT(*) as jumlah_pembelian, SUM(stock_quantity) as total_obat')
            ->groupBy('supplier_id')
            ->paginate(10);

        return inertia('Admin/ReportSupplier/Index', [
            'supplierReport' => $supplierReport
        ]);
    }
}
