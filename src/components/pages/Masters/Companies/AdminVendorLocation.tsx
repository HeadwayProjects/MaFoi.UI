import React, { useEffect, useState } from "react";
import Select from "react-select";
import {
  hasUserAccess,
  getUserDetails,
  getUserRole,
} from "../../../../backend/auth";
import { DEFAULT_PAYLOAD } from "../../../common/Table";
import {
  useGetUserVendorsCompanies,
  useGetVendor,
  useGetVendorAssociateCompanies,
  useGetVendorCategoriresCompanies,
  useGetVendorLocations,
} from "../../../../backend/masters";

function AdminVendorLocations({ onChange }: any) {
  const _role = getUserRole();
  const [t] = useState(new Date().getTime());
  const [company, setCompany] = useState<any>(null);
  const [associateCompany, setAssociateCompany] = useState<any>(null);
  const [location, setLocation] = useState<any>(null);
  const [vendorCategoriesId, setVendorCategoriesId] = useState<any>(null);
  const [vendorRegistrationId, setVendorRegistrationId] = useState<any>(null);

  const { userVendorsCompanies, isFetching }: any =
    useGetUserVendorsCompanies();

  const {
    userVendorsAsscoiateCompanies,
    isFetching: fetchingAssociateCompanies,
  } = useGetVendorAssociateCompanies((company || {}).value);

  const { VendorLocations, isFetching: fetchingLocations } =
    useGetVendorLocations(
      (company || {}).value,
      (associateCompany || {}).value
    );
  const { VendorCategories, isFetching: fetchingVendorCategories } =
    useGetVendorCategoriresCompanies(
      (company || {}).value,
      (associateCompany || {}).value,
      (location || {}).value
    );

  const { Getvendors, isFetching: fetchingVendors } = useGetVendor(
    (company || {}).value,
    (associateCompany || {}).value,
    (location || {}).value,
    (vendorCategoriesId || {}).value
  );

  useEffect(() => {
    if (company) {
      setAssociateCompany(undefined);
      setLocation(undefined);
    }
  }, [company]);

  useEffect(() => {
    if (associateCompany) {
      setLocation(undefined);
    }
  }, [associateCompany]);

  useEffect(() => {
    if (
      company &&
      associateCompany &&
      location &&
      vendorCategoriesId &&
      vendorRegistrationId
    ) {
      onChange({
        company: company.value,
        associateCompany: associateCompany.value,
        locationId: location.value,
        vendorCategoriesId: vendorCategoriesId.value,
        vendorRegistrationId: vendorRegistrationId.value,
      });
    }
  }, [vendorRegistrationId]);

  useEffect(() => {
    if (!isFetching && userVendorsCompanies) {
      const _parentCompany = userVendorsCompanies[0];
      if (_parentCompany) {
        setCompany({ value: _parentCompany.id, label: _parentCompany.name });
      }
    }
  }, [isFetching]);

  useEffect(() => {
    if (!fetchingAssociateCompanies && userVendorsAsscoiateCompanies) {
      const _associateCompany = userVendorsAsscoiateCompanies[0];
      if (_associateCompany) {
        setAssociateCompany({
          value: _associateCompany.id,
          label: _associateCompany.name,
        });
      }
    }
  }, [fetchingAssociateCompanies]);

  useEffect(() => {
    if (!fetchingVendorCategories && VendorCategories) {
      const _category = VendorCategories[0];
      if (_category) {
        setVendorCategoriesId({
          value: _category.id,
          label: _category.vendorCategoryName,
        });
      }
    }
  }, [fetchingVendorCategories]);

  useEffect(() => {
    if (!fetchingVendors && Getvendors) {
      const _vendor = Getvendors[0];
      if (_vendor) {
        setVendorRegistrationId({
          value: _vendor.id,
          label: _vendor.vendorName,
        });
      }
    }
  }, [fetchingVendors]);

  useEffect(() => {
    if (!fetchingLocations && VendorLocations) {
      const _location = VendorLocations[0];

      if (_location) {
        setLocation({
          value: _location.id,
          label: _location.name,
        });
      }
    }
  }, [fetchingLocations]);

  return (
    <>
      <div className="px-2">
        <label className="filter-label">
          <small>Company</small>
        </label>
        <Select
          placeholder="Company"
          options={(userVendorsCompanies || []).map((x: any) => {
            return { value: x.id, label: x.name };
          })}
          onChange={setCompany}
          value={company}
          className="select-control"
        />
      </div>
      <div className="px-2">
        <label className="filter-label">
          <small>Associate Company</small>
        </label>
        <Select
          placeholder="Associate Company"
          options={
            Array.isArray(userVendorsAsscoiateCompanies)
              ? userVendorsAsscoiateCompanies.map((x: any) => ({
                  value: x.id,
                  label: x.name,
                }))
              : []
          }
          onChange={setAssociateCompany}
          value={associateCompany}
          className="select-control"
        />
      </div>
      <div className="px-2">
        <label className="filter-label">
          <small>Location</small>
        </label>
        <Select
          placeholder="Location"
          options={
            Array.isArray(VendorLocations)
              ? VendorLocations.map((x: any) => ({
                  value: x.id,
                  label: x.name,
                }))
              : []
          }
          onChange={setLocation}
          value={location}
          className="select-control"
        />
      </div>
      <div className="px-2">
        <label className="filter-label">
          <small>Vendor Category</small>
        </label>
        <Select
          placeholder="Category"
          options={(VendorCategories || []).map((x: any) => {
            return { value: x.id, label: x.vendorCategoryName };
          })}
          onChange={(e) => {
            setVendorCategoriesId(e);
          }}
          value={vendorCategoriesId}
          className="select-control"
        />
      </div>
      <div className="px-2">
        <label className="filter-label">
          <small>Vendor</small>
        </label>
        <Select
          placeholder="Vendors"
          options={
            Array.isArray(Getvendors)
              ? Getvendors.map((x: any) => ({
                  value: x.id,
                  label: x.vendorName,
                }))
              : []
          }
          onChange={setVendorRegistrationId}
          value={vendorRegistrationId}
          className="select-control"
        />
      </div>
    </>
  );
}

export default AdminVendorLocations;
