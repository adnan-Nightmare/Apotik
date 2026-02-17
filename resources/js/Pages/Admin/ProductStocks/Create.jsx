import { Link, useForm, usePage } from "@inertiajs/react";
import AdminLayout from "../../../Layouts/AdminLayout";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";

const productStockCreate = () => {
    const { products } = usePage().props;
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const { data, setData, post, processing, reset, errors } = useForm({
        medicines_id: selectedProduct?.id || "",
        stock_quantity: 0,
    });

    console.log("Products:", data);

    useEffect(() => {
        if (products.length > 0) {
            setIsLoading(false);
        }
    }, [products]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (selectedSupplier && selectedSupplier.status === "inactive") {
            Swal.fire({
                title: "Warning!",
                text: "Supplier yang dipilih tidak aktif. Apakah Anda ingin melanjutkan?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, continue",
                cancelButtonText: "No, cancel",
            }).then((result) => {
                if (result.isConfirmed) {
                    post("/admin/stock", {
                        onSuccess: () => {
                            Swal.fire({
                                title: "Success!",
                                text: "Product stock created successfully!",
                                icon: "success",
                                showConfirmButton: false,
                                timer: 1500,
                            });
                            reset();
                        },
                    });
                }
            });
        } else {
            post("/admin/stock", {
                onSuccess: () => {
                    Swal.fire({
                        title: "Success!",
                        text: "Product stock created successfully!",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1500,
                    });
                    reset();
                },
            });
        }
    };

    return (
        <AdminLayout>
            <div className="container-fluid">
                <nav
                    className="breadcrumb-nav"
                    style={{
                        "--bs-breadcrumb-divider": `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z' fill='%236c757d'/%3E%3C/svg%3E")`,
                    }}
                    aria-label="breadcrumb"
                >
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">Stok obat</li>
                        <li
                            className="breadcrumb-item active"
                            aria-current="page"
                        >
                            Tambah
                        </li>
                    </ol>
                </nav>

                <h1 className="mb-3 h3">Tambah stok obat</h1>

                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="mb-3 col-md-6">
                            <label for="namaObat" className="form-label">
                                Produk
                                <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="namaObat"
                                value={
                                    selectedProduct ? selectedProduct.nama_obat : ""
                                }
                                placeholder="Cari untuk produk"
                                readOnly
                                data-bs-toggle="modal"
                                data-bs-target="#productModal"
                            />
                            <input
                                type="hidden"
                                name="medicine_id"
                                value={data.medicine_id}
                                onChange={(e) =>
                                    setData("medicine_id", e.target.value)
                                }
                            />
                        </div>
                        {errors.medicine_id && <div className="alert alert-danger mt-2">{errors.medicine_id}</div>}
                    </div>
                    <div className="row">
                        <div className="mb-3 col-md-6">
                            <label for="deskripsi" className="form-label">
                                Stock Quantity
                            </label>
                            <input
                                type="text"
                                className={`form-control ${
                                    errors.stock_quantity ? "is-invalid" : ""
                                }`}
                                id="stock_quantity"
                                value={data.stock_quantity}
                                onChange={(e) =>
                                    setData("stock_quantity", e.target.value)
                                }
                                name="stock_quantity"
                            />
                        </div>
                    </div>
                    <div className="d-flex gap-3">
                        <button
                            className="btn btn-primary px-4"
                            disabled={processing}
                            type="submit"
                        >
                            {processing ? (
                                <>
                                    <div
                                        className="spinner-border spinner-border-sm text-light me-2"
                                        role="status"
                                    >
                                        <span className="visually-hidden">
                                            Loading...
                                        </span>
                                    </div>
                                    loading...
                                </>
                            ) : (
                                <>
                                    <i className="fa fa-save"></i> Buat
                                </>
                            )}
                        </button>
                        <Link
                            href="/admin/stock"
                            className="btn border px-4"
                        >
                            Kembali
                        </Link>
                    </div>
                </form>
            </div>

            {/* Modal for Product Selection */}
            <div
                className="modal fade"
                id="productModal"
                tabIndex="-1"
                aria-labelledby="productModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="productModalLabel">
                                Pilih Produk
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            {isLoading ? (
                                <div className="d-flex justify-content-center">
                                    <div
                                        className="spinner-border text-primary"
                                        role="status"
                                    >
                                        <span className="visually-hidden">
                                            Loading...
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="table-responsive p-4">
                                    <table className="table align-middle">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Nama</th>
                                                <th>Harga</th>
                                                <th>Stok</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {products.map((product) => (
                                                <tr key={product.id}>
                                                    <td>{product.nama_obat}</td>
                                                    <td>{product.harga}</td>
                                                    <td>
                                                        {product.stock_total
                                                            ?.total_stock || 0}
                                                    </td>
                                                    <td>
                                                        <button
                                                            onClick={() => {
                                                                setData(
                                                                    "medicines_id",
                                                                    product.id,
                                                                );
                                                                setSelectedProduct(
                                                                    product,
                                                                );
                                                            }}
                                                            className="btn btn-primary"
                                                            data-bs-dismiss="modal"
                                                        >
                                                            Select
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default productStockCreate;
