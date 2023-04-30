import React, { useEffect, useState } from "react";
import MastersLayout from "./MastersLayout";
import { Button, InputGroup } from "react-bootstrap";
import Icon from "../../common/Icon";
import Table, { CellTmpl, reactFormatter } from "../../common/Table";
import { ACTIONS } from "../../common/Constants";
import LawDetails from "./LawDetails";
import ConfirmModal from "../../common/ConfirmModal";
import { useDeleteLaw, useGetActivities, useGetLaws } from "../../../backend/masters";
import { GetMastersBreadcrumb } from "./Master.constants";
import { toast } from "react-toastify";
import { ERROR_MESSAGES } from "../../../utils/constants";
import PageLoader from "../../shared/PageLoader";

function Law() {
    const [breadcrumb] = useState(GetMastersBreadcrumb('Law'));
    const [search, setSearch] = useState(null);
    const [action, setAction] = useState(ACTIONS.NONE);
    const [law, setLaw] = useState(null);
    const [data, setData] = useState();
    const [params, setParams] = useState();
    const [payload, setPayload] = useState();
    const { laws, isFetching, refetch } = useGetLaws();
    const { deleteLaw, deleting } = useDeleteLaw(() => {
        submitCallback();
    }, () => {
        toast.error(ERROR_MESSAGES.DEFAULT);
    });

    function ActionColumnElements({ cell }) {
        const row = cell.getData();

        return (
            <div className="d-flex flex-row align-items-center position-relative h-100">
                <Icon className="mx-2" type="button" name={'pencil'} text={'Edit'} data={row} action={(event) => {
                    setLaw(row);
                    setAction(ACTIONS.EDIT)
                }} />
                <Icon className="mx-2" type="button" name={'trash'} text={'Delete'} data={row} action={(event) => {
                    setLaw(row);
                    setAction(ACTIONS.DELETE)
                }} />
            </div>
        )
    }

    const columns = [
        { title: "Name", field: "name", formatter: reactFormatter(<CellTmpl />) },
        { title: "Description", field: "description", widthGrow: 2, formatter: reactFormatter(<CellTmpl />) },
        {
            title: "", hozAlign: "center", width: 140,
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
        return Promise.resolve(formatApiResponse(params, laws));
    }

    function submitCallback() {
        setAction(ACTIONS.NONE);
        setLaw(null);
        refetch();
    }

    function handleDelete() {
        deleteLaw(law.id);
    }

    useEffect(() => {
        if (!isFetching && payload) {
            setData(formatApiResponse(params, laws));
        }
    }, [isFetching]);

    return (
        <>
            <MastersLayout title="Masters - Law" breadcrumbs={breadcrumb}>
                <div className="d-flex flex-column mx-0 mt-4">
                    <div className="d-flex flex-row justify-content-center mb-4">
                        <div className="col-6">
                            <div className="d-flex">
                                <InputGroup>
                                    <input type="text" className="form-control" placeholder="Search for Law / Code / Name" />
                                    <InputGroup.Text style={{ backgroundColor: 'var(--blue)' }}>
                                        <div className="d-flex flex-row align-items-center text-white">
                                            <Icon name={'search'} />
                                            <span className="ms-2">Search</span>
                                        </div>
                                    </InputGroup.Text>
                                </InputGroup>
                                <Button variant="primary" className="px-4 ms-4 text-nowrap" onClick={() => setAction(ACTIONS.ADD)}>Add New Law</Button>
                            </div>
                        </div>
                    </div>
                    <Table data={data} options={tableConfig} isLoading={isFetching} />
                </div>
            </MastersLayout>
            {
                [ACTIONS.ADD, ACTIONS.EDIT, ACTIONS.VIEW].includes(action) &&
                <LawDetails action={action} data={action !== ACTIONS.ADD ? law : null}
                    onClose={() => setAction(ACTIONS.NONE)} onSubmit={submitCallback} />
            }
            {
                action === ACTIONS.DELETE &&
                <ConfirmModal title={'Delete Law Master'} onSubmit={handleDelete} onClose={() => setAction(ACTIONS.NONE)}>
                    <div className="text-center mb-4">Are you sure you want to delete the Law <strong>{(law || {}).name}</strong> ?</div>
                </ConfirmModal>
            }
            {
                deleting && <PageLoader>Deleting Law...</PageLoader>
            }
        </>
    )
}

export default Law;