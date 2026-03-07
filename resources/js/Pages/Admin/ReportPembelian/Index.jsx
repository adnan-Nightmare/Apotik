import { useState } from "react";
import AdminLayout from "../../../Layouts/AdminLayout";
import { Deferred, router, usePage } from "@inertiajs/react";
import PaginationReport from "../../../Components/PaginationReport";
import hasAnyPermission from "../../../utils/hasAnyPermission";
import Pagination from "../../../Components/Pagination";

const Index = () => {
    const {
        pembelianProducts,
        start_date = "",
        end_date = "",
        errors,
    } = usePage().props;

    // State untuk menyimpan input tanggal
    const [startDate, setStartDate] = useState(start_date);
    const [endDate, setEndDate] = useState(end_date);

    // Ketika klik "Generate Report"
    const handleSubmit = (e) => {
        e.preventDefault();
        router.get("/admin/report_pembelian/generate", {
            start_date: startDate,
            end_date: endDate,
        });
    };

    const handleReset = (e) => {
        e.preventDefault();
        setStartDate("");
        setEndDate("");
    };

    return (
        <AdminLayout>
            <div className="container-fluid">
                <h3>Laporan Pembelian</h3>

                <div className="card border rounded">
                    <div className="card-body px-3">
                        <form onSubmit={handleSubmit}>
                            <div className="d-flex row">
                                <div className="col-md-3">
                                    <label
                                        htmlFor="start_date"
                                        className="form-label"
                                    >
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        id="start_date"
                                        value={startDate}
                                        onChange={(e) =>
                                            setStartDate(e.target.value)
                                        }
                                        className="form-control"
                                        required
                                    />
                                    {errors?.start_date && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.start_date}
                                        </div>
                                    )}
                                </div>
                                <div className="col-md-3">
                                    <label
                                        htmlFor="end_date"
                                        className="form-label"
                                    >
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        id="end_date"
                                        value={endDate}
                                        onChange={(e) =>
                                            setEndDate(e.target.value)
                                        }
                                        className="form-control"
                                        required
                                    />
                                    {errors?.end_date && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.end_date}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="d-flex justify-content-end gap-2">
                                <button
                                    type="reset"
                                    className="btn text-uppercase fw-semibold text-primary"
                                    onClick={handleReset}
                                >
                                    Reset
                                </button>
                                <button
                                    className="btn btn-primary"
                                    type="submit"
                                >
                                    Generate Report
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="row mt-3">
                    <div className="col-12">
                        <div className="card border rounded">
                            <div className="card-body p-0">
                                <Deferred data="pembelianProducts"
                                    fallback={
                                        <div className="text-center my-4">
                                            <div
                                                className="spinner-border text-primary"
                                                role="status"
                                            >
                                                <span className="visually-hidden">
                                                    Loading...
                                                </span>
                                            </div>
                                            <p>Loading laporan pembelian...</p>
                                        </div>
                                    }>
                                    <div className="d-flex justify-content-end align-items-center">
                                        {pembelianProducts &&
                                            pembelianProducts.length > 0 && (
                                                <a
                                                    href="/admin/export-pembelian"
                                                    className="btn btn-sm btn-primary mx-3 my-2"
                                                >
                                                    Export Excel
                                                </a>
                                            )}
                                    </div>
                                    <div className="table-responsive pb-1">
                                        <table className="table align-middle table-hover">
                                            <thead className="table-light text-white">
                                                <tr>
                                                    <th className="text-center">Gambar</th>
                                                    <th>nomor Batch</th>
                                                    <th>Nama Obat</th>
                                                    <th>Nama Supplier</th>
                                                    <th>Jumlah Stok</th>
                                                    <th>Harga Beli</th>
                                                    <th>Tanggal Diterima</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {pembelianProducts && pembelianProducts.length > 0 ? (
                                                    pembelianProducts.map(
                                                        (product, index) => (
                                                            <tr
                                                                key={product.id}
                                                            >
                                                                <td className="text-center">
                                                                    <img
                                                                        src={`/storage/obats/${product.medicines.gambar_obat}`}
                                                                        alt={
                                                                            product
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
                                                                    {product.nomor_batch ||
                                                                        "Nama tidak tersedia"}
                                                                </td>
                                                                <td>
                                                                    {product
                                                                        .medicines
                                                                        .nama_obat ||
                                                                        "Nama tidak tersedia"}
                                                                </td>
                                                                <td>
                                                                    {
                                                                        product
                                                                            .supplier
                                                                            .name
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        product.stock_quantity
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        product.harga_beli
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        product.received_at
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
                                </Deferred>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Index;
