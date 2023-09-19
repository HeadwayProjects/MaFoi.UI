import React, { useEffect, useState, useRef } from "react"
import { ACTIONS } from "../../common/Constants";
import Table, { CellTmpl, DEFAULT_OPTIONS_PAYLOAD, DEFAULT_PAYLOAD, reactFormatter } from "../../common/Table";
import { useGetCompanies } from "../../../backend/masters";
import { useDeleteNotificationTemplate, useGetAllNotificationTemplateTypes, useGetAllTemplates } from "../../../backend/notification";
import { sortBy } from "underscore";
import { hasUserAccess } from "../../../backend/auth";
import { USER_PRIVILEGES } from "../UserManagement/Roles/RoleConfiguration";
import Icon from "../../common/Icon";
import TableFilters from "../../common/TableFilter";
import { Button } from "react-bootstrap";
import ConfirmModal from "../../common/ConfirmModal";
import { getValue } from "../../../utils/common";
import PageLoader from "../../shared/PageLoader";
import { API_RESULT, ERROR_MESSAGES } from "../../../utils/constants";
import { toast } from "react-toastify";
import NotificationTemplateDetails from "./NotificationTemplateDetails";
import MastersLayout from "../Masters/MastersLayout";
import TableActions, { ActionButton } from "../../common/TableActions";

const SortFields: any = {
    'template.name': 'templateType'
};

export default function NotificationTemplates() {
    const [breadcrumb] = useState([
        { id: 'home', label: 'Home', path: '/' },
        { id: 'emailsAndNotifications', label: 'Email & Notifications', path: '/templates/email' },
        { id: 'notifications', label: 'Notification Templates' },
    ]);
    const [action, setAction] = useState(ACTIONS.NONE);
    const [notification, setNotification] = useState<any>(null);
    const [data, setData] = useState<any>();
    const [params, setParams] = useState<any>();
    const [filters, setFilters] = useState<any>();
    const filterRef: any = useRef();
    filterRef.current = filters;
    const [payload, setPayload] = useState({ ...DEFAULT_PAYLOAD, sort: { columnName: 'templateType', order: 'asc' }, ...filterRef.current });
    const { templateTypes } = useGetAllNotificationTemplateTypes(null);
    const { companies } = useGetCompanies({ ...DEFAULT_OPTIONS_PAYLOAD, filters: [{ columnName: 'isParent', value: 'true' }] })
    const { templates, total, isFetching, refetch } = useGetAllTemplates(payload, Boolean(payload));
    const { deleteNotificationTemplate, deleting } = useDeleteNotificationTemplate(({ key, value }: any) => {
        if (key === API_RESULT.SUCCESS) {
            toast.success('Notification Template deleted successfully.');
            setAction(ACTIONS.NONE);
            setNotification(null);
            refetch();
        } else {
            toast.error(value || ERROR_MESSAGES.DEFAULT);
        }
    });

    const filterConfig = [
        {
            label: 'Template Type',
            name: 'templateTypeId',
            options: sortBy(templateTypes || [], 'name').map(({ id, name }: any) => {
                return { value: `${id}`, label: name };
            })
        },
        {
            label: 'Company',
            name: 'companyId',
            options: (companies || []).map((x: any) => {
                return { value: x.id, label: x.name };
            })
        }
    ]

    const columns = [
        { title: "Template Type", field: "template.name", widthGrow: 2, formatter: reactFormatter(<CellTmpl />) },
        { title: "Company", field: "company.name", formatter: reactFormatter(<CellTmpl />) },
        { title: "Title", field: "title", widthGrow: 2, formatter: reactFormatter(<CellTmpl />) },
        {
            title: "Actions", hozAlign: "center", width: 140,
            headerSort: false, formatter: reactFormatter(<ActionColumnElements />)
        }
    ]

    const buttons: ActionButton[] = [{
        label: 'Add New',
        name: 'addNew',
        privilege: USER_PRIVILEGES.ADD_NOTIFICATION_TEMPLATE,
        icon: 'plus',
        action: () => setAction(ACTIONS.ADD)
    }];

    const [tableConfig] = useState({
        paginationMode: 'remote',
        ajaxRequestFunc,
        columns,
        rowHeight: 54,
        selectable: false,
        paginate: true,
        initialSort: [{ column: 'template.name', dir: 'asc' }]
    });

    function formatApiResponse(params: any, list: any[], totalRecords: number) {
        const { pagination } = params || {};
        const { pageSize, pageNumber } = pagination || {};
        const tdata = {
            data: list,
            total: totalRecords,
            last_page: Math.ceil(totalRecords / (pageSize || 1)) || 1,
            page: pageNumber || 1
        };
        setData(tdata);
        return tdata;
    }

    function ajaxRequestFunc(url: any, config: any, params: any) {
        const { field, dir } = (params.sort || [])[0] || {};
        const _params = {
            pagination: {
                pageSize: params.size,
                pageNumber: params.page
            },
            sort: {
                columnName: SortFields[field] || field || 'templateType',
                order: dir || 'asc'
            }
        };
        setParams(_params);
        setPayload({ ...DEFAULT_PAYLOAD, ...filterRef.current, ..._params });
        return Promise.resolve(formatApiResponse(params, templates, total));
    }

    function ActionColumnElements({ cell }: any) {
        const row = cell.getData();

        return (
            <div className="d-flex flex-row align-items-center position-relative h-100">
                {
                    hasUserAccess(USER_PRIVILEGES.EDIT_NOTIFICATION_TEMPLATE) &&
                    <Icon className="mx-2" type="button" name={'pencil'} text={'Edit'} data={row} action={() => {
                        setNotification(row)
                        setAction(ACTIONS.EDIT);
                    }} />
                }
                {
                    hasUserAccess(USER_PRIVILEGES.DELETE_NOTIFICATION_TEMPLATE) &&
                    <Icon className="mx-2" type="button" name={'trash'} text={'Delete'} data={row} action={() => {
                        if (!row.companyId) return;
                        setNotification(row);
                        setAction(ACTIONS.DELETE);
                    }} disabled={!row.companyId} />
                }
                <Icon className="mx-2" type="button" name={'eye'} text={'View'} data={row} action={() => {
                    setNotification(row);
                    setAction(ACTIONS.VIEW);
                }} />
            </div>
        )
    }

    function onFilterChange(e: any) {
        setFilters(e);
        setPayload({ ...DEFAULT_PAYLOAD, ...params, ...e });
    }

    function handlePageNav(_pagination: any) {
        const _params = { ...params };
        _params.pagination = _pagination;
        setParams({ ..._params });
        setPayload({ ...payload, ..._params })
    }

    useEffect(() => {
        if (!isFetching && payload) {
            setData(formatApiResponse(params, templates, total));
        }
    }, [isFetching]);

    return (
        <>
            <MastersLayout title="Manage Notification Templates" breadcrumbs={breadcrumb}>
                <div className="d-flex flex-column mx-0">
                    <div className="card shadow d-flex flex-row justify-content-center m-3 p-3">
                        <div className="col-12">
                            <div className="d-flex justify-content-between align-items-end">
                                <TableFilters filterConfig={filterConfig} search={true} onFilterChange={onFilterChange}
                                    placeholder="Search for Act/Estblishment Type/Law" />
                                <TableActions buttons={buttons} />
                            </div>
                        </div>
                    </div>
                    <Table data={data} options={tableConfig} isLoading={isFetching} onPageNav={handlePageNav} />
                </div>
            </MastersLayout>
            {
                action === ACTIONS.DELETE && Boolean(notification) &&
                <ConfirmModal title={'Delete Notification Template'} onSubmit={() => deleteNotificationTemplate(notification.id)}
                    onClose={() => {
                        setAction(ACTIONS.NONE);
                        setNotification(undefined);
                    }}>
                    <div className="text-center mb-4">Are you sure you want to delete the notification template for , <strong>{getValue(notification, 'templateType.name')}</strong> ?</div>
                </ConfirmModal>
            }
            {
                (action === ACTIONS.ADD || (action === ACTIONS.EDIT && Boolean(notification))) &&
                <NotificationTemplateDetails data={notification} action={action}
                    onSubmit={() => {
                        refetch();
                        setAction(ACTIONS.NONE);
                        setNotification(undefined);
                    }} onClose={() => {
                        setAction(ACTIONS.NONE);
                        setNotification(undefined);
                    }} />
            }
            {deleting && <PageLoader />}
        </>
    )
}