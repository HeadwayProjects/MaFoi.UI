import React, { useState } from "react";
import MastersLayout from "../MastersLayout";
import { GetVendorAuditScheduleBreadcrumb } from "./Companies.constants";
import {
  useExportVendorAuditSchedule,
  useGetCompanies,
  useGetCompanyLocations,
  useGetCompanyVendorLocations,
  useGetVendorCategories,
} from "../../../../backend/masters";
import { validatorTypes } from "@data-driven-forms/react-form-renderer";
import FormRenderer, {
  ComponentMapper,
  FormTemplate,
  componentTypes,
} from "../../../common/FormRenderer";
import { Button } from "react-bootstrap";
import AuditScheduleImportModal from "./AuditScheduleImportModal";
import PageLoader from "../../../shared/PageLoader";
import { getMaxMonthYear, getMinMonthYear } from "../../../../utils/common";
import { DEFAULT_OPTIONS_PAYLOAD } from "../../../common/Table";
import dayjs from "dayjs";
import { ActivityType } from "../Master.constants";
import { API_DELIMITER } from "../../../../utils/constants";
import VendorAuditScheduleImportModal from "./VendorAuditScheduleImportModal";

const DEFAULT_EXPORT_DATA = {
  hideButtons: true,
  month: new Date(),
  types: ["Display", "Registers", "Returns"].map((x) => {
    return { value: x, label: x };
  }),
};

/**
 *
 * @param obj object
 * @param key string
 * @returns boolean
 */
function isValidProperty(obj: any, key: string): Boolean {
  return Object.entries(obj).some(
    ([key, value]) => (key === key && value !== null) || undefined
  );
}

function VendorAuditSchedule(this: any) {
  const [form, setForm] = useState<any>({});
  const [importFile, setImportFile] = useState(false);
  const [breadcrumb] = useState(
    GetVendorAuditScheduleBreadcrumb("Audit Schedule")
  );
  const [exportData, setExportData] = useState<any>({ ...DEFAULT_EXPORT_DATA });
  const [parentCompany, setParentCompany] = useState<any>(null);
  const [associateCompany, setAssociateCompany] = useState<any>(null);
  const [companyLocation, setCompanyLocation] = useState<any>(null);
  const [vendorCategoriesId, setVendorCategory] = useState<any>(null);
  const [vendorRegistartion, setVendorRegistration] = useState<any>(null);
  const { companies, isFetching: fetchingCompanies } = useGetCompanies({
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
        { columnName: "parentCompanyId", value: (parentCompany || {}).value },
      ],
    },
    Boolean(parentCompany)
  );
  const { locations, isFetching: fetchingLocations } = useGetCompanyLocations(
    {
      ...DEFAULT_OPTIONS_PAYLOAD,
      filters: [
        { columnName: "companyId", value: (associateCompany || {}).value },
      ],
      sort: { columnName: "locationName", order: "asc" },
    },
    Boolean(associateCompany)
  );
  const { vendorCategories, isFetching: fetchingVendorCategories } =
    useGetVendorCategories({
      ...DEFAULT_OPTIONS_PAYLOAD,
      filters: [],
      sort: { columnName: "vendorCategoryName", order: "asc" },
    });
  const { exportVendorAuditSchedule, exporting } = useExportVendorAuditSchedule(
    (response: any) => {
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const URL = window.URL || window.webkitURL;
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = getFileName();
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
    () => {}
  );
  const {
    vendorLocations,
    total: totalCompanyVendorLocations,
    isFetching: fetchingCompanyVendorLocations,
    refetch: vendorMappingRefetch,
  } = useGetCompanyVendorLocations(
    {
      ...DEFAULT_OPTIONS_PAYLOAD,
      sort: { columnName: "location", order: "asc" },
      filters: [
        {
          columnName: "associateCompanyId",
          value: associateCompany ? associateCompany.value : "",
        },
        {
          columnName: "locationId",
          value: exportData.locations ? exportData.locations.value : "",
        },
        {
          columnName: "vendorCategoriesId",
          value: vendorCategoriesId ? vendorCategoriesId.value : "",
        },
        {
          columnName: "vendorRegistrationId",
          value: (vendorRegistartion || {}).value || "",
        },
      ],
    },
    Boolean(vendorCategoriesId)
  );
  const schema = {
    fields: [
      {
        component: componentTypes.SELECT,
        name: "parentCompany",
        label: "Company",
        validate: [{ type: validatorTypes.REQUIRED }],
        options: companies,
        isLoading: fetchingCompanies,
        onChange: onParentCompanyChange.bind(this),
        className: "grid-col-100",
      },
      {
        component: componentTypes.SELECT,
        name: "associateCompany",
        label: "Associate Company",
        options: associateCompanies,
        isDisabled: !Boolean(parentCompany),
        isLoading: fetchingAssociateCompanies,
        onChange: onAssociateCompanyChange.bind(this),
        className: "grid-col-100",
      },
      {
        component: componentTypes.SELECT,
        name: "locations",
        label: "Locations",
        options: (locations || []).map((x: { location: {} }) => {
          const { id, name, code, cities }: any = x.location || {};
          const { state } = cities || {};
          return {
            id,
            name: `${name} (${state.code}-${cities.code}-${code})`,
            code: `${state.code}-${cities.code}-${code}`,
          };
        }),
        isDisabled: !Boolean(associateCompany),
        isLoading: fetchingLocations,
        className: "grid-col-100",
        onChange: onLocationChange.bind(this),
      },
      {
        component: componentTypes.SELECT,
        name: "vedorCategoriesId",
        label: "Vendor Category",
        options: (vendorCategories || []).map((x: any) => {
          return {
            id: x.id,
            name: x.vendorCategoryName,
          };
        }),
        isDisabled: !Boolean(associateCompany),
        isLoading: fetchingVendorCategories,
        className: "grid-col-100",
        onChange: onVendorCategoryChange.bind(this),
      },
      {
        component: componentTypes.SELECT,
        name: "vendorRegistrationId",
        label: "Vendor",
        options: (vendorLocations || []).map((x: any) => {
          const { vendorRegistrationId, vendorRegistartion }: any = x || {};
          return {
            id: vendorRegistrationId,
            name: `${vendorRegistartion.vendorName}`,
          };
        }),
        isDisabled: !Boolean(associateCompany),
        isLoading: fetchingLocations,
        className: "grid-col-100",
        onChange: onVendorRegistrationChange.bind(this),
      },
      {
        component: componentTypes.SELECT,
        name: "types",
        label: "Activity Types",
        validate: [{ type: validatorTypes.REQUIRED }],
        className: "grid-col-100",
        options: ActivityType,
        isMulti: true,
      },
      {
        component: componentTypes.MONTH_PICKER,
        name: "month",
        label: "Month",
        validate: [{ type: validatorTypes.REQUIRED }],
        className: "grid-col-100",
        initialValue: exportData.month,
        minDate: getMinMonthYear(),
        maxDate: getMaxMonthYear(),
        range: true,
      },
    ],
  };

  function getFileName() {
    const {
      parentCompany,
      associateCompany,
      locations,
      vendorCategoriesId,
      vendorRegistrationId,
    } = exportData;
    const _d = {
      ...parentCompany,
      ...associateCompany,
      ...locations,
      ...vendorCategoriesId,
      ...vendorRegistrationId,
    };
    const result = [_d.parentCompany.code];
    if (_d.associateCompany) {
      result.push(_d.associateCompany.code);
    }
    if (_d.locations) {
      result.push(_d.locations.code);
    }
    if (_d.vendorCategoriesId) {
      result.push(_d.vedorCategoriesId.name);
    }
    return `${result.join("-")}.xlsx`;
  }

  function debugForm(_form: any[]) {
    setForm(_form);
    setExportData(_form.values);
  }

  function onParentCompanyChange(e: any) {
    setParentCompany(e);
    setAssociateCompany(null);
    setExportData({
      ...exportData,
      parentCompany: e,
      associateCompany: null,
      locations: null,
    });
  }

  function onLocationChange(e: any) {
    setCompanyLocation(e);
    setExportData({ ...exportData, locations: e });
  }
  function onAssociateCompanyChange(e: any) {
    setAssociateCompany(e);
    setExportData({ ...exportData, associateCompany: e, locations: null });
  }

  function onVendorCategoryChange(e: any) {
    setVendorCategory(e);
    setVendorRegistration(null);
    setExportData({
      ...exportData,
    });
    vendorMappingRefetch();
  }
  function onVendorRegistrationChange(e: any) {
    setVendorRegistration(e);
  }

  function handleSubmit() {
    if (form.valid) {
      const { parentCompany, associateCompany, locations, month, types } =
        exportData;
      let fromDate, toDate;
      if (Array.isArray(month)) {
        fromDate = new Date(month[0]);
        fromDate.setDate(1);
        toDate = new Date(month[1] || month[0]);
        toDate.setDate(1);
      } else {
        fromDate = new Date(month);
        fromDate.setDate(1);
        toDate = new Date(month);
        toDate.setDate(1);
      }
      const payload = {
        companyId: parentCompany.value,
        associateCompanyId: (associateCompany || {}).value || "",
        locationId: (companyLocation || {}).value || "",
        vendorCategoriesId: (vendorCategoriesId || {}).value || "",
        vendorRegistrationId: (vendorRegistartion || {}).value || "",
        fromDate: dayjs(new Date(fromDate)).local().format(),
        toDate: dayjs(new Date(toDate)).local().format(),
        types: types.map((x: { value: any }) => x.value).join(API_DELIMITER),
      };
      exportVendorAuditSchedule(payload);
    }
  }

  function resetForm() {
    setExportData({ ...DEFAULT_EXPORT_DATA });
  }

  return (
    <>
      <MastersLayout title="Vendor Audit Schedule" breadcrumbs={breadcrumb}>
        <div className="d-flex flex-column mx-0 mt-4">
          <div className="d-flex flex-row justify-content-center mb-4">
            <div className="w-50 px-4 border-end" style={{ maxWidth: "550px" }}>
              <div className="d-flex flex-column card shadow p-4">
                <div className="text-lg fw-bold">Export Audit Schedule</div>
                <div className="d-flex flex-column h-100 justify-space-between py-2 horizontal-form col2">
                  <FormRenderer
                    FormTemplate={FormTemplate}
                    initialValues={exportData}
                    componentMapper={ComponentMapper}
                    schema={schema}
                    debug={debugForm}
                  />
                </div>
                <div className="d-flex justify-content-end mt-4 me-4">
                  <Button
                    variant="outline-secondary"
                    className="btn btn-outline-secondary px-4"
                    onClick={resetForm}
                  >
                    {"Reset"}
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSubmit}
                    className="ms-4 px-4"
                    disabled={!form.valid}
                  >
                    {"Export"}
                  </Button>
                </div>
              </div>
            </div>
            <div
              className="w-100 px-4"
              style={{ maxWidth: "calc(100% - 550px)", minWidth: "50%" }}
            >
              <div className="d-flex flex-column">
                <div className="d-flex flex-column card shadow p-4 mb-4">
                  <div className="text-lg fw-bold mb-4">
                    Import Audit Schedule
                  </div>
                  <ul>
                    <li>Click on Import Button</li>
                    <li>Select the file and upload</li>
                    <li>
                      If there are errors, click on the hyper link and the
                      application will export the errors in excel file for you
                      to edit and re-upload
                    </li>
                  </ul>
                  <div>
                    <Button
                      variant="primary"
                      onClick={() => setImportFile(true)}
                      className="px-4"
                    >
                      {"Import"}
                    </Button>
                  </div>
                </div>
                <div className="d-flex flex-column card shadow p-4">
                  <div className="text-lg fw-bold mb-4">
                    Instructions for Export
                  </div>
                  <ul>
                    <li>Select Company</li>
                    <li>Select Associate Company </li>
                    <li>Select Location </li>
                    <li>Select Vendor Category </li>
                    <li>Select Vendor </li>
                    <li>
                      Please note that if you are not selecting the Associate
                      Company, Location, Vendor Category or Vendor then the
                      application will export all data for all Associate
                      Companies or Locations.
                    </li>
                    <li>
                      Select Month & Year. Here you can select the range of
                      months to create the excel export
                    </li>
                    <li>
                      Click Export button to export the data into an excel
                      sheet.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MastersLayout>
      {importFile && (
        <VendorAuditScheduleImportModal onClose={() => setImportFile(false)} />
      )}
      {exporting && <PageLoader>Generating Audit Schedule...</PageLoader>}
    </>
  );
}

export default VendorAuditSchedule;
