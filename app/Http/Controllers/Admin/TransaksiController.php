<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\customer;
use App\Models\kategori;
use App\Models\medicines;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TransaksiController extends Controller
{
    /**
     * Menampilkan halaman transaksi dan data terkait.
     */
    public function index(Request $request)
    {
        $userId = Auth::id();

        $orderId = $request->input('order_id');
        $statusCode = $request->input('status_code');
        $transactionStatus = $request->input('transaction_status');

        if ($orderId && $statusCode && $transactionStatus) {

            $transaction = Transaction::where('invoice', $orderId)->first();

            if ($transaction) {

                if ($statusCode == 200 && $transactionStatus == 'settlement') {
                    $transaction->status = 'success';
                } elseif ($transactionStatus == 'pending') {
                    $transaction->status = 'pending';
                } elseif ($transactionStatus == 'failed') {
                    $transaction->status = 'failed';
                }
                $transaction->save();
            }


            return redirect()->route('admin.sales.index');
        }

        $products = medicines::all();
        $customers = customer::all();
        $categories  = kategori::all();

        $carts = Cart::with('medicines')
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'medicines_id' => $item->medicines_id,
                    'name' => $item->medicines->nama_obat,
                    'quantity' => $item->quantity,
                    'total_price' => $item->total_price,
                    'selling_price' => $item->medicines->harga,
                ];
            });

        $payment_link_url = $request->input('payment_link_url', null);

        return inertia('Admin/Transaksi/Index', [
            'customers' => $customers,
            'products' => $products,
            'categories' => $categories,
            'carts' => $carts,
            'payment_link_url' => $payment_link_url,
        ]);
    }

    /**
     * Menambahkan produk ke keranjang dengan validasi stok.
     */

    public function addProductToCart(Request $request)
    {
        $validatedData = $request->validate([
            'customer_id' => 'nullable|exists:customers,id',
            'medicines_id' => 'required|exists:medicines,id',
            'quantity' => 'required|integer|min:1',
            'total_price' => 'required|numeric|min:1000',
        ]);

        $userId = Auth::id();
        $customerId = $validatedData['customer_id'] ?? null;


        if (!$userId) {
            return redirect()->route('login');
        }

        $productStock = medicines::where('id', $validatedData['medicines_id'])->value('stok');
        if ($productStock === 0) {
            return redirect()->back()->withErrors(['quantity' => 'Stok produk masih 0.']);
        }

        $cartQuantity = Cart::where('user_id', $userId)
            ->where('medicines_id', $validatedData['medicines_id'])
            ->sum('quantity');
        $newQuantity = $cartQuantity + $validatedData['quantity'];


        if ($newQuantity > $productStock) {
            return redirect()->back()->withErrors(['quantity' => 'Kuantitas melebihi stok yang tersedia. Stok saat ini: ' . $productStock]);
        }

        $cartItem = Cart::where('user_id', $userId)
            ->where('medicines_id', $validatedData['medicines_id'])
            ->first();


        if ($cartItem) {
            if ($customerId && $cartItem->customer_id !== $customerId) {
                $cartItem->customer_id = $customerId;
            }
            $cartItem->quantity += $validatedData['quantity'];
            $cartItem->total_price += $validatedData['total_price'];
            $cartItem->save();
        } else {

            Cart::create([
                'user_id' => $userId,
                'customer_id' => $customerId,
                'medicines_id' => $validatedData['medicines_id'],
                'quantity' => $validatedData['quantity'],
                'total_price' => $validatedData['total_price'],
            ]);
        }

        return redirect()->back();
    }

    /**
     * Memproses pembayaran cash dan menghapus cart jika proses berhasil.
     */
    public function processPayment(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'nullable|exists:customers,id',
            'total_amount' => 'required|numeric|min:0',
            'cash' => 'nullable|numeric|min:0',
            'change' => 'nullable|numeric|min:0',
            'cart_items' => 'required|array',
            'cart_items.*.medicines_id' => 'required|exists:medicines,id',
            'cart_items.*.quantity' => 'required|integer|min:1',
            'discount' => 'nullable|numeric',
            'payment_method' => 'required|in:cash,online',
        ]);


        $discount = $validated['discount'] ?? 0;
        $totalAmount = $validated['total_amount'];

        if ($discount > $totalAmount) {
            return redirect()->back()->withErrors([
                'discount' => 'Diskon tidak boleh melebihi total belanja'
            ]);
        }

        $userId = Auth::id();

        DB::transaction(function () use ($validated, &$snapToken, $userId) {

            $transaction = Transaction::create([
                'customer_id' => $validated['customer_id'],
                'user_id' => $userId,
                'total_amount' => $validated['total_amount'],
                'cash' => $validated['payment_method'] === 'cash' ? $validated['cash'] : null,
                'change' => $validated['payment_method'] === 'cash' ? $validated['change'] : null,
                'discount' => $validated['discount'] ?? 0,
                'payment_method' => $validated['payment_method'],
                'status' => $validated['payment_method'] === 'online' ? 'pending' : 'success',
            ]);

            foreach ($validated['cart_items'] as $item) {
                $product = medicines::find($item['medicines_id']);
                // $stockTotal = StockTotal::where('product_id', $product->id)->first();

                if ($product->stok < $item['quantity']) {
                    return redirect()->back()->withErrors([
                        'quantity' => "Stok produk untuk {$product->nama_obat} tidak mencukupi. Stok saat ini: "
                            . ($product->stok ?? 0)
                    ]);
                }

                $product->stok -= $item['quantity'];
                $product->save();

                $transaction->transactionDetails()->create([
                    'medicines_id' => $item['medicines_id'],
                    'product_name' => $product->nama_obat,
                    'quantity' => $item['quantity'],
                    'subtotal' => $item['quantity'] * $product->harga,
                ]);
            }


            if ($validated['customer_id']) {
                Cart::where('user_id', $userId)
                    ->whereNull('customer_id')
                    ->update(['customer_id' => $validated['customer_id']]);

                Cart::where('customer_id', $validated['customer_id'])
                    ->where('user_id', $userId)
                    ->delete();
            } else {
                Cart::where('user_id', $userId)->delete();
            }
        });

        return redirect()->route('admin.transaksi.index');
    }


    /**
     * Menghapus item dari keranjang berdasarkan ID.
     */
    public function deleteFromCart($id)
    {
        $cartItem = Cart::find($id);
        if ($cartItem) {
            $cartItem->delete();
            return redirect()->back();
        }
        return redirect()->back();
    }
}
