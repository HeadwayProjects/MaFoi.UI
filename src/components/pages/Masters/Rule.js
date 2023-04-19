import React, { useState } from "react";
import MastersLayout from "./MastersLayout";

function Rule(props) {
    const [breadcrumb] = useState([
        {id: 'home', label: 'Home', path: '/'},
        {id: 'masters', label: 'Masters', path: '/masters/act'},
        {id: 'rule', label: 'Rule'}
    ]);

    return (
        <MastersLayout title="Masters - Rule" breadcrumbs={breadcrumb}>
            <>Masters - Rule</>
        </MastersLayout>
    )

}

export default Rule;