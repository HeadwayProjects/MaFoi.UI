import React, { useEffect, useState } from "react";
import { useGetOverallComplianceStatus } from "../../../../backend/compliance";
import { DEFAULT_PAYLOAD } from "../../../common/Table";
import { ComplianceChartStatus, setUserDetailsInFilters } from "../Compliance.constants";
import styles from "./ComplianceOwnerDashboard.module.css";
import ComplianceStatusChart1 from "./ComplianceStatusChart1";
import ComplianceStatusChart2 from "./ComplianceStatusChart2";
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
    const [payload, setPayload] = useState<any>({ ...DEFAULT_PAYLOAD, pagination: null, filters: setUserDetailsInFilters([], true) });
    const { response, isFetching } = useGetOverallComplianceStatus(payload, Boolean(payload));
    const [d1, setD1] = useState<any>(null);
    const [d2, setD2] = useState<any>(null);

    useEffect(() => {
        if (filters) {
            const _filters = [...filters];
            setUserDetailsInFilters(_filters, true);
            setPayload({ ...payload, filters: _filters });
        }
    }, [filters]);

    useEffect(() => {
        if (!isFetching && response) {
            console.log(response);
            setD1(response);
            setD2(response);
        }
    }, [isFetching]);

    return (
        <>
            <div className="mb-2 text-appprimary text-xl fw-bold">Overall Compliance Status</div>
            <div className="fw-bold">Total Activities: {(response || {}).total || 0}</div>
            <div className={styles.overallChartGrid}>
                {
                    Boolean(d1) &&
                    <ComplianceStatusChart1 data={d1} fields={keys[0].fields} />
                }
                {
                    Boolean(d2) &&
                    <ComplianceStatusChart2 data={d2} fields={keys[1].fields} />
                }
            </div>
        </>
    )
}