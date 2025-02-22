import React, { useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import { validatorTypes } from "@data-driven-forms/react-form-renderer";
import { Button } from "react-bootstrap";
import { toast } from 'react-toastify';
import { useCreateCompanyLocation, useGetCities, useGetStates, useUpdateCompanyLocation, useUploadLocationMappingDigitalSign } from "../../../../backend/masters";
import { API_RESULT, ERROR_MESSAGES } from "../../../../utils/constants";
import { ACTIONS, PATTERNS } from "../../../common/Constants";
import { getValue, preventDefault } from "../../../../utils/common";
import FormRenderer, { ComponentMapper, FormTemplate, componentTypes } from "../../../common/FormRenderer";
import { GetActionTitle } from "../Master.constants";
import PageLoader from "../../../shared/PageLoader";
import { DEFAULT_OPTIONS_PAYLOAD } from "../../../common/Table";
import { ResponseModel } from "../../../../models/responseModel";
import { Console } from "console";

function CompanyLocationDetails(this: any, { action, parentCompany, associateCompany, data, onClose, onSubmit }: any) {
    const [t] = useState(new Date().getTime());
    const [form, setForm] = useState<any>({});
    const [locationDetails, setLocationDetails] = useState<any>({ hideButtons: true });
    const [companyLocationAddress, setCompanyLocationAddress] = useState<any>();
    const [stateId, setStateId] = useState<any>();

    const [file, setFile] = useState<any>();

    const { states } = useGetStates({ ...DEFAULT_OPTIONS_PAYLOAD, t }, Boolean(action !== ACTIONS.VIEW));
    const { cities } = useGetCities({ ...DEFAULT_OPTIONS_PAYLOAD, filters: [{ columnName: 'stateId', value: stateId }], t }, Boolean(stateId && action !== ACTIONS.VIEW));

    const { uploadDigitalSign, uploading } = useUploadLocationMappingDigitalSign(({ key, value }: ResponseModel) => {
        if (key === API_RESULT.SUCCESS) {
            toast.success('Digital Sign uploaded successfully.');
            onSubmit();
        } else {
            toast.error(value || ERROR_MESSAGES.UPLOAD_FILE);
        }
    }, errorCallback);


    const { createCompanyLocation, creating } = useCreateCompanyLocation(({ key, value }: ResponseModel) => {
        //alert(value);
        if (key === API_RESULT.SUCCESS) {
            toast.success(`Location created successfully.`);
            if (file) {
                uploadDigitalSignature(value);
            } else {
                onSubmit();
            }
        } else {
            toast.error(value || ERROR_MESSAGES.ERROR);
        }
    }, errorCallback);

    const { updateCompanyLocation, updating } = useUpdateCompanyLocation(({ key, value }: ResponseModel) => {
        if (key === API_RESULT.SUCCESS) {
            toast.success(`Location ${locationDetails.locationName} updated successfully.`);
            if (file && value) {
                //alert("57"+data.locationId);
                //console.log("58data"+data);
                uploadDigitalSignature(data.id)
            } else {
                onSubmit();
            }
        } else {
            toast.error(value || ERROR_MESSAGES.ERROR);
        }
    }, errorCallback);



    function errorCallback() {
        toast.error(ERROR_MESSAGES.DEFAULT);
    }

    function onStateChange(state: any) {
        if (state) {
            setLocationDetails({ ...locationDetails, state, city: null });
            setStateId(state.value);
        }
    }



    const schema = {
        fields: [
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'parentCompanyId',
                label: 'Company',
                content: (parentCompany || {}).label
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'associateCompanyId',
                label: 'Associate Company',
                content: (associateCompany || {}).label
            },
            {
                component: action !== ACTIONS.ADD ? componentTypes.PLAIN_TEXT : componentTypes.SELECT,
                name: 'state',
                label: 'State',
                options: states,
                onChange: onStateChange.bind(this),
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: action !== ACTIONS.ADD ? getValue(locationDetails, 'state.label') : ''
            },
            {
                component: action !== ACTIONS.ADD ? componentTypes.PLAIN_TEXT : componentTypes.SELECT,
                name: 'city',
                label: 'City',
                options: cities,
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                isDisabled: !locationDetails.state,
                content: action !== ACTIONS.ADD ? getValue(locationDetails, 'city.label') : ''
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXT_FIELD,
                name: 'locationName',
                label: 'Location Name',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: action === ACTIONS.VIEW ? getValue(locationDetails, 'locationName') : ''
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXT_FIELD,
                name: 'locationCode',
                label: 'Location Short Code',
                validate: [
                    { type: validatorTypes.REQUIRED },
                    { type: validatorTypes.MAX_LENGTH, threshold: 4 },
                    { type: validatorTypes.PATTERN, pattern: /[a-zA-Z0-9]{3,4}/, message: 'Should be alphanumeric value of length 3 or 4' }
                ],
                styleClass: 'text-uppercase',
                content: action === ACTIONS.VIEW ? getValue(locationDetails, 'locationCode') : ''
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'companyLocationAddress',
                label: 'Company Location Code',
                content: `${companyLocationAddress}`
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXTAREA,
                name: 'address',
                label: 'Address',
                content: action === ACTIONS.VIEW ? getValue(locationDetails, 'address') : '',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
            },
            {
                component: componentTypes.TAB_ITEM,
                name: 'subHeader1',
                content: 'POC Details',
                className: 'grid-col-100 text-md fw-bold pb-0'
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXT_FIELD,
                name: 'contactPersonName',
                label: 'Contact Person Name',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: action === ACTIONS.VIEW ? getValue(locationDetails, 'contactPersonName') : ''
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXT_FIELD,
                name: 'contactPersonMobile',
                label: 'Mobile',
                fieldType: 'number',
                validate: [
                    { type: validatorTypes.REQUIRED },
                    { type: validatorTypes.MAX_LENGTH, threshold: 10 },
                    { type: validatorTypes.PATTERN, pattern: PATTERNS.MOBILE, message: 'Should be numeric value of length 10' }
                ],
                content: action === ACTIONS.VIEW ? getValue(locationDetails, 'contactPersonMobile') : ''
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXT_FIELD,
                name: 'contactPersonEmail',
                label: 'Email',
                validate: [
                    { type: validatorTypes.REQUIRED },
                    { type: validatorTypes.PATTERN, pattern: /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/, message: 'Invalid email format.' }
                ],
                content: action === ACTIONS.VIEW ? getValue(locationDetails, 'contactPersonEmail') : ''
            },
            {
                component: componentTypes.TAB_ITEM,
                name: 'subHeader2',
                content: 'Owner Details',
                className: 'grid-col-100 text-md fw-bold pb-0'
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXT_FIELD,
                name: 'registrationCertificateNo',
                label: 'Registration Certificate No',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: action === ACTIONS.VIEW ? getValue(locationDetails, 'registrationCertificateNo') : ''
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXT_FIELD,
                name: 'pfCode',
                label: 'PF Code',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: action === ACTIONS.VIEW ? getValue(locationDetails, 'pfCode') : ''
            },
            ,
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXT_FIELD,
                name: 'esicCode',
                label: 'ESIC Code',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: action === ACTIONS.VIEW ? getValue(locationDetails, 'esicCode') : ''
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXT_FIELD,
                name: 'employerName',
                label: 'Employer Name',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: action === ACTIONS.VIEW ? getValue(locationDetails, 'employerName') : ''
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXT_FIELD,
                name: 'employerDesignation',
                label: 'Designation',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: action === ACTIONS.VIEW ? getValue(locationDetails, 'employerDesignation') : ''
            },
            {
                component:  componentTypes.FILE_UPLOAD,
                label: 'Upload Digtal Signature',
                name: 'file',
                type: 'file'
            }
        ]
    };

    console.log(locationDetails);
    function submit(e: any) {
        preventDefault(e);
        if (form.valid) {
            const {
                locationName, locationCode, city,
                contactPersonName, contactPersonMobile,
                contactPersonEmail, address,
                employerName,
                employerDesignation,
                registrationCertificateNo,
                pfCode,
                esicCode,
                file
            } = locationDetails;
            const payload: any = {
                associateCompanyId: associateCompany.value,
                cityId: city.value,
                locationName,
                locationCode: locationCode.toUpperCase(),
                companyLocationAddress,
                contactPersonName,
                contactPersonMobile,
                contactPersonEmail, 
                employerName,
                employerDesignation,
                registrationCertificateNo,
                pfCode,
                esicCode,
                address
         
            };
            delete payload.city;
            delete payload.state;
            if (file) {
                setFile(file);
            }

            console.log(payload, file);

            if (action === ACTIONS.EDIT) {
                //alert("data.locatioid"+data.locationId);
                payload['locationId'] = data.locationId;
                updateCompanyLocation(payload)
            } else if (action === ACTIONS.ADD) {
                createCompanyLocation(payload);
            }
        }
    }

    function uploadDigitalSignature(id: any) {
        const formData = new FormData();
        const files = [...file.inputFiles];
        files.forEach(file => {
            formData.append('file', file, file.name);
        });
        uploadDigitalSign({ id , formData });
    }

    function debugForm(_form: any) {
        if (action !== ACTIONS.VIEW) {
            setForm(_form);
            setLocationDetails(_form.values);
        }
    }

    useEffect(() => {
        if (locationDetails && parentCompany && associateCompany) {
            const { state, city, locationCode } = locationDetails;
            const codes = [
                parentCompany.code || '###',
                associateCompany.code || '###',
                ((state || {}).state || {}).code || '###',
                ((city || {}).city || {}).code || '###',
                locationCode || '###'
            ];
            setCompanyLocationAddress(codes.join('-').toUpperCase());
        }
    }, [locationDetails])

    useEffect(() => {
        if (data) {
            const { state, city } = data;
            setStateId(state.id);
            setLocationDetails({
                ...locationDetails,
                ...data,
                state: { value: state.id, label: state.name, state },
                city: { value: city.id, label: city.name, city }
            });
        }
    }, [data])

    return (
        <>
            <Modal show={true} backdrop="static" dialogClassName="drawer" animation={false}>
                <Modal.Header closeButton={true} onHide={onClose}>
                    <Modal.Title className="bg">{GetActionTitle('Company Location', action, false)}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormRenderer FormTemplate={FormTemplate}
                        initialValues={locationDetails}
                        componentMapper={ComponentMapper}
                        schema={schema}
                        debug={debugForm}
                    />
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-between">
                    {
                        action !== ACTIONS.VIEW ?
                            <>
                                <Button variant="outline-secondary" className="btn btn-outline-secondary px-4" onClick={onClose}>{'Cancel'}</Button>
                                <Button variant="primary" onClick={submit} className="px-4" disabled={!form.valid}>{'Submit'}</Button>
                            </> :
                            <Button variant="primary" onClick={onClose} className="px-4 ms-auto">{'Close'}</Button>

                    }
                </Modal.Footer>
            </Modal>
            {
                (creating || updating) &&
                <PageLoader>{creating ? 'Creating...' : 'Updating...'}</PageLoader>
            }
            {
                uploading && <PageLoader>Uploading Digital Signture..</PageLoader>
            }
        </>
    )
}

export default CompanyLocationDetails;