import React, { useState } from "react";
import FormRenderer, { ComponentMapper, FormTemplate } from "../../../common/FormRenderer";
import { componentTypes, validatorTypes } from "@data-driven-forms/react-form-renderer";
import { Button } from "react-bootstrap";
import { useGetCompanies } from "../../../../backend/masters";

function CompanyDetails({ onNext, onPrevious, company, parentCompany }) {
    const [form, setForm] = useState({});
    const [isParent, setIsParent] = useState(true);
    const { companies } = useGetCompanies(!isParent ? { isParent } : null, !isParent);

    function debugForm(_form) {
        setForm(_form);
        if (isParent !== _form.values.isParent) {
            setIsParent(_form.values.isParent);
        }
    }

    const schema = {
        fields: [
            {
                component: componentTypes.TEXT_FIELD,
                name: 'name',
                label: 'Company Name',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ]
            },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'code',
                label: 'Company Code',
                validate: [
                    { type: validatorTypes.REQUIRED },
                    { type: validatorTypes.MAX_LENGTH, threshold: 4 },
                    { type: validatorTypes.PATTERN, pattern: /[a-zA-Z0-9]{3,4}/, message: 'Should be alphanumeric value of length 3 or 4' }
                ],
            },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'bussinessline',
                label: 'Bussiness Line',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ]
            },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'logo',
                label: 'Company Logo',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ]
            },
            {
                component: componentTypes.CHECKBOX,
                name: 'isParent',
                label: 'Is Parent Company'
            },
            {
                component: componentTypes.SELECT,
                name: 'parentCompany',
                label: 'Parent Company',
                condition: {
                    when: 'isParent',
                    is: false,
                    then: { visible: true }
                },
                options: companies
            },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'websiteUrl',
                label: 'Website',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ]
            }
        ]
    }

    function handleSubmit() {
        if (form.valid) {
            onNext();
        }
    }

    function handleCancel() {
        onPrevious();
    }

    return (
        <>
            <div className="card border-0 p-4 m-4 ">
                <div className="d-flex flex-column h-100 justify-space-between col-5 p-4">
                    <FormRenderer FormTemplate={FormTemplate}
                        initialValues={{ hideButtons: true, isParent: true }}
                        componentMapper={ComponentMapper}
                        schema={schema}
                        debug={debugForm}
                    />
                    <div className="d-flex justify-content-between mt-4">
                        <Button variant="outline-secondary" className="btn btn-outline-secondary px-4" onClick={handleCancel}>{'Cancel'}</Button>
                        <Button variant="primary" onClick={handleSubmit} className="px-4" disabled={!form.valid}>{'Save & Continue'}</Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CompanyDetails;