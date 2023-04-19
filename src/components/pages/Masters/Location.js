import React, { useState } from "react";
import MastersLayout from "./MastersLayout";

function Location() {
    const [breadcrumb] = useState([
        {id: 'home', label: 'Home', path: '/'},
        {id: 'masters', label: 'Masters', path: '/masters/act'},
        {id: 'location', label: 'Location'}
    ]);

    return (
        <MastersLayout title="Masters - Location" breadcrumbs={breadcrumb}>
            <>Masters - Location</>
        </MastersLayout>
    )
}

export default Location;