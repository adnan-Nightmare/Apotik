<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\StockProduct;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index()
    {
        // Ambil data obat beserta relasi kategori dan satuan obat.
        // Jika ada pencarian 'q', filter berdasarkan nama obat.
        // Data diurutkan berdasarkan waktu terbaru (latest), lalu dipaginasi (10 per halaman).

        $obats = StockProduct::with('medicines')->latest()->paginate(5);

        // Sertakan parameter pencarian dalam link paginasi
        $obats->appends(['q' => request()->q]);
        // Tampilkan halaman awal dengan transactions kosong.
        return Inertia::render('Admin/Report/Index', [
            'obats' => $obats
        ]);
    }
}
