import React, { useState } from "react"
import Calendar from "../../../common/Calendar/Calendar"
import DashboardCharts from "./DashboardCharts"
import ComplianceOwnerDashboardActivities from "./ComplianceOwnerDashboardActivities";
import styles from "./ComplianceOwnerDashboard.module.css";
import ComplianceActivities from "../TaskManagement/ComplianceActivities";

export default function DataGrid({ filters }: any) {
    const [changes, setChanges] = useState<any>(null);
    return (
        <>
            <div className={styles.dashboardGrid}>
                <div className={styles.dashboardGridCol1}>
                    <Calendar handleChange={setChanges} />
                    <ComplianceOwnerDashboardActivities {...changes} filters={filters} />
                </div>
                <div className={styles.dashboardGridCol2}>
                    <DashboardCharts filters={filters} />
                    <ComplianceActivities {...changes} filters={filters} />
                </div>
            </div>
        </>
    )
}