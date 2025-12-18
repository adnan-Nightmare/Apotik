<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PelangganController extends Controller
{
    /**
     * Tampilkan daftar customer.
     */
    public function index(){
        return inertia('Admin/Customer/Index');
    }

    /**
     * Tampilkan form untuk membuat customer baru.
     */
    public function create(){
        return inertia('Admin/Customer/Create');
    }
}
