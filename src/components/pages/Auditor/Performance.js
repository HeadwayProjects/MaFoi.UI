import React, { useEffect, useState } from "react";
import * as api from "../../../backend/request";
import * as auth from "../../../backend/auth";
import dayjs from "dayjs";
import NavTabs from "../../shared/NavTabs";
import Chart from "./Chart";

const CurrentPerformanceTabs = [
    { value: '0', label: 'Today' },
    { value: '7', label: 'This Week' },
    { value: '30', label: 'This Month' }
];
const PreviousPerformanceTabs = [
    { value: '1', label: ['Last', 'Month'] },
    { value: '3', label: ['Last', '3 Months'] },
    { value: '6', label: ['Last', '6 Months'] },
    { value: '12', label: ['Last', '12 Months'] }
];

function Performance({ current }) {
    const user = auth.getUserDetails() || {};
    const [title] = useState(current ? 'Auditor Current Performance' : 'Auditor Previous Performance');
    const [tabs] = useState(current ? CurrentPerformanceTabs : PreviousPerformanceTabs);
    const [frequency, setFrequency] = useState(current ? CurrentPerformanceTabs[0].value : PreviousPerformanceTabs[0].value);
    const [performanceStatus, setPerformanceStatus] = useState(null);
    const [label, setLabel] = useState('');

    function updatePerformance() {
        setLabel('');
        api.get(`/api/Auditor/GetPerformance?auditorId=${user.userid}&frequency=${frequency}`).then(response => {
            if (response && response.data) {
                const label = frequency !== '0' ?
                    `${dayjs(response.data.startDate).format('DD-MMM-YYYY')} - ${dayjs(response.data.endDate).format('DD-MMM-YYYY')}` :
                    `${dayjs(response.data.startDate).format('DD-MMM-YYYY')}`;
                setLabel(label);
                setPerformanceStatus(response.data);
            }
        });
    }

    useEffect(() => {
        if (frequency) {
            updatePerformance();
        }
    }, [frequency]);

    return (
        <div className="card">
            <div className="card-header bg-white border-0 underline text-appprimary fw-semibold fs-5 d-flex align-items-center">
                <div>
                    {
                        current ?
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 22V8H7V22H3ZM10 22V2H14V22H10ZM17 22V14H21V22H17Z" fill="#2965AD" />
                            </svg> :
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 22V8H5V22H1ZM8 22V2H12V22H8ZM15 22V14H19V22H15Z" fill="#2965AD" />
                                <path d="M24 6.5C24 7.95869 23.4205 9.35764 22.3891 10.3891C21.3576 11.4205 19.9587 12 18.5 12C17.0413 12 15.6424 11.4205 14.6109 10.3891C13.5795 9.35764 13 7.95869 13 6.5C13 5.04131 13.5795 3.64236 14.6109 2.61091C15.6424 1.57946 17.0413 1 18.5 1C19.9587 1 21.3576 1.57946 22.3891 2.61091C23.4205 3.64236 24 5.04131 24 6.5ZM16.707 5L17.354 4.354C17.4479 4.26011 17.5006 4.13278 17.5006 4C17.5006 3.86722 17.4479 3.73989 17.354 3.646C17.2601 3.55211 17.1328 3.49937 17 3.49937C16.8672 3.49937 16.7399 3.55211 16.646 3.646L15.146 5.146C15.0994 5.19245 15.0625 5.24762 15.0373 5.30837C15.0121 5.36911 14.9991 5.43423 14.9991 5.5C14.9991 5.56577 15.0121 5.63089 15.0373 5.69163C15.0625 5.75238 15.0994 5.80755 15.146 5.854L16.646 7.354C16.7399 7.44789 16.8672 7.50063 17 7.50063C17.1328 7.50063 17.2601 7.44789 17.354 7.354C17.4479 7.26011 17.5006 7.13278 17.5006 7C17.5006 6.86722 17.4479 6.73989 17.354 6.646L16.707 6H18.75C19.0455 6 19.3381 6.0582 19.611 6.17127C19.884 6.28434 20.1321 6.45008 20.341 6.65901C20.5499 6.86794 20.7157 7.11598 20.8287 7.38896C20.9418 7.66194 21 7.95453 21 8.25V8.5C21 8.63261 21.0527 8.75979 21.1464 8.85355C21.2402 8.94732 21.3674 9 21.5 9C21.6326 9 21.7598 8.94732 21.8536 8.85355C21.9473 8.75979 22 8.63261 22 8.5V8.25C22 7.38805 21.6576 6.5614 21.0481 5.9519C20.4386 5.34241 19.612 5 18.75 5H16.707Z" fill="#2965AD" />
                            </svg>
                    }
                </div>
                <div className="mx-2">
                    {title}
                </div>
            </div>
            <div className="card-body">
                {
                    tabs &&
                    <NavTabs list={tabs} onTabChange={(tab) => { setFrequency(tab) }} />
                }
                <div className="tab-content" id="VendorContent">
                    <div className="tab-pane fade show active" role="tabpanel">
                        <div className="my-3">
                            <div className="text-center mb-3 dashboard-date-range-label">
                                {label && <strong className="text-primary">({label})</strong>}
                            </div>
                            <div className="row m-0 vendorPerformance-cards">
                                <Chart data={performanceStatus} keys={['audited', 'notAudited']} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Performance;