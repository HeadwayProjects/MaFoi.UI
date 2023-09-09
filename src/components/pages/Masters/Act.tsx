import React, { useEffect, useState } from "react";
import MastersLayout from "./MastersLayout";
import { Button } from "react-bootstrap";
import Icon from "../../common/Icon";
import Table, { CellTmpl, DEFAULT_OPTIONS_PAYLOAD, DEFAULT_PAYLOAD, NameTmpl, reactFormatter } from "../../common/Table";
import { ACTIONS } from "../../common/Constants";
import ActDetails from "./ActDetails";
import ConfirmModal from "../../common/ConfirmModal";
import { useDeleteAct, useGetActs, useGetLaws } from "../../../backend/masters";
import { EstablishmentTypes, GetMastersBreadcrumb } from "./Master.constants";
import { toast } from "react-toastify";
import { API_DELIMITER, ERROR_MESSAGES, UI_DELIMITER } from "../../../utils/constants";
import PageLoader from "../../shared/PageLoader";
import { useRef } from "react";
import TableFilters from "../../common/TableFilter";
import { downloadFileContent } from "../../../utils/common";
import { useExportAct } from "../../../backend/exports";
import ActImportModal from "./ActImportModal";
import styles from "./Masters.module.css";
import { hasUserAccess } from "../../../backend/auth";
import { USER_PRIVILEGES } from "../UserManagement/Roles/RoleConfiguration";

function Act() {
    const [breadcrumb] = useState(GetMastersBreadcrumb('Act'));
    const [action, setAction] = useState(ACTIONS.NONE);
    const [act, setAct] = useState<any>(null);
    const [data, setData] = useState<any>();
    const [params, setParams] = useState<any>();
    const [filters, setFilters] = useState<any>();
    const filterRef: any = useRef();
    filterRef.current = filters;
    const [payload, setPayload] = useState({ ...DEFAULT_PAYLOAD, sort: { columnName: 'name', order: 'asc' } });
    const { laws } = useGetLaws({ ...DEFAULT_OPTIONS_PAYLOAD });
    const { acts, total, isFetching, refetch } = useGetActs(payload);
    const { deleteAct, deleting } = useDeleteAct(() => {
        toast.success(`${act.name} deleted successfully.`);
        submitCallback();
    }, () => {
        toast.error(ERROR_MESSAGES.DEFAULT);
    });
    const { exportAct, exporting } = useExportAct((response: any) => {
        downloadFileContent({
            name: 'Acts.xlsx',
            type: response.headers['content-type'],
            content: response.data
        });
    }, () => {
        toast.error(ERROR_MESSAGES.DEFAULT);
    });

    const filterConfig = [
        {
            label: 'Establishment Type',
            name: 'establishmentType',
            options: [
                { value: "", label: 'Blank' },
                ...EstablishmentTypes.map(x => {
                    return { value: x, label: x }
                })
            ]
        },
        {
            label: 'Law',
            name: 'lawId',
            options: (laws || []).map((x: any) => {
                return { value: x.id, label: x.name };
            })
        }
    ]

    function ActionColumnElements({ cell }: any) {
        const row = cell.getData();

        return (
            <div className="d-flex flex-row align-items-center position-relative h-100">
                {
                    hasUserAccess(USER_PRIVILEGES.EDIT_ACT) &&
                    <Icon className="mx-2" type="button" name={'pencil'} text={'Edit'} data={row} action={() => {
                        setAct(row);
                        setAction(ACTIONS.EDIT)
                    }} />
                }
                {
                    hasUserAccess(USER_PRIVILEGES.DELETE_ACT) &&
                    <Icon className="mx-2" type="button" name={'trash'} text={'Delete'} data={row} action={() => {
                        setAct(row);
                        setAction(ACTIONS.DELETE)
                    }} />
                }
                <Icon className="mx-2" type="button" name={'eye'} text={'View'} data={row} action={() => {
                    setAct(row);
                    setAction(ACTIONS.VIEW)
                }} />
            </div>
        )
    }

    const columns = [
        { title: "Act Name", field: "name", widthGrow: 2, formatter: reactFormatter(<CellTmpl />) },
        { title: "Establishment Type", field: "establishmentType", formatter: reactFormatter(<CellTmpl />) },
        { title: "Law", field: "law", formatter: reactFormatter(<NameTmpl />) },
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
        return Promise.resolve(formatApiResponse(params, acts, total));
    }

    function submitCallback() {
        setAction(ACTIONS.NONE);
        setAct(null);
        refetch();
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
        exportAct({ ...payload, pagination: null });
    }

    useEffect(() => {
        if (!isFetching && payload) {
            setTimeout(() => {
                setData(formatApiResponse(params, acts, total));
            });
        }
    }, [isFetching]);

    return (
        <>
            <MastersLayout title="Masters - Act" breadcrumbs={breadcrumb}>
                <div className="d-flex flex-column mx-0">
                    <div className="card shadow d-flex flex-row justify-content-center m-3 p-3">
                        <div className="col-12">
                            <div className="d-flex justify-content-between align-items-end">
                                <TableFilters filterConfig={filterConfig} search={true} onFilterChange={onFilterChange}
                                    placeholder="Search for Act/Estblishment Type/Law" />
                                <div className="d-flex">
                                    {
                                        hasUserAccess(USER_PRIVILEGES.ADD_ACT) &&
                                        <Button variant="primary" className="px-3 text-nowrap" onClick={() => setAction(ACTIONS.IMPORT)}>
                                            <Icon name={'upload'} className={`me-2 ${styles.importBtn}`}></Icon>Import
                                        </Button>
                                    }
                                    {
                                        hasUserAccess(USER_PRIVILEGES.EXPORT_ACTS) &&
                                        <Button variant="primary" className="px-3 mx-3 text-nowrap" onClick={handleExport}>
                                            <Icon name={'download'} className="me-2"></Icon>Export
                                        </Button>
                                    }
                                    {
                                        hasUserAccess(USER_PRIVILEGES.ADD_ACT) &&
                                        <Button variant="primary" className="px-3 text-nowrap" onClick={() => setAction(ACTIONS.ADD)}>
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
                <ActDetails action={action} data={action !== ACTIONS.ADD ? act : null}
                    onClose={() => setAction(ACTIONS.NONE)} onSubmit={submitCallback} />
            }
            {
                action === ACTIONS.DELETE &&
                <ConfirmModal title={'Delete Act Master'} onSubmit={() => deleteAct(act.id)} onClose={() => setAction(ACTIONS.NONE)}>
                    <div className="text-center mb-4">Are you sure you want to delete the Act, <strong>{(act || {}).name}</strong> ?</div>
                </ConfirmModal>
            }
            {
                action === ACTIONS.IMPORT &&
                <ActImportModal onSubmit={refetch} onClose={() => setAction(ACTIONS.NONE)} />
            }
            {
                deleting && <PageLoader>Deleting Act...</PageLoader>
            }
            {
                exporting && <PageLoader>Preparing Data...</PageLoader>
            }
        </>
    )
}

export default Act;