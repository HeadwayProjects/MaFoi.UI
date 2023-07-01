import React, { useEffect, useState } from "react";
import Select from 'react-select';
import { useGetUserCompanies } from "../../backend/query";
import { useHistory } from "raviger";
import { sortBy } from "underscore";

function Location({ onChange }: any) {
    const { state }: any = useHistory();
    const [companies, setCompanies] = useState<any[]>([]);
    const [associateCompanies, setAssociateCompanies] = useState<any[]>([]);
    const [locations, setLocations] = useState<any[]>([]);
    const [company, setCompany] = useState<any>(null);
    const [associateCompany, setAssociateCompany] = useState<any>(null);
    const [location, setLocation] = useState<any>(null);
    const { userCompanies, isFetching }: any = useGetUserCompanies();

    useEffect(() => {
        setAssociateCompanies([]);
        setLocations([]);
        setAssociateCompany(null);
        setLocation(null);
        if (company) {
            const associateCompanies = (company.company.associateCompanies || []).map((associateCompany: any) => {
                return {
                    label: associateCompany.associateCompany.name,
                    value: associateCompany.associateCompany.id,
                    associateCompany: associateCompany.associateCompany,
                    locations: associateCompany.locations
                };
            });
            const sorted: any[] = sortBy(associateCompanies, 'label');
            setAssociateCompanies(sorted);
            const _associateCompany = sorted.find((c: any) => c.value === (state || {}).associateCompany);
            setAssociateCompany(_associateCompany || sorted[0]);
        }
    }, [company]);

    useEffect(() => {
        setLocations([]);
        setLocation(null);
        if (associateCompany) {
            const locations = (associateCompany.locations || []).map((location: any) => {
                return { label: `${location.name}, ${location.cities.name}`, value: location.id, location, stateId: location.stateId };
            });
            const sorted = sortBy(locations, 'label');
            setLocations(sorted);
            const _location = sorted.find((c: any) => c.value === (state || {}).location);
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
            const companies = userCompanies.map((company: any) => {
                return { value: company.id, label: company.name, company }
            });
            const sorted = sortBy(companies, 'label');
            setCompanies(sorted);
            const _company = sorted.find((c: any) => c.value === (state || {}).company);
            setCompany(_company || sorted[0]);
        }
    }, [isFetching]);

    return (
        <>
            <div className="px-2">
                <label className="filter-label"><small>Company</small></label>
                <Select placeholder='Company' options={companies} onChange={setCompany} value={company} className="select-control" />
            </div>
            <div className="px-2">
                <label className="filter-label"><small>Associate Company</small></label>
                <Select placeholder='Associate Company' options={associateCompanies} onChange={setAssociateCompany} value={associateCompany} className="select-control" />
            </div>
            <div className="px-2">
                <label className="filter-label"><small>Location</small></label>
                <Select placeholder='Location' options={locations} onChange={setLocation} value={location} className="select-control" />
            </div>
        </>
    )
}

export default Location;