import React, { useEffect, useState } from "react";
import {
  useGetCompanies,
  useGetCompanyVendorLocations,
  useGetCompanyLocations,
  useGetVendorCategories,
} from "../../../../backend/masters";
import Icon from "../../../common/Icon";
import { ACTIONS } from "../../../common/Constants";
import Table, {
  CellTmpl,
  DEFAULT_OPTIONS_PAYLOAD,
  DEFAULT_PAYLOAD,
  TitleTmpl,
  reactFormatter,
} from "../../../common/Table";
import { useQueryParams } from "raviger";
import { useRef } from "react";
import Select from "react-select";
import TableFilters from "../../../common/TableFilter";
import { toast } from "react-toastify";
import { ERROR_MESSAGES } from "../../../../utils/constants";
import MastersLayout from "../MastersLayout";
import { GetMastersBreadcrumb } from "../Master.constants";
import { useExportVendorLocations } from "../../../../backend/exports";
import { downloadFileContent } from "../../../../utils/common";
import TableActions, { ActionButton } from "../../../common/TableActions";
import CompanyVendorLocationDetails from "./CompanyVendorLocationMappingDetails";
import CompanyVendorLocationsImportModal from "./CompanyVendorLocationsImportModel";
import Location from "../../../common/Location";

function CompanyVendorLocationMappings() {
  const [breadcrumb] = useState(GetMastersBreadcrumb("Vendor mapping"));
  const [query] = useQueryParams();
  const [action, setAction] = useState(ACTIONS.NONE);
  const [parentCompany, setParentCompany] = useState<any>(null);
  const [associateCompany, setAssociateCompany] = useState<any>(null);
  const [companyLocation, setCompanyLocation] = useState<any>(null);
  const [VendorLocation, setVendorLocation] = useState<any>(null);
  const [vendorCategory, setVendorCategory] = useState<any>(null);
  const [data, setData] = useState<any>();
  const [params, setParams] = useState<any>();
  const [filters, setFilters] = useState<any>();
  const filterRefTest: any = useRef();
  filterRefTest.current = filters;
  const [payload, setPayload] = useState<any>();
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
        { columnName: "parentCompanyId", value: (parentCompany || {}).value },
      ],
    },
    Boolean((parentCompany || {}).value)
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
    Boolean(associateCompany && payload)
  );
  const {
    vendorLocations,
    total,
    isFetching,
    refetch: vendorMappingRefetch,
  } = useGetCompanyVendorLocations(
    {
      ...payload,
      filters: [
        {
          columnName: "associateCompanyId",
          value: associateCompany ? associateCompany.value : "",
        },
        {
          columnName: "locationId",
          value: companyLocation ? companyLocation.value : "",
        },
        {
          columnName: "vendorCategoriesId",
          value: vendorCategory ? vendorCategory.value : "",
        },
      ],
    },
    Boolean(associateCompany && payload)
  );

  const { exportVendorLocations, exporting } = useExportVendorLocations(
    (response: any) => {
      downloadFileContent({
        name: "CompanyVendorLocations.xlsx",
        type: response.headers["content-type"],
        content: response.data,
      });
    },
    () => {
      toast.error(ERROR_MESSAGES.DEFAULT);
    }
  );

  const buttons: ActionButton[] = [
    {
      label: "Add New",
      name: "addNew",
      icon: "plus",
      disabled: !associateCompany,
      // privilege: USER_PRIVILEGES.ADD_LOCATION_MAPPING,
      action: () => setAction(ACTIONS.ADD),
    },
    {
      label: "Export",
      name: "export",
      icon: "download",
      //disabled: !total,
      // privilege: USER_PRIVILEGES.EXPORT_LOCATION_MAPPINGS,
      action: handleExport,
    },
    {
      label: "Import",
      name: "import",
      disabled: !associateCompany,
      icon: "upload",
      // privilege: USER_PRIVILEGES.ADD_LOCATION_MAPPING,
      action: () => setAction(ACTIONS.IMPORT),
    },
  ];

  const filterConfig = [
    {
      label: "Company",
      name: "parentCompanyId",
      options: (parentCompanies || []).map((x: any) => {
        return { value: x.id, label: x.name };
      }),
      hideAll: true,
      value: parentCompany,
    },
    // {
    //   label: "Associate Company",
    //   name: "associateCompanyId",
    //   options: (associateCompanies || []).map((x: any) => {
    //     return { value: x.id, label: x.name };
    //   }),
    //   hideAll: true,
    //   value: associateCompany,
    // },
    // {
    //   label: "Location4",
    //   name: "locationId",
    //   options: (locations || []).map((x: any) => {
    //     return { value: x.id, label: x.location.name };
    //   }),
    //   hideAll: true,
    //   value: companyLocation,
    // },
    // {
    //   label: "Vendor Category",
    //   name: "vendorCategoriesId",
    //   options: (vendorCategories || []).map((x: any) => {
    //     return { value: x.id, label: x.vendorCategoryName };
    //   }),
    //   hideAll: true,
    //   value: vendorCategory,
    // },
  ];

  const filterAssocioConfig = [
    {
      label: "Associate Company",
      name: "associateCompanyId",
      options: (associateCompanies || []).map((x: any) => {
        return { value: x.id, label: x.name };
      }),
      hideAll: true,
      value: associateCompany,
    },
  ];

  const filterVendorConfig = [
    {
      label: "Vendor Category",
      name: "vendorCategoriesId",
      options: (vendorCategories || []).map((x: any) => {
        return { value: x.id, label: x.vendorCategoryName };
      }),
      hideAll: true,
      value: vendorCategory,
    }
  ];

  const filterLocationConfig = [
    {
      label: "Location",
      name: "locationId",
      options: (locations || []).map((x: any) => {
        return { value: x.id, label: x.location.name };
      }),
      hideAll: true,
      value: companyLocation,
    },
  ];

  function submitCallback() {
    setAction(ACTIONS.NONE);
    vendorMappingRefetch();
  }

  function ActionColumnElements({ cell }: any) {
    const row = cell.getData();
    return (
      <div className="d-flex flex-row align-items-center position-relative h-100">
        <Icon
          className="mx-2"
          type="button"
          name={"pencil"}
          text={"Edit"}
          data={row}
          action={(event: any) => {
            setVendorLocation(row);
            setAction(ACTIONS.EDIT);
          }}
        />
        <Icon
          className="mx-2"
          type="button"
          name={"eye"}
          text={"View"}
          data={row}
          action={(event: any) => {
            setVendorLocation(row);
            setAction(ACTIONS.VIEW);
          }}
        />
      </div>
    );
  }

  const columns = [
    {
      title: "Vendor",
      field: "vendorRegistartion.vendorName",
      widthGrow: 2,
      formatter: reactFormatter(<CellTmpl />),
      titleFormatter: reactFormatter(<TitleTmpl />),
    },
    {
      title: "Company",
      field: "company.name",
      widthGrow: 2,
      formatter: reactFormatter(<CellTmpl />),
      titleFormatter: reactFormatter(<TitleTmpl />),
    },
    {
      title: "Associate Company",
      field: "associateCompany.name",
      widthGrow: 2,
      formatter: reactFormatter(<CellTmpl />),
      titleFormatter: reactFormatter(<TitleTmpl />),
    },
    {
      title: "Location",
      field: "location.name",
      widthGrow: 2,
      formatter: reactFormatter(<CellTmpl />),
      titleFormatter: reactFormatter(<TitleTmpl />),
    },
    {
      title: "Category",
      field: "vendorCategories.vendorCategoryName",
      widthGrow: 2,
      formatter: reactFormatter(<CellTmpl />),
      titleFormatter: reactFormatter(<TitleTmpl />),
    },
    {
      title: "Actions",
      hozAlign: "center",
      width: 160,
      headerSort: false,
      formatter: reactFormatter(<ActionColumnElements />),
    },
  ];

  const [tableConfig] = useState({
    paginationMode: "remote",
    ajaxRequestFunc,
    columns,
    rowHeight: 54,
    selectable: false,
    paginate: true,
    initialSort: [{ column: "locationName", dir: "asc" }],
  });

  function formatApiResponse(params: any, list: any[], totalRecords: number) {
    const { pagination } = params || {};
    const { pageSize, pageNumber } = pagination || {};
    const tdata = {
      data: list,
      total: totalRecords,
      last_page: Math.ceil(totalRecords / (pageSize || 1)) || 1,
      page: pageNumber || 1,
    };
    setData(tdata);
    return tdata;
  }

  function ajaxRequestFunc(url: any, config: any, params: any) {
    const { field, dir } = (params.sort || [])[0] || {};

    const _params = {
      pagination: {
        pageSize: params.size,
        pageNumber: params.page,
      },
      sort: {
        columnName: field || "location",
        order: dir || "asc",
      },
    };
    setParams(_params);
    setPayload({ ...DEFAULT_PAYLOAD, ...filterRefTest.current, ..._params });
    return Promise.resolve(formatApiResponse(params, vendorLocations, total));
  }

  function onFilterChange(e: any) {
    setFilters(e);
    if(e.filters[0].columnName == "associateCompanyId"){
      setCompanyLocation([]);
      // setFilters(e);
    }
  }

  function handlePageNav(_pagination: any) {
    const _params = { ...params };
    _params.pagination = _pagination;
    setParams({ ..._params });
    setPayload({ ...payload, ..._params });
  }

  function handleExport() {
    // if (total > 0) {
    console.log(associateCompany)
    console.log(companyLocation)
    console.log(vendorCategory)
      const filters = []
      if (associateCompany) {
              filters.push({
                columnName: 'associatecompanyid',
                value: associateCompany.value
              })
            }
            // if (companyLocation) {
            //   filters.push({
            //     columnName: 'locationid',
            //     value: companyLocation.value
            //   })
            // }
            // if (vendorCategory) {
            //   filters.push({
            //     columnName: 'vendorcategoriesid',
            //     value: vendorCategory.value
            //   })
            // }
            const payload: any = {
                    search: '',
                    filters: filters,
                    pagination: null,
                    sort: { columnName: 'locationname', order: 'asc' },
                    "includeCentral": true
                  }

                  console.log(payload);

      exportVendorLocations({ ...payload, pagination: null });
    // }
  }

 

  useEffect(() => {
    if (
      query &&
      (query.parentCompany ||
        query.associateCompany ||
        query.location ||
        query.vendorCategory)
    ) {
      setParentCompany({ value: query.parentCompany });
      setAssociateCompany({ value: query.associateCompany });
      setVendorCategory(query.vendorCategory);
      setCompanyLocation(() => {
        const location = locations.find((s: any) => s.name === query.location);
        return {
          label: location.location.name,
          value: location.locationId,
        };
      });
    }
  }, [query]);

  useEffect(() => {
    if (filters) {
      // alert("hitted")     
      const { filters: _filters, search } = filters;
      setData(formatApiResponse(params, [], 0));
      const _associateCompanyId = (
        _filters.find((x: any) => x.columnName === "associateCompanyId") || {}
      ).value;
      const _parentCompanyId = (
        _filters.find((x: any) => x.columnName === "parentCompanyId") || {}
      ).value;
      const TestLocationId = (
        _filters.find((x: any) => x.columnName === "locationId") || {}
      ).value;
      const _vendorCategoreisId = (
        _filters.find((x: any) => x.columnName === "vendorCategoriesId") || {}
      ).value;
      if (_parentCompanyId) {
        const _parentCompany = parentCompanies.find(
          (x: any) => x.id === _parentCompanyId
        );
        setParentCompany({
          value: _parentCompany.id,
          label: _parentCompany.name,
          code: _parentCompany.code,
        });
        if ((parentCompany || {}).value !== _parentCompanyId) {
          setAssociateCompany(null);
          setCompanyLocation(null);
          setPayload(null);
          return;
        }
      }

      if (_associateCompanyId) {
        const _associateCompany = associateCompanies.find(
          (x: any) => x.id === _associateCompanyId
        );
        if (_associateCompany) {
          setAssociateCompany({
            value: _associateCompany.id,
            label: _associateCompany.name,
            code: _associateCompany.code,
          });
          
          const _x = {
            filters: [
              { columnName: "assocaiteCompanyId", value: _associateCompanyId },
            ],
            search,
          };
          setPayload({ ...DEFAULT_PAYLOAD, ...params, ..._x });
          return;
        }
      }
      if (_vendorCategoreisId) {
        const _vendorCategory = vendorCategories.find(
          (x: any) => x.id === _vendorCategoreisId
        );
        if (_vendorCategory) {
          setVendorCategory({
            value: _vendorCategory.id,
            label: _vendorCategory.vendorCategoryName,
          });
          const _x = {
            filters: [
              { columnName: "vendorCategoriesId", value: _vendorCategoreisId },
            ],
            search,
          };
          setPayload({ ...DEFAULT_PAYLOAD, ...params, ..._x });
          return;
        }
      }
      if (TestLocationId) {
        //alert("hitted TestLocationId" )
        const _location = locations.find((x: any) => x.id === TestLocationId);
        if (_location) {
          setCompanyLocation({
            value: _location.locationId,
            label: _location.location.name,
          });
          //debugger
          const _x = {
            filters: [{ columnName: "locationId", value: TestLocationId }],
            search,
          };
          setPayload({ ...DEFAULT_PAYLOAD, ...params, ..._x });
          return;
        }
      }
      setPayload({ ...payload, search });
    }
  }, [filters]);

  useEffect(() => {
    if (!isFetching && payload) {
      setData(formatApiResponse(params, vendorLocations, total));
    }
  }, [isFetching]);

  useEffect(() => {
    if (!fetchingCompanies && parentCompanies) {
      const _parentCompany = (parentCompanies || [])[0] || {};
      setParentCompany({
        value: _parentCompany.id,
        label: _parentCompany.name,
        code: _parentCompany.code,
      });
    }
  }, [fetchingCompanies]);

  useEffect(() => {
    if (!fetchingAssociateCompanies && associateCompanies) {
      const _associateCompany = (associateCompanies || [])[0];
      if (_associateCompany) {
        setAssociateCompany({
          value: _associateCompany.id,
          label: _associateCompany.name,
          code: _associateCompany.code,
        });
        const { search } = filterRefTest.current || { search: "" };
        setFilters({
          filters: [
            {
              columnName: "parentCompanyId",
              value: (parentCompany || {}).value,
            },
            { columnName: "associateCompanyId", value: _associateCompany.id },
          ],
          search,
        });
      }
    }
  }, [fetchingAssociateCompanies]);

  useEffect(() => {
    if (!fetchingVendorCategories && vendorCategories) {
      const _vendorCategory = (vendorCategories || [])[0];
      if (_vendorCategory) {
        setVendorCategory({
          value: _vendorCategory.id,
          label: _vendorCategory.vendorCategoryName,
        });
        const { search } = filterRefTest.current || { search: "" };
        setFilters({
          filters: [
            {
              columnName: "parentCompanyId",
              value: (parentCompany || {}).value,
            },
            {
              columnName: "associateCompanyId",
              value: (associateCompany || {}).value,
            },
            { columnName: "vendorCategoriesId", value: _vendorCategory.id },
          ],
          search,
        });
      }
    }
  }, [fetchingVendorCategories]);

  useEffect(() => {
    if (!fetchinglocation && locations && !companyLocation) {
      const _location = (locations || [])[0];
      if (_location) {
        setCompanyLocation({
          label: _location.location.name,
          value: _location.locationId,
        });
        const { search } = filterRefTest.current || { search: "" };
        setFilters({
          filters: [
            {
              columnName: "parentCompanyId",
              value: (parentCompany || {}).value,
            },
            {
              columnName: "associateCompanyId",
              value: (associateCompany || {}).value,
            },
            {
              columnName: "vendorCategoriesId",
              value: (vendorCategory || {}).value,
            },
            {
              columnName: "locationId",
              value: _location.id,
            },
          ],
          search,
        });
      }
    }
  }, [companyLocation, fetchinglocation]);
  useEffect(() => {
    locationRefetch();
  }, [associateCompany]);

  useEffect(() => {
    console.log("loca:", companyLocation);
  }, [companyLocation]);

  return (
    <>
      <MastersLayout title="Vendor Location Mapping" breadcrumbs={breadcrumb}>
        <div className="d-flex flex-column mx-0">
          <div className="card shadow d-flex flex-row justify-content-center m-3 p-3">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-end">
                <TableFilters
                  filterConfig={filterConfig}
                  // search={true}
                  onFilterChange={onFilterChange}
                // placeholder={"Search for Location Code/Name"}
                />
                <TableFilters
                  filterConfig={filterAssocioConfig}
                  // search={true}
                  onFilterChange={onFilterChange}
                // placeholder={"Search for Location Code/Name"}
                />
                <TableFilters
                  filterConfig={filterLocationConfig}
                  //search={true}
                  onFilterChange={onFilterChange}
                // placeholder={"Search for Location Code/Name"}
                />
                <TableFilters
                  filterConfig={filterVendorConfig}
                 // search={true}
                  onFilterChange={onFilterChange}
                  //placeholder={"Search for Location Code/Name"}
                />

                <TableActions buttons={buttons} />
              </div>
              <div className="d-flex justify-content-between align-items-end">

                {/* <div className="d-flex flex-column me-3" key={filter.name}>
                  <label className="filter-label"><small>{filter.label}</small></label>
                  <Select options={filter.hideAll ? [...filter.options] : [DEFAULT_OPTION, ...filter.options]}
                    defaultValue={filter.hideAll ? filter.defaultValue : DEFAULT_OPTION} value={filter.value}
                    onChange={(e: any) => handleFilterChange(filter, e)} className="select-control"
                  />
                </div> */}
              </div>
            </div>
          </div>
          <Table
            data={data}
            options={tableConfig}
            isLoading={isFetching}
            onPageNav={handlePageNav}
          />
        </div>
      </MastersLayout>

      {[ACTIONS.ADD, ACTIONS.EDIT, ACTIONS.VIEW].includes(action) && (
        <CompanyVendorLocationDetails
          action={action}
          parentCompany={parentCompany}
          associateCompany={associateCompany}
          vendorCategory={vendorCategory}
          location={companyLocation}
          data={VendorLocation}
          onClose={() => {
            setAction(ACTIONS.NONE);
            setVendorLocation(null);
          }}
          onSubmit={submitCallback}
        />
      )}

      {action === ACTIONS.IMPORT && (
        <CompanyVendorLocationsImportModal
          company={parentCompany}
          associateCompany={associateCompany}
          location={companyLocation}
          onSubmit={vendorMappingRefetch}
          onClose={() => setAction(ACTIONS.NONE)}
        />
      )}
    </>
  );
}

export default CompanyVendorLocationMappings;
