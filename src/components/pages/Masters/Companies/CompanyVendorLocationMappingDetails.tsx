import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { validatorTypes } from "@data-driven-forms/react-form-renderer";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  useCreateVendorLocation,
  useGetVendors,
  useUpdateVendorLocation,
} from "../../../../backend/masters";
import { API_RESULT, ERROR_MESSAGES } from "../../../../utils/constants";
import { ACTIONS } from "../../../common/Constants";
import { getValue, preventDefault } from "../../../../utils/common";
import FormRenderer, {
  ComponentMapper,
  FormTemplate,
  componentTypes,
} from "../../../common/FormRenderer";
import { GetActionTitle } from "../Master.constants";
import PageLoader from "../../../shared/PageLoader";
import { DEFAULT_OPTIONS_PAYLOAD } from "../../../common/Table";
import { ResponseModel } from "../../../../models/responseModel";
import { VENDOR_STATUSES } from "./Vendors.constants";

function CompanyVendorLocationDetails(
  this: any,
  {
    action,
    data,
    onClose,
    onSubmit,
    parentCompany,
    associateCompany,
    vendorCategory,
    location,
  }: any
) {
  const [t] = useState(new Date().getTime());
  const [form, setForm] = useState<any>({});
  const [vendorLocationMapping, setVendorLocationMapping] = useState<any>({
    hideButtons: true,
  });
  const [locationDetails, setLocationDetails] = useState<any>({
    hideButtons: true,
    ...data,
    isACtive: {
      label: data && data.isACtive ? "Active" : "Inactive",
      value: data && data.isACtive ? "Active" : "Inactive",
    },
  });

  const { vendors } = useGetVendors({
    ...DEFAULT_OPTIONS_PAYLOAD,
    sort: { columnName: "vendorName", order: "asc" },
  });
  const { createVendorLocationMapping, creating } = useCreateVendorLocation(
    ({ key, value }: ResponseModel) => {
      //alert(value);
      if (key === API_RESULT.SUCCESS) {
        toast.success(`Location created successfully.`);
        onSubmit();
      } else {
        toast.error(value || ERROR_MESSAGES.ERROR);
      }
    },
    errorCallback
  );

  const { updateVendorLocationMapping, updating } = useUpdateVendorLocation(
    ({ key, value }: ResponseModel) => {
      if (key === API_RESULT.SUCCESS) {
        toast.success(
          `Location ${locationDetails.locationName} updated successfully.`
        );
        onSubmit();
      } else {
        toast.error(value || ERROR_MESSAGES.ERROR);
      }
    },
    errorCallback
  );

  function errorCallback() {
    toast.error(ERROR_MESSAGES.DEFAULT);
  }

  const schema = {
    fields: [
      {
        component: componentTypes.PLAIN_TEXT,
        name: "companyId",
        label: "Company",
        content:
          data && data.vendorRegistrationId
            ? ((data && data.company) || {}).name
            : (parentCompany || {}).label,
      },
      {
        component: componentTypes.PLAIN_TEXT,
        name: "associateCompanyId",
        label: "Associate Company",
        content:
          data && data.vendorRegistrationId
            ? ((data && data.associateCompany) || {}).name
            : (associateCompany || {}).label,
      },
      {
        component: componentTypes.PLAIN_TEXT,
        name: "locationId",
        label: "Location",
        content:
          data && data.vendorRegistrationId
            ? ((data && data.location) || {}).name
            : (location || {}).label,
      },
      {
        component: componentTypes.PLAIN_TEXT,
        name: "vendorCategoriesId",
        label: "Vendor Category",
        content:
          data && data.vendorRegistrationId
            ? ((data && data.vendorCategories) || {}).vendorCategoryName
            : (vendorCategory || {}).label,
      },
      {
        component:
          action !== ACTIONS.ADD
            ? componentTypes.PLAIN_TEXT
            : componentTypes.SELECT,
        name: "vendorRegistrationId",
        label: "Vendor",
        options: vendors.map((v: any) => ({
          value: v.id,
          label: v.vendorName,
        })),
        content:
          action !== ACTIONS.ADD
            ? getValue(data, "vendorRegistartion.vendorName")
            : "",
      },

      {
        component:
          action === ACTIONS.VIEW
            ? componentTypes.PLAIN_TEXT
            : componentTypes.SELECT,
        name: "isACtive",
        label: "Status",
        options: VENDOR_STATUSES,
        validate: [{ type: validatorTypes.REQUIRED }],

        content:
          action === ACTIONS.ADD
            ? getValue(data, "vendorRegistartion.Status")
            : locationDetails.isACtive.label,
      },
    ],
  };

  function submit(e: any) {
    preventDefault(e);
    const { isACtive } = form.values;
    if (form.valid) {
      let payload: any = {
        vendorRegistrationId: getValue(
          form.values,
          "vendorRegistrationId.value"
        ),
        isACtive: isACtive.value === "Active",
      };
      if (action === ACTIONS.ADD) {
        payload = {
          ...payload,
          companyId: parentCompany.value,
          associateCompanyId: associateCompany.value,
          locationId: location.value,
          vendorCategoriesId: vendorCategory.value,
        };
      }
      if (action === ACTIONS.EDIT) {
        payload["id"] = data.id;
        updateVendorLocationMapping(payload);
      } else if (action === ACTIONS.ADD) {
        createVendorLocationMapping(payload);
      }
    }
  }

  function debugForm(_form: any) {
    if (action !== ACTIONS.VIEW) {
      setForm(_form);
      setLocationDetails(_form.values);
    }
  }

  useEffect(() => {
    if (data) {
      const { state, city } = data;
      setVendorLocationMapping({
        ...vendorLocationMapping,
        ...data,
      });
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
          <Modal.Title className="bg">
            {GetActionTitle("Vendor Location", action, false)}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormRenderer
            FormTemplate={FormTemplate}
            initialValues={locationDetails}
            componentMapper={ComponentMapper}
            schema={schema}
            debug={debugForm}
          />
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          {action !== ACTIONS.VIEW ? (
            <>
              <Button
                variant="outline-secondary"
                className="btn btn-outline-secondary px-4"
                onClick={onClose}
              >
                {"Cancel"}
              </Button>
              <Button
                variant="primary"
                onClick={submit}
                className="px-4"
                disabled={!form.valid}
              >
                {"Submit"}
              </Button>
            </>
          ) : (
            <Button
              variant="primary"
              onClick={onClose}
              className="px-4 ms-auto"
            >
              {"Close"}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
      {(creating || updating) && (
        <PageLoader>{creating ? "Creating..." : "Updating..."}</PageLoader>
      )}
    </>
  );
}

export default CompanyVendorLocationDetails;
