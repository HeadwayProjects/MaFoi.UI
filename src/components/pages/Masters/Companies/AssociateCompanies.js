import React, { useEffect, useState } from "react";
import { GetMastersBreadcrumb } from "../Master.constants";
import MastersLayout from "../MastersLayout";
import AddEditCompany from "./AddEditCompany";
import AssociateCompaniesList from "./AssociateCompaniesList";

export const VIEWS = {
    LIST: 'list',
    ADD: 'add',
    EDIT: 'edit',
    VIEW: 'view',
    ASSOCIATE_COMPANIES: 'associate_companies'
}

function AssociateCompanies() {
    const [view, setView] = useState(VIEWS.LIST);
    const [breadcrumb, setBreadcrumb] = useState(GetMastersBreadcrumb('Associate Companies'));
    const [viewData, setViewData] = useState(null);

    function changeView(view, data) {
        setViewData(data || null);
        setView(view);
    }

    useEffect(() => {
        if (view) {
            const _bc = [...GetMastersBreadcrumb('Associate Companies')];
            setBreadcrumb(_bc);
        }
    }, [view]);

    return (
        <MastersLayout title="Manage Associate Companies" breadcrumbs={breadcrumb}>
            {
                view === VIEWS.LIST &&
                <AssociateCompaniesList changeView={changeView} parent={viewData ? viewData.parentCompany : null} />
            }
            {
                [VIEWS.ADD, VIEWS.EDIT].includes(view) &&
                <AddEditCompany changeView={changeView} {...viewData} />
            }
        </MastersLayout>
    )
}

export default AssociateCompanies;