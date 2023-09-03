import React, { useEffect, useState } from "react";
import Select from 'react-select';
import { sortBy } from "underscore";
import { useGetCompanies, useGetCompanyLocations, useGetDepartmentUserMappings } from "../../backend/masters";
import { DEFAULT_OPTIONS_PAYLOAD } from "./Table";
import { getUserDetails } from "../../backend/auth";
const DEFAULT_VALUE = 'ALL';
const DEFAULT_LABEL = 'All';
const DEFAULT_OPTION = { value: DEFAULT_VALUE, label: DEFAULT_LABEL };

function OptionalLocations({ onChange, loadCompanies }: any) {
    const [companies, setCompanies] = useState<any[]>([DEFAULT_OPTION]);
    const [associateCompanies, setAssociateCompanies] = useState<any>();
    const [locations, setLocations] = useState<any>();
    const [company, setCompany] = useState<any>(DEFAULT_OPTION);
    const [associateCompany, setAssociateCompany] = useState<any>();
    const [location, setLocation] = useState<any>();
    const { departmentUsers, isFetching: fetchingCompanies } = useGetDepartmentUserMappings({ ...DEFAULT_OPTIONS_PAYLOAD, filters: [{ columnName: 'userId', value: getUserDetails().userid }] });
    const { companies: acs, isFetching: fetchingAcs } = useGetCompanies({
        ...DEFAULT_OPTIONS_PAYLOAD,
        filters: [{ columnName: 'isParent', value: 'false' }, { columnName: 'parentCompanyId', value: (company || {}).value }]
    }, company && company.value && company.value !== DEFAULT_VALUE);
    const { locations: locs, isFetching: fetchingLocs } = useGetCompanyLocations({
        ...DEFAULT_OPTIONS_PAYLOAD,
        filters: [{ columnName: 'companyId', value: (associateCompany || {}).value }],
        sort: { columnName: 'locationName', order: 'asc' }
    }, Boolean(associateCompany && associateCompany.value && associateCompany.value !== DEFAULT_VALUE));

    function handleCompanyChange(event: any) {
        const { value } = event;
        setCompany(event);
        setLocation(null);
        setLocations(null);
        if (value === DEFAULT_VALUE) {
            onChange({});
            setAssociateCompany(null);
            setAssociateCompanies(null);
        } else {
            onChange({ companyId: value });
            setAssociateCompany(DEFAULT_OPTION);
            setAssociateCompanies([DEFAULT_OPTION]);
        }
    }

    function handleAssociateCompanyChange(event: any) {
        const { value } = event;
        setAssociateCompany(event);
        if (value === DEFAULT_VALUE) {
            onChange({ companyId: company.value });
            setLocation(null);
            setLocations(null);
        } else {
            onChange({ companyId: company.value, associateCompanyId: value });
            setLocation(DEFAULT_OPTION);
            setLocations([DEFAULT_OPTION]);
        }
    }

    function handleLocationChange(event: any) {
        const { value } = event;
        setLocation(event);
        if (value === DEFAULT_VALUE) {
            onChange({ companyId: company.value, associateCompanyId: associateCompany.value });
        } else {
            onChange({ companyId: company.value, associateCompanyId: associateCompany.value, locationId: value });
        }
    }

    useEffect(() => {
        if (!fetchingLocs && locs) {
            setLocations([DEFAULT_OPTION, ...locs.map(({ location }: any) => {
                return { value: location.id, label: location.name }
            })]);
        }
    }, [fetchingLocs]);

    useEffect(() => {
        if (!fetchingCompanies && acs) {
            setLocations(null);
            setLocation(null);
            const sorted = sortBy(acs.map(({ id, name }: any) => {
                return { value: id, label: name }
            }), 'label');
            setAssociateCompanies([DEFAULT_OPTION, ...sorted]);
        }
    }, [fetchingAcs]);

    useEffect(() => {
        if (!fetchingCompanies && departmentUsers) {
            const _companies: any[] = [];
            setAssociateCompanies(null);
            setLocations(null);
            setAssociateCompany(null);
            setLocation(null);
            departmentUsers.forEach(({ department }: any) => {
                const { vertical } = department;
                const { company } = vertical;
                const { id, name } = company;
                if (!_companies.find((x: any) => x.value === id)) {
                    _companies.push({ value: id, label: name });
                }
            });
            const sorted = sortBy(_companies, 'label');
            setCompanies([DEFAULT_OPTION, ...sorted]);
            if (loadCompanies) {
                loadCompanies(sorted);
            }

        }
    }, [fetchingCompanies])

    return (
        <div className="d-flex flex-row filters">
            <div className="px-2">
                <label className="filter-label"><small>Company</small></label>
                <Select placeholder='Company' className="select-control"
                    options={companies} onChange={handleCompanyChange}
                    value={company} />
            </div>
            <div className="px-2">
                <label className="filter-label"><small>Associate Company</small></label>
                <Select placeholder='Associate Company' className="select-control" isDisabled={!Boolean(associateCompanies)}
                    options={associateCompanies} onChange={handleAssociateCompanyChange}
                    value={associateCompany} />
            </div>
            <div className="px-2">
                <label className="filter-label"><small>Location</small></label>
                <Select placeholder='Location' className="select-control" isDisabled={!Boolean(locations)}
                    options={locations} onChange={handleLocationChange}
                    value={location} />
            </div>
        </div>
    )
}

export default OptionalLocations;