<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\medicines;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportStokController extends Controller
{
    public function index()
    {
        $laporanStok = medicines::with(['kategori', 'satuan', 'stockTotal', 'stockProduct'])
            ->when(request()->q, function ($query) {
                $query->where('nama_obat', 'like', '%' . request()->q . '%');
            })
            ->latest()
            ->paginate(5);
        return Inertia::render('Admin/ReportStok/Index', [
            'laporanStok' => $laporanStok
        ]);
    }
}
