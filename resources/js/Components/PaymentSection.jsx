import React from "react";
import { formatRupiah } from "../utils/formatRupiah";

const PaymentSection = ({
    discount,
    onDiscountChange,
    subTotal = 0,
    paymentMethod,
    onPaymentMethodChange,
    cash,
    onCashChange,
    change = 0,
    onProcessPayment,
    isProcessing = false,
}) => {
    // Hitung total setelah diskon
    const grandTotal = Math.max(0, subTotal - (discount || 0));

    return (
        <div className="px-3 ">
            <h6>Discount</h6>
            <div className="input-group">
                <span className="input-group-text">Rp</span>
                <input
                    type="number"
                    className="form-control"
                    placeholder="0"
                    value={discount || ""}
                    onChange={onDiscountChange}
                    disabled={isProcessing}
                />
            </div>

            <h6 className="mt-2">Cash</h6>
            <div className="input-group">
                <span className="input-group-text">Rp</span>
                <input
                    type="number"
                    className="form-control"
                    placeholder="0"
                    value={cash || ""}
                    onChange={onCashChange}
                    disabled={isProcessing}
                />
            </div>

            <hr />
            {/* Grand Total */}
            <div className="">
                <h6 className="mb-2">Grand Total (Setelah diskon)</h6>
                <h3 className="mb-0 fs-2 text-primary">
                    {grandTotal > 0 ? formatRupiah(grandTotal) : "Rp 0"}
                </h3>
                {discount > 0 && (
                    <div className="text-success mt-2">
                        <small>
                            <strong>Diskon: {formatRupiah(discount)}</strong>
                        </small>
                    </div>
                )}
            </div>

            <hr />

            <div className="mt-1">
                <h6 className="mb-2">Change (Uang kembalian)</h6>
                <h3 className="mb-0 fs-2 text-primary">
                    {change > 0 ? formatRupiah(change) : "Rp 0"}
                </h3>
            </div>

            <hr/>

            {/* Process Payment Button */}

            <button
                className="btn btn-success btn-md w-100"
                style={{ marginBottom: "80px" }}
                onClick={onProcessPayment}
                disabled={isProcessing}
            >
                {isProcessing ? (
                    <>
                        <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                        ></span>
                        Processing...
                    </>
                ) : (
                    <>
                        <i className="bi bi-cash-stack me-2"></i> Process
                        Payment
                    </>
                )}
            </button>
        </div>
    );
};

export default PaymentSection;
