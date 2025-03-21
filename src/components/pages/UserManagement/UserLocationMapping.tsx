import React, { useEffect } from "react";
import { useState } from "react";
import { useCreateUserLocationMapping, useGetCompanies, useGetCompanyLocations } from "../../../backend/masters";
import { toast } from "react-toastify";
import { API_RESULT, ERROR_MESSAGES } from "../../../utils/constants";
import { Button, Modal } from "react-bootstrap";
import Select from "react-select";
import { preventDefault } from "../../../utils/common";
import Icon from "../../common/Icon";
import styles from "./UserManagement.module.css";
import PageLoader from "../../shared/PageLoader";
import { DEFAULT_OPTIONS_PAYLOAD } from "../../common/Table";

function UserLocationMapping({ user, data, onClose, onSubmit }: any) {
    const [selectedLocations, setSelectedLocations] = useState<any[]>([]);
    const [parentCompany, setParentCompany] = useState<any>();
    const [associateCompany, setAssociateCompany] = useState<any>();
    const { companies: parentCompanies } = useGetCompanies({ ...DEFAULT_OPTIONS_PAYLOAD, filters: [{ columnName: 'isParent', value: 'true' }] });
    const { companies: associateCompanies } = useGetCompanies({
        ...DEFAULT_OPTIONS_PAYLOAD,
        filters: [{ columnName: 'isParent', value: 'false' }, { columnName: 'parentCompanyId', value: (parentCompany || {}).value }]
    }, Boolean((parentCompany || {}).value));
    const { locations, isFetching }: any = useGetCompanyLocations({
        ...DEFAULT_OPTIONS_PAYLOAD,
        filters: [{ columnName: 'companyId', value: (associateCompany || {}).value }],
        sort: { columnName: 'locationName', order: 'asc' }
    }, Boolean(associateCompany));
    const { createUserLocationMapping, creating } = useCreateUserLocationMapping((response: any) => {
        if (response.key === API_RESULT.SUCCESS) {
            toast.success(`${selectedLocations.length} location(s) added successfully.`);
            onSubmit();
        } else {
            toast.error(response.value || ERROR_MESSAGES.ERROR);
        }
    }, errorCallback);

    function errorCallback() {
        toast.error(ERROR_MESSAGES.DEFAULT);
    }

    function onParentCompanyChange(e: any) {
        if (e) {
            setParentCompany(e);
            setAssociateCompany(null);
            setSelectedLocations([]);
        }
    }

    function onAssociateCompanyChange(e: any) {
        if (e) {
            setAssociateCompany(e);
            setSelectedLocations([]);
        }
    }

    function isSelected(id: any) {
        return selectedLocations.includes(id);
    }

    function toogleSelection(location: any) {
        const _selected = [...selectedLocations];
        const _index = _selected.indexOf(location.id);
        if (_index > -1) {
            _selected.splice(_index, 1);
        } else {
            _selected.push(location.id)
        }
        setSelectedLocations(_selected);
    }

    function handleSubmit(e: any) {
        preventDefault(e);
        //if (selectedLocations.length > 0) {
            createUserLocationMapping({
                userId: user.value,
                associateCompanyId: associateCompany.value,
                companyLocationMappingIds: [...selectedLocations]
            } as any);
       // }
    }

    useEffect(() => {
        if (data) {
            const {
                companyId, companyName,
                associateCompanyId, associateCompanyName,
                locations
            } = data;
            setParentCompany({ value: companyId, label: companyName });
            setAssociateCompany({ value: associateCompanyId, label: associateCompanyName });
            setSelectedLocations(locations.map((x: any) => x.companyLocationMappingId));
        }
    }, [data]);

    return (
        <>
            <Modal show={true} backdrop="static" dialogClassName="drawer" animation={false}>
                <Modal.Header closeButton={true} onHide={onClose}>
                    <Modal.Title className="bg">User Location Mapping</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex flex-column h-100">
                        <div className="form-group">
                            <label className="form-label text-sm">Company</label>
                            <div className="input-group">
                                <Select placeholder='Company' className="w-100" options={(parentCompanies || []).map((x: any) => {
                                    return {
                                        value: x.id,
                                        label: x.name,
                                        code: x.code
                                    }
                                })} onChange={onParentCompanyChange} value={parentCompany} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label text-sm">Associate Company</label>
                            <div className="input-group">
                                <Select placeholder='Associate Company' className="w-100" options={(associateCompanies || []).map((x: any) => {
                                    return {
                                        value: x.id,
                                        label: x.name,
                                        code: x.code
                                    }
                                })} onChange={onAssociateCompanyChange} value={associateCompany} />
                            </div>
                        </div>
                        <div className="d-flex flex-row justify-content-between align-items-center">
                            <span className="fw-bold text-lg">Locations</span>
                        </div>
                        <div className={`${styles.locationsList} d-flex flex-column`}>
                            {
                                !isFetching && (locations || []).map((location: any) => {
                                    return (
                                        <div className={`${styles.locationDetails} p-2 mb-2`}
                                            onClick={() => toogleSelection(location)} key={location.id}>
                                            <div className="d-flex flex-column">
                                                <span className="text-md">{location.location.name}</span>
                                                <span className="text-sm">{location.companyLocationAddress}</span>
                                            </div>
                                            {
                                                isSelected(location.id) &&
                                                <Icon name="check-circle-o" className="text-lg" />
                                            }
                                        </div>
                                    )
                                })
                            }
                            {
                                !isFetching && (locations || []).length === 0 &&
                                <div className="d-flex flex-column h-100 justify-content-center align-items-center">
                                    <span>No Data Found</span>
                                </div>
                            }
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-between">
                    <Button variant="outline-secondary" className="btn btn-outline-secondary px-4" onClick={onClose}>{'Cancel'}</Button>
                    {/* //<Button variant="primary" onClick={handleSubmit} className="px-4" disabled={(selectedLocations || []).length === 0}>{'Submit'}</Button>
                */}
                    <Button variant="primary" onClick={handleSubmit} className="px-4" >{'Submit'}</Button>
              
                    </Modal.Footer>
            </Modal>
            {
                creating && <PageLoader />
            }
        </>
    )
}

export default UserLocationMapping;