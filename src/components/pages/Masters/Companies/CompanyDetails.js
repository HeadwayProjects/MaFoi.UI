import React, { useEffect, useState } from "react";
import FormRenderer, { ComponentMapper, FormTemplate } from "../../../common/FormRenderer";
import { componentTypes, validatorTypes } from "@data-driven-forms/react-form-renderer";
import { Button } from "react-bootstrap";
import { EmployeesCount, EstablishmentTypes, FindDuplicateMasters } from "../Master.constants";
import { BUSINESS_TYPES, COMPANY_REQUEST, COMPANY_STATUSES } from "./Companies.constants";
import { useGetCompanies } from "../../../../backend/masters";
import { toast } from "react-toastify";
import { API_DELIMITER } from "../../../../utils/constants";
import { ALLOWED_LOGO_REGEX, FILE_SIZE } from "../../../common/Constants";



function CompanyDetails({ onNext, onPrevious, company, parentCompany }) {
    const [form, setForm] = useState({});
    const [companyDetails, setCompanyDetails] = useState({ hideButtons: true, isAssociateCompany: Boolean(parentCompany), parentCompany });
    const { companies } = useGetCompanies({ isParent: true });

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
                    { type: validatorTypes.MAX_LENGTH, threshold: 10 },
                    { type: validatorTypes.PATTERN, pattern: /[a-zA-Z0-9]{3,10}/, message: 'Should be alphanumeric value of length 3 or 4' }
                ],
                styleClass: 'text-uppercase',
                disabled: !Boolean(company)
            },
            {
                component: componentTypes.CHECKBOX,
                name: 'isAssociateCompany',
                label: 'Is Associate Company',
                disabled: Boolean(company)
            },
            {
                component: componentTypes.SELECT,
                name: 'parentCompany',
                label: 'Parent Company',
                condition: {
                    when: 'isAssociateCompany',
                    is: true,
                    then: { visible: true }
                },
                options: companies,
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                isDisabled: Boolean(company)
            },
            {
                component: componentTypes.WIZARD,
                name: 'emptySpace1',
                condition: {
                    when: 'isAssociateCompany',
                    is: false,
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
            {
                component: componentTypes.SELECT,
                name: 'establishmentType',
                label: 'Establishment Type',
                options: EstablishmentTypes,
                isMulti: true,
                validate: [
                    { type: validatorTypes.REQUIRED }
                ]
            },
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
            {
                component: 'file-upload',
                label: 'Upload Logo',
                name: 'file',
                type: 'file',
                validate: Boolean(company) ? [
                    { type: 'file-type', regex: ALLOWED_LOGO_REGEX },
                    { type: 'file-size', maxSize: 2 * FILE_SIZE.MB }
                ] : [
                    { type: validatorTypes.REQUIRED },
                    { type: 'file-type', regex: ALLOWED_LOGO_REGEX },
                    { type: 'file-size', maxSize: 2 * FILE_SIZE.MB }
                ]
            },
        ]
    }

    function handleSubmit() {
        if (form.valid) {
            const { code, name, businessType, websiteUrl, status,
                employees, isParent, parentCompany, establishmentType, file,
                isAssociateCompany } = form.values;
            if (isParent) {
                const existingData = Boolean(company) ? companies.filter(x => x.id !== (company || {}).id) : [...companies];
                const duplicateCompanies = FindDuplicateMasters(existingData, { code, name });
                if (duplicateCompanies.length) {
                    toast.error(`Few other companies matching code or name. Please update code or name`);
                    return;
                }
            }
            const payload = {
                ...COMPANY_REQUEST,
                ...company,
                code: code.toUpperCase(),
                name,
                businessType: (businessType || []).map(x => x.label).join(API_DELIMITER),
                websiteUrl,
                isActive: status.value === 'Active',
                employees: (employees || {}).value || '',
                isParent: !isAssociateCompany,
                parentCompanyId: (parentCompany || {}).value || '',
                establishmentType: (establishmentType || []).map(x => x.label).join(API_DELIMITER),
                file
            }
            delete payload.hideButtons;
            delete payload.isAssociateCompany;
            delete payload.parentCompany;
            onNext(payload);
        }
    }

    function handleCancel() {
        onPrevious();
    }

    useEffect(() => {
        if (company) {
            const { businessType, isActive, employees, isParent, establishmentType } = company || {};
            setCompanyDetails({
                hideButtons: true,
                ...company,
                businessType: businessType ? businessType.split(API_DELIMITER).map(x => {
                    return { value: x, label: x }
                }) : null,
                status: isActive ? { value: 'Active', label: 'Active' } : { value: 'Inactive', label: 'Inactive' },
                employees: employees ? { value: employees, label: employees } : null,
                isAssociateCompany: !isParent,
                establishmentType: establishmentType ? establishmentType.split(API_DELIMITER).map(x => {
                    return { value: x, label: x };
                }) : null
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