import React, { useState } from "react";
import MastersLayout from "./MastersLayout";

function City() {
    const [breadcrumb] = useState([
        {id: 'home', label: 'Home', path: '/'},
        {id: 'masters', label: 'Masters', path: '/masters/act'},
        {id: 'city', label: 'City'}
    ]);

    return (
        <MastersLayout title="Masters - City" breadcrumbs={breadcrumb}>
            <>Masters - City</>
        </MastersLayout>
    )
}

export default City;