import React, { useEffect, useState } from "react";
import { preventDefault } from "../../../utils/common";
import MastersLayout from "../Masters/MastersLayout";
import ManageEmailTemplates from "./ManageEmailTemplates";
import EmailTemplateDetails from "./EmailTemplateDetails";

export enum VIEWS {
    LIST = 'list',
    ADD = 'add',
    EDIT = 'edit',
    VIEW = 'view',
    ASSOCIATE_COMPANIES = 'associate_companies'
}

function EmailTemplates() {
    const [view, setView] = useState(VIEWS.LIST);
    const [breadcrumb, setBreadcrumb] = useState();
    const [viewData, setViewData] = useState<any>(null);

    function changeView(view: VIEWS, data: any) {
        setViewData(data || null);
        setView(view);
    }

    useEffect(() => {
        if (view) {
            const _breadcrumb: any = [
                { id: 'home', label: 'Home', path: '/' },
                { id: 'email', label: 'Email & Notifications', path: '/templates/email' },
                { id: 'templates', label: 'Email Templates' }
            ];
            if (view === VIEWS.ADD || view === VIEWS.EDIT || view === VIEWS.VIEW) {
                _breadcrumb[2].path = '/email/templates';
                _breadcrumb[2].action = (event: any) => {
                    preventDefault(event);
                    changeView(VIEWS.LIST, null);
                }
                _breadcrumb.push({ id: view, label: view.toUpperCase() });
            }
            setBreadcrumb(_breadcrumb);
        }
    }, [view]);

    return (
        <MastersLayout title="Manage Email Templates" breadcrumbs={breadcrumb}>
            {
                view === VIEWS.LIST &&
                <ManageEmailTemplates changeView={changeView} />
            }
            {
                [VIEWS.ADD, VIEWS.EDIT, VIEWS.VIEW].includes(view) &&
                <EmailTemplateDetails changeView={changeView} {...viewData} view={view} />
            }
        </MastersLayout>
    )
}

export default EmailTemplates;