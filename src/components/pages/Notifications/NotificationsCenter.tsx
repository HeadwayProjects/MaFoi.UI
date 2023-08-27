import React, { useEffect, useState } from "react";
import styles from "./Notifications.module.css";
import { Button } from "react-bootstrap";
import { DEFAULT_PAYLOAD } from "../../common/Table";
import { getUserDetails } from "../../../backend/auth";
import dayjs from "dayjs";

const Range: any = {
    LAST_10D: 'Last 10 Days',
    LAST_1W: 'Last 1 Week',
    LAST_1M: 'Last 1 Month',
    CUSTOM: 'Custom'
}

export default function NotificationsCenter() {
    const [range, setRange] = useState(Range.LAST_10D);
    const [payload, setPayload] = useState<any>();

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

    useEffect(() => {
        if (range) {

        }
    }, [range]);

    useEffect(() => {
        const user = getUserDetails();
        const filters = [];
        filters.push({ columnName: 'user', value: user.userid });
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
                </div>
                <div className={`row m-0 py-2 bg-white ${styles.notificationsContainer}`}>
                    <div className="col-12">
                        {/* <div className="d-flex flex-row m-0 pb-2 justify-content-between align-items-end">
                            <OptionalLocations onChange={onLocationChange} />
                            <DashboardAdvanceFilters />
                        </div>
                        <DataGrid filters={filters} view={view} /> */}
                    </div>
                </div>
            </div>
        </>
    )
}