import React, { useEffect, useState } from "react";
import { GetMastersBreadcrumb } from "../Master.constants";
import CompaniesList from "./CompaniesList";
import MastersLayout from "../MastersLayout";
import { preventDefault } from "../../../../utils/common";
import AssociateCompanies from "./AssociateCompaniesList";
import AddEditCompany from "./AddEditCompany";

export enum VIEWS {
    LIST = 'list',
    ADD = 'add',
    EDIT = 'edit',
    VIEW = 'view',
    ASSOCIATE_COMPANIES = 'associate_companies'
}

function Companies() {
    const [view, setView] = useState(VIEWS.LIST);
    const [breadcrumb, setBreadcrumb] = useState(GetMastersBreadcrumb('Companies'));
    const [viewData, setViewData] = useState<any>(null);

    function changeView(view: VIEWS, data: any) {
        setViewData(data || null);
        setView(view);
    }

    useEffect(() => {
        if (view) {
            const _bc: any = [...GetMastersBreadcrumb('Companies')];
            if (view === VIEWS.ASSOCIATE_COMPANIES) {
                _bc[2].action = (event: any) => {
                    preventDefault(event);
                    setView(VIEWS.LIST);
                }
                _bc[2].path = '/'
                _bc.push({ id: 'ac', label: 'Associate Companies' });
            }
            setBreadcrumb(_bc);
        }
    }, [view]);

    return (
        <MastersLayout title="Manage Companies" breadcrumbs={breadcrumb}>
            {
                view === VIEWS.LIST &&
                <CompaniesList changeView={changeView} />
            }
            {
                view === VIEWS.ASSOCIATE_COMPANIES && viewData &&
                <AssociateCompanies changeView={changeView} {...viewData} />
            }
            {
                [VIEWS.ADD, VIEWS.EDIT].includes(view) &&
                <AddEditCompany changeView={changeView} {...viewData} />
            }
        </MastersLayout>
    )
}

export default Companies;