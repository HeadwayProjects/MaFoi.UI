import React, { useEffect, useState } from "react";
import { useGetComplianceActivityTypeStats } from "../../../../backend/compliance";
import { DEFAULT_OPTIONS_PAYLOAD } from "../../../common/Table";
import { setUserDetailsInFilters } from "../../../../constants/Compliance.constants";
import { copyArray } from "../../../../utils/common";
import styles from "./ComplianceOwnerDashboard.module.css";

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
        return { '--tag-color': color } as React.CSSProperties;
    }

    useEffect(() => {
        if (filters) {
            setPayload({ ...DEFAULT_OPTIONS_PAYLOAD, filters: setUserDetailsInFilters(copyArray(filters)), pagination: null, sort: null });
        }
    }, [filters]);

    useEffect(() => {
        if (!isFetching && stats) {
            setStats(stats.map(({ key, value }: any) => {
                return { value: value || 0, label: key, style: getTagColor() };
            }));
        }
    }, [isFetching]);

    return (
        <>
            <div className="d-flex flex-row gap-2 mb-3 mx-2">
                {
                    activityTypeStats.map(({ value, label, style }: any) => {
                        return (
                            <div className={styles.activityTypeTags} key={label} style={style}>
                                <div className="d-flex flex-row align-items-center gap-3 h-100">
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