<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\PersediaanObatRequest;
use App\Models\kategori;
use App\Models\medicines as medicine;
use App\Models\satuan;
use App\Traits\ImageHandlerTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PersediaanObat extends Controller
{
    use ImageHandlerTrait;

    /**
     * Tampilkan daftar obat.
     *
     * @return \Inertia\Response
     */
    public function index() {
        // Ambil data obat beserta relasi kategori dan satuan obat.
        // Jika ada pencarian 'q', filter berdasarkan nama obat.
        // Data diurutkan berdasarkan waktu terbaru (latest), lalu dipaginasi (10 per halaman).

        $obats = medicine::with(['kategori', 'satuan'])
            ->when(request()->q, function ($query) {
                $query->where('nama_obat', 'like', '%' . request()->q . '%');
            })
            ->latest()
            ->paginate(5);

        // Kirim data produk ke komponen Inertia 'Admin/PersediaanObat/Index'.
        return inertia('Admin/PersediaanObat/Index', [
            'obats' => $obats
        ]);
    }

    /**
     * Tampilkan form untuk membuat obat baru.
     *
     * @return \Inertia\Response
     */
    public function create(){
        // ambil semua kategori dan satuan obat dari database
        $kategori = kategori::all();
        $satuan = satuan::all();

        // Kirim data kategori dan unit ke komponen Inertia 'Admin/PersedianObat/Create'.
        return inertia('Admin/PersediaanObat/Create', [
            'kategori' => $kategori,
            'satuan' => $satuan
        ]);
    }

    public function store(PersediaanObatRequest $request){
        // Inisialisasi nama gambar sebagai null (default tidak ada gambar).
        $imageName = null;

        // Jika ada file gambar yang diunggah, simpan gambar di folder 'obats' dan dapatkan nama file.
        if($request->hasFile('gambar_obat')){
            $imageName = $this->uploadImage($request->file('gambar_obat'), 'obats');
        }

        // Buat obat baru dengan data yang telah divalidasi, sertakan nama gambar jika ada.
        medicine::create(array_merge(
            $request->validated(),
            ['gambar_obat' => $imageName]
        ));

        // Arahkan pengguna kembali ke halaman daftar persedian-obat dengan pesan sukses.
        return redirect()->route('admin.medicine.index');
    }

    /**
     * Tampilkan form untuk mengedit obat tertentu.
     */
    public function edit($id)
    {
        $obat = medicine::findOrFail($id);

        // Ambil semua kategori dan satuan obat dari database.
        $kategori = kategori::all();
        $satuan = satuan::all();

        // Kirim data obat, kategori, dan satuan ke komponen Inertia 'Admin/PersediaanObat/Edit'.
        return inertia('Admin/PersediaanObat/Edit', [
            'obat' => $obat,
            'kategori' => $kategori,
            'satuan' => $satuan
        ]);
    }

    /**
     * Perbarui data obat dalam database.
     */
    public function update(PersediaanObatRequest $request, medicine $medicine)
    {
        // Jika ada file gambar baru yang diunggah, perbarui gambar dan hapus gambar lama.
        if ($request->hasFile('gambar_obat')) {
            $medicine->gambar_obat = $this->updateImage($medicine->gambar_obat, $request->file('gambar_obat'), 'obats');
        }

        // Perbarui data obat dengan data yang diterima dari permintaan.
        $medicine->nama_obat = $request->nama_obat;
        $medicine->harga = $request->harga;
        $medicine->kategori_id = $request->kategori_id;
        $medicine->satuan_id = $request->satuan_id;
        $medicine->stok = $request->stok;
        $medicine->nomor_batch = $request->nomor_batch;
        $medicine->kadaluarsa = $request->kadaluarsa;
        $medicine->save();

        // Arahkan pengguna kembali ke halaman daftar obat dengan pesan sukses.
        return redirect()->route('admin.medicine.index');
    }

    /**
     * Hapus produk dari database.
     */
    public function destroy(medicine $medicine){
        //jika obat memiliki gambar, hapus gambar dari folder 'obats' di disk 'public'.
        if ($medicine->gambar_obat) {
            Storage::disk('public')->delete('obats/' . $medicine->gambar_obat);
        }

        // Hapus data obat dari database.
        $medicine->delete();

        // Arahkan pengguna kembali ke halaman sebelumnya dengan pesan sukses.
        return back();
    }
}
