import React, { useState } from "react"
import Calendar from "../../../common/Calendar/Calendar"
import DashboardCharts from "./DashboardCharts"
import styles from "./ComplianceManagerDashboard.module.css";
import ComplianceManagerDashboardActivities from "./ComplianceManagerDashboardActivities";
import ComplianceManagerActivities from "../TaskManagement/ComplianceManagerActivities";

export default function DataGrid({ filters }: any) {
    const [changes, setChanges] = useState<any>(null);
    return (
        <>
            <div className={styles.dashboardGrid}>
                <div className={styles.dashboardGridCol1}>
                    <Calendar handleChange={setChanges} />
                    <ComplianceManagerDashboardActivities {...changes} filters={filters} />
                </div>
                <div className={styles.dashboardGridCol2}>
                    <DashboardCharts filters={filters} />
                    <ComplianceManagerActivities {...changes} filters={filters} />
                </div>
            </div>
        </>
    )
}