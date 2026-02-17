import { useState } from "react";
import AdminLayout from "../../../Layouts/AdminLayout";
import { Link, router, usePage } from "@inertiajs/react";
import Swal from "sweetalert2";
import Pagination from "../../../Components/Pagination";
import hasAnyPermission from "../../../utils/hasAnyPermission";

const Index = () => {
    const { users } = usePage().props;
    const [filterText, setFilterText] = useState("");

    const filteredUsers = users.data.filter(
        (user) =>
            user.name.toLowerCase().includes(filterText.toLowerCase()) ||
            user.email.toLowerCase().includes(filterText.toLowerCase())
    );

    const handleDelete = (id) => {
        Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Data ini akan dihapus secara permanen!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ya, hapus!",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/admin/users/${id}`, {
                    onSuccess: () => {
                        Swal.fire("Dihapus!", "Data telah dihapus.", "success");
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
                        <li className="breadcrumb-item">Users</li>
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
                            <h1 className="h3">Users</h1>
                            {hasAnyPermission(["users.create"]) && (
                                <Link
                                    href="/admin/users/create"
                                    className="btn btn-primary"
                                >
                                    <i className="bi bi-plus-circle-fill me-2"></i>
                                    Tambah User
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
                                                <th>Email</th>
                                                <th>Role</th>
                                                <th className="text-center">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredUsers.map(
                                                (user, index) => (
                                                    <tr key={user.id}>
                                                        <td className="text-center">
                                                            {index +
                                                                1 +
                                                                (users.current_page -
                                                                    1) *
                                                                    users.per_page}
                                                        </td>
                                                        <td>{user.name}</td>
                                                        <td>{user.email}</td>
                                                        <td>
                                                            {user.roles.map(
                                                                (role, i) => (
                                                                    <span
                                                                        key={i}
                                                                        className="badge text-uppercase bg-success me-2"
                                                                    >
                                                                        {
                                                                            role.name
                                                                        }
                                                                    </span>
                                                                )
                                                            )}
                                                        </td>
                                                        <td className="text-center">
                                                            {hasAnyPermission([
                                                                "users.edit",
                                                            ]) && (
                                                                <Link
                                                                    href={`/admin/users/${user.id}/edit`}
                                                                    className="btn btn-outline-primary btn-sm me-2 rounded"
                                                                >
                                                                    <i className="bi bi-pencil-fill"></i>{" "}
                                                                    Edit
                                                                </Link>
                                                            )}
                                                            {hasAnyPermission([
                                                                "users.delete",
                                                            ]) && (
                                                                <button
                                                                    className="btn btn-outline-danger btn-sm rounded"
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            user.id
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
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <Pagination links={users.links} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Index;
