import { Link, router, usePage } from "@inertiajs/react";
import AdminLayout from "../../../Layouts/AdminLayout";
import { useState } from "react";
import Swal from "sweetalert2";
import Pagination from "../../../Components/Pagination";
import hasAnyPermission from "../../../utils/hasAnyPermission";

const Index = () => {
    const { satuans } = usePage().props;
    const [filterText, setFilterText] = useState("");

    const filteredsatuan = satuans.data.filter((satuan) =>
        satuan.nama_satuan.toLowerCase().includes(filterText.toLowerCase())
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
                router.delete(`/admin/satuan/${id}`, {
                    onSuccess: () => {
                        Swal.fire(
                            "Dihapus!",
                            "Satuan telah dihapus.",
                            "success"
                        );
                        window.location.reload(); // Refresh halaman setelah berhasil menghapus
                    },
                    onError: () => {
                        Swal.fire(
                            "Error!",
                            "Terjadi masalah saat menghapus satuan.",
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
                        <li className="breadcrumb-item">Satuan obat</li>
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
                            <h1 className="h3">Satuan obat</h1>
                            {hasAnyPermission(["satuan.create"]) && (
                                <Link
                                    href="/admin/satuan/create"
                                    className="btn btn-primary"
                                >
                                    <i className="bi bi-plus-circle-fill me-2"></i>
                                    Tambah Satuan
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
                                                <th>Satuan</th>
                                                <th className="text-center">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredsatuan.length > 0 ? (
                                                filteredsatuan.map(
                                                    (satuan, index) => (
                                                        <tr key={satuan.id}>
                                                            <td className="text-center">
                                                                {index +
                                                                    1 +
                                                                    (satuans.current_page -
                                                                        1) *
                                                                        satuans.per_page}
                                                            </td>
                                                            <td>
                                                                {satuan.nama_satuan ||
                                                                    "Satuan obat tidak ada"}
                                                            </td>
                                                            <td className="text-center">
                                                                {hasAnyPermission(
                                                                    [
                                                                        "satuan.edit",
                                                                    ]
                                                                ) && (
                                                                    <Link
                                                                        href={`/admin/satuan/${satuan.id}/edit`}
                                                                        className="btn btn-outline-primary btn-sm me-2 rounded"
                                                                    >
                                                                        <i className="bi bi-pencil-fill"></i>{" "}
                                                                        Edit
                                                                    </Link>
                                                                )}
                                                                {hasAnyPermission(
                                                                    [
                                                                        "satuan.delete",
                                                                    ]
                                                                ) && (
                                                                    <button
                                                                        className="btn btn-outline-danger btn-sm rounded"
                                                                        onClick={() =>
                                                                            handleDelete(
                                                                                satuan.id
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
                                                        Tidak ada Satuan Obat
                                                        ditemukan
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <Pagination links={satuans.links} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Index;
