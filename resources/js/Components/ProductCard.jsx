import React from "react";

const ProductCard = ({ product, onSelect }) => {
    return (
        <div
            className="card"
            style={{ cursor: "pointer" }}
            onClick={() => onSelect(product)}
        >
            <div className="row g-0">
                <div className="col-md-4">
                    <img
                        src={`/storage/obats/${product.gambar_obat}`}
                        className="rounded-start"
                        height={100}
                        width={100}
                        style={{ objectFit: "contain" }}
                        alt={product.nama_obat}
                    />
                </div>
                <div className="col-md-8">
                    <div className="card-body d-flex flex-column p-2">
                        <h6 className=" text-truncate card-title">{product.nama_obat}</h6>
                        <p className="text-muted">{product.nomor_batch}</p>
                        <p className="text-muted mt-auto">
                            Rp{product.harga.toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
