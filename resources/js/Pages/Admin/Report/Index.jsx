import React, { useState } from "react";
import AdminLayout from "../../../Layouts/AdminLayout";
import { Deferred, router, usePage } from "@inertiajs/react";
import PaginationReport from "../../../Components/PaginationReport";

const Index = () => {
    const {
        transactions,
        start_date = "",
        end_date = "",
        errors,
    } = usePage().props;

    // State untuk menyimpan input tanggal
    const [startDate, setStartDate] = useState(start_date);
    const [endDate, setEndDate] = useState(end_date);

    const handleReset = (e) => {
        e.preventDefault();
        setStartDate("");
        setEndDate("")
    };

    // Ketika klik "Generate Report"
    const handleSubmit = (e) => {
        e.preventDefault();
        router.get("/admin/report/generate", {
            start_date: startDate,
            end_date: endDate,
        });
    };

    return (
        <AdminLayout>
            <div className="container-fluid">
                <h3>Laporan Transaksi</h3>

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
                                <div className="table-responsive pb-1">
                                    <Deferred
                                        data="transactions"
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
                                                <p>Loading transactions...</p>
                                            </div>
                                        }
                                    >
                                        <table className="table align-middle table-hover">
                                            <thead className="table-light text-white">
                                                <tr>
                                                    <th className="text-center">
                                                        No.
                                                    </th>
                                                    <th>Customer</th>
                                                    <th>Tanggal Transaksi</th>
                                                    <th>Metode Pembayaran</th>
                                                    <th>Total Harga</th>
                                                    <th>Status</th>
                                                    <th>Kuantitas</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {transactions &&
                                                transactions.data &&
                                                transactions.data.length > 0 ? (
                                                    transactions.data.map(
                                                        (
                                                            transaction,
                                                            index
                                                        ) => (
                                                            <tr
                                                                key={
                                                                    transaction.id
                                                                }
                                                            >
                                                                <td className="text-center">
                                                                    {index +
                                                                        1 +
                                                                        (transactions.current_page -
                                                                            1) *
                                                                            transactions.per_page}
                                                                </td>
                                                                <td>
                                                                    {transaction
                                                                        .customer
                                                                        ?.name ||
                                                                        "Guest"}
                                                                </td>
                                                                <td>
                                                                    {new Date(
                                                                        transaction.transaction_date
                                                                    ).toLocaleDateString(
                                                                        "id-ID"
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    <span
                                                                        className={`badge bg-success text-uppercase`}
                                                                    >
                                                                        {
                                                                            transaction.payment_method
                                                                        }
                                                                    </span>
                                                                </td>
                                                                <td>
                                                                    {Number(
                                                                        transaction.total_amount
                                                                    ).toLocaleString(
                                                                        "id-ID",
                                                                        {
                                                                            style: "currency",
                                                                            currency:
                                                                                "IDR",
                                                                        }
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    <span
                                                                        className={`badge bg-${
                                                                            transaction.status ===
                                                                            "success"
                                                                                ? "success"
                                                                                : transaction.status ===
                                                                                  "pending"
                                                                                ? "warning"
                                                                                : "danger"
                                                                        }`}
                                                                    >
                                                                        {
                                                                            transaction.status
                                                                        }
                                                                    </span>
                                                                </td>
                                                                <td>
                                                                    {transaction.total_quantity ||
                                                                        0}
                                                                </td>
                                                            </tr>
                                                        )
                                                    )
                                                ) : (
                                                    <tr>
                                                        <td
                                                            className="text-center"
                                                            colSpan="10"
                                                        >
                                                            Tidak ada
                                                            transaction obat
                                                            ditemukan
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>

                                        {transactions &&
                                        transactions.data &&
                                        transactions.data.length > 0 ? (
                                            <PaginationReport
                                                links={transactions.links}
                                            />
                                        ) : (
                                            ""
                                        )}
                                    </Deferred>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Index;
