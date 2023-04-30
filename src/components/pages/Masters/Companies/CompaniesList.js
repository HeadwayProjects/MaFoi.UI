import React, { useEffect, useState } from "react";
import { useDeleteCompany, useGetCompanies } from "../../../../backend/masters";
import { toast } from "react-toastify";
import { ERROR_MESSAGES } from "../../../../utils/constants";
import Icon from "../../../common/Icon";
import { VIEWS } from "./Companies";
import { ACTIONS, TOOLTIP_DELAY } from "../../../common/Constants";
import Table, { CellTmpl, TitleTmpl, reactFormatter } from "../../../common/Table";
import { Button, InputGroup, OverlayTrigger, Tooltip } from "react-bootstrap";
import AddEditCompany from "./AddEditCompany";
import ViewCompany from "./ViewCompany";
import ConfirmModal from "../../../common/ConfirmModal";
import PageLoader from "../../../shared/PageLoader";
import { preventDefault } from "../../../../utils/common";

function CompaniesList({ changeView }) {
    const [search, setSearch] = useState(null);
    const [action, setAction] = useState(ACTIONS.NONE);
    const [company, setCompany] = useState(null);
    const [data, setData] = useState();
    const [params, setParams] = useState();
    const [payload, setPayload] = useState();
    const { companies, isFetching, refetch } = useGetCompanies();
    const { deleteCompany, isLoading: deletingCompany } = useDeleteCompany(() => {
        refetch();
    }, () => toast.error(ERROR_MESSAGES.DEFAULT));

    function ActionColumnElements({ cell }) {
        const row = cell.getData();
        return (
            <div className="d-flex flex-row align-items-center position-relative h-100">
                <Icon className="mx-2" type="button" name={'pencil'} text={'Edit'} data={row} action={(event) => {
                    changeView(VIEWS.EDIT, row);
                }} />
                <Icon className="mx-2" type="button" name={'trash'} text={'Delete'} data={row} action={(event) => {
                    setCompany(row);
                    setAction(ACTIONS.DELETE);
                }} />
                <Icon className="mx-2" type="button" name={'eye'} text={'View'} data={row} action={(event) => {
                    setCompany(row);
                    setAction(ACTIONS.VIEW);
                }} />
                <Icon className="mx-2" type="button" name={'external-link'} text={row.websiteUrl} data={row} action={(event) => {
                    window.open(row.websiteUrl)
                }} />
            </div>
        )
    }

    function NameTmpl({ cell }) {
        const value = cell.getValue();
        const row = cell.getData();
        return (
            <div className="d-flex align-items-center h-100">
                {
                    row.logo &&
                    <img src={row.logo} width={'30px'} height={'30px'} className="me-2 rounded-circle" />
                }
                <OverlayTrigger overlay={<Tooltip>{value}</Tooltip>} placement="bottom" delay={{ show: TOOLTIP_DELAY }}>
                    <div className="d-flex align-items-center h-100">
                        <div className="ellipse two-lines">{value}</div>
                    </div>
                </OverlayTrigger>
            </div>
        )
    }

    function LocationTmpl({ cell }) {
        const row = cell.getData();
        const { location, city, state } = row;
        const tooltip = `${(location || {}).name || 'NA'} - ${(city || {}).name || 'NA'} - ${(state || {}).name || 'NA'}`
        return (
            <OverlayTrigger overlay={<Tooltip>{tooltip}</Tooltip>} placement="bottom" delay={{ show: TOOLTIP_DELAY }}>
                <div className="d-flex align-items-center h-100">
                    {(location || {}).code || 'NA'} - {(city || {}).code || 'NA'} - {(state || {}).code || 'NA'}
                </div>
            </OverlayTrigger>
        )
    }

    function ACTmpl({ cell }) {
        const value = cell.getValue();
        const row = cell.getData();
        return (
            <div className="d-flex align-items-center h-100">
                <a href="/" onClick={(e) => {
                    preventDefault(e);
                    changeView(VIEWS.ASSOCIATE_COMPANIES, row);
                }}>{value || 'Add Associate Company'}</a>
            </div>
        )
    }

    const columns = [
        {
            title: "Name", field: "name", widthGrow: 2,
            formatter: reactFormatter(<NameTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        },
        {
            title: "Location", field: "location",
            formatter: reactFormatter(<LocationTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        },
        {
            title: "Associate Companies", field: "associateCompanies", maxWidth: 200,
            formatter: reactFormatter(<ACTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        },
        {
            title: "Contact No.", field: "contactNumber", minWidth: 140,
            headerSort: false, formatter: reactFormatter(<CellTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        },
        {
            title: "Email Address", field: "email", minWidth: 140,
            headerSort: false, formatter: reactFormatter(<CellTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        },
        {
            title: "", hozAlign: "center", width: 160,
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
        const _ac = {};
        list.forEach(c => {
            if (!c.isParent) {
                if (!_ac[c.parentCompanyId]) {
                    _ac[c.parentCompanyId] = 0;
                }
                _ac[c.parentCompanyId] += 1;
            }
        });
        list = (list || []).filter(company => company.isParent);
        list = list.map(c => {
            return {
                ...c,
                associateCompanies: _ac[c.id] || 0
            }
        });
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
        return Promise.resolve(formatApiResponse(params, companies));
    }

    function deleteCompanyMaster() {
        deleteCompany(company.id);
    }

    useEffect(() => {
        if (!isFetching && payload) {
            setData(formatApiResponse(params, companies));
        }
    }, [isFetching]);

    return (
        <>
            <div className="d-flex flex-column mx-0 mt-4">
                <div className="d-flex flex-row justify-content-center mb-4">
                    <div className="col-6">
                        <div className="d-flex">
                            <InputGroup>
                                <input type="text" className="form-control" placeholder="Search for Company - Code / Name" />
                                <InputGroup.Text style={{ backgroundColor: 'var(--blue)' }}>
                                    <div className="d-flex flex-row align-items-center text-white">
                                        <Icon name={'search'} />
                                        <span className="ms-2">Search</span>
                                    </div>
                                </InputGroup.Text>
                            </InputGroup>
                            <Button variant="primary" className="px-4 ms-4 text-nowrap" onClick={() => setAction(ACTIONS.ADD)}>Add New Company</Button>
                        </div>
                    </div>
                </div>
                <Table data={data} options={tableConfig} isLoading={isFetching} />
            </div>
            {
                [ACTIONS.ADD, ACTIONS.EDIT].includes(action) &&
                <AddEditCompany company={company} action={action} changeView={changeView} />
            }
            {
                action === ACTIONS.VIEW && company &&
                <ViewCompany company={company} onClose={() => {
                    setAction(ACTIONS.NONE);
                    setCompany(null);
                }} />
            }
            {
                action === ACTIONS.DELETE &&
                <ConfirmModal title={'Delete Company Master'} onSubmit={deleteCompanyMaster} onClose={() => setAction(ACTIONS.NONE)}>
                    <div className="text-center mb-4">Are you sure you want to delete the Company, <strong>{(company || {}).name}</strong> ?</div>
                </ConfirmModal>
            }
            {deletingCompany && <PageLoader message={'Deleting Company...'} />}
        </>
    )
}

export default CompaniesList;