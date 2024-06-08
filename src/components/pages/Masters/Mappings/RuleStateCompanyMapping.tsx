import React, { useEffect, useState, useRef } from "react";
import { ActivityType, GetMastersBreadcrumb } from "../Master.constants";
import { useDeleteActStateMapping, useGetStates, useGetRuleMappings } from "../../../../backend/masters";
import { toast } from "react-toastify";
import { ERROR_MESSAGES } from "../../../../utils/constants";
import Icon from "../../../common/Icon";
import { ACTIONS, TOOLTIP_DELAY } from "../../../common/Constants";
import Table, { CellTmpl, DEFAULT_OPTIONS_PAYLOAD, DEFAULT_PAYLOAD, NameTmpl, reactFormatter } from "../../../common/Table";
import MastersLayout from "../MastersLayout";
import { Button, Dropdown, DropdownButton, OverlayTrigger, Tooltip } from "react-bootstrap";
import ConfirmModal from "../../../common/ConfirmModal";
import PageLoader from "../../../shared/PageLoader";
import RuleStateCompanyMappingDetails from "./RuleStateCompanyMappingDetails";
import TableFilters from "../../../common/TableFilter";
import { download, downloadFileContent } from "../../../../utils/common";
import { useExportActStateMappings } from "../../../../backend/exports";
import { hasUserAccess } from "../../../../backend/auth";
import { USER_PRIVILEGES } from "../../UserManagement/Roles/RoleConfiguration";
import ImportMappingsModal from "./ImportMappingsModal";

export enum Steps {
    MAPPING = 1,
    RULE_COMPLIANCE = 2,
    DOCUMENTS = 3,
    ALL = -1
}

function RuleStateCompanyMapping() {
    const [breadcrumb] = useState(GetMastersBreadcrumb('Mapping'));
    const [action, setAction] = useState(ACTIONS.NONE);
    const [mapping, setMapping] = useState<any>(null);
    const [data, setData] = useState<any>();
    const [params, setParams] = useState<any>();
    const [filters, setFilters] = useState<any>();
    const filterRef: any = useRef();
    filterRef.current = filters;
    const [payload, setPayload] = useState<any>({ ...DEFAULT_PAYLOAD, sort: { columnName: 'state', order: 'asc' } });
    const { mappings, total, isFetching, refetch } = useGetRuleMappings({ ...payload }, Boolean(payload));
    const { states } = useGetStates({ ...DEFAULT_OPTIONS_PAYLOAD, includeCentral: true });
    const { deleteActStateMapping, deleting } = useDeleteActStateMapping(() => {
        toast.success(`Mapping deleted successfully.`);
        submitCallback();
    }, () => {
        toast.error(ERROR_MESSAGES.DEFAULT);
    });
    const { exportActStateMappings, exporting } = useExportActStateMappings((response: any) => {
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
            options: (states || []).map((x: any) => {
                return { value: x.id, label: x.name };
            })
        },
        {
            label: 'Type',
            name: 'type',
            options: (ActivityType || []).map((x: any) => {
                return { value: x, label: x };
            })
        }
    ];

    function ActionColumnElements({ cell }: any) {
        const row = cell.getData();

        return (
            <div className="d-flex flex-row align-items-center position-relative h-100 gap-3">
                {
                    hasUserAccess(USER_PRIVILEGES.EDIT_MAPPING) &&
                    <Icon type="button" name={'pencil'} text={'Edit'} data={row} action={() => {
                        setMapping(row);
                        setAction(ACTIONS.EDIT)
                    }} />
                }
                {
                    hasUserAccess(USER_PRIVILEGES.DELETE_MAPPING) &&
                    <Icon type="button" name={'trash'} text={'Delete'} data={row} action={() => {
                        setMapping(row);
                        setAction(ACTIONS.DELETE)
                    }} />
                }
                <Icon type="button" name={'eye'} text={'View'} data={row} action={() => {
                    setMapping(row);
                    setAction(ACTIONS.VIEW)
                }} />
                {
                    row.fileName && row.filePath &&
                    <Icon type="button" name={'download'} text={'View'} data={row} action={() => {
                        download(row.fileName, row.filePath)
                    }} />
                }
            </div>
        )
    }

    function TypeTmpl({ cell }: any) {
        const value = ((cell.getData() || {}).activity || {}).type;
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

    function RuleTmpl({ cell }: any) {
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
        { title: "State", field: "state", formatter: reactFormatter(<NameTmpl />), headerSort: true },
        { title: "Establishment Type", field: "establishmentType", formatter: reactFormatter(<NameTmpl />) },
        { title: "Act", field: "act", formatter: reactFormatter(<NameTmpl />) },
        { title: "Rule", field: "rule", formatter: reactFormatter(<RuleTmpl />) },
        { title: "Activity", field: "activity", formatter: reactFormatter(<NameTmpl />) },
        { title: "Type", field: "type", formatter: reactFormatter(<TypeTmpl />) },
        { title: "Risk", field: "ruleComplianceDetails.risk", formatter: reactFormatter(<CellTmpl />), width: 90 },
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
        initialSort: [{ column: 'state', dir: 'asc' }]
    });

    function formatApiResponse(params: any, list: any[], totalRecords: number) {
        const { pagination } = params || {};
        const { pageSize, pageNumber } = pagination || {};

        list = list.map(map => {
            const { id, state, actRuleActivityMapping, fileName, filePath, formName, ruleComplianceDetailId, ruleComplianceDetails } = map || {};
            const { act, rule, activity } = actRuleActivityMapping || {};
            const { establishmentType } = act || {};
            return { id, establishmentType:{name:establishmentType}, act, rule, activity, state, fileName, filePath, formName, ruleComplianceDetailId, ruleComplianceDetails }
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
    function ajaxRequestFunc(url: any, config: any, params: any) {
        const { field, dir } = (params.sort || [])[0] || {};
        const _params = {
            pagination: {
                pageSize: params.size,
                pageNumber: params.page
            },
            sort: {
                columnName: field || 'state',
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

    function handleCancel() {
        setAction(ACTIONS.NONE);
        setMapping(null);
    }

    function handleDelete() {
        deleteActStateMapping(mapping.id);
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
                                {
                                    (hasUserAccess(USER_PRIVILEGES.ADD_MAPPING) || hasUserAccess(USER_PRIVILEGES.EXPORT_MAPPING) || hasUserAccess(USER_PRIVILEGES.ADD_MAPPING)) &&
                                    <DropdownButton title="Actions" variant="primary">
                                        {
                                            hasUserAccess(USER_PRIVILEGES.ADD_MAPPING) &&
                                            <Dropdown.Item onClick={() => setAction(ACTIONS.ADD)} className="my-1">
                                                <Icon name={'plus'} className="me-2"></Icon>Add New
                                            </Dropdown.Item>
                                        }
                                        {
                                            hasUserAccess(USER_PRIVILEGES.EXPORT_MAPPING) &&
                                            <Dropdown.Item onClick={handleExport} className="my-1" >
                                                <Icon name={'download'} className="me-2"></Icon>Export
                                            </Dropdown.Item>
                                        }
                                        {
                                            hasUserAccess(USER_PRIVILEGES.ADD_MAPPING) &&
                                            <Dropdown.Item onClick={() => setAction(ACTIONS.IMPORT)} className="my-1" >
                                                <Icon name={'upload'} className="me-2"></Icon>Import
                                            </Dropdown.Item>
                                        }
                                    </DropdownButton>
                                }
                            </div>
                        </div>
                    </div>
                    <Table data={data} options={tableConfig} isLoading={isFetching} onPageNav={handlePageNav} />
                </div>
            </MastersLayout>
            {
                [ACTIONS.ADD, ACTIONS.EDIT, ACTIONS.VIEW].includes(action) && (action !== ACTIONS.ADD ? Boolean(mapping) : true) &&
                <RuleStateCompanyMappingDetails action={action} data={action !== ACTIONS.ADD ? mapping : null}
                    onClose={handleCancel} onSubmit={submitCallback}
                    step={action === ACTIONS.ADD ? Steps.MAPPING : (action === ACTIONS.EDIT ? Steps.RULE_COMPLIANCE : Steps.ALL)} />
            }
            {
                action === ACTIONS.DELETE &&
                <ConfirmModal title={'Delete Act-State-Company Mapping'} onSubmit={handleDelete} onClose={handleCancel}>
                    <div className="text-center mb-4">Are you sure you want to delete the mapping ?</div>
                </ConfirmModal>
            }
            {
                action === ACTIONS.IMPORT &&
                <ImportMappingsModal onSubmit={submitCallback} onClose={handleCancel} />
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