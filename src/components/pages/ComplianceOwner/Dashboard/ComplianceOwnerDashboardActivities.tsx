import React, { useState, useEffect } from "react";
import { CalendarType } from "../../../common/Calendar/Calendar.constants";
import { COMPLIANCE_ACTIVITY_INDICATION, COMPLIANCE_ACTIVITY_ORDER, ComplianceActivityStatus } from "../Compliance.constants";
import dayjs from "dayjs";
import styles from "./ComplianceOwnerDashboard.module.css";

export default function ComplianceOwnerDashboardActivities(props: { type: CalendarType, dateRange: { from: any, to: any }, dataChanged?: any }) {
    const { type, dateRange, dataChanged } = props;
    const [data, setData] = useState<any>([]);

    useEffect(() => {
        if (dateRange) {
            let _random = 0;
            if (type === CalendarType.DAY) {
                _random = Math.floor(Math.random() * (1 - 0)) + 0;
            } else if (type === CalendarType.WEEK) {
                _random = Math.floor(Math.random() * (5 - 1)) + 1;
            } else if (type === CalendarType.MONTH) {
                _random = Math.floor(Math.random() * (18 - 1)) + 1;
            }

            const _dates: any[] = [];
            for (let i = 0; i < _random; i++) {
                const d = dayjs(dateRange.from).toDate();
                let _r = 0;
                if (type === CalendarType.DAY) {
                    _r = Math.floor(Math.random() * 1);
                } else if (type === CalendarType.WEEK) {
                    _r = Math.floor(Math.random() * 7);
                } else if (type === CalendarType.MONTH) {
                    _r = Math.floor(Math.random() * 28);
                }
                d.setDate(d.getDate() + _r);
                if (!_dates.includes(d.toString())) {
                    _dates.push(d.toString());
                }
            }
            const _data: any[] = [];
            _dates.sort().forEach((date: any) => {
                const count = Math.floor(Math.random() * (5 - 1)) + 1
                const activities: any[] = [];
                for (let i = 0; i < count; i++) {
                    const index = Math.floor(Math.random() * 5);
                    const value = COMPLIANCE_ACTIVITY_ORDER[index];
                    if (value && !activities.find((x: any) => x.value === value)) {
                        activities.push({
                            value, count: Math.floor(Math.random() * 20) + 1
                        });
                    }
                }
                _data.push({
                    date,
                    activities
                });
            });
            setData(_data);
            if (dataChanged) {
                dataChanged(_data);
            }
        }
    }, [dateRange])

    return (
        <>
            {
                (data || []).length === 0 &&
                <div className="card shadow">No data</div>
            }
            {
                (data || []).length > 0 &&
                <div className="card shadow">
                    <div className="d-flex flex-column">
                        {
                            data.map((_d: any) => {
                                return (
                                    <div className={styles.activityItem} key={_d.date}>
                                        <div className="d-flex flex-row h-100" style={{ backgroundColor: COMPLIANCE_ACTIVITY_INDICATION[_d.activities[0].value] as any }}>
                                            <div className={`d-flex flex-column align-items-center w-100 justify-content-center ${styles.activityItemLeft}`}>
                                                <span className="fw-500">{dayjs(_d.date).format('ddd')}</span>
                                                <span className="text-xl fw-bold">{dayjs(_d.date).format('D')}</span>
                                            </div>
                                        </div>
                                        <div>
                                            {
                                                _d.activities.map((activity: any) => {
                                                    return (
                                                        <div key={activity.value}>
                                                            {
                                                                activity.value === ComplianceActivityStatus.PENDING &&
                                                                <>
                                                                    <div className="fw-bold">Pending Activities: {activity.count}</div>
                                                                    <div>Finish before the due date</div>
                                                                    <div>Days Left: 5</div>
                                                                </>
                                                            }
                                                            {
                                                                activity.value === ComplianceActivityStatus.OVERDUE &&
                                                                <>
                                                                    <div className="fw-bold">Overdue Activities: {activity.count}</div>
                                                                    <div>Immediate action required as this is the priority.</div>
                                                                </>
                                                            }
                                                            {
                                                                activity.value === ComplianceActivityStatus.REJECTED &&
                                                                <>
                                                                    <div className="fw-bold">Rejected Activities: {activity.count}</div>
                                                                    <div>Review and re submit, if applicable.</div>
                                                                </>
                                                            }
                                                            {
                                                                activity.value === ComplianceActivityStatus.SUBMITTED &&
                                                                <>
                                                                    <div className="fw-bold">Submitted Activities: {activity.count}</div>
                                                                </>
                                                            }
                                                            {
                                                                activity.value === ComplianceActivityStatus.AUDITED &&
                                                                <>
                                                                    <div className="fw-bold">Audited Activities: {activity.count}</div>
                                                                </>
                                                            }
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            }
        </>
    )
}