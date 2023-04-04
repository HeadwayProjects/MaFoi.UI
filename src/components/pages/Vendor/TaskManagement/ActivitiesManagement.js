import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { sortBy } from "underscore";
import SubmitToAuditorModal from "./SubmitToAuditorModal";
import * as api from "../../../../backend/request";
import Select from 'react-select';
import EditActivityModal from "./EditActivityModal";
import { toast } from 'react-toastify';
import PageLoader from "../../../shared/PageLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faSearch, faUpload } from "@fortawesome/free-solid-svg-icons";
import BulkUploadModal from "./BulkuploadModal";
import { useGetUserCompanies } from "../../../../backend/query";
import { Link, usePath, useHistory } from "raviger";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const STATUS_BTNS = [
    { name: 'ActivitySaved', label: 'Activities Saved', style: 'secondary' },
    { name: 'Pending', label: 'Pending', style: 'warning' },
    { name: 'Overdue', label: 'Overdue', style: 'danger' },
    { name: 'Rejected', label: 'Rejected', style: 'danger' },
    { name: 'Submitted', label: 'Submitted', style: 'danger' },
    { name: 'Audited', label: 'Audited', style: 'danger' },

];

function StatusTmp({ status }) {
    function computeStatusColor(status) {
        if (status === 'Pending') {
            return 'text-warning';
        } else if (status === 'Reject' || status === 'Overdue') {
            return 'text-danger';
        } else if (status === 'Submitted') {
            return 'text-success';
        } else if (status === 'Audited') {
            return 'text-success-emphasis'
        }
        return 'text-secondary'
    }
    return (
        <span className={computeStatusColor(status)}>{status}</span>
    )
}

function ActivitiesManagement() {
    const { state } = useHistory();
    const [statusBtns] = useState(STATUS_BTNS);
    const [submitting, setSubmitting] = useState(false);
    const [companies, setCompanies] = useState([]);
    const [associateCompanies, setAssociateCompanies] = useState([]);
    const [locations, setLocations] = useState([]);
    const [company, setCompany] = useState(null);
    const [associateCompany, setAssociateCompany] = useState(null);
    const [location, setLocation] = useState(null);
    const [fromDate, setFromDate] = useState((state || {}).fromDate || null);
    const [toDate, setToDate] = useState((state || {}).toDate || null);
    const [checkedStatuses, setCheckedStatuses] = useState((state || {}).status ? { [state.status]: true } : {});
    const [statuses, setStatuses] = useState(null);
    const [activities, setActivities] = useState([]);
    const [activity, setActivity] = useState(null);
    const [bulkUpload, setBulkUpload] = useState(false);
    const [submitToAuditor, setSubmitToAuditor] = useState(false);
    const { userCompanies, isFetching } = useGetUserCompanies();
    const path = usePath();
    const [fromDashboard] = useState(path.includes('/dashboard/activities'));


    function getActivities() {
        if (company && associateCompany && location) {
            const payload = {
                company: company.value,
                associateCompany: associateCompany.value,
                location: location.value,
                fromDate: fromDate ? new Date(fromDate).toISOString() : null,
                toDate: toDate ? new Date(toDate).toISOString() : null,
                statuses: statuses || ['']
            }
            api.post('/api/ToDo/GetToDoByCriteria', payload).then(response => {
                setActivities(response.data || []);
            });
        }
    }

    function editActivity(activity) {
        setActivity(activity);
    }

    function downloadForm(activity) {
        setSubmitting(true);
        api.get(`/api/ActStateMapping/Get?id=${activity.actStateMappingId}`).then(response => {
            if (response.data.filePath) {
                const link = document.createElement('a');
                link.href = response.data.filePath;
                link.download = response.data.fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                toast.warn('No files available');
            }
        }).finally(() => setSubmitting(false));
    }

    function onSubmitToAuditorHandler(e) {
        e.preventDefault();
        const { res } = this.state;
        const filterStatuses = ["ActivitySaved", "Pending", "Overdue"]
        const array = res.filter(resItem => filterStatuses.includes(resItem.status));
        const filteredIds = array.map(item => item.id);
        if (filteredIds.length === 0) {
            toast.warn('There are no "Activity Saved", "Pending" or "Overdue" activities available for submission.')
            return;
        }
        this.setState({ submitting: true });
        // API CAll
        api.post('/api/ToDo/SubmitToAudit', filteredIds).then(() => {
            toast.success('Selected activities submitted successfully.');
            this.getToDoByCriteria();
        }).finally(() => this.setState({ submitting: false }));
    }

    function onFormStatusChangeHandler(e) {
        setCheckedStatuses({
            ...(checkedStatuses || {}),
            [e.target.name]: e.target.checked
        });
    }

    function fromDateChange(date) {
        setFromDate(date);
        if (toDate && date > toDate) {
            setToDate(date);
        }
    }

    function toDateChange(date) {
        if (fromDate && date > fromDate) {
            setToDate(date);
        } else {
            setToDate(fromDate);
        }
    }

    useEffect(() => {
        setAssociateCompanies([]);
        setLocations([]);
        setAssociateCompany(null);
        setLocation(null);
        if (company) {
            const associateCompanies = (company.company.associateCompanies || []).map(associateCompany => {
                return {
                    label: associateCompany.associateCompany.name,
                    value: associateCompany.associateCompany.id,
                    associateCompany: associateCompany.associateCompany,
                    locations: associateCompany.locations
                };
            });
            const sorted = sortBy(associateCompanies, 'label');
            setAssociateCompanies(sorted);
            const _associateCompany = sorted.find(c => c.value === (state || {}).associateCompany);
            console.log(_associateCompany);
            setAssociateCompany(_associateCompany || sorted[0]);
        }
    }, [company]);

    useEffect(() => {
        setLocations([]);
        setLocation(null);
        if (associateCompany) {
            const locations = (associateCompany.locations || []).map(location => {
                return { label: `${location.name}, ${location.cities.name}`, value: location.id, location, stateId: location.stateId };
            });
            const sorted = sortBy(locations, 'label');
            setLocations(sorted);
            const _location = sorted.find(c => c.value === (state || {}).location);
            console.log(_location);
            setLocation(_location || sorted[0]);
        }
    }, [associateCompany]);

    useEffect(() => {
        if (company && associateCompany && location) {
            getActivities();
        }
    }, [location]);

    useEffect(() => {
        if (checkedStatuses) {
            const keys = Object.keys(checkedStatuses);
            const result = keys.filter(key => !!checkedStatuses[key]);
            setStatuses(result.length ? result : ['']);
        }
    }, [checkedStatuses]);

    useEffect(() => {
        if (statuses) {
            getActivities();
        }
    }, [statuses]);

    useEffect(() => {
        if (!isFetching && userCompanies) {
            const companies = userCompanies.map(company => {
                return { value: company.id, label: company.name, company }
            });
            const sorted = sortBy(companies, 'label');
            setCompanies(sorted);
            const _company = sorted.find(c => c.value === (state || {}).company);
            console.log(_company);
            setCompany(_company || sorted[0]);
        }
    }, [isFetching]);

    return (
        <>
            <div className="d-flex flex-column">
                <div className="d-flex  p-2 align-items-center pageHeading">
                    <div className="ps-4">
                        <h4 className="mb-0 ps-1">Vendor-Activity</h4>
                    </div>
                    <div className="d-flex align-items-end h-100">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb mb-0 d-flex justify-content-end">
                                <li className="breadcrumb-item">Home</li>
                                {
                                    fromDashboard &&
                                    <li className="breadcrumb-item"><Link href="/dashboard">Dashboard</Link></li>
                                }
                                <li className="breadcrumb-item active">Activity</li>
                            </ol>
                        </nav>
                    </div>
                </div>

                <form className="card border-0 p-0 mb-3 mx-3">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-2 col-md-2">
                                <label className="filter-label"><small>Company</small></label>
                                <Select placeholder='Company' options={companies} onChange={setCompany} value={company} />
                            </div>
                            <div className="col-3 col-md-3">
                                <label className="filter-label"><small>Associate Company</small></label>
                                <Select placeholder='Asscociate Company' options={associateCompanies} onChange={setAssociateCompany} value={associateCompany} />
                            </div>
                            <div className="col-2 col-md-2">
                                <label className="filter-label"><small>Location</small></label>
                                <Select placeholder='Location' options={locations} onChange={setLocation} value={location} />
                            </div>
                            <div className="col-5">
                                <div className="d-flex justify-content-end">
                                    <div className="d-flex flex-column me-2">
                                        <label className="filter-label"><small>Due Date: From</small></label>
                                        <DatePicker className="form-control" selected={fromDate} dateFormat="dd-MM-yyyy"
                                            onChange={fromDateChange} placeholderText="dd-mm-yyyy" />
                                    </div>
                                    <div className="d-flex flex-column ms-3">
                                        <label className="filter-label"><small>Due Date: To</small></label>
                                        <DatePicker className="form-control" selected={toDate} dateFormat="dd-MM-yyyy"
                                            onChange={toDateChange} placeholderText="dd-mm-yyyy" />
                                    </div>
                                    <div className="d-flex align-items-end ms-3">
                                        <div className="d-flex flex-column">
                                            <button type="submit" className="btn btn-primary d-flex align-items-center"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    getActivities();
                                                }}>
                                                <FontAwesomeIcon icon={faSearch} />
                                                <span className="ms-2">Search</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card-footer border-0 px-2">
                        <div className="d-flex justify-content-between">
                            <div className="d-flex align-items-center status-btn-group">
                                <div className="text-appprimary">Forms Status</div>
                                {
                                    statusBtns.map(btn => {
                                        return (
                                            <div className="mx-2" key={btn.name}>
                                                <input name={btn.name} type="checkbox" className="btn-check" id={btn.name} autoComplete="off"
                                                    onChange={onFormStatusChangeHandler}
                                                    checked={checkedStatuses[btn.name]}/>
                                                <label className={`btn btn-outline-${btn.style}`} htmlFor={btn.name}>{btn.label}</label>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className="d-flex">
                                <div className="mx-2">
                                    <button className="btn btn-primary" onClick={(e) => {
                                        e.preventDefault();
                                        setBulkUpload(true)
                                    }}>
                                        <div className="d-flex align-items-center">
                                            <FontAwesomeIcon icon={faUpload} />
                                            <span className="ms-2">Bulk Upload</span>
                                        </div>
                                    </button>
                                </div>

                                <div>
                                    <button className="btn btn-primary" onClick={(e) => {
                                        e.preventDefault();
                                        setSubmitToAuditor(true)
                                    }}>
                                        <div className="d-flex align-items-center">
                                            <FontAwesomeIcon icon={faSave} />
                                            <span className="ms-2">Submit To Auditor</span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                <table className="table table-bordered bg-white">
                    <thead>
                        <tr>
                            <th scope="col"><input type="checkbox" /> </th>
                            <th scope="col">Month(year)</th>
                            <th scope="col">Act</th>
                            <th scope="col">Rule</th>
                            <th scope="col">Forms/Registers & Returns</th>
                            <th scope="col">Associate Company</th>
                            <th scope="col">Location Name</th>
                            <th scope="col">Audit Due Date</th>
                            <th scope="col">Audit Status</th>
                            <th scope="col">Forms Status</th>
                            <th scope="col">Audit Remarks</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            activities.map(function (item) {
                                return (
                                    <tr key={item.id}>
                                        <td><input type="checkbox" /></td>
                                        <td>{item.month}({item.year})</td>
                                        <td>{item.act.name}</td>
                                        <td>{item.rule.name}</td>
                                        <td>{item.activity.name}</td>
                                        <td>{item.associateCompany.name}</td>
                                        <td>{item.location.name}</td>
                                        <td className="text-warning">{dayjs(item.dueDate).format('DD-MM-YYYY')}</td>
                                        <td className="text-danger">{item.auditStatus}</td>
                                        <td><StatusTmp status={item.status} /></td>
                                        <td className="text-danger">{item.auditRemarks}</td>
                                        <td>
                                            <div className="d-flex flex-row align-items-center">
                                                <span className="me-1" style={{ zoom: 1.6, opacity: 0.5, cursor: "pointer" }} onClick={() => downloadForm(item)} title="Download">
                                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M9.75 7.875V9.75H2.25V7.875H1V9.75C1 10.4375 1.5625 11 2.25 11H9.75C10.4375 11 11 10.4375 11 9.75V7.875H9.75Z" fill="var(--bs-blue)" />
                                                        <path d="M9.125 5.375L8.24375 4.49375L6.625 6.10625L6.625 1L5.375 1L5.375 6.10625L3.75625 4.49375L2.875 5.375L6 8.5L9.125 5.375Z" fill="var(--bs-blue)" />
                                                    </svg>
                                                </span>
                                                <span className="ms-1" style={{ zoom: 1.6, opacity: 0.5, cursor: "pointer" }} onClick={() => editActivity(item)} title="Edit">
                                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M2.5 10.8499C2.225 10.8499 1.9895 10.7521 1.7935 10.5564C1.5975 10.3607 1.49967 10.1252 1.5 9.8499V2.8499C1.5 2.5749 1.598 2.3394 1.794 2.1434C1.99 1.9474 2.22533 1.84957 2.5 1.8499H6.9625L5.9625 2.8499H2.5V9.8499H9.5V6.3749L10.5 5.3749V9.8499C10.5 10.1249 10.402 10.3604 10.206 10.5564C10.01 10.7524 9.77467 10.8502 9.5 10.8499H2.5ZM8.0875 2.1374L8.8 2.8374L5.5 6.1374V6.8499H6.2L9.5125 3.5374L10.225 4.2374L6.9125 7.5499C6.82083 7.64157 6.7145 7.71457 6.5935 7.7689C6.4725 7.82324 6.3455 7.85024 6.2125 7.8499H5C4.85833 7.8499 4.7395 7.8019 4.6435 7.7059C4.5475 7.6099 4.49967 7.49124 4.5 7.3499V6.1374C4.5 6.00407 4.525 5.8769 4.575 5.7559C4.625 5.6349 4.69583 5.52874 4.7875 5.4374L8.0875 2.1374ZM10.225 4.2374L8.0875 2.1374L9.3375 0.887402C9.5375 0.687402 9.77717 0.587402 10.0565 0.587402C10.3358 0.587402 10.5712 0.687402 10.7625 0.887402L11.4625 1.5999C11.6542 1.79157 11.75 2.0249 11.75 2.2999C11.75 2.5749 11.6542 2.80824 11.4625 2.9999L10.225 4.2374Z" fill="var(--bs-green)" />
                                                    </svg>
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>

            {
                bulkUpload &&
                <BulkUploadModal onClose={() => setBulkUpload(false)} onSubmit={getActivities} />
            }
            {
                submitToAuditor &&
                <SubmitToAuditorModal todo={activities} onClose={() => setSubmitToAuditor(false)} onSubmit={onSubmitToAuditorHandler} />
            }
            {
                !!activity &&
                <EditActivityModal activity={activity} onClose={() => setActivity(null)} onSubmit={getActivities} />
            }
            {submitting && <PageLoader />}
        </>
    );
}

export default ActivitiesManagement;
