import { validatorTypes } from "@data-driven-forms/react-form-renderer";
import React, { useEffect, useState } from "react";
import FormRenderer, { ComponentMapper, FormTemplate, componentTypes } from "../../../common/FormRenderer";
import { Button } from "react-bootstrap";
import { COMPANY_REQUEST } from "./Companies.constants";
import { PATTERNS } from "../../../common/Constants";

function CompanyTDS({ onNext, onPrevious, onSubmit, company }) {
    const [form, setForm] = useState({});
    const [companyDetails, setCompanyDetails] = useState({ hideButtons: true });

    function debugForm(_form) {
        setForm(_form);
        setCompanyDetails(_form.values);
    }

    const schema = {
        fields: [
            {
                component: componentTypes.TAB_ITEM,
                name: 'subHeader1',
                content: 'TDS Details',
                className: 'grid-col-100 text-lg fw-bold pb-0'
            },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'pan',
                label: 'PAN No',
                validate: [
                    { type: validatorTypes.REQUIRED },
                    { type: validatorTypes.PATTERN, pattern: PATTERNS.PAN, message: 'Invalid PAN format' },
                    { type: validatorTypes.MAX_LENGTH, threshold: 10 }
                ],
                styleClass: 'text-uppercase',
                description: 'Example: ABCDE1234Z'
            },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'tan',
                label: 'TAN No',
                validate: [
                    { type: validatorTypes.REQUIRED },
                    { type: validatorTypes.PATTERN, pattern: PATTERNS.TAN, message: 'Invalid TAN format' },
                    { type: validatorTypes.MAX_LENGTH, threshold: 10 }
                ],
                styleClass: 'text-uppercase',
                description: 'Example: ABCD12345Z'
            },
            {
                component: componentTypes.WIZARD,
                name: 'emptySpace1',
            },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'pan_fullname',
                label: 'Full Name',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ]
            },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'pan_surname',
                label: 'S/o D/o W/o ',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ]
            },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'pan_designation',
                label: 'Designation',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ]
            },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'pan_mobile',
                label: 'Phone Number',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ]
            },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'pan_email',
                label: 'Email',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ]
            },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'pan_place',
                label: 'Place',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ]
            },
            {
                component: componentTypes.TAB_ITEM,
                name: 'subHeader2',
                content: 'PF Details',
                className: 'grid-col-100 text-lg fw-bold pb-0'
            },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'pF_Ac_No',
                label: 'PF Account No'
            },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'pF_Base_Limit',
                label: 'PF Base Limit'
            },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'pF_Deduction_Percent',
                label: 'PF % Deduction'
            },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'pF_Establishment_Code',
                label: 'PF Establishment Code'
            },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'pF_Establishment_Id',
                label: 'PF Establishment Id'
            },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'eps',
                label: 'EPS'
            },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'pF_Admin_Percentage',
                label: 'PF Admin %'
            },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'pF',
                label: 'PF'
            },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'edli_Admin_Percentage',
                label: 'EDLI Admin %'
            },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'edli_Percentage',
                label: '% of EDLI'
            },
            {
                component: componentTypes.CHECKBOX,
                name: 'autoGeneratePF',
                label: 'Auto Generate Employee PF No'
            },
            {
                component: componentTypes.TAB_ITEM,
                name: 'subHeader3',
                content: 'GSTN Details',
                className: 'grid-col-100 text-lg fw-bold pb-0'
            },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'gstn_no',
                label: 'GSTN No.',
                validate: [
                    { type: validatorTypes.REQUIRED },
                    { type: validatorTypes.PATTERN, pattern: PATTERNS.GSTN, message: 'Invalid GSTN format' },
                    { type: validatorTypes.MAX_LENGTH, threshold: 15 }
                ]
            }
        ]
    }

    function handleSubmit(next) {
        if (form.valid) {
            const { pan, tan,
                pF_Ac_No, pF_Establishment_Code, pF_Deduction_Percent, pF_Base_Limit, pF_Establishment_Id,
                pan_fullname, pan_surname, pan_designation, pan_mobile, pan_email, pan_place, gstn_no,
                eps, pF_Admin_Percentage, pF, edli_Admin_Percentage, edli_Percentage
            } = form.values;

            const payload = {
                ...COMPANY_REQUEST,
                ...company,
                pan: pan.toUpperCase(),
                tan: tan.toUpperCase(),
                pF_Ac_No,
                pF_Establishment_Code,
                pF_Deduction_Percent,
                pF_Base_Limit,
                pF_Establishment_Id,
                pan_fullname,
                pan_surname,
                pan_designation,
                pan_mobile,
                pan_email,
                pan_place,
                gstn_no,
                eps,
                pF_Admin_Percentage,
                pF,
                edli_Admin_Percentage,
                edli_Percentage
            }
            delete payload.hideButtons;
            delete payload.parentCompany;
            onSubmit(payload, next);
        }
    }

    useEffect(() => {
        if (company) {
            setCompanyDetails({
                hideButtons: true,
                ...company,
            });
        }
    }, [company]);

    return (
        <>
            <div className="card border-0 p-4 m-4 ">
                <div className="d-flex flex-column h-100 justify-space-between horizontal-form p-4">
                    <FormRenderer FormTemplate={FormTemplate}
                        initialValues={companyDetails}
                        componentMapper={ComponentMapper}
                        schema={schema}
                        debug={debugForm}
                    />
                    <div className="d-flex justify-content-between mt-4">
                        <div>
                            <Button variant="outline-secondary" className="btn btn-outline-secondary px-4" onClick={onPrevious}>{'Previous'}</Button>
                            <Button variant="outline-secondary" className="btn btn-outline-secondary px-4 ms-3" onClick={onNext}>{'Next'}</Button>
                        </div>
                        <div>
                            <Button variant="primary" onClick={() => handleSubmit(false)} className="px-4" disabled={!form.valid}>{'Save'}</Button>
                            <Button variant="primary" onClick={() => handleSubmit(true)} className="px-4 ms-3" disabled={!form.valid}>{'Save & Next'}</Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CompanyTDS;