import { Link, useForm } from "@inertiajs/react";
import AdminLayout from "../../../Layouts/AdminLayout";
import Swal from "sweetalert2";

const Edit = ({ customer    }) => {
    const { data, setData, put, processing, errors } = useForm({
        name: customer.name || "",
        phone: customer.phone || "",
        address: customer.address || "",
        email: customer.email || "",
        gender: customer.gender || "pria",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        put(`/admin/customers/${customer.id}`, {
            onSuccess: () => {
                Swal.fire({
                    title: "Success!",
                    text: "Customer updated successfully!",
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
                        <li className="breadcrumb-item">Pelanggan</li>
                        <li
                            className="breadcrumb-item active"
                            aria-current="page"
                        >
                            Edit
                        </li>
                    </ol>
                </nav>

                <h1 className="mb-3 h3">Edit Pelanggan</h1>

                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="mb-3 col-md-6">
                            <label for="nama_pelanggan" className="form-label">
                                Nama pelanggan
                                <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                className={`form-control ${
                                    errors.name ? "is-invalid" : ""
                                }`}
                                id="nama_pelanggan"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                            />
                        </div>
                        <div className="mb-3 col-md-6">
                            <label for="phone" className="form-label">
                                Nomor Telepon
                                <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                className={`form-control ${
                                    errors.phone ? "is-invalid" : ""
                                }`}
                                id="phone"
                                value={data.phone}
                                onChange={(e) =>
                                    setData("phone", e.target.value)
                                }
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="mb-3 col-md-6">
                            <label for="email" className="form-label">
                                Email
                            </label>
                            <input
                                type="email"
                                className={`form-control ${
                                    errors.email ? "is-invalid" : ""
                                }`}
                                id="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                            />
                        </div>
                        <div className="mb-3 col-md-6">
                            <label for="alamat" className="form-label">
                                Alamat
                            </label>
                            <input
                                type="text"
                                className={`form-control ${
                                    errors.address ? "is-invalid" : ""
                                }`}
                                id="alamat"
                                value={data.address}
                                onChange={(e) =>
                                    setData("address", e.target.value)
                                }
                            />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label for="gender" className="form-label">
                            Jenis Kelamin
                        </label>
                        <select
                            name="gender"
                            id="gender"
                            className="form-select"
                            value={data.gender}
                            onChange={(e) => setData("gender", e.target.value)}
                        >
                            <option value="pria">Pria</option>
                            <option value="wanita">Wanita</option>
                        </select>
                    </div>
                    <div className="d-flex gap-3">
                        <button className="btn btn-primary px-4" type="submit">
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
                            href="/admin/customers"
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

export default Edit;
