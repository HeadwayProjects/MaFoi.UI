import React, { useEffect, useState } from "react";
import { useCreateDepartmentUserMapping, useGetCompanies, useGetDepartments, useGetVerticals, useUpdateDepartmentUserMapping } from "../../../../backend/masters";
import { DEFAULT_OPTIONS_PAYLOAD } from "../../../common/Table";
import { toast } from "react-toastify";
import { API_RESULT, ERROR_MESSAGES } from "../../../../utils/constants";
import { ACTIONS } from "../../../common/Constants";
import FormRenderer, { ComponentMapper, FormTemplate, componentTypes } from "../../../common/FormRenderer";
import { validatorTypes } from "@data-driven-forms/react-form-renderer";
import { getValue, preventDefault } from "../../../../utils/common";
import { useGetUsers } from "../../../../backend/users";
import { Button, Modal } from "react-bootstrap";
import PageLoader from "../../../shared/PageLoader";


function DepartmentUserDetails(this: any, { action, data, onClose, onSubmit }: any) {
    const [form, setForm] = useState<any>({});
    const [details, setDetails] = useState<any>({ hideButtons: true });
    const { companies } = useGetCompanies({ ...DEFAULT_OPTIONS_PAYLOAD, filters: [{ columnName: 'isParent', value: 'true' }] });
    const [company, setCompany] = useState<any>(null);
    const { verticals } = useGetVerticals({
        ...DEFAULT_OPTIONS_PAYLOAD, filters: [{ columnName: 'companyId', value: (company || {}).value }]
    }, Boolean(company));
    const [vertical, setVertical] = useState<any>(null);
    const { departments } = useGetDepartments({
        ...DEFAULT_OPTIONS_PAYLOAD, filters: [{ columnName: 'verticalId', value: (vertical || {}).value }]
    }, Boolean(vertical));
    const { users } = useGetUsers({ ...DEFAULT_OPTIONS_PAYLOAD });
    const { createDepartmentUserMapping, creating } = useCreateDepartmentUserMapping(({ key, value }: any) => {
        if (key === API_RESULT.SUCCESS) {
            toast.success(`Mapping created successfully.`);
            onSubmit();
        } else {
            toast.error(value);
        }
    }, errorCallback);
    const { updateDepartmentUserMapping, updating } = useUpdateDepartmentUserMapping(({ key, value }: any) => {
        if (key === API_RESULT.SUCCESS) {
            toast.success(`Mapping updated successfully.`);
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
                name: 'user',
                label: 'User',
                options: users,
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: action !== ACTIONS.ADD ? getValue(details, 'user.label') : '',
                formatOptionLabel: userOptionLabel
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.SELECT,
                name: 'company',
                label: 'Company',
                options: companies,
                onChange: handleCompanyChange.bind(this),
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: action === ACTIONS.VIEW ? getValue(details, 'company.label') : ''
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.SELECT,
                name: 'vertical',
                label: 'Vertical',
                options: verticals,
                onChange: handleVerticalChange.bind(this),
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: action === ACTIONS.VIEW ? getValue(details, 'vertical.label') : ''
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.SELECT,
                name: 'department',
                label: 'Department',
                options: departments,
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: action === ACTIONS.VIEW ? getValue(details, 'department.label') : ''
            }
        ],
    };

    function userOptionLabel({ label, user }: any) {
        const { name } = user.userRoles[0];
        return (
            <div className="d-flex flex-column">
                <div>{label}</div>
                <div className="text-sm fw-bold fst-italic text-black-600">Role: {name}</div>
            </div>
        )
    }

    function handleCompanyChange(event: any) {
        setCompany(event);
        setVertical(null);
        setDetails({ ...details, company: event, vertical: null, department: null });
    }

    function handleVerticalChange(event: any) {
        setVertical(event);
        setDetails({ ...details, vertical: event, department: null });
    }

    function debugForm(_form: any) {
        setForm(_form);
        setDetails(_form.values);
    }

    function submit(e: any) {
        preventDefault(e);
        if (form.valid) {
            const { user, department } = details;
            const request: any = {
                userId: user.value,
                departmentId: department.value
            };

            if (action === ACTIONS.EDIT) {
                request['id'] = data.id;
                updateDepartmentUserMapping(request);
            } else {
                createDepartmentUserMapping(request);
            }
        }
    }

    function getTitle() {
        if (action === ACTIONS.ADD) {
            return 'Add User Department Mapping';
        } else if (action === ACTIONS.EDIT) {
            return 'Edit User Department Mapping';
        } else if (action === ACTIONS.VIEW) {
            return ' User Department Mapping Details';
        }
    }

    useEffect(() => {
        if (data) {
            const { user, department } = data;
            const { vertical } = department || {};
            const { company } = vertical || {};
            setDetails({
                user: { value: user.id, label: user.name },
                company: { value: company.id, label: company.name },
                vertical: { value: vertical.id, label: vertical.name },
                department: { value: department.id, label: department.name }
            });
            setCompany({ value: company.id, label: company.name });
            setVertical({ value: vertical.id, label: vertical.name });
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
                        initialValues={details}
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
                    {creating ? 'Creating User...' : 'Updating User...'}
                </PageLoader>
            }
        </>
    )
}

export default DepartmentUserDetails;