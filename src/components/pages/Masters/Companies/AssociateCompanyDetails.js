import React, { useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import { componentTypes, validatorTypes } from "@data-driven-forms/react-form-renderer";
import { Button } from "react-bootstrap";

import { toast } from 'react-toastify';
import { useCreateCompany, useUpdateCompany } from "../../../../backend/masters";
import { ERROR_MESSAGES } from "../../../../utils/constants";
import { ACTIONS } from "../../../common/Constants";
import { getValue, preventDefault } from "../../../../utils/common";
import FormRenderer, { ComponentMapper, FormTemplate } from "../../../common/FormRenderer";
import { GetActionTitle } from "../Master.constants";
import { BUSINESS_TYPES, COMPANY_REQUEST, COMPANY_STATUS, COMPANY_STATUSES } from "./Companies.constants";
import PageLoader from "../../../shared/PageLoader";

function AssociateCompanyDetails({ action, parentCompany, data, onClose, onSubmit }) {
    const [form, setForm] = useState({});
    const [associateCompany, setAssociateCompany] = useState({ hideButtons: true, status: { value: COMPANY_STATUS.ACTIVE, label: COMPANY_STATUS.ACTIVE } });
    const { createCompany, creating } = useCreateCompany((response) => {
        if (response.id) {
            toast.success(`${response.name} created successsfully.`);
            onSubmit();
        } else {
            toast.error(response.message || ERROR_MESSAGES.ERROR);
        }
    }, errorCallback);
    const { updateCompany, updating } = useUpdateCompany((response) => {
        if (response.id) {
            toast.success(`${response.name} updated successsfully.`);
            onSubmit();
        } else {
            toast.error(response.message || ERROR_MESSAGES.ERROR);
        }
    }, errorCallback);

    function errorCallback() {
        toast.error(ERROR_MESSAGES.DEFAULT);
    }

    const schema = {
        fields: [
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'parentCompanyId',
                label: 'Parent Company',
                content: (parentCompany || {}).label
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXT_FIELD,
                name: 'code',
                label: 'Short Code',
                validate: [
                    { type: validatorTypes.REQUIRED },
                    { type: validatorTypes.MAX_LENGTH, threshold: 4 },
                    { type: validatorTypes.PATTERN, pattern: /[a-zA-Z0-9]{3,4}/, message: 'Should be alphanumeric value of length 3 or 4' }
                ],
                styleClass: 'text-uppercase',
                content: getValue(associateCompany, 'code')
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXT_FIELD,
                name: 'name',
                label: 'Name',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: getValue(associateCompany, 'name')
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.SELECT,
                name: 'businessType',
                label: 'Business Type',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                isMulti: true,
                options: BUSINESS_TYPES,
                content: getValue(data, 'businessType')
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXT_FIELD,
                name: 'websiteUrl',
                label: 'Website',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: getValue(associateCompany, 'websiteUrl')
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXT_FIELD,
                name: 'contactNumber',
                label: 'Mobile',
                validate: [
                    { type: validatorTypes.REQUIRED },
                    { type: validatorTypes.MAX_LENGTH, threshold: 10 },
                    { type: validatorTypes.PATTERN, pattern: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, message: 'Should be numeric value of length 10' }
                ],
                content: getValue(associateCompany, 'contactNumber')
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXT_FIELD,
                name: 'email',
                label: 'Email',
                validate: [
                    { type: validatorTypes.PATTERN, pattern: /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/, message: 'Invalid email format.' }
                ],
                content: getValue(associateCompany, 'email')
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.SELECT,
                name: 'status',
                label: 'Status',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                options: COMPANY_STATUSES,
                content: getValue(associateCompany, 'isActive') ? COMPANY_STATUS.ACTIVE : COMPANY_STATUS.INACTIVE
            }
        ],
    };

    function submit(e) {
        preventDefault(e);
        if (form.valid) {
            const { name, code, businessType, status, websiteUrl, contactNumber, email } = associateCompany;
            // const existingData = action === ACTIONS.EDIT ? locations.filter(x => x.id !== (data || {}).id) : [...locations];
            // const duplicateLocations = FindDuplicateMasters(existingData, { code, name });
            // if (duplicateLocations.length) {
            //     toast.error(`${duplicateLocations.length} location(s) matching code or name. Please update code or name`);
            //     return;
            // }
            const payload = {
                ...COMPANY_REQUEST,
                ...data,
                parentCompanyId: parentCompany.value,
                name,
                isParent: false,
                code: code.toUpperCase(),
                businessType: businessType.map(x => x.value).join(','),
                isActive: status.value === COMPANY_STATUS.ACTIVE,
                websiteUrl,
                contactNumber,
                email
            };
            if (action === ACTIONS.EDIT) {
                payload['id'] = data.id;
                updateCompany(payload)
            } else if (action === ACTIONS.ADD) {
                createCompany(payload);
            }
        }
    }

    function debugForm(_form) {
        setForm(_form);
        setAssociateCompany(_form.values);
    }

    useEffect(() => {
        if (data) {
            const { businessType, isActive } = data;
            setAssociateCompany({
                hideButtons: true,
                ...data,
                businessType: businessType ? businessType.split(',').map(x => {
                    return { value: x, label: x }
                }): null,
                status: isActive ? { value: COMPANY_STATUS.ACTIVE, label: COMPANY_STATUS.ACTIVE } : { value: COMPANY_STATUS.INACTIVE, label: COMPANY_STATUS.INACTIVE }
            });
        }
    }, [data])

    return (
        <>
            <Modal show={true} backdrop="static" dialogClassName="drawer" animation={false}>
                <Modal.Header closeButton={true} onHide={onClose}>
                    <Modal.Title className="bg">{GetActionTitle('Associate Company', action)}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormRenderer FormTemplate={FormTemplate}
                        initialValues={associateCompany}
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
        </>
    )
}

export default AssociateCompanyDetails;