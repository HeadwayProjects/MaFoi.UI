import React, { useState } from "react";
import MastersLayout from "./MastersLayout";

function Companies() {
    const [breadcrumb] = useState([
        {id: 'home', label: 'Home', path: '/'},
        {id: 'masters', label: 'Masters', path: '/masters/act'},
        {id: 'companies', label: 'Companies'}
    ]);

    return (
        <MastersLayout title="Masters - Companies" breadcrumbs={breadcrumb}>
            <>Masters - Companies</>
        </MastersLayout>
    )
}

export default Companies;