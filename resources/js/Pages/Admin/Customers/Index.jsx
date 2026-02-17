import React, { useState } from "react";
import AdminLayout from "../../../Layouts/AdminLayout";
import { Link, router, usePage } from "@inertiajs/react";
import Swal from "sweetalert2";
import hasAnyPermission from "../../../utils/hasAnyPermission";
import Pagination from "../../../Components/Pagination";

const Index = () => {
    const { customers } = usePage().props;
    const [filterText, setFilterText] = useState("");

    // Filter customers based on search input
    const filteredCustomers = customers.data.filter(
        (customer) =>
            (customer.name &&
                customer.name
                    .toLowerCase()
                    .includes(filterText.toLowerCase())) ||
            (customer.phone &&
                customer.phone.toLowerCase().includes(filterText.toLowerCase()))
    );

    const handleDelete = (id) => {
        Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Data ini akan dihapus secara permanen!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya, hapus!",
        }).then((result) => {
            if (result.isConfirmed) {
                // Panggil route delete
                router.delete(`/admin/customers/${id}`, {
                    onSuccess: () => {
                        Swal.fire(
                            "Dihapus!",
                            "Customer telah dihapus.",
                            "success"
                        );
                        // Refresh halaman atau perbarui state jika diperlukan
                        window.location.reload(); // Refresh halaman
                    },
                    onError: () => {
                        Swal.fire(
                            "Error!",
                            "Terjadi masalah saat menghapus customer.",
                            "error"
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
                        <li className="breadcrumb-item">Pelanggan</li>
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
                            <h1 className="h3">Pelanggan</h1>
                            {hasAnyPermission(["customers.create"]) && (
                                <Link
                                    href="/admin/customers/create"
                                    className="btn btn-primary"
                                >
                                    <i className="bi bi-plus-circle-fill me-2"></i>
                                    Tambah Pelanggan
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="card border rounded">
                            <div className="card-body p-0">
                                <div className="d-flex justify-content-end align-items-center">
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
                                                <th>Nama</th>
                                                <th>Telepon</th>
                                                <th>Alamat</th>
                                                <th>Jenis Kelamin</th>
                                                <th className="text-center">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredCustomers.length > 0 ? (
                                                filteredCustomers.map(
                                                    (customer, index) => (
                                                        <tr key={customer.id}>
                                                            <td className="text-center">
                                                                {index +
                                                                    1 +
                                                                    (customers.current_page -
                                                                        1) *
                                                                        customers.per_page}
                                                            </td>
                                                            <td>
                                                                {customer.name ||
                                                                    "No name available"}
                                                            </td>
                                                            <td>
                                                                {customer.phone ||
                                                                    "No phone available"}
                                                            </td>
                                                            <td>
                                                                {customer.address ||
                                                                    "No address available"}
                                                            </td>
                                                            <td>
                                                                <span
                                                                    className={`badge ${
                                                                        customer.gender ===
                                                                        "male"
                                                                            ? "bg-primary"
                                                                            : customer.gender ===
                                                                              "female"
                                                                            ? "bg-danger"
                                                                            : "bg-secondary"
                                                                    }`}
                                                                >
                                                                    {customer.gender &&
                                                                    typeof customer.gender ===
                                                                        "string"
                                                                        ? customer.gender
                                                                              .charAt(
                                                                                  0
                                                                              )
                                                                              .toUpperCase() +
                                                                          customer.gender.slice(
                                                                              1
                                                                          )
                                                                        : "N/A"}
                                                                </span>
                                                            </td>
                                                            <td className="text-center">
                                                                {hasAnyPermission(
                                                                    [
                                                                        "customers.edit",
                                                                    ]
                                                                ) && (
                                                                    <Link
                                                                        href={`/admin/customers/${customer.id}/edit`}
                                                                        className="btn btn-outline-primary btn-sm me-2 rounded"
                                                                    >
                                                                        <i className="bi bi-pencil-fill"></i>{" "}
                                                                        Edit
                                                                    </Link>
                                                                )}
                                                                {hasAnyPermission(
                                                                    [
                                                                        "customers.delete",
                                                                    ]
                                                                ) && (
                                                                    <button
                                                                        className="btn btn-outline-danger btn-sm rounded"
                                                                        onClick={() =>
                                                                            handleDelete(
                                                                                customer.id
                                                                            )
                                                                        }
                                                                    >
                                                                        <i className="bi bi-trash-fill"></i>{" "}
                                                                        Delete
                                                                    </button>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    )
                                                )
                                            ) : (
                                                <tr>
                                                    <td
                                                        className="text-center"
                                                        colSpan="10"
                                                    >
                                                        Pelanggan tidak ditemukan
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <Pagination links={customers.links} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Index;
