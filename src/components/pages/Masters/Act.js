import React, { useEffect, useState } from "react";
import MastersLayout from "./MastersLayout";
import { Button, InputGroup } from "react-bootstrap";
import Icon from "../../common/Icon";
import Table, { CellTmpl, reactFormatter } from "../../common/Table";
import { ACTIONS } from "../../common/Constants";
import ActDetails from "./ActDetails";
import ConfirmModal from "../../common/ConfirmModal";
import { useDeleteAct, useGetActs } from "../../../backend/masters";
import { GetMastersBreadcrumb } from "./Master.constants";
import { toast } from "react-toastify";
import { API_DELIMITER, ERROR_MESSAGES, UI_DELIMITER } from "../../../utils/constants";
import PageLoader from "../../shared/PageLoader";

function Act() {
    const [breadcrumb] = useState(GetMastersBreadcrumb('Act'));
    const [search, setSearch] = useState(null);
    const [action, setAction] = useState(ACTIONS.NONE);
    const [act, setAct] = useState(null);
    const [data, setData] = useState();
    const [params, setParams] = useState();
    const [payload, setPayload] = useState();
    const { acts, isFetching, refetch } = useGetActs();
    const { deleteAct, deleting } = useDeleteAct(() => {
        toast.success(`${act.name} deleted successfully.`);
        submitCallback();
    }, () => {
        toast.error(ERROR_MESSAGES.DEFAULT);
    });

    function TypeTmpl({ cell }) {
        const value = (cell.getValue() || '').replaceAll(API_DELIMITER, UI_DELIMITER);
        return (
            <div className="d-flex align-items-center h-100 w-auto">
                <div className="ellipse two-lines">{value}</div>
            </div>
        )
    }

    function ActionColumnElements({ cell }) {
        const row = cell.getData();

        return (
            <div className="d-flex flex-row align-items-center position-relative h-100">
                <Icon className="mx-2" type="button" name={'pencil'} text={'Edit'} data={row} action={(event) => {
                    setAct(row);
                    setAction(ACTIONS.EDIT)
                }} />
                <Icon className="mx-2" type="button" name={'trash'} text={'Delete'} data={row} action={(event) => {
                    setAct(row);
                    setAction(ACTIONS.DELETE)
                }} />
                <Icon className="mx-2" type="button" name={'eye'} text={'View'} data={row} action={(event) => {
                    setAct(row);
                    setAction(ACTIONS.VIEW)
                }} />
            </div>
        )
    }

    const columns = [
        { title: "Act Name", field: "name", widthGrow: 2, formatter: reactFormatter(<CellTmpl />) },
        { title: "Establishment Type", field: "establishmentType", formatter: reactFormatter(<TypeTmpl />) },
        { title: "Law", field: "law.name", formatter: reactFormatter(<CellTmpl />) },
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
        return Promise.resolve(formatApiResponse(params, acts));
    }

    function submitCallback() {
        setAction(ACTIONS.NONE);
        setAct(null);
        refetch();
    }

    useEffect(() => {
        if (!isFetching && payload) {
            setData(formatApiResponse(params, acts));
        }
    }, [isFetching]);

    return (
        <>
            <MastersLayout title="Masters - Act" breadcrumbs={breadcrumb}>
                <div className="d-flex flex-column mx-0 mt-4">
                    <div className="d-flex flex-row justify-content-center mb-4">
                        <div className="col-12 px-4">
                            <div className="d-flex">
                                {/* <InputGroup>
                                    <input type="text" className="form-control" placeholder="Search for Act / Code / Name" />
                                    <InputGroup.Text style={{ backgroundColor: 'var(--blue)' }}>
                                        <div className="d-flex flex-row align-items-center text-white">
                                            <Icon name={'search'} />
                                            <span className="ms-2">Search</span>
                                        </div>
                                    </InputGroup.Text>
                                </InputGroup> */}
                                <Button variant="primary" className="px-4 ms-auto text-nowrap" onClick={() => setAction(ACTIONS.ADD)}>Add New Act</Button>
                            </div>
                        </div>
                    </div>
                    <Table data={data} options={tableConfig} isLoading={isFetching} />
                </div>
            </MastersLayout>
            {
                [ACTIONS.ADD, ACTIONS.EDIT, ACTIONS.VIEW].includes(action) &&
                <ActDetails action={action} data={action !== ACTIONS.ADD ? act : null}
                    onClose={() => setAction(ACTIONS.NONE)} onSubmit={submitCallback} />
            }
            {
                action === ACTIONS.DELETE &&
                <ConfirmModal title={'Delete Act Master'} onSubmit={() => deleteAct(act.id)} onClose={() => setAction(ACTIONS.NONE)}>
                    <div className="text-center mb-4">Are you sure you want to delete the Act, <strong>{(act || {}).name}</strong> ?</div>
                </ConfirmModal>
            }
            {
                deleting && <PageLoader>Deleting Act...</PageLoader>
            }
        </>
    )
}

export default Act;