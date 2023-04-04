import React from "react";
import { Link } from 'react-router-dom';
import DashboardDataGrid from "./DashboardDataGrid";

function VendorDashboard() {
    return (
        <div className="d-flex flex-column">
            <div className="d-flex  p-2 align-items-center pageHeading">
                <div className="ps-4">
                    <h4 className="mb-0 ps-1">Vendor-Dashboard</h4>
                </div>
                <div className="d-flex align-items-end h-100">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0 d-flex justify-content-end">
                            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                            <li className="breadcrumb-item"><Link to="/vendor-dashboard">Dashboard</Link></li>
                            <li className="breadcrumb-item active">Activity</li>
                        </ol>
                    </nav>
                </div>
            </div>
            <DashboardDataGrid />
        </div>
    );
}

export default VendorDashboard;
