import React, { useEffect, useRef, useCallback, useState } from "react";
import { usePage, router, Link } from "@inertiajs/react";
import Swal from "sweetalert2";
import ReactToPrint from "react-to-print";

// Impor utilitas dan komponen
import { formatRupiah } from "../../../utils/formatRupiah";
import ProductList from "../../../Components/ProductList";
import Cart from "../../../Components/Cart";
import PaymentSection from "../../../Components/PaymentSection";
import CustomerSelector from "../../../Components/CustomerSelector";    
import Receipt from "../../../Components/Receipt";
import AdminLayout from "../../../Layouts/AdminLayout";

// Impor custom hook dan action untuk manajemen state
import useSalesReducer, {
    setSelectedCustomer,
    setSelectedProduct,
    setQuantity,
    setShowModal,
    setCartItems,
    setProducts,
    calculateSubtotal,
    filterProducts,
    resetSelections,
    setDiscount,
    setCash,
    setPaymentMethod,
    setSearchTerm,
    setShowReceiptModal,
    setShowSnapModal,
    setSelectedCategory,
    setChange,
} from "../../hook/useSalesReducer";

const Index = () => {
    // Props dari controller
    const {
        errors,
        auth,
        payment_link_url,
        nama_app,
        carts = [],
        categories = [],
        products = [],
        customers = [],
    } = usePage().props;

    // Inisialisasi reducer & state
    const { state, dispatch } = useSalesReducer();

    // Refs
    const componentRef = useRef();
    const reactToPrintRef = useRef();
    const isPayingRef = useRef(false);

    // Ref untuk input pencarian produk
    const searchInputRef = useRef(null);

    // State lokal
    const [transactionSnapshot, setTransactionSnapshot] = useState(null);
    const [showScanner, setShowScanner] = useState(false); // State untuk menampilkan scanner

    /*
   |--------------------------------------------------------------------------
   | Fungsi-fungsi Callback & Handler
   |--------------------------------------------------------------------------
   */

    // Menampilkan notifikasi menggunakan SweetAlert2
    const showAlert = useCallback((title, text, icon, options = {}) => {
        Swal.fire({
            title,
            text,
            icon,
            confirmButtonText: "OK",
            ...options,
        });
    }, []);

    // Menampilkan/Tutup modal Bootstrap
    const toggleModal = useCallback((modalId, show) => {
        const modalElement = document.getElementById(modalId);
        if (modalElement) {
            const modalInstance = show
                ? new window.bootstrap.Modal(modalElement)
                : window.bootstrap.Modal.getInstance(modalElement);
            show ? modalInstance.show() : modalInstance.hide();
        }
    }, []);

    // Handler perubahan input numerik (untuk discount, cash, quantity)
    const handleInputChange = (actionCreator) => (e) => {
        const value = e.target.value.replace(/[^\d]/g, ""); // hanya angka
        dispatch(actionCreator(value));
    };

    // Memilih produk dari daftar
    const handleSelectProduct = (product) => {
        dispatch(setSelectedProduct(product));
        dispatch(setShowModal(false));
    };

    // Menghapus item dari cart
    const handleDeleteProduct = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/admin/transaksi/delete-from-cart/${id}`, {
                    onSuccess: () => {
                        const updatedCart = state.cartItems.filter(
                            (item) => item.id !== id
                        );
                        dispatch(setCartItems(updatedCart));
                        showAlert(
                            "Deleted",
                            "Your items have been deleted.",
                            "warning",
                            {
                                toast: true,
                                position: "top-end",
                                showConfirmButton: false,
                                timer: 3000,
                            }
                        );
                    },
                    onError: () =>
                        showAlert("Error!", "Failed to delete items.", "error"),
                });
            }
        });
    };

    // Menambah produk ke cart
    const handleAddToCart = async (product = null) => {
        const selectedProduct = product || state.selectedProduct;

        // Validasi Produk
        if (!selectedProduct || !selectedProduct.id) {
            return showAlert("Error!", "Please select a product.", "error");
        }

        // Validasi Kuantitas
        const quantity = Number(state.quantity);
        if (!Number.isInteger(quantity) || quantity < 1) {
            return showAlert("Error!", "Quantity must be at least 1.", "error");
        }

        // Hitung Total Harga
        const totalPrice = Number(selectedProduct.harga) * quantity;

        // Persiapkan Data untuk Dikirim ke Server
        const newItem = {
            customer_id: state.selectedCustomer,
            medicines_id: selectedProduct.id,
            quantity: quantity,
            total_price: totalPrice,
        };

        try {
            await router.post("/admin/transaksi/add-product", newItem, {
                onSuccess: (page) => {
                    // Update Keranjang Belanja di State
                    console.log(page.props)
                    dispatch(setCartItems(page.props.carts || []));

                    // Reset Seleksi Produk dan Kuantitas
                    dispatch(resetSelections());

                    // Tampilkan Notifikasi Sukses
                    showAlert(
                        "Added!",
                        "Product has been added to cart.",
                        "success",
                        {
                            toast: true,
                            position: "top-end",
                            showConfirmButton: false,
                            timer: 3000,
                        }
                    );
                },
                onError: (error) => {
                    // Logging Error Detail
                    console.error("Add to cart error:", error);

                    // Ambil Pesan Error dari Respon Server
                    const message =
                        error.response?.data?.message ||
                        "Failed to add product to cart.";
                    showAlert("Error!", message, "error");
                },
            });
        } catch (error) {
            // Ambil Pesan Error dari Respon Server atau Tampilkan Pesan Umum
            const message =
                error.response?.data?.message ||
                "An error occurred while adding the product to cart.";
            showAlert("Error!", message, "error");
        }
    };

    // Mencetak struk
    const handlePrintReceipt = () => {
        setTimeout(() => reactToPrintRef.current?.handlePrint(), 100);
    };

    // Menangani respon dari pembayaran Snap
    const handleSnapResponse = (title, text, icon, success, callback) => {
        dispatch(setShowSnapModal(false));
        toggleModal("snapModal", false);
        showAlert(title, text, icon, {
            toast: icon === "success",
            position: icon === "success" ? "top-end" : "center",
            showConfirmButton: icon !== "success",
            timer: icon === "success" ? 3000 : undefined,
        });

        if (success) handlePrintReceipt(); // Cetak struk jika sukses
        if (callback) callback();

        // Reset status pembayaran jika gagal/cancel
        if (!success) isPayingRef.current = false;
    };

    // Memproses pembayaran
    const handleProcessPayment = async () => {
        const subTotal = state.subTotal;
        const discount = parseFloat(state.discount) || 0;
        const totalAmount = subTotal - discount;

        // Jika pembayaran tunai, pastikan cash >= totalAmount
        const cash =
            state.paymentMethod === "cash" ? parseFloat(state.cash) || 0 : null;

        if (state.paymentMethod === "cash" && cash < totalAmount) {
            return showAlert(
                "Uang Tunai Tidak Cukup!",
                "Jumlah uang tunai tidak boleh kurang dari jumlah total.",
                "error"
            );
        }

        // Simpan snapshot data transaksi (untuk cetak struk)
        const snapshot = {
            cartItems: [...state.cartItems],
            subTotal,
            discount,
            totalAmount,
            cash,
            change: state.change,
        };
        setTransactionSnapshot(snapshot);

        // Data untuk dikirim ke server
        const transactionData = {
            customer_id: state.selectedCustomer || null,
            total_amount: totalAmount,
            cash: cash,
            change: state.paymentMethod === "cash" ? state.change : null,
            discount: discount,
            cart_items: state.cartItems,
            payment_method: state.paymentMethod,
        };

        try {
            await router.post("/admin/transaksi/process-payment", transactionData, {
                onSuccess: (page) => {
                    const paymentRef = page.props.payment_link_url;

                    if (state.paymentMethod === "online" && paymentRef) {
                        // Jika pembayaran online, tampilkan modal Snap
                        console.log("awa")
                    } else if (state.paymentMethod === "cash") {
                        console.log("awa")
                        // 1. Tampilkan notifikasi bahwa payment sukses
                        showAlert(
                            "Payment Successful!",
                            "Transaction has been completed.",
                            "success",
                            {
                                toast: true,
                                position: "top-end",
                                showConfirmButton: false,
                                timer: 3000,
                            }
                        );

                        // 2. Tampilkan SweetAlert untuk konfirmasi cetak struk
                        Swal.fire({
                            title: "Cetak Struk?",
                            text: "Apakah Anda ingin mencetak struk sekarang?",
                            icon: "question",
                            showCancelButton: true,
                            confirmButtonText: "Yes, print it",
                            cancelButtonText: "No, later",
                        }).then((result) => {
                            if (result.isConfirmed) {
                                // Jika user menekan "Yes", tampilkan modal Receipt
                                dispatch(setShowReceiptModal(true));
                            }
                        });

                        dispatch(setCash(""));
                        dispatch(setChange(0));
                        dispatch(setDiscount(""));
                        dispatch(setQuantity(1));
                    } else {
                        // Jika ada metode lain, atau Anda ingin fallback ke logika sebelumnya
                        showAlert(
                            "Payment Successful!",
                            "Transaction has been completed.",
                            "success",
                            {
                                toast: true,
                                position: "top-end",
                                showConfirmButton: false,
                                timer: 3000,
                            }
                        );

                        // Tampilkan modal Receipt
                        dispatch(setShowReceiptModal(true));

                        // Reset state setelah sukses
                        dispatch(setCash(""));
                        dispatch(setChange(0));
                        dispatch(setDiscount(""));
                        dispatch(setQuantity(1));
                    }
                },
                onError: () =>
                    showAlert("Error!", "Failed to process payment.", "error"),
            });
        } catch {
            showAlert(
                "Error!",
                "An error occurred while processing the payment.",
                "error"
            );
        }
    };

    /*
   |--------------------------------------------------------------------------
   | useEffect Hooks
   |--------------------------------------------------------------------------
   */

    // Fokus pada input pencarian saat komponen dimuat
    useEffect(() => {
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, []);

    // Fokus kembali pada input pencarian setelah menutup modal produk
    useEffect(() => {
        if (!state.showModal) {
            if (searchInputRef.current) {
                searchInputRef.current.focus();
            }
        }
    }, [state.showModal]);

    // Tampilkan error quantity jika ada
    useEffect(() => {
        if (errors?.quantity) {
            showAlert("Error!", errors.quantity, "error");
        }
    }, [errors, showAlert]);

    // Filter produk saat kategori atau search term berubah
    useEffect(() => {
        dispatch(filterProducts());
    }, [state.selectedCategory, state.searchTerm, dispatch]);

    // Inisialisasi cart & produk + pasang script Midtrans
    useEffect(() => {
        dispatch(setCartItems(carts));
        dispatch(setProducts(products));

        const script = document.createElement("script");
        script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
        script.setAttribute(
            "data-client-key",
            "SB-Mid-client-e4Iyy7H3H7SuP5tb"
        );
        script.async = true;

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script); // Bersihkan script saat unmount
        };
    }, [carts, products, dispatch]);

    // Hitung subtotal setiap kali cartItems berubah
    useEffect(() => {
        dispatch(calculateSubtotal());
    }, [state.cartItems, dispatch]);

    // Hitung kembalian jika metode cash berubah (atau discount/subTotal berubah)
    useEffect(() => {
        if (state.paymentMethod === "cash") {
            const cashValue = parseFloat(state.cash) || 0;
            const discountValue = parseFloat(state.discount) || 0;
            const changeValue = cashValue - (state.subTotal - discountValue);
            dispatch(setChange(changeValue >= 0 ? changeValue : 0));
        } else {
            dispatch(setChange(0));
        }
    }, [
        state.cash,
        state.subTotal,
        state.discount,
        state.paymentMethod,
        dispatch,
    ]);

    // Buka modal Snap jika payment_link_url terisi
    useEffect(() => {
        if (payment_link_url && !isPayingRef.current) {
            dispatch(setShowSnapModal(true));
            toggleModal("snapModal", true);
        }
    }, [payment_link_url, dispatch, toggleModal]);

    // Jalankan Snap pay jika showSnapModal true
    useEffect(() => {
        if (state.showSnapModal) {
            if (payment_link_url && !isPayingRef.current) {
                isPayingRef.current = true;
                window.snap.pay(payment_link_url, {
                    onSuccess: () => {
                        handleSnapResponse(
                            "Payment Successful!",
                            "Transaction has been completed.",
                            "success",
                            true
                        );
                    },
                    onError: () => {
                        handleSnapResponse(
                            "Payment Failed",
                            "There was an issue processing your payment.",
                            "error",
                            false
                        );
                    },
                    onClose: () => {
                        handleSnapResponse(
                            "Payment Cancelled",
                            "Payment was cancelled.",
                            "info",
                            false,
                            () => {
                                router.visit("/admin/sales", { replace: true });
                            }
                        );
                    },
                });
            }
        }
    }, [state.showSnapModal, payment_link_url]);

    // Tampilkan error umum dari server jika ada
    useEffect(() => {
        if (errors?.errors?.length) {
            showAlert("Error!", errors.errors[0], "error");
        }
    }, [errors, showAlert]);

    // Loading simulasi (1 detik)
    useEffect(() => {
        const timer = setTimeout(
            () => dispatch({ type: "SET_LOADING", payload: false }),
            1000
        );
        return () => clearTimeout(timer);
    }, [dispatch]);

    // Cetak struk otomatis jika showReceiptModal === true & ada snapshot
    useEffect(() => {
        if (state.showReceiptModal && transactionSnapshot) {
            setTimeout(() => {
                handlePrintReceipt();
            }, 100);
        }
    }, [state.showReceiptModal, transactionSnapshot]);

    return (
        <AdminLayout noStyle={true}>
            <div className="row vh-100 g-0">
                <div className="col-md-8">
                    <div className="col-md-4 w-100 px-xxl-4 py-xxl-3">
                        <div className="d-flex align-items-center justify-content-between">
                            {/* Filter Kategori */}
                            <div className="col-md-3">
                                <label className="form-label">
                                    Filter by Category
                                </label>
                                <select
                                    className="form-select"
                                    onChange={(e) =>
                                        dispatch(
                                            setSelectedCategory(e.target.value)
                                        )
                                    }
                                    value={state.selectedCategory}
                                >
                                    <option value="">All Categories</option>
                                    {categories.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.nama_kategori}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Pencarian Produk */}
                            <div className="col-md-3">
                                <label className="form-label">
                                    Search Product
                                </label>
                                <div className="mb-3">
                                    <input
                                        id="search-product"
                                        type="text"
                                        className="form-control"
                                        placeholder="Search..."
                                        value={state.searchTerm}
                                        onChange={(e) =>
                                            dispatch(
                                                setSearchTerm(e.target.value)
                                            )
                                        }
                                        ref={searchInputRef}
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Daftar Produk */}
                        <ProductList
                            products={state.filteredProducts}
                            loading={state.loading}
                            onSelectProduct={handleSelectProduct}
                        />
                    </div>
                </div>

                <div className="col-md-4 bg-white border h-100 overflow-y-auto overflow-x-hidden">
                    {/* Pemilih Pelanggan */}
                    <CustomerSelector
                        customers={customers}
                        selectedCustomer={state.selectedCustomer}
                        onSelectCustomer={(value) =>
                            dispatch(setSelectedCustomer(value))
                        }
                        cashierName={auth.user.name}
                    />

                    {/* Pilih Produk dan Kuantitas */}
                    <div className="d-flex flex-column px-3">
                        {/* Kolom Kiri: Input "Select Product" dan "Quantity" */}
                        <label className="form-label">Select Product</label>
                        <div className="position-relative">
                            <input
                                className="form-control bg-light pe-5"
                                type="text"
                                placeholder="Click to select product"
                                aria-label="Select Product"
                                value={state.selectedProduct?.nama_obat || ""}
                                readOnly
    
                            />
               
                        </div>

                        <label className="form-label mt-2">Quantity</label>
                        <input
                            type="number"
                            className="form-control"
                            value={state.quantity}
                            onChange={handleInputChange(setQuantity)}
                            min="1"
                        />
                    </div>

                    {/* Kolom Kanan: Tombol Add Product */}
                    <div className=" d-flex align-items-end mt-3 px-3">
                        <button
                            id="add-product-button"
                            className="btn btn-success w-100 mt-md-0 py-md-6 btn-mobile-lg"
                            onClick={() => handleAddToCart()}
                        >
                            <i className="bi bi-cart-plus"></i> Add Product
                        </button>
                    </div>

                    <hr />

                    <div className="px-3">
                        <h6 className=" mb-4">Keranjang Belanja</h6>
                        <Cart
                            cartItem={state.cartItems}
                            onDelete={handleDeleteProduct}
                        />
                        <hr />
                        {/* Subtotal */}
                        <div className="d-flex justify-content-between align-items-center">
                            <label className="form-label mb-0">Sub Total</label>
                            <h5 className="fw-bold mb-0">
                                {formatRupiah(state.subTotal)}
                            </h5>
                        </div>
                    </div>

                    <hr />
                    {/* Bagian Kanan - Pembayaran */}
                    <PaymentSection
                        discount={state.discount}
                        onDiscountChange={handleInputChange(setDiscount)}
                        subTotal={state.subTotal}
                        paymentMethod={state.paymentMethod}
                        onPaymentMethodChange={(e) =>
                            dispatch(setPaymentMethod(e.target.value))
                        }
                        cash={state.cash}
                        onCashChange={handleInputChange(setCash)}
                        change={state.change}
                        onProcessPayment={handleProcessPayment}
                    />

                    {/* Komponen Receipt (untuk dicetak) */}
                    {transactionSnapshot && (
                        <div style={{ display: "none" }}>
                            <Receipt
                                ref={componentRef}
                                cartItems={transactionSnapshot.cartItems}
                                subTotal={transactionSnapshot.subTotal}
                                discount={transactionSnapshot.discount}
                                totalAmount={transactionSnapshot.totalAmount}
                                cash={transactionSnapshot.cash}
                                change={transactionSnapshot.change}
                                nama_app={nama_app}
                            />
                        </div>
                    )}

                    {/* Modal Cetak Struk */}
                    {state.showReceiptModal && transactionSnapshot && (
                        <div
                            className="modal fade show"
                            style={{ display: "block" }}
                            tabIndex="-1"
                        >
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                    <ReactToPrint
                                        content={() => componentRef.current}
                                        onAfterPrint={() => {
                                            dispatch(
                                                setShowReceiptModal(false)
                                            );
                                            dispatch(setCartItems([]));
                                            setTransactionSnapshot(null);
                                            router.get(
                                                "/admin/transaksi",
                                                {},
                                                { replace: true }
                                            );
                                        }}
                                        ref={reactToPrintRef}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default Index;
