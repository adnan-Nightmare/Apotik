import { Link, router, usePage } from "@inertiajs/react";
import AdminLayout from "../../../Layouts/AdminLayout";
import Swal from "sweetalert2";
import hasAnyPermission from "../../../utils/hasAnyPermission";
import Pagination from "../../../Components/Pagination";

const Index = () => {
    const { roles } = usePage().props;

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
                router.delete(`/admin/roles/${id}`, {
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
                        <li className="breadcrumb-item">Roles</li>
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
                            <h1 className="h3">Roles</h1>
                            {hasAnyPermission(["roles.index"]) && (
                                <Link
                                    href="/admin/roles/create"
                                    className="btn btn-primary"
                                >
                                    <i className="bi bi-plus-circle-fill me-2"></i>
                                    Tambah User
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                <div className="card border rounded">
                    <div className="card-body p-0">
                        <div className="table-responsive pb-2">
                            <table className="table align-middle">
                                <thead className="table-light text-white">
                                    <tr>
                                        <th scope="col" className="text-center">
                                            No.
                                        </th>
                                        <th scope="col">Nama role</th>
                                        <th scope="col">Permission</th>
                                        <th scope="col" className="text-center">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {roles.data.map((role, index) => (
                                        <tr key={role.id}>
                                            <td width={50} className="text-center">
                                                {index +
                                                    1 +
                                                    (roles.current_page - 1) *
                                                        roles.per_page}
                                            </td>
                                            <td width={100}>{role.name}</td>
                                            <td>
                                                <div className="d-flex flex-wrap gap-1">
                                                    {role.permissions.map(
                                                        (permission, i) => (
                                                            <span
                                                                key={i}
                                                                className="badge text-bg-primary"
                                                            >
                                                                {
                                                                    permission.name
                                                                }
                                                            </span>
                                                        )
                                                    )}
                                                </div>
                                            </td>
                                            <td
                                                width={160}
                                                className="text-center"
                                            >
                                                {hasAnyPermission([
                                                    "roles.edit",
                                                ]) && (
                                                    <Link
                                                        href={`/admin/roles/${role.id}/edit`}
                                                        className="btn btn-outline-primary btn-sm me-2 rounded"
                                                    >
                                                        <i className="bi bi-pencil-fill"></i>{" "}
                                                        Edit
                                                    </Link>
                                                )}
                                                {hasAnyPermission([
                                                    "roles.delete",
                                                ]) && (
                                                    <button
                                                        className="btn btn-outline-danger btn-sm rounded"
                                                        onClick={() =>
                                                            handleDelete(
                                                                role.id
                                                            )
                                                        }
                                                    >
                                                        <i className="bi bi-trash-fill"></i>{" "}
                                                        Delete
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <Pagination links={roles.links} />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Index;
