import React, { useState } from "react";
import { Button } from "react-bootstrap";
import AdvanceFilterModal from "./AdvanceFilterModal";

export default function DashboardAdvanceFilters({ onChange }: any) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button variant="primary" className="px-4 mx-2" onClick={() => setOpen(true)}>{'More Filters'}</Button>
            {
                open && <AdvanceFilterModal onCancel={() => setOpen(false)} />
            }
        </>
    )
}