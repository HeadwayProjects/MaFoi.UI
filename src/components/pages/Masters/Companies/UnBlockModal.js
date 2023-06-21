import React, { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import DatePicker from "react-datepicker";
import { ACTIVITY_TYPE, ERROR_MESSAGES } from "../../../../utils/constants";
import { useUpdateAuditSchedule } from "../../../../backend/masters";
import { ACTIVITY_STATUS, STATUS_MAPPING } from "../../../common/Constants";
import PageLoader from "../../../shared/PageLoader";


function StatusTmp({ status }) {
    return (
        <span className={`status-${status}`}>{STATUS_MAPPING[status]}</span>
    )
}

function UnBlockModal({ activity = {}, onClose, onSubmit }) {
    const [newDueDate, setNewDueDate] = useState(new Date(activity.dueDate));
    const { updateAuditSchedule, updating } = useUpdateAuditSchedule(({ status, message }) => {
        if (status === ACTIVITY_STATUS.PENDING) {
            toast.success('Activity unblocked successfully.');
            onClose();
            onSubmit();
        } else {
            toast.error(message || ERROR_MESSAGES.DEFAULT);
        }
    });

    function submit() {
        const { id, auditStatus, auditRemarks, day, month, year, startDate, savedDate,
            submittedDate, auditedDate, actId, ruleId, companyId, associateCompanyId, locationId, activityId,
            actStateMappingId, formsStatusRemarks, published, auditted } = activity;

        const payload = {
            id, auditStatus, auditRemarks, day, month, year, startDate, savedDate,
            submittedDate, auditedDate, actId, ruleId, companyId, associateCompanyId, locationId, activityId,
            actStateMappingId, formsStatusRemarks, published, auditted,
            dueDate: new Date(newDueDate).toISOString(),
            status: ACTIVITY_STATUS.PENDING
        }
        updateAuditSchedule(payload)
    }

    return (
        <>
            {
                <Modal show={true} backdrop="static" animation={false} size="lg">
                    <Modal.Header closeButton={true} onHide={onClose}>
                        <Modal.Title className="bg">Un-Block Activity</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="d-flex justify-content-center">
                            <div className="col-11">
                                <div className="row mb-2">
                                    <div className="col-4 filter-label">Act</div>
                                    <div className="col">{(activity.act || {}).name}</div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-4 filter-label">Activity Type</div>
                                    <div className="col">{(activity.type || {}).name}</div>
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
                                <div className="row mb-2">
                                    <div className="col-4 filter-label">Audit Type</div>
                                    <div className="col">{activity.auditted || ACTIVITY_TYPE.AUDIT}</div>
                                </div>
                                <div className="row mb-4">
                                    <div className="col-4 filter-label">Due Date</div>
                                    <div className="col-3">
                                        <DatePicker className="form-control" selected={newDueDate} dateFormat="dd-MM-yyyy"
                                            onChange={setNewDueDate} placeholderText="dd-mm-yyyy" minDate={new Date()}
                                            showMonthDropdown
                                            showYearDropdown
                                            dropdownMode="select" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer className="d-flex justify-content-between">
                        <Button variant="outline-secondary" onClick={onClose} className="btn btn-outline-secondary">
                            Back
                        </Button>
                        <Button variant="primary" onClick={submit}>Un-Block</Button>
                    </Modal.Footer>
                </Modal>
            }
            {updating && <PageLoader />}
        </>
    )

}

export default UnBlockModal;