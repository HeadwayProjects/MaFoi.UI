import React, { useEffect, useState } from "react";
import { useGetOverallComplianceStatus } from "../../../../backend/compliance";
import { DEFAULT_PAYLOAD } from "../../../common/Table";
import { ComplianceChartStatus, setUserDetailsInFilters } from "../../../../constants/Compliance.constants";
import styles from "./ComplianceOwnerDashboard.module.css";
import ComplianceStatusChart from "./ComplianceStatusChart";
import { hasUserAccess } from "../../../../backend/auth";
import { USER_PRIVILEGES } from "../../UserManagement/Roles/RoleConfiguration";
const keys = [
    {
        id: 'col1',
        fields: [ComplianceChartStatus.ON_TIME, ComplianceChartStatus.LATE, ComplianceChartStatus.NON_COMPLIANT]
    },
    {
        id: 'col2',
        fields: [ComplianceChartStatus.DUE, ComplianceChartStatus.PENDING]
    }
]

export default function OverallComplianceStatusCharts({ filters }: any) {
    const isEscalationManager = hasUserAccess(USER_PRIVILEGES.ESCALATION_DASHBOARD);
    const [payload, setPayload] = useState<any>();
    const { response } = useGetOverallComplianceStatus(payload, enableStatusApi());

    function enableStatusApi() {
        const hasCompany = hasFilters('companyId');
        const hasStartDate = hasFilters();
        return isEscalationManager ? hasCompany && hasStartDate : hasStartDate;
    }

    function hasFilters( field = 'startDateFrom') {
        const _filters = (payload || {}).filters || [];
        const filter = _filters.find((x: any) => x.columnName === field);
        return Boolean(filter);
    }

    useEffect(() => {
        if (filters) {
            const _payload = { ...DEFAULT_PAYLOAD, ...payload };
            setPayload({
                ..._payload, filters: setUserDetailsInFilters(filters)
            });
        }
    }, [filters]);

    return (
        <>
            <div className="mb-2 text-appprimary text-xl fw-bold">Overall Compliance Status</div>
            <div className="fw-bold">Total Activities: {(response || {}).total || 0}</div>
            <div className={styles.overallChartGrid}>
                {
                    keys.map(({ id, fields }: any) => {
                        return (
                            <ComplianceStatusChart data={response} fields={fields} key={id} type={id} />
                        )
                    })
                }
            </div>
        </>
    )
}