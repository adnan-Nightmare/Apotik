import { Link, useForm, usePage } from "@inertiajs/react";
import AdminLayout from "../../../Layouts/AdminLayout";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";

const supplierEdit = () => {
    const { supplier, provinces } = usePage().props;

    // Menggunakan useForm() untuk mengatur dan mengelola data form
    const { data, setData, put, processing, errors } = useForm({
        name: supplier.name || "",
        address: supplier.address || "",
        phone: supplier.phone || "",
        description: supplier.description || "",
        status: supplier.status || "active",
        province_id: supplier.province_id || "",
        city_id: supplier.city_id || "",
    });

    const [cities, setCities] = useState([]);
    const [loadingCities, setLoadingCities] = useState(false);

    // Fungsi untuk mengubah data province dan memuat cities terkait
    const handleProvinceChange = async (e) => {
        const provinceId = e.target.value;
        setData("province_id", provinceId);

        if (provinceId) {
            setLoadingCities(true);
            try {
                const response = await fetch(`/admin/get-cities/${provinceId}`);
                const citiesData = await response.json();
                setCities(citiesData);
            } catch (error) {
                console.error("Error fetching cities:", error);
            } finally {
                setLoadingCities(false);
            }
        } else {
            setCities([]);
        }
    };

    // useEffect untuk menginisialisasi cities saat province_id berubah
    useEffect(() => {
        if (data.province_id) {
            handleProvinceChange({ target: { value: data.province_id } });
        }
    }, [data.province_id]);

    // Fungsi untuk submit data form
    const handleSubmit = (e) => {
        e.preventDefault();

        put(`/admin/suppliers/${supplier.id}`, {
            onSuccess: () => {
                Swal.fire({
                    title: "Success!",
                    text: "Supplier updated successfully!",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                });
            },
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
                        <li className="breadcrumb-item">Suppliers</li>
                        <li
                            className="breadcrumb-item active"
                            aria-current="page"
                        >
                            Edit
                        </li>
                    </ol>
                </nav>

                <h1 className="mb-3 h3">Edit Supplier</h1>

                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="mb-3 col-md-6">
                            <label for="namaObat" className="form-label">
                                Nama Supplier
                                <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                className={`form-control ${
                                    errors.name ? "is-invalid" : ""
                                }`}
                                id="namaSupplier"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                name="name"
                            />
                        </div>
                        <div className="mb-3 col-md-6">
                            <label for="namaObat" className="form-label">
                                Phone Number
                                <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                className={`form-control ${
                                    errors.phone ? "is-invalid" : ""
                                }`}
                                id="phone"
                                value={data.phone}
                                onChange={(e) =>
                                    setData("phone", e.target.value)
                                }
                                name="phone"
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="mb-3 col-md-6">
                            <label for="namaObat" className="form-label">
                                address
                                <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                className={`form-control ${
                                    errors.address ? "is-invalid" : ""
                                }`}
                                id="address"
                                value={data.address}
                                onChange={(e) =>
                                    setData("address", e.target.value)
                                }
                                name="address"
                            />
                        </div>

                        <div className="col-md-6">
                            <label for="kelasObat" className="form-label">
                                Province
                                <span className="text-danger">*</span>
                            </label>
                            <select
                                class="form-select"
                                aria-label="Default select example"
                                id="kelasObat"
                                value={data.province_id}
                                onChange={handleProvinceChange}
                            >
                                <option value="" selected disabled>
                                    Pilih province
                                </option>
                                {provinces.map((province) => (
                                    <option
                                        key={province.id}
                                        value={province.id}
                                    >
                                        {province.name}
                                    </option>
                                ))}
                            </select>
                            {errors.province_id && (
                                <div className="invalid-feedback d-block">
                                    {errors.province_id}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <label for="kelasObat" className="form-label">
                                City
                                <span className="text-danger">*</span>
                            </label>
                            <select
                                class="form-select"
                                aria-label="Default select example"
                                id="kelasObat"
                                value={data.city_id}
                                onChange={(e) =>
                                    setData("city_id", e.target.value)
                                }
                            >
                                <option value="" selected disabled>
                                    Pilih city
                                </option>
                                {cities.map((city) => (
                                    <option key={city.id} value={city.id}>
                                        {city.name}
                                    </option>
                                ))}
                            </select>
                            {errors.city_id && (
                                <div className="invalid-feedback d-block">
                                    {errors.city_id}
                                </div>
                            )}
                        </div>

                        <div className="col-md-6">
                            <label for="kelasObat" className="form-label">
                                Status
                                <span className="text-danger">*</span>
                            </label>
                            <select
                                class="form-select"
                                aria-label="Default select example"
                                id="kelasObat"
                                value={data.status}
                                onChange={(e) =>
                                    setData("status", e.target.value)
                                }
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                            {errors.status && (
                                <div className="invalid-feedback d-block">
                                    {errors.status}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="d-flex gap-3 mt-3">
                        <button
                            className="btn btn-primary px-4"
                            disabled={processing}
                            type="submit"
                        >
                            {processing ? (
                                <>
                                    <div
                                        className="spinner-border spinner-border-sm text-light me-2"
                                        role="status"
                                    >
                                        <span className="visually-hidden">
                                            Loading...
                                        </span>
                                    </div>
                                    loading...
                                </>
                            ) : (
                                <>
                                    <i className="fa fa-save"></i> Edit
                                </>
                            )}
                        </button>
                        <Link
                            href="/admin/suppliers"
                            className="btn border px-4"
                        >
                            Kembali
                        </Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default supplierEdit;
