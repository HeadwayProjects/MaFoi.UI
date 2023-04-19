import React, { useState } from "react";
import MastersLayout from "./MastersLayout";

function Activity() {
    const [breadcrumb] = useState([
        {id: 'home', label: 'Home', path: '/'},
        {id: 'masters', label: 'Masters', path: '/masters/act'},
        {id: 'activity', label: 'Activity'}
    ]);

    return (
        <MastersLayout title="Masters - Activity" breadcrumbs={breadcrumb}>
            <>Masters - Activity</>
        </MastersLayout>
    )
}

export default Activity;