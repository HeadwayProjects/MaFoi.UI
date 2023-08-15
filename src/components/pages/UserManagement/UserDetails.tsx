import React, { useEffect, useState } from "react";
import { useCreateUser, useGetUserRoles, useUpdateUser } from "../../../backend/users";
import { toast } from "react-toastify";
import { API_DELIMITER, ERROR_MESSAGES, UI_DELIMITER } from "../../../utils/constants";
import { validatorTypes } from "@data-driven-forms/react-form-renderer";
import { getValue, preventDefault } from "../../../utils/common";
import { ACTIONS, PATTERNS, STATUS } from "../../common/Constants";
import { Button, Modal } from "react-bootstrap";
import FormRenderer, { ComponentMapper, FormTemplate, componentTypes } from "../../common/FormRenderer";
import PageLoader from "../../shared/PageLoader";
import ViewPrivileges from "./Roles/ViewPrivileges";

function UserDetails({ action, data, onClose, onSubmit }: any) {
    const [form, setForm] = useState<any>({});
    const [user, setUser] = useState<any>({ hideButtons: true, status: { value: STATUS.ACTIVE, label: STATUS.ACTIVE } });
    const { roles } = useGetUserRoles(null);
    const [userPages, setUserpages] = useState('');
    const { createUser, creating } = useCreateUser(({ key, value }: any) => {
        if (key === 'SUCCESS') {
            toast.success(`${user.name} created successfully.`);
            onSubmit();
        } else {
            toast.error(value);
        }
    }, errorCallback);
    const { updateUser, updating } = useUpdateUser(({ key, value }: any) => {
        if (key === 'SUCCESS') {
            toast.success(`${user.name} updated successfully.`);
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
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXT_FIELD,
                name: 'name',
                label: 'Full Name',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: getValue(user, 'name')
            },
            {
                component: (action === ACTIONS.VIEW || action === ACTIONS.EDIT) ? componentTypes.PLAIN_TEXT : componentTypes.TEXT_FIELD,
                name: 'userName',
                label: 'Username',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: getValue(user, 'userName')
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXT_FIELD,
                name: 'email',
                label: 'Email Address',
                validate: [
                    { type: validatorTypes.REQUIRED },
                    { type: validatorTypes.PATTERN, pattern: PATTERNS.EMAIL, message: 'Invalid email address' }
                ],
                content: getValue(user, 'email')
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.SELECT,
                name: 'role',
                label: 'Role',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: getValue(user, 'role.label'),
                options: roles
            }
        ],
    };

    function debugForm(_form: any) {
        setForm(_form);
        setUser(_form.values);
        const { role } = _form.values || {};
        if (role) {
            const { pages, privileges } = (role || {}).role || {};
            setUserpages(privileges || pages)
        }
    }

    function submit(e: any) {
        preventDefault(e);
        if (form.valid) {
            const { name, userName, role, email } = user;
            const request: any = {
                name: name.trim(),
                email: (email || '').trim(),
                userName: (userName || '').trim().toLowerCase(),
                roleIds: [role.value],
                isActive: true,
                mobile: '',
                password: '',
                status: ''
            };

            if (action === ACTIONS.EDIT) {
                request['id'] = data.id;
                updateUser(request);
            } else {
                createUser(request);
            }
        }
    }

    function getTitle() {
        if (action === ACTIONS.ADD) {
            return 'Add User';
        } else if (action === ACTIONS.EDIT) {
            return 'Edit User';
        } else if (action === ACTIONS.VIEW) {
            return 'User Details';
        }
    }

    useEffect(() => {
        if (data) {
            const role = data.userRoles[0];
            setUser({
                ...user,
                ...data,
                role: { value: role.id, label: role.name },
                status: { value: data.isActive ? STATUS.ACTIVE : STATUS.INACTIVE, label: data.isActive ? STATUS.ACTIVE : STATUS.INACTIVE }
            });
            setUserpages(role.privileges || role.pages);
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
                        initialValues={user}
                        componentMapper={ComponentMapper}
                        schema={schema}
                        debug={debugForm}
                    />
                    <ViewPrivileges privileges={userPages} fullView={false} />
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

export default UserDetails;