import React, { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { validatorTypes } from "@data-driven-forms/react-form-renderer";
import { Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { download, downloadFileContent, preventDefault } from "../../../../utils/common";
import FormRenderer, { ComponentMapper, FormTemplate, componentTypes } from "../../../common/FormRenderer";
import { EXCEL_FILE_REGEX, FILE_SIZE } from "../../../common/Constants";
import { ERROR_MESSAGES } from "../../../../utils/constants";
import PageLoader from "../../../shared/PageLoader";
import { useImportMappings } from "../../../../backend/masters";

function ImportMappingsModal({ onSubmit, onClose }: any) {
    const [apiError, setApiError] = useState<any>(null)

    const { importMappings, uploading } = useImportMappings((response: any) => {
        if (response instanceof AxiosError) {
            toast.error(ERROR_MESSAGES.DEFAULT);
            return;
        }
        const data = response.data;
        if (data && data.size === 0) {
            toast.success('Acts uploaded successfully.');
            onClose();
            onSubmit();
        } else {
            setApiError(response);
        }
    });

    function downloadErrors(e: any) {
        preventDefault(e);
        downloadFileContent({ name: 'Mapping_Errors.xlsx', type: apiError.headers['content-type'], content: apiError.data })
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
                    { type: 'file-size', maxSize: 25 * FILE_SIZE.MB }
                ],
                description: <a href="/" onClick={downloadSample}>Dowload Sample template</a>
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
        importMappings({
            formData
        });
    }

    function downloadSample(e: any) {
        preventDefault(e);
        download('Sample Mappings.xlsx', 'https://mafoi.s3.ap-south-1.amazonaws.com/bulkuploadtemplates/MappingsTemplate.xlsx')
    }

    return (
        <>
            <Modal show={true} backdrop="static" animation={false} size="lg" dialogClassName="" centered={true}>
                <Modal.Header closeButton={true} onHide={onClose}>
                    <Modal.Title className="bg">Import Mappings</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex flex-column" style={{ minHeight: '200px' }}>
                        {
                            Boolean(apiError) &&
                            <Alert variant="danger" className="mx-4 my-2">
                                There are few errors identified in the file uploaded. Correct the errors and upload again. <a href="/" onClick={downloadErrors}>Click here</a> to download the errors.
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

export default ImportMappingsModal;