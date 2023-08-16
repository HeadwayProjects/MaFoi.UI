import React, { useState } from "react";
import Icon from "../../../common/Icon";
import DataGrid from "./DataGrid";
import styles from "./ComplianceOwnerDashboard.module.css";
import OptionalLocations from "../../../common/OptionalLocations";

enum DashboardView {
    CALENDAR = 'calendar',
    CHART = 'chart'
}

function ComplianceOwnerDashboard() {
    const [view, setView] = useState(DashboardView.CALENDAR);

    function onLocationChange(event: any) {
        console.log(event)
    }

    return (
        <div className="d-flex flex-column" >
            <div className="d-flex  p-2 align-items-center pageHeading shadow">
                <h4 className="mb-0 ps-1 me-auto">Compliance Dashboard</h4>
                <div className="d-flex align-items-end h-100">
                    <Icon className="me-2" name="chart" style={{ opacity: view === DashboardView.CALENDAR ? 0.5 : 1 }}
                        action={() => setView(DashboardView.CHART)} />
                    <Icon className="ms-2" name="calendar" style={{ opacity: view === DashboardView.CHART ? 0.5 : 1 }}
                        action={() => setView(DashboardView.CALENDAR)} />
                </div>
                <div className="d-flex align-items-end h-100 ms-3">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0 d-flex justify-content-end">
                            <li className="breadcrumb-item">Home</li>
                            <li className="breadcrumb-item">Dashboard</li>
                        </ol>
                    </nav>
                </div>
            </div>
            <div className={`row m-0 py-2 bg-white ${styles.dashboardContainer}`}>
                <div className="col-12">
                    <div className="d-flex flex-row m-0 pb-2">
                        <OptionalLocations onChange={onLocationChange}/>
                        {/* <Location onChange={onLocationChange} /> */}
                        {/* <div className="col-5">
                            <AdvanceSearch fields={[FILTERS.MONTH, FILTERS.SUBMITTED_DATE]} payload={getAdvanceSearchPayload()} onSubmit={search}
                                downloadReport={downloadReport} />
                        </div> */}
                    </div>
                    <DataGrid />
                </div>
            </div>
        </div>
    );
}

export default ComplianceOwnerDashboard;
