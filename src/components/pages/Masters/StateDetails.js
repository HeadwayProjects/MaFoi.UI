import React, { useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import { componentTypes, validatorTypes } from "@data-driven-forms/react-form-renderer";
import FormRenderer, { ComponentMapper, FormTemplate } from "../../common/FormRenderer";
import { Button } from "react-bootstrap";
import { ACTIONS } from "../../common/Constants";
import { getValue, preventDefault } from "../../../utils/common";
import { useCreateState, useGetStates, useUpdateState } from "../../../backend/masters";
import { toast } from 'react-toastify';
import { AxiosError } from "axios";
import { ERROR_MESSAGES } from "../../../utils/constants";
import { FindDuplicateMasters } from "./Master.constants";
import { DEFAULT_OPTIONS_PAYLOAD } from "../../common/Table";

function StateDetails({ action, data, onClose, onSubmit }) {
    const [form, setForm] = useState({});
    const [title, setTitle] = useState();
    const [defaultTime] = useState(new Date().getTime())
    const { states } = useGetStates({ ...DEFAULT_OPTIONS_PAYLOAD, t: defaultTime });

    const { updateState } = useUpdateState(() => {
        toast.success(`${form.values.name} updated successsfully.`);
        onSubmit();
    }, errorCallback);

    const { createState } = useCreateState((response) => {
        if (response instanceof AxiosError) {
            errorCallback();
        } else {
            toast.success(`${form.values.name} created successsfully.`);
            onSubmit();
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
                label: 'State Name',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: getValue(data, 'name')
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXT_FIELD,
                name: 'code',
                label: 'State Code',
                validate: [
                    { type: validatorTypes.REQUIRED },
                    { type: validatorTypes.MAX_LENGTH, threshold: 2 },
                    { type: validatorTypes.PATTERN, pattern: /[a-zA-Z]{2}/, message: 'Should be alpha value of length 2' }
                ],
                styleClass: 'text-uppercase',
                content: getValue(data, 'code')

            }
        ],
    };

    function submitState(e) {
        preventDefault(e);
        if (form.valid) {
            const { code, name } = form.values;
            const existingData = states.filter(x => x.id !== (data || {}).id);
            const duplicateStates = FindDuplicateMasters(existingData, { code, name });
            if (duplicateStates.length) {
                toast.error(`${duplicateStates.length} state(s) matching code or name. Please update code or name`);
                return;
            }
            const payload = {
                code: code.toUpperCase(),
                name: name.trim()
            };
            if (action === ACTIONS.EDIT) {
                payload['id'] = data.id;
                updateState(payload)
            } else if (action === ACTIONS.ADD) {
                createState(payload);
            }
        }
    }

    useEffect(() => {
        if (action) {
            switch (action) {
                case ACTIONS.ADD:
                    setTitle('Add State Master');
                    break;
                case ACTIONS.EDIT:
                    setTitle('Edit State Master');
                    break;
                case ACTIONS.VIEW:
                    setTitle('View State Master');
                    break;
                default:
                    setTitle('State Master');
            }
        }
    }, [action]);

    return (
        <>
            <Modal show={true} backdrop="static" dialogClassName="drawer" animation={false}>
                <Modal.Header closeButton={true} onHide={onClose}>
                    <Modal.Title className="bg">{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormRenderer FormTemplate={FormTemplate}
                        initialValues={{ hideButtons: true, ...data }}
                        componentMapper={ComponentMapper}
                        schema={schema}
                        debug={setForm}
                    />
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-between">
                    {
                        action !== ACTIONS.VIEW ?
                            <>
                                <Button variant="outline-secondary" className="btn btn-outline-secondary px-4" onClick={onClose}>{'Cancel'}</Button>
                                <Button variant="primary" onClick={submitState} className="px-4" disabled={!form.valid}>{'Submit'}</Button>
                            </> :
                            <Button variant="primary" onClick={onClose} className="px-4 ms-auto">{'Close'}</Button>

                    }
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default StateDetails;