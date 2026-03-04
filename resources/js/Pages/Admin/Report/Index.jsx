import { useState } from "react";
import AdminLayout from "../../../Layouts/AdminLayout";
import { Deferred, router, usePage } from "@inertiajs/react";
import PaginationReport from "../../../Components/PaginationReport";
import hasAnyPermission from "../../../utils/hasAnyPermission";
import Pagination from "../../../Components/Pagination";
import StatusBadge from "../../../Components/StatusBadget";

const Index = () => {
    const { obats, status, today, threshold } = usePage().props;
    const [filterText, setFilterText] = useState("");

    const calculateRemainingDays = (expDate) => {
        const exp = new Date(expDate);
        const now = new Date();
        const diffTime = exp - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    return (
        <AdminLayout>
            <div className="container-fluid">
                <h3>Laporan Kadaluarsa</h3>

                <div className="row mt-3">
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
                                                                        src={`/storage/obats/${obat.medicines.gambar_obat}`}
                                                                        alt={
                                                                            obat
                                                                                .medicines
                                                                                .gambar_obat
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
                                                                    {obat
                                                                        .medicines
                                                                        .nama_obat ||
                                                                        "Nama tidak tersedia"}
                                                                </td>
                                                                <td>
                                                                    {obat.nomor_batch ||
                                                                        "Nomor batch tidak tersedia"}
                                                                </td>

                                                                <td>
                                                                    {obat.stock_quantity ||
                                                                        0}
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
                                                        Tidak ada laporan
                                                        kadaluarsa ditemukan
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <Pagination links={obats.links} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Index;
