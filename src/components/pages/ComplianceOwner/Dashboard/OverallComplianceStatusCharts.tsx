import React, { useEffect, useState } from "react";
import { useGetOverallComplianceStatus } from "../../../../backend/compliance";
import { DEFAULT_PAYLOAD } from "../../../common/Table";
import { ComplianceChartStatus, setUserDetailsInFilters } from "../Compliance.constants";
import styles from "./ComplianceOwnerDashboard.module.css";
import ComplianceStatusChart from "./ComplianceStatusChart";
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
    const [payload, setPayload] = useState<any>();
    const { response } = useGetOverallComplianceStatus(payload, Boolean(payload));

    useEffect(() => {
        if (filters) {
            const _payload = { ...DEFAULT_PAYLOAD, ...payload };
            const _fs = Object.keys(filters).map((columnName: string) => {
                return { columnName, value: filters[columnName] }
            });
            setPayload({
                ..._payload, filters: setUserDetailsInFilters(_fs, true)
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
                            <ComplianceStatusChart data={response} fields={fields} key={id} />
                        )
                    })
                }
            </div>
        </>
    )
}