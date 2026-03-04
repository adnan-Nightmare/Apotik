import { useState } from "react";
import AdminLayout from "../../../Layouts/AdminLayout";
import { Deferred, router, usePage } from "@inertiajs/react";
import PaginationReport from "../../../Components/PaginationReport";
import hasAnyPermission from "../../../utils/hasAnyPermission";
import Pagination from "../../../Components/Pagination";

const Index = () => {
    const { laporanStok } = usePage().props;
    const [filterText, setFilterText] = useState("");
    const filteredProducts = laporanStok.data.filter(
        (product) =>
            console.log(product) ||
            product.nama_obat.toLowerCase().includes(filterText.toLowerCase()),
    );

    return (
        <AdminLayout>
            <div className="container-fluid">
                <h3>Laporan Stok Obat</h3>

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
                                                <th>Nama Obat</th>
                                                <th>Kategori</th>
                                                <th>Satuan</th>
                                                <th>Stok</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredProducts.length > 0 ? (
                                                filteredProducts.map(
                                                    (product, index) => (
                                                        <tr key={product.id}>
                                                            <td className="text-center">
                                                                {index +
                                                                    1 +
                                                                    (laporanStok.current_page -
                                                                        1) *
                                                                        laporanStok.per_page}
                                                            </td>
                                                            <td>
                                                                <img
                                                                    src={`/storage/obats/${product.gambar_obat}`}
                                                                    alt={
                                                                        product.gambar_obat
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
                                                                {product.nama_obat ||
                                                                    "Nama tidak tersedia"}
                                                            </td>
                                                            <td>
                                                                {product
                                                                    .kategori
                                                                    .nama_kategori ||
                                                                    "Kategori tidak tersedia"}
                                                            </td>
                                                            <td>
                                                                {
                                                                    product
                                                                        .satuan
                                                                        .nama_satuan || "Satuan tidak tersedia"
                                                                }
                                                            </td>
                                                            <td>
                                                                {
                                                                    product.stock_total ? product.stock_total.total_stock : 0
                                                                }
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
                                <Pagination links={laporanStok.links} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Index;
