import { componentTypes, validatorTypes } from "@data-driven-forms/react-form-renderer";
import React, { useState } from "react";
import FormRenderer, { ComponentMapper, FormTemplate } from "../../../common/FormRenderer";
import { Button } from "react-bootstrap";

function CompanySPOC({ onNext, onPrevious, company, parentCompany }) {
    const [form, setForm] = useState({});

    function debugForm(_form) {
        setForm(_form);
    }

    const schema = {
        fields: [
            {
                component: componentTypes.TEXT_FIELD,
                name: 'code',
                label: 'Code',
                validate: [
                    { type: validatorTypes.REQUIRED },
                    { type: validatorTypes.MAX_LENGTH, threshold: 4 },
                    { type: validatorTypes.PATTERN, pattern: /[a-zA-Z0-9]{3,4}/, message: 'Should be alphanumeric value of length 3 or 4' }
                ],
                styleClass: 'text-uppercase',
            },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'name',
                label: 'Name',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ]
            },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'designation',
                label: 'Designation',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ]
            },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'department',
                label: 'Department',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ]
            },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'phone',
                label: 'Phone',
                validate: [
                    { type: validatorTypes.REQUIRED },
                    { type: validatorTypes.MAX_LENGTH, threshold: 10 },
                    { type: validatorTypes.PATTERN, pattern: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, message: 'Should be numeric value of length 10' }
                ]
            },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'email',
                label: 'Email',
                validate: [
                    { type: validatorTypes.REQUIRED },
                    { type: validatorTypes.PATTERN, pattern: /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/, message: 'Should be email patteren' }
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
                <div className="d-flex flex-column h-100 justify-space-between w-25 p-4">
                    <FormRenderer FormTemplate={FormTemplate}
                        initialValues={{ hideButtons: true }}
                        componentMapper={ComponentMapper}
                        schema={schema}
                        debug={debugForm}
                    />
                    <div className="d-flex justify-content-between">
                        <div></div>
                        <Button variant="outline-secondary" className="btn btn-outline-secondary px-4" onClick={handleCancel}>{'Previous'}</Button>
                        <Button variant="primary" onClick={handleSubmit} className="px-4" disabled={!form.valid}>{'Save & Continue'}</Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CompanySPOC;