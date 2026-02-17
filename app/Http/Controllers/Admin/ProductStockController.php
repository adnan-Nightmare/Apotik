<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductStockRequest;
use App\Models\medicines;
use App\Models\StockProduct;
use App\Models\StockTotal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductStockController extends Controller
{
    public function index()
    {
        // Ambil data StockProduct beserta relasi product.
        $productStocks = StockProduct::with(['medicines'])
            ->when(request()->q, function ($query) {
                $query->whereHas('medicine', function ($q) {
                    $q->where('name', 'like', '%' . request()->q . '%');
                });
            })
            ->latest()
            ->paginate(5);

        // Sertakan parameter pencarian 'q' di link paginasi
        $productStocks->appends(['q' => request()->q]);

        // Kembalikan data ke komponen Inertia 'Admin/ProductStocks/Index'
        return inertia('Admin/ProductStocks/Index', [
            'productStocks' => $productStocks,
        ]);
    }

    public function create()
    {
        // Ambil semua produk (beserta stok total).
        $products = medicines::with('stockTotal')->get();

        // Kembalikan ke Inertia 'Admin/ProductStocks/Create' dengan data produk
        return inertia('Admin/ProductStocks/Create', [
            'products' => $products,
        ]);
    }

    public function store(ProductStockRequest $request)
    {
        // Mulai transaksi database
        DB::beginTransaction();

        try {
            // Buat record StockProduct baru berdasarkan data yang divalidasi
            $stockProduct = StockProduct::create($request->validated());

            // Cari atau buat StockTotal untuk product_id terkait
            $stockTotal = StockTotal::firstOrCreate(
                ['medicines_id' => $stockProduct->medicines_id],
                ['total_stock' => 0]
            );

            // Tambahkan stok sesuai quantity yang diterima
            $stockTotal->total_stock += $stockProduct->stock_quantity;
            $stockTotal->save();

            // Commit transaksi jika semua operasi berhasil
            DB::commit();

            // Kembali ke daftar product stock dengan pesan sukses
            return redirect()->route('admin.stock.index');
        } catch (\Exception $e) {
            // Rollback transaksi jika terjadi kesalahan
            DB::rollBack();

            // Kembali ke daftar product stock dengan pesan error
            return redirect()->route('admin.stock.index');
        }
    }

    public function destroy($id)
    {
        // Mulai transaksi database untuk memastikan konsistensi data
        DB::beginTransaction();

        try {
            // Cari StockProduct berdasarkan ID yang diberikan. Jika tidak ditemukan, akan melemparkan ModelNotFoundException
            $stockProduct = StockProduct::findOrFail($id);

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
            return redirect()->route('stock.index');
        } catch (\Exception $e) {
            // Rollback transaksi jika terjadi kesalahan
            DB::rollBack();

            // Kembali ke daftar product stock dengan pesan error
            return redirect()->route('admin.stock.index');
        }
    }
}
