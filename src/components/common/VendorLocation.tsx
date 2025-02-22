import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useGetUserVendors } from "../../backend/query";
import { useHistory } from "raviger";
import { sortBy } from "underscore";

function VendorLocation({ onChange }: any) {
  const { state }: any = useHistory();
  const [companies, setCompanies] = useState<any[]>([]);
  const [associateCompanies, setAssociateCompanies] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [vendorCategories, setVendorCategories] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [company, setCompany] = useState<any>(null);
  const [associateCompany, setAssociateCompany] = useState<any>(null);
  const [vendorCategory, setVendorCategory] = useState<any>(null);
  const [vendor, setVendor] = useState<any>(null);
  const [location, setLocation] = useState<any>(null);
  const { userVendors, isFetching }: any = useGetUserVendors();``

  useEffect(() => {
    setAssociateCompanies([]);
    setLocations([]);
    setAssociateCompany(null);
    setLocation(null);
    if (company) {
      const associateCompanies = (
        company.company.associateCompany
          ? [company.company.associateCompany]
          : []
      ).map((associateCompany: any) => {
        return {
          label: associateCompany.name,
          value: associateCompany.id,
          associateCompany: associateCompany,
        };
      });
      const sorted: any[] = sortBy(associateCompanies, "label");
      setAssociateCompanies(sorted);
      const _associateCompany = sorted.find(
        (c: any) => c.value === (state || {}).associateCompany
      );
      setAssociateCompany(_associateCompany || sorted[0]);
    }
  }, [company]);

  useEffect(() => {
    setLocations([]);
    setLocation(null);
    if (company) {
      const locations = (
        company.company.location ? [company.company.location] : []
      ).map((location: any) => {
        return {
          label: `${location.name}, ${location.cities.name}`,
          value: location.id,
          location,
          stateId: location.stateId,
        };
      });
      const sorted = sortBy(locations, "label");
      setLocations(sorted);
      const _location = sorted.find(
        (c: any) => c.value === (state || {}).location
      );
      setLocation(_location || sorted[0]);
    }
  }, [associateCompany]);

  useEffect(() => {
    if (company && associateCompany && location && vendorCategory && vendor) {
      onChange({
        company: company.value,
        associateCompany: associateCompany.value,
        location: location.value,
        stateId: location.stateId,
        vendorCategoriesId: vendorCategory.value,
        vendorRegistrationId: vendor.value,
      });
    }
  }, [vendor]);

  useEffect(() => {
    setVendorCategories([]);
    setVendorCategory(null);
    if (company) {
      const categories = (company.company.locationVendors || []).map(
        (location: any) => {
          return {
            label: `${location.vendorCategories.vendorCategoryName}`,
            value: location.vendorCategories.id,
          };
        }
      );
      const sorted = sortBy(categories, "label");
      setVendorCategories(sorted);
      setVendorCategory(sorted[0]);
    }
  }, [location]);

  useEffect(() => {
    setVendorCategories([]);
    setVendorCategory(null);
    if (company) {
      const categories = (company.company.locationVendors || []).map(
        (location: any) => {
          return {
            label: `${location.vendorCategories.vendorCategoryName}`,
            value: location.vendorCategories.id,
          };
        }
      );
      const sorted = sortBy(categories, "label");
      setVendorCategories(sorted);
      setVendorCategory(sorted[0]);
    }
  }, [location]);

  useEffect(() => {
    setVendors([]);
    setVendor(null);

    if (company && vendorCategory) {
      const vendors = (
        company.company.locationVendors.filter(
          (l: any) => l.vendorCategories.id === vendorCategory.value
        ) || []
      )
        .map((location: any) => {
          if (location.vendorRegistrations) {
            if (Array.isArray(location.vendorRegistrations)) {
              return location.vendorRegistrations.map((mapping: any) => ({
                label: `${mapping.vendorName}`,
                value: mapping.vendorLocationMappingId,
              }));
            } else {
              return [
                {
                  label: `${location.vendorRegistrations.vendorName}`,
                  value: location.vendorRegistrations.id,
                },
              ];
            }
          }
          return [];
        })
        .flat();
      const sorted = sortBy(vendors, "label");
      setVendors(sorted);
      setVendor(sorted[0]);
    }
  }, [vendorCategory, company]);

  useEffect(() => {
    if (!isFetching && userVendors) {
      const companies = userVendors.map((company: any) => {
        return { value: company.id, label: company.name, company };
      });
      const sorted = sortBy(companies, "label");
      setCompanies(sorted);
      const _company = sorted.find(
        (c: any) => c.value === (state || {}).company
      );
      setCompany(_company || sorted[0]);
    }
  }, [isFetching]);

  return (
    <>
      <div className="px-2">
        <label className="filter-label">
          <small>Company</small>
        </label>
        <Select
          placeholder="Company"
          options={companies}
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
          options={associateCompanies}
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
          options={locations}
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
          placeholder="Vendor Category"
          options={vendorCategories}
          onChange={setVendorCategory}
          value={vendorCategory}
          className="select-control"
        />
      </div>
      <div className="px-2">
        <label className="filter-label">
          <small>Vendor</small>
        </label>
        <Select
          placeholder="Location"
          options={vendors}
          onChange={setVendor}
          value={vendor}
          className="select-control"
        />
      </div>
    </>
  );
}

export default VendorLocation;
