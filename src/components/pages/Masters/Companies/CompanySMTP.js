import { validatorTypes } from "@data-driven-forms/react-form-renderer";
import React, { useEffect, useState } from "react";
import FormRenderer, { ComponentMapper, FormTemplate, componentTypes } from "../../../common/FormRenderer";
import { Button } from "react-bootstrap";
import styles from "./Companies.module.css"
import { COMPANY_REQUEST } from "./Companies.constants";
import { useCreateSmtp, useGetCities, useGetSmtpDetails, useGetStates, useUpdateSmtp } from "../../../../backend/masters"
import { DEFAULT_OPTIONS_PAYLOAD } from "../../../common/Table";
import { ACTIONS, PATTERNS } from "../../../common/Constants";
import { toast } from "react-toastify";
import { API_RESULT, ERROR_MESSAGES } from "../../../../utils/constants";
import PageLoader from "../../../shared/PageLoader";

function CompanySMTP({ onNext, onPrevious, company }) {
    const [t] = useState(new Date().getTime());
    const [form, setForm] = useState({});
    const [next, setNext] = useState(false);
    const [smtpDetails, setSmtpDetails] = useState({ hideButtons: true });
    const { smtp, invalidate, isFetching } = useGetSmtpDetails((company || {}).id, { t }, Boolean(company));
    const { createSmtp, creating } = useCreateSmtp(successCallback, errorCallback);
    const { updateSmtp, updating } = useUpdateSmtp(successCallback, errorCallback);

    function successCallback({ key, value }) {
        if (key === API_RESULT.SUCCESS) {
            toast.success(value);
            invalidate();
            if (next) {
                onNext();
            }
        } else {
            toast.error(value || ERROR_MESSAGES.DEFAULT);
        }
    }

    function errorCallback() {
        toast.error(ERROR_MESSAGES.ERROR);
    }

    function debugForm(_form) {
        setForm(_form);
        setSmtpDetails(_form.values);
    }

    const schema = {
        fields: [
            {
                component: componentTypes.TAB_ITEM,
                name: 'subHeader1',
                content: 'SMTP Details',
                className: 'grid-col-100 text-lg fw-bold pb-0'
            },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'emailAddress',
                label: 'Email',
                validate: [
                    { type: validatorTypes.REQUIRED },
                    { type: validatorTypes.PATTERN, pattern: PATTERNS.EMAIL, message: 'Invalid email format.' }
                ]
            },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'password',
                label: 'Password',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                fieldType: 'password'
            },
            {
                component: componentTypes.WIZARD,
                name: 'emptySpace1'
            },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'host',
                label: 'Host',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ]
            },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'port',
                label: 'Port',
                validate: [
                    { type: validatorTypes.REQUIRED },
                    { type: validatorTypes.MAX_LENGTH, threshold: 4 }
                ],
                fieldType: 'number'
            }
        ]
    }

    function handleSubmit(_next) {
        if (form.valid) {
            setNext(_next)
            const {
                emailAddress, password, host, port
            } = form.values
            const payload = {
                companyId: company.id,
                emailAddress,
                password,
                host, port
            }
            if (smtp.companyId) {
                payload['id'] = smtp.id;
                updateSmtp(payload);
            } else {
                createSmtp(payload);
            }
        }
    }

    useEffect(() => {
        if (!isFetching && smtp) {
            setSmtpDetails({
                ...smtpDetails,
                ...smtp,
                password: undefined
            });
        }
    }, [isFetching]);

    return (
        <>
            <div className="card border-0 p-4 m-4 ">
                <div className="d-flex flex-column h-100 justify-space-between horizontal-form p-4">
                    {
                        !isFetching &&
                        <FormRenderer FormTemplate={FormTemplate}
                            initialValues={smtpDetails}
                            componentMapper={ComponentMapper}
                            schema={schema}
                            debug={debugForm}
                        />
                    }
                    <div className="d-flex justify-content-between mt-4">
                        <div>
                            <Button variant="outline-secondary" className="btn btn-outline-secondary px-4" onClick={onPrevious}>{'Previous'}</Button>
                            <Button variant="outline-secondary" className="btn btn-outline-secondary px-4 ms-3" onClick={onNext}>{'Cancel'}</Button>
                        </div>
                        <div>
                            <Button variant="primary" onClick={() => handleSubmit(false)} className="px-4" disabled={!form.valid}>{'Save'}</Button>
                            <Button variant="primary" onClick={() => handleSubmit(true)} className="px-4 ms-3" disabled={!form.valid}>{'Save & Close'}</Button>
                        </div>
                    </div>
                </div>
            </div>
            {
                (creating || updating) && <PageLoader />
            }
        </>
    )
}

export default CompanySMTP;