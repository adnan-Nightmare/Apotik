import { Link, useForm, usePage } from "@inertiajs/react";
import AdminLayout from "../../../Layouts/AdminLayout";
import Swal from "sweetalert2";

const kategoriCreate = () => {
    // Menginisialisasi form dengan useForm
    const { data, setData, post, processing, errors, reset } = useForm({
        nama_kategori: "",
        deskripsi: "",
    });

    // Fungsi handleSubmit untuk mengirim data kategori
    const handleSubmit = (e) => {
        e.preventDefault();
        post("/admin/kategori", {
            onSuccess: () => {
                Swal.fire({
                    title: "Success!",
                    text: "Category created successfully!",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                });
                reset(); // Reset form setelah berhasil
            },
        });
    };

    // Fungsi handleChange untuk menangani perubahan pada input form
    const handleChange = (e) => {
        setData(e.target.name, e.target.value);
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
                            Tambah
                        </li>
                    </ol>
                </nav>

                <h1 className="mb-3 h3">Tambah kategori obat</h1>

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
                                onChange={handleChange}
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
                                onChange={handleChange}
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
                                    <i className="fa fa-save"></i> Buat
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

export default kategoriCreate;
