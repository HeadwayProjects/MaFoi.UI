import React, { useState, useEffect, useRef } from "react";
import OverallComplianceStatusCharts from "./OverallComplianceStatusCharts";
import DashboardCharts from "./DashboardCharts";
import { Dropdown, DropdownButton } from "react-bootstrap";
import dayjs from "dayjs";
import styles from "./ComplianceOwnerDashboard.module.css";

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
]


export default function ComplianceDashboardCharts({ filters }: any) {
    const [fys] = useState(getYears());
    const [fy, setFY] = useState<any>();
    const [quarter, setQ] = useState<any>({});
    const [payload, setPayload] = useState<any>();

    function handleFYSelection(year: any) {
        setFY(year);
        const { from, to } = year;
        const fromDate = new Date(`04-01-${from}`);
        const toDate = new Date(`03-31-${to}`);
        setQ({});
        setPayload({ ...filters, fromDate: dayjs(fromDate).toISOString(), toDate: dayjs(toDate).toISOString() })
    }

    function handleQuarterSelection(q: any) {
        if (quarter.value !== q.value) {
            setQ(q);
            const fromDate = new Date(`${q.from}-${fy[q.fromYear]}`);
            const toDate = new Date(`${q.to}-${fy[q.toYear]}`);
            setPayload({ ...filters, fromDate: dayjs(fromDate).toISOString(), toDate: dayjs(toDate).toISOString() });
        }
    }

    useEffect(() => {
        if (fys) {
            setFY(fys[0]);
            handleFYSelection(fys[0]);
        }
    }, [fys]);

    useEffect(() => {
        if (filters) {
            handleFYSelection(fy || fys[0])
        }
    }, [filters])

    return (
        <>
            <div className="d-flex flex-row mx-2 mb-3 mt-2">
                {
                    Boolean(fy) &&
                    <DropdownButton title={fy.label} variant="primary" className="me-3">
                        {
                            fys.map((year: any) => {
                                return (
                                    <Dropdown.Item onClick={() => handleFYSelection(year)} className="my-1" key={year.value}>{year.label}</Dropdown.Item>
                                )
                            })
                        }
                    </DropdownButton>
                }
                {
                    Boolean(fy) &&
                    <>
                        {
                            Quarters.map((q: any) => {
                                return (
                                    <span key={q.value} className={`${styles.qButtons} mx-2 ${q.value === quarter.value ? styles.qButtonSelected : ''}`}
                                        onClick={() => handleQuarterSelection(q)}>
                                        {q.label}
                                    </span>
                                )
                            })
                        }
                    </>
                }
            </div>
            <div className="d-flex flex-column card shadow p-3 mx-2 mb-3">
                <OverallComplianceStatusCharts filters={payload} />
            </div>
            <div className="d-flex flex-column card shadow p-3 mx-2">
                <DashboardCharts filters={payload} />
            </div>
        </>
    )
}