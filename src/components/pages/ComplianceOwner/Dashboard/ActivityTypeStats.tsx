import React, { useEffect, useState } from "react";
import { useGetComplianceActivityTypeStats } from "../../../../backend/compliance";
import { DEFAULT_OPTIONS_PAYLOAD } from "../../../common/Table";
import { setUserDetailsInFilters } from "../../../../constants/Compliance.constants";
import { copyArray } from "../../../../utils/common";
import styles from "./ComplianceOwnerDashboard.module.css";

const colors: any = {};

export default function ActivityTypeStats({ filters }: any) {
    const [payload, setPayload] = useState<any>();
    const { stats, isFetching } = useGetComplianceActivityTypeStats(payload, hasFilters());
    const [activityTypeStats, setStats] = useState<any[]>([]);

    function hasFilters(field = 'startDateFrom') {
        const _filters = (payload || {}).filters || [];
        const column = _filters.find((x: any) => x.columnName === field);
        return Boolean((column || {}).value);
    }

    function getTagColor() {
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += Math.floor(Math.random() * 10);
        }
        return color;
    }

    useEffect(() => {
        if (filters) {
            setPayload({ ...DEFAULT_OPTIONS_PAYLOAD, filters: setUserDetailsInFilters(copyArray(filters)), pagination: null, sort: null });
        }
    }, [filters]);

    useEffect(() => {
        if (!isFetching && stats) {
            setStats(stats.map(({ key, value }: any) => {
                if (!colors[key]) {
                    colors[key] = getTagColor();
                }
                return { value: value || 0, label: key, style: { '--tag-color': colors[key] } as React.CSSProperties };
            }));
        }
    }, [isFetching]);

    return (
        <>
            <div className="d-flex flex-row mb-3 mx-2" style={{ gap: '0.75rem' }}>
                {
                    activityTypeStats.map(({ value, label, style }: any) => {
                        return (
                            <div className={styles.activityTypeTags} key={label} style={style}>
                                <div className="d-flex flex-row align-items-center gap-2 h-100">
                                    <label>{label}</label>
                                    <span>({value})</span>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </>
    )
}