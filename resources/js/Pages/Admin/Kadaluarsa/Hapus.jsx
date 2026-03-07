import { Link, useForm, usePage } from "@inertiajs/react";
import AdminLayout from "../../../Layouts/AdminLayout";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";

const hapus = () => {
    const { obats } = usePage().props;
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    console.log(obats);
    const { data, setData, post, processing, reset, errors } = useForm({
        product_id: selectedProduct?.id || "",
        teknik_pemusnahan: 0,
    });

    console.log(data);

    useEffect(() => {
        if (obats.data.length > 0) {
            setIsLoading(false);
        }
    }, [obats]);

    // Fungsi handleSubmit untuk mengirim data kategori
    const handleSubmit = (e) => {
        e.preventDefault();
        post("/admin/kadaluarsa", {
            onSuccess: () => {
                Swal.fire({
                    title: "Success!",
                    text: "Category created successfully!",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                });
                reset(); // Reset form setelah berhasil
            },
        });
    };

    // Fungsi handleChange untuk menangani perubahan pada input form
    const handleChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    return (
        <AdminLayout scroll={true}>
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
                            Musnahkan Obat
                        </li>
                    </ol>
                </nav>

                <div>
                    <h2 className="h4">Panduan Teknik Pemusnahan Obat</h2>
                    <div className="row gap-3 my-2 mx-0">
                        <div className="flex flex-column card col-md-3 p-3">
                            <h1 className="h2">💧</h1>
                            <h1 className="h4 my-2">Dilarutkan</h1>
                            <p className="" style={{ fontSize: "13px" }}>
                                Dissolution / Chemical Waste Water Treatment.
                                Metode paling umum untuk tablet, kapsul, sirup,
                                dan obat cair yang tidak termasuk
                                narkotik/psikotropik dosis tinggi
                            </p>
                            <div className="d-flex gap-2">
                                <div
                                    className="card p-1"
                                    style={{ fontSize: "12px" }}
                                >
                                    Tablet
                                </div>
                                <div
                                    className="card p-1"
                                    style={{ fontSize: "12px" }}
                                >
                                    Sirup
                                </div>
                                <div
                                    className="card p-1"
                                    style={{ fontSize: "12px" }}
                                >
                                    Injeksi
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-column card col-md-3 p-3">
                            <h1 className="h2">🔥</h1>
                            <h1 className="h4 my-2">Dibakar (Insinerasi)</h1>
                            <p className="" style={{ fontSize: "13px" }}>
                                High-temperature incineration. Metode terbaik
                                untuk obat keras, narkotik, psikotropik,
                                sitostatika, antibiotik, dan sediaan farmasi
                                berbahaya lainnya.
                            </p>
                            <div className="d-flex gap-2">
                                <div
                                    className="card p-1"
                                    style={{ fontSize: "12px" }}
                                >
                                    Narkotik
                                </div>
                                <div
                                    className="card p-1"
                                    style={{ fontSize: "12px" }}
                                >
                                    Sitostatika
                                </div>
                                <div
                                    className="card p-1"
                                    style={{ fontSize: "12px" }}
                                >
                                    Antibiotik
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-column card col-md-3 p-3">
                            <h1 className="h2">⛏️</h1>
                            <h1 className="h4 my-2">Dikubur (Enkapsulasi)</h1>
                            <p className="" style={{ fontSize: "13px" }}>
                                Secure landfill / encapsulation burial. Metode
                                untuk sediaan padat non-berbahaya di fasilitas
                                yang tidak memiliki akses incinerator atau
                                instalasi pengolahan limbah cair.
                            </p>
                            <div className="d-flex gap-2">
                                <div
                                    className="card p-1"
                                    style={{ fontSize: "12px" }}
                                >
                                    Tablet Padat
                                </div>
                                <div
                                    className="card p-1"
                                    style={{ fontSize: "12px" }}
                                >
                                    Salep/Krim
                                </div>
                                <div
                                    className="card p-1"
                                    style={{ fontSize: "12px" }}
                                >
                                    Herbal
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <h1 className="mb-3 h3 mt-5">Musnahkan Obat</h1>
                {/* form */}
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="mb-3 col-md-6">
                            <label for="namaObat" className="form-label">
                                Nomor Batch
                                <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="namaObat"
                                value={
                                    selectedProduct
                                        ? selectedProduct.nomor_batch
                                        : ""
                                }
                                placeholder="Cari nomor batch obat"
                                readOnly
                                data-bs-toggle="modal"
                                data-bs-target="#productModal"
                            />
                            <input
                                type="hidden"
                                name="medicine_id"
                                value={data.id}
                                onChange={(e) =>
                                    setData("product_id", e.target.value)
                                }
                            />
                            {errors.medicine_id && (
                                <div className="alert alert-danger mt-2">
                                    {errors.medicine_id}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="row">
                        <div className="mb-3 col-md-6">
                            <label for="deskripsi" className="form-label">
                                Teknik Pemusnahan
                                <span className="text-danger">*</span>
                            </label>
                            <select
                                class="form-select"
                                aria-label="Default select example"
                                id="kelasObat"
                                value={data.teknik_pemusnahan}
                                onChange={(e) => {
                                    setData("teknik_pemusnahan", e.target.value)}}                        
                            >
                                <option value="" selected disabled>
                                    Pilih Teknik Pemusnahan
                                </option>
                                <option value="0">Dilarutkan</option>
                                <option value="1">Dibakar</option>
                                <option value="2">Dikubur</option>
                                
                            </select>
                            {errors.supplier_id && (
                                <div className="alert alert-danger mt-2">
                                    {errors.supplier_id}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="d-flex gap-3">
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
                                    <i className="fa fa-save"></i> Musnahkan
                                </>
                            )}
                        </button>
                        <Link
                            href="/admin/kadaluarsa"
                            className="btn border px-4"
                        >
                            Kembali
                        </Link>
                    </div>
                </form>
            </div>

            {/* Modal for Product Selection */}
            <div
                className="modal fade"
                id="productModal"
                tabIndex="-1"
                aria-labelledby="productModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="productModalLabel">
                                Pilih Produk
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            {isLoading ? (
                                <div className="d-flex justify-content-center">
                                    <div
                                        className="spinner-border text-primary"
                                        role="status"
                                    >
                                        <span className="visually-hidden">
                                            Loading...
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="table-responsive p-4">
                                    <table className="table align-middle">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Gambar</th>
                                                <th>Nama Obat</th>
                                                <th>Nomor Batch</th>
                                                <th>Stok</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {obats.data.map((product) => (
                                                <tr key={product.id}>
                                                    <td>
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
                                                        {
                                                            product.medicines
                                                                .nama_obat
                                                        }
                                                    </td>
                                                    <td>
                                                        {product.nomor_batch}
                                                    </td>
                                                    <td>
                                                        {product.stock_quantity}
                                                    </td>
                                                    <td>
                                                        <button
                                                            onClick={() => {
                                                                setData(
                                                                    "product_id",
                                                                    product.id,
                                                                );
                                                                setSelectedProduct(
                                                                    product,
                                                                );
                                                            }}
                                                            className="btn btn-primary"
                                                            data-bs-dismiss="modal"
                                                        >
                                                            Select
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <br />
            <br />
            <br />
            <br />
        </AdminLayout>
    );
};

export default hapus;
