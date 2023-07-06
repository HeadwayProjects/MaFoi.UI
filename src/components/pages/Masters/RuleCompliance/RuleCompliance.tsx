import React, { useEffect, useState } from "react";
import MastersLayout from "../MastersLayout";
import { Button } from "react-bootstrap";
import { ActivityType, AuditType, GetMastersBreadcrumb } from "../Master.constants"
import { ACTIONS } from "../../../common/Constants";
import { useDeleteRuleCompliance, useGetRuleCompliances, useGetStates } from "../../../../backend/masters";
import Icon from "../../../common/Icon";
import Table, { CellTmpl, DEFAULT_OPTIONS_PAYLOAD, DEFAULT_PAYLOAD, TitleTmpl, reactFormatter } from "../../../common/Table";
import ConfirmModal from "../../../common/ConfirmModal";
import RuleComplianceDetails from "./RuleComplianceDetails";
import { toast } from "react-toastify";
import { ERROR_MESSAGES } from "../../../../utils/constants";
import PageLoader from "../../../shared/PageLoader";
import { useRef } from "react";
import TableFilters from "../../../common/TableFilter";
import { useExportRuleCompliance } from "../../../../backend/exports";
import { downloadFileContent } from "../../../../utils/common";

const SortFields: any = {
    'state.name': 'state',
    'rule.name': 'rule',
    'rule.sectionNo': 'sectionNo',
    'rule.ruleNo': 'ruleNo'
};

function RuleCompliance() {
    const [breadcrumb] = useState(GetMastersBreadcrumb('Rule Compliance'));
    const [action, setAction] = useState(ACTIONS.NONE);
    const [compliance, setCompliance] = useState<any>(null);
    const [data, setData] = useState<any>();
    const [params, setParams] = useState<any>();
    const [filters, setFilters] = useState<any>();
    const filterRef: any = useRef();
    filterRef.current = filters;
    const [payload, setPayload] = useState<any>({ ...DEFAULT_PAYLOAD, sort: { columnName: 'complianceName', order: 'asc' } });
    const { ruleCompliances, total, isFetching, refetch } = useGetRuleCompliances(payload);
    const { states } = useGetStates({ ...DEFAULT_OPTIONS_PAYLOAD });
    const { deleteRuleCompliance, deleting } = useDeleteRuleCompliance(() => {
        toast.success(`${compliance.complianceName} deleted successfully.`);
        submitCallback();
    }, () => {
        toast.error(ERROR_MESSAGES.DEFAULT);
    });
    const { exportRuleCompliance } = useExportRuleCompliance((response: any) => {
        downloadFileContent({
            name: 'Rule_Compliance.xlsx',
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
        },
        {
            label: 'Compliance Nature',
            name: 'complianceNature',
            options: ActivityType.map(x => {
                return { value: x, label: x };
            })
        },
        {
            label: 'Audit Type',
            name: 'auditType',
            options: AuditType.map(x => {
                return { value: x, label: x };
            })
        }
    ]

    function ActionColumnElements({ cell }: any) {
        const row = cell.getData();

        return (
            <div className="d-flex flex-row align-items-center position-relative h-100">
                <Icon className="mx-2" type="button" name={'pencil'} text={'Edit'} data={row} action={() => {
                    setCompliance(row);
                    setAction(ACTIONS.EDIT)
                }} />
                <Icon className="mx-2" type="button" name={'trash'} text={'Delete'} data={row} action={() => {
                    setCompliance(row);
                    setAction(ACTIONS.DELETE)
                }} />
                <Icon className="mx-2" type="button" name={'eye'} text={'View'} data={row} action={() => {
                    setCompliance(row);
                    setAction(ACTIONS.VIEW)
                }} />
            </div>
        )
    }

    const columns = [
        {
            title: "Name", field: "complianceName",
            formatter: reactFormatter(<CellTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        },
        {
            title: "Description", field: "complianceDescription", widthGrow: 2,
            formatter: reactFormatter(<CellTmpl />), titleFormatter: reactFormatter(<TitleTmpl />)
        },
        {
            title: "State", field: "state.name",
            formatter: reactFormatter(<CellTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        },
        {
            title: "Rule", field: "rule.name",
            formatter: reactFormatter(<CellTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        },
        {
            title: "Section", field: "rule.sectionNo",
            formatter: reactFormatter(<CellTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        },
        {
            title: "Rule No", field: "rule.ruleNo",
            formatter: reactFormatter(<CellTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        },
        {
            title: "Compliance Nature", field: "complianceNature",
            formatter: reactFormatter(<CellTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        },
        {
            title: "Type", field: "auditType",
            formatter: reactFormatter(<CellTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        },
        {
            title: "Actions", hozAlign: "center", width: 120,
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
        initialSort: [{ column: 'complianceName', dir: 'asc' }]
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
                columnName: SortFields[field] || field || 'complianceName',
                order: dir || 'asc'
            }
        };
        setParams(_params);
        setPayload({ ...DEFAULT_PAYLOAD, ...filterRef.current, ..._params });
        return Promise.resolve(formatApiResponse(params, ruleCompliances, total));
    }

    function submitCallback() {
        setAction(ACTIONS.NONE);
        setCompliance(null);
        refetch();
    }

    function handleDelete() {
        deleteRuleCompliance(compliance.id);
    }

    function handleExport() {
        exportRuleCompliance({ ...payload, pagination: null });
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
            setTimeout(() => {
                setData(formatApiResponse(params, ruleCompliances, total));
            });
        }
    }, [isFetching]);

    return (
        <>
            <MastersLayout title="Masters - Rule Compliance" breadcrumbs={breadcrumb}>
                <div className="d-flex flex-column mx-0">
                    <div className="card shadow d-flex flex-row justify-content-center m-3 p-3">
                        <div className="col-12">
                            <div className="d-flex justify-content-between align-items-end">
                                <TableFilters filterConfig={filterConfig} search={true} onFilterChange={onFilterChange}
                                    placeholder={"Search for Name/Description/Rule"} />
                                <div className="d-flex">
                                    <Button variant="primary" className="px-3 text-nowrap me-3" onClick={handleExport}>
                                        <Icon name={'download'} className="me-2"></Icon>Export
                                    </Button>
                                    <Button variant="primary" className="text-nowrap" onClick={() => setAction(ACTIONS.ADD)}>
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
                <RuleComplianceDetails action={action} data={action !== ACTIONS.ADD ? compliance : null}
                    onClose={() => setAction(ACTIONS.NONE)} onSubmit={submitCallback} />
            }
            {
                action === ACTIONS.DELETE &&
                <ConfirmModal title={'Delete Rule Compliance Master'} onSubmit={handleDelete} onClose={() => setAction(ACTIONS.NONE)}>
                    <div className="text-center mb-4">Are you sure you want to delete the Rule Compliance, <strong>{(compliance || {}).complianceName}</strong> ?</div>
                </ConfirmModal>
            }
            {
                deleting && <PageLoader>Deleting Rule Complaince...</PageLoader>
            }
        </>
    )
}

export default RuleCompliance;