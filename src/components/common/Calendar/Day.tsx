import React, { useState, useEffect } from 'react';
import { CalendarProps, CalendarType } from "./Calendar.constants";
import dayjs from 'dayjs';
import Icon from '../Icon';
import styles from "./Calendar.module.css"

export default function Day(props: CalendarProps) {
    const { minDate, maxDate, handleChange } = props;
    const [currentDate, setCurrentDate] = useState<Date>(dayjs().startOf('D').toDate());
    const [selectedDate, setSelectedDate] = useState<Date>(props.selectedDate || dayjs().startOf('D').toDate());

    function handleNext() {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + 1);
        if (maxDate && newDate > maxDate) {
            return;
        }
        setSelectedDate(newDate);
    }

    function handlePrevious() {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() - 1);
        if (minDate && minDate >= newDate) {
            return;
        }
        setSelectedDate(newDate);
    }

    useEffect(() => {
        if (selectedDate && handleChange) {
            handleChange({
                type: CalendarType.DAY, dateRange: {
                    from: selectedDate, to: dayjs(selectedDate).endOf('D').toDate()
                }
            });
        }
    }, [selectedDate]);

    return (
        <div className={`d-flex flex-row align-items-center p-2 ${styles.ezycompCalendarHeader}`}>
            <Icon name="angle-left" className="m-2 px-2" action={handlePrevious} disabled={minDate ? minDate > selectedDate : false} />
            <div className='d-flex flex-column align-items-center w-100 mx-auto'>
                <span className="text-xs">{dayjs(selectedDate).format('MMM')}</span>
                <span className="text-xl fw-700">{dayjs(selectedDate).format('D')}</span>
                <span className="text-xs">{dayjs(selectedDate).format('YYYY')}</span>
            </div>
            <Icon name="angle-right" className="m-2 px-2" action={handleNext} disabled={maxDate ? selectedDate > maxDate : false} />
        </div>
    )
}