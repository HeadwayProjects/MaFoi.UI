import React, { useEffect, useState, useRef } from "react";
import { ActivityType, GetMastersBreadcrumb } from "../Master.constants";
import { useDeleteActStateMapping, useGetStates, useStateRuleCompanyMappings } from "../../../../backend/masters";
import { toast } from "react-toastify";
import { ERROR_MESSAGES } from "../../../../utils/constants";
import Icon from "../../../common/Icon";
import { ACTIONS, TOOLTIP_DELAY } from "../../../common/Constants";
import Table, { CellTmpl, DEFAULT_OPTIONS_PAYLOAD, DEFAULT_PAYLOAD, NameTmpl, reactFormatter } from "../../../common/Table";
import MastersLayout from "../MastersLayout";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import ConfirmModal from "../../../common/ConfirmModal";
import PageLoader from "../../../shared/PageLoader";
import RuleStateCompanyMappingDetails from "./RuleStateCompanyMappingDetails";
import TableFilters from "../../../common/TableFilter";
import { download, downloadFileContent } from "../../../../utils/common";
import { useExportActStateMappings } from "../../../../backend/exports";

function RuleStateCompanyMapping() {
    const [breadcrumb] = useState(GetMastersBreadcrumb('Mapping'));
    const [action, setAction] = useState(ACTIONS.NONE);
    const [mapping, setMapping] = useState(null);
    const [data, setData] = useState();
    const [params, setParams] = useState();
    const [filters, setFilters] = useState();
    const filterRef = useRef();
    filterRef.current = filters;
    const [payload, setPayload] = useState({ ...DEFAULT_PAYLOAD, sort: { columnName: 'act', order: 'asc' } });
    const { mappings, total, isFetching, refetch } = useStateRuleCompanyMappings({ ...payload }, Boolean(payload));
    const { states } = useGetStates({ ...DEFAULT_OPTIONS_PAYLOAD });
    const { deleteActStateMapping, deleting } = useDeleteActStateMapping(response => {
        toast.success(`Mapping deleted successfully.`);
        submitCallback();
    }, () => {
        toast.error(ERROR_MESSAGES.DEFAULT);
    });
    const { exportActStateMappings, exporting } = useExportActStateMappings((response) => {
        downloadFileContent({
            name: 'Act-Rule-Activity-State-Mapping.xlsx',
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
            options: (states || []).map(x => {
                return { value: x.id, label: x.name };
            })
        },
        {
            label: 'Type',
            name: 'type',
            options: (ActivityType || []).map(x => {
                return { value: x, label: x };
            })
        }
    ]

    function ActionColumnElements({ cell }) {
        const row = cell.getData();

        return (
            <div className="d-flex flex-row align-items-center position-relative h-100">
                <Icon className="mx-2" type="button" name={'pencil'} text={'Edit'} data={row} action={(event) => {
                    setMapping(row);
                    setAction(ACTIONS.EDIT)
                }} />
                <Icon className="mx-2" type="button" name={'trash'} text={'Delete'} data={row} action={(event) => {
                    setMapping(row);
                    setAction(ACTIONS.DELETE)
                }} />
                <Icon className="mx-2" type="button" name={'eye'} text={'View'} data={row} action={(event) => {
                    setMapping(row);
                    setAction(ACTIONS.VIEW)
                }} />
                {
                    row.fileName && row.filePath &&
                    <Icon className="mx-2" type="button" name={'download'} text={'View'} data={row} action={() => {
                        download(row.fileName, row.filePath)
                    }} />
                }
            </div>
        )
    }

    function TypeTmpl({ cell }) {
        const value = ((cell.getData() || {}).activity || {}).type;
        return (
            <>
                {
                    !!value &&
                    <div className="d-flex align-items-center h-100 w-auto">
                        <OverlayTrigger overlay={<Tooltip>{value}</Tooltip>} rootClose={true}
                            placement="bottom" delay={{ show: TOOLTIP_DELAY }}>
                            <div className="ellipse two-lines">{value}</div>
                        </OverlayTrigger>
                    </div>
                }
            </>
        )
    }

    function RuleTmpl({ cell }) {
        const rule = cell.getValue();
        return (
            <div className="d-flex flex-column h-100 justify-content-center">
                <div className="ellipse">{rule.name}</div>
                {
                    (rule.sectionNo || rule.ruleNo) &&
                    <div className="d-flex flex-row align-items-center" style={{ gap: '5px' }}>
                        {
                            rule.sectionNo &&
                            <span className="fst-italic text-sm fw-bold">Section No. {rule.sectionNo}</span>
                        }
                        {
                            rule.ruleNo &&
                            <span className="fst-italic text-sm fw-bold">Rule No. {rule.ruleNo}</span>
                        }
                    </div>
                }
            </div>
        )
    }

    const columns = [
        { title: "Act", field: "act", formatter: reactFormatter(<NameTmpl />) },
        { title: "Rule", field: "rule", widthGrow: 2, formatter: reactFormatter(<RuleTmpl />) },
        { title: "Activity", field: "activity", formatter: reactFormatter(<NameTmpl />) },
        { title: "State", field: "state", formatter: reactFormatter(<NameTmpl />), headerSort: true },
        { title: "Type", field: "type", formatter: reactFormatter(<TypeTmpl />) },
        { title: "Form Name", field: "formName", formatter: reactFormatter(<CellTmpl />) },
        {
            title: "Actions", hozAlign: "center", width: 160,
            headerSort: false, formatter: reactFormatter(<ActionColumnElements />)
        }
    ]

    const [tableConfig] = useState({
        paginationMode: 'remote',
        ajaxRequestFunc,
        columns,
        rowHeight: 54,
        selectable: false, paginate: true,
        initialSort: [{ column: 'act', dir: 'asc' }]
    });

    function formatApiResponse(params, list, totalRecords) {
        const { pagination } = params || {};
        const { pageSize, pageNumber } = pagination || {};

        list = list.map(map => {
            const { id, state, actRuleActivityMapping, fileName, filePath, formName } = map || {};
            const { act, rule, activity } = actRuleActivityMapping || {};
            return { id, act, rule, activity, state, fileName, filePath, formName }
        });
        const tdata = {
            data: list,
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
                columnName: field || 'act',
                order: dir || 'asc'
            }
        };
        setParams(_params);
        setPayload({ ...DEFAULT_PAYLOAD, ...filterRef.current, ..._params });
        return Promise.resolve(formatApiResponse(params, mappings, total));
    }

    function submitCallback() {
        setAction(ACTIONS.NONE);
        setMapping(null);
        refetch();
    }

    function handleDelete() {
        deleteActStateMapping(mapping.id);
    }

    function onFilterChange(e) {
        setFilters(e);
        setPayload({ ...DEFAULT_PAYLOAD, ...params, ...e });
    }

    function handlePageNav(_pagination) {
        const _params = { ...params };
        _params.pagination = _pagination;
        setParams({ ..._params });
        setPayload({ ...payload, ..._params })
    }

    function handleExport() {
        exportActStateMappings({
            ...payload,
            pagination: null
        });
    }


    useEffect(() => {
        if (!isFetching && payload) {
            setTimeout(() => {
                setData(formatApiResponse(params, mappings, total));
            });
        }
    }, [isFetching]);

    return (
        <>
            <MastersLayout title="Masters - Mapping" breadcrumbs={breadcrumb}>
                <div className="d-flex flex-column mx-0">
                    <div className="card shadow d-flex flex-row justify-content-center m-3 p-3">
                        <div className="col-12">
                            <div className="d-flex justify-content-between align-items-end">
                                <TableFilters filterConfig={filterConfig} search={true} onFilterChange={onFilterChange}
                                    placeholder={"Search for Act/Rule/Activity"} />
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
                <RuleStateCompanyMappingDetails action={action} data={action !== ACTIONS.ADD ? mapping : null}
                    onClose={() => setAction(ACTIONS.NONE)} onSubmit={submitCallback} />
            }
            {
                action === ACTIONS.DELETE &&
                <ConfirmModal title={'Delete Act-State-Company Mapping'} onSubmit={handleDelete} onClose={() => setAction(ACTIONS.NONE)}>
                    <div className="text-center mb-4">Are you sure you want to delete the mapping ?</div>
                </ConfirmModal>
            }
            {
                deleting && <PageLoader>Deleting...</PageLoader>
            }
            {
                exporting && <PageLoader />
            }
        </>
    )
}

export default RuleStateCompanyMapping;