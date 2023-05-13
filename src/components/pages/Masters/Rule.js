import React, { useEffect, useState } from "react";
import MastersLayout from "./MastersLayout";
import { Button, InputGroup } from "react-bootstrap";
import Icon from "../../common/Icon";
import Table, { CellTmpl, TitleTmpl, reactFormatter } from "../../common/Table";
import { ACTIONS } from "../../common/Constants";
import ConfirmModal from "../../common/ConfirmModal";
import RuleDetails from "./RuleDetails";
import { useDeleteRule, useGetRules } from "../../../backend/masters";
import { GetMastersBreadcrumb, RuleType } from "./Master.constants";
import { toast } from "react-toastify";
import { ERROR_MESSAGES } from "../../../utils/constants";
import PageLoader from "../../shared/PageLoader";
import { filterData } from "../../../utils/common";
import { useRef } from "react";

function Rule() {
    const [breadcrumb] = useState(GetMastersBreadcrumb('Rule'));
    const searchRef = useRef();
    const [search, setSearch] = useState(null);
    const [action, setAction] = useState(ACTIONS.NONE);
    const [rule, setRule] = useState(null);
    const [data, setData] = useState();
    const [params, setParams] = useState();
    const [payload, setPayload] = useState();
    const { rules, isFetching, refetch } = useGetRules();
    const { deleteRule, isLoading: deletingRule } = useDeleteRule(() => {
        refetch();
    }, () => toast.error(ERROR_MESSAGES.DEFAULT));

    function ActionColumnElements({ cell }) {
        const row = cell.getData();
        return (
            <div className="d-flex flex-row align-items-center position-relative h-100">
                <Icon className="mx-2" type="button" name={'pencil'} text={'Edit'} data={row} action={(event) => {
                    setRule(row);
                    setAction(ACTIONS.EDIT)
                }} />
                <Icon className="mx-2" type="button" name={'trash'} text={'Delete'} data={row} action={(event) => {
                    setRule(row);
                    setAction(ACTIONS.DELETE)
                }} />
                <Icon className="mx-2" type="button" name={'eye'} text={'View'} data={row} action={(event) => {
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
            headerSort: false, formatter: reactFormatter(<CellTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        },
        {
            title: "Rule No.", field: "ruleNo", minWidth: 140,
            headerSort: false, formatter: reactFormatter(<CellTmpl />),
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
        selectable: false
    });

    function formatApiResponse(params, list, pagination = {}) {
        const total = list.length;
        if (searchRef.current.value) {
            list = list.filter(x => filterData(x, searchRef.current.value, ['name', 'type', 'description', 'sectionNo', 'ruleNo']));
        }
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
        return Promise.resolve(formatApiResponse(params, rules));
    }

    function handleSearch() {
        setData(formatApiResponse(params, rules));
    }

    function deleteRuleMaster() {
        deleteRule(rule.id);
    }

    useEffect(() => {
        if (!isFetching && payload) {
            setData(formatApiResponse(params, rules));
        }
    }, [isFetching]);

    return (
        <>
            <MastersLayout title="Masters - Rule" breadcrumbs={breadcrumb}>
                <div className="d-flex flex-column mx-0 mt-4">
                    <div className="d-flex flex-row justify-content-center mb-4">
                        <div className="col-12 px-4">
                            <div className="d-flex justify-content-between">
                                <div className="col-6">
                                    <InputGroup>
                                        <input type="text" ref={searchRef} className="form-control" placeholder="Search for Rule - Code / Name" />
                                        <InputGroup.Text style={{ backgroundColor: 'var(--blue)' }} onClick={handleSearch}>
                                            <div className="d-flex flex-row align-items-center text-white">
                                                <Icon name={'search'} />
                                                <span className="ms-2">Search</span>
                                            </div>
                                        </InputGroup.Text>
                                    </InputGroup>
                                </div>
                                <Button variant="primary" className="px-4 ms-auto text-nowrap" onClick={() => setAction(ACTIONS.ADD)}>Add New Rule</Button>
                            </div>
                        </div>
                    </div>
                    <Table data={data} options={tableConfig} isLoading={isFetching} />
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
        </>
    )
}

export default Rule;