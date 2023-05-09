import React, { useEffect, useState } from "react";
import { useGetCompanies, useGetCompanyLocations } from "../../../../backend/masters";
import Icon from "../../../common/Icon";
import { ACTIONS } from "../../../common/Constants";
import Table, { CellTmpl, TitleTmpl, reactFormatter } from "../../../common/Table";
import { Button } from "react-bootstrap";
import ConfirmModal from "../../../common/ConfirmModal";
import { useQueryParams } from "raviger";
import Select from 'react-select';
import CompanyLocationDetails from "./CompanyLocationMappingDetails";

function mapLocation(x) {
    return {
        id: x.id,
        companyLocationAddress: x.companyLocationAddress,
        locationCode: x.location.code,
        locationName: x.location.name,
        city: x.location.cities,
        state: x.location.cities.state,
        contactPersonName: x.contactPersonName,
        contactPersonMobile: x.contactPersonMobile,
        contactPersonEmail: x.contactPersonEmail,
        address: x.address
    }
};

function CompanyLocationMappings() {
    const [query] = useQueryParams();
    const [action, setAction] = useState(ACTIONS.NONE);
    const [parentCompany, setParentCompany] = useState(null);
    const [associateCompany, setAssociateCompany] = useState(null);
    const [companyLocation, setCompanyLocation] = useState(null);
    const [data, setData] = useState();
    const [params, setParams] = useState();
    const [payload, setPayload] = useState();
    const { companies: parentCompanies, isFetching: fetchingCompanies } = useGetCompanies({ isParent: true });
    const { companies: associateCompanies, isFetching: fetchingAssociateCompanies } = useGetCompanies({ isParent: false, parentCompanyId: (parentCompany || {}).value }, Boolean((parentCompany || {}).value));
    const { locations, isFetching, refetch } = useGetCompanyLocations({ associateCompanyId: (associateCompany || {}).value }, Boolean(associateCompany));
    // const { deleteCompany, isLoading: deletingCompany } = useDeleteCompany(() => {
    //     refetch();
    // }, () => toast.error(ERROR_MESSAGES.DEFAULT));

    function onParentCompanyChange(e) {
        setParentCompany(e);
        setAssociateCompany(null);
    }

    function onAssociateCompanyChange(e) {
        setAssociateCompany(e);
    }

    function submitCallback() {
        setAction(ACTIONS.NONE);
        setCompanyLocation(null);
        refetch();
    }

    function ActionColumnElements({ cell }) {
        const row = cell.getData();
        return (
            <div className="d-flex flex-row align-items-center position-relative h-100">
                {/* <Icon className="mx-2" type="button" name={'pencil'} text={'Edit'} data={row} action={(event) => {
                    setCompanyLocation(row);
                    setAction(ACTIONS.EDIT);
                }} /> */}
                {/* <Icon className="mx-2" type="button" name={'trash'} text={'Delete'} data={row} action={(event) => {
                    setCompanyLocation(row);
                    setAction(ACTIONS.DELETE);
                }} /> */}
                <Icon className="mx-2" type="button" name={'eye'} text={'View'} data={row} action={(event) => {
                    setCompanyLocation(row);
                    setAction(ACTIONS.VIEW);
                }} />
            </div>
        )
    }

    const columns = [
        {
            title: "Name", field: "locationName", widthGrow: 2,
            formatter: reactFormatter(<CellTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        },
        {
            title: "Code", field: "locationCode", width: 120,
            formatter: reactFormatter(<CellTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        },
        {
            title: "Contact Person", field: "contactPersonName",
            formatter: reactFormatter(<CellTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        },
        {
            title: "Contact No.", field: "contactPersonMobile", minWidth: 140,
            headerSort: false, formatter: reactFormatter(<CellTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        },
        {
            title: "Email Address", field: "contactPersonEmail", minWidth: 140,
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
        const total = list.length;
        const tdata = {
            data: list.map(x => mapLocation(x)),
            total,
            last_page: Math.ceil(total / params.size) || 1,
            page: params.page || 1
        };
        setData(tdata);
        return tdata;
    }

    function ajaxRequestFunc(url, config, params) {
        setParams(params);
        setPayload({ ...params });
        return Promise.resolve(formatApiResponse(params, locations));
    }

    function deleteCompanyMaster() {
        // deleteCompany(associateCompany.id);
    }

    useEffect(() => {
        if (query && (query.parentCompany || query.associateCompany)) {
            setParentCompany({ value: query.parentCompany });
            setAssociateCompany({ value: query.associateCompany });
        }
    }, [query]);

    useEffect(() => {
        if (!isFetching && payload) {
            setData(formatApiResponse(params, locations));
        }
    }, [isFetching]);

    useEffect(() => {
        if (!fetchingCompanies && parentCompanies) {
            if (parentCompany && parentCompany.value) {
                const _parentCompany = parentCompanies.find(x => x.id === parentCompany.value) || {};
                setParentCompany({ value: _parentCompany.id, label: _parentCompany.name, code: _parentCompany.code })
            } else {
                const _parentCompany = (parentCompanies || [])[0] || {};
                setParentCompany({ value: _parentCompany.id, label: _parentCompany.name, code: _parentCompany.code });
            }
        }
    }, [fetchingCompanies]);

    useEffect(() => {
        if (!fetchingAssociateCompanies && associateCompanies) {
            if (associateCompany && associateCompany.value) {
                const _associateCompany = associateCompanies.find(x => x.id === associateCompany.value) || {};
                setAssociateCompany({ value: _associateCompany.id, label: _associateCompany.name, code: _associateCompany.code })
            } else {
                const _associateCompany = (associateCompanies || [])[0];
                if (_associateCompany) {
                    setAssociateCompany({ value: _associateCompany.id, label: _associateCompany.name, code: _associateCompany.code });
                }
            }
        }
    }, [fetchingAssociateCompanies]);

    return (
        <>
            <div className="d-flex flex-column mx-0">
                <div className="d-flex flex-row justify-content-center mb-4 mt-4">
                    <div className="col-12 px-4">
                        <div className="d-flex">
                            {/* <InputGroup>
                                <input type="text" className="form-control" placeholder="Search for Associate Company - Code / Name" />
                                <InputGroup.Text style={{ backgroundColor: 'var(--blue)' }}>
                                    <div className="d-flex flex-row align-items-center text-white">
                                        <Icon name={'search'} />
                                        <span className="ms-2">Search</span>
                                    </div>
                                </InputGroup.Text>
                            </InputGroup> */}
                            <div className="col-3 ps-0 pe-3">
                                <Select placeholder='Company' options={(parentCompanies || []).map(x => {
                                    return {
                                        value: x.id,
                                        label: x.name,
                                        code: x.code
                                    }
                                })} onChange={onParentCompanyChange} value={parentCompany} />
                            </div>
                            <div className="col-3 ps-3">
                                <Select placeholder='Associate Company' options={(associateCompanies || []).map(x => {
                                    return {
                                        value: x.id,
                                        label: x.name,
                                        code: x.code
                                    }
                                })} onChange={onAssociateCompanyChange} value={associateCompany} />
                            </div>
                            <Button variant="primary" className="px-4 ms-auto text-nowrap"
                                onClick={() => setAction(ACTIONS.ADD)}
                                disabled={!Boolean(associateCompany)}>Add New Location</Button>
                        </div>
                    </div>
                </div>
                <Table data={data} options={tableConfig} isLoading={isFetching} />
            </div>

            {
                [ACTIONS.ADD, ACTIONS.EDIT, ACTIONS.VIEW].includes(action) &&
                <CompanyLocationDetails action={action} parentCompany={parentCompany} associateCompany={associateCompany}
                    data={action !== ACTIONS.ADD ? companyLocation : null}
                    onClose={() => setAction(ACTIONS.NONE)} onSubmit={submitCallback} />
            }
            {
                action === ACTIONS.DELETE &&
                <ConfirmModal title={'Delete Company Location'} onSubmit={deleteCompanyMaster} onClose={() => setAction(ACTIONS.NONE)}>
                    <div className="text-center mb-4">Are you sure you want to delete the Company Location, <strong>{(companyLocation || {}).locationName}</strong> ?</div>
                </ConfirmModal>
            }
            {/* {deletingCompany && <PageLoader message={'Deleting Company...'} />} */}
        </>
    )
}

export default CompanyLocationMappings;