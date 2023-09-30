import React, { useState } from "react"
import Calendar from "../../../common/Calendar/Calendar"
import ComplianceOwnerDashboardActivities from "./ComplianceOwnerDashboardActivities";
import styles from "./ComplianceOwnerDashboard.module.css";
import ComplianceOwnerActivities from "../TaskManagement/ComplianceOwnerActivities";
import { DashboardView } from "../../../../constants/Compliance.constants";
import ComplianceDashboardCharts from "./ComplianceDashboardCharts";
import Icon from "../../../common/Icon";

export default function DataGrid({ filters, view, handleCounts }: any) {
    const [changes, setChanges] = useState<any>(null);
    const [showCalendar, setShow] = useState(true);
    return (
        <>
            {
                view === DashboardView.CALENDAR &&
                <div className={`${styles.dashboardGrid} mx-2 ${showCalendar ? '' : 'hideCalendar'}`}>
                    <div className={styles.dashboardGridCol1}>
                        <Calendar handleChange={setChanges} />
                        <ComplianceOwnerDashboardActivities {...changes} filters={filters} />
                    </div>
                    <div className={styles.dashboardGridCol2}>
                        <ComplianceOwnerActivities filters={filters} handleCounts={handleCounts} />
                    </div>
                    <div className={styles.expandCollapseIcon} >
                        <Icon name={showCalendar ? 'double-left' : 'double-right'} action={() => setShow(!showCalendar)} />
                    </div>
                </div>
            }
            {
                view === DashboardView.CHART && <ComplianceDashboardCharts filters={filters} />
            }
        </>
    )
}