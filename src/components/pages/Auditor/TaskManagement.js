import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { sortBy } from "underscore";
import * as api from "../../../backend/request";
import Select from 'react-select';
import { toast } from 'react-toastify';
import PageLoader from "../../shared/PageLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faClose, faSave, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useGetUserCompanies } from "../../../backend/query";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ViewActivityModal from "./ViewActivityModal";

const STATUS_BTNS = [
    { name: 'Submitted', label: 'Submitted', style: 'danger' },
    { name: 'Approved', label: 'Audited', style: 'success' },
    { name: 'Rejected', label: 'Rejected', style: 'danger' },
];

const ACTIONS = {
    EDIT: 1,
    VIEW: 2
};

function StatusTmp({ status }) {
    function computeStatusColor(status) {
        if (status === 'Submitted') {
            return 'text-success';
        } else if (status === 'Approved') {
            return 'text-success-emphasis'
        }
        return 'text-secondary'
    }
    return (
        <span className={computeStatusColor(status)}>{status}</span>
    )
}

function TaskManagement() {
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
    const [action, setAction] = useState(null);
    const [activity, setActivity] = useState(null);
    const { userCompanies, isFetching } = useGetUserCompanies();
    const [selectedActivities, setSelectedActivities] = useState([]);

    function getActivities() {
        if (company && associateCompany && location) {
            const payload = {
                company: company.value,
                associateCompany: associateCompany.value,
                location: location.value,
                fromDate: fromDate ? new Date(fromDate).toISOString() : null,
                toDate: toDate ? new Date(toDate).toISOString() : null,
                // statuses: statuses || ['Submitted', 'Approved', 'Rejected']
                statuses: statuses || ['']
            }
            api.post('/api/ToDo/GetToDoByCriteria', payload).then(response => {
                setSelectedActivities([]);
                setActivities(response.data || []);
            });
        }
    }

    function editActivity(activity) {
        setAction(ACTIONS.EDIT);
        setActivity(activity);
    }

    function viewActivity(activity) {
        setAction(ACTIONS.VIEW);
        setActivity(activity);
    }

    function dismissAction() {
        setAction(null);
        setActivity(null);
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

    function onSelectionChange(event, activity) {
        const _selected = [...selectedActivities];
        const checked = event.target.checked;
        if (checked) {
            _selected.push(activity.id);
        } else {
            _selected.splice(_selected.indexOf(activity.id), 1);
        }
        setSelectedActivities(_selected);
    }

    function appoveActivity() {
        setSubmitting(true);
        const payload = {
            status: 'Approved',
            ToDoIds: selectedActivities
        };
        api.post('/api/ToDo/Audit', payload).then(response => {
            if (response.data.result === 'SUCCESS') {
                toast.success(response.data.message);
                getActivities();
            } else {
                toast.error(response.data.message);
            }
        }).finally(() => setSubmitting(false))
    }

    function rejectActivity() {
        setSubmitting(true);
        const payload = {
            status: 'Rejected',
            ToDoIds: selectedActivities
        };
        api.post('/api/ToDo/Audit', payload).then(response => {
            if (response.data.result === 'SUCCESS') {
                toast.success(response.data.message);
                getActivities();
            } else {
                toast.error(response.data.message);
            }
        }).finally(() => setSubmitting(false))
    }

    function publishActivity() {

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
            setAssociateCompany(sorted[0]);
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
            setLocation(sorted[0]);
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
            setStatuses(result.length ? result : ['Submitted', 'Approved', 'Rejected']);
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
            setCompany(sorted[0]);
        }
    }, [isFetching]);

    return (
        <>
            <div className="d-flex flex-column">
                <div className="d-flex  p-2 align-items-center pageHeading">
                    <div className="ps-4">
                        <h4 className="mb-0 ps-1">Task Management</h4>
                    </div>
                    <div className="d-flex align-items-end h-100">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb mb-0 d-flex justify-content-end">
                                <li className="breadcrumb-item">Home</li>
                                <li className="breadcrumb-item active">Task Management</li>
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
                                        <label className="filter-label"><small>Submitted: From</small></label>
                                        <DatePicker className="form-control" selected={fromDate} dateFormat="dd-MM-yyyy"
                                            onChange={fromDateChange} placeholderText="dd-mm-yyyy" />
                                    </div>
                                    <div className="d-flex flex-column ms-3">
                                        <label className="filter-label"><small>Submitted: To</small></label>
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
                                                    checked={checkedStatuses[btn.name]} />
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
                                        appoveActivity();
                                    }} disabled={selectedActivities.length === 0}>
                                        <div className="d-flex align-items-center">
                                            <FontAwesomeIcon icon={faCheck} />
                                            <span className="ms-2">Approve</span>
                                        </div>
                                    </button>
                                </div>
                                <div className="mx-2">
                                    <button className="btn btn-danger" onClick={(e) => {
                                        e.preventDefault();
                                        rejectActivity();
                                    }} disabled={selectedActivities.length === 0}>
                                        <div className="d-flex align-items-center">
                                            <FontAwesomeIcon icon={faClose} />
                                            <span className="ms-2">Reject</span>
                                        </div>
                                    </button>
                                </div>

                                <div>
                                    <button className="btn btn-success" onClick={(e) => {
                                        e.preventDefault();
                                        publishActivity();
                                    }} disabled={selectedActivities.length === 0}>
                                        <div className="d-flex align-items-center">
                                            <FontAwesomeIcon icon={faSave} />
                                            <span className="ms-2">Publish</span>
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
                            <th scope="col"></th>
                            <th scope="col">Month(year)</th>
                            <th scope="col">Act</th>
                            <th scope="col">Rule</th>
                            <th scope="col">Forms/Registers & Returns</th>
                            <th scope="col">Associate Company</th>
                            <th scope="col">Location Name</th>
                            <th scope="col">Audit Due Date</th>
                            <th scope="col">Vendor Submitted Date</th>
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
                                        <td><input type="checkbox" onChange={(event) => onSelectionChange(event, item)} /></td>
                                        <td>{item.month}({item.year})</td>
                                        <td>{item.act.name}</td>
                                        <td>{item.rule.name}</td>
                                        <td>{item.activity.name}</td>
                                        <td>{item.associateCompany.name}</td>
                                        <td>{item.location.name}</td>
                                        <td className="text-warning">{dayjs(item.dueDate).format('DD-MM-YYYY')}</td>
                                        <td className="text-success">{dayjs(item.submittedDate).format('DD-MM-YYYY')}</td>
                                        <td className="text-danger">{item.auditStatus}</td>
                                        <td><StatusTmp status={item.status} /></td>
                                        <td className="text-danger">{item.auditRemarks}</td>
                                        <td>
                                            <div className="d-flex flex-row align-items-center">
                                                {/* <span className="me-1" style={{ zoom: 1.6, opacity: 0.5, cursor: "pointer" }} onClick={() => editActivity(item)} title="Edit">
                                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M2.5 10.8499C2.225 10.8499 1.9895 10.7521 1.7935 10.5564C1.5975 10.3607 1.49967 10.1252 1.5 9.8499V2.8499C1.5 2.5749 1.598 2.3394 1.794 2.1434C1.99 1.9474 2.22533 1.84957 2.5 1.8499H6.9625L5.9625 2.8499H2.5V9.8499H9.5V6.3749L10.5 5.3749V9.8499C10.5 10.1249 10.402 10.3604 10.206 10.5564C10.01 10.7524 9.77467 10.8502 9.5 10.8499H2.5ZM8.0875 2.1374L8.8 2.8374L5.5 6.1374V6.8499H6.2L9.5125 3.5374L10.225 4.2374L6.9125 7.5499C6.82083 7.64157 6.7145 7.71457 6.5935 7.7689C6.4725 7.82324 6.3455 7.85024 6.2125 7.8499H5C4.85833 7.8499 4.7395 7.8019 4.6435 7.7059C4.5475 7.6099 4.49967 7.49124 4.5 7.3499V6.1374C4.5 6.00407 4.525 5.8769 4.575 5.7559C4.625 5.6349 4.69583 5.52874 4.7875 5.4374L8.0875 2.1374ZM10.225 4.2374L8.0875 2.1374L9.3375 0.887402C9.5375 0.687402 9.77717 0.587402 10.0565 0.587402C10.3358 0.587402 10.5712 0.687402 10.7625 0.887402L11.4625 1.5999C11.6542 1.79157 11.75 2.0249 11.75 2.2999C11.75 2.5749 11.6542 2.80824 11.4625 2.9999L10.225 4.2374Z" fill="var(--bs-green)" />
                                                    </svg>
                                                </span> */}
                                                <span className="mx-1" style={{ zoom: 1.6, opacity: 0.5, cursor: "pointer" }} onClick={() => viewActivity(item)} title="View">
                                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M6 4.5C6.39782 4.5 6.77936 4.65804 7.06066 4.93934C7.34196 5.22064 7.5 5.60218 7.5 6C7.5 6.39782 7.34196 6.77936 7.06066 7.06066C6.77936 7.34196 6.39782 7.5 6 7.5C5.60218 7.5 5.22064 7.34196 4.93934 7.06066C4.65804 6.77936 4.5 6.39782 4.5 6C4.5 5.60218 4.65804 5.22064 4.93934 4.93934C5.22064 4.65804 5.60218 4.5 6 4.5ZM6 2.25C8.5 2.25 10.635 3.805 11.5 6C10.635 8.195 8.5 9.75 6 9.75C3.5 9.75 1.365 8.195 0.5 6C1.365 3.805 3.5 2.25 6 2.25ZM1.59 6C1.99413 6.82515 2.62165 7.52037 3.40124 8.00663C4.18083 8.49288 5.0812 8.75066 6 8.75066C6.9188 8.75066 7.81917 8.49288 8.59876 8.00663C9.37835 7.52037 10.0059 6.82515 10.41 6C10.0059 5.17485 9.37835 4.47963 8.59876 3.99337C7.81917 3.50712 6.9188 3.24934 6 3.24934C5.0812 3.24934 4.18083 3.50712 3.40124 3.99337C2.62165 4.47963 1.99413 5.17485 1.59 6Z" fill="#322C2D" />
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
                action === ACTIONS.VIEW && <ViewActivityModal activity={activity} onClose={dismissAction} />
            }

            {/* {
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
            } */}
            {submitting && <PageLoader />}
        </>
    );
}

export default TaskManagement;
