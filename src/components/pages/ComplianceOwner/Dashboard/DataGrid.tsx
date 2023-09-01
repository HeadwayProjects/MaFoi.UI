import React, { useState } from "react"
import Calendar from "../../../common/Calendar/Calendar"
import ComplianceOwnerDashboardActivities from "./ComplianceOwnerDashboardActivities";
import styles from "./ComplianceOwnerDashboard.module.css";
import ComplianceOwnerActivities from "../TaskManagement/ComplianceOwnerActivities";
import { DashboardView } from "../../../../constants/Compliance.constants";
import ComplianceDashboardCharts from "./ComplianceDashboardCharts";

export default function DataGrid({ filters, view }: any) {
    const [changes, setChanges] = useState<any>(null);
    return (
        <>
            {
                view === DashboardView.CALENDAR &&
                <div className={`${styles.dashboardGrid} mx-2`}>
                    <div className={styles.dashboardGridCol1}>
                        <Calendar handleChange={setChanges} />
                        <ComplianceOwnerDashboardActivities {...changes} filters={filters} />
                    </div>
                    <div className={styles.dashboardGridCol2}>
                        <ComplianceOwnerActivities {...changes} filters={filters} />
                    </div>
                </div>
            }
            {
                view === DashboardView.CHART && <ComplianceDashboardCharts filters={filters}/>
            }
        </>
    )
}