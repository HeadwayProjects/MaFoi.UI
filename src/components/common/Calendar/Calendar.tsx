import React, { useState } from 'react';
import { CalendarProps, CalendarType } from "./Calendar.constants";
import Day from "./Day";
import Month from "./Month";
import Week from "./Week";
import styles from "./Calendar.module.css"
import { Tab, Tabs } from 'react-bootstrap';

export default function Calendar(props: CalendarProps) {
    const { type = CalendarType.WEEK, ...otherProps } = props;
    const [selectedtype, setType] = useState(type)
    const [selectedDate, setSelectedDate] = useState<any>();

    function handleDateSelection(date: any) {
        setSelectedDate(date);
        setType(CalendarType.DAY);
    }

    return (
        <>
            <Tabs className={styles.calendarTabs}
                activeKey={selectedtype}
                onSelect={(k: any) => setType(k)}>
                <Tab eventKey={CalendarType.DAY} title="Day" tabClassName={`${styles.calendarTab} ${selectedtype === CalendarType.DAY ? styles.active : ''}`} />
                <Tab eventKey={CalendarType.WEEK} title="Week" tabClassName={`${styles.calendarTab} ${selectedtype === CalendarType.WEEK ? styles.active : ''}`}/>
                <Tab eventKey={CalendarType.MONTH} title="Month"  tabClassName={`${styles.calendarTab} ${selectedtype === CalendarType.MONTH ? styles.active : ''}`} />
            </Tabs>
            <div className={`d-flex flex-column card shadow rounded-0 border-0 ${styles.ezycompCalendar}`}>
                {
                    selectedtype === CalendarType.DAY &&
                    <Day {...otherProps} selectedDate={selectedDate} />
                }
                {
                    selectedtype === CalendarType.WEEK &&
                    <Week {...otherProps} onDateSelection={handleDateSelection} />
                }
                {
                    selectedtype === CalendarType.MONTH &&
                    <Month {...otherProps} onDateSelection={handleDateSelection} />
                }
            </div>
        </>
    )
}