import React, { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import FormRenderer, { ComponentMapper, FormTemplate, componentTypes } from "../../../common/FormRenderer";
import { validatorTypes } from "@data-driven-forms/react-form-renderer";
import { EXCEL_FILE_REGEX, FILE_SIZE } from "../../../common/Constants";
import { useImportLocations, useImporvendortLocations } from "../../../../backend/masters";
import PageLoader from "../../../shared/PageLoader";
import { Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import { download, getValue, preventDefault } from "../../../../utils/common";
import { ERROR_MESSAGES } from "../../../../utils/constants";
import { AxiosError } from "axios";

function CompanyVendorLocationsImportModal({ company, associateCompany,location, onSubmit, onClose }: any) {
    const [apiError, setApiError] = useState<any>(null)

    const { importvendorLocations, uploading } = useImporvendortLocations((response: any) => {
        if (response instanceof AxiosError) {
            toast.error(ERROR_MESSAGES.DEFAULT);
            return;
        }
        const data = response.data;
        if (data && data.size === 0) {
            toast.success('Company Locations uploaded successfully.');
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
console.log('locaaaaaaaaaaa',location);

    const schema = {
        fields: [
            {
                component: componentTypes.PLAIN_TEXT,
                label: 'Company',
                content: getValue(company, 'label'),
                name: 'company'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                label: 'Associate Company',
                content: getValue(associateCompany, 'label'),
                name: 'associateCompany'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                label: 'Location',
                content: getValue(location, 'label'),
                name: 'Location'
            },
            
            {
                component: componentTypes.FILE_UPLOAD,
                label: 'Upload File',
                name: 'file',
                type: 'file',
                validate: [
                    { type: validatorTypes.REQUIRED },
                    { type: 'file-type', regex: EXCEL_FILE_REGEX },
                    { type: 'file-size', maxSize: 10 * FILE_SIZE.MB }
                ],
                description: <a href="/" onClick={downloadSample}>Dowload Sample Vendor Locations</a>
            },
        ],
    };

    function handleSubmit({ file }: any) {
        setApiError(null);
        const formData = new FormData();

        console.log(formData,"importtttt",company.value,associateCompany.value);
        
        const files = [...file.inputFiles];
        files.forEach(_file => {
            formData.append('file', _file, _file.name);
        });
        importvendorLocations({
            formData,
            CID: company.value,
            ACID: associateCompany.value,
            locationId:location.value
        });
    }
    

    function downloadSample(e: any) {
        preventDefault(e);
        //download('Sample Locations.xlsx', 'https://mafoi.s3.ap-south-1.amazonaws.com/bulkuploadtemplates/LocationBulkUploadTemplate.xlsx ')
        download('Sample Vendor Locations.xlsx', 'https://mafoi.s3.ap-south-1.amazonaws.com/bulkuploadtemplates/BulkVendorLocationMappingTemplate.xlsx')
    }

    https://view.officeapps.live.com/op/view.aspx?src=https%3A%2F%2Fmafoi.s3.ap-south-1.amazonaws.com%2Fbulkuploadtemplates%2FBulkVendorLocationMappingTemplate.xlsx&wdOrigin=BROWSELINK

    return (
        <>
            <Modal show={true} backdrop="static" animation={false} size="lg" dialogClassName="" centered={true}>
                <Modal.Header closeButton={true} onHide={onClose}>
                    <Modal.Title className="bg">Import Company Vendor Locations</Modal.Title>
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

export default CompanyVendorLocationsImportModal;