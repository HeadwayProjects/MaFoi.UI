import React, { useEffect, useState } from "react";
import MastersLayout from "./MastersLayout";
import { Button } from "react-bootstrap";
import Icon from "../../common/Icon";
import Table, { CellTmpl, DEFAULT_PAYLOAD, TitleTmpl, reactFormatter } from "../../common/Table";
import { ACTIONS } from "../../common/Constants";
import ConfirmModal from "../../common/ConfirmModal";
import RuleDetails from "./RuleDetails";
import { useDeleteRule, useGetRules } from "../../../backend/masters";
import { GetMastersBreadcrumb, RuleType } from "./Master.constants";
import { toast } from "react-toastify";
import { ERROR_MESSAGES } from "../../../utils/constants";
import PageLoader from "../../shared/PageLoader";
import { useRef } from "react";
import TableFilters from "../../common/TableFilter";
import { downloadFileContent } from "../../../utils/common";
import { useExportRules } from "../../../backend/exports";

function Rule() {
    const [breadcrumb] = useState(GetMastersBreadcrumb('Rule'));
    const [action, setAction] = useState(ACTIONS.NONE);
    const [rule, setRule] = useState<any>(null);
    const [data, setData] = useState<any>();
    const [params, setParams] = useState<any>();
    const [filters, setFilters] = useState<any>();
    const filterRef: any = useRef();
    filterRef.current = filters;
    const [payload, setPayload] = useState({ ...DEFAULT_PAYLOAD, sort: { columnName: 'name', order: 'asc' } });
    const { rules, total, isFetching, refetch } = useGetRules(payload);
    const { deleteRule, isLoading: deletingRule } = useDeleteRule(() => {
        refetch();
    }, () => toast.error(ERROR_MESSAGES.DEFAULT));
    const { exportRules, exporting } = useExportRules((response: any) => {
        downloadFileContent({
            name: 'Rules.xlsx',
            type: response.headers['content-type'],
            content: response.data
        });
    }, () => {
        toast.error(ERROR_MESSAGES.DEFAULT);
    });

    const filterConfig = [
        {
            label: 'Type',
            name: 'type',
            options: [{ value: "", label: "Blank" }, ...RuleType.map(x => {
                return { value: x, label: x };
            })]
        }
    ]

    function ActionColumnElements({ cell }: any) {
        const row = cell.getData();
        return (
            <div className="d-flex flex-row align-items-center position-relative h-100">
                <Icon className="mx-2" type="button" name={'pencil'} text={'Edit'} data={row} action={() => {
                    setRule(row);
                    setAction(ACTIONS.EDIT)
                }} />
                <Icon className="mx-2" type="button" name={'trash'} text={'Delete'} data={row} action={() => {
                    setRule(row);
                    setAction(ACTIONS.DELETE)
                }} />
                <Icon className="mx-2" type="button" name={'eye'} text={'View'} data={row} action={() => {
                    setRule(row);
                    setAction(ACTIONS.VIEW)
                }} />
            </div>
        )
    }

    const columns = [
        {
            title: "Name", field: "name", widthGrow: 2,
            formatter: reactFormatter(<CellTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        },
        {
            title: "Description", field: "description", widthGrow: 2,
            formatter: reactFormatter(<CellTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        },
        {
            title: "Type", field: "type", width: 140,
            formatter: reactFormatter(<CellTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        },
        {
            title: "Section No.", field: "sectionNo", minWidth: 140,
            formatter: reactFormatter(<CellTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        },
        {
            title: "Rule No.", field: "ruleNo", minWidth: 140,
            formatter: reactFormatter(<CellTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        },
        {
            title: "Actions", hozAlign: "center", width: 140,
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
        return Promise.resolve(formatApiResponse(params, rules, total));
    }

    function deleteRuleMaster() {
        deleteRule(rule.id);
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
        exportRules({ ...payload, pagination: null });
    }

    useEffect(() => {
        if (!isFetching && payload) {
            setData(formatApiResponse(params, rules, total));
        }
    }, [isFetching]);

    return (
        <>
            <MastersLayout title="Masters - Rule" breadcrumbs={breadcrumb}>
                <div className="d-flex flex-column mx-0">
                    <div className="card shadow d-flex flex-row justify-content-center m-3 p-3">
                        <div className="col-12">
                            <div className="d-flex justify-content-between align-items-end">
                                <TableFilters filterConfig={filterConfig} search={true} onFilterChange={onFilterChange}
                                    placeholder={"Search for Rule/Description"} />
                                <div className="d-flex">
                                    <Button variant="primary" className="px-3 text-nowrap" onClick={handleExport}>
                                        <Icon name={'download'} className="me-2"></Icon>Export
                                    </Button>
                                    <Button variant="primary" className="px-3 ms-3 text-nowrap" onClick={() => setAction(ACTIONS.ADD)}>
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
                <RuleDetails action={action} data={action !== ACTIONS.ADD ? rule : null}
                    onClose={() => setAction(ACTIONS.NONE)} onSubmit={() => {
                        setAction(ACTIONS.NONE);
                        refetch();
                    }} />
            }
            {
                action === ACTIONS.DELETE &&
                <ConfirmModal title={'Delete Rule Master'} onSubmit={deleteRuleMaster} onClose={() => setAction(ACTIONS.NONE)}>
                    <div className="text-center mb-4">Are you sure you want to delete the rule <strong>{(rule || {}).name}</strong> ?</div>
                </ConfirmModal>
            }
            {deletingRule && <PageLoader message={'Deleting Rule. Please wait...'} />}
            {
                exporting && <PageLoader>Preparing Data...</PageLoader>
            }
        </>
    )
}

export default Rule;