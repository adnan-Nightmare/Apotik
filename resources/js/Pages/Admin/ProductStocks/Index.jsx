import { Link, router, usePage } from "@inertiajs/react";
import AdminLayout from "../../../Layouts/AdminLayout";
import { useState } from "react";
import Swal from "sweetalert2";
import Pagination from "../../../Components/Pagination";
import hasAnyPermission from "../../../utils/hasAnyPermission";

const Index = () => {
    const { productStocks = { data: [] }, suppliers = [] } = usePage().props;
    const [filterText, setFilterText] = useState("");
    const [selectedSupplier, setSelectedSupplier] = useState("");

    const filteredStocks = productStocks.data.filter(
        (stock) =>
            stock.supplier.name
                .toLowerCase()
            .includes(filterText.toLowerCase()) &&
            (selectedSupplier
                ? stock.supplier.id === parseInt(selectedSupplier)
                : true)
    );

    const handleDelete = (id) => {
        Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Anda tidak akan bisa mengembalikannya lagi!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya, hapus!",
        }).then((result) => {
            if (result.isConfirmed) {
                // Panggil route delete
                router.delete(`/admin/stock/${id}`, {
                    onSuccess: () => {
                        Swal.fire(
                            "Dihapus!",
                            "Kategori telah dihapus.",
                            "success",
                        );
                        window.location.reload(); // Refresh halaman setelah berhasil menghapus
                    },
                    onError: () => {
                        Swal.fire(
                            "Error!",
                            "Terjadi masalah saat menghapus kategori.",
                            "error",
                        );
                    },
                });
            }
        });
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
                        <li className="breadcrumb-item">Pembelian Obat</li>
                        <li
                            className="breadcrumb-item active"
                            aria-current="page"
                        >
                            Daftar
                        </li>
                    </ol>
                </nav>
                <div className="row mb-3">
                    <div className="col-md-12">
                        <div className="d-flex justify-content-between align-items-center">
                            <h1 className="h3">Pembelian Obat</h1>
                            {hasAnyPermission(["stock.create"]) && (
                                <Link
                                    href="/admin/stock/create"
                                    className="btn btn-primary"
                                >
                                    <i className="bi bi-plus-circle-fill me-2"></i>
                                    Beli obat
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12">
                        <div className="card border rounded">
                            <div className="card-body p-0">
                                <div className="d-flex justify-content-end align-items-center gap-3">
                                    <select
                                        className="form-select w-auto"
                                        value={selectedSupplier}
                                        onChange={(e) =>
                                            setSelectedSupplier(e.target.value)
                                        }
                                    >
                                        <option value="">Semua Supplier</option>
                                        {suppliers.map((supplier) => (
                                            <option
                                                key={supplier.id}
                                                value={supplier.id}
                                            >
                                                {supplier.name}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        type="text"
                                        className="form-control my-2 me-2 w-25"
                                        placeholder="Search"
                                        value={filterText}
                                        onChange={(e) =>
                                            setFilterText(e.target.value)
                                        }
                                    />
                                </div>
                                <div className="table-responsive pb-1">
                                    <table className="table align-middle table-hover">
                                        <thead className="table-light text-white">
                                            <tr>
                                                <th className="text-center">
                                                    No.
                                                </th>
                                                <th>Nomor Batch</th>
                                                <th>Nama Obat</th>
                                                <th>Nama Supplier</th>
                                                <th>Jumlah Stok</th>
                                                <th>Kadaluarsa</th>
                                                <th>Tanggal Diterima</th>
                                                <th className="text-center">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredStocks.length > 0 ? (
                                                filteredStocks.map(
                                                    (stock, index) => (
                                                        <tr key={stock.id}>
                                                            <td className="text-center">
                                                                {index +
                                                                    1 +
                                                                    (productStocks.current_page -
                                                                        1) *
                                                                        productStocks.per_page}
                                                            </td>
                                                            <td>
                                                                {stock.nomor_batch ||
                                                                    "N/A"}
                                                            </td>
                                                            <td>
                                                                {stock.medicines
                                                                    .nama_obat ||
                                                                    "Obat tidak ada"}
                                                            </td>
                                                            <td>
                                                                {stock.supplier
                                                                    .name ||
                                                                    "Supplier tidak ada"}
                                                            </td>
                                                            <td>
                                                                {stock.stock_quantity ||
                                                                    "0"}
                                                            </td>
                                                            <td>
                                                                {stock.kadaluarsa ||
                                                                    "N/A"}
                                                            </td>
                                                            <td>
                                                                {stock.received_at ||
                                                                    "N/A"}
                                                            </td>
                                                            <td className="text-center">
                                                                {hasAnyPermission(
                                                                    [
                                                                        "stock.delete",
                                                                    ],
                                                                ) && (
                                                                    <button
                                                                        className="btn btn-outline-danger btn-sm rounded"
                                                                        onClick={() =>
                                                                            handleDelete(
                                                                                stock.id,
                                                                            )
                                                                        }
                                                                    >
                                                                        <i className="bi bi-trash-fill"></i>{" "}
                                                                        Delete
                                                                    </button>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ),
                                                )
                                            ) : (
                                                <tr>
                                                    <td
                                                        className="text-center"
                                                        colSpan="10"
                                                    >
                                                        Tidak ada stok obat
                                                        ditemukan
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <Pagination links={productStocks.links} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Index;
