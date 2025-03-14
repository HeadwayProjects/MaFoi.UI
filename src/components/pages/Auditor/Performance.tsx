import React, { useEffect, useState } from "react";
import * as auth from "../../../backend/auth";
import dayjs from "dayjs";
import Chart from "./Chart";
import { useGetAuditorPerformance } from "../../../backend/auditor";

const PerformanceTabs = [
    { value: 'Today', label: 'Today' },
    { value: 'ThisWeek', label: 'This Week' },
    { value: 'ThisMonth', label: 'This Month' },
    { value: 'LastMonth', label: ['Last Month'] },
    { value: 'Last3Months', label: ['3 Months'] },
    { value: 'Last6Months', label: ['6 Months'] },
    { value: 'Last12Months', label: ['12 Months'] }
];

function Performance() {
    const user = auth.getUserDetails() || {};
    const [frequency, setFrequency] = useState(PerformanceTabs[0].value);
    const [label, setLabel] = useState('');
    const { auditorPerformance, isFetching } = useGetAuditorPerformance(user.userid, frequency);

    function onFrequencyChange(e: any) {
        console.log(e.target.value)
        setFrequency(e.target.value)
    }

    useEffect(() => {
        if (!isFetching && auditorPerformance) {
            console.log(auditorPerformance)
            const label = frequency !== 'Today' ?
                `${dayjs(auditorPerformance.startDate).format('DD-MMM-YYYY')} - ${dayjs(auditorPerformance.endDate).format('DD-MMM-YYYY')}` :
                `${dayjs(auditorPerformance.startDate).format('DD-MMM-YYYY')}`;
                console.log(label)
            setLabel(label);
        }
    }, [isFetching])

    return (
        <div className="">
            <div className="card-header bg-white border-0 underline text-appprimary fw-semibold fs-5 d-flex align-items-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 22V8H7V22H3ZM10 22V2H14V22H10ZM17 22V14H21V22H17Z" fill="#2965AD" />
                </svg>
                <div className="mx-2">Performance</div>
            </div>
            <div className="card-body pt-0">
                <div className="d-flex flex-row">
                    <div className="col-11 mx-auto mt-3">
                        <div className="d-flex flex-row">
                            <div className="col-3 py-2 ps-3">
                                {
                                    PerformanceTabs.map(tab => {
                                        return (
                                            <div className="form-check mb-3" key={tab.value}>
                                                <input className="form-check-input" type="radio" name="frequency" checked={frequency === tab.value}
                                                    id={'frequency' + tab.value} onChange={onFrequencyChange} value={tab.value} />
                                                <label className="form-check-label" htmlFor={'frequency' + tab.value}>{tab.label}</label>
                                            </div>
                                        )
                                    })
                                }

                            </div>
                            <div className="col-1"></div>
                            <div className="col-8">
                                <div className="text-center mt-3 dashboard-date-range-label">
                                    {label && <strong className="text-primary">({label})</strong>}
                                </div>
                                <div className="row m-0">
                                    {!isFetching && auditorPerformance && <Chart data={auditorPerformance} keys={['audited', 'notAudited']} />}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Performance;