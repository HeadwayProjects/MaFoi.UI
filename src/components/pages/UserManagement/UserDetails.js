import React, { useEffect, useState } from "react";
import { useCreateUser, useGetUserRoles, useUpdateUser } from "../../../backend/users";
import { toast } from "react-toastify";
import { ERROR_MESSAGES } from "../../../utils/constants";
import { componentTypes, validatorTypes } from "@data-driven-forms/react-form-renderer";
import { getValue, preventDefault } from "../../../utils/common";
import { ACTIONS, PATTERNS, USER_STATUS } from "../../common/Constants";
import { Button, Modal } from "react-bootstrap";
import FormRenderer, { ComponentMapper, FormTemplate } from "../../common/FormRenderer";
import PageLoader from "../../shared/PageLoader";

function UserDetails({ action, data, onClose, onSubmit }) {
    const [form, setForm] = useState({});
    const [user, setUser] = useState({ hideButtons: true, status: { value: 'Active', label: 'Active' } });
    const { roles } = useGetUserRoles();
    const { createUser, creating } = useCreateUser(({ key, message }) => {
        if (key === 'SUCCESS') {
            toast.success(`${user.name} created successfully.`);
            onSubmit();
        } else {
            toast.error(message);
        }
    }, errorCallback);
    const { updateUser, updating } = useUpdateUser(({ id, message }) => {
        if (id) {
            toast.success(`${user.name} updated successfully.`);
            onSubmit();
        } else {
            toast.error(message);
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
                options: (roles || []).map(x => {
                    return {
                        id: x.id,
                        name: x.description
                    }
                })
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.SELECT,
                name: 'status',
                label: 'Status',
                content: getValue(user, 'status'),
                options: USER_STATUS
            },
        ],
    };

    function debugForm(_form) {
        setForm(_form);
        setUser(_form.values);
    }

    function submit(e) {
        preventDefault(e);
        if (form.valid) {
            const { name, userName, role, email, status } = user;
            const request = {
                name, email,
                userName: userName.toLowerCase(),
                roleIds: [role.value],
                status: status.value,
                mobile: '',
                password: ''
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
            setUser({
                ...user,
                ...data,
                role: { value: data.role.id, label: data.role.description }
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
                        initialValues={user}
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

export default UserDetails;