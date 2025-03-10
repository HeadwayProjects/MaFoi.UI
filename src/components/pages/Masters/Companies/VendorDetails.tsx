import React, { useEffect, useState } from "react";
import FormRenderer, {
  ComponentMapper,
  FormTemplate,
  componentTypes,
} from "../../../common/FormRenderer";
import { validatorTypes } from "@data-driven-forms/react-form-renderer";
import { Button } from "react-bootstrap";
import { useGetCities, useGetStates } from "../../../../backend/masters";
import { DEFAULT_OPTIONS_PAYLOAD } from "../../../common/Table";
import { VENDOR_STATUSES, VENDORT_REQUEST } from "./Vendors.constants";

function VendorDetails(this: any, { onPrevious, onSubmit, vendor, _t }: any) {
  const [t] = useState(_t || new Date().getTime());
  const [form, setForm] = useState<any>({});
  const [vendorDetails, setVendorDetails] = useState<any>({});
  const [stateId, setStateId] = useState<any>(null);

  const { states, isFetching: fetchingStates } = useGetStates({
    ...DEFAULT_OPTIONS_PAYLOAD,
  });
  const { cities, isFetching: fetchingCities } = useGetCities(
    {
      ...DEFAULT_OPTIONS_PAYLOAD,
      filters: [{ columnName: "stateId", value: (stateId || {}).value }],
    },
    Boolean(stateId)
  );

  function debugForm(_form: any) {
    setForm(_form);
    setVendorDetails(_form.values);
    const selectedStateId = _form.values.stateId;
    if (selectedStateId !== stateId) {
      setStateId(selectedStateId);
    }
  }

  const schema = {
    fields: [
      {
        component: componentTypes.TEXT_FIELD,
        name: "vendorName",
        label: "Vendor Name",
        validate: [
          { type: validatorTypes.REQUIRED },
          {
            type: validatorTypes.PATTERN,
            pattern: "^[a-zA-Z0-9 &]{5,}$",
            message: "Name must be alphanumeric,Min 5 characters ,can include '&'.",
          }
        ],
      },
      {
        component: componentTypes.SELECT,
        name: "stateId",
        label: "State",
        validate: [{ type: validatorTypes.REQUIRED }],
        options: states,
        isLoading: fetchingStates,
      },
      {
        component: componentTypes.SELECT,
        name: "cityId",
        label: "City",
        validate: [{ type: validatorTypes.REQUIRED }],
        options: cities,
        isDisabled: !Boolean(stateId),
        isLoading: fetchingCities,
      },
      {
        component: componentTypes.TEXT_FIELD,
        name: "address",
        label: "Address",
        validate: [
          { type: validatorTypes.REQUIRED },
          {
            type: validatorTypes.PATTERN,
            pattern: "^.{1,65}$",
            message: "Address can contain only 1 to 65 characters long.",
          }
        ],
      },
      {
        component: componentTypes.TEXT_FIELD,
        name: "pf_Registration_No",
        label: "PF Registration Number",
      },
      {
        component: componentTypes.TEXT_FIELD,
        name: "esiC_No",
        label: "ESIC number",
      },
      {
        component: componentTypes.TEXT_FIELD,
        name: "registration_Certificate_No",
        label: "Registration Certification Number",
        validate: [
          { type: validatorTypes.REQUIRED },
          {
            type: validatorTypes.PATTERN,
            pattern: /^[a-zA-Z0-9]{5,}$/,
            message: "Must be alphanumeric with at least 5 characters",
          },
        ],
      },
      // {
      //   component: componentTypes.TEXT_FIELD,
      //   name: "contract_Labour_Licence_No",
      //   label: "Contract Labour Licence Number",
      // },
      {
        component: componentTypes.TEXT_FIELD,
        name: "contact_Person_Name",
        label: "Contact Person",
      },
      {
        component: componentTypes.TEXT_FIELD,
        label: "Email Address",
        name: "email_Address",
        type: "email",
        validate: [
          { type: validatorTypes.REQUIRED },
          {
            type: validatorTypes.PATTERN,
            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: "Enter a valid email address (e.g., user@example.com)",
          },
        ],
      },
      {
        component: componentTypes.TEXT_FIELD,
        label: "Mobile Number",
        name: "mobile_Number",
        type: "phone",
        validate: [
          { type: validatorTypes.REQUIRED },
          {
            type: validatorTypes.PATTERN,
            pattern: /^[0-9]{10}$/,
            message: "Enter a valid 10-digit mobile number",
          },
        ],
      },
      {
        component: componentTypes.TEXT_FIELD,
        name: "designation",
        label: "Designation",
      },
      // {
      //   component: componentTypes.TEXT_FIELD,
      //   name: "signature",
      //   label: "Signature",
      // },

      {
        component: componentTypes.SELECT,
        name: "is_ACtive",
        label: "Status",
        options: VENDOR_STATUSES,
        validate: [{ type: validatorTypes.REQUIRED }],
      },
    ],
  };

  function handleSubmit() {
    if (form.valid) {
      const {
        vendorName,
        is_ACtive,
        cityId,
        stateId,
        signature,
        mobile_Number,
        email_Address,
        contact_Person_Name,
        contract_Labour_Licence_No,
        registration_Certificate_No,
        esiC_No,
        pf_Registration_No,
        address,
        designation,
      } = form.values;
      const payload = {
        ...VENDORT_REQUEST,
        ...vendor,
        vendorName: vendorName.trim(),
        is_ACtive: is_ACtive.value === "Active",
        cityId: cityId.value,
        stateId: stateId.value,
        signature,
        mobile_Number,
        email_Address,
        contact_Person_Name,
        contract_Labour_Licence_No,
        registration_Certificate_No,
        esiC_No,
        pf_Registration_No,
        address,
        designation,
      };
      onSubmit(payload);
    }
  }


  //newly added for submit btn alignment
  useEffect(() => {
    setVendorDetails({
      hideButtons: true,
      ...vendor,
    });

    // end

    if (vendor) {
      const { is_ACtive } = vendor || {};
      setVendorDetails({
        hideButtons: true,
        ...vendor,
        cityId: { label: vendor.city.name, value: vendor.cityId },
        stateId: { label: vendor.state.name, value: vendor.stateId },
        is_ACtive: is_ACtive
          ? { value: "Active", label: "Active" }
          : { value: "Inactive", label: "Inactive" },
      });
    }
  }, [vendor]);

  return (
    <>
      <div className="card border-0 p-4 m-4 ">
        <div className="d-flex flex-column h-100 justify-space-between p-4 horizontal-form">
          <FormRenderer
            FormTemplate={FormTemplate}
            initialValues={vendorDetails}
            componentMapper={ComponentMapper}
            schema={schema}
            debug={debugForm}
            //onSubmit={handleSubmit}
          />
          <div className="d-flex justify-content-between mt-4">
            <div>
              <Button
                variant="outline-secondary"
                className="btn btn-outline-secondary px-4"
                onClick={onPrevious}
              >
                {"Back to List"}
              </Button>
            </div>
            <div className="d-flex align-items-center">
              {Boolean(vendor) ? (
                <Button
                  variant="primary"
                  onClick={() => handleSubmit()}
                  className="px-4"
                  disabled={!form.valid}
                >
                  {"Save"}
                </Button>
              ) : <Button
                variant="primary"
                onClick={() => handleSubmit()}
                className="px-4"
                disabled={!form.valid}
              >
                {"Submit"}
              </Button>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default VendorDetails;
