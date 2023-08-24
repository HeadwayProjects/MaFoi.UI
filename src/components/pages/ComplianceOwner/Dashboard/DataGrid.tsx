import React, { useState } from "react"
import Calendar from "../../../common/Calendar/Calendar"
import DashboardCharts from "./DashboardCharts"
import ComplianceOwnerDashboardActivities from "./ComplianceOwnerDashboardActivities";
import styles from "./ComplianceOwnerDashboard.module.css";
import ComplianceOwnerActivities from "../TaskManagement/ComplianceOwnerActivities";
import { DashboardView } from "../Compliance.constants";
import OverallComplianceStatusCharts from "./OverallComplianceStatusCharts";

export default function DataGrid({ filters, view }: any) {
    const [changes, setChanges] = useState<any>(null);
    return (
        <>
            {
                view === DashboardView.CALENDAR &&
                <div className={styles.dashboardGrid}>
                    <div className={styles.dashboardGridCol1}>
                        <Calendar handleChange={setChanges} />
                        <ComplianceOwnerDashboardActivities {...changes} filters={filters} />
                    </div>
                    <div className={styles.dashboardGridCol2}>
                        {/* <DashboardCharts filters={filters} /> */}
                        <ComplianceOwnerActivities {...changes} filters={filters} />
                    </div>
                </div>
            }
            {
                view === DashboardView.CHART &&
                <>
                    <div className="d-flex flex-column card shadow p-3 mx-2 mb-3">
                        <OverallComplianceStatusCharts filters={filters} />
                    </div>
                    <div className="d-flex flex-column card shadow p-3 mx-2">
                        <DashboardCharts filters={filters} />
                    </div>
                </>
            }
        </>
    )
}