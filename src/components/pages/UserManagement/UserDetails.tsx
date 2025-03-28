import React, { useEffect, useState } from "react";
import { useCreateUser, useGetUserRoles, useUpdateUser } from "../../../backend/users";
import { toast } from "react-toastify";
import { API_RESULT, ERROR_MESSAGES } from "../../../utils/constants";
import { validatorTypes } from "@data-driven-forms/react-form-renderer";
import { getValue, preventDefault } from "../../../utils/common";
import { ACTIONS, PATTERNS, STATUS } from "../../common/Constants";
import { Accordion, Button, Modal } from "react-bootstrap";
import FormRenderer, { ComponentMapper, FormTemplate, componentTypes } from "../../common/FormRenderer";
import PageLoader from "../../shared/PageLoader";
import ViewPrivileges from "./Roles/ViewPrivileges";
import { DEFAULT_OPTIONS_PAYLOAD } from "../../common/Table";
import styles from "./UserManagement.module.css";

function UserDetails({ action, data, onClose, onSubmit }: any) {
    const [form, setForm] = useState<any>({});
    const [user, setUser] = useState<any>({ hideButtons: true, status: { value: STATUS.ACTIVE, label: STATUS.ACTIVE } });
    const { roles } = useGetUserRoles({ ...DEFAULT_OPTIONS_PAYLOAD });
    const { createUser, creating } = useCreateUser(({ key, value }: any) => {
        if (key === API_RESULT.SUCCESS) {
            toast.success(`${user.name} created successfully.`);
            onSubmit();
        } else {
            toast.error(value);
        }
    }, errorCallback);
    const { updateUser, updating } = useUpdateUser(({ key, value }: any) => {
        if (key === API_RESULT.SUCCESS) {
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
                isMulti: true,
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
    }

    function submit(e: any) {
        preventDefault(e);
        if (form.valid) {
            const { name, userName, role, email } = user;
            const request: any = {
                name: name.trim(),
                email: (email || '').trim(),
                userName: (userName || '').trim().toLowerCase(),
                roleIds: role.map(({ value }: any) => value),
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
            setUser({
                ...user,
                ...data,
                role: data.userRoles.map((role: any) => {
                    return { value: role.id, label: role.name, role }
                }),
                status: { value: data.isActive ? STATUS.ACTIVE : STATUS.INACTIVE, label: data.isActive ? STATUS.ACTIVE : STATUS.INACTIVE }
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
                    {
                        (user.role || []).length > 0 &&
                        <Accordion alwaysOpen={true} className={styles.roleDetails}>
                            {
                                (user.role || []).map(({ value, label, role }: any) => {
                                    return (
                                        <Accordion.Item eventKey={value} key={value}>
                                            <Accordion.Header>{label}</Accordion.Header>
                                            <Accordion.Body>
                                                <ViewPrivileges privileges={role.pages} fullView={false} />
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    )
                                })
                            }
                        </Accordion>
                    }
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