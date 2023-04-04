import React from "react";
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
                            <li className="breadcrumb-item">Home</li>
                            <li className="breadcrumb-item">Dashboard</li>
                        </ol>
                    </nav>
                </div>
            </div>
            <div className="row m-0 mt-2">
                <div className="col-12">
                    <div className="card border-0 p-0">
                        <div className="card-body">
                            <div className="d-flex">
                                <span>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4.50001 1.5H19.5C19.8977 1.5004 20.279 1.65856 20.5602 1.93978C20.8414 2.221 20.9996 2.6023 21 3V12.75C21.0017 14.2458 20.596 15.7137 19.8264 16.9964C19.0569 18.279 17.9526 19.3278 16.632 20.0303L12 22.5L7.368 20.0303C6.04745 19.3278 4.94313 18.279 4.17359 16.9964C3.40404 15.7137 2.99833 14.2458 3.00001 12.75V3C3.0004 2.6023 3.15857 2.221 3.43978 1.93978C3.721 1.65856 4.1023 1.5004 4.50001 1.5Z" fill="#2965AD" />
                                    </svg>
                                </span>
                                <h5 className="underline text-appprimary fw-semibold fs-5 ms-2">New Updates</h5>
                            </div>
                        </div>
                        <ul className="p-2 d-flex flex-row w-100" style={{ background: "var(--bs-gray-200)", listStyleType: "none", gap: "1.5rem" }}>
                            <li>New Rule 3B(6) Updates</li>
                            <li>New Rule 24(6) Updates</li>
                            <li>Rule 9A Update</li>
                            <li>Rule 21(2) Updates</li>
                            <li>Rule 42C(8) Updates</li>
                        </ul>
                    </div>
                </div>
            </div>
            <DashboardDataGrid />
        </div>
    );
}

export default VendorDashboard;
