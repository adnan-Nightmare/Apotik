<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\medicines;
use Carbon\Carbon;
use Illuminate\Http\Request;

class KadaluarsaController extends Controller
{
    public function index(Request $request){
        $obats = medicines::when(request()->q, function ($query) {
                $query->where('nama_obat', 'like', '%' . request()->q . '%');
            })
            ->latest()
            ->paginate(10);
        

        return inertia('Admin/Kadaluarsa/Index', [
            'obats' => $obats,
        ]);
    }
}
