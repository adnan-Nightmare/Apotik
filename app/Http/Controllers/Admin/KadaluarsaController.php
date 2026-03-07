<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\KadaluarsaRequest;
use App\Models\StockProduct;
use App\Models\StockTotal;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class KadaluarsaController extends Controller
{
    public function index(){
         // Ambil data obat beserta relasi kategori dan satuan obat.
        // Jika ada pencarian 'q', filter berdasarkan nama obat.
        // Data diurutkan berdasarkan waktu terbaru (latest), lalu dipaginasi (10 per halaman).

        $obats = StockProduct::with('medicines')->whereDate('kadaluarsa', '<=', Carbon::today()->addDays(30))->orderBy('kadaluarsa', 'asc')->latest()->paginate(5);

        // Sertakan parameter pencarian dalam link paginasi
        $obats->appends(['q' => request()->q]);

        return inertia('Admin/Kadaluarsa/Index',[
            'obats' => $obats
        ]);
    }

    public function show(){
        $obats = StockProduct::with('medicines')->whereDate('kadaluarsa', '<=', Carbon::today()->addDays(30))->orderBy('kadaluarsa', 'asc')->latest()->paginate(5);

        return inertia('Admin/Kadaluarsa/Hapus', [
            'obats' => $obats
        ]);
    }

    public function store(KadaluarsaRequest $request){
        // Mulai transaksi database untuk memastikan konsistensi data
        DB::beginTransaction();

        try {
            // Cari StockProduct berdasarkan ID yang diberikan. Jika tidak ditemukan, akan melemparkan ModelNotFoundException
            $stockProduct = StockProduct::findOrFail($request->product_id);

            // Cari StockTotal yang terkait dengan product_id dari StockProduct
            $stockTotal = StockTotal::where('medicines_id', $stockProduct->medicines_id)->first();

            if ($stockTotal) {
                // Kurangi total_stock dengan stock_quantity dari StockProduct yang akan dihapus
                $stockTotal->total_stock -= $stockProduct->stock_quantity;

                // Pastikan total_stock tidak menjadi negatif
                if ($stockTotal->total_stock < 0) {
                    $stockTotal->total_stock = 0;
                }

                // Simpan perubahan pada StockTotal
                $stockTotal->save();
            }

            // Hapus record StockProduct dari database
            $stockProduct->delete();

            // Commit transaksi jika semua operasi berhasil
            DB::commit();

            // Kembali ke daftar product stock dengan pesan sukses
            return redirect()->route('kadaluarsa.index');
        } catch (\Exception $e) {
            // Rollback transaksi jika terjadi kesalahan
            DB::rollBack();

            // Kembali ke daftar product stock dengan pesan error
            return redirect()->route('admin.kadaluarsa.index');
        }
    }
}
