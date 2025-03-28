import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import * as api from "../../../../backend/request";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faUpload } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useGetVendorActivityDocuments } from "../../../../backend/query";
import PageLoader from "../../../shared/PageLoader";
import { ALLOWED_FILES_REGEX, STATUS_MAPPING } from "../../../common/Constants";
import { checkVendorActivityStatus } from "../../../../utils/common";
import { Alert } from "react-bootstrap";
function StatusTmp({ status }: any) {
  return <span className={`status-${status}`}>{STATUS_MAPPING[status]}</span>;
}

function EditActivityModal({ activity = {}, onClose, onSubmit }: any) {
  const [submitting, setSubmitting] = useState(false);
  const [formStatus] = useState(checkVendorActivityStatus(activity));
  const [auditRemarks, setAuditRemarks] = useState<any>(activity.auditeeRemarks || "");
  const [file, setFile] = useState<any>(null);
  const [invalidFile, setInvalidFile] = useState(false);
  const { documents, invalidate } = useGetVendorActivityDocuments(activity.id);

  function onFileChange(event: any) {
    const file = event.target.files[0];
    const invalidFile = !ALLOWED_FILES_REGEX.exec(file ? file.name : "");
    setFile(file);
    setInvalidFile(invalidFile);
  }

  function uploadFile() {
    setSubmitting(true);
    const formData = new FormData();
    formData.append("file", file, file.name);
    api
      .post(
        `/api/FileUpload/UploadSingleFileForToDoVendor?toDoId=${activity.id}`,
        formData
      )
      .then(() => {
        setFile(null);
        setInvalidFile(false);
        invalidate();
        toast.success("File uploaded successfully.");
      })
      .finally(() => setSubmitting(false));
  }

  function downloadFile(file: any) {
    const link = document.createElement("a");
    link.href = file.filePath;
    link.download = file.fileName;
    document.body.appendChild(link);
    link.target = "_blank";
    link.click();
    document.body.removeChild(link);
  }

  function deleteFile(file: any) {
    setSubmitting(true);
    api
      .del(`/api/ToDoVendorDetails/Delete?Id=${file.id}`)
      .then(() => {
        invalidate();
        toast.success("File deleted successfully.");
      })
      .finally(() => setSubmitting(false));
  }

  function submit() {
    setSubmitting(true);
    api
      .get(
        `/api/ToDoVendor/SaveVendorActivityWithAuditeeRemarks?todoVendorId=${activity.id}&auditeeremarks=${auditRemarks}`
      )
      .then(() => {
        toast.success("Activity saved successfully.");
        onClose();
        onSubmit();
      })
      .finally(() => setSubmitting(false));
  }

  return (
    <>
      {Boolean(formStatus) && (
        <Modal show={true} backdrop="static" animation={false} size="lg">
          <Modal.Header closeButton={true} onHide={onClose}>
            <Modal.Title className="bg">
              {formStatus.editable ? "Edit Activity" : "Activity Details"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex justify-content-center">
              <div className="col-11">
                {formStatus.message && (
                  <Alert variant={formStatus.type}>{formStatus.message}</Alert>
                )}
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
                    Forms/Registers & Returns5
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
                <div className="row mb-4">
                  <div className="col-4 filter-label">Evidence Status</div>
                  <div className="col">
                    {activity.status && <StatusTmp status={activity.status} />}
                  </div>
                </div>
                
                  <div className="row mb-2">
                    <div className="col-4 filter-label">Auditee Remarks:</div>
                    <div className="col">
                      {activity.auditeeRemarks }
                    </div>
                  </div>
                {/* {activity.formsStatusRemarks ?  */}
                  <div className="row mb-2">
                    <div className="col-4 filter-label">Observations:</div>
                    <div className="col">
                      {activity.formsStatusRemarks }
                    </div>
                  </div> 
                  {/* {activity.auditRemarks ?  */}
                  <div className="row mb-2">
                    <div className="col-4 filter-label">Reccomendations:</div>
                    <div className="col">
                      {activity.auditRemarks }
                    </div>
                  </div> 
                {formStatus.editable && (
                  <>
                    <div className="row mb-4">
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
                    <div className="flex flex-col gap-2">
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
                      <div className=" d-flex align-items-center mt-3">
                        <label className="me-3 fw-bold">Auditee Remarks:</label>
                        <textarea
                          className="form-control"
                          rows={2}
                          value={auditRemarks}
                          onChange={(e: any) => setAuditRemarks(e.target.value)}
                          placeholder="Enter audit remarks here..."
                          style={{ width: "100%" }}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="d-flex justify-content-center">
              <div className="col-10">
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
                              <span
                                className="me-4"
                                style={{
                                  zoom: 1.6,
                                  opacity: 0.5,
                                  cursor: "pointer",
                                }}
                                onClick={() => downloadFile(file)}
                                title="Download"
                              >
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 12 12"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M9.75 7.875V9.75H2.25V7.875H1V9.75C1 10.4375 1.5625 11 2.25 11H9.75C10.4375 11 11 10.4375 11 9.75V7.875H9.75Z"
                                    fill="var(--bs-blue)"
                                  />
                                  <path
                                    d="M9.125 5.375L8.24375 4.49375L6.625 6.10625L6.625 1L5.375 1L5.375 6.10625L3.75625 4.49375L2.875 5.375L6 8.5L9.125 5.375Z"
                                    fill="var(--bs-blue)"
                                  />
                                </svg>
                              </span>
                              {/* Delet */}
                              {formStatus.editable && (
                                <span
                                  style={{
                                    opacity: 0.5,
                                    cursor: "pointer",
                                    color: "var(--red)",
                                  }}
                                  onClick={() => deleteFile(file)}
                                  title="Delete"
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </span>
                              )}
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
          </Modal.Body>
          {formStatus.editable ? (
            <>
              <Modal.Footer className="d-flex justify-content-between">
                <Button
                  variant="outline-secondary"
                  onClick={onClose}
                  className="btn btn-outline-secondary"
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  onClick={submit}
                  disabled={documents.length === 0}
                >
                  Save Activity
                </Button>
              </Modal.Footer>
            </>
          ) : (
            <>
              <Modal.Footer className="d-flex justify-content-end">
                <Button variant="primary" onClick={onClose}>
                  Close
                </Button>
              </Modal.Footer>
            </>
          )}
        </Modal>
      )}
      {submitting && <PageLoader />}
    </>
  );
}

export default EditActivityModal;
