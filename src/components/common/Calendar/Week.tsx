import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { CalendarProps, CalendarType } from "./Calendar.constants";
import Icon from '../Icon';
import styles from "./Calendar.module.css";
import { COMPLIANCE_ACTIVITY_INDICATION } from '../../../constants/Compliance.constants';
import { copyArray } from '../../../utils/common';

export default function Week(this: any, props: CalendarProps) {
    const { minDate, maxDate, handleChange, onDateSelection } = props;
    const [currentDate, setCurrentDate] = useState<Date>(dayjs().startOf('D').toDate());
    const [dateRange, setDateRange] = useState<any>();
    const [dates, setDates] = useState<any[]>([]);

    function handleNext() {
        const { from, to } = dateRange;
        const _from = new Date(from);
        const _to = new Date(to);
        _from.setDate(_from.getDate() + 7);
        _to.setDate(_to.getDate() + 7);
        setDateRange({ from: _from, to: _to });
    }

    function handlePrevious() {
        const { from, to } = dateRange;
        const _from = new Date(from);
        const _to = new Date(to);
        _from.setDate(_from.getDate() - 7);
        _to.setDate(_to.getDate() - 7);
        setDateRange({ from: _from, to: _to });
    }

    function generateDates(this: any, { from, to }: any) {
        const list: any[] = [];
        const date = new Date(from);
        while (date < to) {
            list.push({
                date: dayjs(date).toDate(),
                id: dayjs(date).format("YYYY-MM-DD")
            });
            date.setDate(date.getDate() + 1);
        }
        setDates(list);
        if (handleChange) {
            handleChange({ type: CalendarType.WEEK, dateRange, dates: list, dataChanged: handleDataChange.bind(this) });
        }
    }

    function handleDateSelection(date: any) {
        if (onDateSelection) {
            onDateSelection(new Date(date))
        }
    }

    function handleDataChange({ dates, data }: any) {
        const _dates = copyArray(dates).map((_dt: any) => {
            delete _dt.status;
            delete _dt.count;
            return _dt;
        });
        _dates.forEach((_dt: any) => {
            const x = data.find((x: any) => x.date === _dt.id);
            if (x) {
                _dt.status = x.activities[0].status;
                _dt.count = x.activities.reduce((total: any, activity: any): any => {
                    return total + activity.count;
                }, 0);
            }
        });
        setDates(_dates);
    }

    useEffect(() => {
        if (dateRange) {
            generateDates(dateRange);
        }
    }, [dateRange]);

    useEffect(() => {
        if (currentDate) {
            let day = currentDate.getDay();
            day = day - 1;
            if (day < 0) {
                day = 6;
            }

            const date = new Date();
            date.setDate(date.getDate() - day);
            const from = dayjs(date).startOf('D').toDate();
            date.setDate(date.getDate() + 6);
            const to = dayjs(date).endOf('D').toDate();
            setDateRange({ from, to })
        }
    }, [currentDate]);

    return (
        <>
            {
                dateRange &&
                <>
                    <div className={`d-flex flex-column align-items-center w-100 px-2 ${styles.ezycompCalendarHeader}`}>
                        <div className="mt-2">{dayjs(dateRange.from).format('MMM, YYYY')}</div>
                    </div>

                    <div className={`d-flex flex-row align-items-center w-100 px-2 pb-3 ${styles.ezycompCalendarHeader}`}>
                        <Icon name="angle-left" className="m-2 px-2" action={handlePrevious} />
                        <div className='d-flex flex-row align-items-center w-100'>
                            {
                                dates.map((date: any) => {
                                    return (
                                        <div className={styles.ezycompCalendarWeekDay} key={date.id}>
                                            {
                                                !!date.count &&
                                                <span className="dayBadge" style={{
                                                    backgroundColor: COMPLIANCE_ACTIVITY_INDICATION[date.status]
                                                }}>{date.count}</span>
                                            }
                                            <span onClick={() => handleDateSelection(date.date)}
                                                style={{ borderColor: COMPLIANCE_ACTIVITY_INDICATION[date.status] || 'transparent' }}>
                                                {dayjs(date.date).format('D')}
                                            </span>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <Icon name="angle-right" className="m-2 px-2" action={handleNext} />
                    </div>
                </>
            }
        </>
    )
}