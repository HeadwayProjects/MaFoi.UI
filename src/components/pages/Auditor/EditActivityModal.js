import React, { useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Select from 'react-select';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PageLoader from "../../shared/PageLoader";
import * as api from "../../../backend/request";
import { toast } from 'react-toastify';

const FORM_STATUSES = [
    { value: 'Approved', label: 'Approve' },
    { value: 'Rejected', label: 'Reject' }
]

const AUDIT_STATUSES = [
    { value: 'Compliant', label: 'Compliant' },
    { value: 'Non Compliance', label: 'Non Compliance' },
    { value: 'Not Applicable', label: 'Non Applicable' }
]

function EditActivityModal({ activity = {}, onClose, onSubmit }) {
    const [submitting, setSubmitting] = useState(false);
    const [auditStatus, setAuditStatus] = useState();
    const [status, setStatus] = useState();
    const [auditRemarks, setAuditRemarks] = useState();
    const [formsStatusRemarks, setFormsStatusRemarks] = useState();
    const [dueDate, setDueDate] = useState(new Date(activity.dueDate));

    function isInvalid() {
        return !status || !auditStatus ||
            (status.value === 'Rejected' && !(formsStatusRemarks || '').trim()) ||
            (['Non Compliance', 'Not Applicable'].includes((auditStatus || {}).value) && !(auditRemarks || '').trim());
    }

    function submit() {
        setSubmitting(true);
        const payload = {
            id: activity.id,
            auditStatus: auditStatus.value,
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
        }
    }, [status]);

    useEffect(() => {
        if (!dueDate) {
            setDueDate(new Date(activity.dueDate));
        }
    }, [dueDate]);

    return (
        <>
            <Modal show={true} backdrop="static" animation={false} size="lg">
                <Modal.Header closeButton={true} onHide={onClose}>
                    <Modal.Title className="bg">Activity Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex justify-content-center">
                        <div className="col-8">
                            <div className="row mb-2">
                                <div className="col-4 fw-bold">Act</div>
                                <div className="col">{(activity.act || {}).name}</div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-4 fw-bold">Rule</div>
                                <div className="col">{(activity.rule || {}).name}</div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-4 fw-bold">Forms/Registers & Returns</div>
                                <div className="col">{(activity.activity || {}).name}</div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-4 fw-bold">Month(Year)</div>
                                <div className="col">{activity.month} ({activity.year})</div>
                            </div>
                            <form>
                                <div className="row mt-3">
                                    <div className="col-12">
                                        <div className="row">
                                            <div className="col-6 mb-4">
                                                <label><small>Form Status</small><span className="required">*</span></label>
                                                <Select placeholder='Form Status' options={FORM_STATUSES} onChange={setStatus} value={status} />
                                            </div>
                                            {
                                                (status || {}).value === 'Rejected' &&
                                                <div className="col-6 mb-4">
                                                    <label><small>Vendor Due Date</small><span className="required">*</span></label>
                                                    <DatePicker className="form-control" selected={dueDate} dateFormat="dd-MM-yyyy"
                                                        onChange={setDueDate} placeholderText="dd-mm-yyyy" />
                                                </div>
                                            }
                                        </div>
                                        <div className="col-12 mb-4">
                                            <label><small>Form Status Remarks</small>{(status || {}).value === 'Rejected' && <span className="required">*</span>}</label>
                                            <textarea className="form-control" value={formsStatusRemarks}
                                                onChange={(e) => setFormsStatusRemarks(e.target.value)} />
                                        </div>
                                        <div className="row">
                                            <div className="col-6 mb-4">
                                                <label><small>Audit Status</small><span className="required">*</span></label>
                                                <Select placeholder='Audit Status' options={AUDIT_STATUSES} onChange={setAuditStatus} value={auditStatus} />
                                            </div>
                                        </div>
                                        <div className="col-12 mb-4">
                                            <label>
                                                <small>Form Status Remarks</small>
                                                {['Non Compliance', 'Not Applicable'].includes((auditStatus || {}).value) && <span className="required">*</span>}
                                            </label>
                                            <textarea className="form-control" value={auditRemarks}
                                                onChange={(e) => setAuditRemarks(e.target.value)} />
                                        </div>

                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-between">
                    <Button variant="outline-secondary" onClick={onClose} className="btn btn-outline-secondary">
                        Back
                    </Button>
                    <Button variant="primary" onClick={submit} disabled={isInvalid()}>Submit</Button>
                </Modal.Footer>
            </Modal>
            {submitting && <PageLoader />}
        </>
    )

}

export default EditActivityModal;