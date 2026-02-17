import React, { useState } from "react";
import AdminLayout from "../../../Layouts/AdminLayout";
import { Link, usePage } from "@inertiajs/react";
import StatusBadge from "../../../Components/StatusBadget";
import hasAnyPermission from "../../../utils/hasAnyPermission";

const Index = () => {
    const { obats, status, today, threshold } = usePage().props;
    const [filterText, setFilterText] = useState("");

    console.log(obats);

    const calculateRemainingDays = (expDate) => {
        const exp = new Date(expDate);
        const now = new Date();
        const diffTime = exp - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    console.log(obats);

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
                                <div className="table-responsive pb-1">
                                    <table className="table align-middle table-hover">
                                        <thead className="table-light text-white">
                                            <tr>
                                                <th className="text-center">
                                                    No.
                                                </th>
                                                <th>Gambar</th>
                                                <th>Nama obat</th>
                                                <th>Nomor batch</th>
                                                <th>Stok</th>
                                                <th>Kadaluarsa</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {obats.data.length > 0 ? (
                                                obats.data.map(
                                                    (obat, index) => {
                                                        const sisaHari =
                                                            calculateRemainingDays(
                                                                obat.kadaluarsa,
                                                            );
                                                        const isKadaluarsa =
                                                            sisaHari <= 0;
                                                        const isHampir =
                                                            sisaHari >= 0 &&
                                                            sisaHari <= 30;
                                                        return (
                                                            <tr key={obat.id}>
                                                                <td className="text-center">
                                                                    {index +
                                                                        1 +
                                                                        (obats.current_page -
                                                                            1) *
                                                                            obats.per_page}
                                                                </td>
                                                                <td>
                                                                    <img
                                                                        src={`/storage/obats/${obat.gambar_obat}`}
                                                                        alt={
                                                                            obat.gambar_obat
                                                                        }
                                                                        width="50"
                                                                        height="50"
                                                                        style={{
                                                                            objectFit:
                                                                                "contain",
                                                                        }}
                                                                    />
                                                                </td>
                                                                <td>
                                                                    {obat.nama_obat ||
                                                                        "Nama tidak tersedia"}
                                                                </td>
                                                                <td>
                                                                    {obat.nomor_batch ||
                                                                        "Nomor batch tidak tersedia"}
                                                                </td>

                                                                <td>
                                                                    {obat.stock_total
                                                                        ? obat
                                                                              .stock_total
                                                                              .total_stock
                                                                        : 0}
                                                                </td>
                                                                <td>
                                                                    {obat.kadaluarsa ||
                                                                        "Tanggal kadaluarsa tidak tersedia"}
                                                                </td>
                                                                <td>
                                                                    <StatusBadge
                                                                        isKadaluarsa={
                                                                            isKadaluarsa
                                                                        }
                                                                        isHampir={
                                                                            isHampir
                                                                        }
                                                                        sisaHari={
                                                                            sisaHari
                                                                        }
                                                                    />
                                                                </td>
                                                            </tr>
                                                        );
                                                    },
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
