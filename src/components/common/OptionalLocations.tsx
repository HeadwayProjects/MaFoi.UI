import React, { useEffect, useState } from "react";
import Select from 'react-select';
import { useGetCompanies, useGetCompanyLocations } from "../../backend/masters";
import { DEFAULT_OPTIONS_PAYLOAD } from "./Table";
import { getValue } from "../../utils/common";
const DEFAULT_VALUE = 'ALL';
const DEFAULT_LABEL = 'All';
const DEFAULT_OPTION = { value: DEFAULT_VALUE, label: DEFAULT_LABEL };

function OptionalLocations({ onChange }: any) {
    const [associateCompanies, setAssociateCompanies] = useState<any>(null);
    const [locations, setLocations] = useState<any>(null);
    const [company, setCompany] = useState<any>(DEFAULT_OPTION);
    const [associateCompany, setAssociateCompany] = useState<any>(DEFAULT_OPTION);
    const [location, setLocation] = useState<any>(DEFAULT_OPTION);
    const { companies, isFetching } = useGetCompanies({
        ...DEFAULT_OPTIONS_PAYLOAD, filters: [{ columnName: 'isParent', value: 'true' }]
    });
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
        setLocations(null);
        setAssociateCompanies(null);
        setCompany(event);
        setAssociateCompany(DEFAULT_OPTION);
        setLocation(DEFAULT_OPTION);
        onChange(value === DEFAULT_VALUE ? {} : { companyId: value });
    }

    function handleAssociateCompanyChange(event: any) {
        const { value } = event;
        setAssociateCompany(event);
        setLocation(DEFAULT_OPTION);
        setLocations(null);
        if (value === DEFAULT_VALUE) {
            onChange({ companyId: company.value });
        } else {
            onChange({ companyId: company.value, associateCompanyId: value });
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
            setLocations(locs.map(({ locationId, location }: any) => ({ value: locationId, label: getValue(location, 'name') })));
        }
    }, [fetchingLocs]);

    useEffect(() => {
        if (!fetchingAcs && acs) {
            setAssociateCompanies(acs.map(({ id, name }: any) => ({ value: id, label: name })));
        }
    }, [fetchingAcs]);

    return (
        <div className="d-flex flex-row filters">
            <div className="px-2">
                <label className="filter-label"><small>Company</small></label>
                <Select placeholder='Company' className="select-control"
                    options={[DEFAULT_OPTION, ...(companies || []).map(({ id, name }: any) => ({ value: id, label: name }))]}
                    onChange={handleCompanyChange}
                    value={company} isLoading={isFetching} />
            </div>
            <div className="px-2">
                <label className="filter-label"><small>Associate Company</small></label>
                <Select placeholder='Associate Company' className="select-control" isDisabled={(associateCompanies || []).length === 0}
                    options={[DEFAULT_OPTION, ...(associateCompanies || [])]}
                    onChange={handleAssociateCompanyChange} isLoading={fetchingAcs}
                    value={associateCompany} />
            </div>
            <div className="px-2">
                <label className="filter-label"><small>Location</small></label>
                <Select placeholder='Location' className="select-control" isDisabled={(locations || []).length === 0}
                    options={[DEFAULT_OPTION, ...(locations || [])]}
                    onChange={handleLocationChange} isLoading={fetchingLocs}
                    value={location} />
            </div>
        </div>
    )
}

export default OptionalLocations;