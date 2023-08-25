import React from "react";
import styles from "./Notifications.module.css";

export default function NotificationsCenter() {
    return (
        <>
            <div className="d-flex flex-column" >
                <div className="d-flex  p-2 align-items-center pageHeading shadow">
                    <h4 className="mb-0 ps-1 me-auto">Notification Center</h4>
                    <div className="d-flex align-items-end h-100 ms-3">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb mb-0 d-flex justify-content-end">
                                <li className="breadcrumb-item">Home</li>
                                <li className="breadcrumb-item">Notification Center</li>
                            </ol>
                        </nav>
                    </div>
                </div>
                <div className={`row m-0 py-2 bg-white ${styles.notificationsContainer}`}>
                    <div className="col-12">
                        {/* <div className="d-flex flex-row m-0 pb-2 justify-content-between align-items-end">
                            <OptionalLocations onChange={onLocationChange} />
                            <DashboardAdvanceFilters />
                        </div>
                        <DataGrid filters={filters} view={view} /> */}
                    </div>
                </div>
            </div>
        </>
    )
}