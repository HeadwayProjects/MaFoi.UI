import React, { useEffect, useState } from "react";
import FormRenderer, { ComponentMapper, FormTemplate, componentTypes } from "../../common/FormRenderer";
import { ACTIONS } from "../../common/Constants";
import { validatorTypes } from "@data-driven-forms/react-form-renderer";
import { getValue } from "../../../utils/common";
import { useGetCompanies, useGetCompanyLocations } from "../../../backend/masters";
import { DEFAULT_OPTIONS_PAYLOAD } from "../../common/Table";
import { Button } from "react-bootstrap";
import { ACTIVITY_TYPE, API_DELIMITER } from "../../../utils/constants";

function locationOptionLabel({ label, location }: any) {
    return (
        <div className="d-flex flex-column">
            <div>{label}</div>
            {
                Boolean(location) &&
                <>
                    <div className="text-sm fw-bold">{location.city.label} | {location.state.label}</div>
                </>
            }
        </div>
    )
}

export default function CompanyDetails({ action, data, onSubmit }: any) {

    const [details, setDetails] = useState({});
    const [parentCompany, setParentCompany] = useState<any>();
    const [associateCompany, setAssociateCompany] = useState<any>();
    const [location, setLocation] = useState<any>(null);
    const [establishmentTypes, setEstablishmentTypes] = useState<any[]>([]);
    const { companies: parentCompanies, isFetching: fetchingParentCompanies } = useGetCompanies({ ...DEFAULT_OPTIONS_PAYLOAD, filters: [{ columnName: 'isParent', value: 'true' }] });
    const { companies: associateCompanies, isFetching: fetchingAssociateCompanies } = useGetCompanies({
        ...DEFAULT_OPTIONS_PAYLOAD,
        filters: [
            { columnName: 'isParent', value: 'false' },
            { columnName: 'parentCompanyId', value: (parentCompany || {}).id }
        ]
    }, Boolean(parentCompany));
    const { locations, isFetching: fetchingLocs } = useGetCompanyLocations({
        ...DEFAULT_OPTIONS_PAYLOAD,
        filters: [{ columnName: 'companyId', value: (associateCompany || {}).id }],
        sort: { columnName: 'locationName', order: 'asc' }
    }, Boolean(associateCompany));

    const schema = {
        fields: [
            {
                component: action === ACTIONS.ADD ? componentTypes.SELECT : componentTypes.PLAIN_TEXT,
                name: 'company',
                label: 'Company',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                isLoading: fetchingParentCompanies,
                content: action !== ACTIONS.ADD ? getValue(details, 'company.label') : '',
                options: parentCompanies,
                onChange: ({ value, label, company }: any) => {
                    setParentCompany(company);
                    setAssociateCompany(undefined);
                    setEstablishmentTypes([]);
                    setDetails({
                        ...details,
                        company: { value, label },
                        associateCompany: null,
                        location: null,
                        stateId: null,
                        establishmentType: null
                    });
                }
            },
            {
                component: action === ACTIONS.ADD ? componentTypes.SELECT : componentTypes.PLAIN_TEXT,
                name: 'associateCompany',
                label: 'Associate Company',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: action !== ACTIONS.ADD ? getValue(details, 'associateCompany.label') : '',
                options: associateCompanies,
                isDisabled: !Boolean(parentCompany),
                isLoading: fetchingAssociateCompanies,
                onChange: ({ value, label, associateCompany }: any) => {
                    setAssociateCompany(associateCompany);
                    setEstablishmentTypes(associateCompany.establishmentType.split(API_DELIMITER));
                    setDetails({
                        ...details,
                        associateCompany: { value, label, associateCompany },
                        establishmentType: null,
                        location: null,
                        stateId: null
                    });
                }
            },
            {
                component: action === ACTIONS.ADD ? componentTypes.SELECT : componentTypes.PLAIN_TEXT,
                name: 'location',
                label: 'Location',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                options: (locations || []).map(({ location }: any) => {
                    const { id, name, code, cities } = location;
                    const { state } = cities;
                    return {
                        id, name, code,
                        city: { code: cities.code, label: cities.name, value: cities.id },
                        state: { code: state.code, label: state.name, value: state.id }
                    }
                }),
                content: action !== ACTIONS.ADD ? getValue(details, 'location.label') : '',
                isDisabled: !Boolean(associateCompany),
                isLoading: fetchingLocs,
                onChange: ({ value, label, location }: any) => {
                    setLocation(location);
                    setDetails({ ...details, location: { value, label, location }, stateId: location.state.value });
                },
                formatOptionLabel: action === ACTIONS.ADD ? locationOptionLabel : '',
            },
            {
                component: action === ACTIONS.ADD ? componentTypes.SELECT : componentTypes.PLAIN_TEXT,
                name: 'establishmentType',
                label: 'Establishment Type',
                options: establishmentTypes,
                content: action !== ACTIONS.ADD ? getValue(details, 'establishmentType.label') : '',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                onChange: ({ value, label }: any) => {
                    setDetails({ ...details, establishmentType: { value, label } });
                }
            },
            {
                component: action === ACTIONS.ADD ? componentTypes.SELECT : componentTypes.PLAIN_TEXT,
                name: 'auditted',
                label: 'Audit Type',
                options: Object.values(ACTIVITY_TYPE),
                content: action !== ACTIONS.ADD ? getValue(details, 'auditted.label') : '',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                onChange: (auditted: any) => {
                    setDetails({ ...details, auditted });
                }
            }
        ]
    };

    function handleSubmit() {
        onSubmit(details)
    }

    useEffect(() => {
        if (Object.keys(data || {}).length) {
            const { company, associateCompany } = data;
            setParentCompany(company.company);
            setAssociateCompany(associateCompany.associateCompany);
            setEstablishmentTypes(associateCompany.associateCompany.establishmentType.split(API_DELIMITER));
            setDetails({ ...details, ...data });
        }
    }, [data])
    return (
        <>
            <FormRenderer FormTemplate={FormTemplate}
                initialValues={{
                    buttonWrapStyles: 'justify-content-start',
                    submitBtnText: 'Next',
                    ...details,
                    hideButtons: action === ACTIONS.VIEW
                }}
                componentMapper={ComponentMapper}
                schema={schema}
                onSubmit={handleSubmit}
            />
        </>
    )
}