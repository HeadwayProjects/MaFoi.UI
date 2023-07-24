import React, { useState } from "react";
import { download, downloadFileContent, preventDefault } from "../../../../utils/common";
import FormRenderer, { ComponentMapper, FormTemplate, componentTypes } from "../../../common/FormRenderer";
import { validatorTypes } from "@data-driven-forms/react-form-renderer";
import { EXCEL_FILE_REGEX, FILE_SIZE } from "../../../common/Constants";
import { Alert, Button, Modal } from "react-bootstrap";
import PageLoader from "../../../shared/PageLoader";
import { useGetStates, useImportRuleCompliance } from "../../../../backend/masters";
import { AxiosError } from "axios";
import { ERROR_MESSAGES } from "../../../../utils/constants";
import { toast } from "react-toastify";
import { DEFAULT_OPTIONS_PAYLOAD } from "../../../common/Table";
import { useExportRuleComplianceMapping } from "../../../../backend/exports";

enum ImportType {
    CONFIRM,
    EXPORT,
    IMPORT
}

function RuleComplianceImportModal({ onClose, onSubmit }: any) {
    const [apiError, setApiError] = useState<any>(null);
    const [type, setType] = useState(ImportType.CONFIRM);
    const [formValues, setForm] = useState<any>({});
    const { states } = useGetStates(DEFAULT_OPTIONS_PAYLOAD, type === ImportType.EXPORT);
    const { exportRuleComplianceMapping, exporting } = useExportRuleComplianceMapping((response: any) => {
        downloadFileContent({
            name: `Rule_Compliance_${formValues.state.label}.xlsx`,
            type: response.headers['content-type'],
            content: response.data
        });
    })

    const { importRuleCompliance, uploading } = useImportRuleCompliance((response: any) => {
        if (response instanceof AxiosError) {
            toast.error(ERROR_MESSAGES.DEFAULT);
            return;
        }
        const data = response.data;
        if (data && data.size === 0) {
            toast.success('Rule compliance uploaded successfully.');
            onClose();
            onSubmit();
        } else {
            setApiError(response);
        }
    });

    function downloadErrors(e: any) {
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

    const importSchema = {
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
                ]
            },
        ],
    };
    const exportSchema = {
        fields: [
            {
                component: componentTypes.SELECT,
                label: 'State',
                name: 'state',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                options: states
            }
        ]
    };

    function debugForm(_form: any) {
        setForm(_form.values);
    }

    function handleSubmitForImport({ file }: any) {
        setApiError(null);
        const formData = new FormData();
        const files = [...file.inputFiles];
        files.forEach(_file => {
            formData.append('file', _file, _file.name);
        });
        importRuleCompliance({
            formData
        });
    }

    function handleSubmitForExport({ state }: any) {
        exportRuleComplianceMapping({stateId: state.value});
    }

    return (
        <>
            <Modal show={true} backdrop="static" animation={false} size="lg" dialogClassName={`${type === ImportType.CONFIRM ? 'lg-mini' : ''}`} centered={true}>
                <Modal.Header closeButton={true} onHide={onClose}>
                    {
                        type === ImportType.EXPORT &&
                        <Modal.Title className="bg">Download Rules</Modal.Title>
                    }
                    {
                        type !== ImportType.EXPORT &&
                        <Modal.Title className="bg">Import Rule Compliance</Modal.Title>
                    }
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex flex-column" style={{ minHeight: '200px' }}>
                        {
                            type === ImportType.CONFIRM &&
                            <div className="text-center">
                                <p>To import rule compliance, you need to first download the set of rules for a state and map the rule compliance according.</p>
                                <p>Do you have the data ready?</p>
                            </div>
                        }
                        {
                            type === ImportType.IMPORT &&
                            <>
                                {
                                    Boolean(apiError) &&
                                    <Alert variant="danger" className="mx-4 my-2">
                                        There are few errors identified in the file uploaded. Correct the errors and upload again. <a href="/" onClick={downloadErrors}>Click here</a> to download the errors.
                                    </Alert>
                                }
                                <div className="d-flex flex-column col-8 mx-auto">
                                    <FormRenderer FormTemplate={FormTemplate}
                                        componentMapper={ComponentMapper}
                                        schema={importSchema}
                                        onSubmit={handleSubmitForImport}
                                    />
                                </div>
                            </>
                        }
                        {
                            type === ImportType.EXPORT &&
                            <div className="d-flex flex-column col-8 mx-auto">
                                <ul>
                                    <li>Select a state and click on "Download" to download the available rules.</li>
                                    <li>Update the downloaded excel with the rule compliance information against each rule.</li>
                                    <li>Import the same to update the system with the rule compliance details.</li>
                                </ul>
                                <FormRenderer FormTemplate={FormTemplate}
                                    initialValues={{ submitBtnText: 'Download' }}
                                    componentMapper={ComponentMapper}
                                    schema={exportSchema}
                                    debug={debugForm}
                                    onSubmit={handleSubmitForExport}
                                />
                            </div>
                        }
                    </div>
                </Modal.Body>
                <Modal.Footer className={`d-flex ${type === ImportType.CONFIRM ? 'justify-content-between' : 'justify-content-end'}`}>
                    {
                        type === ImportType.CONFIRM &&
                        <>
                            <Button variant="outline-secondary" onClick={onClose}>Close</Button>
                            <div className="d-flex">
                                <Button variant="secondary" onClick={() => setType(ImportType.EXPORT)} className="mx-3">No, I don't</Button>
                                <Button variant="primary" onClick={() => setType(ImportType.IMPORT)}>Yes, I have</Button>
                            </div>
                        </>
                    }
                    {
                        type !== ImportType.CONFIRM && <Button variant="primary" onClick={onClose}>Close</Button>
                    }
                </Modal.Footer>
            </Modal>
            {
                uploading && <PageLoader>Uploading...</PageLoader>
            }
        </>
    )
}

export default RuleComplianceImportModal;