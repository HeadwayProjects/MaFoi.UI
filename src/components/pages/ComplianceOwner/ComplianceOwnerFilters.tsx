import React, { useState, useEffect, useRef } from "react";
import { sortBy, uniq } from "underscore";
import Select from 'react-select';
import { DEFAULT_OPTIONS_PAYLOAD } from "./../../common/Table"
import { useGetCompanies, useGetCompanyLocations, useGetDepartmentUserMappings } from "../../../backend/masters";
import { getUserDetails, hasUserAccess } from "../../../backend/auth";
import DateRangeFilter from "./DateRangeFilter";
import { USER_PRIVILEGES } from "../UserManagement/Roles/RoleConfiguration";

type Props = {
    onFilterChange: (event: any[]) => void,
    hiddenFilters?: any[]
}

const DEFAULT_VALUE = 'ALL';
const DEFAULT_LABEL = 'All';
const DEFAULT_OPTION = { value: DEFAULT_VALUE, label: DEFAULT_LABEL };

const DEFAUT_FILTERS = {
    company: DEFAULT_OPTION,
    vertical: DEFAULT_OPTION,
    department: DEFAULT_OPTION
};

export default function ComplianceOwnerFilters({ onFilterChange }: Props) {
    const [filters, setFilters] = useState<any>({ ...DEFAUT_FILTERS });
    const filtersRef = useRef<any>();
    filtersRef.current = filters;
    const [companies, setCompanies] = useState<any[]>([DEFAULT_OPTION]);
    const [associateCompanies, setAssociateCompanies] = useState<any[]>();
    const [locations, setLocations] = useState<any[]>();
    const [verticals, setVerticals] = useState<any[]>([]);
    const [departments, setDepartments] = useState<any[]>([]);
    const [owners, setOwners] = useState<any[]>([]);
    const [managers, setManagers] = useState<any[]>([]);
    const { departmentUsers, isFetching: fetchingCompanies }: any = useGetDepartmentUserMappings({
        ...DEFAULT_OPTIONS_PAYLOAD,
        filters: []
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
        const { vertical, department, owner, manager } = filters;
        const definedNull = { ...DEFAULT_OPTION };
        setAssociateCompanies(undefined);
        setLocations(undefined);
        setFilters({
            ...filters,
            company: newValue,
            associateCompany: isSelectAll ? null : definedNull,
            location: isSelectAll ? null : definedNull,
            vertical: isSelectAll ? vertical : (vertical ? (vertical.companyId === value ? vertical : definedNull) : definedNull),
            department: isSelectAll ? department : (department ? (department.companyId === value ? department : definedNull) : definedNull),
            owner: isSelectAll ? owner : (owner ? (owner.companyId === value ? owner : definedNull) : definedNull),
            manager: isSelectAll ? manager : (manager ? (manager.companyId === value ? manager : definedNull) : definedNull)
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

    function handleVerticalChange(newValue: any) {
        const { value } = newValue;
        const isSelectAll = value === DEFAULT_VALUE;
        const { department, owner, manager } = filters;
        const definedNull = { ...DEFAULT_OPTION };
        setFilters({
            ...filters,
            vertical: newValue,
            department: isSelectAll ? undefined : (department ? (department.verticalId === value ? department : definedNull) : definedNull),
            owner: isSelectAll ? undefined : (owner ? (owner.verticalId === value ? owner : definedNull) : definedNull),
            manager: isSelectAll ? undefined : (manager ? (manager.verticalId === value ? manager : definedNull) : definedNull)
        });
    }

    function handleDepartmentChange(newValue: any) {
        const { value } = newValue;
        const isSelectAll = value === DEFAULT_VALUE;
        const { owner, manager } = filters;
        const definedNull = { ...DEFAULT_OPTION };
        setFilters({
            ...filters,
            department: newValue,
            owner: isSelectAll ? undefined : (owner ? (owner.departmentId === value ? owner : definedNull) : definedNull),
            manager: isSelectAll ? undefined : (manager ? (manager.departmentId === value ? manager : definedNull) : definedNull)
        });
    }

    function handleDateRangeChange(range: any) {
        setFilters({
            ...filters,
            ...range
        })
    }

    useEffect(() => {
        if (filters) {
            const {
                startDateFrom, startDateTo, company, associateCompany, location,
                vertical, department, owner, manager
            } = filtersRef.current;
            const _filters = [];
            if (startDateFrom) {
                _filters.push({ columnName: 'startDateFrom', value: startDateFrom });
            }
            if (startDateTo) {
                _filters.push({ columnName: 'startDateTo', value: startDateTo });
            }
            if (company.value !== DEFAULT_VALUE) {
                _filters.push({ columnName: 'companyId', value: company.value });
            }
            if (associateCompany && associateCompany.value && associateCompany.value !== DEFAULT_VALUE) {
                _filters.push({ columnName: 'associateCompanyId', value: associateCompany.value });
            }
            if (location && location.value && location.value !== DEFAULT_VALUE) {
                _filters.push({ columnName: 'locationId', value: location.value });
            }
            if (vertical.value !== DEFAULT_VALUE) {
                _filters.push({ columnName: 'verticalId', value: vertical.value });
            }
            if (department.value !== DEFAULT_VALUE) {
                _filters.push({ columnName: 'departmentId', value: department.value });
            }
            if (owner && owner.value && owner.value !== DEFAULT_VALUE) {
                _filters.push({ columnName: 'complianceOwnerId', value: owner.value });
            }
            if (manager && manager.value && manager.value !== DEFAULT_VALUE) {
                _filters.push({ columnName: 'complianceManagerId', value: manager.value });
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
        if (!fetchingCompanies && acs) {
            setLocations(undefined);
            const sorted = sortBy(acs.map(({ id, name }: any) => {
                return { value: id, label: name }
            }), 'label');
            setAssociateCompanies([DEFAULT_OPTION, ...sorted]);
        }
    }, [fetchingAcs]);

    useEffect(() => {
        if (!fetchingCompanies && departmentUsers) {
            const _companies: any = {};
            const _verticals: any = {};
            const _departments: any = {};
            const _owners: any = [];
            const _managers: any = [];
            setAssociateCompanies(undefined);
            setLocations(undefined);
            const { userid: loginUser } = getUserDetails();
            departmentUsers.forEach(({ department, userId, user }: any) => {
                const { vertical } = department;
                const { company } = vertical;
                const { id, name } = company;
                if (!_companies[id] && userId === loginUser) {
                    _companies[id] = { value: id, label: name };
                }

                if (!_verticals[vertical.id] && _companies[id]) {
                    _verticals[vertical.id] = {
                        value: vertical.id,
                        label: vertical.name,
                        companyId: company.id,
                        code: `${company.code}-${vertical.shortCode}`
                    }
                }

                if (!_departments[department.id] && _companies[id]) {
                    _departments[department.id] = {
                        value: department.id,
                        label: department.name,
                        companyId: company.id,
                        verticalId: vertical.id,
                        code: `${company.code}-${vertical.shortCode}-${department.shortCode}`
                    }
                }
                const isOwner = Boolean(user.userRoles.find(({ pages }: any) => pages.includes(USER_PRIVILEGES.OWNER_DASHBOARD)));
                const isManager = Boolean(user.userRoles.find(({ pages }: any) => pages.includes(USER_PRIVILEGES.MANAGER_DASHBOARD)));
                // const uniqueCode = `${company.code}-${vertical.shortCode}-${department.shortCode}-${userId}`
                if (isOwner) {
                    _owners.push({
                        value: user.id,
                        label: user.name,
                        companyId: company.id,
                        // verticalId: vertical.id,
                        // departmentId: department.id,
                        // uniqueCode,
                        // code: `${company.code}-${vertical.shortCode}-${department.shortCode}`
                    });
                }
                if (isManager) {
                    _managers.push({
                        value: user.id,
                        label: user.name,
                        companyId: company.id,
                        // verticalId: vertical.id,
                        // departmentId: department.id,
                        // uniqueCode,
                        // code: `${company.code}-${vertical.shortCode}-${department.shortCode}`
                    });
                }
            });
            setCompanies([DEFAULT_OPTION, ...sortBy(_companies, 'label')]);
            setVerticals(sortBy(Object.values(_verticals), 'label'));
            setDepartments(sortBy(Object.values(_departments), 'label'));
            setOwners(sortBy(uniq(_owners.filter(({ companyId }: any) => Boolean(_companies[companyId])), true, (user) => user.id), 'label'));
            setManagers(sortBy(uniq(_managers.filter(({ companyId }: any) => Boolean(_companies[companyId])), true, (user) => user.id), 'label'));
        }
    }, [fetchingCompanies])

    return (
        <>
            <div className="d-flex flex-column ">
                <div className="d-flex flex-row flex-wrap filters">
                    <div className="px-2">
                        <label className="filter-label"><small>Company</small></label>
                        <Select placeholder='Company' className="select-control"
                            options={companies} onChange={handleCompanyChange}
                            value={filters.company} />
                    </div>
                    <div className="px-2">
                        <label className="filter-label"><small>Associate Company</small></label>
                        <Select placeholder={DEFAULT_LABEL} className="select-control" isDisabled={!Boolean(associateCompanies)}
                            options={associateCompanies} onChange={handleAssociateCompanyChange}
                            value={filters.associateCompany} />
                    </div>
                    <div className="px-2">
                        <label className="filter-label"><small>Location</small></label>
                        <Select placeholder={DEFAULT_LABEL} className="select-control" isDisabled={!Boolean(locations)}
                            options={locations} onChange={handleLocationChange}
                            value={filters.location} />
                    </div>
                    <div className="px-2">
                        <label className="filter-label"><small>Vertical</small></label>
                        <Select placeholder={DEFAULT_LABEL} className="select-control"
                            onChange={handleVerticalChange} value={filters.vertical}
                            options={[DEFAULT_OPTION, ...verticals.filter(({ companyId }: any) => {
                                const { company } = filtersRef.current;
                                return company.value === DEFAULT_VALUE ? true : companyId === company.value;
                            })]} />
                    </div>
                    <div className="px-2">
                        <label className="filter-label"><small>Department</small></label>
                        <Select placeholder={DEFAULT_LABEL} className="select-control"
                            onChange={handleDepartmentChange} value={filters.department}
                            options={[DEFAULT_OPTION, ...departments.filter(({ companyId, verticalId }: any) => {
                                const { company, vertical } = filtersRef.current;
                                if (vertical.value !== DEFAULT_VALUE) {
                                    return verticalId === vertical.value;
                                }
                                if (company.value !== DEFAULT_VALUE) {
                                    return companyId === company.value;
                                }
                                return true;
                            })]} />
                    </div>
                    {
                        (hasUserAccess(USER_PRIVILEGES.MANAGER_DASHBOARD) || hasUserAccess(USER_PRIVILEGES.ESCALATION_DASHBOARD)) &&
                        <div className="px-2">
                            <label className="filter-label"><small>Owner</small></label>
                            <Select placeholder={DEFAULT_LABEL} className="select-control"
                                value={filters.owner} options={[DEFAULT_OPTION, ...owners]}
                                onChange={(owner: any) => {
                                    setFilters({ ...filtersRef.current, owner })
                                }}
                            />
                        </div>
                    }
                    {
                        (hasUserAccess(USER_PRIVILEGES.OWNER_DASHBOARD) || hasUserAccess(USER_PRIVILEGES.ESCALATION_DASHBOARD)) &&
                        <div className="px-2">
                            <label className="filter-label"><small>Manager</small></label>
                            <Select placeholder={DEFAULT_LABEL} className="select-control"
                                options={[DEFAULT_OPTION, ...managers]} value={filters.manager}
                                onChange={(manager: any) => {
                                    setFilters({ ...filtersRef.current, manager })
                                }} />
                        </div>
                    }
                    <DateRangeFilter onDateRangeChange={handleDateRangeChange} />
                </div>
            </div>
        </>
    )
}
