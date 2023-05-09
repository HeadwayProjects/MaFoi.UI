import React, { useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import { componentTypes, validatorTypes } from "@data-driven-forms/react-form-renderer";
import { Button } from "react-bootstrap";

import { toast } from 'react-toastify';
import { useCreateCompanyLocation, useGetCities, useGetStates } from "../../../../backend/masters";
import { API_RESULT, ERROR_MESSAGES } from "../../../../utils/constants";
import { ACTIONS } from "../../../common/Constants";
import { getValue, preventDefault } from "../../../../utils/common";
import FormRenderer, { ComponentMapper, FormTemplate } from "../../../common/FormRenderer";
import { GetActionTitle } from "../Master.constants";
import PageLoader from "../../../shared/PageLoader";

function CompanyLocationDetails({ action, parentCompany, associateCompany, data, onClose, onSubmit }) {
    const [form, setForm] = useState({});
    const [locationDetails, setLocationDetails] = useState({ hideButtons: true });
    const [stateId, setStateId] = useState(null);
    const { states } = useGetStates();
    const { cities } = useGetCities({ stateId }, Boolean(stateId));
    const { createCompanyLocation, creating } = useCreateCompanyLocation((response) => {
        if (response.key === API_RESULT.SUCCESS) {
            toast.success(`${response.name} created successsfully.`);
            onSubmit();
        } else {
            toast.error(response.message || ERROR_MESSAGES.ERROR);
        }
    }, errorCallback);
    // const { updateCompany, updating } = useUpdateCompany((response) => {
    //     if (response.id) {
    //         toast.success(`${response.name} updated successsfully.`);
    //         onSubmit();
    //     } else {
    //         toast.error(response.message || ERROR_MESSAGES.ERROR);
    //     }
    // }, errorCallback);

    function errorCallback() {
        toast.error(ERROR_MESSAGES.DEFAULT);
    }

    function onStateChange(state) {
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
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.SELECT,
                name: 'state',
                label: 'State',
                options: states,
                onChange: onStateChange.bind(this),
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: action === ACTIONS.VIEW ? getValue(locationDetails, 'state.name') : ''
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.SELECT,
                name: 'city',
                label: 'City',
                options: cities,
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                isDisabled: !locationDetails.state,
                content: action === ACTIONS.VIEW ? getValue(locationDetails, 'city.name') : ''
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXT_FIELD,
                name: 'locationCode',
                label: 'Short Code',
                validate: [
                    { type: validatorTypes.REQUIRED },
                    { type: validatorTypes.MAX_LENGTH, threshold: 4 },
                    { type: validatorTypes.PATTERN, pattern: /[a-zA-Z0-9]{3,4}/, message: 'Should be alphanumeric value of length 3 or 4' }
                ],
                styleClass: 'text-uppercase',
                content: getValue(locationDetails, 'locationCode')
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXT_FIELD,
                name: 'locationName',
                label: 'Location Name',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: getValue(locationDetails, 'locationName')
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'companyLocationAddress',
                label: 'Company Location Code',
                content: getValue(locationDetails, 'companyLocationAddress')
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXT_FIELD,
                name: 'contactPersonName',
                label: 'Contact Person Name',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: getValue(locationDetails, 'contactPersonName')
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXT_FIELD,
                name: 'contactPersonMobile',
                label: 'Mobile',
                validate: [
                    { type: validatorTypes.REQUIRED },
                    { type: validatorTypes.MAX_LENGTH, threshold: 10 },
                    { type: validatorTypes.PATTERN, pattern: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, message: 'Should be numeric value of length 10' }
                ],
                content: getValue(locationDetails, 'contactPersonMobile')
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXT_FIELD,
                name: 'contactPersonEmail',
                label: 'Email',
                validate: [
                    { type: validatorTypes.PATTERN, pattern: /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/, message: 'Invalid email format.' }
                ],
                content: getValue(locationDetails, 'contactPersonEmail')
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXTAREA,
                name: 'address',
                label: 'Address',
                content: getValue(locationDetails, 'address'),
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
            }
        ],
    };

    function submit(e) {
        preventDefault(e);
        if (form.valid) {
            // const existingData = action === ACTIONS.EDIT ? locations.filter(x => x.id !== (data || {}).id) : [...locations];
            // const duplicateLocations = FindDuplicateMasters(existingData, { code, name });
            // if (duplicateLocations.length) {
            //     toast.error(`${duplicateLocations.length} location(s) matching code or name. Please update code or name`);
            //     return;
            // }
            const {
                locationName, locationCode, city, companyLocationAddress,
                contactPersonName, contactPersonMobile, contactPersonEmail, address
            } = locationDetails;
            const payload = {
                ...data,
                associateCompanyId: associateCompany.value,
                cityId: city.value,
                locationName,
                locationCode: locationCode.toUpperCase(),
                companyLocationAddress,
                contactPersonName,
                contactPersonMobile,
                contactPersonEmail,
                address
            };
            if (action === ACTIONS.EDIT) {
                payload['id'] = data.id;
                // updateCompany(payload)
            } else if (action === ACTIONS.ADD) {
                createCompanyLocation(payload);
            }
        }
    }

    function debugForm(_form) {
        if (action !== ACTIONS.VIEW) {
            setForm(_form);
            const { state, city, locationCode } = _form.values;
            const codes = [
                parentCompany.code || '###',
                associateCompany.code || '###',
                state ? (states.find(x => x.id === state.value) || { code: '###' }).code : '###',
                city ? (cities.find(x => x.id === city.value) || { code: '###' }).code : '###',
                locationCode || '###'
            ];
            console.log('Affected...');
            setLocationDetails({ ..._form.values, companyLocationAddress: codes.join('-') });
        }
    }

    useEffect(() => {
        if (data) {
            console.log(data);
            setLocationDetails({
                hideButtons: true,
                ...data
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
                (creating) &&
                <PageLoader>{creating ? 'Creating...' : 'Updating...'}</PageLoader>
            }
        </>
    )
}

export default CompanyLocationDetails;