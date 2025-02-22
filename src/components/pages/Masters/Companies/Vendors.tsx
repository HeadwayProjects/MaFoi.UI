import React, { useEffect, useState } from "react";
import { GetMastersBreadcrumb } from "../Master.constants";
import VendorList from "./vendorList";
import MastersLayout from "../MastersLayout";
import { preventDefault } from "../../../../utils/common";
import AddEditVendor from "./AddEditVendor";

export enum VIEWS {
  LIST = "list",
  ADD = "add",
  EDIT = "edit",
  VIEW = "view",
  ASSOCIATE_COMPANIES = "associate_companies",
}

function Vendors() {
  const [view, setView] = useState(VIEWS.LIST);
  const [breadcrumb, setBreadcrumb] = useState(GetMastersBreadcrumb("Vendors"));
  const [viewData, setViewData] = useState<any>(null);

  function changeView(view: VIEWS, data: any) {
    setViewData(data || null);
    setView(view);
  }

  useEffect(() => {
    if (view) {
      const _bc: any = [...GetMastersBreadcrumb("Companies")];
      if (view === VIEWS.ASSOCIATE_COMPANIES) {
        _bc[2].action = (event: any) => {
          preventDefault(event);
          setView(VIEWS.LIST);
        };
        _bc[2].path = "/";
        _bc.push({ id: "ac", label: "Associate Companies" });
      }
      setBreadcrumb(_bc);
    }
  }, [view]);

  return (
    <MastersLayout title="Manage Vendors" breadcrumbs={breadcrumb}>
      {view === VIEWS.LIST && <VendorList changeView={changeView} />}
      {[VIEWS.ADD, VIEWS.EDIT].includes(view) && (
        <AddEditVendor changeView={changeView} {...viewData} />
      )}
    </MastersLayout>
  );
}

export default Vendors;
