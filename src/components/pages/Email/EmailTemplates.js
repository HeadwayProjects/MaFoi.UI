import React, { useEffect, useState } from "react";
import { preventDefault } from "../../../utils/common";
import MastersLayout from "../Masters/MastersLayout";
import ManageEmailTemplates from "./ManageEmailTemplates";
import EmailTemplateDetails from "./EmailTemplateDetails";

export const VIEWS = {
    LIST: 'list',
    ADD: 'add',
    EDIT: 'edit',
    VIEW: 'view',
    ASSOCIATE_COMPANIES: 'associate_companies'
}

function EmailTemplates() {
    const [view, setView] = useState(VIEWS.LIST);
    const [breadcrumb, setBreadcrumb] = useState();
    const [viewData, setViewData] = useState(null);

    function changeView(view, data) {
        setViewData(data || null);
        setView(view);
    }

    useEffect(() => {
        if (view) {
            const _breadcrumb = [
                { id: 'home', label: 'Home', path: '/' },
                { id: 'email', label: 'Email', path: '/email/templates' },
                { id: 'templates', label: 'Manage Templates' }
            ];
            if (view === VIEWS.ADD || view === VIEWS.EDIT || view === VIEWS.VIEW) {
                _breadcrumb[2].path = '/email/templates';
                _breadcrumb[2].action = (event) => {
                    preventDefault(event);
                    changeView(VIEWS.LIST, null);
                }
                _breadcrumb.push({ id: view, label: view });
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