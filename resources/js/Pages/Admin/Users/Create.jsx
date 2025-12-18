import { Link, useForm, usePage } from "@inertiajs/react";
import AdminLayout from "../../../Layouts/AdminLayout";
import { useState } from "react";
import Swal from "sweetalert2";

const Create = () => {
    const { errors, roles } = usePage().props;

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] =
        useState(false);

    const { data, setData, post, processing, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        roles: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/admin/users", {
            onSuccess: () => {
                Swal.fire({
                    title: "Success!",
                    text: "User created successfully!",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                });
            },
            onError: () => {
                Swal.fire({
                    title: "Failed!",
                    text: "There was an error creating the user.",
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
                        <li className="breadcrumb-item">Users</li>
                        <li
                            className="breadcrumb-item active"
                            aria-current="page"
                        >
                            Tambah
                        </li>
                    </ol>
                </nav>

                <h1 className="mb-3 h3">Tambah User Baru</h1>

                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="mb-3 col-md-6">
                            <label for="namaObat" className="form-label">
                                Nama Panjang
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
                        <div className="mb-3 col-md-6">
                            <label for="email" className="form-label">
                                Email<span className="text-danger">*</span>
                            </label>
                            <input
                                className={`form-control ${
                                    errors.email ? "is-invalid" : ""
                                }`}
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="mb-3 col-md-6">
                            <label for="password" className="form-label">
                                Password
                                <span className="text-danger">*</span>
                            </label>
                            <div className="input-group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className={`form-control ${
                                        errors.password ? "is-invalid" : ""
                                    }`}
                                    value={data.password}
                                    id="password"
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                />
                                <span
                                    className="input-group-text"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    style={{ cursor: "pointer" }}
                                >
                                    <i
                                        className={
                                            showPassword
                                                ? "bi bi-eye-slash"
                                                : "bi bi-eye"
                                        }
                                    ></i>
                                </span>
                            </div>
                        </div>
                        <div className="mb-3 col-md-6">
                            <label
                                for="password_confirmation"
                                className="form-label"
                            >
                                konfirmasi Password
                                <span className="text-danger">*</span>
                            </label>
                            <div className="input-group">
                                <input
                                    type={
                                        showPasswordConfirmation
                                            ? "text"
                                            : "password"
                                    }
                                    className={`form-control ${
                                        errors.password_confirmation
                                            ? "is-invalid"
                                            : ""
                                    }`}
                                    value={data.password_confirmation}
                                    id="password_confirmation"
                                    onChange={(e) =>
                                        setData(
                                            "password_confirmation",
                                            e.target.value
                                        )
                                    }
                                />
                                <span
                                    className="input-group-text"
                                    onClick={() =>
                                        setShowPasswordConfirmation(
                                            !showPasswordConfirmation
                                        )
                                    }
                                    style={{ cursor: "pointer" }}
                                >
                                    <i
                                        className={
                                            showPassword
                                                ? "bi bi-eye-slash"
                                                : "bi bi-eye"
                                        }
                                    ></i>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Daftar checkbox untuk role */}
                    <div className="mb-3">
                        <label for="deskripsi" className="form-label">
                            Roles<span className="text-danger">*</span>
                        </label>
                        <div className="border rounded bg-white p-3">
                            {roles.map((role) => (
                                <div
                                    className="form-check form-check-inline"
                                    key={role.id}
                                >
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        value={role.name}
                                        checked={data.roles === role.name}
                                        onChange={(e) => setData("roles", e.target.value)}
                                        id={`perm-${role.id}`}
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor={`perm-${role.id}`}
                                    >
                                        {role.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                        {errors.roles && (
                            <div className="alert alert-danger mt-2">
                                {errors.roles}
                            </div>
                        )}
                    </div>

                    <div className="d-flex gap-3">
                        <button
                            className="btn btn-primary px-4"
                            disabled={processing}
                            type="submit"
                        >
                            Buat
                        </button>
                        <Link href="/admin/users" className="btn border px-4">
                            Kembali
                        </Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default Create;
