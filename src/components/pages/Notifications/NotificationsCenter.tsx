import React, { useEffect, useState, useRef } from "react";
import styles from "./Notifications.module.css";
import { Button } from "react-bootstrap";
import { DEFAULT_PAYLOAD, PageNav, Pagination } from "../../common/Table";
import { getUserDetails } from "../../../backend/auth";
import dayjs from "dayjs";
import NotificationCard from "./NotificationCard";
import { useGetAllNotifications } from "../../../backend/masters";
import DatePicker from "react-multi-date-picker";
import { humanReadableNumber } from "../../../utils/common";

const Range: any = {
    LAST_10D: 'Last 10 Days',
    LAST_1W: 'Last 1 Week',
    LAST_1M: 'Last 1 Month'
}

const Category: any = {
    PUSH: { value: 'Push', label: 'Push Notifications', key: 'pushCounts' },
    WORK: { value: 'Work', label: 'Work Notifications', key: 'workCounts' },
    BACKEND: { value: 'Backend', label: 'Backend Notifications', key: 'backEndCounts' }
}

export default function NotificationsCenter() {
    const datePickerRef = useRef<any>();
    const [range, setRange] = useState(Range.LAST_10D);
    const [category, setCategory] = useState<any>();
    const [payload, setPayload] = useState<any>();
    const [customDate, setCustomDate] = useState<any>();
    const customDateRef = useRef();
    customDateRef.current = customDate;
    const [dateRange, setDateRange] = useState<any>();
    const { notifications, counts, total, refetch, isFetching }: any = useGetAllNotifications(payload, Boolean(payload));

    // Pagination
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [pageSize, setPageSize] = useState({ value: 25, label: 25 });
    const [pageCounter, setPageCounter] = useState('');

    function handlePageSizeChange(e: any) {
        setPageSize(e);
        setPage(1);
        setPayload({
            ...payload, pagination: {
                pageNumber: 1, pageSize: e.value
            }
        });
    }

    function handlePageNav(pageNav: string) {
        let _page = 1;
        switch (pageNav) {
            case PageNav.FIRST:
                _page = 1;
                break;
            case PageNav.PREVIOUS:
                _page = page - 1;
                break;
            case PageNav.NEXT:
                _page = page + 1;
                break;
            case PageNav.LAST:
                _page = lastPage * 1;
                break;
            default:
                break;
        }
        setPage(_page);
        setPayload({
            ...payload, pagination: {
                pageNumber: _page, pageSize: pageSize.value
            }
        });
    }

    function handleRangeChange(_range: string) {
        if (range !== _range) {
            setRange(_range);
            setCustomDate(null);
        }
    }

    function getDateRange(_range: string) {
        if (!_range) {
            return {};
        }
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

    function handleClearSelection(event: any) {
        setCustomDate(undefined);
        setDateRange(undefined);
        setRange(Range.LAST_10D);
        datePickerRef.current.closeCalendar();
    }

    function handleDateRangeSelection() {
        setRange(undefined);
        datePickerRef.current.closeCalendar();
        if (customDateRef.current) {
            const _filters = [...payload.filters];
            const fromDate = _filters.find(({ columnName }: any) => columnName === 'fromDate');
            const toDate = _filters.find(({ columnName }: any) => columnName === 'toDate');
            let _fromDate, _toDate;
            if (Array.isArray(customDateRef.current)) {
                _fromDate = new Date(customDateRef.current[0]);
                _toDate = new Date(customDateRef.current[1] || customDateRef.current[0]);
            } else {
                _fromDate = new Date(customDateRef.current);
                _toDate = new Date(customDateRef.current);
            }
            setDateRange({ fromDate: _fromDate, toDate: _toDate });
            if (fromDate) {
                fromDate.value = dayjs(_fromDate).startOf('D').local().format();
            }
            if (toDate) {
                toDate.value = dayjs(_toDate).endOf('D').local().format();
            }
            setPage(1);
            setPayload({
                ...payload, filters: _filters, pagination: {
                    pageSize: pageSize.value,
                    pageNumber: 1
                }
            });
        }
    }

    useEffect(() => {
        if (range || category) {
            const user = getUserDetails();
            const filters = [];
            filters.push({ columnName: 'UserId', value: user.userid });
            const { fromDate, toDate } = range ? getDateRange(range) : dateRange;
            if (fromDate) {
                filters.push({ columnName: 'fromDate', value: fromDate });
            }
            if (toDate) {
                filters.push({ columnName: 'toDate', value: toDate });
            }
            if (category) {
                filters.push({ columnName: 'category', value: category });
            }
            setPage(1);
            setPayload({
                ...DEFAULT_PAYLOAD, filters, pagination: {
                    pageSize: pageSize.value,
                    pageNumber: 1
                }
            });
        }
    }, [range, category]);

    useEffect(() => {
        if (!isFetching && notifications) {
            const _lastPage = Math.ceil(total / (pageSize.value || 1)) || 1;
            setLastPage(_lastPage);
            const startIndex = (page - 1) * pageSize.value + 1;
            const lastIndex = page * pageSize.value;
            setPageCounter(total ? `Showing ${startIndex} - ${lastIndex > total ? total : lastIndex} of ${humanReadableNumber(total || 0)} records` : '');
        }
    }, [isFetching])

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
                        <div className="date-picker col-3">
                            <DatePicker ref={datePickerRef} range={true}
                                format={'DD/MM/YYYY'} value={customDate}
                                className="date-field" placeholder="Custom Date Range"
                                onChange={setCustomDate}>
                                <div className="d-flex flex-row justify-content-center gap-2 mb-2">
                                    <Button variant="link" onClick={handleClearSelection}>Clear</Button>
                                    <Button variant="primary" onClick={handleDateRangeSelection} disabled={!customDate}>Select</Button>
                                </div>
                            </DatePicker>
                        </div>
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
                {
                    Boolean(pageCounter) &&
                    <div className="d-flex flex-row w-100">
                        <Pagination pageCounter={pageCounter} page={page} lastPage={lastPage} pageSize={pageSize}
                            handlePageSizeChange={handlePageSizeChange} handlePageNav={handlePageNav} className="position-relative" />
                    </div>
                }
            </div>
        </>
    )
}