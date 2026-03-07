<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\StockProduct;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index()
    {
        // Tampilkan halaman awal dengan transactions kosong.
        return Inertia::render('Admin/Report/Index', [
            'obats' => []
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
        return Inertia::render('Admin/Report/Index', [
            'obats' => Inertia::defer(function () use ($startDateTime, $endDateTime) {
                return StockProduct::with('medicines')
                    ->whereBetween('kadaluarsa', [$startDateTime, $endDateTime])
                    ->orderBy('kadaluarsa', 'desc')
                    ->get();
            }),
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
        ]);
    }
}
