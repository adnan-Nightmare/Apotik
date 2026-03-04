<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\customer;
use App\Models\medicines;
use App\Models\StockProduct;
use App\Models\StockTotal;
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

        $stockProduct = StockProduct::all();

        // Total stok per kategori
        $stockTotals = StockTotal::with('medicines.kategori')->get();
        $groupedByCategory = $stockTotals->groupBy(fn($item) => optional($item->medicines->kategori)->nama_kategori);
        $categoryData = $groupedByCategory->map(fn($items, $cat) => [
            'category'    => $cat,
            'total_stock' => $items->sum('total_stock'),
            ])->values();

        // notif stock hampir habis dan habis
        $stockHabis = StockTotal::where('total_stock', 0)->get();
        $stockHampirHabis = StockTotal::where('total_stock', '>', 0)->where('total_stock', '<=', 20)->get();

        // notif hampir kadaluarsa dan kadaluarsa
        $sudahKadaluarsa = StockProduct::whereDate('kadaluarsa', '<=', Carbon::today())->get();
        $hampirKadaluarsa = StockProduct::whereDate('kadaluarsa', '>', Carbon::today())->whereDate('kadaluarsa', '<=', Carbon::today()->addDays(30))->get();

        // Kirim data ke Inertia
        return Inertia::render('Admin/Dashboard/Index', [
            'stats' => [
                'totalObat' => $totalObat,
                'totalCustomers'    => $totalCustomers,
                'totalTransactions' => $totalTransactions,
                'totalSales'        => $totalSales,
            ],
            'stockProduct' => $stockProduct,
            'transactionData' => $transactionData,
            'salesData'       => $salesData,
            'productsData'    => $productsData,
            'obats'    => $obat,
            'categoryData' => $categoryData,
            'notifs' => [
                [
                    'type' => 'warning',
                    'title' => 'Stok Hampir Habis!',
                    'message' => $stockHampirHabis->count() . ' inventori',
                    'data' => $stockHampirHabis
                ],
                [
                    'type' => 'error',
                    'title' => 'Stok Habis!',
                    'message' => $stockHabis->count() . ' inventori',
                    'data' => $stockHabis
                ],
                [
                    'type' => 'warning',
                    'title' => 'Segera Kadaluarsa!',
                    'message' => $hampirKadaluarsa->count() . ' batch',
                    'data' => $hampirKadaluarsa
                ],
                [
                    'type' => 'error',
                    'title' => 'Sudah Kadaluarsa!',
                    'message' => $sudahKadaluarsa->count() . ' batch',
                    'data' => $sudahKadaluarsa
                ],
            ]
        ]);
    }
}
