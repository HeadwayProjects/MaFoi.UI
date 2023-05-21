import React, { useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { ACTIVITY_STATUS, AUDIT_STATUS, STATUS_MAPPING } from "../../common/Constants";
import { useGetActivityDocuments } from "../../../backend/query";
import Icon from "../../common/Icon";
import { download } from "../../../utils/common";
import "./ActivityModal.css";
import * as api from "../../../backend/request";
import { toast } from 'react-toastify';
import Select from 'react-select';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import NavTabs from "../../shared/NavTabs";
import PageLoader from "../../shared/PageLoader";

const TABS = {
    DETAILS: 'details',
    FILES: 'files'
};

const TABS_LIST = [
    { value: TABS.DETAILS, label: 'Details' },
    { value: TABS.FILES, label: 'Files' }
];

const FORM_STATUSES = [
    { value: ACTIVITY_STATUS.APPROVE, label: 'Approve' },
    { value: ACTIVITY_STATUS.REJECT, label: 'Reject' }
]

const AUDIT_STATUSES = [
    { value: AUDIT_STATUS.COMPLIANT, label: STATUS_MAPPING[AUDIT_STATUS.COMPLIANT] },
    { value: AUDIT_STATUS.NON_COMPLIANCE, label: STATUS_MAPPING[AUDIT_STATUS.NON_COMPLIANCE] },
    { value: AUDIT_STATUS.NOT_APPLICABLE, label: STATUS_MAPPING[AUDIT_STATUS.NOT_APPLICABLE] }
]

function StatusTmp({ status }) {
    return (
        <span className={`status-${status}`}>{STATUS_MAPPING[status]}</span>
    )
}

function ActivityModal({ activity = {}, onClose, onSubmit }) {
    const [editable] = useState(activity.status === ACTIVITY_STATUS.SUBMITTED);
    const [activeTab, setActiveTab] = useState(TABS.DETAILS);
    const [submitting, setSubmitting] = useState(false);
    const [auditStatus, setAuditStatus] = useState();
    const [status, setStatus] = useState();
    const [auditRemarks, setAuditRemarks] = useState();
    const [formsStatusRemarks, setFormsStatusRemarks] = useState();
    const [dueDate, setDueDate] = useState(new Date(activity.dueDate));
    const { documents } = useGetActivityDocuments(activity.id);

    function onTabChange(event) {
        setActiveTab(event);
        if (event === TABS.DETAILS) {
            setAuditStatus(undefined);
            setStatus(undefined);
            setAuditRemarks(undefined);
            setFormsStatusRemarks(undefined);
        }
    }

    function isInvalid() {
        return !status ||
            (status.value === ACTIVITY_STATUS.APPROVE && !auditStatus) ||
            (status.value === ACTIVITY_STATUS.REJECT && !(formsStatusRemarks || '').trim()) ||
            ([AUDIT_STATUS.NON_COMPLIANCE, AUDIT_STATUS.NOT_APPLICABLE].includes((auditStatus || {}).value) && !(auditRemarks || '').trim());
    }

    function submit() {
        setSubmitting(true);
        const payload = {
            id: activity.id,
            auditStatus: (auditStatus || {}).value || '',
            status: status.value,
            auditRemarks: auditRemarks || '',
            formsStatusRemarks: formsStatusRemarks || '',
            dueDate: new Date(dueDate).toISOString()
        };

        api.post('/api/Auditor/UpdateAuditDetails', [payload]).then((response) => {
            if ((response.data || {}).result === 'SUCCESS') {
                toast.success('Activity updated successfully.');
                onSubmit();
                onClose();
            } else {
                toast.error((response.data || {}).message || 'Activity updated failed. Please try again');
            }
        }).finally(() => setSubmitting(false));

    }

    useEffect(() => {
        if (status) {
            setDueDate(new Date(activity.dueDate));
            if (status.value === ACTIVITY_STATUS.REJECT) {
                setAuditRemarks(null);
                setAuditStatus(null);
            }
        }
    }, [status]);

    useEffect(() => {
        if (!dueDate) {
            setDueDate(new Date(activity.dueDate));
        }
    }, [dueDate]);

    return (
        <>
            <Modal show={true} backdrop="static" animation={false} size="lg" dialogClassName="activity-modal">
                <Modal.Header closeButton={true} onHide={onClose}>
                    <Modal.Title className="bg">Activity</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <NavTabs list={TABS_LIST} onTabChange={onTabChange} />
                    {
                        activeTab === TABS.DETAILS &&
                        <>
                            <div className="d-flex justify-content-center px-4 py-2">
                                <div className="col-12">
                                    <div className="row mb-2">
                                        <div className="col-4 filter-label">Act</div>
                                        <div className="col">{(activity.act || {}).name}</div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-4 filter-label">Rule</div>
                                        <div className="col">{(activity.rule || {}).name}</div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-4 filter-label">Forms/Registers & Returns</div>
                                        <div className="col">{(activity.activity || {}).name}</div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-4 filter-label">Month(Year)</div>
                                        <div className="col">{activity.month} ({activity.year})</div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-4 filter-label">Forms Status</div>
                                        <div className="col">{activity.status && <StatusTmp status={activity.status} />}</div>
                                    </div>
                                </div>
                            </div>

                            {
                                editable &&
                                <div className="px-4">
                                    <form>
                                        <div className="row mt-3">
                                            <div className="col-5">
                                                <div className="col-12 mb-4">
                                                    <label className="filter-label">Form Status<span className="required">*</span></label>
                                                    <Select placeholder='Form Status' options={FORM_STATUSES} onChange={setStatus} value={status} />
                                                </div>
                                                <div className="col-12 mb-4">
                                                    <label className="filter-label">Form Status Remarks{(status || {}).value === ACTIVITY_STATUS.REJECT && <span className="required">*</span>}</label>
                                                    <textarea className="form-control" value={formsStatusRemarks}
                                                        onChange={(e) => setFormsStatusRemarks(e.target.value)} />
                                                </div>
                                                {
                                                    (status || {}).value === ACTIVITY_STATUS.REJECT &&
                                                    <div className="col-8 mb-4">
                                                        <label className="filter-label">Vendor Due Date<span className="required">*</span></label>
                                                        <DatePicker className="form-control" selected={dueDate} dateFormat="dd-MM-yyyy"
                                                            onChange={setDueDate} placeholderText="dd-mm-yyyy"
                                                            showMonthDropdown
                                                            showYearDropdown
                                                            dropdownMode="select" />
                                                    </div>
                                                }
                                            </div>
                                            {
                                                (status || {}).value === ACTIVITY_STATUS.APPROVE &&
                                                <>
                                                    <div className="col-5">
                                                        <div className="col-12 mb-4">
                                                            <label className="filter-label">Audit Status<span className="required">*</span></label>
                                                            <Select placeholder='Audit Status' options={AUDIT_STATUSES} onChange={setAuditStatus} value={auditStatus} />
                                                        </div>
                                                        <div className="col-12 mb-4">
                                                            <label className="filter-label">
                                                                Audit Remarks
                                                                {[AUDIT_STATUS.NON_COMPLIANCE, AUDIT_STATUS.NOT_APPLICABLE].includes((auditStatus || {}).value) && <span className="required">*</span>}
                                                            </label>
                                                            <textarea className="form-control" value={auditRemarks}
                                                                onChange={(e) => setAuditRemarks(e.target.value)} />
                                                        </div>
                                                    </div>
                                                </>
                                            }
                                        </div>
                                    </form>
                                </div>
                            }
                        </>
                    }
                    {
                        activeTab === TABS.FILES &&
                        <div className="d-flex justify-content-center">
                            <div className="col-10">
                                <table className="table modalTable fixed_header">
                                    <thead>
                                        <tr>
                                            <th width="75%">File Name</th>
                                            <th width="25%">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody height="300px">
                                        {
                                            documents.map((file, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td width="75%">{file.fileName}</td>
                                                        <td width="25%">
                                                            <div className="d-flex flex-row align-items-center">
                                                                <Icon name={'download'} action={() => download(file.fileName, file.filePath)} title="Download" />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                        {
                                            documents.length === 0 &&
                                            <tr>
                                                <td colSpan={2} rowSpan={4} width="100%" style={{ height: '200px', border: 0 }}>
                                                    <div className="d-flex w-100 h-100 align-items-center justify-content-center">
                                                        No files available
                                                    </div>
                                                </td>
                                            </tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    }
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-end">
                    {
                        editable && activeTab === TABS.DETAILS ?
                            <div className="d-flex flex-row justify-content-between w-100">
                                <Button variant="secondary" onClick={onClose} >Back</Button>
                                <Button variant="primary" onClick={submit} disabled={isInvalid()}>Submit</Button>
                            </div>
                            : <Button variant="primary" onClick={onClose} >Close</Button>
                    }
                </Modal.Footer>
            </Modal>
            {submitting && <PageLoader />}
        </>
    )
}

export default ActivityModal;