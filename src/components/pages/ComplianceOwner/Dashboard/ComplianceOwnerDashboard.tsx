import React, { useRef, useState } from "react";
import Icon from "../../../common/Icon";
import DataGrid from "./DataGrid";
import styles from "./ComplianceOwnerDashboard.module.css";
import OptionalLocations from "../../../common/OptionalLocations";
import { DashboardView } from "../Compliance.constants";
import { Button } from "react-bootstrap";
import DashboardAdvanceFilters from "./DashboardAdvanceFilters";

function ComplianceOwnerDashboard() {
    const [view, setView] = useState(DashboardView.CALENDAR);
    const [locationFilter, setLocationFilter] = useState<any>({});
    const lfRef = useRef<any>();
    lfRef.current = locationFilter;
    const [filters, setFilters] = useState<any>(null);

    function onLocationChange(event: any) {
        setLocationFilter(event);
        setFilters(event);
    }

    function handleFilterChange(event: any) {
        setFilters({...lfRef.current, ...event});
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
                    <div className="d-flex flex-row m-0 pb-2 justify-content-between align-items-end">
                        <OptionalLocations onChange={onLocationChange} />
                        <DashboardAdvanceFilters onChange={handleFilterChange} />
                    </div>
                    <DataGrid filters={filters} view={view} />
                </div>
            </div>
        </div>
    );
}

export default ComplianceOwnerDashboard;
