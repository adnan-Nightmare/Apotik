import { Link, router, useForm, usePage } from "@inertiajs/react";
import AdminLayout from "../../../Layouts/AdminLayout";
import Swal from "sweetalert2";

const ObatEdit = () => {
    const { kategori, satuan, obat, errors, nama_app } = usePage().props;

    const { data, setData, post, processing, reset } = useForm({
        nama_obat: obat.nama_obat,
        kategori_id: obat.kategori_id,
        satuan_id: obat.satuan_id,
        harga: obat.harga,
        gambar_obat: null,
        kadaluarsa: obat.kadaluarsa,
        stok: obat.stok,
        nomor_batch: obat.nomor_batch,
    });

    const updateObat = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("nama_obat", data.nama_obat);
        formData.append("harga", data.harga);
        formData.append("kategori_id", data.kategori_id);
        formData.append("satuan_id", data.satuan_id);
        formData.append("stok", data.stok);
        formData.append("nomor_batch", data.nomor_batch);
        formData.append("kadaluarsa", data.kadaluarsa);
        if (data.gambar_obat) {
            formData.append("gambar_obat", data.gambar_obat);
        }
        formData.append("_method", "PUT");

        router.post(`/admin/medicine/${obat.id}`, formData, {
            forceFormData: true,
            onSuccess: () => {
                Swal.fire({
                    title: "Success!",
                    text: "Data updated successfully!",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                });
            },
        });
    };

    return (
        <AdminLayout app_name={nama_app}>
            <div className="container-fluid">
                <nav
                    className="breadcrumb-nav"
                    style={{
                        "--bs-breadcrumb-divider": `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z' fill='%236c757d'/%3E%3C/svg%3E")`,
                    }}
                    aria-label="breadcrumb"
                >
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">Persediaan obat</li>
                        <li
                            className="breadcrumb-item active"
                            aria-current="page"
                        >
                            Edit
                        </li>
                    </ol>
                </nav>

                <h1 className="mb-3 h3">Edit Obat</h1>

                <form onSubmit={updateObat}>
                    <div className="row g-4">
                        <div className="mb-3 col-md-7">
                            <label for="namaObat" className="form-label">
                                Nama Obat<span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="namaObat"
                                value={data.nama_obat}
                                onChange={(e) =>
                                    setData("nama_obat", e.target.value)
                                }
                            />
                            {errors.nama_obat && (
                                <div className="invalid-feedback d-block">
                                    {errors.nama_obat}
                                </div>
                            )}
                        </div>
                        <div className="mb-3 col-md-5">
                            <label for="Satuan" className="form-label">
                                Satuan<span className="text-danger">*</span>
                            </label>
                            <select
                                class="form-select"
                                aria-label="Default select example"
                                id="Satuan"
                                value={data.satuan_id}
                                onChange={(e) =>
                                    setData("satuan_id", e.target.value)
                                }
                            >
                                <option value="" selected disabled>
                                    Pilih satuan obat
                                </option>
                                {satuan.map((satuan) => (
                                    <option key={satuan} value={satuan.id}>
                                        {satuan.nama_satuan}
                                    </option>
                                ))}
                            </select>
                            {errors.satuan_id && (
                                <div className="invalid-feedback d-block">
                                    {errors.satuan_id}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="row g-4">
                        <div className="col-md-4">
                            <label for="kelasObat" className="form-label">
                                Kategori obat
                                <span className="text-danger">*</span>
                            </label>
                            <select
                                class="form-select"
                                aria-label="Default select example"
                                id="kelasObat"
                                value={data.kategori_id}
                                onChange={(e) =>
                                    setData("kategori_id", e.target.value)
                                }
                            >
                                <option value="" selected disabled>
                                    Pilih kategori
                                </option>
                                {kategori.map((kategori) => (
                                    <option
                                        key={kategori.id}
                                        value={kategori.id}
                                    >
                                        {kategori.nama_kategori}
                                    </option>
                                ))}
                            </select>
                            {errors.kategori_id && (
                                <div className="invalid-feedback d-block">
                                    {errors.kategori_id}
                                </div>
                            )}
                        </div>
                        <div className="col-md-4">
                            <label for="nomorBatch" className="form-label">
                                Nomor batch
                                <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="nomorBatch"
                                value={data.nomor_batch}
                                onChange={(e) =>
                                    setData("nomor_batch", e.target.value)
                                }
                            />
                            {errors.nomor_batch && (
                                <div className="invalid-feedback d-block">
                                    {errors.nomor_batch}
                                </div>
                            )}
                        </div>
                        <div className="col-md-4">
                            <label for="kadaluarsa" className="form-label">
                                Tanggal kadaluarsa
                                <span className="text-danger">*</span>
                            </label>
                            <input
                                type="date"
                                className="form-control"
                                id="kadaluarsa"
                                value={data.kadaluarsa}
                                onChange={(e) =>
                                    setData("kadaluarsa", e.target.value)
                                }
                            />
                            {errors.kadaluarsa && (
                                <div className="invalid-feedback d-block">
                                    {errors.kadaluarsa}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="row g-4 mt-1">
                        <div className="col-md-7">
                            <label for="harga" className="form-label">
                                Harga<span className="text-danger">*</span>
                            </label>
                            <div class="input-group mb-3">
                                <span
                                    className="input-group-text"
                                    id="inputGroup-sizing-default"
                                >
                                    Rp
                                </span>
                                <input
                                    type="number"
                                    className="form-control"
                                    aria-label="Sizing example input"
                                    aria-describedby="inputGroup-sizing-default"
                                    defaultValue="0"
                                    min="0"
                                    id="harga"
                                    value={data.harga}
                                    onChange={(e) =>
                                        setData("harga", e.target.value)
                                    }
                                />
                            </div>
                            {errors.harga && (
                                <div className="invalid-feedback d-block">
                                    {errors.harga}
                                </div>
                            )}
                        </div>
                        <div className="col-md-5">
                            <label for="stok" className="form-label">
                                Stok<span className="text-danger">*</span>
                            </label>
                            <input
                                type="number"
                                className="form-control"
                                id="stok"
                                defaultValue="0"
                                min="0"
                                value={data.stok}
                                onChange={(e) =>
                                    setData("stok", e.target.value)
                                }
                            />
                        </div>
                        {errors.stok && (
                            <div className="invalid-feedback d-block">
                                {errors.stok}
                            </div>
                        )}
                    </div>
                    <div class="mb-3">
                        <label for="formFile" className="form-label">
                            Gambar obat<span className="text-danger">*</span>
                        </label>
                        <input
                            className="form-control"
                            type="file"
                            id="formFile"
                            onChange={(e) =>
                                setData("gambar_obat", e.target.files[0])
                            }
                        />
                        {errors.gambar_obat && (
                            <div className="invalid-feedback d-block">
                                {errors.gambar_obat}
                            </div>
                        )}
                    </div>
                    <div className="d-flex gap-3">
                        <button className="btn btn-primary px-4">Edit</button>
                        <Link
                            href="/admin/medicine"
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

export default ObatEdit;
