import React, { useState } from "react"
import Calendar from "../../../common/Calendar/Calendar"
import DashboardCharts from "./DashboardCharts"
import ComplianceOwnerDashboardActivities from "./ComplianceOwnerDashboardActivities";
import styles from "./ComplianceOwnerDashboard.module.css";

export default function DataGrid(props: any) {
    const [changes, setChanges] = useState<any>(null);
    return (
        <>
            <div className="d-flex flex-row px-2 gap-4">
                <div className="d-flex flex-column">
                    <div className={styles.dashboardCol1}>
                        <Calendar handleChange={setChanges} />
                        <ComplianceOwnerDashboardActivities {...changes} />
                    </div>
                </div>
                <div className="d-flex flex-column w-100">
                    <DashboardCharts />
                </div>
            </div>
        </>
    )
}