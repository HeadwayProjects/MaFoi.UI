import React, { useEffect, useState } from "react";
import { Link } from "raviger";
import { validatorTypes } from "@data-driven-forms/react-form-renderer";
import { Button } from "react-bootstrap";
import styles from "./Email.module.css";
import { getValue, preventDefault } from "../../../utils/common";
import { VIEWS } from "./EmailTemplates";
import FormRenderer, { ComponentMapper, FormTemplate, componentTypes } from "../../common/FormRenderer";
import { useCreateEmailTemplate, useGetAllEmailTemplateTypes, useUpdateEmailTemplate } from "../../../backend/email";
import { API_DELIMITER, API_RESULT, ERROR_MESSAGES, UI_DELIMITER } from "../../../utils/constants";
import { toast } from "react-toastify";
import PageLoader from "../../shared/PageLoader";
import { useGetCompanies } from "../../../backend/masters";
import { DEFAULT_OPTIONS_PAYLOAD } from "../../common/Table";

function EmailTemplateDetails({ changeView, emailTemplate, view }) {
    const [form, setForm] = useState({});
    const [templateDetails, setTemplateDetails] = useState({ hideButtons: true });
    const { templateTypes } = useGetAllEmailTemplateTypes({}, Boolean(!emailTemplate));
    const { createEmailTemplate, creating } = useCreateEmailTemplate(successCallback, errorCallback);
    const { updateEmailTemplate, updating } = useUpdateEmailTemplate(successCallback, errorCallback);
    const { companies } = useGetCompanies({ ...DEFAULT_OPTIONS_PAYLOAD, filters: [{ columnName: 'isParent', value: 'true' }] });
    const [validKeys, setValidKeys] = useState([]);

    function successCallback({ key, value }) {
        if (key === API_RESULT.SUCCESS) {
            toast.success(value);
            changeView(VIEWS.LIST);
        } else {
            toast.error(value || ERROR_MESSAGES.DEFAULT);
        }
    }

    function errorCallback() {
        toast.error(ERROR_MESSAGES.ERROR);
    }

    function debugForm(_form) {
        setForm(_form);
        setTemplateDetails(_form.values);
    }

    const schema = {
        fields: [
            {
                component: view === VIEWS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.SELECT,
                name: 'templateType',
                label: 'Template Type',
                options: (templateTypes || []).map(x => {
                    return {
                        id: x.id, name: x.description, params: x.parameters ? x.parameters.split(API_DELIMITER) : []
                    }
                }),
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                isDisabled: Boolean(emailTemplate),
                className: 'w-50',
                initialValue: view !== VIEWS.VIEW && emailTemplate ? { value: emailTemplate.templateType.id, label: emailTemplate.templateType.description } : undefined,
                content: view === VIEWS.VIEW ? getValue(emailTemplate, 'templateType.description') : '',
                onChange: (event) => {
                    setValidKeys(((event || {}).templateType || {}).params);
                }
            },
            {
                component: view === VIEWS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.SELECT,
                name: 'company',
                label: 'Company',
                className: 'w-50',
                options: companies,
                initialValue: view !== VIEWS.VIEW && emailTemplate && Boolean(emailTemplate.company) ? { value: emailTemplate.company.id, label: emailTemplate.company.name } : undefined,
                isDisabled: Boolean(emailTemplate),
            },
            {
                component: view === VIEWS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.INPUT_AS_TEXT,
                name: 'subject',
                label: 'Subject',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                initialValue: (emailTemplate || {}).subject || undefined,
                content: view === VIEWS.VIEW ? getValue(emailTemplate, 'subject') : ''
            },
            {
                component: view === VIEWS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXT_FIELD,
                name: 'emailFrom',
                label: 'Email From',
                description: 'Add semi-colon seperated email addresses. Ex: test@test.com;test1@test.com',
                initialValue: (emailTemplate || {}).emailFrom || undefined,
                content: view === VIEWS.VIEW ? getValue(emailTemplate, 'emailFrom') : ''
            },
            {
                component: view === VIEWS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXT_FIELD,
                name: 'emailTo',
                label: 'Email To',
                description: 'Add semi-colon seperated email addresses. Ex: test@test.com;test1@test.com',
                initialValue: (emailTemplate || {}).emailTo || undefined,
                content: view === VIEWS.VIEW ? getValue(emailTemplate, 'emailTo') : ''
            },
            {
                component: view === VIEWS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXT_FIELD,
                name: 'emailCC',
                label: 'Email CC',
                description: 'Add semi-colon seperated email addresses. Ex: test@test.com;test1@test.com',
                initialValue: (emailTemplate || {}).emailCC || undefined,
                content: view === VIEWS.VIEW ? getValue(emailTemplate, 'emailCC') : ''
            },
            {
                component: view === VIEWS.VIEW ? componentTypes.HTML : componentTypes.TEXT_EDITOR,
                name: 'body',
                label: 'Email Body',
                placeholder: 'Enter Email Body...',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                initialValue: (emailTemplate || {}).body || undefined,
                content: view === VIEWS.VIEW ? getValue(emailTemplate, 'body') : '',
                description: (validKeys || []).length > 0 ? `Valid Keys: ${validKeys.join(UI_DELIMITER)}` : null
            },
            {
                component: view === VIEWS.VIEW ? componentTypes.HTML : componentTypes.TEXT_EDITOR,
                name: 'signature',
                placeholder: 'Enter Email Signature...',
                label: 'Email Signature',
                initialValue: (emailTemplate || {}).signature || undefined,
                content: view === VIEWS.VIEW ? getValue(emailTemplate, 'signature') : ''
            }
        ]
    }

    function backToList(event) {
        preventDefault(event);
        changeView(VIEWS.LIST);
    }

    function handleSubmit() {
        if (form.valid) {
            const { templateType, subject, emailFrom, emailTo, emailCC, body, signature, company } = templateDetails;
            const payload = {
                subject,
                emailFrom: emailFrom || '',
                emailTo: emailTo || '',
                emailCC: emailCC || '',
                body,
                companyId: company ? company.value : undefined,
                signature: signature || '',
                templateTypeId: templateType.value,
                templateType: { id: templateType.value, description: templateType.label }
            };
            if (Boolean(emailTemplate)) {
                payload['id'] = emailTemplate.id;
                updateEmailTemplate(payload);
            } else {
                createEmailTemplate(payload);
            }
        }
    }

    useEffect(() => {
        if (emailTemplate) {
            const { templateType, company } = emailTemplate;
            setTemplateDetails({
                ...templateDetails,
                ...emailTemplate,
                company: company ? { value: company.id, label: company.name } : undefined,
                templateType: {
                    value: templateType.id,
                    label: templateType.description
                }
            });
            if (templateType && templateType.parameters) {
                setValidKeys(templateType.parameters.split(API_DELIMITER));
            }
        }
    }, [emailTemplate])

    return (
        <>
            <div className="d-flex flex-column h-full position-relative">
                <nav aria-label="breadcrumb">
                    <ol className={`breadcrumb d-flex justify-content-start my-3 px-2 ${styles.breadcrumb}`}>
                        <li className="breadcrumb-item ">
                            <Link href="/" onClick={backToList} className="fw-bold">Manage Email Templates</Link>
                        </li>
                        <li className="breadcrumb-item">
                            <span className="fw-bold">{Boolean(emailTemplate) ? getValue(emailTemplate, 'templateType.description') : 'Add Email Template'}</span>
                        </li>
                    </ol>
                </nav>
                <div className="card border-0 p-4 m-4 mt-0" style={{ maxWidth: '968px' }}>
                    <div className="d-flex flex-column h-100 justify-space-between p-4">
                        <FormRenderer FormTemplate={FormTemplate}
                            initialValues={templateDetails}
                            componentMapper={ComponentMapper}
                            schema={schema}
                            debug={debugForm}
                        />
                        <div className="d-flex justify-content-between mt-4">
                            <Button variant="outline-secondary" className="btn btn-outline-secondary px-4" onClick={backToList}>{'Back to List'}</Button>
                            {
                                view !== VIEWS.VIEW &&
                                <Button variant="primary" onClick={handleSubmit} className="px-4 ms-3" disabled={!form.valid}>
                                    {Boolean(emailTemplate) ? 'Save' : 'Create'}
                                </Button>
                            }
                        </div>
                    </div>
                </div>
            </div>
            {
                (creating || updating) && <PageLoader>{creating ? 'Creating...' : 'Updating...'}</PageLoader>
            }
        </>
    )
}

export default EmailTemplateDetails;