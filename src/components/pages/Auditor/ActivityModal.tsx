import React, { useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { ACTIVITY_STATUS, ALLOWED_FILES_REGEX, AUDIT_STATUS, STATUS_MAPPING } from "../../common/Constants";
import { useGetActivityDocuments } from "../../../backend/query";
import Icon from "../../common/Icon";
import { checkAuditorActivityStatus, download } from "../../../utils/common";
import "./ActivityModal.css";
import * as api from "../../../backend/request";
import { toast } from 'react-toastify';
import Select from 'react-select';
import DatePicker from "react-datepicker";
import NavTabs from "../../shared/NavTabs";
import PageLoader from "../../shared/PageLoader";
import { Alert } from "react-bootstrap";
import { ACTIVITY_TYPE } from "../../../utils/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";

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

function StatusTmp({ status }: any) {
    return (
        <span className={`status-${status}`}>{STATUS_MAPPING[status]}</span>
    )
}

function ActivityModal({ activity = {}, onClose, onSubmit }: any) {
    const [formStatus] = useState(checkAuditorActivityStatus(activity));
    const [activeTab, setActiveTab] = useState(TABS.DETAILS);
    const [submitting, setSubmitting] = useState(false);
    const [auditStatus, setAuditStatus] = useState<any>();
    const [status, setStatus] = useState<any>(FORM_STATUSES.find((x: any) => x.value === activity.status));
    //const [auditRemarks, setAuditRemarks] = useState<any>(FORM_STATUSES.find((x: any) => x.value === activity.auditRemarks));
    const [auditRemarks, setAuditRemarks] = useState(activity.auditRemarks);

    const [formsStatusRemarks, setFormsStatusRemarks] = useState(activity.formsStatusRemarks);
    const [dueDate, setDueDate] = useState<any>(new Date(activity.dueDate));
    const { documents, invalidate } = useGetActivityDocuments(activity.id);
    const [file, setFile] = useState<any>(null);
    const [invalidFile, setInvalidFile] = useState(false);
    const [error, setError] = useState("");

    function onTabChange(event: any) {
        setActiveTab(event);
        if (event === TABS.DETAILS) {
            setAuditStatus(undefined);
            setStatus(FORM_STATUSES.find((x: any) => x.value === activity.status));
            setAuditRemarks(undefined);
            setFormsStatusRemarks(activity.formsStatusRemarks);
        }
    }

    function isInvalid() {
      if (!status || !status.value) return true;

    if (status.value === ACTIVITY_STATUS.APPROVE) {
        if (!auditStatus || !auditStatus.value) return true;
        if (auditStatus.value === AUDIT_STATUS.NOT_APPLICABLE && !(auditRemarks && auditRemarks.trim())) return true;
    }

    if (status.value === ACTIVITY_STATUS.REJECT) {
        if (auditStatus && auditStatus.value === AUDIT_STATUS.NON_COMPLIANCE) {
            if (!(auditRemarks && auditRemarks.trim())) return true;
            if (!(formsStatusRemarks && formsStatusRemarks.trim())) return true;
            if (!dueDate) return true;
        }
        else if (auditStatus && auditStatus.value === AUDIT_STATUS.NOT_APPLICABLE) {
          //alert("hitted");
          if (!(formsStatusRemarks && formsStatusRemarks.trim())) return true;
          
      }
    }

    return false;
        // return !status ||
            // (status.value === ACTIVITY_STATUS.APPROVE && !auditStatus) ||
            // (status.value === ACTIVITY_STATUS.REJECT && !(formsStatusRemarks || '').trim()) ||
            // ([AUDIT_STATUS.NON_COMPLIANCE, AUDIT_STATUS.NOT_APPLICABLE].includes((auditStatus || {}).value) && !(auditRemarks || '').trim()) ||
            // (status.value === ACTIVITY_STATUS.APPROVE && [AUDIT_STATUS.NOT_APPLICABLE].includes((auditStatus || {}).value) && !(auditRemarks || '').trim()) ||
            // (status.value === ACTIVITY_STATUS.APPROVE && auditStatus?.value === AUDIT_STATUS.NOT_APPLICABLE && !(auditRemarks || '').trim()) ||
            // (status.value === ACTIVITY_STATUS.REJECT && auditStatus?.value === AUDIT_STATUS.NON_COMPLIANCE && !(auditRemarks || '').trim()) ||
            // (status.value === ACTIVITY_STATUS.REJECT && auditStatus?.value === AUDIT_STATUS.NON_COMPLIANCE && !(formsStatusRemarks || '').trim()) ||
            // (status.value === ACTIVITY_STATUS.REJECT && auditStatus?.value === AUDIT_STATUS.NON_COMPLIANCE && !dueDate);
    }


    //Old code
    // function submit() {
    //     setSubmitting(true);
    //     const payload = {
    //         id: activity.id,
    //         auditStatus: (auditStatus || {}).value || '',
    //         status: status.value,
    //         auditRemarks: auditRemarks || '',
    //         formsStatusRemarks: formsStatusRemarks || '',
    //         dueDate: new Date(dueDate).toISOString()
    //     };

    //     api.post('/api/Auditor/UpdateAuditDetails', [payload]).then((response) => {
    //         if ((response.data || {}).result === 'SUCCESS') {
    //             toast.success('Activity updated successfully.');
    //             onSubmit();
    //             onClose();
    //         } else {
    //             toast.error((response.data || {}).message || 'Activity updated failed. Please try again');
    //         }
    //     }).finally(() => setSubmitting(false));

    // }

    function submit() {
        if (
          [ACTIVITY_STATUS.APPROVE, AUDIT_STATUS.NOT_APPLICABLE].includes(
            status.value
          )
        ) {
          if (
            [AUDIT_STATUS.NOT_APPLICABLE].includes((auditStatus || {}).value) &&
            formsStatusRemarks.length < 20
          ) {
            setError("Observations must be at least 20 characters long.");
            return;
          }
        }
    
        setSubmitting(true);
        const payload = {
          id: activity.id,
          auditStatus: (auditStatus || {}).value || "",
          status: status.value,
          auditRemarks: auditRemarks || "",
          formsStatusRemarks: formsStatusRemarks || "",
          dueDate: new Date(dueDate).toISOString(),
        };
    
        if (activity.vendorRegistrationId) {
          api
            .post("/api/AuditorVendor/UpdateAuditVendorDetails", [payload])
            .then((response) => {
              if ((response.data || {}).result === "SUCCESS") {
                toast.success("Activity updated successfully.");
                onSubmit();
                onClose();
              } else {
                toast.error(
                  (response.data || {}).message ||
                    "Activity updated failed. Please try again"
                );
              }
            })
            .finally(() => setSubmitting(false));
        } else {
          api
            .post("/api/Auditor/UpdateAuditDetails", [payload])
            .then((response) => {
              if ((response.data || {}).result === "SUCCESS") {
                toast.success("Activity updated successfully.");
                onSubmit();
                onClose();
              } else {
                toast.error(
                  (response.data || {}).message ||
                    "Activity updated failed. Please try again"
                );
              }
            })
            .finally(() => setSubmitting(false));
        }
      }

    function onFileChange(event: any) {
        const file = event.target.files[0];
        const invalidFile = !ALLOWED_FILES_REGEX.exec(file.name);
        setFile(file);
        setInvalidFile(invalidFile);
    }

    function uploadFile() {
        setSubmitting(true);
        const formData = new FormData();
        formData.append('file', file, file.name);
        api.post(`/api/FileUpload/UploadSingleFile?toDoId=${activity.id}`, formData).then(() => {
            setFile(null);
            setInvalidFile(false);
            invalidate();
            toast.success('File uploaded successfully.');
        }).finally(() => setSubmitting(false));
    }


    // old code
    // useEffect(() => {
    //     if (status) {
    //         setDueDate(new Date(activity.dueDate));
    //         if (status.value === ACTIVITY_STATUS.REJECT) {
    //             setAuditRemarks(null);
    //             setAuditStatus(null);
    //         }
    //     }
    // }, [status]);

    // useEffect(() => {
    //     if (!dueDate) {
    //         setDueDate(new Date(activity.dueDate));
    //     }
    // }, [dueDate]);
    useEffect(() => {
        if (status) {
          // Clear fields when changing to Reject
          if (status.value === ACTIVITY_STATUS.REJECT) {
           // setAuditRemarks(""); // Clear audit remarks
            //setFormsStatusRemarks(""); // Clear observations
          }
    
          // Clear fields when changing to Approve
          if (status.value === ACTIVITY_STATUS.APPROVE) {
            //setFormsStatusRemarks("");
            //setAuditRemarks(""); // Clear observations (optional, depending on requirements)
          }
        }
      }, [status, auditStatus]);
    
      useEffect(() => {
        // Reset fields when compliance status changes to Not Applicable
        if (auditStatus && auditStatus.value === AUDIT_STATUS.NOT_APPLICABLE) {
         /// setAuditRemarks("");
          //setFormsStatusRemarks("");
          // Clear audit remarks
        }
      }, [auditStatus, status]);
    
      useEffect(() => {
        if (status) {
          setDueDate(new Date(activity.dueDate));
          if (status.value === ACTIVITY_STATUS.REJECT) {
            // //setAuditRemarks(null);
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
        <Modal
          show={true}
          backdrop="static"
          animation={false}
          size="lg"
          dialogClassName="activity-modal"
        >
          <Modal.Header closeButton={true} onHide={onClose}>
            <Modal.Title className="bg">Activity</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {(formStatus || {}).message && (
              <Alert variant={formStatus.type}>{formStatus.message}</Alert>
            )}
            <NavTabs list={TABS_LIST} onTabChange={onTabChange} />
            {activeTab === TABS.DETAILS && (
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
                      <div className="col-4 filter-label">
                        Forms/Registers & Returns
                      </div>
                      <div className="col">{(activity.activity || {}).name}</div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-4 filter-label">Activity Type</div>
                      <div className="col">{(activity.activity || {}).type}</div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-4 filter-label">Month(Year)</div>
                      <div className="col">
                        {activity.month} ({activity.year})
                      </div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-4 filter-label">Evidence Status</div>
                      <div className="col">
                        {activity.status && (
                          <StatusTmp status={activity.status} />
                        )}
                      </div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-4 filter-label">Audit Type</div>
                      <div className="col">
                        {activity.auditted || ACTIVITY_TYPE.AUDIT}
                      </div>
                    </div>
                    <div className="row mb-2">
                    <div className="col-4 filter-label">Auditee Remarks</div>
                    <div className="col">
                      {activity.auditeeRemarks}
                    </div>
                  </div>
                  {/* {activity.auditStatus ?  */}
                  <div className="row mb-2">
                    <div className="col-4 filter-label">Compliance Status </div>
                    <div className="col">
                      {activity.auditStatus }
                    </div>
                  </div>
                  {/* {activity.formsStatusRemarks ?  */}
                  <div className="row mb-2">
                    <div className="col-4 filter-label">Observations</div>
                    <div className="col">
                      {activity.formsStatusRemarks }
                    </div>
                  </div> 
                  {/* {activity.auditRemarks ?  */}
                  <div className="row mb-2">
                    <div className="col-4 filter-label">Reccomendations</div>
                    <div className="col">
                      {activity.auditRemarks }
                    </div>
                  </div> 
                    
                  </div>
                </div>
  
                {(formStatus || {}).editable && (
                  <div className="px-4">
                    <form>
                      <div className="row mt-3">
                        <div className="col-5">
                          <div className="col-12 mb-4">
                            <label className="filter-label">
                              Evidence Status<span className="required">*</span>
                            </label>
                            <Select
                              placeholder="Evidence Status"
                              options={FORM_STATUSES}
                              onChange={setStatus}
                              value={status}
                            />
                          </div>
                          <div className="col-12 mb-4">
                            <label className="filter-label">
                              Observations
                              {auditStatus &&
                                [
                                  AUDIT_STATUS.NON_COMPLIANCE,
                                  AUDIT_STATUS.NOT_APPLICABLE,
                                  ACTIVITY_STATUS.REJECT,
                                ].includes(auditStatus.value) && (
                                  <span className="required">*</span>
                                )}
                            </label>
                            
  
                            <textarea
                              className="form-control"
                              value={formsStatusRemarks}
                              onChange={(e) =>
                                setFormsStatusRemarks(e.target.value)
                              }
                              disabled={false}
                            />
  
                            {auditStatus &&
                              status.value === ACTIVITY_STATUS.APPROVE &&
                              auditStatus.value ===
                                AUDIT_STATUS.NOT_APPLICABLE && (
                                <div
                                  className={`mt-1 ${
                                    formsStatusRemarks.length < 20
                                      ? "text-danger"
                                      : "text-primary"
                                  }`}
                                >
                                  {formsStatusRemarks.length < 20
                                    ? `At least 20 characters required`
                                    : ``}
                                </div>
                              )}
                          </div>
  
                        
                        </div>
  
                        {(status || {}).value === ACTIVITY_STATUS.APPROVE && (
                          <div className="col-5">
                            <div className="col-12 mb-4">
                              <label className="filter-label">
                                Compliance Status
                                <span className="required">*</span>
                              </label>
                              <Select
                                placeholder="Compliance Status"
                                options={
                                  (status || {}).value === ACTIVITY_STATUS.APPROVE
                                    ? AUDIT_STATUSES.filter((option) =>
                                        [
                                          AUDIT_STATUS.COMPLIANT,
                                          AUDIT_STATUS.NOT_APPLICABLE,
                                        ].includes(option.value)
                                      )
                                    : AUDIT_STATUSES
                                }
                                onChange={setAuditStatus}
                                value={auditStatus}
                              />
                            </div>
                            <div className="col-12 mb-4">
                              <label className="filter-label">
                                Recommendations
                                {/* {[AUDIT_STATUS.NON_COMPLIANCE].includes((auditStatus || {}).value) && <span className="required">*</span>} */}
                              </label>
                              <textarea
                                className="form-control"
                                value={auditRemarks}
                                required={auditRemarks}
                                onChange={(e) => setAuditRemarks(e.target.value)}
                              />
                            </div>
                          </div>
                        )}


                          {(status || {}).value === ACTIVITY_STATUS.REJECT &&
                            activity.auditted !==
                              ACTIVITY_TYPE.PHYSICAL_AUDIT && (
                                <div className="col-5">
                            <div className="col-12 mb-4">
                              {/* <div className="row-12">
                                <div className="row-5 mb-4"> */}
                                  <label className="filter-label">
                                    Compliance Status
                                    <span className="required">*</span>
                                  </label>
                                  <Select
                                    placeholder="Compliance Status"
                                    options={
                                      (status || {}).value ===
                                      ACTIVITY_STATUS.REJECT
                                        ? AUDIT_STATUSES.filter((option) =>
                                            [
                                              AUDIT_STATUS.NON_COMPLIANCE,
                                              AUDIT_STATUS.NOT_APPLICABLE,
                                            ].includes(option.value)
                                          )
                                        : AUDIT_STATUSES
                                    }
                                    onChange={setAuditStatus}
                                    value={auditStatus}
                                  />
                                </div>
  
                                <div className="col-12 mb-4">
                                  <label className="filter-label">
                                    Recommendations
                                    {[AUDIT_STATUS.NON_COMPLIANCE].includes(
                                      (auditStatus || {}).value
                                    ) && <span className="required">*</span>}
                                  </label>
                                  <textarea
                                    className="form-control"
                                    value={auditRemarks}
                                    required={auditRemarks}
                                    onChange={(e) =>
                                      setAuditRemarks(e.target.value)
                                    }
                                  />
                                </div>
                                <div className="col-8 mb-4">
                                  <label className="filter-label">
                                    Vendor Due Date
                                    {[AUDIT_STATUS.NON_COMPLIANCE].includes(
                                      (auditStatus || {}).value
                                    ) && <span className="required">*</span>}
                                  </label>
                                  <DatePicker
                                    className="form-control"
                                    selected={dueDate}
                                    dateFormat="dd-MM-yyyy"
                                    onChange={setDueDate}
                                    placeholderText="dd-mm-yyyy"
                                    minDate={new Date()}
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                  />
                                </div>
                              </div>
                            )}
                      </div>
                    </form>
                  </div>
                )}
              </>
            )}
            {activeTab === TABS.FILES && (
              <div className="d-flex justify-content-center">
                <div className="col-10">
                  {(formStatus || {}).editable &&
                    activity.auditted === ACTIVITY_TYPE.PHYSICAL_AUDIT && (
                      <>
                        <div className="row my-4">
                          <div className="col w-100">
                            <input
                              type="file"
                              className="form-control"
                              onChange={onFileChange}
                            />
                            {invalidFile && (
                              <div className="text-danger">
                                {" "}
                                <small>Invalid file format.</small>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="row justify-content-center">
                          <div className="col-2">
                            <Button
                              variant="outline-primary"
                              disabled={!file || invalidFile}
                              onClick={uploadFile}
                            >
                              <div className="d-flex align-items-center justify-content-center w-100">
                                <FontAwesomeIcon icon={faUpload} />
                                <span className="ms-2">Upload</span>
                              </div>
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  <table className="table modalTable fixed_header">
                    <thead>
                      <tr>
                        <th style={{ width: "75%" }}>File Name</th>
                        <th style={{ width: "25%" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody style={{ height: "300px" }}>
                      {documents.map((file: any, index: number) => {
                        return (
                          <tr key={index}>
                            <td width="75%">{file.fileName}</td>
                            <td width="25%">
                              <div className="d-flex flex-row align-items-center">
                                <Icon
                                  name={"download"}
                                  action={() =>
                                    download(file.fileName, file.filePath)
                                  }
                                  text="Download"
                                />
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {documents.length === 0 && (
                        <tr>
                          <td
                            colSpan={2}
                            rowSpan={4}
                            width="100%"
                            style={{ height: "200px", border: 0 }}
                          >
                            <div className="d-flex w-100 h-100 align-items-center justify-content-center">
                              No files available
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-end">
            {(formStatus || {}).editable && activeTab === TABS.DETAILS ? (
              <div className="d-flex flex-row justify-content-between w-100">
                <Button variant="secondary" onClick={onClose}>
                  Back
                </Button>
                <Button variant="primary" onClick={submit} disabled={isInvalid()}>
                  Submit
                </Button>
              </div>
            ) : (
              <Button variant="primary" onClick={onClose}>
                Close
              </Button>
            )}
          </Modal.Footer>
        </Modal>
        {submitting && <PageLoader />}
      </>

    )
}

export default ActivityModal;



      
       {/*  <>
            <Modal show={true} backdrop="static" animation={false} size="lg" dialogClassName="activity-modal">
               <Modal.Header closeButton={true} onHide={onClose}>
                    <Modal.Title className="bg">Activity</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                        (formStatus || {}).message &&
                        <Alert variant={formStatus.type}>{formStatus.message}</Alert>
                    }
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
                                        <div className="col-4 filter-label">Activity Type</div>
                                        <div className="col">{(activity.activity || {}).type}</div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-4 filter-label">Month(Year)</div>
                                        <div className="col">{activity.month} ({activity.year})</div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-4 filter-label">Evidence Status</div>
                                        <div className="col">{activity.status && <StatusTmp status={activity.status} />}</div>
                                    </div>
                                    <div className="row mb-2">
                                        <div className="col-4 filter-label">Audit Type</div>
                                        <div className="col">{activity.auditted || ACTIVITY_TYPE.AUDIT}</div>
                                    </div>
                                </div>
                            </div>

                            {
                                (formStatus || {}).editable &&
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
                                                    (status || {}).value === ACTIVITY_STATUS.REJECT && activity.auditted !== ACTIVITY_TYPE.PHYSICAL_AUDIT &&
                                                    <div className="col-8 mb-4">
                                                        <label className="filter-label">Vendor Due Date<span className="required">*</span></label>
                                                        <DatePicker className="form-control" selected={dueDate} dateFormat="dd-MM-yyyy"
                                                            onChange={setDueDate} placeholderText="dd-mm-yyyy" minDate={new Date()}
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
                                {
                                    (formStatus || {}).editable && activity.auditted === ACTIVITY_TYPE.PHYSICAL_AUDIT &&
                                    <>
                                        <div className="row my-4">
                                            <div className="col w-100">
                                                <input type="file" className="form-control" onChange={onFileChange} />
                                                {
                                                    invalidFile &&
                                                    <div className="text-danger"> <small>Invalid file format.</small></div>
                                                }

                                            </div>
                                        </div>
                                        <div className="row justify-content-center">
                                            <div className="col-2">
                                                <Button variant="outline-primary" disabled={!file || invalidFile}
                                                    onClick={uploadFile}>
                                                    <div className="d-flex align-items-center justify-content-center w-100">
                                                        <FontAwesomeIcon icon={faUpload} />
                                                        <span className="ms-2">Upload</span>
                                                    </div>
                                                </Button>
                                            </div>
                                        </div>
                                    </>
                                }
                                <table className="table modalTable fixed_header">
                                    <thead>
                                        <tr>
                                            <th style={{width: '75%'}}>File Name</th>
                                            <th style={{width: '25%'}}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody style={{height: '300px'}}>
                                        {
                                            documents.map((file: any, index: number) => {
                                                return (
                                                    <tr key={index}>
                                                        <td width="75%">{file.fileName}</td>
                                                        <td width="25%">
                                                            <div className="d-flex flex-row align-items-center">
                                                                <Icon name={'download'} action={() => download(file.fileName, file.filePath)} text="Download" />
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
                        ((formStatus || {}).editable && activeTab === TABS.DETAILS) ?
                            <div className="d-flex flex-row justify-content-between w-100">
                                <Button variant="secondary" onClick={onClose} >Back</Button>
                                <Button variant="primary" onClick={submit} disabled={isInvalid()}>Submit</Button>
                            </div>
                            : <Button variant="primary" onClick={onClose} >Close</Button>
                    }
                </Modal.Footer>
            </Modal> 
            {submitting && <PageLoader />}      
        </> */}