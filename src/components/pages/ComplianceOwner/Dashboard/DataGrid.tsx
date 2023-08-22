import React, { useState } from "react"
import Calendar from "../../../common/Calendar/Calendar"
import DashboardCharts from "./DashboardCharts"
import ComplianceOwnerDashboardActivities from "./ComplianceOwnerDashboardActivities";
import styles from "./ComplianceOwnerDashboard.module.css";
import ComplianceOwnerActivities from "../TaskManagement/ComplianceOwnerActivities";

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
                    <ComplianceOwnerActivities {...changes} filters={filters} />
                </div>
            </div>
        </>
    )
}