import React, { useRef, useState } from "react";
import { useDeleteEmailTemplate, useGetAllEmailTemplateTypes, useGetAllTemplates } from "../../../backend/email";
import TableFilters from "../../common/TableFilter";
import { ACTIONS } from "../../common/Constants";
import Table, { CellTmpl, DEFAULT_OPTIONS_PAYLOAD, DEFAULT_PAYLOAD, reactFormatter } from "../../common/Table";
import Icon from "../../common/Icon";
import { Button } from "react-bootstrap";
import { useEffect } from "react";
import { VIEWS } from "./EmailTemplates";
import ConfirmModal from "../../common/ConfirmModal";
import { getValue } from "../../../utils/common";
import { API_RESULT, ERROR_MESSAGES } from "../../../utils/constants";
import { toast } from "react-toastify";
import PageLoader from "../../shared/PageLoader";
import { useGetCompanies } from "../../../backend/masters";
import { sortBy } from "underscore";
import { hasUserAccess } from "../../../backend/auth";
import { USER_PRIVILEGES } from "../UserManagement/Roles/RoleConfiguration";

const SortFields: any = {
    'templateType.description': 'templateType'
};

function ManageEmailTemplates({ changeView }: any) {
    const [t] = useState(new Date().getTime())
    const [action, setAction] = useState(ACTIONS.NONE);
    const [template, setTemplate] = useState<any>(null);
    const [data, setData] = useState<any>();
    const [params, setParams] = useState<any>();
    const [filters, setFilters] = useState<any>();
    const filterRef: any = useRef();
    filterRef.current = filters;
    const [payload, setPayload] = useState({ ...DEFAULT_PAYLOAD, sort: { columnName: 'templateType', order: 'asc' }, ...filterRef.current, t });
    const { companies } = useGetCompanies({ ...DEFAULT_OPTIONS_PAYLOAD, filters: [{ columnName: 'isParent', value: 'true' }] })
    const { templates, total, isFetching, refetch } = useGetAllTemplates(payload, Boolean(payload));
    const { deleteEmailTemplate, deleting } = useDeleteEmailTemplate(({ key, value }: any) => {
        if (key === API_RESULT.SUCCESS) {
            toast.success('Email Template deleted successfully.');
            setAction(ACTIONS.NONE);
            setTemplate(null);
            refetch();
        } else {
            toast.error(value || ERROR_MESSAGES.DEFAULT);
        }
    });

    const { templateTypes } = useGetAllEmailTemplateTypes(null);
    const filterConfig = [
        {
            label: 'Template Type',
            name: 'templateTypeId',
            options: sortBy(templateTypes || [], 'description').map((x: any) => {
                return { value: `${x.id}`, label: x.description };
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
        { title: "Template Type", field: "templateType", formatter: reactFormatter(<TemplateTypeTmpl />) },
        { title: "Company", field: "company.name", formatter: reactFormatter(<CellTmpl />) },
        { title: "Subject", field: "subject", formatter: reactFormatter(<CellTmpl />) },
        {
            title: "Actions", hozAlign: "center", width: 140,
            headerSort: false, formatter: reactFormatter(<ActionColumnElements />)
        }
    ]

    const [tableConfig] = useState({
        paginationMode: 'remote',
        ajaxRequestFunc,
        columns,
        rowHeight: 54,
        selectable: false,
        paginate: true,
        initialSort: [{ column: 'templateType', dir: 'asc' }]
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
                    hasUserAccess(USER_PRIVILEGES.EDIT_EMAIL_TEMPLATE) &&
                    <Icon className="mx-2" type="button" name={'pencil'} text={'Edit'} data={row} action={() => {
                        changeView(VIEWS.EDIT, { emailTemplate: row })
                    }} />
                }
                {
                    // hasUserAccess(USER_PRIVILEGES.DELETE_EMAIL_TEMPLATE) &&
                    // <Icon className="mx-2" type="button" name={'trash'} text={'Delete'} data={row} action={() => {
                    //     if (!row.companyId) return;
                    //     setTemplate(row);
                    //     setAction(ACTIONS.DELETE)
                    // }} disabled={!row.companyId}/>
                }
                <Icon className="mx-2" type="button" name={'eye'} text={'View'} data={row} action={() => {
                    changeView(VIEWS.VIEW, { emailTemplate: row })
                }} />
            </div>
        )
    }

    function TemplateTypeTmpl({ cell }: any) {
        const { description } = cell.getValue();
        return (
            <div className="d-flex align-items-center h-100 w-auto">
                <div className="ellipse two-lines">{description}</div>
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
            <div className="d-flex flex-column mx-0">
                <div className="card shadow d-flex flex-row justify-content-center m-3 p-3">
                    <div className="col-12">
                        <div className="d-flex justify-content-between align-items-end">
                            <TableFilters filterConfig={filterConfig} search={false} onFilterChange={onFilterChange} />
                            {
                                hasUserAccess(USER_PRIVILEGES.ADD_EMAIL_TEMPLATE) &&
                                <Button variant="primary" className="px-3 ms-auto text-nowrap" onClick={() => changeView(VIEWS.ADD)}>
                                    <Icon name={'plus'} className="me-2"></Icon>Add New
                                </Button>
                            }
                        </div>
                    </div>
                </div>
                <Table data={data} options={tableConfig} isLoading={isFetching} onPageNav={handlePageNav} />
            </div>
            {
                action === ACTIONS.DELETE && Boolean(template) &&
                <ConfirmModal title={'Delete Email Template'} onSubmit={() => deleteEmailTemplate(template.id)} onClose={() => setAction(ACTIONS.NONE)}>
                    <div className="text-center mb-4">Are you sure you want to delete the email template for , <strong>{getValue(template, 'templateType.description')}</strong> ?</div>
                </ConfirmModal>
            }
            {deleting && <PageLoader />}
        </>
    )
}

export default ManageEmailTemplates;