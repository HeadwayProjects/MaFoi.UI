import React, { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import { validatorTypes } from "@data-driven-forms/react-form-renderer";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { Alert, Button } from "react-bootstrap";
import { useImportComplianceSchedule } from "../../../backend/compliance";
import { ERROR_MESSAGES } from "../../../utils/constants";
import { download, preventDefault } from "../../../utils/common";
import FormRenderer, { ComponentMapper, FormTemplate, componentTypes } from "../../common/FormRenderer";
import { EXCEL_FILE_REGEX, FILE_SIZE } from "../../common/Constants";
import PageLoader from "../../shared/PageLoader";

function ComplianceScheduleImportModal({ onClose }: any) {
    const [apiError, setApiError] = useState<any>(null)

    const { importComplianceSchedule, uploading } = useImportComplianceSchedule((response: any) => {
        if (response instanceof AxiosError) {
            toast.error(ERROR_MESSAGES.DEFAULT);
            return;
        }
        const data = response.data;
        if (data &&  data.size === 0) {
            toast.success('Compliance activities generated successfully.');
            onClose();
        } else {
            setApiError(response);
        }
    });

    function downloadErros(e: any) {
        preventDefault(e);
        const data = apiError.data;
        const blob = new Blob([data], { type: apiError.headers['content-type'] })
        const URL = window.URL || window.webkitURL;
        const downloadUrl = URL.createObjectURL(blob);
        download('Errors.xlsx', downloadUrl);
    }

    const schema = {
        fields: [
            {
                component: componentTypes.FILE_UPLOAD,
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

    function handleSubmit({ file }: any) {
        setApiError(null);
        const formData = new FormData();
        const files = [...file.inputFiles];
        files.forEach(_file => {
            formData.append('file', _file, _file.name);
        });
        importComplianceSchedule(formData)
    }

    return (
        <>
            <Modal show={true} backdrop="static" animation={false} size="lg" dialogClassName="" centered={true}>
                <Modal.Header closeButton={true} onHide={onClose}>
                    <Modal.Title className="bg">Import Compliance Schedule</Modal.Title>
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

export default ComplianceScheduleImportModal;