import React, { useEffect, useState } from "react";
import { useGetVendors } from "../../../../backend/masters";
import { toast } from "react-toastify";
import { ERROR_MESSAGES } from "../../../../utils/constants";
import Icon from "../../../common/Icon";
import { VIEWS } from "./Companies";
import { ACTIONS, TOOLTIP_DELAY } from "../../../common/Constants";
import Table, {
  CellTmpl,
  DEFAULT_PAYLOAD,
  TitleTmpl,
  reactFormatter,
} from "../../../common/Table";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import PageLoader from "../../../shared/PageLoader";
import { downloadFileContent } from "../../../../utils/common";
import TableFilters from "../../../common/TableFilter";
import { useRef } from "react";
import { useExportVendors } from "../../../../backend/exports";

function VendorList({ changeView }: any) {
  const [t] = useState(new Date().getTime());
  const [data, setData] = useState<any>();
  const [params, setParams] = useState<any>();
  const [filters, setFilters] = useState<any>({
    search: "",
  });
  const filterRef: any = useRef();
  filterRef.current = filters;
  const [payload, setPayload] = useState<any>({
    ...DEFAULT_PAYLOAD,
    sort: { columnName: "vendorName", order: "asc" },
    ...filterRef.current,
    t,
  });
  const { vendors, total, isFetching, refetch, invalidate } = useGetVendors(
    payload,
    Boolean(payload)
  );

  const { exportVendors, exporting } = useExportVendors(
    (response: any) => {
      downloadFileContent({
        name: "Vendors.xlsx",
        type: response.headers["content-type"],
        content: response.data,
      });
    },
    () => {
      toast.error(ERROR_MESSAGES.DEFAULT);
    }
  );

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
            changeView(VIEWS.EDIT, { vendor: row });
          }}
        />
      </div>
    );
  }

  function NameTmpl({ cell }: any) {
    const value = cell.getValue();
    const row = cell.getData();
    return (
      <div className="d-flex align-items-center h-100">
        {row.logo && (
          <img
            src={row.logo}
            width={"30px"}
            height={"30px"}
            className="me-2 rounded-circle"
            alt="Company Logo"
          />
        )}
        <OverlayTrigger
          overlay={<Tooltip>{value}</Tooltip>}
          placement="bottom"
          delay={{ show: TOOLTIP_DELAY } as any}
        >
          <div className="d-flex align-items-center h-100">
            <div className="ellipse two-lines">{value}</div>
          </div>
        </OverlayTrigger>
      </div>
    );
  }

  const columns = [
    {
      title: "Name",
      field: "vendorName",
      widthGrow: 2,
      formatter: reactFormatter(<NameTmpl />),
      titleFormatter: reactFormatter(<TitleTmpl />),
    },
    {
      title: "State",
      field: "state.code",
      formatter: reactFormatter(<CellTmpl />),
      titleFormatter: reactFormatter(<TitleTmpl />),
    },
    {
      title: "City",
      field: "city.name",
      minWidth: 140,
      formatter: reactFormatter(<CellTmpl />),
      titleFormatter: reactFormatter(<TitleTmpl />),
    },
    {
      title: "Address",
      field: "address",
      minWidth: 140,
      formatter: reactFormatter(<CellTmpl />),
      titleFormatter: reactFormatter(<TitleTmpl />),
    },

    {
      title: "ESI Number",
      field: "esiC_No",
      maxWidth: 200,
      formatter: reactFormatter(<CellTmpl />),
      titleFormatter: reactFormatter(<TitleTmpl />),
      headerSort: false,
    },
    {
      title: "RC no",
      field: "registration_Certificate_No",
      maxWidth: 200,
      formatter: reactFormatter(<CellTmpl />),
      titleFormatter: reactFormatter(<TitleTmpl />),
      headerSort: false,
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
    initialSort: [{ column: "vendorName", dir: "asc" }],
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
        columnName: field || "vendorName",
        order: dir || "asc",
      },
    };
    setParams(_params);
    setPayload({ ...DEFAULT_PAYLOAD, ...filterRef.current, ..._params, t });
    return Promise.resolve(formatApiResponse(params, vendors, total));
  }

  // function deleteCompanyMaster() {
  //   deleteCompany(company.id);
  // }

  function onFilterChange(e: any) {
    const _filters = { ...e };
    setFilters(_filters);
    setPayload({ ...DEFAULT_PAYLOAD, ...params, ..._filters, t });
  }

  function handlePageNav(_pagination: any) {
    const _params = { ...params };
    _params.pagination = _pagination;
    setParams({ ..._params });
    setPayload({ ...payload, ..._params, t });
  }

  function handleExport() {
    if (total > 0) {
      exportVendors({ ...payload, pagination: null });
    }
  }

  useEffect(() => {
    if (!isFetching && payload) {
      setTimeout(() => {
        setData(formatApiResponse(params, vendors, total));
      });
    }
  }, [isFetching]);

  useEffect(() => {
    return () => {
      invalidate();
    };
  }, []);

  return (
    <>
      <div className="d-flex flex-column mx-0">
        <div className="card shadow d-flex flex-row justify-content-center m-3 p-3">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-end">
              <TableFilters
                search={true}
                onFilterChange={onFilterChange}
                placeholder={"Search for Vendors"}
              />
              <div className="d-flex">
                <Button
                  variant="primary"
                  className="px-3 text-nowrap me-3"
                  onClick={handleExport}
                  disabled={!total}
                >
                  <Icon name={"download"} className="me-2"></Icon>Export
                </Button>
                <Button
                  variant="primary"
                  className="px-3 ms-auto text-nowrap"
                  onClick={() => changeView(VIEWS.ADD)}
                >
                  <Icon name={"plus"} className="me-2"></Icon>Add New
                </Button>
              </div>
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
      {exporting && <PageLoader message={"Preparing data..."} />}
    </>
  );
}

export default VendorList;
