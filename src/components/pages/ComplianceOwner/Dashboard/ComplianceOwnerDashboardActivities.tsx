import React, { useState, useEffect, useRef } from "react";
import { CalendarType } from "../../../common/Calendar/Calendar.constants";
import { COMPLIANCE_ACTIVITY_INDICATION, COMPLIANCE_ACTIVITY_ORDER, ComplianceActivityStatus, setUserDetailsInFilters } from "../../../../constants/Compliance.constants";
import dayjs from "dayjs";
import styles from "./ComplianceOwnerDashboard.module.css";
import { DEFAULT_OPTIONS_PAYLOAD } from "../../../common/Table";
import { useGetComplianceByDate } from "../../../../backend/compliance";
import { copyArray, toBackendDateFormat } from "../../../../utils/common";
import { sortBy } from "underscore";
import { hasUserAccess } from "../../../../backend/auth";
import { USER_PRIVILEGES } from "../../UserManagement/Roles/RoleConfiguration";

type Props = {
    type: CalendarType,
    dateRange: { from: any, to: any },
    dataChanged?: any,
    filters?: any[],
    dates?: any[]
}

export default function ComplianceOwnerDashboardActivities(props: Props) {
    const isEscalationManager = hasUserAccess(USER_PRIVILEGES.ESCALATION_DASHBOARD);
    const { type, dateRange, dates, dataChanged, filters } = props;
    const [data, setData] = useState<any>([]);
    const [payload, setPayload] = useState<any>(null);
    const payloadRef = useRef<any>();
    payloadRef.current = payload;
    const { groups, isFetching } = useGetComplianceByDate(payload, enableStatusApi());

    function enableStatusApi() {
        const hasCompany = hasFilters('companyId');
        const hasStartDate = hasFilters();
        return isEscalationManager ? hasCompany && hasStartDate : hasStartDate;
    }

    function StatusTmpl({ activity }: any) {
        return (
            <div key={activity.status} className="mb-2">
                {
                    activity.status === ComplianceActivityStatus.DUE &&
                    <>
                        <div className="fw-bold">Pending Activities: {activity.count}</div>
                        <div>Finish before the due date</div>
                        <div className="text-md fw-bold fst-italic text-warn">Days Left: {activity.diff} {activity.diff < 2 ? 'day' : 'days'}</div>
                    </>
                }
                {
                    activity.status === ComplianceActivityStatus.NON_COMPLIANT &&
                    <>
                        <div className="fw-bold">Non-Compliant Activities: {activity.count}</div>
                        <div>These are on high priority and need immediate action.</div>
                        <div className="text-md fw-bold fst-italic text-error">Overdue for: {activity.diff} {activity.diff < 2 ? 'day' : 'days'}</div>
                    </>
                }
                {
                    activity.status === ComplianceActivityStatus.REJECTED &&
                    <>
                        <div className="fw-bold">Rejected Activities: {activity.count}</div>
                        <div>Review and re submit, if applicable.</div>
                    </>
                }
                {
                    activity.status === ComplianceActivityStatus.PENDING &&
                    <>
                        <div className="fw-bold">Submitted Activities: {activity.count}</div>
                    </>
                }
                {
                    activity.status === ComplianceActivityStatus.APPROVED &&
                    <>
                        <div className="fw-bold">Approved Activities: {activity.count}</div>
                    </>
                }
            </div>
        )
    }

    function hasFilters(field = 'startDateFrom') {
        const _filters = (payloadRef.current || {}).filters || [];
        const column = _filters.find((x: any) => x.columnName === field);
        return Boolean((column || {}).value);
    }

    useEffect(() => {
        if (dateRange && filters) {
            const _filters = copyArray(filters);
            const fromIndex = _filters.findIndex((x: any) => x.columnName.toLowerCase() === 'startdatefrom');
            const fromDate = toBackendDateFormat(dateRange.from);
            if (fromIndex === -1) {
                _filters.push({ columnName: 'startDateFrom', value: fromDate });
            } else {
                _filters[fromIndex].value = fromDate;
            }
            const toIndex = _filters.findIndex((x: any) => x.columnName.toLowerCase() === 'startdateto');
            const toDate = toBackendDateFormat(dateRange.to);
            if (toIndex === -1) {
                _filters.push({ columnName: 'startDateTo', value: toDate });
            } else {
                _filters[toIndex].value = toDate;
            }
            setPayload({ ...DEFAULT_OPTIONS_PAYLOAD, filters: setUserDetailsInFilters(_filters), pagination: null, sort: null });
        }
    }, [dateRange, filters])

    useEffect(() => {
        if (!isFetching && groups) {
            const _data: any[] = [];
            const _groups: any = groups.map((group: any) => {
                const [dd, mm, yyyy] = group.date.split('-');
                return {
                    ...group,
                    date: `${yyyy}-${mm}-${dd}`
                }
            }).sort((a: any, b: any) => {
                return new Date(a.date) > new Date(b.date) ? 1 : -1
            });
            _groups.forEach((group: any) => {
                const activities = group.activities.sort((a: any, b: any) => {
                    const v1 = a.status;
                    const v2 = b.status;
                    return COMPLIANCE_ACTIVITY_ORDER.indexOf(v1) > COMPLIANCE_ACTIVITY_ORDER.indexOf(v2) ? 1 : -1
                })

                _data.push({
                    date: group.date,
                    activities: activities.map((x: any) => {
                        if (x.status === ComplianceActivityStatus.DUE) {
                            const currentDate = dayjs(new Date()).startOf('D').toDate();
                            const diff = dayjs(group.date).diff(currentDate, 'd');
                            x.diff = diff + 1;
                        } else if (x.status === ComplianceActivityStatus.NON_COMPLIANT) {
                            const currentDate = dayjs(new Date()).startOf('D').toDate();
                            const diff = dayjs(group.date).diff(currentDate, 'd');
                            x.diff = (diff * -1) + 1;
                        }
                        return x;
                    })
                });
            });
            setData(_data);
            if (dataChanged) {
                dataChanged({ dates, data: _data });
            }
        }
    }, [isFetching]);

    return (
        <>
            {
                (data || []).length === 0 &&
                <div className="card shadow align-items-center justify-content-center h-100">
                    <span className="fst-italic text-black-600">No data available</span>
                </div>
            }
            {
                (data || []).length > 0 &&
                <div className={`card shadow overflow-auto ${type === CalendarType.MONTH ? 'mt-2' : ''}`}>
                    <div className="d-flex flex-column">
                        {
                            data.map((_d: any) => {
                                return (
                                    <div className={styles.activityItem} key={_d.date}>
                                        <div className="d-flex flex-row h-100" style={{ backgroundColor: COMPLIANCE_ACTIVITY_INDICATION[_d.activities[0].status] as any }}>
                                            <div className={`d-flex flex-column align-items-center w-100 justify-content-center ${styles.activityItemLeft}`}>
                                                <span className="fw-500">{dayjs(_d.date).format('ddd')}</span>
                                                <span className="text-xl fw-bold">{dayjs(_d.date).format('D')}</span>
                                            </div>
                                        </div>
                                        <div>
                                            {
                                                _d.activities.map((activity: any) => {
                                                    return (<StatusTmpl activity={activity} key={activity.status} />)
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