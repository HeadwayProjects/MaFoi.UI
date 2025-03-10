import React, { useEffect, useRef, useState } from "react"
import { InputGroup } from "react-bootstrap"
import Select from "react-select";
import { debounce } from "underscore";
import { DEBOUNCE_TIME } from "../../utils/constants";
export const DEFAULT_OPTION = { value: 'ALL', label: 'All' };

function TableFilters({ search, filterConfig, onFilterChange, placeholder }: any) {
    const searchRefTest: any = useRef();
    const [filters, setFilters] = useState<any>(null);

    const handleFilterChange = (filter: any, event: any) =>{
        const value:any = (event || {}).value;
        const _filters:any = { ...filters };
        if (value === 'ALL') {
            delete _filters[filter.name];
        } else {
            _filters[filter.name] = value;
        }
        setFilters(_filters);
        if (filter.onChange) {
            filter.onChange(event);
        }
    }

    function handleKeyup(event: any) {
        const value = (event.target.value || '').trim();
        setFilters({ ...filters, search: value });
    }

    useEffect(() => {
        if (filters) {
            const _filters = { ...filters };
            const payload: any = { filters: [], search: '' };
            Object.keys(_filters).forEach(key => {
                if (key === 'search') {
                    payload.search = _filters[key];
                } else {
                    payload.filters.push({
                        columnName: key,
                        value: _filters[key]
                    });
                }

            })
            onFilterChange(payload);
        }
    }, [filters]);

    return (
        <div className="d-flex align-items-end filters">
            {
                (filterConfig || []).map((filter: any) => {
                    return (
                        <div className="d-flex flex-column me-3" key={filter.name}>
                            <label className="filter-label"><small>{filter.label}</small></label>
                            <Select options={filter.hideAll ? [...filter.options] : [DEFAULT_OPTION, ...filter.options]}
                                defaultValue={filter.hideAll ? filter.defaultValue : DEFAULT_OPTION} value={filter.value}
                                onChange={(e:any) => handleFilterChange(filter, e)} className="select-control" 
                                />
                        </div>
                    )
                })
            }
            {
                Boolean(search) &&
                <div className="d-flex flex-column me-3">
                    <label className="filter-label"><small>{placeholder || 'Search'}</small></label>
                    <InputGroup>
                        <input type="text" ref={searchRefTest} className="form-control" placeholder={search.placeholder || 'Search'}
                            onKeyUp={debounce(handleKeyup, DEBOUNCE_TIME)} />
                    </InputGroup>
                </div>
            }
        </div>
    )
}

export default TableFilters