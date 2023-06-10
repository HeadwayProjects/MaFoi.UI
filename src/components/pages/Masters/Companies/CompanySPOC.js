import { validatorTypes } from "@data-driven-forms/react-form-renderer";
import React, { useEffect, useState } from "react";
import FormRenderer, { ComponentMapper, FormTemplate, componentTypes } from "../../../common/FormRenderer";
import { Button } from "react-bootstrap";
import styles from "./Companies.module.css"
import { COMPANY_REQUEST } from "./Companies.constants";
import { useGetCities, useGetStates } from "../../../../backend/masters"
import { DEFAULT_OPTIONS_PAYLOAD } from "../../../common/Table";
import { PATTERNS } from "../../../common/Constants";

function CompanySPOC({ onNext, onPrevious, onSubmit, company, parentCompany }) {
    const [form, setForm] = useState({});
    const [state, setState] = useState();
    const [companyDetails, setCompanyDetails] = useState({ hideButtons: true });
    const { states, isFetching: fetchingStates } = useGetStates({ ...DEFAULT_OPTIONS_PAYLOAD });
    const { cities, isFetching: fetchingCities } = useGetCities({
        ...DEFAULT_OPTIONS_PAYLOAD,
        filters: [{ columnName: 'stateId', value: (state || {}).value }]
    }, Boolean(state));

    function debugForm(_form) {
        setForm(_form);
        setCompanyDetails(_form.values);
    }

    function onStateChange(e) {
        setState(e);
        setCompanyDetails({ ...companyDetails, state: e, city: null });
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
                component: componentTypes.SELECT,
                name: 'state',
                label: 'State',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                options: states,
                onChange: onStateChange.bind(this)
            },
            {
                component: componentTypes.SELECT,
                name: 'city',
                label: 'City',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                options: cities,
                isDisabled: !Boolean(state),
                isLoading: fetchingStates
            },
            {
                component: componentTypes.SELECT,
                name: 'country',
                label: 'Country',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                options: [{ id: 'India', name: 'India' }],
                isLoading: fetchingCities
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
                    { type: validatorTypes.PATTERN, pattern: PATTERNS.MOBILE, message: 'Should be numeric value of length 10' }
                ]
            },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'email',
                label: 'Email',
                validate: [
                    { type: validatorTypes.REQUIRED },
                    { type: validatorTypes.PATTERN, pattern: PATTERNS.EMAIL, message: 'Invalid email format.' }
                ]
            },
            {
                component: componentTypes.TAB_ITEM,
                name: 'subHeader3',
                content: 'Contact Person',
                className: 'grid-col-100 text-lg fw-bold  pb-0'
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
                name: 'contactPersonDepartment',
                label: 'Department'
            },
            {
                component: componentTypes.TAB_ITEM,
                name: 'subHeader4',
                content: 'Contact Phone',
                className: 'grid-col-100 text-lg fw-bold  pb-0'
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
                    { type: validatorTypes.PATTERN, pattern: PATTERNS.MOBILE, message: 'Should be numeric value of length 10' }
                ]
            },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'contactPersonEmail',
                label: 'Business Email',
                validate: [
                    { type: validatorTypes.REQUIRED },
                    { type: validatorTypes.PATTERN, pattern: /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/, message: 'Invalid email format.' }
                ]
            }
        ]
    }

    function handleSubmit(next) {
        if (form.valid) {
            const {
                companyAddress, city, state, country, contactNumber, email,
                contactPersonName, contactPersonDesignation, contactPersonMobile,
                contactPersonEmail, contactPersonDepartment
            } = form.values
            const payload = {
                ...COMPANY_REQUEST,
                ...company,
                companyAddress,
                city: city.label,
                state: state.label,
                country: country.value,
                contactNumber,
                email,
                contactPersonName,
                contactPersonDesignation,
                contactPersonMobile,
                contactPersonEmail,
                contactPersonDepartment
            }
            delete payload.hideButtons;
            delete payload.parentCompany;
            onSubmit(payload, next);
        }
    }

    useEffect(() => {
        if (company) {
            const { country, state, city } = company || {};
            setCompanyDetails({
                hideButtons: true,
                ...company,
                country: Boolean(country) ? { value: country, label: country } : { value: 'India', label: 'India' },
                state: Boolean(state) ? { value: state, label: state } : null,
                city: Boolean(city) ? { value: city, label: city } : null,
            });
        }
    }, [company]);

    useEffect(() => {
        if (!fetchingStates && states) {
            if (company && company.state) {
                const _state = states.find(x => x.name === company.state);
                if (_state) {
                    setState({ value: _state.id, label: _state.name });
                }
            }
        }
    }, [fetchingStates])

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

export default CompanySPOC;