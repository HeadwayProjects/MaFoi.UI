import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import * as api from "../../../../backend/request";
import { useGetForms, useGetUserCompanies } from "../../../../backend/query";
import { toast } from "react-toastify";
import PageLoader from "../../../shared/PageLoader";
import { ALLOWED_FILES_REGEX } from "../../../common/Constants";

function VendorBulkUploadModal({ onClose, selectedItems }: any) {
  const [submitting, setSubmitting] = useState(false);
  const [uploadFiles, setUploadedFiles] = useState<any>([]);
  const [payload, setPayload] = useState<any>({});
  const { forms, isFetching: fetchingForms } = useGetForms(
    payload,
    Boolean(payload.location) && Boolean(payload.month) && Boolean(payload.year)
  );

  function validateFormSelection() {
    const _uploadedFiles = [...uploadFiles];
    _uploadedFiles.forEach((file) => {
      file.type = null;
      file.duplicate = false;
      file.required = false;
    });
    setUploadedFiles(_uploadedFiles);
  }

  function onFileChange(event: any) {
    const _uploadedFiles = [...uploadFiles];
    if (event) {
      const length = event.target.files.length;
      const time = new Date().getTime();
      for (let i = 0; i < length; i++) {
        const file = event.target.files[i];
        const invalidFile = !ALLOWED_FILES_REGEX.exec(file.name);
        _uploadedFiles.push({ id: time + i, file, invalidFile });
      }
      setUploadedFiles(_uploadedFiles);
      event.target.value = null;
    }
  }

  function onDeleteFile(index: number) {
    const _uploadedFiles = [...uploadFiles];
    _uploadedFiles.splice(index, 1);
    setUploadedFiles(_uploadedFiles);
  }

  function clearAll() {
    setUploadedFiles([]);
  }

  function validateAndSubmit() {
    let hasError = false;
    const _uploadedFiles = [...uploadFiles];
    // _uploadedFiles.forEach(file => {
    //     if (!file.type && !file.invalidFile) {
    //         file.required = true;
    //         hasError = true;
    //     }

    //     if (file.invalidFile || file.duplicate) {
    //         hasError = true;
    //     }
    // });
    setUploadedFiles(_uploadedFiles);
    if (hasError) {
      return;
    }
    setSubmitting(true);
    if (selectedItems && selectedItems.length >= 1) {
      submit(selectedItems.map((s: any) => s.id));
    }
  }

  function submit(todosToInsert: any[]) {
    const formData = new FormData();
    const _uploadedFiles = [...uploadFiles];
    _uploadedFiles.forEach((file) => {
      formData.append("files", file.file, `${file.file.name}`);
    });
    todosToInsert.forEach((todo) => {
      formData.append("toDoIds", todo as string);
    });
    formData.append("host", "aws");
    api
      .post(
        "/api/FileUpload/UploadMultipleFileForMultipleToDoVendors",
        formData
      )
      .then(
        (response) => {
          if (response.status === 200) {
            onClose(true);
            toast.success("Files Uploaded Successfully to Pending Activities");
          }
        },
        (error) => {
          console.error(error);
        }
      )
      .finally(() => setSubmitting(false));
  }

  useEffect(() => {
    if (!fetchingForms && forms) {
      validateFormSelection();
    }
  }, [fetchingForms]);

  return (
    <>
      <Modal show={true} backdrop="static" animation={false} size="lg">
        <Modal.Header closeButton={true} onHide={onClose}>
          <Modal.Title className="bg">Bulk Upload</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-7 mb-3">
              <label className="filter-label">Select file to upload</label>
              <input
                type="file"
                className="form-control"
                id="inputGroupFile01"
                onChange={onFileChange}
                multiple
              />
            </div>
            <div className="col-5"></div>
          </div>
          <div className="row m-0">
            <table className="table modalTable fixed_header">
              <thead>
                <tr>
                  <th style={{ width: "5%" }}></th>
                  <th style={{ width: "50%" }}>File Name</th>
                  <th style={{ width: "5%" }}></th>
                </tr>
              </thead>
              <tbody style={{ height: "300px" }}>
                {uploadFiles.map((file: any, index: number) => {
                  return (
                    <tr key={index}>
                      <td width="5%">{index + 1}</td>
                      <td width="50%">
                        <div>{file.file.name}</div>
                        {file.invalidFile && (
                          <div className="text-danger">
                            {file.invalidFile && (
                              <small>Invalid file format.</small>
                            )}
                          </div>
                        )}
                      </td>
                      <td width="5%">
                        <span
                          style={{
                            opacity: 0.5,
                            cursor: "pointer",
                            color: "var(--red)",
                          }}
                          title="Delete"
                        >
                          <FontAwesomeIcon
                            icon={faTrash}
                            className="opacity-50"
                            onClick={() => onDeleteFile(index)}
                          />
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {uploadFiles.length === 0 && (
                  <tr>
                    <td colSpan={4} width="100%" className="text-center">
                      No files uploaded
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <label className="filter-label" color="Red">
              Activities which are in Activity Saved , Pending Mode only will
              get Uploaded
            </label>
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
          <div>
            <Button variant="secondary" className="me-3" onClick={clearAll}>
              Reset
            </Button>
            <Button
              variant="primary"
              onClick={validateAndSubmit}
              disabled={uploadFiles.length === 0}
            >
              Submit
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
      {submitting && <PageLoader />}
    </>
  );
}

export default VendorBulkUploadModal;
