import React, { useEffect, useState } from "react";
import MastersLayout from "./MastersLayout";
import { Button } from "react-bootstrap";
import Icon from "../../common/Icon";
import Table, { CellTmpl, DEFAULT_PAYLOAD, reactFormatter } from "../../common/Table";
import { ACTIONS } from "../../common/Constants";
import LawDetails from "./LawDetails";
import ConfirmModal from "../../common/ConfirmModal";
import { useDeleteLaw, useGetLaws } from "../../../backend/masters";
import { GetMastersBreadcrumb } from "./Master.constants";
import { toast } from "react-toastify";
import { ERROR_MESSAGES } from "../../../utils/constants";
import PageLoader from "../../shared/PageLoader";
import TableFilters from "../../common/TableFilter";
import { useRef } from "react";
import { useExportLaws } from "../../../backend/exports";
import { downloadFileContent } from "../../../utils/common";
import { hasUserAccess } from "../../../backend/auth";
import { USER_PRIVILEGES } from "../UserManagement/Roles/RoleConfiguration";

function Law() {
    const [breadcrumb] = useState(GetMastersBreadcrumb('Law'));
    const [action, setAction] = useState(ACTIONS.NONE);
    const [law, setLaw] = useState<any>(null);
    const [data, setData] = useState<any>();
    const [params, setParams] = useState<any>();
    const [filters, setFilters] = useState<any>();
    const filterRef: any = useRef();
    filterRef.current = filters;
    const [payload, setPayload] = useState({ ...DEFAULT_PAYLOAD, sort: { columnName: 'name', order: 'asc' } });
    const { laws, total, isFetching, refetch } = useGetLaws(payload);
    const { deleteLaw, deleting } = useDeleteLaw(() => {
        toast.success(`Law category "${law.name}" deleted successfully.`);
        submitCallback();
    }, () => {
        toast.error(ERROR_MESSAGES.DEFAULT);
    });
    const { exportLaws, exporting } = useExportLaws((response: any) => {
        downloadFileContent({
            name: 'Laws.xlsx',
            type: response.headers['content-type'],
            content: response.data
        });
    }, () => {
        toast.error(ERROR_MESSAGES.DEFAULT);
    });

    function ActionColumnElements({ cell }: any) {
        const row = cell.getData();

        return (
            <div className="d-flex flex-row align-items-center position-relative h-100">
                {
                    hasUserAccess(USER_PRIVILEGES.EDIT_LAW_CATEGORY) &&
                    <Icon className="mx-2" type="button" name={'pencil'} text={'Edit'} data={row} action={() => {
                        setLaw(row);
                        setAction(ACTIONS.EDIT)
                    }} />
                }
                {
                    // hasUserAccess(USER_PRIVILEGES.DELETE_LAW_CATEGORY) &&
                    // <Icon className="mx-2" type="button" name={'trash'} text={'Delete'} data={row} action={() => {
                    //     setLaw(row);
                    //     setAction(ACTIONS.DELETE)
                    // }} />
                }
                <Icon className="mx-2" type="button" name={'eye'} text={'View'} data={row} action={() => {
                    setLaw(row);
                    setAction(ACTIONS.VIEW)
                }} />
            </div>
        )
    }

    const columns = [
        { title: "Name", field: "name", formatter: reactFormatter(<CellTmpl />) },
        { title: "Description", field: "description", widthGrow: 2, formatter: reactFormatter(<CellTmpl />) },
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
        initialSort: [{ column: 'name', dir: 'asc' }]
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
                columnName: field || 'name',
                order: dir || 'asc'
            }
        };
        setParams(_params);
        setPayload({ ...DEFAULT_PAYLOAD, ...filterRef.current, ..._params });
        return Promise.resolve(formatApiResponse(params, laws, total));
    }

    function submitCallback() {
        setAction(ACTIONS.NONE);
        setLaw(null);
        refetch();
    }

    function handleDelete() {
        deleteLaw(law.id);
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

    function handleExport() {
        exportLaws({
            ...payload,
            pagination: null
        });
    }

    useEffect(() => {
        if (!isFetching) {
            setTimeout(() => {
                setData(formatApiResponse(params, laws, total));
            });
        }
    }, [isFetching]);

    return (
        <>
            <MastersLayout title="Masters - Law" breadcrumbs={breadcrumb}>
                <div className="d-flex flex-column mx-0">
                    <div className="card shadow d-flex flex-row justify-content-center m-3 p-3">
                        <div className="col-12">
                            <div className="d-flex justify-content-between align-items-end">
                                <TableFilters search={true} onFilterChange={onFilterChange} placeholder="Search for Law/Description" />
                                <div className="d-flex">
                                    {
                                        hasUserAccess(USER_PRIVILEGES.EXPORT_LAW_CATEGORIES) &&
                                        <Button variant="primary" className="px-3 text-nowrap" onClick={handleExport}>
                                            <Icon name={'download'} className="me-2"></Icon>Export
                                        </Button>
                                    }
                                    {
                                        hasUserAccess(USER_PRIVILEGES.ADD_LAW_CATEGORY) &&
                                        <Button variant="primary" className="px-3 ms-3 text-nowrap" onClick={() => setAction(ACTIONS.ADD)}>
                                            <Icon name={'plus'} className="me-2"></Icon>Add New
                                        </Button>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <Table data={data} options={tableConfig} isLoading={isFetching} onPageNav={handlePageNav} />
                </div>
            </MastersLayout>
            {
                [ACTIONS.ADD, ACTIONS.EDIT, ACTIONS.VIEW].includes(action) &&
                <LawDetails action={action} data={action !== ACTIONS.ADD ? law : null}
                    onClose={() => setAction(ACTIONS.NONE)} onSubmit={submitCallback} />
            }
            {
                action === ACTIONS.DELETE &&
                <ConfirmModal title={'Delete Law Master'} onSubmit={handleDelete} onClose={() => setAction(ACTIONS.NONE)}>
                    <div className="text-center mb-4">Are you sure you want to delete the Law <strong>{(law || {}).name}</strong> ?</div>
                </ConfirmModal>
            }
            {
                deleting && <PageLoader>Deleting Law...</PageLoader>
            }
            {
                exporting && <PageLoader>Preparing Data...</PageLoader>
            }
        </>
    )
}

export default Law;