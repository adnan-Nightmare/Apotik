import { useState } from "react";
import AdminLayout from "../../../Layouts/AdminLayout";
import { Deferred, router, usePage } from "@inertiajs/react";
import PaginationReport from "../../../Components/PaginationReport";
import hasAnyPermission from "../../../utils/hasAnyPermission";
import Pagination from "../../../Components/Pagination";

const Index = () => {
    const { supplierReport } = usePage().props;
    const [filterText, setFilterText] = useState("");
    const filteredSupplier = supplierReport.data.filter((supplier) =>
        supplier.supplier.name.toLowerCase().includes(filterText.toLowerCase()),
    );

    return (
        <AdminLayout>
            <div className="container-fluid">
                <h3>Laporan Supplier</h3>

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

                                <a
                                    href="/admin/export-supplier"
                                    className="btn btn-sm btn-primary mx-3"
                                >
                                    Export Excel
                                </a>
                                </div>
                                <div className="table-responsive pb-1">
                                    <table className="table align-middle table-hover">
                                        <thead className="table-light text-white">
                                            <tr>
                                                <th className="text-center">
                                                    No.
                                                </th>
                                                <th>Nama Supplier</th>
                                                <th>Jumlah Pembelian</th>
                                                <th>Total Obat</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredSupplier.length > 0 ? (
                                                filteredSupplier.map(
                                                    (supplier, index) => (
                                                        <tr key={supplier.id}>
                                                            <td className="text-center">
                                                                {index +
                                                                    1 +
                                                                    (supplierReport.current_page -
                                                                        1) *
                                                                        supplierReport.per_page}
                                                            </td>
                                                            <td>
                                                                {supplier
                                                                    .supplier
                                                                    .name ||
                                                                    "Nama tidak tersedia"}
                                                            </td>
                                                            <td>
                                                                {supplier.jumlah_pembelian ||
                                                                    0}
                                                            </td>
                                                            <td>
                                                                {supplier.total_obat ||
                                                                    0}
                                                            </td>
                                                        </tr>
                                                    ),
                                                )
                                            ) : (
                                                <tr>
                                                    <td
                                                        className="text-center"
                                                        colSpan="10"
                                                    >
                                                        Tidak ada laporan
                                                        pembelian ditemukan
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <Pagination links={supplierReport.links} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Index;
