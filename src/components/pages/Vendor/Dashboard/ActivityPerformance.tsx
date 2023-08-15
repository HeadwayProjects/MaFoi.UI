import React, { useEffect, useState } from "react";
import * as api from '../../../../backend/request';
import * as dayjs from 'dayjs';
import * as utc from "dayjs/plugin/utc";
import "./dashboard.css";
import Chart from "./Chart";
import { DEFAULT_PAYLOAD } from "../../../common/Table";
import { ACTIVITY_TYPE, API_DELIMITER } from "../../../../utils/constants";
dayjs.extend(utc as any);

const PerformanceTabs = [
    { value: '0', label: 'Today' },
    { value: '7', label: 'This Week' },
    { value: '1', label: ['Last', 'Month'] },
    { value: '3', label: ['3 Months'] },
    { value: '6', label: ['6 Months'] },
    { value: '12', label: ['12 Months'] }
];

const Statuses = [
    { label: 'Activities Saved', key: 'activitiesSaved', className: 'gray-bg', value: 'ActivitySaved' },
    { label: 'Pending', key: 'pending', className: 'yellow-bg', value: 'Pending' },
    { label: 'Over Due', key: 'overDue', className: 'medium-red-bg', value: 'Overdue' },
    { label: 'Submitted', key: 'submitted', className: 'light-green-bg', value: 'Submitted' },
    { label: 'Audited', key: 'approved', className: 'green-bg', value: 'Audited' },
    { label: 'Rejected', key: 'rejected', className: 'red-bg', value: 'Rejected' }
]

function ActivityPerformance({ current, selectedCompany, selectedAssociateCompany, selectedLocation }: any) {
    const [title] = useState('Performance');
    const [frequency, setFrequency] = useState(PerformanceTabs[0].value);
    const [performanceStatus, setPerformanceStatus] = useState<any>({});
    const [auditData, setAuditData] = useState<any>({});
    const [physicalAuditData, setPhysicalAuditData] = useState<any>({});
    const [label, setLabel] = useState('');

    function updatePerformance() {
        setLabel('');
        if (selectedCompany && selectedAssociateCompany && selectedLocation) {
            const filters = [
                { columnName: 'companyId', value: selectedCompany },
                { columnName: 'associateCompanyId', value: selectedAssociateCompany },
                { columnName: 'locationId', value: selectedLocation },
                { columnName: 'frequency', value: frequency }
            ];
            api.post('/api/Dashboard/GetPreviousPerformance', { ...DEFAULT_PAYLOAD, filters }).then(response => {
                if (response && response.data) {
                    const label = frequency !== '0' ?
                        `${dayjs(response.data.startDate).format('DD-MMM-YYYY')} - ${dayjs(response.data.endDate).format('DD-MMM-YYYY')}` :
                        `${dayjs(response.data.startDate).format('DD-MMM-YYYY')}`;
                    setLabel(label);
                    setPerformanceStatus(response.data);
                }
            });
            api.post('/api/Dashboard/GetPreviousPerformance', {
                ...DEFAULT_PAYLOAD, filters:
                    [...filters, { columnName: 'auditType', value: ACTIVITY_TYPE.AUDIT }]
            }).then(response => {
                if (response && response.data) {
                    setAuditData(response.data);
                }
            });
            api.post('/api/Dashboard/GetPreviousPerformance', {
                ...DEFAULT_PAYLOAD, filters:
                    [...filters, { columnName: 'auditType', value: ACTIVITY_TYPE.PHYSICAL_AUDIT }]
            }).then(response => {
                if (response && response.data) {
                    setPhysicalAuditData(response.data);
                }
            });
        }
    }

    // function viewActivities(status) {
    //     navigate(`${getBasePath()}/dashboard/activities`, {
    //         state: {
    //             company: selectedCompany,
    //             associateCompany: selectedAssociateCompany,
    //             location: selectedLocation,
    //             fromDate: dayjs(performanceStatus.startDate).local().format(),
    //             toDate: dayjs(performanceStatus.endDate).local().format(),
    //             status
    //         }
    //     });
    // }

    function onFrequencyChange(e: any) {
        setFrequency(e.target.value)
    }

    useEffect(() => {
        if (selectedCompany && selectedAssociateCompany && selectedLocation) {
            updatePerformance();
        }
    }, [selectedCompany, selectedAssociateCompany, selectedLocation]);

    useEffect(() => {
        if (frequency) {
            updatePerformance();
        }
    }, [frequency]);

    return (
        <div className="card shadow">
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
            <div className="card-body pt-0">
                <div className="d-flex justify-content-center">
                    <div className="d-flex flex-row">
                        {
                            PerformanceTabs.map(tab => {
                                return (
                                    <div className="form-check mx-2" key={tab.value}>
                                        <input className="form-check-input" type="radio" name="frequency" checked={frequency === tab.value}
                                            id={'frequency' + tab.value} onChange={onFrequencyChange} value={tab.value} />
                                        <label className="form-check-label" htmlFor={'frequency' + tab.value}>{tab.label}</label>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div className="row m-0">
                    <div className="col-7 mt-3">
                        <div className="d-flex flex-column justify-content-center">
                            <div className="text-center mb-3 dashboard-date-range-label">
                                {label && <strong className="text-primary">({label})</strong>}
                            </div>
                            <div className="d-flex flex-row flex-wrap">
                                {
                                    Statuses.map(status => {
                                        return (
                                            <div className="w-33 mb-3 me-3" key={status.key} style={{ width: "calc(33% - 1rem)" }}>
                                                <div className={`card cardCount border-0 p-2 ${status.className}`}>
                                                    <div className="card-body py-0">
                                                        <div className="row d-flex align-items-center performance-status h-100">
                                                            <div className="col-9 px-0 py-0 overflow-hidden">
                                                                <label>{status.label}</label>
                                                            </div>
                                                            <div className="col-3 px-1 py-1">
                                                                {
                                                                    typeof performanceStatus[status.key] !== 'undefined' &&
                                                                    <div className="p-0 m-0 text-lg">({performanceStatus[status.key]})</div>
                                                                }
                                                            </div>
                                                            {/* <div className="col-1 px-0 py-0">
                                                                    <span style={{ zoom: 1.5, cursor: 'pointer', background: 'transparent' }}
                                                                        onClick={() => viewActivities(status.value)}>
                                                                        <FontAwesomeIcon className={status.color} icon={faChevronCircleRight} />
                                                                    </span>
                                                                </div> */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    <div className="col-5">
                        {
                            (performanceStatus.approved > 0 || performanceStatus.rejected > 0) &&
                            <Chart data={performanceStatus} keys={['compliant', 'nonCompliant', 'notApplicable', 'rejected']} />
                        }
                    </div>
                </div>
                <div className="row m-0">
                    {
                        (auditData.approved > 0 || auditData.rejected > 0) &&
                        <div className="col-5 mt-3">
                            <div className="text-center mb-3 dashboard-date-range-label">
                                <strong className="text-primary">Type: Audit</strong>
                            </div>
                            <Chart data={auditData} keys={['compliant', 'nonCompliant', 'notApplicable', 'rejected']} />

                        </div>
                    }
                    {
                        (physicalAuditData.approved > 0 || physicalAuditData.rejected > 0) &&
                        <>
                            {
                                <div className="col-2"></div>
                            }

                            <div className="col-5 mt-3">
                                <div className="text-center mb-3 dashboard-date-range-label">
                                    <strong className="text-primary">Type: Physical Audit</strong>
                                </div>
                                <Chart data={physicalAuditData} keys={['compliant', 'nonCompliant', 'notApplicable', 'rejected']} />
                            </div>
                        </>
                    }
                </div>
            </div>
        </div>
    )
}

export default ActivityPerformance;