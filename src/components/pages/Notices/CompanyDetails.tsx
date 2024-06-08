import React, { useEffect, useState } from "react";
import FormRenderer, { ComponentMapper, FormTemplate, componentTypes } from "../../common/FormRenderer";
import { ACTIONS } from "../../common/Constants";
import { validatorTypes } from "@data-driven-forms/react-form-renderer";
import { getValue } from "../../../utils/common";
import { useGetCompanies, useGetCompanyLocations, useGetDepartmentUserMappings } from "../../../backend/masters";
import { DEFAULT_OPTIONS_PAYLOAD } from "../../common/Table";
import { ACTIVITY_TYPE, API_DELIMITER } from "../../../utils/constants";
import { getUserDetails, isAdmin, isComplianceUser } from "../../../backend/auth";
import { useGetUserCompanies } from "../../../backend/query";
import { sortBy } from "underscore";

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

export default function CompanyDetails(this: any, { action, data, onSubmit }: any) {

    const [companiesList, setCompanies] = useState<any[]>([]);
    const [associateCompaniesList, setAssociateCompanies] = useState<any[]>([]);
    const [locationsList, setLocations] = useState<any[]>([]);
    const [details, setDetails] = useState({});
    const [parentCompany, setParentCompany] = useState<any>();
    const [associateCompany, setAssociateCompany] = useState<any>();
    const [establishmentTypes, setEstablishmentTypes] = useState<any[]>([]);
    const { companies: parentCompanies, isFetching: fetchingParentCompanies } = useGetCompanies({ ...DEFAULT_OPTIONS_PAYLOAD, filters: [{ columnName: 'isParent', value: 'true' }] }, isAdmin());
    const { companies: associateCompanies, isFetching: fetchingAssociateCompanies } = useGetCompanies({
        ...DEFAULT_OPTIONS_PAYLOAD,
        filters: [
            { columnName: 'isParent', value: 'false' },
            { columnName: 'parentCompanyId', value: (parentCompany || {}).id }
        ]
    }, Boolean(parentCompany) && (isAdmin() || isComplianceUser()));
    const { locations, isFetching: fetchingLocs } = useGetCompanyLocations({
        ...DEFAULT_OPTIONS_PAYLOAD,
        filters: [{ columnName: 'companyId', value: (associateCompany || {}).id }],
        sort: { columnName: 'locationName', order: 'asc' }
    }, Boolean(associateCompany) && (isAdmin() || isComplianceUser()));
    const { userCompanies, isFetching: fetchingUserCompanies }: any = useGetUserCompanies(!isAdmin() && !isComplianceUser());
    const { departmentUsers, isFetching: fetchingDepartmentUsers }: any = useGetDepartmentUserMappings({
        ...DEFAULT_OPTIONS_PAYLOAD,
        filters: [{ columnName: 'userId', value: getUserDetails().userid }]
    }, isComplianceUser());

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
                options: companiesList,
                onChange: handleCompanyChange.bind(this)
            },
            {
                component: action === ACTIONS.ADD ? componentTypes.SELECT : componentTypes.PLAIN_TEXT,
                name: 'associateCompany',
                label: 'Associate Company',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: action !== ACTIONS.ADD ? getValue(details, 'associateCompany.label') : '',
                options: associateCompaniesList,
                isDisabled: !Boolean(parentCompany),
                isLoading: fetchingAssociateCompanies,
                onChange: handleAssociateCompanyChange.bind(this)
            },
            {
                component: action === ACTIONS.ADD ? componentTypes.SELECT : componentTypes.PLAIN_TEXT,
                name: 'location',
                label: 'Location',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                options: (locationsList || []).map(({ location }: any) => {
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
                onChange: (location: any) => {
                    setDetails({ ...details, location, stateId: getValue(location, 'location.state.value') });
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

    function handleCompanyChange({ company }: any) {
        setParentCompany(company);
        setAssociateCompany(undefined);
        setAssociateCompanies([]);
        setLocations([]);
        setEstablishmentTypes([]);
        setDetails({
            ...details,
            company: { value: company.id, label: company.name, company },
            associateCompany: null,
            location: null,
            stateId: null,
            establishmentType: null
        });
        if (!isAdmin() && !isComplianceUser()) {
            const sorted: any[] = sortBy(company.associateCompanies, 'name');
            setAssociateCompanies(sorted);
        }
    }

    function handleAssociateCompanyChange({ associateCompany }: any) {
        setAssociateCompany(associateCompany);
        setLocations([]);
        setEstablishmentTypes(associateCompany.establishmentType.split(API_DELIMITER).filter((x: string) => !!x));
        setDetails({
            ...details,
            associateCompany: { value: associateCompany.id, label: associateCompany.name, associateCompany },
            location: null,
            stateId: null,
            establishmentType: null
        });
        if (!isAdmin() && !isComplianceUser()) {
            const locations = (associateCompany.locations || []).map((location: any) => {
                return { label: `${location.name}, ${location.cities.name}`, value: location.id, location, stateId: location.stateId };
            });
            const sorted = sortBy(locations, 'label');
            setLocations(sorted);
        }
    }

    useEffect(() => {
        if (Object.keys(data || {}).length) {
            const { company, associateCompany } = data;
            setParentCompany(company.company);
            setAssociateCompany(associateCompany.associateCompany);
            setEstablishmentTypes(associateCompany.associateCompany.establishmentType.split(API_DELIMITER));
            setDetails({ ...details, ...data });
        }
    }, [data]);

    useEffect(() => {
        if (!fetchingUserCompanies && userCompanies) {
            const sorted = sortBy(userCompanies.map((company: any) => {
                const {associateCompanies} =company;
                return {
                    ...company,
                    associateCompanies: associateCompanies.map(({associateCompany, locations}: any) => {
                        return {
                            ...associateCompany,
                            locations
                        }
                    })
                }

            }), 'name');
            setCompanies(sorted);
        }
    }, [fetchingUserCompanies]);

    useEffect(() => {
        if (!fetchingDepartmentUsers && departmentUsers && isComplianceUser()) {
            const _companies: any = {};
            departmentUsers.forEach(({ department, userId, user }: any) => {
                const { vertical } = department;
                const { company } = vertical;
                const { id, name } = company;
                if (!_companies[id]) {
                    _companies[id] = company;
                }
            });
            setCompanies(sortBy(Object.values(_companies), 'name'))
        }

    }, [fetchingDepartmentUsers]);

    useEffect(() => {
        if (!fetchingParentCompanies && parentCompanies && isAdmin()) {
            setCompanies(parentCompanies);
        }
    }, [fetchingParentCompanies]);

    useEffect(() => {
        if (!fetchingAssociateCompanies && associateCompanies && (isAdmin() || isComplianceUser())) {
            setAssociateCompanies(associateCompanies);
        }
    }, [fetchingAssociateCompanies]);

    useEffect(() => {
        if (!fetchingLocs && locations && (isAdmin() || isComplianceUser())) {
            const locs = locations.map(({ location }: any) => {
                const { id, name, cities } = location;
                return { label: `${name}, ${cities.name}`, value: id, location, stateId: cities.stateId };
            });
            const sorted = sortBy(locs, 'label');
            setLocations(sorted);
        }
    }, [fetchingLocs]);

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