import React, { useEffect, useState } from "react";
import { useDeleteCompanyLocation, useGetCompanies, useGetCompanyLocations } from "../../../../backend/masters";
import Icon from "../../../common/Icon";
import { ACTIONS } from "../../../common/Constants";
import Table, { CellTmpl, DEFAULT_OPTIONS_PAYLOAD, DEFAULT_PAYLOAD, TitleTmpl, reactFormatter } from "../../../common/Table";
import { Button } from "react-bootstrap";
import ConfirmModal from "../../../common/ConfirmModal";
import { useQueryParams } from "raviger";
import CompanyLocationDetails from "./CompanyLocationMappingDetails";
import { useRef } from "react";
import TableFilters from "../../../common/TableFilter";
import { toast } from "react-toastify";
import { API_RESULT, ERROR_MESSAGES } from "../../../../utils/constants";
import PageLoader from "../../../shared/PageLoader";
import MastersLayout from "../MastersLayout";
import { GetMastersBreadcrumb } from "../Master.constants";
import styles from "./Companies.module.css"
import CompanyLocationsImportModal from "./CompanyLocationsImportModal";

function mapLocation(x) {
    return {
        id: x.id,
        locationId: x.locationId,
        companyLocationAddress: x.companyLocationAddress,
        locationCode: x.location.code,
        locationName: x.location.name,
        city: x.location.cities,
        state: x.location.cities.state,
        contactPersonName: x.contactPersonName,
        contactPersonMobile: x.contactPersonMobile,
        contactPersonEmail: x.contactPersonEmail,
        address: x.address
    }
};

function CompanyLocationMappings() {
    const [breadcrumb] = useState(GetMastersBreadcrumb('Location Mapping'));
    const [query] = useQueryParams();
    const [action, setAction] = useState(ACTIONS.NONE);
    const [parentCompany, setParentCompany] = useState(null);
    const [associateCompany, setAssociateCompany] = useState(null);
    const [companyLocation, setCompanyLocation] = useState(null);
    const [data, setData] = useState();
    const [params, setParams] = useState();
    const [filters, setFilters] = useState();
    const filterRef = useRef();
    filterRef.current = filters;
    const [payload, setPayload] = useState();
    const { companies: parentCompanies, isFetching: fetchingCompanies } = useGetCompanies({ ...DEFAULT_OPTIONS_PAYLOAD, filters: [{ columnName: 'isParent', value: 'true' }] });
    const { companies: associateCompanies, isFetching: fetchingAssociateCompanies } = useGetCompanies({
        ...DEFAULT_OPTIONS_PAYLOAD,
        filters: [{ columnName: 'isParent', value: 'false' }, { columnName: 'parentCompanyId', value: (parentCompany || {}).value }]
    }, Boolean((parentCompany || {}).value));
    const { locations, total, isFetching, refetch } = useGetCompanyLocations(payload, Boolean(associateCompany && payload));
    const { deleteCompanyLocation, deleting } = useDeleteCompanyLocation(({ key, value }) => {
        if (key === API_RESULT.SUCCESS) {
            toast.success(`Location ${companyLocation.locationName} deleted successfully.`);
            submitCallback();
        } else {
            toast.error(value || ERROR_MESSAGES.ERROR);
        }
    });


    const filterConfig = [
        {
            label: 'Company',
            name: 'parentCompanyId',
            options: (parentCompanies || []).map(x => {
                return { value: x.id, label: x.name };
            }),
            hideAll: true,
            value: parentCompany

        },
        {
            label: 'Associate Company',
            name: 'associateCompanyId',
            options: (associateCompanies || []).map(x => {
                return { value: x.id, label: x.name };
            }),
            hideAll: true,
            value: associateCompany
        }
    ]

    function submitCallback() {
        setAction(ACTIONS.NONE);
        setCompanyLocation(null);
        refetch();
    }

    function ActionColumnElements({ cell }) {
        const row = cell.getData();
        return (
            <div className="d-flex flex-row align-items-center position-relative h-100">
                <Icon className="mx-2" type="button" name={'pencil'} text={'Edit'} data={row} action={(event) => {
                    setCompanyLocation(row);
                    setAction(ACTIONS.EDIT);
                }} />
                <Icon className="mx-2" type="button" name={'trash'} text={'Delete'} data={row} action={(event) => {
                    setCompanyLocation(row);
                    setAction(ACTIONS.DELETE);
                }} />
                <Icon className="mx-2" type="button" name={'eye'} text={'View'} data={row} action={(event) => {
                    setCompanyLocation(row);
                    setAction(ACTIONS.VIEW);
                }} />
            </div>
        )
    }

    const columns = [
        {
            title: "Name", field: "locationName", widthGrow: 2,
            formatter: reactFormatter(<CellTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        },
        {
            title: "Code", field: "locationCode", width: 120,
            formatter: reactFormatter(<CellTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        },
        {
            title: "Contact Person", field: "contactPersonName",
            formatter: reactFormatter(<CellTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        },
        {
            title: "Contact No.", field: "contactPersonMobile", minWidth: 140,
            formatter: reactFormatter(<CellTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        },
        {
            title: "Email Address", field: "contactPersonEmail", minWidth: 140,
            formatter: reactFormatter(<CellTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        },
        {
            title: "Actions", hozAlign: "center", width: 160,
            headerSort: false, formatter: reactFormatter(<ActionColumnElements />)
        }
    ];

    const [tableConfig] = useState({
        paginationMode: 'remote',
        ajaxRequestFunc,
        columns,
        rowHeight: 54,
        selectable: false,
        paginate: true,
        initialSort: [{ column: 'locationName', dir: 'asc' }]
    });

    function formatApiResponse(params, list, totalRecords) {
        const { pagination } = params || {};
        const { pageSize, pageNumber } = pagination || {};
        const tdata = {
            data: list.map(x => {
                return mapLocation(x)
            }),
            total: totalRecords,
            last_page: Math.ceil(totalRecords / (pageSize || 1)) || 1,
            page: pageNumber || 1
        };
        setData(tdata);
        return tdata;
    }

    function ajaxRequestFunc(url, config, params) {
        const { field, dir } = (params.sort || [])[0] || {};
        const _params = {
            pagination: {
                pageSize: params.size,
                pageNumber: params.page
            },
            sort: {
                columnName: field || 'locationName',
                order: dir || 'asc'
            }
        };
        setParams(_params);
        setPayload({ ...DEFAULT_PAYLOAD, ...filterRef.current, ..._params });
        return Promise.resolve(formatApiResponse(params, locations, total));
    }

    function deleteCompanyMaster() {
        deleteCompanyLocation(companyLocation.id);
    }
    function onFilterChange(e) {
        console.log(e)
        setFilters(e);
    }

    function handlePageNav(_pagination) {
        const _params = { ...params };
        _params.pagination = _pagination;
        setParams({ ..._params });
        setPayload({ ...payload, ..._params })
    }
    useEffect(() => {
        if (query && (query.parentCompany || query.associateCompany)) {
            setParentCompany({ value: query.parentCompany });
            setAssociateCompany({ value: query.associateCompany });
        }
    }, [query]);

    useEffect(() => {
        if (filters) {
            const { filters: _filters, search } = filters;
            const _associateCompanyId = (_filters.find(x => x.columnName === 'associateCompanyId') || {}).value;
            const _parentCompanyId = (_filters.find(x => x.columnName === 'parentCompanyId') || {}).value;
            if (_parentCompanyId) {
                const _parentCompany = parentCompanies.find(x => x.id === _parentCompanyId);
                setParentCompany({ value: _parentCompany.id, label: _parentCompany.name, code: _parentCompany.code });
                if ((parentCompany || {}).value != _parentCompanyId) {
                    setAssociateCompany(null);
                    setPayload(null);
                    return;
                }
            }
            if (_associateCompanyId) {
                const _associateCompany = associateCompanies.find(x => x.id === _associateCompanyId);
                if (_associateCompany) {
                    setAssociateCompany({ value: _associateCompany.id, label: _associateCompany.name, code: _associateCompany.code });
                    const _x = {
                        filters: [
                            { columnName: 'companyId', value: _associateCompanyId }
                        ],
                        search
                    }
                    setPayload({ ...DEFAULT_PAYLOAD, ...params, ..._x });
                    return;
                }
            }
            setPayload({ ...payload, search });
        }
    }, [filters]);

    useEffect(() => {
        if (!isFetching && payload) {
            setData(formatApiResponse(params, locations));
        }
    }, [isFetching]);

    useEffect(() => {
        if (!fetchingCompanies && parentCompanies) {
            const _parentCompany = (parentCompanies || [])[0] || {};
            setParentCompany({ value: _parentCompany.id, label: _parentCompany.name, code: _parentCompany.code });
        }
    }, [fetchingCompanies]);

    useEffect(() => {
        if (!fetchingAssociateCompanies && associateCompanies) {
            const _associateCompany = (associateCompanies || [])[0];
            if (_associateCompany) {
                setAssociateCompany({ value: _associateCompany.id, label: _associateCompany.name, code: _associateCompany.code });
                const { search } = filterRef.current || { search: '' };
                setFilters({
                    filters: [
                        { columnName: 'parentCompanyId', value: (parentCompany || {}).value },
                        { columnName: 'associateCompanyId', value: _associateCompany.id }
                    ], search
                });
            }
        }
    }, [fetchingAssociateCompanies]);

    return (
        <>
            <MastersLayout title="Location Mapping" breadcrumbs={breadcrumb}>
                <div className="d-flex flex-column mx-0">
                    <div className="card d-flex flex-row justify-content-center m-3 p-3">
                        <div className="col-12">
                            <div className="d-flex justify-content-between align-items-end">
                                <TableFilters filterConfig={filterConfig} search={true} onFilterChange={onFilterChange}
                                    placeholder={"Search for Location Code/Name/Contact"} />
                                <div className="d-flex">
                                    <Button variant="primary" className="px-3 ms-auto text-nowrap" onClick={() => setAction(ACTIONS.IMPORT)} disabled={!Boolean(associateCompany)}>
                                        <Icon name={'upload'} className={`me-2 ${styles.importBtn}`}></Icon>Import
                                    </Button>
                                    <Button variant="primary" className="px-3 ms-3 text-nowrap" onClick={() => setAction(ACTIONS.ADD)} disabled={!Boolean(associateCompany)}>
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
                <CompanyLocationDetails action={action} parentCompany={parentCompany} associateCompany={associateCompany}
                    data={companyLocation}
                    onClose={() => setAction(ACTIONS.NONE)} onSubmit={submitCallback} />
            }
            {
                action === ACTIONS.DELETE &&
                <ConfirmModal title={'Delete Company Location'} onSubmit={deleteCompanyMaster} onClose={() => setAction(ACTIONS.NONE)}>
                    <div className="text-center mb-4">Are you sure you want to delete the Company Location, <strong>{(companyLocation || {}).locationName}</strong> ?</div>
                </ConfirmModal>
            }
            {
                action === ACTIONS.IMPORT &&
                <CompanyLocationsImportModal company={parentCompany} associateCompany={associateCompany}
                    onSubmit={refetch}
                    onClose={() => setAction(ACTIONS.NONE)} />
            }
            {deleting && <PageLoader message={'Deleting Location...'} />}
        </>
    )
}

export default CompanyLocationMappings;