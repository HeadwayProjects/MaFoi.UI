import { validatorTypes } from "@data-driven-forms/react-form-renderer";
import React, { useEffect, useState } from "react";
import FormRenderer, { ComponentMapper, FormTemplate, componentTypes } from "../../../common/FormRenderer";
import { Button } from "react-bootstrap";
import { useCreateSmtp, useGetCompanies, useGetSmtpDetails, useUpdateSmtp } from "../../../../backend/masters"
import { PATTERNS } from "../../../common/Constants";
import { toast } from "react-toastify";
import { API_RESULT, ERROR_MESSAGES } from "../../../../utils/constants";
import PageLoader from "../../../shared/PageLoader";
import { DEFAULT_PAYLOAD } from "../../../common/Table";

function CompanySMTP({ onNext, onPrevious, company, parentCompany }) {
    const [t] = useState(new Date().getTime());
    const [form, setForm] = useState({});
    const [next, setNext] = useState(false);
    const [smtpDetails, setSmtpDetails] = useState({ hideButtons: true });
    const { companies, isFetching: fecthingAcs } = useGetCompanies({
        ...DEFAULT_PAYLOAD,
        filters: [
            { columnName: 'isCopied', value: 'YES' },
            { columnName: 'isParent', value: 'false' },
            { columnName: 'parentCompanyId', value: (company || {}).id }
        ]
    }, Boolean((company || {}).id && !parentCompany));
    const [ac, setAc] = useState(null);
    const [requestDetails, setRequestDetails] = useState();
    const { smtp, invalidate, isFetching } = useGetSmtpDetails((company || {}).id, { t }, Boolean(company));
    const { smtp: _smtp, invalidate: _invalidate } = useGetSmtpDetails((ac || {}).id, { t }, Boolean(ac));
    const { createSmtp, creating } = useCreateSmtp(successCallback, errorCallback);
    const { updateSmtp, updating } = useUpdateSmtp(successCallback, errorCallback);
    const { createSmtp: _createSmtp } = useCreateSmtp(_invalidate);
    const { updateSmtp: _updateSmtp } = useUpdateSmtp(_invalidate);

    function successCallback({ key, value }) {
        if (key === API_RESULT.SUCCESS) {
            toast.success(value);
            updateSMTPForAC()
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

    function updateSMTPForAC() {
        const acRequest = { ...requestDetails };
        if (ac) {
            acRequest.companyId = ac.id;
            if ((_smtp || {}).id) {
                acRequest.id = _smtp.id;
                _updateSmtp(acRequest);
            } else {
                _createSmtp(acRequest);
            }
        }
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
                setRequestDetails(payload);
                updateSmtp(payload);
            } else {
                setRequestDetails(payload);
                createSmtp(payload);
            }
        }
    }

    useEffect(() => {
        if (!isFetching && smtp) {
            setSmtpDetails({
                ...smtpDetails,
                ...smtp,
                password: null
            });
        }
    }, [isFetching]);

    useEffect(() => {
        if (!fecthingAcs && companies) {
            const _ac = (companies || [])[0] || null;
            setAc(_ac)
        }
    }, [fecthingAcs])

    return (
        <>
            <div className="card border-0 p-4 m-4 ">
                <div className="d-flex flex-column h-100 justify-space-between horizontal-form p-4">
                    <FormRenderer FormTemplate={FormTemplate}
                        initialValues={smtpDetails}
                        componentMapper={ComponentMapper}
                        schema={schema}
                        debug={debugForm}
                    />
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