import React from "react";

const CustomerSelector = ({
    customers,
    selectedCustomer,
    onSelectCustomer,
    cashierName,
}) => {
    return (
        <div className="row px-4 py-2">
            <label className="form-label">Customer</label>
            <select
                className="form-select"
                onChange={(e) => onSelectCustomer(e.target.value || null)}
                value={selectedCustomer || ""}
            >
                <option value="">Pilih Pelanggan (Opsional)</option>
                {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                        {customer.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default CustomerSelector;
