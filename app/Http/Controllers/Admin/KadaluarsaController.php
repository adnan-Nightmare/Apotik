<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\medicines;

class KadaluarsaController extends Controller
{
    public function index(){
         // Ambil data obat beserta relasi kategori dan satuan obat.
        // Jika ada pencarian 'q', filter berdasarkan nama obat.
        // Data diurutkan berdasarkan waktu terbaru (latest), lalu dipaginasi (10 per halaman).

        $obats = medicines::with(['kategori', 'satuan', 'stockTotal'])->latest()->paginate(5);

        return inertia('Admin/Kadaluarsa/Index',[
            'obats' => $obats
        ]);
    }
}
