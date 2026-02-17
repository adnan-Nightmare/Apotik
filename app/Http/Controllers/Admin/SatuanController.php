<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\SatuanRequest;
use App\Models\satuan;
use Illuminate\Http\Request;

class SatuanController extends Controller
{
    /**
     * Tampilkan daftar Satuan.
     *
     * @return \Inertia\Response
     */
    public function index(){
        // Ambil data kategori, jika ada parameter pencarian 'q', filter berdasarkan nama
        $satuans = satuan::when(request()->q, function($query) {
            return $query->where('nama_satuan', 'like', '%' . request()->q . '%');
        })->latest()->paginate(10); // Ambil kategori terbaru, 5 data per halaman

        // Sertakan parameter pencarian dalam link paginasi
        $satuans->appends(['q' => request()->q]);

        return inertia('Admin/SatuanObat/Index', [
            'satuans' => $satuans
        ]);
    }

        /**
     * Tampilkan form untuk membuat satuan baru.
     *
     * @return \Inertia\Response
     */
    public function create(){
        return inertia('Admin/SatuanObat/Create');
    }

    /**
     * Simpan satuan baru ke dalam database.
     */
    public function store(SatuanRequest $request){
        // Validasi input dan simpan satuan baru
        satuan::create($request->validated());

        // Arahkan kembali ke halaman satuan
        return redirect()->route('admin.satuan.index');
    }

    /**
     * Tampilkan form untuk mengedit satuan tertentu.
     */
    public function edit($id){
        $satuan = satuan::findOrFail($id);

        return inertia('Admin/SatuanObat/Edit', [
            'satuan' => $satuan
        ]);
    }

    /**
     * Perbarui satuan yang sudah ada di database.
     */
    public function update(SatuanRequest $request, satuan $satuan){
        $satuan->update($request->validated());

        // Arahkan kembali ke halaman satuan
        return redirect()->route('admin.satuan.index');
    }

    /**
     * Hapus satuan dari database.
     */
    public function destroy($id){
        // Ambil satuan berdasarkan ID, error jika tidak ditemukan
        $kategori = satuan::findOrFail($id);

        // Hapus satuan dari database
        $kategori->delete();

        // Arahkan kembali ke daftar satuan dengan pesan sukses
        return redirect()->route('admin.satuan.index');
    }
}
