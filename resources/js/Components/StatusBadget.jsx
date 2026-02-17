import React from 'react';

export default function StatusBadge({ isKadaluarsa, isHampir, sisaHari }) {
    if (isKadaluarsa) {
        return <span className="badge bg-danger">KADALUARSA</span>;
    }
    
    if (isHampir) {
        return <span className="badge bg-warning">HAMPIR ({sisaHari} hari)</span>;
    }
    
    return <span className="badge bg-success">AMAN</span>;
}