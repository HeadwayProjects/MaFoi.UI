import React, { useEffect } from "react";
import { useState } from "react";
import {
  useCreateUserLocationMapping,
  useGetCompanies,
  useGetCompanyLocations,
  useGetVendorCategories,
  useGetCompanyVendorLocations,
  useCreateUserVendorLocationMapping,
} from "../../../backend/masters";
import { toast } from "react-toastify";
import { API_RESULT, ERROR_MESSAGES } from "../../../utils/constants";
import { Button, Modal } from "react-bootstrap";
import Select from "react-select";
import { preventDefault } from "../../../utils/common";
import Icon from "../../common/Icon";
import styles from "./UserManagement.module.css";
import PageLoader from "../../shared/PageLoader";
import { DEFAULT_OPTIONS_PAYLOAD } from "../../common/Table";

function UserVendorLocationMapping({ user, data, onClose, onSubmit }: any) {
  const [selectedLocation, setSelectedLocation] = useState<any>();
  const [selectedLocations, setSelectedLocations] = useState<any>();
  const [parentCompany, setParentCompany] = useState<any>();
  const [associateCompany, setAssociateCompany] = useState<any>();
  const [selecedCategory, setVendorCategory] = useState<any>();
  const [seletedVendorLocations, setVendorLocations] = useState<any[]>([]);



  const { companies: parentCompanies } = useGetCompanies({
    ...DEFAULT_OPTIONS_PAYLOAD,
    filters: [{ columnName: "isParent", value: "true" }],
  });
  const { companies: associateCompanies } = useGetCompanies(
    {
      ...DEFAULT_OPTIONS_PAYLOAD,
      filters: [
        { columnName: "isParent", value: "false" },
        { columnName: "parentCompanyId", value: (parentCompany || {}).value },
      ],
    },
    Boolean((parentCompany || {}).value)
  );


  const {
    locations,
    isFetching,
    refetch: locationRefetch,
  }: any = useGetCompanyLocations(
    {
      ...DEFAULT_OPTIONS_PAYLOAD,
      filters: [
        { columnName: "companyId", value: (associateCompany || {}).value },
      ],
      sort: { columnName: "locationName", order: "asc" },
    },
    Boolean(associateCompany)
  );
  const { vendorCategories } = useGetVendorCategories({
    ...DEFAULT_OPTIONS_PAYLOAD,
    sort: { columnName: "vendorCategoryName", order: "asc" },
  });
  const { vendorLocations, refetch } = useGetCompanyVendorLocations({
    ...DEFAULT_OPTIONS_PAYLOAD,
    filters: [
      { columnName: "companyId", value: (parentCompany || {}).value },
      {
        columnName: "associateCompanyId",
        value: (associateCompany || {}).value,
      },
      { columnName: "locationId", value: (selectedLocation || {}).value },
      {
        columnName: "vendorCategoriesId",
        value: (selecedCategory || {}).value,
      },
    ],
    sort: { columnName: "vendorCategoryName", order: "asc" },
  });




  const { createUserVendorLocationMapping, creating } =
    useCreateUserVendorLocationMapping((response: any) => {
      if (response.key === API_RESULT.SUCCESS) {
        toast.success(
          `${seletedVendorLocations.length} location(s) added successfully.`
        );
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
      setSelectedLocation(null);
      setVendorCategory(null);
      setVendorLocations([]);
    }
  }

  function onAssociateCompanyChange(e: any) {
    if (e) {
      setAssociateCompany(e);
      setVendorCategory(null);
      setVendorLocations([]);
      locationRefetch();
    }
  }

  function onAssociateCompanyLocationChange(e: any) {
    if (e) {
      setSelectedLocation(e);
      setVendorCategory(null);
      setVendorLocations([]);
    }
  }
  function onVendorCategoryChange(e: any) {
    if (e) {
      setVendorCategory(e);
      setVendorLocations([]);
      refetch();
    }
  }

  function isSelected(id: any) {
    return seletedVendorLocations.includes(id);
  }

  function toogleSelection(location: any) {
    const _selected = [...seletedVendorLocations];
    const _index = _selected.indexOf(location.id);
    if (_index > -1) {
      _selected.splice(_index, 1);
    } else {
      _selected.push(location.id);
    }
    setVendorLocations(_selected);
  }

  function handleSubmit(e: any) {
    preventDefault(e);
    // if (seletedVendorLocations.length > 0) {
      createUserVendorLocationMapping({
        userId: user.value,
        associateCompanyId: associateCompany.value,
        vendorCategoriesId: selecedCategory.value,
        locationId: selectedLocation.value,
        locationVendorMappingIds: [...seletedVendorLocations],
      } as any);
    // }
  }

  useEffect(() => {
    if (data) {
      const {
        name,
        id,
        associateCompany,
        vendorCategoryName,
        location,
        categoryId,
        vendorRegistrations,
      } = data;




      setParentCompany({ value: id, label: name });
      setAssociateCompany({
        value: associateCompany.id,
        label: associateCompany.name,
      });
      setSelectedLocation({
        value: location.id,
        label: location.name,
        code: location.code,
      });
      setVendorCategory({
        value: categoryId,
        label: vendorCategoryName,
      });
      setVendorLocations(
        vendorRegistrations.map((v: any) => v.vendorLocationMappingId)
      );
    }
  }, [data]);

  return (
    <>
      <Modal
        show={true}
        backdrop="static"
        dialogClassName="drawer"
        animation={false}
      >
        <Modal.Header closeButton={true} onHide={onClose}>
          <Modal.Title className="bg">User Vendor Location Mapping</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-column h-100">
            <div className="form-group">
              <label className="form-label text-sm">Company</label>
              <div className="input-group">
                <Select
                  placeholder="Company"
                  className="w-100"
                  options={(parentCompanies || []).map((x: any) => {
                    return {
                      value: x.id,
                      label: x.name,
                      code: x.code,
                    };
                  })}
                  onChange={onParentCompanyChange}
                  value={parentCompany}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label text-sm">Associate Company</label>
              <div className="input-group">
                <Select
                  placeholder="Associate Company"
                  className="w-100"
                  options={(associateCompanies || []).map((x: any) => {
                    return {
                      value: x.id,
                      label: x.name,
                      code: x.code,
                    };
                  })}
                  onChange={onAssociateCompanyChange}
                  value={associateCompany}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label text-sm">Location</label>
              <div className="input-group">
                <Select
                  placeholder="Location"
                  className="w-100"
                  options={(locations || []).map((x: any) => {
                    return {
                      value: x.location.id,
                      label: x.location.name,
                      code: x.location.code,
                    };
                  })}
                  onChange={onAssociateCompanyLocationChange}
                  value={selectedLocation}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label text-sm">Vendor Category</label>
              <div className="input-group">
                <Select
                  placeholder="Vendor Category"
                  className="w-100"
                  options={(vendorCategories || []).map((x: any) => {
                    return {
                      value: x.id,
                      label: x.vendorCategoryName,
                      code: x.code,
                    };
                  })}
                  onChange={onVendorCategoryChange}
                  value={selecedCategory}
                />
              </div>
            </div>
            <div className="d-flex flex-row justify-content-between align-items-center">
              <span className="fw-bold text-lg">Vendor Locations</span>
            </div>
            <div className={`${styles.locationsList} d-flex flex-column`}>
              {!isFetching &&
                (vendorLocations || []).map((location: any) => {
                  return (
                    <div
                      className={`${styles.locationDetails} p-2 mb-2`}
                      onClick={() => toogleSelection(location)}
                      key={location.id}
                    >
                      <div className="d-flex flex-column">
                        <span className="text-md">
                          {location.vendorRegistartion.vendorName}
                        </span>
                        <span className="text-sm">
                          {
                            location.vendorRegistartion
                              .city.name
                          }
                        </span>
                      </div>
                      {isSelected(location.id) && (
                        <Icon name="check-circle-o" className="text-lg" />
                      )}
                    </div>
                  );
                })}
              {!isFetching && (vendorLocations || []).length === 0 && (
                <div className="d-flex flex-column h-100 justify-content-center align-items-center">
                  <span>No Data Found</span>
                </div>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          <Button
            variant="outline-secondary"
            className="btn btn-outline-secondary px-4"
            onClick={onClose}
          >
            {"Cancel"}
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            className="px-4"
            //disabled={(seletedVendorLocations || []).length === 0}
          >
            {"Submit"}
          </Button>
        </Modal.Footer>
      </Modal>
      {creating && <PageLoader />}
    </>
  );
}

export default UserVendorLocationMapping;
