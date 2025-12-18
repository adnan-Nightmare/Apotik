<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryRequest;
use App\Models\kategori;
use Illuminate\Http\Request;

class KategoriController extends Controller
{
    /**
     * Tampilkan daftar Kategori.
     *
     * @return \Inertia\Response
     */
    public function index(){
        // Ambil data kategori, jika ada parameter pencarian 'q', filter berdasarkan nama
        $kategoris = kategori::when(request()->q, function($query) {
            return $query->where('nama_kategori', 'like', '%' . request()->q . '%');
        })->latest()->paginate(10); // Ambil kategori terbaru, 5 data per halaman

        // Sertakan parameter pencarian dalam link paginasi
        $kategoris->appends(['q' => request()->q]);


        return inertia('Admin/Kategori/Index', [
            'kategoris' => $kategoris
        ]);
    }

    /**
     * Tampilkan form untuk membuat kategori baru.
     *
     * @return \Inertia\Response
     */
    public function create(){
        return inertia('Admin/Kategori/Create');
    }

    /**
     * Simpan kategori baru ke dalam database.
     */
    public function store(CategoryRequest $request){
        // Validasi input dan simpan kategori baru
        kategori::create($request->validated());

        // Arahkan kembali ke halaman kategori
        return redirect()->route('admin.kategori.index');
    }

    /**
     * Tampilkan form untuk mengedit kategori tertentu.
     */
    public function edit($id){
        $kategori = kategori::findOrFail($id);

        return inertia('Admin/Kategori/Edit', [
            'kategori' => $kategori
        ]);
    }

    /**
     * Perbarui kategori yang sudah ada di database.
     */
    public function update(CategoryRequest $request, kategori $kategori){
        // Validasi dan perbarui data kategori
        $kategori->update($request->validated());

        // Arahkan kembali ke halaman kategori
        return redirect()->route('admin.kategori.index');
    }

    /**
     * Hapus kategori dari database.
     */
    public function destroy($id){
        // Ambil kategori berdasarkan ID, error jika tidak ditemukan
        $kategori = kategori::findOrFail($id);

        // Hapus kategori dari database
        $kategori->delete();

        // Arahkan kembali ke daftar kategori dengan pesan sukses
        return redirect()->route('admin.kategori.index');
    }
}
