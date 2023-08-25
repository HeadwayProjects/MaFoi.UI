import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { validatorTypes } from "@data-driven-forms/react-form-renderer";
import { Button, Modal } from "react-bootstrap";
import { useCreateDepartment, useGetCompanies, useGetVerticals, useUpdateDepartment } from "../../../../../backend/masters";
import { DEFAULT_OPTIONS_PAYLOAD } from "../../../../common/Table";
import { ACTIONS } from "../../../../common/Constants";
import { API_RESULT, ERROR_MESSAGES } from "../../../../../utils/constants";
import FormRenderer, { ComponentMapper, FormTemplate, componentTypes } from "../../../../common/FormRenderer";
import { getValue, preventDefault } from "../../../../../utils/common";
import PageLoader from "../../../../shared/PageLoader";

function DepartmentDetails({ action, data, onClose, onSubmit }: any) {
    const [t] = useState(new Date().getTime());
    const [form, setForm] = useState<any>({});
    const [department, setDepartment] = useState<any>({ hideButtons: true });
    const [company, setCompany] = useState<string | null>(null);
    const { companies } = useGetCompanies({ ...DEFAULT_OPTIONS_PAYLOAD, filters: [{ columnName: 'isParent', value: 'true' }], t }, action === ACTIONS.ADD);
    const { verticals } = useGetVerticals({ ...DEFAULT_OPTIONS_PAYLOAD, filters: [{ columnName: 'companyId', value: company }], t }, action === ACTIONS.ADD && Boolean(company));
    const { createDepartment, creating } = useCreateDepartment(({ key, value }: any) => {
        if (key === API_RESULT.SUCCESS) {
            toast.success(`${department.name} created successfully.`);
            onSubmit();
        } else {
            toast.error(value);
        }
    }, errorCallback);
    const { updateDepartment, updating } = useUpdateDepartment(({ key, value }: any) => {
        if (key === API_RESULT.SUCCESS) {
            toast.success(`${department.name} updated successfully.`);
            onSubmit();
        } else {
            toast.error(value);
        }
    }, errorCallback);

    function errorCallback() {
        toast.error(ERROR_MESSAGES.DEFAULT);
    }

    const schema = {
        fields: [
            {
                component: action === ACTIONS.ADD ? componentTypes.SELECT : componentTypes.PLAIN_TEXT,
                name: 'company',
                label: 'Company',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                options: companies,
                content: action !== ACTIONS.ADD ? getValue(department, 'company.label') : null
            },
            {
                component: action === ACTIONS.ADD ? componentTypes.SELECT : componentTypes.PLAIN_TEXT,
                name: 'vertical',
                label: 'Vertical',
                validate: action === ACTIONS.ADD ? [
                    { type: validatorTypes.REQUIRED }
                ] : [],
                options: verticals,
                content: action !== ACTIONS.ADD ? getValue(department, 'vertical.label') : null
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXT_FIELD,
                name: 'name',
                label: 'Department Name',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: action === ACTIONS.VIEW ? getValue(department, 'name') : null
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXT_FIELD,
                name: 'shortCode',
                label: 'Department Code',
                validate: [
                    { type: validatorTypes.REQUIRED },
                    { type: validatorTypes.MAX_LENGTH, threshold: 10 },
                    { type: validatorTypes.PATTERN, pattern: /[a-zA-Z0-9]{2,10}/, message: 'Should be alphanumeric value of length 2' }
                ],
                styleClass: 'text-uppercase',
                content: action === ACTIONS.VIEW ? getValue(department, 'shortCode') : null
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXTAREA,
                name: 'description',
                label: 'Description',
                content: action === ACTIONS.VIEW ? getValue(department, 'description') : null
            }
        ]
    };

    function debugForm(_form: any) {
        setForm(_form);
        setDepartment({ ...department, ..._form.values });
        if (action === ACTIONS.ADD) {
            const _company = (_form.values.company || {}).value || null;
            if (company !== _company) {
                setCompany(_company);
                setDepartment({ ..._form.values, vertical: null });
            }
        }
    }

    function submit(e: any) {
        preventDefault(e);
        if (form.valid) {
            const { shortCode, name, description, vertical } = department;
            const request: any = {
                shortCode: shortCode.toUpperCase(),
                name: name.trim(),
                description: (description || '').trim(),
                verticalId: vertical.value
            };

            if (action === ACTIONS.EDIT) {
                request['id'] = data.id;
                updateDepartment(request);
            } else {
                createDepartment(request);
            }
        }
    }

    function getTitle() {
        if (action === ACTIONS.ADD) {
            return 'Add Department';
        } else if (action === ACTIONS.EDIT) {
            return 'Edit Department';
        } else if (action === ACTIONS.VIEW) {
            return 'Department Details';
        }
    }

    useEffect(() => {
        if (data) {
            const { vertical } = data || {};
            const { id, name, company } = vertical || {};
            setDepartment({
                ...department,
                ...data,
                company: company.id ? { value: company.id, label: company.name } : null,
                vertical: id ? { value: id, label: name } : null
            });
        }
    }, [data]);

    return (
        <>
            <Modal show={true} backdrop="static" dialogClassName="drawer" animation={false}>
                <Modal.Header closeButton={true} onHide={onClose}>
                    <Modal.Title className="bg">{getTitle()}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormRenderer FormTemplate={FormTemplate}
                        initialValues={department}
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
                <PageLoader>
                    {creating ? 'Creating Department...' : 'Updating Department...'}
                </PageLoader>
            }
        </>
    )
}

export default DepartmentDetails;