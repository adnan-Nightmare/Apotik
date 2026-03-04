<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\StockProduct;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportPembelianController extends Controller
{
    public function index(){
        $pembelianProducts = StockProduct::with(['medicines', 'supplier'])->latest()->paginate(5);

        $pembelianProducts->appends(['q' => request()->q]);
        
        return Inertia::render('Admin/ReportPembelian/Index', [
            'pembelianProducts' => $pembelianProducts
        ]);
    }
}
