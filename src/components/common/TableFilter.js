import React, { useEffect, useRef, useState } from "react"
import { InputGroup } from "react-bootstrap"
import Select from "react-select";
import { debounce, object } from "underscore";
const DEFAULT_OPTION = { value: 'ALL', label: 'All' };

function TableFilters({ search, filterConfig, onFilterChange }) {
    const searchRef = useRef();
    const [filters, setFilters] = useState(null);

    function handleFilterChange(filter, event) {
        const value = (event || {}).value;
        const _filters = { ...filters };
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

    function handleKeyup(event) {
        const value = (event.target.value || '').trim();
        setFilters({ ...filters, search: value });
    }

    useEffect(() => {
        if (filters) {
            const _filters = { ...filters };
            const payload = { filters: [], search: '' };
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
        <div className="d-flex align-items-center filters">
            {
                (filterConfig || []).map(filter => {
                    return (
                        <div className="d-flex flex-row align-items-center" key={filter.name}>
                            <label>{filter.label}</label><span className="me-2">:</span>
                            <Select options={filter.hideAll ? [...filter.options] : [DEFAULT_OPTION, ...filter.options]}
                                defaultValue={filter.hideAll ? filter.defaultValue : DEFAULT_OPTION} value={filter.value}
                                onChange={(e) => handleFilterChange(filter, e)} className="me-3" />
                        </div>
                    )
                })
            }
            {
                Boolean(search) &&
                <InputGroup>
                    <input type="text" ref={searchRef} className="form-control" placeholder={search.placeholder || 'Search'}
                        onKeyUp={debounce(handleKeyup, 750)} />
                    {/* <InputGroup.Text>
                        <div className="d-flex flex-row align-items-center text-white">
                            <Icon name={'search'} />
                        </div>
                    </InputGroup.Text> */}
                </InputGroup>
            }
        </div>
    )
}

export default TableFilters