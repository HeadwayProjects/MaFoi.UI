import React, { useEffect, useState } from "react";
import { useHistory } from "raviger";
import Select from 'react-select';
import { useGetUserCompanies } from "../../backend/query";
import { sortBy } from "underscore";
const DEFAULT_VALUE = 'ALL';
const DEFAULT_LABEL = 'All';
const DEFAULT_OPTION = { value: DEFAULT_VALUE, label: DEFAULT_LABEL };

function OptionalLocations({ onChange }: any) {
    const { state }: any = useHistory();
    const [companies, setCompanies] = useState<any[]>([DEFAULT_OPTION]);
    const [associateCompanies, setAssociateCompanies] = useState<any[]>([DEFAULT_OPTION]);
    const [locations, setLocations] = useState<any[]>([DEFAULT_OPTION]);
    const [company, setCompany] = useState<any>(DEFAULT_OPTION);
    const [associateCompany, setAssociateCompany] = useState<any>(DEFAULT_OPTION);
    const [location, setLocation] = useState<any>(DEFAULT_OPTION);
    const { userCompanies, isFetching }: any = useGetUserCompanies();

    function handleCompanyChange(event: any) {
        const { value } = event;
        setCompany(event);
        setAssociateCompany(DEFAULT_OPTION);
        setLocation(DEFAULT_OPTION);
        setLocations([DEFAULT_OPTION]);
        if (value === DEFAULT_VALUE) {
            setAssociateCompanies([DEFAULT_OPTION]);
            onChange({});
        } else {
            const _company = userCompanies.find((x: any) => x.id === value);
            const _acs = (_company.associateCompanies || []).map((ac: any) => {
                const { associateCompany, locations } = ac;
                return { value: associateCompany.id, label: associateCompany.name, locations }
            })
            const sorted: any[] = sortBy(_acs, 'label');
            setAssociateCompanies([DEFAULT_OPTION, ...sorted]);
            onChange({ companyId: value });
        }
    }

    function handleAssociateCompanyChange(event: any) {
        const { value, locations } = event;
        setAssociateCompany(event);
        setLocation(DEFAULT_OPTION);
        if (value === DEFAULT_VALUE) {
            setLocations([DEFAULT_OPTION]);
            onChange({ companyId: company.value });
        } else {
            const sorted: any[] = sortBy(locations.map((x: any) => {
                return { value: x.id, label: x.name }
            }), 'label');
            setLocations([DEFAULT_OPTION, ...sorted]);
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
        if (!isFetching && userCompanies) {
            const companies = userCompanies.map((company: any) => {
                return { value: company.id, label: company.name }
            });
            const sorted = sortBy(companies, 'label');
            setCompanies([DEFAULT_OPTION, ...sorted]);
        }
    }, [isFetching]);

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
                <Select placeholder='Associate Company' className="select-control"
                    options={associateCompanies} onChange={handleAssociateCompanyChange}
                    value={associateCompany} />
            </div>
            <div className="px-2">
                <label className="filter-label"><small>Location</small></label>
                <Select placeholder='Location' className="select-control"
                    options={locations} onChange={handleLocationChange}
                    value={location} />
            </div>
        </div>
    )
}

export default OptionalLocations;