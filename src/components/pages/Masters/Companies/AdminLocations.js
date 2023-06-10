import React, { useEffect, useState } from "react";
import Select from 'react-select';
import { useGetCompanies, useGetCompanyLocations } from "../../../../backend/masters";
import { DEFAULT_OPTIONS_PAYLOAD } from "../../../common/Table";

function AdminLocations({ onChange }) {
    const [t] = useState(new Date().getTime());
    const [company, setCompany] = useState(null);
    const [associateCompany, setAssociateCompany] = useState(null);
    const [location, setLocation] = useState(null);
    const { companies: parentCompanies, isFetching: fetchingParentCompanies } = useGetCompanies({ ...DEFAULT_OPTIONS_PAYLOAD, filters: [{ columnName: 'isParent', value: 'true' }], t });
    const { companies: associateCompanies, isFetching: fetchingAssociateCompanies } = useGetCompanies({
        ...DEFAULT_OPTIONS_PAYLOAD,
        filters: [
            { columnName: 'isParent', value: 'false' },
            { columnName: 'parentCompanyId', value: (company || {}).value }
        ]
    }, Boolean(company));
    const { locations, isFetching: fetchingLocations } = useGetCompanyLocations({
        ...DEFAULT_OPTIONS_PAYLOAD,
        filters: [
            { columnName: 'companyId', value: (associateCompany || {}).value }
        ],
        sort: {
            columnName: 'locationName',
            order: 'asc'
        }
    }, Boolean((associateCompany || {}).value));

    useEffect(() => {
        if (company) {
            setAssociateCompany(undefined);
            setLocation(undefined);
        }
    }, [company]);

    useEffect(() => {
        if (associateCompany) {
            setLocation(undefined);
        }
    }, [associateCompany]);

    useEffect(() => {
        if (company && associateCompany && location) {
            onChange({
                company: company.value,
                associateCompany: associateCompany.value,
                location: location.value
            });
        }
    }, [location]);

    useEffect(() => {
        if (!fetchingParentCompanies && parentCompanies) {
            const _parentCompany = parentCompanies[0];
            if (_parentCompany) {
                setCompany({ value: _parentCompany.id, label: _parentCompany.name });
            }
        }
    }, [fetchingParentCompanies]);

    useEffect(() => {
        if (!fetchingAssociateCompanies && associateCompanies) {
            const _associateCompany = associateCompanies[0];
            if (_associateCompany) {
                setAssociateCompany({ value: _associateCompany.id, label: _associateCompany.name });
            }
        }
    }, [fetchingAssociateCompanies]);

    useEffect(() => {
        if (!fetchingLocations && locations) {
            const _location = locations[0];
            if (_location) {
                setLocation({ value: _location.locationId, label: _location.location.name });
            }
        }
    }, [fetchingLocations]);

    return (
        <>
            <div className="px-2">
                <label className="filter-label"><small>Company</small></label>
                <Select placeholder='Company' options={(parentCompanies || []).map(x => {
                    return { value: x.id, label: x.name }
                })} onChange={setCompany} value={company} className="select-control" />
            </div>
            <div className="px-2">
                <label className="filter-label"><small>Associate Company</small></label>
                <Select placeholder='Associate Company' options={(associateCompanies || []).map(x => {
                    return { value: x.id, label: x.name }
                })} onChange={setAssociateCompany} value={associateCompany} className="select-control" />
            </div>
            <div className="px-2">
                <label className="filter-label"><small>Location</small></label>
                <Select placeholder='Location' options={(locations || []).map(x => {
                    return { value: x.locationId, label: x.location.name }
                })} onChange={setLocation} value={location} className="select-control" />
            </div>
        </>
    )
}

export default AdminLocations;