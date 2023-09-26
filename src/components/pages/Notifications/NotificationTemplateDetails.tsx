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
    const [templateType, setType] = useState<any>();
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
                options: sortBy(templateTypes || [], 'name').map((x: any) => {
                    return {
                        ...x,
                        keys: x.parameters ? x.parameters.split(API_DELIMITER).map((x: string) => x.trim()) : []
                    }
                }),
                onChange: (event: any) => {
                    setType(event.templateType);
                    setNotification({
                        ...notification,
                        templateType: event,
                        templateDescription: event.templateType.description,
                        title: null,
                        message: null
                    })
                },
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: action !== ACTIONS.ADD ? getValue(notification, 'templateType.label') : ''
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'templateDescription',
                label: 'Template Description',
                content: getValue(notification, 'templateType.templateType.description') || '-NA-'
            },
            {
                component: action === ACTIONS.ADD ? componentTypes.SELECT : componentTypes.PLAIN_TEXT,
                name: 'company',
                label: 'Company',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                options: companies,
                content: action !== ACTIONS.ADD ? (getValue(notification, 'company.label') || '-NA-') : ''
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
                rows: 6,
                disabled: !Boolean(getValue(notification, 'templateType')),
                validate: [
                    { type: validatorTypes.REQUIRED },
                    { type: validatorTypes.MIN_LENGTH, threshold: 10 },
                    { type: validatorTypes.MAX_LENGTH, threshold: 1000 },
                    { type: 'message' }
                ],
                description: (getValue(templateType, 'keys') || []).length ? `Valid Keys: ${getValue(templateType, 'keys').join(UI_DELIMITER)}` : null
            }
        ],
    };

    function debugForm(_form: any) {
        setForm(_form);
        setNotification(_form.values);
    }

    function handleSubmit() {
        const { id, company, title, templateType, message } = notification;
        const payload: any = {
            id, title, message,
            companyId: company.value,
            templateTypeId: templateType.value
        }
        if (action === ACTIONS.ADD) {
            createNotificationTemplate(payload);
        } else {
            updateNotificationTemplate(payload)
        }
    }

    function messageValidator() {
        return (value: any, formData: any) => {
            const keys = getValue(formData, 'templateType.templateType.keys') || [];
            if (keys.length > 0) {
                const matches = value.match(/{{.*?}}/g);
                if (!matches) {
                    return false;
                }
                const inValidKey = matches.find((key: any) => !keys.includes(key));
                return Boolean(inValidKey) ? 'Invalid keys added.' : false;
            }
            return false;
        }
    }

    useEffect(() => {
        if (data) {
            const { companyId, company, templateType } = data;
            setNotification({
                ...notification,
                ...data,
                company: company ? { value: companyId, label: company.name } : null,
                templateType: {
                    value: templateType.id,
                    label: templateType.name,
                    templateType: {
                        ...templateType,
                        keys: templateType.parameters ? templateType.parameters.split(API_DELIMITER).map((x: string) => x.trim()) : []
                    }
                }
            });
            setType({
                ...templateType,
                keys: templateType.parameters ? templateType.parameters.split(API_DELIMITER).map((x: string) => x.trim()) : []
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
                        customValidators={{ 'message': messageValidator }}
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