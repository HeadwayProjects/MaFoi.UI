import React, { useEffect, useState, useRef } from "react";
import { Button, Dropdown, DropdownButton } from "react-bootstrap";
import styles from "./DateRangeFilter.module.css";
import DatePicker from "react-multi-date-picker";
import dayjs from "dayjs";

function getYears() {
    const year = new Date().getFullYear();
    let years = [];
    for (let i = 0; i < 5; i++) {
        years.push(year - i);
    }
    return years.map(year => {
        const f = year + 1;
        return { value: year, label: `FY ${year}-${(f + '').substring(2)}`, from: year, to: f }
    });
}

const Quarters = [
    { value: 'q1', label: 'Q1', from: '04-01', to: '06-30', fromYear: 'from', toYear: 'from' },
    { value: 'q2', label: 'Q2', from: '07-01', to: '09-30', fromYear: 'from', toYear: 'from' },
    { value: 'q3', label: 'Q3', from: '10-01', to: '12-31', fromYear: 'from', toYear: 'from' },
    { value: 'q4', label: 'Q4', from: '01-01', to: '03-31', fromYear: 'to', toYear: 'to' }
];

export default function DateRangeFilter({ onDateRangeChange }: any) {
    const datePickerRef = useRef<any>();
    const [fys] = useState(getYears());
    const [fy, setFY] = useState<any>({});
    const [quarter, setQ] = useState<any>({});
    const [customDate, setCustomDate] = useState<any>();
    const customDateRef = useRef();
    customDateRef.current = customDate;
    const [memory, setMemory] = useState<any>();

    function handleFYSelection(year: any) {
        setFY(year);
        setQ({});
        const { from, to } = year;
        const fromDate = new Date(`04-01-${from}`);
        const toDate = new Date(`03-31-${to}`);
        setMemory({ year, q: {} });
        setCustomDate(undefined);
        onDateRangeChange({ startDateFrom: dayjs(fromDate).toISOString(), startDateTo: dayjs(toDate).toISOString() });
    }

    function handleQuarterSelection(q: any) {
        if (!fy.value) return;
        if (quarter.value !== q.value) {
            setQ(q);
            const fromDate = new Date(`${q.from}-${fy[q.fromYear]}`);
            const toDate = new Date(`${q.to}-${fy[q.toYear]}`);
            setMemory({ ...memory, q });
            onDateRangeChange({ startDateFrom: dayjs(fromDate).toISOString(), startDateTo: dayjs(toDate).toISOString() });
        } else {
            setQ({});
            const { from, to }: any = fy;
            const fromDate = new Date(`04-01-${from}`);
            const toDate = new Date(`03-31-${to}`);
            setMemory({ year: fy, q: {} });
            setCustomDate(undefined);
            onDateRangeChange({ startDateFrom: dayjs(fromDate).toISOString(), startDateTo: dayjs(toDate).toISOString() });
        }
    }

    function handleClearSelection(event: any) {
        setCustomDate(undefined);
        setFY(memory.year);
        setQ(memory.q);
        datePickerRef.current.closeCalendar();
    }

    function handleDateRangeSelection() {
        datePickerRef.current.closeCalendar();
        if (customDateRef.current) {
            setFY({ label: 'Select' });
            setQ({});
            let _fromDate, _toDate;
            if (Array.isArray(customDateRef.current)) {
                _fromDate = new Date(customDateRef.current[0]);
                _toDate = new Date(customDateRef.current[1] || customDateRef.current[0]);
            } else {
                _fromDate = new Date(customDateRef.current);
                _toDate = new Date(customDateRef.current);
            }
            onDateRangeChange({
                startDateFrom: dayjs(_fromDate).startOf('D').toISOString(),
                startDateTo: dayjs(_toDate).endOf('D').toISOString()
            });
        }
    }

    useEffect(() => {
        if (fys) {
            setFY(fys[0]);
            setMemory({ year: fys[0], q: {} });
            handleFYSelection(fys[0]);
        }
    }, [fys]);

    return (
        <div className="d-flex flex-row mx-2 mb-3 mt-4 pt-2">
            <DropdownButton title={fy.label || 'Select'} variant="primary" className="me-3">
                {
                    fys.map((year: any) => {
                        return (
                            <Dropdown.Item onClick={() => handleFYSelection(year)}
                                className="my-1" key={year.value}>
                                {year.label}
                            </Dropdown.Item>
                        )
                    })
                }
            </DropdownButton>
            {
                Quarters.map((q: any) => {
                    return (
                        <span key={q.value} className={`${styles.qButtons} mx-2 ${q.value === quarter.value ? styles.qButtonSelected : ''} ${fy.value ? '' : styles.qButtonDisabled}`}
                            onClick={() => handleQuarterSelection(q)}>
                            {q.label}
                        </span>
                    )
                })
            }
            <div className="date-picker">
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
    )
}