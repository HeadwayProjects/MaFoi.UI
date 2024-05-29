import React, { useState, useEffect, useRef } from "react";
import Select from 'react-select';
import { DEFAULT_OPTIONS_PAYLOAD } from "./../../common/Table"
import { useGetCompanies, useGetCompanyLocations, useGetDepartmentUserMappings } from "../../../backend/masters";
import { DashboardView } from "../../../constants/Compliance.constants";
import { Button } from "react-bootstrap";

type Props = {
    onFilterChange: (event: any[]) => void,
    hiddenFilters?: any[],
    view?: DashboardView,
    counts?: any[]
}

const DEFAULT_VALUE = 'ALL';
const DEFAULT_LABEL = 'All';
const DEFAULT_OPTION = { value: DEFAULT_VALUE, label: DEFAULT_LABEL };

const DEFAUT_FILTERS = {
    company: DEFAULT_OPTION,
    vertical: DEFAULT_OPTION,
    department: DEFAULT_OPTION
};

export default function NoticeFilters({ onFilterChange }: Props) {
    const [filters, setFilters] = useState<any>({ ...DEFAUT_FILTERS });
    const filtersRef = useRef<any>();
    filtersRef.current = filters;
    const [associateCompanies, setAssociateCompanies] = useState<any[]>();
    const [locations, setLocations] = useState<any[]>();

    const { companies } = useGetCompanies({
        ...DEFAULT_OPTIONS_PAYLOAD,
        filters: [
            { columnName: 'isParent', value: 'true' }
        ]
    });
    const { companies: acs, isFetching: fetchingAcs } = useGetCompanies({
        ...DEFAULT_OPTIONS_PAYLOAD,
        filters: [
            { columnName: 'isParent', value: 'false' },
            { columnName: 'parentCompanyId', value: (filters.company || {}).value }
        ]
    }, enableAcs());
    const { locations: locs, isFetching: fetchingLocs } = useGetCompanyLocations({
        ...DEFAULT_OPTIONS_PAYLOAD,
        filters: [{ columnName: 'companyId', value: (filters.associateCompany || {}).value }],
        sort: { columnName: 'locationName', order: 'asc' }
    }, enableLocations());

    function enableAcs() {
        const { company } = filters;
        return company && company.value !== DEFAULT_VALUE;
    }

    function enableLocations() {
        const { associateCompany } = filters;
        return Boolean(associateCompany && associateCompany.value && associateCompany.value !== DEFAULT_VALUE);
    }

    function handleCompanyChange(newValue: any) {
        const { value } = newValue;
        const isSelectAll = value === DEFAULT_VALUE;
        const definedNull = { ...DEFAULT_OPTION };
        setAssociateCompanies(undefined);
        setLocations(undefined);
        setFilters({
            ...filters,
            company: newValue,
            associateCompany: isSelectAll ? null : definedNull,
            location: isSelectAll ? null : definedNull
        });
    }

    function handleAssociateCompanyChange(newValue: any) {
        const { value } = newValue;
        const definedNull = { ...DEFAULT_OPTION };
        const isSelectAll = value === DEFAULT_VALUE;
        setLocations(undefined);
        setFilters({
            ...filters,
            associateCompany: newValue,
            location: isSelectAll ? null : definedNull,
        });
    }

    function handleLocationChange(newValue: any) {
        setFilters({
            ...filters,
            location: newValue
        });
    }

    useEffect(() => {
        if (filters) {
            const {
                company, associateCompany, location
            } = filtersRef.current;
            const _filters = [];
            if (company.value !== DEFAULT_VALUE) {
                _filters.push({ columnName: 'companyId', value: company.value });
            }
            if (associateCompany && associateCompany.value && associateCompany.value !== DEFAULT_VALUE) {
                _filters.push({ columnName: 'associateCompanyId', value: associateCompany.value });
            }
            if (location && location.value && location.value !== DEFAULT_VALUE) {
                _filters.push({ columnName: 'locationId', value: location.value });
            }
            onFilterChange(_filters);
        }
    }, [filters]);

    useEffect(() => {
        if (!fetchingLocs && locs) {
            setLocations([DEFAULT_OPTION, ...locs.map(({ location }: any) => {
                return { value: location.id, label: location.name }
            })]);
        }
    }, [fetchingLocs]);

    useEffect(() => {
        if (!fetchingAcs && acs) {
            setLocations(undefined);
            setAssociateCompanies([DEFAULT_OPTION, ...acs.map(({ id, name }: any) => {
                return { value: id, label: name }
            })]);
        }
    }, [fetchingAcs]);

    return (
        <>
            <div className="d-flex flex-column ">
                <div className="d-flex flex-row flex-wrap filters align-items-end ps-2 gap-2" style={{ paddingRight: '50px' }}>
                    <div>
                        <label className="filter-label"><small>Company</small></label>
                        <Select placeholder='Company' className="select-control"
                            options={[DEFAULT_OPTION, ...(companies || []).map(({ id, name }: any) => {
                                return { value: id, label: name }
                            })]} onChange={handleCompanyChange}
                            value={filters.company} />
                    </div>
                    <div>
                        <label className="filter-label"><small>Associate Company</small></label>
                        <Select placeholder={DEFAULT_LABEL} className="select-control" isDisabled={!Boolean(associateCompanies)}
                            options={associateCompanies} onChange={handleAssociateCompanyChange}
                            value={filters.associateCompany} />
                    </div>
                    <div>
                        <label className="filter-label"><small>Location</small></label>
                        <Select placeholder={DEFAULT_LABEL} className="select-control" isDisabled={!Boolean(locations)}
                            options={locations} onChange={handleLocationChange}
                            value={filters.location} />
                    </div>
                    <div>
                        <Button></Button>
                    </div>
                </div>
            </div>
        </>
    )
}
