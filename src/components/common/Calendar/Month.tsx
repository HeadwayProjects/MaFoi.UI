import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { CalendarProps, CalendarType } from "./Calendar.constants";
import styles from "./Calendar.module.css";
import Icon from '../Icon';

const WeekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function Month(props: CalendarProps) {
    const { minDate, maxDate, handleChange, onDateSelection } = props;
    const [currentMonth, setCurrentMonth] = useState<Date>(dayjs().startOf('M').toDate());
    const [selectedMonth, setSelectedMonth] = useState<Date>(dayjs().startOf('M').toDate());
    const [dateRange, setDateRange] = useState<any>();
    const [dates, setDates] = useState<any[]>([]);

    function handleNext() {
        const date = new Date(selectedMonth);
        date.setMonth(date.getMonth() + 1);
        setSelectedMonth(date);
    }

    function handlePrevious() {
        const date = new Date(selectedMonth);
        date.setMonth(date.getMonth() - 1);
        setSelectedMonth(date);
    }

    function handleDateSelection(date: any) {
        if (onDateSelection) {
            onDateSelection(date)
        }
    }

    function generateDates({ from, to }: any) {
        const list: any[] = [];
        const startDate = dayjs(from).toDate();
        while (startDate.getDay() !== 1) {
            startDate.setDate(startDate.getDate() - 1);
        }
        const date = dayjs(startDate).startOf('D').toDate();
        const endDate = dayjs(to).endOf('M').toDate();
        while (endDate.getDay() !== 0) {
            endDate.setDate(endDate.getDate() + 1);
        }
        while (date < endDate) {
            list.push({
                date: dayjs(date).toDate(),
                id: dayjs(date).toISOString()
            });
            date.setDate(date.getDate() + 1);
        }

        setDates(list);
    }

    useEffect(() => {
        if (dateRange) {
            generateDates(dateRange);
            if (handleChange) {
                handleChange({type: CalendarType.MONTH, dateRange});
            }
        }
    }, [dateRange]);

    useEffect(() => {
        if (selectedMonth) {
            const from = dayjs(selectedMonth).startOf('M').toDate();
            const to = dayjs(selectedMonth).endOf('M').toDate();
            setDateRange({ from, to })
        }
    }, [selectedMonth]);

    return (
        <>
            {
                dateRange &&
                <>
                    <div className={`d-flex flex-row align-items-center px-2 ${styles.ezycompCalendarHeader}`}>
                        <Icon name="angle-left" className="m-2 px-2" action={handlePrevious} />
                        <div className="mx-auto">{dayjs(dateRange.from).format('MMM, YYYY')}</div>
                        <Icon name="angle-right" className="m-2 px-2" action={handleNext} />
                    </div>
                    <div className={`d-flex flex-column align-items-center w-100 px-2 pb-3`}>
                        <div className={styles.ezycompMonthCalendar}>
                            {
                                WeekDays.map((day: any) => {
                                    return (
                                        <span key={day} className={`${styles.ezycompCalendarMonthDay} fw-bold`}>{day}</span>
                                    )
                                })
                            }
                        </div>
                        <div className={styles.ezycompMonthCalendar}>
                            {
                                dates.map((date: any) => {
                                    return (
                                        <div className={styles.ezycompCalendarMonthDay} key={date.id}>
                                            <span onClick={() => handleDateSelection(date.date)}
                                                style={{ opacity: (date.date < dateRange.from || date.date > dateRange.to) ? 0.5 : 1 }}>
                                                {dayjs(date.date).format('D')}
                                            </span>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </>
            }
        </>
    )
}