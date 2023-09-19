import React, { useEffect, useState } from "react";
import { ACTIONS } from "../../common/Constants";
import FormRenderer, { ComponentMapper, FormTemplate, componentTypes } from "../../common/FormRenderer";
import { sortBy } from "underscore";
import { useCreateNotificationTemplate, useGetAllNotificationTemplateTypes, useUpdateNotificationTemplate } from "../../../backend/notification";
import { validatorTypes } from "@data-driven-forms/react-form-renderer";
import { getValue } from "../../../utils/common";
import { API_DELIMITER, API_RESULT, ERROR_MESSAGES, UI_DELIMITER } from "../../../utils/constants";
import { useGetCompanies } from "../../../backend/masters";
import { DEFAULT_OPTIONS_PAYLOAD } from "../../common/Table";
import { Button, Modal } from "react-bootstrap";
import { GetActionTitle } from "../Masters/Master.constants";
import { toast } from "react-toastify";
import PageLoader from "../../shared/PageLoader";

export default function NotificationTemplateDetails({ action, data, onSubmit, onClose }: any) {
    const [form, setForm] = useState<any>({});
    const [notification, setNotification] = useState<any>({ hideButtons: true });
    const { templateTypes } = useGetAllNotificationTemplateTypes(null);
    const { companies } = useGetCompanies({ ...DEFAULT_OPTIONS_PAYLOAD, filters: [{ columnName: 'isParent', value: 'true' }] });
    const { createNotificationTemplate, creating } = useCreateNotificationTemplate(({ key, value }: any) => {
        if (key === API_RESULT.SUCCESS) {
            toast.success('Notification template created successfully.');
            onSubmit();
        } else {
            toast.error(value || ERROR_MESSAGES.DEFAULT);
        }
    });
    const { updateNotificationTemplate, updating } = useUpdateNotificationTemplate(({ key, value }: any) => {
        if (key === API_RESULT.SUCCESS) {
            toast.success('Notification template updated successfully.');
            onSubmit();
        } else {
            toast.error(value || ERROR_MESSAGES.DEFAULT);
        }
    });

    const schema = {
        fields: [
            {
                component: action === ACTIONS.ADD ? componentTypes.SELECT : componentTypes.PLAIN_TEXT,
                name: 'templateType',
                label: 'Template Type',
                options: sortBy(templateTypes || [], 'description').map((x: any) => {
                    return {
                        id: x.id, name: x.description, keys: x.keys ? x.keys.split(API_DELIMITER) : []
                    }
                }),
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: action !== ACTIONS.ADD ? getValue(notification, 'templateType.name') : ''
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'temlateDescription',
                label: 'Template Description',
                content: getValue(notification, 'templateType.description') || '-NA-'
            },
            {
                component: action === ACTIONS.ADD ? componentTypes.SELECT : componentTypes.PLAIN_TEXT,
                name: 'company',
                label: 'Company',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                options: companies,
                content: action !== ACTIONS.ADD ? getValue(notification, 'companyName') : ''
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.INPUT_AS_TEXT,
                name: 'title',
                label: 'Title',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: action === ACTIONS.VIEW ? getValue(notification, 'title') : ''
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.HTML : componentTypes.TEXTAREA,
                name: 'message',
                label: 'Message',
                placeholder: 'Enter Email Body...',
                rows: 6,
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                description: (getValue(notification, 'templateType.keys') || []).length ? `Valid Keys: ${getValue(notification, 'templateType.keys').join(UI_DELIMITER)}` : null
            }
        ],
    };

    function debugForm(_form: any) {
        setForm(_form);
        setNotification(_form.values);
    }

    function handleSubmit() {
        const { id, company, title, templateType, messsage } = notification;
        const payload: any = {
            id, title, messsage,
            companyId: company.value,
            templateId: templateType.value
        }
        if (action === ACTIONS.ADD) {
            createNotificationTemplate(payload);
        } else {
            updateNotificationTemplate(payload)
        }
    }

    useEffect(() => {
        if (data) {
            const { companyId, companyName, template } = data;
            setNotification({
                ...notification,
                ...data,
                compny: { value: companyId, label: companyName },
                templateType: { ...template, value: template.id, label: template.name, keys: (template.keys || '').split(API_DELIMITER) }
            });
        }
    }, [data]);

    return (
        <>
            <Modal show={true} backdrop="static" dialogClassName="drawer" animation={false}>
                <Modal.Header closeButton={true} onHide={onClose}>
                    <Modal.Title className="bg">{GetActionTitle('Notification Template', action, false)}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormRenderer FormTemplate={FormTemplate}
                        initialValues={notification}
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
                                <Button variant="primary" onClick={handleSubmit} className="px-4" disabled={!form.valid}>{'Submit'}</Button>
                            </> :
                            <Button variant="primary" onClick={onClose} className="px-4 ms-auto">{'Close'}</Button>
                    }
                </Modal.Footer>
            </Modal>
            {(creating || updating) && <PageLoader />}
        </>
    )
}