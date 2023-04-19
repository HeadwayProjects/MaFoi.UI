import React, { useState } from "react";
import MastersLayout from "./MastersLayout";

function Act() {
    const [breadcrumb] = useState([
        {id: 'home', label: 'Home', path: '/'},
        {id: 'masters', label: 'Masters', path: '/masters/act'},
        {id: 'act', label: 'Act'}
    ]);

    return (
        <MastersLayout title="Masters - Act" breadcrumbs={breadcrumb}>
            <>Masters - Act</>
        </MastersLayout>
    )
}

export default Act;