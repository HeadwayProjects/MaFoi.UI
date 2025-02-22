import React, { useEffect, useState } from "react";
import Select from "react-select";
import {
  hasUserAccess,
  getUserDetails,
  getUserRole,
} from "../../../../backend/auth";
import {
  DEFAULT_OPTIONS_PAYLOAD,
  DEFAULT_PAYLOAD,
} from "../../../common/Table";
import {
  useGetCompanies,
  useGetCompanyLocations,
  useGetCompanyVendorLocations,
  useGetUserVendorsCompanies,
  useGetVendor,
  useGetVendorAssociateCompanies,
  useGetVendorCategories,
  useGetVendorCategoriresCompanies,
  useGetVendorCompanies,
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
  const { companies: parentCompanies, isFetching: fetchingCompanies } =
    useGetCompanies({
      ...DEFAULT_OPTIONS_PAYLOAD,
      filters: [{ columnName: "isParent", value: "true" }],
    });
  const {
    companies: associateCompanies,
    isFetching: fetchingAssociateCompanies,
  } = useGetCompanies(
    {
      ...DEFAULT_OPTIONS_PAYLOAD,
      filters: [
        { columnName: "isParent", value: "false" },
        { columnName: "parentCompanyId", value: (company || {}).value },
      ],
    },
    Boolean((company || {}).value)
  );
  const { vendorCategories, isFetching: fetchingVendorCategories } =
    useGetVendorCategories({
      ...DEFAULT_PAYLOAD,
      sort: { columnName: "vendorCategoryName", order: "asc" },
    });

  const {
    locations,
    isFetching: fetchinglocation,
    refetch: locationRefetch,
  } = useGetCompanyLocations(
    {
      ...DEFAULT_PAYLOAD,
      filters: [
        {
          columnName: "companyId",
          value:
            associateCompany && associateCompany.value
              ? associateCompany.value
              : "",
        },
      ],
    },
    Boolean(associateCompany)
  );
  const {
    vendorLocations,
    isFetching,
    refetch: vendorMappingRefetch,
  } = useGetCompanyVendorLocations(
    {
      filters: [
        {
          columnName: "associateCompanyId",
          value: associateCompany ? associateCompany.value : "",
        },
        {
          columnName: "locationId",
          value: location ? location.value : "",
        },
        {
          columnName: "vendorCategoriesId",
          value: vendorCategoriesId ? vendorCategoriesId.value : "",
        },
      ],
      search: "",
    },
    Boolean(associateCompany && location)
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
    if (!fetchingCompanies && parentCompanies) {
      const _parentCompany = parentCompanies[0];
      if (_parentCompany) {
        setCompany({ value: _parentCompany.id, label: _parentCompany.name });
      }
    }
  }, [fetchingCompanies]);

  useEffect(() => {
    if (!fetchingAssociateCompanies && associateCompanies) {
      const _associateCompany = associateCompanies[0];
      if (_associateCompany) {
        setAssociateCompany({
          value: _associateCompany.id,
          label: _associateCompany.name,
        });
      }
    }
  }, [fetchingAssociateCompanies]);

  useEffect(() => {
    if (!fetchingVendorCategories && vendorCategories) {
      const _category = vendorCategories[0];
      if (_category) {
        setVendorCategoriesId({
          value: _category.id,
          label: _category.vendorCategoryName,
        });
      }
      vendorMappingRefetch();
    }
  }, [fetchingVendorCategories]);

  useEffect(() => {
    if (!isFetching && vendorLocations) {
      const _vendor = vendorLocations[0];
      if (_vendor && _vendor.vendorRegistration !== undefined) {
        const vendorRegistration = _vendor.vendorRegistration;
        setVendorRegistrationId({
          value: _vendor.vendorRegistrationId || "",
          label: vendorRegistration.vendorName || "",
        });
      }
    }
  }, [isFetching]);

  useEffect(() => {
    vendorMappingRefetch();
  }, [location]);

  useEffect(() => {
    if (!fetchinglocation && locations) {
      const _location = locations[0];
      if (_location) {
        setLocation({
          value: _location.location.id,
          label: _location.location.name,
        });
      }
    }
  }, [fetchinglocation]);

  return (
    <>
      <div className="px-2">
        <label className="filter-label">
          <small>Company</small>
        </label>
        <Select
          placeholder="Company"
          options={(parentCompanies || []).map((x: any) => {
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
            Array.isArray(associateCompanies)
              ? associateCompanies.map((x: any) => ({
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
            Array.isArray(locations)
              ? locations.map(({ location }: any) => ({
                  value: location.id,
                  label: location.name,
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
          options={(vendorCategories || []).map((x: any) => {
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
            Array.isArray(vendorLocations)
              ? vendorLocations.map((x: any) => ({
                  value: x.vendorRegistrationId,
                  label: x.vendorRegistartion.vendorName,
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
