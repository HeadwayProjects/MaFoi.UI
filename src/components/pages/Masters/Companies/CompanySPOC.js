import { componentTypes, validatorTypes } from "@data-driven-forms/react-form-renderer";
import React, { useEffect, useState } from "react";
import FormRenderer, { ComponentMapper, FormTemplate } from "../../../common/FormRenderer";
import { Button } from "react-bootstrap";
import styles from "./Companies.module.css"
import { COMPANY_REQUEST } from "./Companies.constants";

function CompanySPOC({ onNext, onPrevious, company, parentCompany }) {
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
                content: 'Corporate Register Office Address',
                className: 'grid-col-100 text-lg fw-bold pb-0'
            },
            {
                component: componentTypes.TEXTAREA,
                name: 'companyAddress',
                label: 'Address',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                className: styles.addressField
            },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'city',
                label: 'City'
            },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'state',
                label: 'State'
            },
            {
                component: componentTypes.SELECT,
                name: 'country',
                label: 'Country',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                options: [{ id: 'India', name: 'India' }]
            },
            {
                component: componentTypes.TAB_ITEM,
                name: 'subHeader2',
                content: 'Company Phone',
                className: 'grid-col-100 text-lg fw-bold pb-0'
            },
            // {
            //     component: componentTypes.TEXT_FIELD,
            //     name: 'phone',
            //     label: 'Phone',
            //     validate: [
            //         { type: validatorTypes.REQUIRED },
            //         { type: validatorTypes.MAX_LENGTH, threshold: 10 },
            //         { type: validatorTypes.PATTERN, pattern: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, message: 'Should be numeric value of length 10' }
            //     ]
            // },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'contactNumber',
                label: 'Mobile',
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
                    { type: validatorTypes.PATTERN, pattern: /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/, message: 'Invalid email format.' }
                ]
            },
            {
                component: componentTypes.TAB_ITEM,
                name: 'subHeader3',
                content: 'Contact Person',
                className: 'grid-col-100 text-lg fw-bold'
            },
            // {
            //     component: componentTypes.SELECT,
            //     name: 'salutation',
            //     label: 'Salutation',
            //     validate: [
            //         { type: validatorTypes.REQUIRED }
            //     ],
            //     options: Salutation.map(x => {
            //         return { id: x, name: x }
            //     })
            // },
            // {
            //     component: componentTypes.TEXT_FIELD,
            //     name: 'firstName',
            //     label: 'First Name',
            //     validate: [
            //         { type: validatorTypes.REQUIRED }
            //     ]
            // },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'contactPersonName',
                label: 'Name',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ]
            },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'contactPersonDesignation',
                label: 'Designation',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ]
            },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'department',
                label: 'Department'
            },
            {
                component: componentTypes.TAB_ITEM,
                name: 'subHeader4',
                content: 'Contact Phone',
                className: 'grid-col-100 text-lg fw-bold'
            },
            // {
            //     component: componentTypes.TEXT_FIELD,
            //     name: 'business',
            //     label: 'Business'
            // },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'contactPersonMobile',
                label: 'Mobile',
                validate: [
                    { type: validatorTypes.REQUIRED },
                    { type: validatorTypes.MAX_LENGTH, threshold: 10 },
                    { type: validatorTypes.PATTERN, pattern: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, message: 'Should be numeric value of length 10' }
                ]
            },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'contactPersonEmail',
                label: 'Business Email',
                validate: [
                    { type: validatorTypes.PATTERN, pattern: /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/, message: 'Invalid email format.' }
                ]
            }
        ]
    }

    function handleSubmit() {
        if (form.valid) {
            const {
                companyAddress, city, state, country, contactNumber, email,
                contactPersonName, contactPersonDesignation, contactPersonMobile, contactPersonEmail
            } = form.values
            const payload = {
                ...COMPANY_REQUEST,
                ...company,
                companyAddress,
                city,
                state,
                country: country.value,
                contactNumber,
                email,
                contactPersonName,
                contactPersonDesignation,
                contactPersonMobile,
                contactPersonEmail
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
            const { country } = company || {};
            setCompanyDetails({
                hideButtons: true,
                ...company,
                country: Boolean(country) ? { value: country, label: country } : { value: 'India', label: 'India' }
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
                        <Button variant="outline-secondary" className="btn btn-outline-secondary px-4" onClick={handleCancel}>{'Previous'}</Button>
                        <Button variant="primary" onClick={handleSubmit} className="px-4">{'Save'}</Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CompanySPOC;