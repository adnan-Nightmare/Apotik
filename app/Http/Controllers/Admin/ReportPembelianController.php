<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\StockProduct;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportPembelianController extends Controller
{
    public function index(){
        return Inertia::render('Admin/ReportPembelian/Index', [
            'pembelianProducts' => []
        ]);
    }

    public function generate(Request $request)
    {
        // Validasi input tanggal mulai dan tanggal akhir
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $startDateTime = $request->start_date . ' 00:00:00';
        $endDateTime   = $request->end_date   . ' 23:59:59';

        // Tampilkan halaman awal dengan transactions yang sudah difilter.
        return Inertia::render('Admin/ReportPembelian/Index', [
            'pembelianProducts' => Inertia::defer(function () use ($startDateTime, $endDateTime) {
                return StockProduct::with(['medicines', 'supplier'])
                    ->whereBetween('received_at', [$startDateTime, $endDateTime])
                    ->orderBy('received_at', 'desc')
                    ->get();
            }),
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
        ]);
    }
}
