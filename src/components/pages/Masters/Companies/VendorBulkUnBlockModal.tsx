import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import { API_RESULT, ERROR_MESSAGES } from "../../../../utils/constants";
import { useBulkUpdateVendorAuditSchedule } from "../../../../backend/masters";
import { ACTIVITY_STATUS } from "../../../common/Constants";
import PageLoader from "../../../shared/PageLoader";

function VendorBulkUnBlockModal({ selected = {}, onClose, onSubmit }: any) {
  const [newDueDate, setNewDueDate] = useState<any>(new Date());
  const { updateBulkAuditSchedule, updating } =
    useBulkUpdateVendorAuditSchedule(({ key, value }: any) => {
      if (key === API_RESULT.SUCCESS) {
        toast.success(`${selected.length} activities  unblocked successfully`);
        onClose();
        onSubmit();
      } else {
        toast.error(value || ERROR_MESSAGES.DEFAULT);
      }
    });

  function submit() {
    const payload = selected.map((activity: any) => {
      const {
        id,
        auditStatus,
        auditRemarks,
        day,
        month,
        year,
        startDate,
        savedDate,
        submittedDate,
        auditedDate,
        actId,
        ruleId,
        companyId,
        associateCompanyId,
        locationId,
        activityId,
        actStateMappingId,
        formsStatusRemarks,
        published,
        auditted,
        vendorCategoriesId,
        vendorRegistrationId,
      } = activity;
      return {
        id,
        vendorCategoriesId,
        vendorRegistrationId,
        auditStatus,
        auditRemarks,
        day,
        month,
        year,
        startDate,
        savedDate,
        submittedDate,
        auditedDate,
        actId,
        ruleId,
        companyId,
        associateCompanyId,
        locationId,
        activityId,
        actStateMappingId,
        formsStatusRemarks,
        published,
        auditted,
        dueDate: new Date(newDueDate).toISOString(),
        status: ACTIVITY_STATUS.PENDING,
      };
    });
    updateBulkAuditSchedule(payload);
  }

  return (
    <>
      {
        <Modal show={true} backdrop="static" animation={false}>
          <Modal.Header closeButton={true} onHide={onClose}>
            <Modal.Title className="bg">Un-Block Activities</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex justify-content-center">
              <div className="col-11">
                <p className="text-center mb-2">
                  There are <strong>{selected.length} activites</strong>{" "}
                  selected to Un-Block
                </p>
                <p className="text-center mb-4">
                  Provide new due date to unblock the selected activities. This
                  will provide vendor to access and resubmit the blocked
                  activities.
                </p>
                <div className="row mb-4">
                  <div className="col-4 filter-label">Due Date</div>
                  <div className="col-6">
                    <DatePicker
                      className="form-control"
                      selected={newDueDate}
                      dateFormat="dd-MM-yyyy"
                      onChange={setNewDueDate}
                      placeholderText="dd-mm-yyyy"
                      minDate={new Date()}
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-between">
            <Button
              variant="outline-secondary"
              onClick={onClose}
              className="btn btn-outline-secondary"
            >
              Back
            </Button>
            <Button variant="primary" onClick={submit}>
              Un-Block
            </Button>
          </Modal.Footer>
        </Modal>
      }
      {updating && <PageLoader />}
    </>
  );
}

export default VendorBulkUnBlockModal;
