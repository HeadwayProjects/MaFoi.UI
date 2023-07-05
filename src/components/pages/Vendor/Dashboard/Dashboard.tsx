import React, { useState } from "react";
import DashboardDataGrid from "./DashboardDataGrid";
import Preview from "../../../common/Preview";
import Icon from "../../../common/Icon";

function VendorDashboard() {
    const [showPreview, setShowPreview] = useState(false);
    const [documentUrl, setDocumentUrl] = useState(null);
    const [updates] = useState([
        {
            label: 'New Rule 3B(6) Updates',
            documentUrl: 'https://ezycomp.blob.core.windows.net/todofiles/1f5756d1-f195-46ad-8ed0-caa53bc76b00/ede00f75-200f-4d8f-bde0-1953f30906ce/03676b64-b2ce-4cbd-b601-27d5c9b01122/2023/February/FORM XV.pdf'
        },
        {
            label: 'New Rule 24(6) Updates',
            documentUrl: 'https://ezycomp.blob.core.windows.net/todofiles/1f5756d1-f195-46ad-8ed0-caa53bc76b00/ede00f75-200f-4d8f-bde0-1953f30906ce/03676b64-b2ce-4cbd-b601-27d5c9b01122/2023/February/FORM XV.pdf'
        },
        {
            label: 'Rule 9A Update',
            documentUrl: 'https://ezycomp.blob.core.windows.net/todofiles/1f5756d1-f195-46ad-8ed0-caa53bc76b00/ede00f75-200f-4d8f-bde0-1953f30906ce/03676b64-b2ce-4cbd-b601-27d5c9b01122/2023/February/FORM XV.pdf'
        }
    ]);

    function onPreview(update: any) {
        setDocumentUrl(update.documentUrl);
        setShowPreview(true);
    }

    return (
        <div className="d-flex flex-column bg-dashboard" style={{ paddingBottom: '44px' }}>
            <div className="d-flex  p-2 align-items-center pageHeading shadow">
                <h4 className="mb-0 ps-1">Vendor-Dashboard</h4>
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
                    <div className="card shadow border-0 p-0 updates-card mt-2 shadow-lg">
                        <div className="card-body">
                            <div className="d-flex position-absolute updates-header">
                                <Icon name="update-flag" />
                                <div className="underline text-lg ms-2">New Updates</div>
                            </div>
                            <ul className="d-flex flex-row w-100 updates mb-0" style={{ listStyleType: "none", gap: "1.5rem" }}>
                                {
                                    updates && updates.map((update, index) => {
                                        return (
                                            <li key={index} onClick={() => onPreview(update)}>{update.label}</li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <DashboardDataGrid />
            {
                showPreview && documentUrl &&
                <Preview documentUrl={documentUrl} onClose={() => setShowPreview(false)} />
            }
        </div>
    );
}

export default VendorDashboard;
