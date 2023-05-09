import React, { useEffect, useState } from "react";
import FormRenderer, { ComponentMapper, FormTemplate } from "../../../common/FormRenderer";
import { componentTypes, validatorTypes } from "@data-driven-forms/react-form-renderer";
import { Button } from "react-bootstrap";
import { EmployeesCount, Reputation, Revenue } from "../Master.constants";
import { BUSINESS_TYPES, COMPANY_REQUEST, COMPANY_STATUSES } from "./Companies.constants";



function CompanyDetails({ onNext, onPrevious, company }) {
    const [form, setForm] = useState({});
    const [companyDetails, setCompanyDetails] = useState({ hideButtons: true, isParent: true });

    function debugForm(_form) {
        setForm(_form);
        setCompanyDetails(_form.values);
    }

    const schema = {
        fields: [
            {
                component: componentTypes.TEXT_FIELD,
                name: 'code',
                label: 'Company Code',
                validate: [
                    { type: validatorTypes.REQUIRED },
                    { type: validatorTypes.MAX_LENGTH, threshold: 4 },
                    { type: validatorTypes.PATTERN, pattern: /[a-zA-Z0-9]{3,4}/, message: 'Should be alphanumeric value of length 3 or 4' }
                ],
                styleClass: 'text-uppercase',
                disabled: !Boolean(company)
            },
            // {
            //     component: componentTypes.CHECKBOX,
            //     name: 'isParent',
            //     label: 'Is Associate Company'
            // },
            // {
            //     component: componentTypes.SELECT,
            //     name: 'parentCompany',
            //     label: 'Parent Company',
            //     condition: {
            //         when: 'isParent',
            //         is: false,
            //         then: { visible: true }
            //     },
            //     options: companies
            // },
            // {
            //     component: componentTypes.WIZARD,
            //     name: 'emptySpace1',
            //     condition: {
            //         when: 'isParent',
            //         is: true,
            //         then: { visible: true }
            //     },
            // },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'name',
                label: 'Company Name',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ]
            },
            // {
            //     component: componentTypes.TEXT_FIELD,
            //     name: 'formalName',
            //     label: 'Formal Name',
            //     validate: [
            //         { type: validatorTypes.REQUIRED }
            //     ]
            // },
            {
                component: componentTypes.SELECT,
                name: 'businessType',
                label: 'Business Type',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                isMulti: true,
                options: BUSINESS_TYPES
            },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'websiteUrl',
                label: 'Website',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ]
            },
            // {
            //     component: componentTypes.TEXT_FIELD,
            //     name: 'essWebsiteUrl',
            //     label: 'ESS Website',
            //     validate: [
            //         { type: validatorTypes.REQUIRED }
            //     ]
            // },
            // {
            //     component: componentTypes.SELECT,
            //     name: 'source',
            //     label: 'Source',
            //     validate: [
            //         { type: validatorTypes.REQUIRED }
            //     ],
            //     options: [{id: 'Email', name: 'Email'}]
            // },
            // {
            //     component: componentTypes.SELECT,
            //     name: 'sourcingType',
            //     label: 'Sourcing Type',
            //     validate: [
            //         { type: validatorTypes.REQUIRED }
            //     ],
            //     options: [{id: 'Out Sourcing', name: 'Out Sourcing'}]
            // },
            // {
            //     component: componentTypes.SELECT,
            //     name: 'clientType',
            //     label: 'Client Type',
            //     validate: [
            //         { type: validatorTypes.REQUIRED }
            //     ],
            //     options: [{id: 'All', name: 'All'}]
            // },
            // {
            //     component: componentTypes.TEXT_FIELD,
            //     name: 'maxFilesAllowed',
            //     label: 'Payroll Input Max Files allowed',
            //     validate: [
            //         { type: validatorTypes.REQUIRED }
            //     ]
            // },
            // {
            //     component: componentTypes.TEXT_FIELD,
            //     name: 'postedBy',
            //     label: 'Posted By'
            // },
            // {
            //     component: componentTypes.TEXT_FIELD,
            //     name: 'department',
            //     label: 'Department'
            // },
            // {
            //     component: componentTypes.TEXT_FIELD,
            //     name: 'designation',
            //     label: 'Designation'
            // },
            // {
            //     component: componentTypes.SELECT,
            //     name: 'revenue',
            //     label: 'Revenue',
            //     options: Revenue.map(x => {
            //         return {id: x, name: x}
            //     })
            // },
            // {
            //     component: componentTypes.SELECT,
            //     name: 'reputation',
            //     label: 'Reputation',
            //     validate: [
            //         { type: validatorTypes.REQUIRED }
            //     ],
            //     options: Reputation.map(x => {
            //         return {id: x, name: x}
            //     })
            // },
            // {
            //     component: componentTypes.PLAIN_TEXT,
            //     name: 'datePosted',
            //     label: 'Date Posted'
            // },
            {
                component: componentTypes.SELECT,
                name: 'status',
                label: 'Status',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                options: COMPANY_STATUSES
            },
            {
                component: componentTypes.SELECT,
                name: 'employees',
                label: 'Employees',
                options: EmployeesCount.map(x => {
                    return { id: x, name: x }
                })
            },
        ]
    }

    function handleSubmit() {
        if (form.valid) {
            const { code, name, businessType, websiteUrl, status, employees } = form.values;
            const payload = {
                ...COMPANY_REQUEST,
                ...company,
                code: code.toUpperCase(),
                name,
                businessType: businessType.map(x => x.value).join(','),
                websiteUrl,
                isActive: status.value === 'Active',
                employees: employees.value,
                isParent: true
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
            const { businessType, isActive, employees } = company || {};
            setCompanyDetails({
                hideButtons: true,
                ...company,
                businessType: (businessType || '').split(',').map(x => {
                    return { value: x, label: x }
                }),
                status: isActive ? { value: 'Active', label: 'Active' } : { value: 'Inactive', label: 'Inactive' },
                employees: employees ? { value: employees, label: employees } : null
            });
        }
    }, [company]);

    return (
        <>
            <div className="card border-0 p-4 m-4 ">
                <div className="d-flex flex-column h-100 justify-space-between p-4 horizontal-form">
                    <FormRenderer FormTemplate={FormTemplate}
                        initialValues={companyDetails}
                        componentMapper={ComponentMapper}
                        schema={schema}
                        debug={debugForm}
                    />
                    <div className="d-flex justify-content-between mt-4">
                        <Button variant="outline-secondary" className="btn btn-outline-secondary px-4" onClick={handleCancel}>{'Cancel'}</Button>
                        <Button variant="primary" onClick={handleSubmit} className="px-4" disabled={!form.valid}>{company ? 'Save' : 'Next'}</Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CompanyDetails;