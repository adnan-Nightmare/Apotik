<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class LaporanController extends Controller
{
    public function index() {
        // Ambil data obat beserta relasi kategori dan satuan obat.
        // Jika ada pencarian 'q', filter berdasarkan nama obat.
        // Data diurutkan berdasarkan waktu terbaru (latest), lalu dipaginasi (10 per halaman).

        // $obats = medicines::with(['kategori', 'satuan'])
        //     ->when(request()->q, function ($query) {
        //         $query->where('nama_obat', 'like', '%' . request()->q . '%');
        //     })
        //     ->latest()
        //     ->paginate(10);

        // // Kirim data produk ke komponen Inertia 'Admin/PersediaanObat/Index'.
        return inertia('Admin/Transaksi/Index', 
        //     'obats' => $obats
        );
    } 
}
