import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { CalendarProps, CalendarType } from "./Calendar.constants";
import Icon from '../Icon';
import styles from "./Calendar.module.css";

export default function Week(props: CalendarProps) {
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

    function generateDates({ from, to }: any) {
        const list: any[] = [];
        const date = new Date(from);
        while (date < to) {
            list.push({
                date: dayjs(date).toDate(),
                id: dayjs(date).toISOString()
            });
            date.setDate(date.getDate() + 1);
        }
        setDates(list);
    }

    function handleDateSelection(date: any) {
        if (onDateSelection) {
            onDateSelection(date)
        }
    }

    function handleDataChange(_data: any) {

    }

    useEffect(() => {
        if (dateRange) {
            generateDates(dateRange);
            if (handleChange) {
                handleChange({type: CalendarType.WEEK, dateRange, dataChanged: (e: any) => handleDataChange(e)});
            }
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
            const from  = dayjs(date).startOf('D').toDate();
            date.setDate(date.getDate() + 6);
            const to  = dayjs(date).endOf('D').toDate();
            // const from = dayjs(currentDate).startOf('w').toDate();
            // const to = dayjs(currentDate).endOf('w').toDate();
            // from.setDate(from.getDate() + 1);
            // to.setDate(to.getDate() + 1);
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
                                            <span onClick={() => handleDateSelection(date.date)}>{dayjs(date.date).format('D')}</span>
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