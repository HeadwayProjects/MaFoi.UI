import React, { useEffect, useState } from "react";
import MastersLayout from "./MastersLayout";
import { Button } from "react-bootstrap";
import Icon from "../../common/Icon";
import Table, { CellTmpl, DEFAULT_OPTIONS_PAYLOAD, DEFAULT_PAYLOAD, reactFormatter, NameTmpl } from "../../common/Table";
import { ACTIONS } from "../../common/Constants";
import CityDetails from "./CityDetails";
import ConfirmModal from "../../common/ConfirmModal";
import { useGetCities, useDeleteCity, useGetStates } from "../../../backend/masters";
import { toast } from "react-toastify";
import { GetMastersBreadcrumb } from "./Master.constants";
import { useRef } from "react";
import TableFilters from "../../common/TableFilter";
import { useExportCities } from "../../../backend/exports";
import { downloadFileContent } from "../../../utils/common";
import PageLoader from "../../shared/PageLoader";
import { ERROR_MESSAGES } from "../../../utils/constants";
import { hasUserAccess } from "../../../backend/auth";
import { USER_PRIVILEGES } from "../UserManagement/Roles/RoleConfiguration";

function City() {
    const [breadcrumb] = useState(GetMastersBreadcrumb('City'));
    const [action, setAction] = useState(ACTIONS.NONE);
    const [city, setCity] = useState<any>(null);
    const [data, setData] = useState<any>();
    const [params, setParams] = useState<any>();
    const [filters, setFilters] = useState<any>();
    const filterRef: any = useRef();
    filterRef.current = filters;
    const [payload, setPayload] = useState({ ...DEFAULT_PAYLOAD, sort: { columnName: 'name', order: 'asc' } });
    const { cities, total, isFetching, refetch } = useGetCities(payload);
    const { states } = useGetStates({ ...DEFAULT_OPTIONS_PAYLOAD });

    const { deleteCity } = useDeleteCity(() => {
        toast.success(`${city.name} deleted successsfully.`);
        setAction(ACTIONS.NONE);
        setCity(null);
        refetch();
    }, () => {
        toast.error(ERROR_MESSAGES.DEFAULT);
    });

    const { exportCities, exporting } = useExportCities((response: any) => {
        downloadFileContent({
            name: 'Cities.xlsx',
            type: response.headers['content-type'],
            content: response.data
        });
    }, () => {
        toast.error(ERROR_MESSAGES.DEFAULT);
    });

    const filterConfig = [
        {
            label: 'State',
            name: 'stateId',
            options: (states || []).map((x: any) => {
                return { value: x.id, label: x.name };
            })
        }
    ];

    function ActionColumnElements({ cell }: any) {
        const row = cell.getData();

        return (
            <div className="d-flex flex-row align-items-center position-relative h-100">
                {
                    hasUserAccess(USER_PRIVILEGES.EDIT_CITY) &&
                    <Icon className="mx-2" type="button" name={'pencil'} text={'Edit'} data={row} action={() => {
                        setCity(row);
                        setAction(ACTIONS.EDIT)
                    }} />
                }
                {
                    hasUserAccess(USER_PRIVILEGES.DELETE_CITY) &&
                    <Icon className="mx-2" type="button" name={'trash'} text={'Delete'} data={row} action={() => {
                        setCity(row);
                        setAction(ACTIONS.DELETE)
                    }} />
                }
                <Icon className="mx-2" type="button" name={'eye'} text={'View'} data={row} action={() => {
                    setCity(row);
                    setAction(ACTIONS.VIEW)
                }} />
            </div>
        )
    }

    const columns = [
        { title: "Code", field: "code", formatter: reactFormatter(<CellTmpl />) },
        { title: "Name", field: "name", widthGrow: 2, formatter: reactFormatter(<CellTmpl />) },
        { title: "State", field: "state", widthGrow: 2, formatter: reactFormatter(<NameTmpl />) },
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
        return Promise.resolve(formatApiResponse(params, cities, total));
    }

    function successCallback() {
        setAction(ACTIONS.NONE);
        setCity(null);
        refetch();
    }

    function onDelete() {
        deleteCity(city.id);
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
        exportCities({ ...payload, pagination: null });
    }

    useEffect(() => {
        if (!isFetching && payload) {
            setData(formatApiResponse(params, cities, total));
        }
    }, [isFetching]);

    return (
        <>
            <MastersLayout title="Masters - City" breadcrumbs={breadcrumb}>
                <div className="d-flex flex-column mx-0">
                    <div className="card shadow d-flex flex-row justify-content-center m-3 p-3">
                        <div className="col-12">
                            <div className="d-flex justify-content-between align-items-end">
                                <TableFilters filterConfig={filterConfig} search={true} onFilterChange={onFilterChange}
                                    placeholder={"Search for City Code/Name"} />
                                <div className="d-flex">
                                    {
                                        hasUserAccess(USER_PRIVILEGES.EXPORT_CITIES) &&
                                        <Button variant="primary" className="px-3 text-nowrap" onClick={handleExport}>
                                            <Icon name={'download'} className="me-2"></Icon>Export
                                        </Button>
                                    }
                                    {
                                        hasUserAccess(USER_PRIVILEGES.ADD_CITY) &&
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
                <CityDetails action={action} data={action !== ACTIONS.ADD ? city : null}
                    onClose={() => setAction(ACTIONS.NONE)} onSubmit={successCallback} />
            }
            {
                action === ACTIONS.DELETE &&
                <ConfirmModal title={'Delete City Master'} onSubmit={onDelete} onClose={() => setAction(ACTIONS.NONE)}>
                    <div className="text-center mb-4">Are you sure you want to delete the city, <strong>{(city || {}).name}</strong> ?</div>
                </ConfirmModal>
            }
            {exporting && <PageLoader message={'Preparing Data...'} />}
        </>
    )
}

export default City;