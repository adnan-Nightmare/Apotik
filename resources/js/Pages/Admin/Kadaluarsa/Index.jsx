import React, { useState } from "react";
import AdminLayout from "../../../Layouts/AdminLayout";
import { Link, usePage } from "@inertiajs/react";
import StatusBadge from "../../../Components/StatusBadget";

const Index = () => {
    const { obats, status, today, threshold } = usePage().props;
    const [filterText, setFilterText] = useState("");

    const filteredObats = obats.data.filter((obat) =>
        obat.nama_obat.toLowerCase().includes(filterText.toLowerCase()) ||
        obat.nomor_batch.toLowerCase().includes(filterText.toLowerCase())
    );
    console.log(filteredObats);
 

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
                        <li className="breadcrumb-item">Kadaluarsa</li>
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
                            <h1 className="h3">Kadaluarsa</h1>
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
                                                <th>Nama obat</th>
                                                <th>Nomor batch</th>
                                                <th>Stok</th>
                                                <th>Kadaluarsa</th>
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
                                                            sisaHari < 0;
                                                        const isHampir =
                                                            sisaHari >= 0 &&
                                                            sisaHari <= 30;

                                                        if (
                                                            isKadaluarsa ||
                                                            isHampir
                                                        ) {
                                                            return (
                                                                <tr
                                                                    key={
                                                                        obat.id
                                                                    }
                                                                >
                                                                    <td className="text-center">
                                                                        {index +
                                                                            1 +
                                                                            (obats.current_page -
                                                                                1) *
                                                                                obats.per_page}
                                                                    </td>
                                                                    <td>
                                                                        {obat.nama_obat ||
                                                                            "obat tidak ada"}
                                                                    </td>
                                                                    <td>
                                                                        {obat.nomor_batch ||
                                                                            "-"}
                                                                    </td>
                                                                    <td>
                                                                        {obat.stok ||
                                                                            "-"}
                                                                    </td>
                                                                    <td>
                                                                        {obat.kadaluarsa ||
                                                                            "-"}
                                                                    </td>
                                                                    <td>
                                                                        
                                                                    </td>
                                                                    <td className="text-center">
                                                                        <Link
                                                                            href={`/admin/obat/edit/${obat.id}`}
                                                                            className="btn btn-outline-primary btn-sm me-2 rounded"
                                                                        >
                                                                            <i className="bi bi-pencil-fill"></i>{" "}
                                                                            Edit
                                                                        </Link>
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
                                                                    </td>
                                                                </tr>
                                                            );
                                                        }
                                                    }
                                                )
                                            ) : (
                                                <tr>
                                                    <td
                                                        className="text-center"
                                                        colSpan="10"
                                                    >
                                                        Tidak ada obat obat
                                                        ditemukan
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                {/* <Pagination links={obats.links} /> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Index;
