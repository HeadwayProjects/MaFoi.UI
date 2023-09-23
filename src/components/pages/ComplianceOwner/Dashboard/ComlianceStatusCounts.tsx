import React, { useEffect, useState } from "react";
import { useGetOverallComplianceStatus } from "../../../../backend/compliance";
import { ComplianceActivityStatus, ComplianceStatusMapping, setUserDetailsInFilters } from "../../../../constants/Compliance.constants";
import { DEFAULT_PAYLOAD } from "../../../common/Table";

const STATUSES = [
    { name: ComplianceActivityStatus.DUE },
    { name: ComplianceActivityStatus.NON_COMPLIANT },
    { name: ComplianceActivityStatus.PENDING },
    { name: ComplianceActivityStatus.REJECTED }
]

export default function ComlianceStatusCounts({ filters, counts }: any) {
    const [payload, setPayload] = useState<any>();
    const { response = {} } = useGetOverallComplianceStatus(payload, Boolean(payload && hasFilters()));

    function hasFilters(field = 'startDateFrom') {
        const _filters = (payload || {}).filters || [];
        const filter = _filters.find((x: any) => x.columnName === field);
        return Boolean(filter);
    }

    function getCounts(status: string) {
        if (!counts || counts.length === 0) {
            return 0;
        }
        const { value } = counts.find(({ key }: any) => key === status) || {};
        return value || 0;
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
            <div className="d-flex flex-row gap-2 align-items-center mb-2 mt-1">
                {
                    STATUSES.map(({ name }: any) => {
                        return (
                            <div key={name} className={`d-flex flex-row align-items-center gap-2 rounded-2 text-white text-md fw-bold p-2 bg-compliance-status-${name}`}>
                                <span>{ComplianceStatusMapping[name]}</span>
                                <span>({getCounts(name)})</span>
                            </div>
                        )
                    })
                }
            </div>
        </>
    )
}