import React from "react";
import OverallComplianceStatusCharts from "./OverallComplianceStatusCharts";
import DashboardCharts from "./DashboardCharts";

export default function ComplianceDashboardCharts({ filters }: any) {
    return (
        <>
            <div className="d-flex flex-column card shadow p-3 mx-2 mb-3">
                <OverallComplianceStatusCharts filters={filters} />
            </div>
            <div className="d-flex flex-column card shadow p-3 mx-2">
                <DashboardCharts filters={filters} />
            </div>
        </>
    )
}