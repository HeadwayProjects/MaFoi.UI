import React, { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import FormRenderer, { ComponentMapper, FormTemplate } from "../../../common/FormRenderer";
import { validatorTypes } from "@data-driven-forms/react-form-renderer";
import { EXCEL_FILE_REGEX, FILE_SIZE } from "../../../common/Constants";
import { useImportAuditSchedule } from "../../../../backend/masters";
import PageLoader from "../../../shared/PageLoader";
import { Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import { preventDefault } from "../../../../utils/common";
import { ERROR_MESSAGES } from "../../../../utils/constants";
import { AxiosError } from "axios";

function AuditScheduleImportModal({ onClose }) {
    const [apiError, setApiError] = useState(null)

    const { importAuditSchedule, uploading } = useImportAuditSchedule((response) => {
        if (response instanceof AxiosError) {
            toast.error(ERROR_MESSAGES.DEFAULT);
            return;
        }
        const data = response.data;
        if (data &&  data.size === 0) {
            toast.success('ToDos generated successfully.');
            onClose();
        } else {
            setApiError(response);
        }
    });

    function downloadErros(e) {
        preventDefault(e);
        const data = apiError.data;
        const blob = new Blob([data], { type: apiError.headers['content-type'] })
        const URL = window.URL || window.webkitURL;
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = 'Errors.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    const schema = {
        fields: [
            {
                component: 'file-upload',
                label: 'Upload File',
                name: 'file',
                type: 'file',
                validate: [
                    { type: validatorTypes.REQUIRED },
                    { type: 'file-type', regex: EXCEL_FILE_REGEX },
                    { type: 'file-size', maxSize: 10 * FILE_SIZE.MB }
                ]
            },
        ],
    };

    function handleSubmit({ file }) {
        setApiError(null);
        const formData = new FormData();
        const files = [...file.inputFiles];
        files.forEach(_file => {
            formData.append('file', _file, _file.name);
        });
        importAuditSchedule(formData)
    }

    return (
        <>
            <Modal show={true} backdrop="static" animation={false} size="lg" dialogClassName="" centered={true}>
                <Modal.Header closeButton={true} onHide={onClose}>
                    <Modal.Title className="bg">Import Audit Schedule</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex flex-column" style={{ minHeight: '200px' }}>
                        {
                            Boolean(apiError) &&
                            <Alert variant="danger" className="mx-4 my-2">
                                There are few errors identified in the file uploaded. Correct the errors and upload again. <a href="/" onClick={downloadErros}>Click here</a> to download the errors.
                            </Alert>
                        }
                        <div className="d-flex flex-column col-8 mx-auto">
                            <FormRenderer FormTemplate={FormTemplate}
                                componentMapper={ComponentMapper}
                                schema={schema}
                                onSubmit={handleSubmit}
                            />
                        </div>

                    </div>
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-end">
                    <Button variant="secondary" onClick={onClose} >Close</Button>
                </Modal.Footer>
            </Modal>
            {
                uploading && <PageLoader>Uploading...</PageLoader>
            }
        </>
    )
}

export default AuditScheduleImportModal;