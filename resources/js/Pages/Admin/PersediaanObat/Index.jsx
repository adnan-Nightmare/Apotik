import React, { useState } from "react";
import AdminLayout from "../../../Layouts/AdminLayout";
import { Link, router, usePage } from "@inertiajs/react";
import Pagination from "../../../Components/Pagination";
import Swal from "sweetalert2";
import StatusBadge from "../../../Components/StatusBadget";
import hasAnyPermission from "../../../utils/hasAnyPermission";

const Index = () => {
    const { obats } = usePage().props;
    const [filterText, setFilterText] = useState("");

    const filteredObats = obats.data.filter(
        (obat) =>
            obat.nama_obat.toLowerCase().includes(filterText.toLowerCase()) ||
            obat.nomor_batch.toLowerCase().includes(filterText.toLowerCase())
    );

    const calculateRemainingDays = (expDate) => {
        const exp = new Date(expDate);
        const now = new Date();
        const diffTime = exp - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "Apakah kamu yakin?",
            text: "Kamu tidak akan dapat membatalkan ini!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya, hapus ini!",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/admin/medicine/${id}`, {
                    onSuccess: () => {
                        Swal.fire("Deleted!", "Obat telah dihapus.", "success");
                        window.location.reload();
                    },
                    onError: () => {
                        Swal.fire(
                            "Error!",
                            "Ada masalah saat menghapus kategori.",
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
                        <li className="breadcrumb-item">Persediaan obat</li>
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
                            <h1 className="h3">Persediaan obat</h1>
                            {hasAnyPermission(["persediaan-obat.index"]) && (
                                <Link
                                    href="/admin/medicine/create"
                                    className="btn btn-primary"
                                >
                                    <i className="bi bi-plus-circle-fill me-2"></i>
                                    Tambah Obat
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
                                                <th>Gambar</th>
                                                <th>Nama obat</th>
                                                <th>Nomor batch</th>
                                                <th>Kategori</th>
                                                <th>Satuan</th>
                                                <th>Stok</th>
                                                <th>Harga</th>
                                                <th>kadaluarsa</th>
                                                <th>Status</th>
                                                <th className="text-center">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredObats.length > 0 ? (
                                                filteredObats.map(
                                                    (obat, index) => {
                                                        const sisaHari =
                                                            calculateRemainingDays(
                                                                obat.kadaluarsa
                                                            );
                                                        const isKadaluarsa =
                                                            sisaHari <= 0;
                                                        const isHampir =
                                                            sisaHari >= 0 &&
                                                            sisaHari <= 30;
                                                        return (
                                                            <tr key={obat.id}>
                                                                <td className="text-center">
                                                                    {index +
                                                                        1 +
                                                                        (obats.current_page -
                                                                            1) *
                                                                            obats.per_page}
                                                                </td>
                                                                <td>
                                                                    <img
                                                                        src={`/storage/obats/${obat.gambar_obat}`}
                                                                        alt={
                                                                            obat.gambar_obat
                                                                        }
                                                                        width="50"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    {obat.nama_obat ||
                                                                        "Nama tidak tersedia"}
                                                                </td>
                                                                <td>
                                                                    {obat.nomor_batch ||
                                                                        "Nomor batch tidak tersedia"}
                                                                </td>
                                                                <td>
                                                                    {obat
                                                                        .kategori
                                                                        .nama_kategori ||
                                                                        "Tidak ada kategori obat"}
                                                                </td>
                                                                <td>
                                                                    {obat.satuan
                                                                        .nama_satuan ||
                                                                        "Tidak ada satuan obat"}
                                                                </td>
                                                                <td>
                                                                    {obat.stok ||
                                                                        "Gambar tidak ada"}
                                                                </td>
                                                                <td>
                                                                    {obat.harga
                                                                        ? "Rp " +
                                                                          obat.harga
                                                                        : "Gambar tidak ada"}
                                                                </td>
                                                                <td>
                                                                    {obat.kadaluarsa ||
                                                                        "Gambar tidak ada"}
                                                                </td>
                                                                <td>
                                                                    <StatusBadge
                                                                        isKadaluarsa={
                                                                            isKadaluarsa
                                                                        }
                                                                        isHampir={
                                                                            isHampir
                                                                        }
                                                                        sisaHari={
                                                                            sisaHari
                                                                        }
                                                                    />
                                                                </td>
                                                                <td className="text-center">
                                                                    {hasAnyPermission(
                                                                        [
                                                                            "persediaan-obat.edit",
                                                                        ]
                                                                    ) && (
                                                                        <Link
                                                                            href={`/admin/medicine/${obat.id}/edit`}
                                                                            className="btn btn-outline-primary btn-sm me-2 rounded"
                                                                        >
                                                                            <i className="bi bi-pencil-fill"></i>{" "}
                                                                            Edit
                                                                        </Link>
                                                                    )}
                                                                    {hasAnyPermission(
                                                                        [
                                                                            "persediaan-obat.delete",
                                                                        ]
                                                                    ) && (
                                                                        <button
                                                                            className="btn btn-outline-danger btn-sm rounded"
                                                                            onClick={() =>
                                                                                handleDelete(
                                                                                    obat.id
                                                                                )
                                                                            }
                                                                        >
                                                                            <i className="bi bi-trash-fill"></i>{" "}
                                                                            Delete
                                                                        </button>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        );
                                                    }
                                                )
                                            ) : (
                                                <tr>
                                                    <td
                                                        className="text-center"
                                                        colSpan="10"
                                                    >
                                                        Tidak ada obat ditemukan
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <Pagination links={obats.links} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Index;
