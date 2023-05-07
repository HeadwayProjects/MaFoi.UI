import React, { useState } from "react";
import FormRenderer, { ComponentMapper, FormTemplate } from "../../../common/FormRenderer";
import { componentTypes, validatorTypes } from "@data-driven-forms/react-form-renderer";
import { Button } from "react-bootstrap";
import { useGetCompanies } from "../../../../backend/masters";
import { CompanyStatus, EmployeesCount, Reputation, Revenue } from "../Master.constants";

function CompanyDetails({ onNext, onPrevious, company, parentCompany }) {
    const [form, setForm] = useState({});
    const [isParent, setIsParent] = useState(true);
    const { companies } = useGetCompanies(!isParent ? { isParent: true } : null, !isParent);

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
                name: 'code',
                label: 'Company Code',
                validate: [
                    { type: validatorTypes.REQUIRED },
                    { type: validatorTypes.MAX_LENGTH, threshold: 4 },
                    { type: validatorTypes.PATTERN, pattern: /[a-zA-Z0-9]{3,4}/, message: 'Should be alphanumeric value of length 3 or 4' }
                ],
                disabled: !Boolean(company)
            },
            {
                component: componentTypes.CHECKBOX,
                name: 'isParent',
                label: 'Is Associate Company'
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
                component: componentTypes.WIZARD,
                name: 'emptySpace1',
                condition: {
                    when: 'isParent',
                    is: true,
                    then: { visible: true }
                },
            },
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
                name: 'formalName',
                label: 'Formal Name',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ]
            },
            {
                component: componentTypes.SELECT,
                name: 'businness',
                label: 'Business Type',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                isMulti: true,
                options: [
                    {id: 'IT', name: 'IT'},
                    {id: 'ITES', name: 'ITES'},
                    {id: 'NonIT', name: 'NonIT'},
                ]
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
                options: CompanyStatus.map(x => {
                    return {id: x, name: x}
                })
            },
            {
                component: componentTypes.SELECT,
                name: 'employees',
                label: 'Employees',
                options: EmployeesCount.map(x => {
                    return {id: x, name: x}
                })
            },
        ]
    }

    function handleSubmit() {
        // if (form.valid) {
            onNext();
        // }
    }

    function handleCancel() {
        onPrevious();
    }

    return (
        <>
            <div className="card border-0 p-4 m-4 ">
                <div className="d-flex flex-column h-100 justify-space-between p-4 horizontal-form">
                    <FormRenderer FormTemplate={FormTemplate}
                        initialValues={{ hideButtons: true, isParent: true }}
                        componentMapper={ComponentMapper}
                        schema={schema}
                        debug={debugForm}
                    />
                    <div className="d-flex justify-content-between mt-4">
                        <Button variant="outline-secondary" className="btn btn-outline-secondary px-4" onClick={handleCancel}>{'Cancel'}</Button>
                        <Button variant="primary" onClick={handleSubmit} className="px-4" >{'Save & Continue'}</Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CompanyDetails;