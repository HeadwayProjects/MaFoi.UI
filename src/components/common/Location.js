import React, { useEffect, useState } from "react";
import Select from 'react-select';
import { useGetUserCompanies } from "../../backend/query";
import { sortBy } from "underscore";
import { useHistory } from "raviger"

function Location({ onChange }) {
    const { state } = useHistory();
    const [companies, setCompanies] = useState([]);
    const [associateCompanies, setAssociateCompanies] = useState([]);
    const [locations, setLocations] = useState([]);
    const [company, setCompany] = useState(null);
    const [associateCompany, setAssociateCompany] = useState(null);
    const [location, setLocation] = useState(null);
    const { userCompanies, isFetching } = useGetUserCompanies();

    useEffect(() => {
        setAssociateCompanies([]);
        setLocations([]);
        setAssociateCompany(null);
        setLocation(null);
        if (company) {
            const associateCompanies = (company.company.associateCompanies || []).map(associateCompany => {
                return {
                    label: associateCompany.associateCompany.name,
                    value: associateCompany.associateCompany.id,
                    associateCompany: associateCompany.associateCompany,
                    locations: associateCompany.locations
                };
            });
            const sorted = sortBy(associateCompanies, 'label');
            setAssociateCompanies(sorted);
            const _associateCompany = sorted.find(c => c.value === (state || {}).associateCompany);
            setAssociateCompany(_associateCompany || sorted[0]);
        }
    }, [company]);

    useEffect(() => {
        setLocations([]);
        setLocation(null);
        if (associateCompany) {
            const locations = (associateCompany.locations || []).map(location => {
                return { label: `${location.name}, ${location.cities.name}`, value: location.id, location, stateId: location.stateId };
            });
            const sorted = sortBy(locations, 'label');
            setLocations(sorted);
            const _location = sorted.find(c => c.value === (state || {}).location);
            setLocation(_location || sorted[0]);
        }
    }, [associateCompany]);

    useEffect(() => {
        if (company && associateCompany && location) {
            onChange({
                company: company.value,
                associateCompany: associateCompany.value,
                location: location.value,
                stateId: location.stateId
            });
        }
    }, [location]);

    useEffect(() => {
        if (!isFetching && userCompanies) {
            const companies = userCompanies.map(company => {
                return { value: company.id, label: company.name, company }
            });
            const sorted = sortBy(companies, 'label');
            setCompanies(sorted);
            const _company = sorted.find(c => c.value === (state || {}).company);
            setCompany(_company || sorted[0]);
        }
    }, [isFetching]);

    return (
        <>
            <div className="col-2 col-md-2">
                <label className="filter-label"><small>Company</small></label>
                <Select placeholder='Company' options={companies} onChange={setCompany} value={company} />
            </div>
            <div className="col-3 col-md-3">
                <label className="filter-label"><small>Associate Company</small></label>
                <Select placeholder='Associate Company' options={associateCompanies} onChange={setAssociateCompany} value={associateCompany} />
            </div>
            <div className="col-2 col-md-2">
                <label className="filter-label"><small>Location</small></label>
                <Select placeholder='Location' options={locations} onChange={setLocation} value={location} />
            </div>
        </>
    )
}

export default Location;