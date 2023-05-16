import React, { useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import { componentTypes, validatorTypes } from "@data-driven-forms/react-form-renderer";
import FormRenderer, { ComponentMapper, FormTemplate } from "../../common/FormRenderer";
import { Button } from "react-bootstrap";
import { ACTIONS } from "../../common/Constants";
import { useCreateLaw, useUpdateLaw } from "../../../backend/masters";
import { toast } from "react-toastify";
import { ERROR_MESSAGES } from "../../../utils/constants";
import PageLoader from "../../shared/PageLoader";
import { getValue } from "../../../utils/common";
import { GetActionTitle } from "./Master.constants";

function LawDetails({ action, data, onClose, onSubmit }) {
    const [form, setForm] = useState({});
    const [law, setLaw] = useState({ hideButtons: true });
    const { createLaw, creating } = useCreateLaw(({ id, message }) => {
        if (id) {
            toast.success(`${law.name} created successfully.`);
            onSubmit();
        } else {
            toast.error(message || ERROR_MESSAGES.ERROR);
        }
    }, errorCallback);
    const { updateLaw, updating } = useUpdateLaw(({ id, message }) => {
        if (id) {
            toast.success(`${law.name} updated successfully.`);
            onSubmit();
        } else {
            toast.error(message || ERROR_MESSAGES.ERROR);
        }
    }, errorCallback);

    function errorCallback() {
        toast.error(ERROR_MESSAGES.DEFAULT);
    }

    const schema = {
        fields: [
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXT_FIELD,
                name: 'name',
                label: 'Law Name',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: getValue(law, 'name')
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXTAREA,
                name: 'description',
                label: 'Description',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: getValue(law, 'description')
            }
        ],
    };

    function debugForm(_form) {
        setForm(_form);
        setLaw(_form.values);
    }

    function handleSubmit() {
        if (form.valid) {
            const { name, description } = law;
            const request = { name, description };
            if (action === ACTIONS.EDIT) {
                request['id'] = data.id;
                updateLaw(request);
            } else {
                createLaw(request);
            }
        }
    }

    useEffect(() => {
        if (data) {
            setLaw({ ...law, ...data });
        }
    }, [data]);

    return (
        <>
            <Modal show={true} backdrop="static" dialogClassName="drawer" animation={false}>
                <Modal.Header closeButton={true} onHide={onClose}>
                    <Modal.Title className="bg">{GetActionTitle('Law', action)}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormRenderer FormTemplate={FormTemplate}
                        initialValues={law}
                        componentMapper={ComponentMapper}
                        schema={schema}
                        debug={debugForm}
                    />
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-between">
                    {
                        action !== ACTIONS.VIEW ?
                            <>
                                <Button variant="outline-secondary" className="btn btn-outline-secondary px-4" onClick={onClose}>{'Cancel'}</Button>
                                <Button variant="primary" onClick={handleSubmit} className="px-4" disabled={!form.valid}>{'Submit'}</Button>
                            </> :
                            <Button variant="primary" onClick={onClose} className="px-4 ms-auto">{'Close'}</Button>

                    }
                </Modal.Footer>
            </Modal>
            {
                (creating || updating) &&
                <PageLoader>
                    {creating ? 'Creating Law...' : 'Updating Law...'}
                </PageLoader>
            }
        </>
    )
}

export default LawDetails;