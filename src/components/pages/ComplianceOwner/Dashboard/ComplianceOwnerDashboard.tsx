import React, { useRef, useState } from "react";
import Icon from "../../../common/Icon";
import DataGrid from "./DataGrid";
import styles from "./ComplianceOwnerDashboard.module.css";
import { DashboardView } from "../../../../constants/Compliance.constants";
import ComplianceAdvanceFilters from "./ComlianceAdvanceFilters";
import ComplianceOwnerFilters from "../ComplianceOwnerFilters";
import { sortBy } from "underscore";
import { ACTIONS } from "../../../common/Constants";
import ComplianceReport from "./ComplianceReport";

function ComplianceOwnerDashboard() {
    const [action, setAction] = useState(ACTIONS.NONE);
    const [view, setView] = useState(DashboardView.CALENDAR);
    const [compFilters, setCompFilters] = useState<any>([]);
    const [advFilters, setAdvFilters] = useState<any>([]);
    const advFiltersRef = useRef<any>();
    advFiltersRef.current = advFilters;
    const compFiltersRef = useRef<any>();
    compFiltersRef.current = compFilters;
    const [filters, setFilters] = useState<any>(null);
    const [counts, setCounts] = useState<any[]>([]);

    function handleFilterChanges(event: any) {
        setCompFilters(event);
        setFilters(sortBy([...event, ...advFiltersRef.current], 'columnName'));
    }

    function handleAdvanceFilterChanges(event: any) {
        setAdvFilters(event);
        setFilters(sortBy([...event, ...compFiltersRef.current], 'columnName'));
    }

    return (
        <>
            <div className="d-flex flex-column" >
                <div className="d-flex  p-2 align-items-center pageHeading shadow">
                    <h4 className="mb-0 ps-1 me-4">Compliance Dashboard</h4>
                    <div className="d-flex align-items-center h-100 ms-4 me-auto gap-2">
                        <Icon name="calendar" style={{ opacity: view === DashboardView.CHART ? 0.5 : 1 }}
                            action={() => setView(DashboardView.CALENDAR)} />
                        <div className="border h-75"></div>
                        <Icon name="chart" style={{ opacity: view === DashboardView.CALENDAR ? 0.5 : 1 }}
                            action={() => setView(DashboardView.CHART)} />
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
                        <div className="d-flex flex-row m-0 pb-2 justify-content-between align-items-end position-relative mb-2">
                            <ComplianceOwnerFilters onFilterChange={handleFilterChanges} view={view} counts={counts} />
                            <ComplianceAdvanceFilters onChange={handleAdvanceFilterChanges} />
                        </div>
                        <DataGrid filters={filters} view={view} handleCounts={setCounts} />
                    </div>
                </div>
            </div>
            <div className={`${styles.downloadReportIcon} shadow`}>
                <Icon name="report" text={'Compliance Report'} action={() => setAction(ACTIONS.EXPORT)} />
            </div>
            {
                action === ACTIONS.EXPORT &&
                <ComplianceReport onCancel={() => setAction(ACTIONS.NONE)} />
            }
        </>  
    );
}

export default ComplianceOwnerDashboard;
