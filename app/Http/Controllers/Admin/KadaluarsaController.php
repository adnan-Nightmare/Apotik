<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\StockProduct;
use Carbon\Carbon;

class KadaluarsaController extends Controller
{
    public function index(){
         // Ambil data obat beserta relasi kategori dan satuan obat.
        // Jika ada pencarian 'q', filter berdasarkan nama obat.
        // Data diurutkan berdasarkan waktu terbaru (latest), lalu dipaginasi (10 per halaman).

        $obats = StockProduct::with('medicines')->whereDate('kadaluarsa', '>=', Carbon::today())->whereDate('kadaluarsa', '<=', Carbon::today()->addDays(30))->orderBy('kadaluarsa', 'asc')->latest()->paginate(5);

        // Sertakan parameter pencarian dalam link paginasi
        $obats->appends(['q' => request()->q]);

        return inertia('Admin/Kadaluarsa/Index',[
            'obats' => $obats
        ]);
    }
}
