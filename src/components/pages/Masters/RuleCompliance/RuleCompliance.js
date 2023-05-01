import React, { useEffect, useState } from "react";
import MastersLayout from "./../MastersLayout";
import { Button, InputGroup } from "react-bootstrap";
import { GetMastersBreadcrumb } from "./../Master.constants"
import { ACTIONS } from "../../../common/Constants";
import { useDeleteRuleCompliance, useGetRuleCompliances } from "../../../../backend/masters";
import Icon from "../../../common/Icon";
import Table, { CellTmpl, TitleTmpl, reactFormatter } from "../../../common/Table";
import ConfirmModal from "../../../common/ConfirmModal";
import RuleComplianceDetails from "./RuleComplianceDetails";
import { toast } from "react-toastify";
import { ERROR_MESSAGES } from "../../../../utils/constants";
import PageLoader from "../../../shared/PageLoader";

function RuleCompliance() {
    const [breadcrumb] = useState(GetMastersBreadcrumb('Rule Compliance'));
    const [search, setSearch] = useState(null);
    const [action, setAction] = useState(ACTIONS.NONE);
    const [compliance, setCompliance] = useState(null);
    const [data, setData] = useState();
    const [params, setParams] = useState();
    const [payload, setPayload] = useState();
    const { ruleCompliances, isFetching, refetch } = useGetRuleCompliances();
    const { deleteRuleCompliance, deleting } = useDeleteRuleCompliance(() => {
        toast.success(`${compliance.complianceName} deleted successfully.`);
        submitCallback();
    }, () => {
        toast.error(ERROR_MESSAGES.DEFAULT);
    });

    function ActionColumnElements({ cell }) {
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
            title: "Type", field: "statutoryAuthority",
            formatter: reactFormatter(<CellTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        },
        {
            title: "", hozAlign: "center", width: 120,
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
        return Promise.resolve(formatApiResponse(params, ruleCompliances));
    }

    function submitCallback() {
        setAction(ACTIONS.NONE);
        setCompliance(null);
        refetch();
    }

    function handleDelete() {
        deleteRuleCompliance(compliance.id);
    }

    useEffect(() => {
        if (!isFetching && payload) {
            setData(formatApiResponse(params, ruleCompliances));
        }
    }, [isFetching]);

    return (
        <>
            <MastersLayout title="Masters - Rule Compliance" breadcrumbs={breadcrumb}>
                <div className="d-flex flex-column mx-0 mt-4">
                    <div className="d-flex flex-row justify-content-center mb-4">
                        <div className="col-6">
                            <div className="d-flex">
                                <InputGroup>
                                    <input type="text" className="form-control" placeholder="Search for Act / Code / Name" />
                                    <InputGroup.Text style={{ backgroundColor: 'var(--blue)' }}>
                                        <div className="d-flex flex-row align-items-center text-white">
                                            <Icon name={'search'} />
                                            <span className="ms-2">Search</span>
                                        </div>
                                    </InputGroup.Text>
                                </InputGroup>
                                <Button variant="primary" className="px-4 ms-4 text-nowrap" onClick={() => setAction(ACTIONS.ADD)}>Add New Rule Compliance</Button>
                            </div>
                        </div>
                    </div>
                    <Table data={data} options={tableConfig} isLoading={isFetching} />
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