import { componentTypes, validatorTypes } from "@data-driven-forms/react-form-renderer";
import React, { useState } from "react";
import FormRenderer, { ComponentMapper, FormTemplate } from "../../../common/FormRenderer";
import { Button } from "react-bootstrap";

function CompanyTDS({ onNext, onPrevious, company, parentCompany }) {
    const [form, setForm] = useState({});

    function debugForm(_form) {
        setForm(_form);
    }

    const schema = {
        fields: [
            {
                component: componentTypes.TAB_ITEM,
                name: 'subHeader1',
                content: 'TDS Details',
                className: 'grid-col-100 text-lg fw-bold'
            },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'pan',
                label: 'PAN No',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ]
            },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'tan',
                label: 'TAN No',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ]
            },
            {
                component: componentTypes.WIZARD,
                name: 'emptySpace1',
            },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'name',
                label: 'Full Name',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ]
            },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'fatherName',
                label: 'S/o D/o W/o ',
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
                name: 'phoneNumber',
                label: 'Phone Number',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ]
            },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'mobilenumber',
                label: 'Mobile Number',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ]
            },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'email',
                label: 'Email',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ]
            },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'place',
                label: 'Place',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ]
            },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'assessmentRange',
                label: 'Asmt. Range'
            },
            {
                component: componentTypes.TAB_ITEM,
                name: 'subHeader2',
                content: 'PF Details',
                className: 'grid-col-100 text-lg fw-bold'
            },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'pfAccountNo',
                label: 'PF Account No'
            },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'pfBaseLimit',
                label: 'PF Base Limit'
            },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'pfPercentageDeduction',
                label: 'PF % Deduction'
            },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'eps',
                label: 'EPS'
            },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'pfAdminPercentage',
                label: 'PF Admin %'
            },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'pf',
                label: 'PF'
            },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'edliAdminPercentage',
                label: 'EDLI Admin %'
            },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'edliPercentage',
                label: '% of EDLI'
            },
            {
                component: componentTypes.CHECKBOX,
                name: 'autoGeneratePF',
                label: 'Auto Generate Employee PF No'
            },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'pfEstablishmentCode',
                label: 'PF Establishment Code'
            },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'pfEstablishmentId',
                label: 'PF Establishment Id'
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
                <div className="d-flex flex-column h-100 justify-space-between horizontal-form p-4">
                    <FormRenderer FormTemplate={FormTemplate}
                        initialValues={{ hideButtons: true }}
                        componentMapper={ComponentMapper}
                        schema={schema}
                        debug={debugForm}
                    />
                    <div className="d-flex justify-content-between mt-4">
                        <Button variant="outline-secondary" className="btn btn-outline-secondary px-4" onClick={handleCancel}>{'Previous'}</Button>
                        <Button variant="primary" onClick={handleSubmit} className="px-4" disabled={!form.valid}>{'Submit'}</Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CompanyTDS;