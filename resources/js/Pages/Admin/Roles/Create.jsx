import { Link, useForm, usePage } from "@inertiajs/react";
import AdminLayout from "../../../Layouts/AdminLayout";
import Swal from "sweetalert2";

const Create = () => {
    // Ambil data errors dan permissions dari props (hasil inertia)
    const { errors, permissions } = usePage().props;

    // Inisialisasi data form
    const { data, setData, post, processing, reset } = useForm({
        name: "",
        permissions: [],
    });

    // Handler ketika checkbox di-check/uncheck
    const handlePermissionChange = (e) => {
        const { value, checked } = e.target;
        const permId = parseInt(value);

        setData(
            "permissions",
            checked
                ? [...data.permissions, permId]
                : data.permissions.filter((id) => id !== permId)
        );
    };

    // Handler submit form
    const handleSubmit = (e) => {
        e.preventDefault();
        post("/admin/roles", {
            onSuccess: () => {
                Swal.fire({
                    title: "Berhasil!",
                    text: "Role baru berhasil dibuat.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                });
            },
            onError: () => {
                Swal.fire({
                    title: "Gagal!",
                    text: "Terjadi kesalahan saat membuat role.",
                    icon: "error",
                    showConfirmButton: true,
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
                        <li className="breadcrumb-item">Roles</li>
                        <li
                            className="breadcrumb-item active"
                            aria-current="page"
                        >
                            Tambah
                        </li>
                    </ol>
                </nav>

                <h1 className="mb-3 h3">Tambah Role Baru</h1>

                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="mb-3 col-md-6">
                            <label for="namaObat" className="form-label">
                                Nama Role
                                <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                className={`form-control ${
                                    errors.name ? "is-invalid" : ""
                                }`}
                                id="namaObat"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                            />
                        </div>
                    </div>

                    {/* Daftar checkbox untuk permission */}
                    <div className="mb-3">
                        <label for="deskripsi" className="form-label">
                            Permissions<span className="text-danger">*</span>
                        </label>
                        <div className="border rounded bg-white p-3">
                            {permissions.map((permission) => (
                                <div
                                    className="form-check form-check-inline"
                                    key={permission.id}
                                >
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        value={permission.id}
                                        onChange={handlePermissionChange}
                                        id={`perm-${permission.id}`}
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor={`perm-${permission.id}`}
                                    >
                                        {permission.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                        {errors.permissions && (
                            <div className="alert alert-danger mt-2">
                                {errors.permissions}
                            </div>
                        )}
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
                                    Loading...
                                </>
                            ) : (
                                <>
                                    Tambah
                                </>
                            )}
                        </button>
                        <Link href="/admin/roles" className="btn border px-4">
                            Kembali
                        </Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default Create;
