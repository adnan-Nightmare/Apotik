import { Link, useForm, usePage } from "@inertiajs/react";
import AdminLayout from "../../../Layouts/AdminLayout";
import Swal from "sweetalert2";

const satuanCreate = () => {
    const { nama_app } = usePage().props;
    // Menginisialisasi form dengan useForm
    const { data, setData, post, processing, errors, reset } = useForm({
        nama_satuan: "",
    });

    // Fungsi handleSubmit untuk mengirim data kategori
    const handleSubmit = (e) => {
        e.preventDefault();
        post("/admin/satuan", {
            onSuccess: () => {
                Swal.fire({
                    title: "Success!",
                    text: "Satuan Obat Berhasil ditambahkan!",
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
        <AdminLayout app_name={nama_app}>
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
                            Tambah
                        </li>
                    </ol>
                </nav>

                <h1 className="mb-3 h3">Tambah satuan obat</h1>

                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="mb-3 col-md-6">
                            <label for="namaSatuan" className="form-label">
                                Nama satuan obat
                                <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                className={`form-control ${
                                    errors.nama_satuan ? "is-invalid" : ""
                                }`}
                                id="namaSatuan"
                                value={data.nama_satuan}
                                onChange={handleChange}
                                name="nama_satuan"
                            />
                        </div>
                    </div>
                    <div className="d-flex gap-3">
                        <button
                            className="btn btn-primary px-4"
                            disabled={processing}
                            type="submit"
                        >
                            Buat
                        </button>
                        <Link href="/admin/satuan" className="btn border px-4">
                            Kembali
                        </Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default satuanCreate;
