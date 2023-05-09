import React, { useEffect, useState } from "react";
import { GetMastersBreadcrumb } from "../Master.constants";
import { useDeleteStateRuleCompanyMapping, useStateRuleCompanyMappings } from "../../../../backend/masters";
import { toast } from "react-toastify";
import { ERROR_MESSAGES } from "../../../../utils/constants";
import Icon from "../../../common/Icon";
import { ACTIONS } from "../../../common/Constants";
import Table, { CellTmpl, reactFormatter } from "../../../common/Table";
import MastersLayout from "../MastersLayout";
import { Button, InputGroup } from "react-bootstrap";
import ConfirmModal from "../../../common/ConfirmModal";
import PageLoader from "../../../shared/PageLoader";
import RuleStateCompanyMappingDetails from "./RuleStateCompanyMappingDetails";

function RuleStateCompanyMapping() {
    const [breadcrumb] = useState(GetMastersBreadcrumb('Mapping'));
    const [search, setSearch] = useState(null);
    const [action, setAction] = useState(ACTIONS.NONE);
    const [mapping, setMapping] = useState(null);
    const [data, setData] = useState();
    const [params, setParams] = useState();
    const [payload, setPayload] = useState();
    const { mappings, isFetching, refetch } = useStateRuleCompanyMappings();
    const { deleteStateRuleCompanyMapping, deleting } = useDeleteStateRuleCompanyMapping(() => {
        toast.success(`Mapping deleted successfully.`);
        submitCallback();
    }, () => {
        toast.error(ERROR_MESSAGES.DEFAULT);
    });

    function ActionColumnElements({ cell }) {
        const row = cell.getData();

        return (
            <div className="d-flex flex-row align-items-center position-relative h-100">
                {/* <Icon className="mx-2" type="button" name={'trash'} text={'Delete'} data={row} action={(event) => {
                    setMapping(row);
                    setAction(ACTIONS.DELETE)
                }} /> */}
                <Icon className="mx-2" type="button" name={'eye'} text={'View'} data={row} action={(event) => {
                    setMapping(row);
                    setAction(ACTIONS.VIEW)
                }} />
            </div>
        )
    }

    function RuleTmpl({ cell }) {
        const rule = cell.getValue();
        return (
            <div className="d-flex flex-column h-100 justify-content-center">
                <div className="ellipse">{rule.name}</div>
                {
                    (rule.sectionNo || rule.ruleNo) &&
                    <div className="d-flex flex-row align-items-center" style={{gap: '5px'}}>
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
        { title: "Act", field: "act.name", formatter: reactFormatter(<CellTmpl />) },
        { title: "Rule", field: "rule", widthGrow: 2, formatter: reactFormatter(<RuleTmpl />) },
        { title: "Activity", field: "activity.name", formatter: reactFormatter(<CellTmpl />) },
        { title: "State", field: "state.name", formatter: reactFormatter(<CellTmpl />) },
        { title: "Company", field: "company.name", formatter: reactFormatter(<CellTmpl />) },
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
        selectable: false
    });

    function formatApiResponse(params, list, pagination = {}) {
        const total = list.length;
        list = list.map(map => {
            const { company } = map;
            const { state, actRuleActivityMapping } = map.actStateMapping || {};
            const { act, rule, activity } = actRuleActivityMapping || {};
            return {
                act, rule, activity, state, company
            }
        });
        const tdata = {
            data: list,
            total,
            last_page: Math.ceil(total / params.size) || 1,
            page: params.page || 1
        };
        setData(tdata);
        return tdata;
    }

    function ajaxRequestFunc(url, config, params) {
        setParams(params);
        setPayload(search ? { ...params, search } : { ...params });
        return Promise.resolve(formatApiResponse(params, mappings));
    }

    function submitCallback() {
        setAction(ACTIONS.NONE);
        setMapping(null);
        refetch();
    }

    function handleDelete() {

    }

    useEffect(() => {
        if (!isFetching && payload) {
            setData(formatApiResponse(params, mappings));
        }
    }, [isFetching]);

    return (
        <>
            <MastersLayout title="Masters - Mapping" breadcrumbs={breadcrumb}>
                <div className="d-flex flex-column mx-0 mt-4">
                    <div className="d-flex flex-row justify-content-center mb-4">
                        <div className="col-12">
                            <div className="d-flex">
                                {/* <InputGroup>
                                    <input type="text" className="form-control" placeholder="Search for Act / State / Acitivty" />
                                    <InputGroup.Text style={{ backgroundColor: 'var(--blue)' }}>
                                        <div className="d-flex flex-row align-items-center text-white">
                                            <Icon name={'search'} />
                                            <span className="ms-2">Search</span>
                                        </div>
                                    </InputGroup.Text>
                                </InputGroup> */}
                                <Button variant="primary" className="px-4 ms-auto me-4 text-nowrap" onClick={() => setAction(ACTIONS.ADD)}>Add New Mapping</Button>
                            </div>
                        </div>
                    </div>
                    <Table data={data} options={tableConfig} isLoading={isFetching} />
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
        </>
    )
}

export default RuleStateCompanyMapping;