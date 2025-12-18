import { usePage } from "@inertiajs/react";
import AdminLayout from "../../../Layouts/AdminLayout";
import {
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    BarChart,
    Bar,
    ResponsiveContainer,
} from "recharts";

import { formatRupiah } from "../../../utils/formatRupiah";
import hasAnyPermission from "../../../utils/hasAnyPermission";
import { useMemo } from "react";

const CARD_COLORS = [
    "rgba(98, 147, 238, 0.199)",
    "rgba(43, 164, 235, 0.199)",
    "rgba(247, 162, 6, 0.299)",
    "rgba(247, 42, 6, 0.299)",
    "#FF5722",
];
const COLORS = [
    "#FF6384",
    "#FFBB28",
    "#00C49F",
    "#0088FE",
    "#FF8042",
    "#36A2EB",
    "#9966FF",
    "#C9CBCF",
];

const TITLES = {
    totalObat: "Total Obat",
    totalSales: "Total Penjualan",
    totalTransactions: "Total Transaksi",
    totalCustomers: "Total Customer",
    totalProducts: "Total Produk di Stok",
    totalSuppliers: "Total Supplier Aktif",
};

const ICONS = {
    totalObat: "bi bi-box-seam",
    totalCustomers: "bi bi-people-fill",
    totalSales: "bi bi-cash-stack",
    totalTransactions: "bi bi-receipt",
    totalProducts: "bi bi-box-seam",
    totalSuppliers: "bi bi-truck",
};

const isEmpty = (data) =>
    !data ||
    (Array.isArray(data) ? data.length === 0 : Object.keys(data).length === 0);

const StatCard = ({ color, icon, title, value }) => (
    <div className="col-6 col-md-4 col-lg-3 mb-3">
        <div className="card shadow-sm h-100 p-4 d-flex flex-column justify-content-between">
            <div className="row g-0 gap-3">
                <div
                    className="d-flex justify-content-center align-items-center rounded col-md-3 h-100"
                    style={{ backgroundColor: color }}
                >
                    <i className={icon} style={{ fontSize: 25 }}></i>
                </div>
                <div className="col-md-6">
                    <h6 className="text-body-tertiary">{title}</h6>
                    <h5 className="fw-bold">{value}</h5>
                </div>
            </div>
        </div>
    </div>
);

const ChartCard = ({ title, children, emptyMessage }) => (
    <div className="card shadow-sm border-0 h-100">
        <div className="card-body">
            <h5 className="card-title text-center mb-3">{title}</h5>
            {children || (
                <div className="text-center text-muted">{emptyMessage}</div>
            )}
        </div>
    </div>
);

// Mapping antara statistik dan permission
const STAT_PERMISSION_MAP = {
    totalObat: "dashboard.view_persediaan_obat",
    totalSales: "dashboard.view_sales",
    totalTransactions: "dashboard.view_transactions",
    totalCustomers: "dashboard.view_customers",
    totalProducts: "dashboard.view_products",
    totalSuppliers: "dashboard.view_supplier",
};

const Index = () => {
    const { stats, transactionData, salesData, productsData, obats, categoryData } =
        usePage().props;

    // tempat menghitung item / obat yg kadaluarsa
    const statusKadaluarsaItems = useMemo(() => {
        let kadaluarsa = 0;
        let hampir = 0;
        let aman = 0;

        const calculateRemainingDays = (expDate) => {
            const exp = new Date(expDate);
            const now = new Date();
            const diffTime = exp - now;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            return diffDays;
        };

        obats.forEach((medicine) => {
            const sisaHari = calculateRemainingDays(medicine.kadaluarsa);
            const isKadaluarsa = sisaHari <= 0;
            const isHampir = sisaHari >= 0 && sisaHari <= 30;
            const obats = [];

            if (isKadaluarsa) {
                kadaluarsa++;
            } else if (isHampir) {
                hampir++;
            } else {
                aman++;
            }
        });

        const items = [
            {
                name: "kadaluarsa",
                value: kadaluarsa,
            },
            {
                name: "hampir",
                value: hampir,
            },
            {
                name: "aman",
                value: aman,
            },
        ];

        return {
            items,
        };
    });

    return (
        <>
            <AdminLayout scroll={true}>
                <div className="container-fluid">
                    <h1 className="mb-4 h3">Dashboard</h1>
                    <div className="row g-3">
                        {Object.keys(stats).map((key, i) => {
                            const permission = STAT_PERMISSION_MAP[key];
                            if (!permission) return null;

                            return (
                                hasAnyPermission([permission]) && (
                                    <StatCard
                                        key={key}
                                        color={
                                            CARD_COLORS[i % CARD_COLORS.length]
                                        }
                                        icon={ICONS[key]}
                                        title={TITLES[key] || key}
                                        value={
                                            key == "totalSales"
                                                ? formatRupiah(stats[key])
                                                : stats[key]
                                        }
                                    />
                                )
                            );
                        })}
                    </div>

                    {/* Pesan jika data transaksi kosong */}
                    {isEmpty(transactionData) && (
                        <div className="alert alert-warning my-4">
                            Data transaksi kosong. Tambahkan data terlebih
                            dahulu.
                        </div>
                    )}

                    {/* charts */}
                    <div className="row g-4 my-4">
                    {/* Chart Pie : Persentase Status Kadaluarsa */}
                        {hasAnyPermission([
                            "dashboard.view_persediaan_obat",
                        ]) && (
                            <div className="col-md-6">
                                <ChartCard
                                    title="Persentase Status Kadaluarsa"
                                    emptyMessage="Data Kadaluarsa tidak tersedia"
                                >
                                    {!isEmpty(statusKadaluarsaItems) && (
                                        <ResponsiveContainer
                                            width="100%"
                                            height={300}
                                        >
                                            <PieChart>
                                                <Pie
                                                    data={
                                                        statusKadaluarsaItems.items
                                                    }
                                                    dataKey="value"
                                                    nameKey="name"
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={100}
                                                    label
                                                >
                                                    {statusKadaluarsaItems.items.map(
                                                        (_, idx) => (
                                                            <Cell
                                                                key={idx}
                                                                fill={
                                                                    COLORS[
                                                                        idx %
                                                                            COLORS.length
                                                                    ]
                                                                }
                                                            />
                                                        )
                                                    )}
                                                    <Tooltip />
                                                </Pie>
                                            </PieChart>
                                        </ResponsiveContainer>
                                    )}
                                </ChartCard>
                            </div>
                        )}

                        {/* Chart Line : Penjualan dari Waktu ke Waktu */}
                        {hasAnyPermission(["dashboard.view_sales"]) && (
                            <div className="col-md-6">
                                <ChartCard
                                    title="Penjualan dari Waktu ke Waktu"
                                    emptyMessage="Data penjualan tidak tersedia"
                                >
                                    {!isEmpty(salesData) && (
                                        <ResponsiveContainer
                                            width="100%"
                                            height={300}
                                        >
                                            <LineChart data={salesData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="date" />
                                                <YAxis
                                                    tickFormatter={(value) =>
                                                        formatRupiah(value)
                                                    }
                                                />

                                                <Tooltip
                                                    formatter={(value) =>
                                                        formatRupiah(value)
                                                    }
                                                />

                                                <Line
                                                    type="monotone"
                                                    dataKey="total"
                                                    stroke="#8884d8"
                                                    activeDot={{ r: 8 }}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    )}
                                </ChartCard>
                            </div>
                        )}
                    </div>

                    <div
                        className="row g-4 mt-4"
                        style={{ marginBottom: "100px" }}
                    >
                        {/* Chart Bar: Obat Terlaris */}
                        {hasAnyPermission(["dashboard.view_products"]) && (
                            <div className="col-md-6">
                                <ChartCard
                                    title="Obat Terlaris"
                                    emptyMessage="Data Obat terlaris tidak tersedia"
                                >
                                    {!isEmpty(productsData) && (
                                        <ResponsiveContainer
                                            width="100%"
                                            height={300}
                                        >
                                            <BarChart data={productsData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip />
                                                <Bar
                                                    dataKey="total_quantity"
                                                    fill="#FF8042"
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    )}
                                </ChartCard>
                            </div>
                        )}

                        {/* Chart Bar: Stok Obat per Kategori */}
                        {hasAnyPermission(["dashboard.view_products"]) && (
                            <div className="col-md-6">
                                <ChartCard
                                    title="Stok Obat per Kategori"
                                    emptyMessage="Data kategori tidak tersedia"
                                >
                                    {!isEmpty(categoryData) && (
                                        <ResponsiveContainer
                                            width="100%"
                                            height={300}
                                        >
                                            <BarChart data={categoryData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="category" />
                                                <YAxis />
                                                <Tooltip />
                                                <Bar
                                                    dataKey="total_stock"
                                                    fill="#00C49F"
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    )}
                                </ChartCard>
                            </div>
                        )}
                    </div>
                </div>
            </AdminLayout>
        </>
    );
};

export default Index;
