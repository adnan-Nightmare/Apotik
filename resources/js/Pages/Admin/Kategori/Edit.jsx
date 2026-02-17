import { Link, useForm, usePage } from "@inertiajs/react";
import AdminLayout from "../../../Layouts/AdminLayout";
import Swal from "sweetalert2";

const kategoriEdit = () => {
    const { kategori } = usePage().props;
    const { data, setData, put, processing, errors } = useForm({
        nama_kategori: kategori.nama_kategori || "",
        deskripsi: kategori.deskripsi || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        put(`/admin/kategori/${kategori.id}`, {
            onSuccess: () => {
                Swal.fire({
                    title: "Success!",
                    text: "Category updated successfully!",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                });
            },
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
                        <li className="breadcrumb-item">Kategori obat</li>
                        <li
                            className="breadcrumb-item active"
                            aria-current="page"
                        >
                            Edit
                        </li>
                    </ol>
                </nav>

                <h1 className="mb-3 h3">Edit kategori obat</h1>

                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="mb-3 col-md-6">
                            <label for="namaObat" className="form-label">
                                Nama Kategori
                                <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                className={`form-control ${
                                    errors.nama_kategori ? "is-invalid" : ""
                                }`}
                                id="namaObat"
                                value={data.nama_kategori}
                                onChange={(e) =>
                                    setData("nama_kategori", e.target.value)
                                }
                                name="nama_kategori"
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="mb-3 col-md-6">
                            <label for="deskripsi" className="form-label">
                                Deskripsi
                            </label>
                            <textarea
                                className={`form-control ${
                                    errors.deskripsi ? "is-invalid" : ""
                                }`}
                                id="deskripsi"
                                rows="3"
                                name="deskripsi"
                                value={data.deskripsi}
                                onChange={(e) =>
                                    setData("deskripsi", e.target.value)
                                }
                            ></textarea>
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
                                    <i className="fa fa-save"></i> Edit
                                </>
                            )}
                        </button>
                        <Link
                            href="/admin/kategori"
                            className="btn border px-4"
                        >
                            Kembali
                        </Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default kategoriEdit;
