import React, { useState } from "react";
import { preventDefault } from "../../../../utils/common";
import { VIEWS } from "./Companies";
import { API_RESULT, ERROR_MESSAGES } from "../../../../utils/constants";
import VendorDetails from "./VendorDetails";
import { useCreateVendor, useUpdateVendor } from "../../../../backend/masters";
import PageLoader from "../../../shared/PageLoader";
import { toast } from "react-toastify";
import { ResponseModel } from "../../../../models/responseModel";
import { IVendor } from "../../../../models/vendor";

function AddEditVendor({ vendor, changeView, _t }: any) {
  const [payload, setPayload] = useState<any>();
  const [vendorDetails, setVendorDetails] = useState<any>(vendor);

  const { createVendor, creating } = useCreateVendor(
    ({ key, value }: ResponseModel) => {
      if (key === API_RESULT.SUCCESS) {
        toast.success(`Vendort ${payload.vendorName} created successfully.`);
        setVendorDetails({ ...payload, id: value });
        changeView(VIEWS.LIST);
      } else {
        toast.error(
          value === "DUPLICATE"
            ? "Vendor with similar name or code already exists."
            : value || ERROR_MESSAGES.ERROR || "An unknown error occurred."
        );
      }
    },
    errorCallback
  );
  const { updateVendor, updating } = useUpdateVendor(
    ({ key, value }: ResponseModel) => {
      if (key === API_RESULT.SUCCESS) {
        toast.success(`Vendor ${payload.vendorName} updated successfully.`);
        setVendorDetails(payload);
        setPayload(null);
      } else {
        toast.error(
          value === "DUPLICATE"
            ? "Vendor with similar name or code already exists."
            : value || ERROR_MESSAGES.ERROR
        );
      }
    },
    errorCallback
  );

  function errorCallback() {
    toast.error(ERROR_MESSAGES.DEFAULT);
  }

  function backToVendorsList(e?: any) {
    preventDefault(e);
    changeView(VIEWS.LIST);
  }

  function submitDetails(_vendor: IVendor, next: string) {
    if (_vendor) {
      setPayload(_vendor);
      if (vendorDetails) {
        updateVendor(_vendor);
      } else {
        createVendor(_vendor as any);
      }
    }
  }

  return (
    <>
      <div className="d-flex flex-column h-full position-relative">
        <VendorDetails
          vendor={vendor}
          _t={_t}
          onSubmit={submitDetails}
          onPrevious={backToVendorsList}
        />
      </div>
      {(creating || updating) && (
        <PageLoader>
          {creating ? "Creating Vendor..." : "Updating Vendor..."}
        </PageLoader>
      )}
    </>
  );
}

export default AddEditVendor;
