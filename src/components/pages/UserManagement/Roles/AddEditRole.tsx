import React, { useEffect, useState } from "react";
import { PAGES_CONFIGURATION } from "./RoleConfiguration";
import styles from "./Roles.module.css";
import { getValue, preventDefault } from "../../../../utils/common";
import { Button, Modal } from "react-bootstrap";
import FormRenderer, { ComponentMapper, FormTemplate, componentTypes } from "../../../common/FormRenderer";
import { validatorTypes } from "@data-driven-forms/react-form-renderer";
import { ACTIONS } from "../../../common/Constants";
import ViewPrivileges from "./ViewPrivileges";

export default function AddEditRole({ action, role, onSubmit, onClose, updatePrivileges }: any) {
    const [form, setForm] = useState<any>({});
    const [roleDetails, setRole] = useState<any>({ hideButtons: true });

    const schema = {
        fields: [
            {
                component: componentTypes.TEXT_FIELD,
                name: 'name',
                label: 'Name',
                validate: [
                    { type: validatorTypes.REQUIRED },
                    { type: validatorTypes.MAX_LENGTH, threshold: 50 }
                ],
                content: getValue(roleDetails, 'name')
            },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'code',
                label: 'Code',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ]

            },
            {
                component: componentTypes.TEXTAREA,
                name: 'description',
                label: 'Description'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'privileges',
                label: 'Privileges',
                content: '',
                condition: {
                    when: 'privileges',
                    is: () => {
                        const { privileges }: any = role || {};
                        return Boolean(privileges);
                    },
                    then: { visible: true }
                },
            }
        ]
    };

    function debugForm(_form: any) {
        setForm(_form);
        setRole(_form.values);
    }

    function getRequest() {
        const { id, privileges } = role || {};
        const { code, name, description } = roleDetails;
        return {
            id, code, name, description,
            privileges: 'LAW_CATEGORY_VIEW;ACTS_VIEW;ACTIVITIES_VIEW;RULES_VIEW;STATE_VIEW;CITY_VIEW;RULE_COMPLIANCE_VIEW;MAPPING_VIEW;VIEW_COMPANIES;VIEW_ASSOCIATE_COMPANY;VIEW_LOCATION_MAPPING;AUDIT_SCHEDULE;VIEW_USERS;VIEW_COMPANY_MAPPING;VIEW_EMAIL_TEMPLATES'
        };
    }

    function addPrivileges() {
        updatePrivileges(getRequest());
    }

    function handleSubmit() {
        // getRequest();
    }

    useEffect(() => {
        if (role) {
            setRole({ ...roleDetails, ...role });
        }
    }, [role]);

    return (
        <>
            <Modal show={true} backdrop="static" dialogClassName="drawer" animation={false}>
                <Modal.Header closeButton={true} onHide={onClose}>
                    <Modal.Title className="bg">{action === ACTIONS.EDIT ? 'Edit Role' : 'Add Role'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormRenderer FormTemplate={FormTemplate}
                        initialValues={roleDetails}
                        componentMapper={ComponentMapper}
                        schema={schema}
                        debug={debugForm}
                    />
                    {
                        Boolean((role || {}).privileges) &&
                        <ViewPrivileges privileges={role.privileges} />
                    }
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-between">
                    <Button variant="outline-secondary" className="btn btn-outline-secondary px-4" onClick={onClose}>{'Cancel'}</Button>
                    <div className="d-flex flex-row align-items-center">
                        {
                            action === ACTIONS.ADD &&
                            <Button variant="primary" onClick={addPrivileges} className="px-4" disabled={!form.valid}>{'Add Privileges'}</Button>
                        }
                        {
                            action === ACTIONS.EDIT &&
                            <>
                                <Button variant="primary" onClick={handleSubmit} className="px-4 me-3" disabled={!form.valid}>{'Save'}</Button>
                                <Button variant="primary" onClick={addPrivileges} className="px-4" disabled={!form.valid}>{'Update Privileges'}</Button>
                            </>
                        }

                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )
}