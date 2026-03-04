import { Link, usePage } from "@inertiajs/react";
import NavItem from "./NavItem";
import hasAnyPermission from "../utils/hasAnyPermission";

const Sidebar = () => {
    const { nama_app } = usePage().props;
    return (
        <nav
            className="bg-white d-flex flex-column p-3 vh-100 border-end"
            style={{ width: "330px", 'overflow': "scroll" }} //'overflow': "scroll"
        >
            <div className="p-2 ">
                <h1 className="h5 text-uppercase fw-bold mb-3 link-body-emphasis">
                    {nama_app}
                </h1>

                <ul className="nav nav-pills flex-column mb-auto">
                    <li className="nav-item mt-3 mb-1 text-muted">Menu</li>
                    {hasAnyPermission(["dashboard.index"]) && (
                        <NavItem
                            href="/admin/dashboard"
                            label="Dashbaord"
                            icon="bi-house-door"
                        />
                    )}
                </ul>

                <ul className="nav nav-pills flex-column mb-auto">
                    <li className="nav-item mt-3 mb-1 text-muted">Inventory</li>

                    {hasAnyPermission(["suppliers.index"]) && (
                        <NavItem
                            href="/admin/suppliers"
                            icon="bi-truck"
                            label="Suppliers"
                        />
                    )}

                    {hasAnyPermission(["kategori.index"]) && (
                        <NavItem
                            href="/admin/kategori"
                            label="Kategori"
                            icon="bi-list-ul"
                        />
                    )}
                    {hasAnyPermission(["satuan.index"]) && (
                        <NavItem
                            href="/admin/satuan"
                            label="Satuan"
                            icon="bi-tag"
                        />
                    )}

                    {hasAnyPermission(["persediaan-obat.index"]) && (
                        <NavItem
                            href="/admin/medicine"
                            label="Persediaan Obat"
                            icon="bi-box-seam"
                        />
                    )}
                </ul>

                <ul className="nav nav-pills flex-column mb-auto">
                    <li className="nav-item mt-3 mb-1 text-muted">Laporan</li>
                    {hasAnyPermission(["kadaluarsa.index"]) && (
                        <NavItem
                            href="/admin/kadaluarsa"
                            label="Kadaluarsa"
                            icon="bi-calendar2-range"
                        />
                    )}

                    {hasAnyPermission(["report_pembelian.index"]) && (
                        <NavItem
                            href="/admin/report_pembelian"
                            label="Laporan Pembelian"
                            icon="bi-graph-up"
                        />
                    )}

                    {hasAnyPermission(["report_stok.index"]) && (
                        <NavItem
                            href="/admin/report_stok"
                            label="Laporan Stok"
                            icon="bi-graph-up"
                        />
                    )}

                    {hasAnyPermission(["report_kadaluarsa.index"]) && (
                        <NavItem
                            href="/admin/report_kadaluarsa"
                            label="Laporan Kadaluarsa"
                            icon="bi-graph-up"
                        />
                    )}
                </ul>
                <ul className="nav nav-pills flex-column mb-auto">
                    <li className="nav-item mt-3 mb-1 text-muted">Pembelian</li>
                      {hasAnyPermission(["stock.index"]) && (
                        <NavItem
                            href="/admin/stock"
                            label="Pembelian obat"
                            icon="bi-archive"
                        />
                    )}
                </ul>

                <ul className="nav nav-pills flex-column mb-auto">
                    <li className="nav-item mt-3 mb-1 text-muted">Settings</li>
                    {hasAnyPermission(["roles.index"]) && (
                        <NavItem
                            href="/admin/roles"
                            label="Roles"
                            icon="bi-shield-lock"
                        />
                    )}
                    {hasAnyPermission(["users.index"]) && (
                        <NavItem
                            href="/admin/users"
                            label="User"
                            icon="bi-person-circle"
                        />
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Sidebar;
