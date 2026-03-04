import { Link, router, usePage } from "@inertiajs/react";
import AdminLayout from "../../../Layouts/AdminLayout";
import { useState } from "react";
import Swal from "sweetalert2";
import Pagination from "../../../Components/Pagination";
import hasAnyPermission from "../../../utils/hasAnyPermission";

const Index = () => {
    const { suppliers } = usePage().props;
    const [filterText, setFilterText] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const filteredSuppliers = suppliers.data.filter(
        (supplier) =>
            (supplier.name.toLowerCase().includes(filterText.toLowerCase()) ||
                supplier.phone
                    .toLowerCase()
                    .includes(filterText.toLowerCase())) &&
            (statusFilter ? supplier.status === statusFilter : true),
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
                router.delete(`/admin/suppliers/${id}`, {
                    onSuccess: () => {
                        Swal.fire(
                            "Dihapus!",
                            "Supplier telah dihapus.",
                            "success",
                        );
                        window.location.reload(); // Refresh halaman setelah berhasil menghapus
                    },
                    onError: () => {
                        Swal.fire(
                            "Error!",
                            "Terjadi masalah saat menghapus supplier.",
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
                        <li className="breadcrumb-item">Suppliers</li>
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
                            <h1 className="h3">Suppliers</h1>
                            {hasAnyPermission(["suppliers.create"]) && (
                                <Link
                                    href="/admin/suppliers/create"
                                    className="btn btn-primary"
                                >
                                    <i className="bi bi-plus-circle-fill me-2"></i>
                                    Tambah Supplier
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12">
                        <div className="card border rounded">
                            <div className="card-body p-0">
                                <div className="d-flex justify-content-end gap-2 align-items-center">
                                    <select
                                        className="form-select w-25"
                                        value={statusFilter}
                                        onChange={(e) =>
                                            setStatusFilter(e.target.value)
                                        }
                                    >
                                        <option value="">All Statuses</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">
                                            Inactive
                                        </option>
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
                                                <th>Name</th>
                                                <th>Phone</th>
                                                <th>Address</th>
                                                <th>Status</th>
                                                <th className="text-center">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredSuppliers.length > 0 ? (
                                                filteredSuppliers.map(
                                                    (supplier, index) => (
                                                        <tr key={supplier.id}>
                                                            <td className="text-center">
                                                                {index +
                                                                    1 +
                                                                    (suppliers.current_page -
                                                                        1) *
                                                                        suppliers.per_page}
                                                            </td>
                                                            <td>
                                                                {supplier.name ||
                                                                    "Supplier tidak ada"}
                                                            </td>
                                                            <td>
                                                                {supplier.phone ||
                                                                    "-"}
                                                            </td>
                                                            <td>
                                                                {supplier.address ||
                                                                    "-"}
                                                            </td>
                                                            <td>
                                                                <span
                                                                    className={`badge ${
                                                                        supplier.status ===
                                                                        "active"
                                                                            ? "bg-success"
                                                                            : "bg-secondary"
                                                                    }`}
                                                                >
                                                                    {supplier.status
                                                                        .charAt(
                                                                            0,
                                                                        )
                                                                        .toUpperCase() +
                                                                        supplier.status.slice(
                                                                            1,
                                                                        )}
                                                                </span>
                                                            </td>
                                                            <td className="text-center">
                                                                {hasAnyPermission(
                                                                    [
                                                                        "suppliers.edit",
                                                                    ],
                                                                ) && (
                                                                    <Link
                                                                        href={`/admin/suppliers/${supplier.id}/edit`}
                                                                        className="btn btn-outline-primary btn-sm me-2 rounded"
                                                                    >
                                                                        <i className="bi bi-pencil-fill"></i>{" "}
                                                                        Edit
                                                                    </Link>
                                                                )}
                                                                {hasAnyPermission(
                                                                    [
                                                                        "suppliers.delete",
                                                                    ],
                                                                ) && (
                                                                    <button
                                                                        className="btn btn-outline-danger btn-sm rounded"
                                                                        onClick={() =>
                                                                            handleDelete(
                                                                                supplier.id,
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
                                                        Tidak ada supplier
                                                        ditemukan
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <Pagination links={suppliers.links} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Index;
