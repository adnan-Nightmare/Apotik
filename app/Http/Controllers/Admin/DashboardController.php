<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\customer;
use App\Models\medicines;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {   
        // Statistik utama
        $totalSales = Transaction::where('status', 'success')->sum('total_amount');
        $totalTransactions  = Transaction::count();
        $totalCustomers     = customer::count();
        $totalObat = medicines::count();

        // Total transaksi per status
        $transactionData = Transaction::select('status', DB::raw('COUNT(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        // Penjualan per tanggal (status success)
        $salesData = Transaction::whereIn('status', ['success'])
            ->select(
                DB::raw('DATE(transaction_date) as date'),
                DB::raw('SUM(total_amount) as total')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get();


        // produk terlaris
        $productsData = TransactionDetail::with('medicines')
            ->select('medicines_id', DB::raw('SUM(quantity) as total_quantity'))
            ->groupBy('medicines_id')
            ->orderByDesc('total_quantity')
            ->limit(5)
            ->get()
            ->map(function ($detail) {
                return [
                    'name'           => $detail->medicines->nama_obat ?? 'Unknown',
                    'total_quantity' => $detail->total_quantity,
                ];
            });

        // Ambil semua data obat
        $obat = medicines::all();

        // Total stok per kategori
        $stockTotals = medicines::with('kategori')->get();
        $groupedByCategory = $stockTotals->groupBy(fn($item) => optional($item->kategori)->nama_kategori);
        $categoryData = $groupedByCategory->map(fn($items, $cat) => [
            'category'    => $cat,
            'total_stock' => $items->sum('stok'),
            ])->values();

        // Kirim data ke Inertia
        return Inertia::render('Admin/Dashboard/Index', [
            'stats' => [
                'totalObat' => $totalObat,
                'totalCustomers'    => $totalCustomers,
                'totalTransactions' => $totalTransactions,
                'totalSales'        => $totalSales,
            ],
            'transactionData' => $transactionData,
            'salesData'       => $salesData,
            'productsData'    => $productsData,
            'obats'    => $obat,
            'categoryData' => $categoryData
        ]);
    }
}
