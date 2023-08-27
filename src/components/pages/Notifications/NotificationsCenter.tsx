import React, { useEffect, useState } from "react";
import styles from "./Notifications.module.css";
import { Button } from "react-bootstrap";
import { DEFAULT_PAYLOAD } from "../../common/Table";
import { getUserDetails } from "../../../backend/auth";
import dayjs from "dayjs";
import NotificationCard from "./NotificationCard";
import { useGetAllNotifications } from "../../../backend/masters";

const Range: any = {
    LAST_10D: 'Last 10 Days',
    LAST_1W: 'Last 1 Week',
    LAST_1M: 'Last 1 Month',
    CUSTOM: 'Custom'
}

const Category: any = {
    PUSH: { value: 'Push', label: 'Push Notifications', key: 'pushCounts' },
    WORK: { value: 'Work', label: 'Work Notifications', key: 'workCounts' },
    BACKEND: { value: 'Backend', label: 'Backend Notifications', key: 'backEndCounts' }
}

export default function NotificationsCenter() {
    const [range, setRange] = useState(Range.LAST_10D);
    const [category, setCategory] = useState<any>();
    const [payload, setPayload] = useState<any>();
    const { notifications, counts, total, refetch } = useGetAllNotifications(payload, Boolean(payload));

    function handleRangeChange(_range: string) {
        if (range !== _range) {
            setRange(_range);
        }
    }

    function getDateRange(_range: string) {
        let from: any = new Date();
        let to: any = new Date();
        if (range === Range.LAST_10D) {
            from.setDate(from.getDate() - 10);
        } else if (range === Range.LAST_1W) {
            from.setDate(from.getDate() - 7);
        } else if (range === Range.LAST_1M) {
            from.setDate(from.getMonth() - 1);
        }
        return { fromDate: dayjs(from).startOf('D').toISOString(), toDate: dayjs(to).endOf('D').toISOString() }
    }

    function handleCategoryChange(_category: string) {
        setCategory(category !== _category ? _category : null);
    }

    useEffect(() => {
        if (range) {

        }
    }, [range]);

    useEffect(() => {
        const user = getUserDetails();
        const filters = [];
        filters.push({ columnName: 'UserId', value: user.userid });
        const { fromDate, toDate } = getDateRange(range || Range.LAST_10D);
        filters.push({ columnName: 'fromDate', value: fromDate });
        filters.push({ columnName: 'toDate', value: toDate });
        setPayload({ ...DEFAULT_PAYLOAD, filters });
    }, []);

    return (
        <>
            <div className="d-flex flex-column" >
                <div className="d-flex  p-2 align-items-center pageHeading shadow">
                    <h4 className="mb-0 ps-1 me-auto">Notification Center</h4>
                    <div className="d-flex align-items-end h-100 ms-3">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb mb-0 d-flex justify-content-end">
                                <li className="breadcrumb-item">Home</li>
                                <li className="breadcrumb-item">Notification Center</li>
                            </ol>
                        </nav>
                    </div>
                </div>
                <div className="d-flex flex-column gap-3 m-3">
                    <div className="d-flex flex-row gap-3">
                        {
                            Object.keys(Range).map((key: string, index: number) => {
                                return (
                                    <Button variant={range === Range[key] ? "primary" : "default"}
                                        className={range === Range[key] ? "no-shadow" : "bg-white"}
                                        onClick={() => handleRangeChange(Range[key])} key={index}>{Range[key]}</Button>
                                )
                            })
                        }
                    </div>
                    <div className="d-flex flex-row gap-3">
                        {
                            Object.values(Category).map(({ value, label, key }: any) => {
                                return (
                                    <Button variant={category === value ? "primary" : "outline-primary"}
                                        onClick={() => handleCategoryChange(value)} key={key}>{label} ({counts[key] || 0})</Button>
                                )
                            })
                        }
                    </div>
                </div>
                <div className={`d-flex flex-column m-0 py-2 bg-white ${styles.notificationsContainer}`}>
                    {
                        (notifications || []).map((notification: any) => {
                            return (
                                <NotificationCard key={notification.id} notification={notification} onSubmit={refetch} />
                            )
                        })
                    }
                </div>
            </div>
        </>
    )
}