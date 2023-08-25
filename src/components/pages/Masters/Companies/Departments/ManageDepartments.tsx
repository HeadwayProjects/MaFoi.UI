import React, { useEffect, useState, useRef } from "react";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { toast } from "react-toastify";
import { ACTIONS, TOOLTIP_DELAY } from "../../../../common/Constants";
import Table, { CellTmpl, DEFAULT_OPTIONS_PAYLOAD, DEFAULT_PAYLOAD, reactFormatter } from "../../../../common/Table";
import { useDeleteDepartment, useGetCompanies, useGetDepartments, useGetVerticals } from "../../../../../backend/masters";
import { ERROR_MESSAGES } from "../../../../../utils/constants";
import Icon from "../../../../common/Icon";
import MastersLayout from "../../MastersLayout";
import TableFilters, { DEFAULT_OPTION } from "../../../../common/TableFilter";
import ConfirmModal from "../../../../common/ConfirmModal";
import PageLoader from "../../../../shared/PageLoader";
import DepartmentDetails from "./DepartmentDetails";
import { useExportDepartments } from "../../../../../backend/exports";
import { downloadFileContent } from "../../../../../utils/common";

function ManageDepartments() {
    const [t] = useState(new Date().getTime());
    const [breadcrumb] = useState([
        { id: 'home', label: 'Home', path: '/' },
        { id: 'companies', label: 'Companies', path: '/companies/list' },
        { id: 'departments', label: 'Departments' },
    ]);
    const [action, setAction] = useState(ACTIONS.NONE);
    const [department, setDepartment] = useState<any>(null);
    const [data, setData] = useState<any>();
    const [params, setParams] = useState<any>();
    const [filters, setFilters] = useState<any>();
    const filterRef: any = useRef();
    filterRef.current = filters;
    const [company, setCompany] = useState<any>(null);
    const [vertical, setVertical] = useState<any>(null);
    const [payload, setPayload] = useState({ ...DEFAULT_PAYLOAD, sort: { columnName: 'name', order: 'asc' } });
    const { companies, isFetching: fetchingCompanies } = useGetCompanies({ ...DEFAULT_OPTIONS_PAYLOAD, filters: [{ columnName: 'isParent', value: 'true' }], t });
    const { verticals } = useGetVerticals({ ...DEFAULT_OPTIONS_PAYLOAD, t });
    const { departments, total, isFetching, refetch } = useGetDepartments(payload);
    const { deleteDepartment, deleting } = useDeleteDepartment(() => {
        toast.success(`${department.name} deleted successfully.`);
        submitCallback();
    }, () => {
        toast.error(ERROR_MESSAGES.DEFAULT);
    });
    const { exportDepartments, exporting } = useExportDepartments((response: any) => {
        downloadFileContent({
            name: 'Departments.xlsx',
            type: response.headers['content-type'],
            content: response.data
        });
    }, () => {
        toast.error(ERROR_MESSAGES.DEFAULT);
    });

    const filterConfig = [
        // {
        //     label: 'Company',
        //     name: 'companyId',
        //     options: (companies || []).map((x: any) => {
        //         return { value: x.id, label: x.name };
        //     }),
        //     value: company
        // },
        {
            label: 'Vertical',
            name: 'verticalId',
            options: (verticals || []).map((x: any) => {
                return { value: x.id, label: x.name };
            }),
            // value: vertical
        }
    ]

    function CompanyTmpl({ cell }: any) {
        const row = cell.getData();
        const vertical = (row || {}).vertical || {};
        const value = ((vertical || {}).company || {}).name;
        return (
            <>
                {
                    !!value &&
                    <div className="d-flex align-items-center h-100 w-auto">
                        <OverlayTrigger overlay={<Tooltip>{value}</Tooltip>} rootClose={true}
                            placement="bottom" delay={{ show: TOOLTIP_DELAY } as any}>
                            <div className="ellipse two-lines">{value}</div>
                        </OverlayTrigger>
                    </div>
                }
            </>
        )
    }

    function VerticalTmpl({ cell }: any) {
        const row = cell.getData();
        const value = ((row || {}).vertical || {}).name;
        return (
            <>
                {
                    !!value &&
                    <div className="d-flex align-items-center h-100 w-auto">
                        <OverlayTrigger overlay={<Tooltip>{value}</Tooltip>} rootClose={true}
                            placement="bottom" delay={{ show: TOOLTIP_DELAY } as any}>
                            <div className="ellipse two-lines">{value}</div>
                        </OverlayTrigger>
                    </div>
                }
            </>
        )
    }

    function ActionColumnElements({ cell }: any) {
        const row = cell.getData();

        return (
            <div className="d-flex flex-row align-items-center position-relative h-100">
                <Icon className="mx-2" type="button" name={'pencil'} text={'Edit'} data={row} action={() => {
                    setDepartment(row);
                    setAction(ACTIONS.EDIT)
                }} />
                <Icon className="mx-2" type="button" name={'trash'} text={'Delete'} data={row} action={() => {
                    setDepartment(row);
                    setAction(ACTIONS.DELETE)
                }} />
                <Icon className="mx-2" type="button" name={'eye'} text={'View'} data={row} action={() => {
                    setDepartment(row);
                    setAction(ACTIONS.VIEW)
                }} />
            </div>
        )
    }

    const columns = [
        { title: "Company", field: "companyId", formatter: reactFormatter(<CompanyTmpl />) },
        { title: "Vertical", field: "verticalId", formatter: reactFormatter(<VerticalTmpl />) },
        { title: "Code", field: "shortCode", formatter: reactFormatter(<CellTmpl />) },
        { title: "Name", field: "name", formatter: reactFormatter(<CellTmpl />) },
        { title: "Description", field: "description", formatter: reactFormatter(<CellTmpl />), widthGrow: 2 },
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
        initialSort: [{ column: 'verticalId', dir: 'asc' }]
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
        return Promise.resolve(formatApiResponse(params, departments, total));
    }

    function submitCallback() {
        setAction(ACTIONS.NONE);
        setDepartment(null);
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
        exportDepartments({ ...payload, pagination: null });
    }

    // useEffect(() => {
    //     if (filters) {
    //         const { filters: _filters, search } = filters;
    //         setData(formatApiResponse(params, [], 0));
    //         const _companyId = (_filters.find((x: any) => x.columnName === 'companyId') || {}).value;
    //         const _x = [{ columnName: 'companyId', value: _companyId }];
    //         if (_companyId && (company || {}).value !== _companyId) {
    //             setVertical(DEFAULT_OPTION);
    //             const { id, name } = companies.find((x: any) => x.id === _companyId) || {};
    //             setCompany({ value: id, label: name });
    //         }
    //         const _verticalId = _companyId ? (_filters.find((x: any) => x.columnName === 'verticalId') || {}).value : null;
    //         if (_verticalId) {
    //             const { id, name } = verticals.find((x: any) => x.id === _verticalId) || {};
    //             if (id && name) {
    //                 setVertical({ value: id, label: name });
    //             }
    //             _x.push({ columnName: 'verticalId', value: _verticalId });
    //         }
    //         setPayload({ ...DEFAULT_PAYLOAD, ...params, filters: _x, search });
    //     }

    // }, [filters]);

    // useEffect(() => {
    //     if (!fetchingCompanies && companies) {
    //         const { id, name } = (companies || [])[0] || {};
    //         setCompany({ value: id, label: name });
    //         if (id && name) {
    //             setVertical(DEFAULT_OPTION);
    //             const { search } = filterRef.current || { search: '' };
    //             setFilters({
    //                 filters: [{ columnName: 'companyId', value: id }],
    //                 search
    //             });
    //         }
    //     }
    // }, [fetchingCompanies]);

    useEffect(() => {
        if (!isFetching && payload) {
            setTimeout(() => {
                setData(formatApiResponse(params, departments, total));
            });
        }
    }, [isFetching]);

    return (
        <>
            <MastersLayout title="Companies - Departments" breadcrumbs={breadcrumb}>
                <div className="d-flex flex-column mx-0">
                    <div className="card shadow d-flex flex-row justify-content-center m-3 p-3">
                        <div className="col-12">
                            <div className="d-flex justify-content-between align-items-end">
                                <TableFilters filterConfig={filterConfig} search={true} onFilterChange={onFilterChange}
                                    placeholder="Search for Department" />
                                <div className="d-flex">
                                    <Button variant="primary" className="px-3 mx-3 text-nowrap" onClick={handleExport}
                                        disabled={!Boolean(total)}>
                                        <Icon name={'download'} className="me-2"></Icon>Export
                                    </Button>
                                    <Button variant="primary" className="px-3 text-nowrap" onClick={() => setAction(ACTIONS.ADD)}>
                                        <Icon name={'plus'} className="me-2"></Icon>Add New
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Table data={data} options={tableConfig} isLoading={isFetching} onPageNav={handlePageNav} />
                </div>
            </MastersLayout>
            {
                [ACTIONS.ADD, ACTIONS.EDIT, ACTIONS.VIEW].includes(action) &&
                <DepartmentDetails action={action} data={action !== ACTIONS.ADD ? department : null}
                    onClose={() => setAction(ACTIONS.NONE)} onSubmit={submitCallback} />
            }
            {
                action === ACTIONS.DELETE && Boolean(department) &&
                <ConfirmModal title={'Delete Act Master'} onSubmit={() => deleteDepartment(department.id)} onClose={() => setAction(ACTIONS.NONE)}>
                    <div className="text-center mb-4">Are you sure you want to delete the Vertical, <strong>{(department || {}).name}</strong> ?</div>
                </ConfirmModal>
            }
            {
                deleting && <PageLoader>Deleting Vertical...</PageLoader>
            }
            {
                exporting && <PageLoader>Preparing Data...</PageLoader>
            }
        </>
    )
}

export default ManageDepartments;