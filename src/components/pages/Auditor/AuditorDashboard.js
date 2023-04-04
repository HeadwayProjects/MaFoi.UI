import React from "react";
import AuditorPerformance from "./AuditorPerformance";
import VendorPerformance from "./VendorPerformance";
function AuditorDashboard() {
    return (
        <div>
            <div className="d-flex mb-4 p-2 align-items-center pageHeading">
                <div className="ps-4">
                    <h4 className="mb-0 ps-1">Auditor Dashboard</h4>
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

            {/* Dashboard Auditor starts */}
            <ul className="nav nav-tabs dashboardTabs mx-2" id="myTab" role="tablist">
                <li className="nav-item" role="presentation">
                    <button id="home-tab" type="button" role="tab"
                        className="nav-link active"
                        data-bs-toggle="tab" data-bs-target="#home-tab-pane"
                        aria-controls="home-tab-pane" aria-selected="true">
                        Auditor Performance
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button id="profile-tab" type="button" role="tab"
                        className="nav-link"
                        data-bs-toggle="tab" data-bs-target="#profile-tab-pane"
                        aria-controls="profile-tab-pane" aria-selected="false">
                        Vendor Performance
                    </button>
                </li>
            </ul>
            <div className="tab-content" id="myTabContent">
                <div id="home-tab-pane" tabindex="0" role="tabpanel"
                    className="tab-pane fade show active" aria-labelledby="home-tab">
                    <AuditorPerformance />
                </div>
                <div id="profile-tab-pane" tabindex="1"
                    role="tabpanel" className="tab-pane fade"
                    aria-labelledby="profile-tab">
                    <VendorPerformance />
                </div>
            </div>
        </div>
    );
}

export default AuditorDashboard;