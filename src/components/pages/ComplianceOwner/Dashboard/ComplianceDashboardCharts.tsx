import React from "react";
import OverallComplianceStatusCharts from "./OverallComplianceStatusCharts";
import DashboardCharts from "./DashboardCharts";
import { Button } from "react-bootstrap";
import Icon from "../../../common/Icon";
import { useExportComplianceDashbard } from "../../../../backend/compliance";
import { copyArray, downloadFileContent } from "../../../../utils/common";
import { toast } from "react-toastify";
import { ERROR_MESSAGES } from "../../../../utils/constants";
import { DEFAULT_PAYLOAD } from "./../../../common/Table";
import PageLoader from "../../../shared/PageLoader";
import { setUserDetailsInFilters } from "../../../../constants/Compliance.constants";
import { hasUserAccess } from "../../../../backend/auth";
import { USER_PRIVILEGES } from "../../UserManagement/Roles/RoleConfiguration";

export default function ComplianceDashboardCharts({ filters }: any) {
    const isEscalationManager = hasUserAccess(USER_PRIVILEGES.ESCALATION_DASHBOARD);
    const { exportDashboard, exporting }: any = useExportComplianceDashbard((response: any) => {
        downloadFileContent({
            name: 'ComplianceDashboard.pdf',
            type: response.headers['content-type'],
            content: response.data
        });
    }, () => {
        toast.error(ERROR_MESSAGES.DEFAULT)
    });

    function enableActivities() {
        const _filters = setUserDetailsInFilters(copyArray(filters))
        const hasCompany = hasFilters(_filters);
        const hasStartDate = hasFilters(_filters, 'startDateFrom');
        return isEscalationManager ? hasCompany && hasStartDate : hasStartDate;
    }

    function hasFilters(ref: any, field = 'companyId') {
        const column = (ref || []).find((x: any) => x.columnName === field);
        return Boolean((column || {}).value);
    }

    function handleExport() {
        if (enableActivities()) {
            exportDashboard({ ...DEFAULT_PAYLOAD, filters: setUserDetailsInFilters(filters), pagination: null })
        }
    }

    return (
        <>
            <div className="d-flex flex-row mx-2 mb-3">
                <Button variant="primary" onClick={handleExport} disabled={!enableActivities()}> <Icon name="download" /> Export</Button>
            </div>
            <div className="d-flex flex-column card shadow p-3 mx-2 mb-3">
                <OverallComplianceStatusCharts filters={filters} />
            </div>
            <div className="d-flex flex-column card shadow p-3 mx-2">
                <DashboardCharts filters={filters} />
            </div>
            {
                exporting && <PageLoader message="Preparing data..." />
            }
        </>
    )
}