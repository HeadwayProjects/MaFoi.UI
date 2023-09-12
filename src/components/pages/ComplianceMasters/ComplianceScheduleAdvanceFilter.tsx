import React, { useState } from "react";
import { Button } from "react-bootstrap";
import AdvanceFilterModal from "./AdvanceFilterModal";

export default function ComplianceScheduleAdvanceFilter({ onChange }: any) {
    const [open, setOpen] = useState(false);
    const [filters, setFilters] = useState<any>({});
    const [rawFilters, setRawFilters] = useState<any>({});

    function handleFilters({ payload, data }: any) {
        const _filters: any = {};
        Object.keys(payload).forEach((columnName: string) => {
            const value = payload[columnName];
            if (value !== undefined && value !== null && value !== '') {
                _filters[columnName] = value;
            }
        });
        setFilters(_filters);
        setRawFilters(data);
        onChange(_filters);
        setOpen(false);
    }

    function getKeys() {
        const keys = Object.keys(filters).length;
        if (filters.month) {
            return keys - 1;
        } else {
            return keys;
        }
    }

    return (
        <>
            <Button variant="primary" className="px-4 mx-2" onClick={() => setOpen(true)}>
                {'More Filters'}
                {
                    Object.keys(filters).length > 0 &&
                    <span className="ms-1">(+{getKeys()})</span>
                }
            </Button>
            {
                open &&
                <AdvanceFilterModal onCancel={() => setOpen(false)}
                    onSubmit={handleFilters} data={rawFilters} />
            }
        </>
    )
}