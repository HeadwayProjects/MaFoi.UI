import { componentTypes, validatorTypes } from "@data-driven-forms/react-form-renderer";
import React, { useEffect, useState } from "react";
import FormRenderer, { ComponentMapper, FormTemplate } from "../../../common/FormRenderer";
import { Button } from "react-bootstrap";
import { COMPANY_REQUEST } from "./Companies.constants";

function CompanyTDS({ onNext, onPrevious, company, parentCompany }) {
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
                className: 'grid-col-100 text-lg fw-bold'
            },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'pan',
                label: 'PAN No',
                validate: [
                    { type: validatorTypes.REQUIRED },
                    { type: validatorTypes.PATTERN, pattern: /[A-Z]{5}[0-9]{4}[A-Z]{1}$/, message: 'Invalid PAN format' }
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
                    { type: validatorTypes.PATTERN, pattern: /[A-Z]{4}[0-9]{5}[A-Z]{1}$/, message: 'Invalid TAN format' }
                ],
                styleClass: 'text-uppercase',
                description: 'Example: ABCD12345Z'
            },
            {
                component: componentTypes.WIZARD,
                name: 'emptySpace1',
            },
            // {
            //     component: componentTypes.TEXT_FIELD,
            //     name: 'name',
            //     label: 'Full Name',
            //     validate: [
            //         { type: validatorTypes.REQUIRED }
            //     ]
            // },
            // {
            //     component: componentTypes.TEXT_FIELD,
            //     name: 'fatherName',
            //     label: 'S/o D/o W/o ',
            //     validate: [
            //         { type: validatorTypes.REQUIRED }
            //     ]
            // },
            // {
            //     component: componentTypes.TEXT_FIELD,
            //     name: 'designation',
            //     label: 'Designation',
            //     validate: [
            //         { type: validatorTypes.REQUIRED }
            //     ]
            // },
            // {
            //     component: componentTypes.TEXT_FIELD,
            //     name: 'phoneNumber',
            //     label: 'Phone Number',
            //     validate: [
            //         { type: validatorTypes.REQUIRED }
            //     ]
            // },
            // {
            //     component: componentTypes.TEXT_FIELD,
            //     name: 'mobilenumber',
            //     label: 'Mobile Number',
            //     validate: [
            //         { type: validatorTypes.REQUIRED }
            //     ]
            // },
            // {
            //     component: componentTypes.TEXT_FIELD,
            //     name: 'email',
            //     label: 'Email',
            //     validate: [
            //         { type: validatorTypes.REQUIRED }
            //     ]
            // },
            // {
            //     component: componentTypes.TEXT_FIELD,
            //     name: 'place',
            //     label: 'Place',
            //     validate: [
            //         { type: validatorTypes.REQUIRED }
            //     ]
            // },
            {
                component: componentTypes.TAB_ITEM,
                name: 'subHeader2',
                content: 'PF Details',
                className: 'grid-col-100 text-lg fw-bold'
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
            }
        ]
    }

    function handleSubmit() {
        if (form.valid) {
            onNext();
            const { pan, tan,
                pF_Ac_No, pF_Establishment_Code, pF_Deduction_Percent, pF_Base_Limit, pF_Establishment_Id
            } = form.values;

            const payload = {
                ...COMPANY_REQUEST,
                ...company,
                pan,
                tan,
                pF_Ac_No,
                pF_Establishment_Code,
                pF_Deduction_Percent,
                pF_Base_Limit,
                pF_Establishment_Id
            }
            delete payload.hideButtons;
            onNext(payload);
        }
    }

    function handleCancel() {
        onPrevious();
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
                        initialValues={{ hideButtons: true }}
                        componentMapper={ComponentMapper}
                        schema={schema}
                        debug={debugForm}
                    />
                    <div className="d-flex justify-content-between mt-4">
                        <Button variant="outline-secondary" className="btn btn-outline-secondary px-4" onClick={handleCancel}>{'Previous'}</Button>
                        <Button variant="primary" onClick={handleSubmit} className="px-4" disabled={!form.valid}>{'Save'}</Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CompanyTDS;