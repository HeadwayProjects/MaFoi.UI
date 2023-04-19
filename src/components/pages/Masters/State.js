import React, { useState } from "react";
import MastersLayout from "./MastersLayout";

function State() {
    const [breadcrumb] = useState([
        {id: 'home', label: 'Home', path: '/'},
        {id: 'masters', label: 'Masters', path: '/masters/act'},
        {id: 'state', label: 'State'}
    ]);

    return (
        <MastersLayout title="Masters - State" breadcrumbs={breadcrumb}>
            <>Masters - State</>
        </MastersLayout>
    )
}

export default State;