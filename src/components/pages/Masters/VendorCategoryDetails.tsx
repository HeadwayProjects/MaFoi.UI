import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { validatorTypes } from "@data-driven-forms/react-form-renderer";
import FormRenderer, {
  ComponentMapper,
  FormTemplate,
  componentTypes,
} from "../../common/FormRenderer";
import { Button } from "react-bootstrap";
import { ACTIONS } from "../../common/Constants";
import {
  useCreateVendorCategory,
  useUpdateVendorCategory,
} from "../../../backend/masters";
import { toast } from "react-toastify";
import { API_RESULT, ERROR_MESSAGES } from "../../../utils/constants";
import PageLoader from "../../shared/PageLoader";
import { getValue } from "../../../utils/common";
import { GetActionTitle } from "./Master.constants";
import { ResponseModel } from "../../../models/responseModel";

function VendorCategoryDetails({ action, data, onClose, onSubmit }: any) {
  const [form, setForm] = useState<any>({});
  const [vc, setVc] = useState<any>({ hideButtons: true });
  const { createVendorCategory, creating } = useCreateVendorCategory(
    ({ key, value }: ResponseModel) => {
      if (key === API_RESULT.SUCCESS) {
        toast.success(
          `Vendor category "${vc.vendorCategoryName}" created successfully.`
        );
        onSubmit();
      } else {
        toast.error(
          value === ERROR_MESSAGES.DUPLICATE
            ? "Vendor category name already exists."
            : ERROR_MESSAGES.ERROR
        );
      }
    },
    errorCallback
  );
  const { updateVendorCategory, updating } = useUpdateVendorCategory(
    ({ key, value }: ResponseModel) => {
      if (key === API_RESULT.SUCCESS) {
        toast.success(
          `Vendor cateogry "${vc.vendorCategoryName}" updated successfully.`
        );
        onSubmit();
      } else {
        toast.error(
          value === ERROR_MESSAGES.DUPLICATE
            ? "Vendor category already exists."
            : ERROR_MESSAGES.ERROR
        );
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
        component:
          action === ACTIONS.VIEW
            ? componentTypes.PLAIN_TEXT
            : componentTypes.TEXT_FIELD,
        name: "vendorCategoryName",
        label: "Vendor Category",
        validate: [{ type: validatorTypes.REQUIRED }],
        content: getValue(vc, "vendorCategoryName"),
      },
    ],
  };

  function debugForm(_form: any) {
    setForm(_form);
    setVc(_form.values);
  }

  function handleSubmit() {
    if (form.valid) {
      const { vendorCategoryName } = vc;
      const request: any = {
        vendorCategoryName: vendorCategoryName.trim(),
      };
      if (action === ACTIONS.EDIT) {
        request["id"] = data.id;
        updateVendorCategory(request);
      } else {
        createVendorCategory(request);
      }
    }
  }

  useEffect(() => {
    if (data) {
      setVc({ ...vc, ...data });
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
            {GetActionTitle("Vendor Category", action)}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormRenderer
            FormTemplate={FormTemplate}
            initialValues={vc}
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
                onClick={handleSubmit}
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
        <PageLoader>
          {creating
            ? "Creating Vendor Category..."
            : "Updating Vendor Category..."}
        </PageLoader>
      )}
    </>
  );
}

export default VendorCategoryDetails;
