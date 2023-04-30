import React, { useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import { componentTypes, validatorTypes } from "@data-driven-forms/react-form-renderer";
import FormRenderer, { ComponentMapper, FormTemplate } from "../../common/FormRenderer";
import { Button } from "react-bootstrap";
import { ACTIONS } from "../../common/Constants";
import { getValue, preventDefault } from "../../../utils/common";
import { useCreateAct, useGetLaws, useUpdateAct } from "../../../backend/masters";
import { GetActionTitle } from "./Master.constants";
import { toast } from "react-toastify";
import { ERROR_MESSAGES } from "../../../utils/constants";
import PageLoader from "../../shared/PageLoader";

function ActDetails({ action, data, onClose, onSubmit }) {
    const [form, setForm] = useState({});
    const [act, setAct] = useState({ hideButtons: true });
    const { laws, isFetching: loadingLaws } = useGetLaws();
    const { createAct, creating } = useCreateAct(({ id, message }) => {
        if (id) {
            toast.success(`${act.name} created successfully.`);
            onSubmit();
        } else {
            toast.error(message);
        }
    }, errorCallback);
    const { updateAct, updating } = useUpdateAct(({ id, message }) => {
        if (id) {
            toast.success(`${act.name} updated successfully.`);
            onSubmit();
        } else {
            toast.error(message);
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
                label: 'Act Name',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: getValue(data, 'name')
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXT_FIELD,
                name: 'establishmentType',
                label: 'Establishment Type',
                content: (data || {}).establishmentType,
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: getValue(data, 'establishmentType')
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.SELECT,
                name: 'law',
                label: 'Law',
                content: (data || {}).establishmentType,
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: getValue(data, 'law.name'),
                options: laws,
                isLoading: loadingLaws,
            }
        ],
    };

    function debugForm(_form) {
        setForm(_form);
        setAct(_form.values);
    }

    function submit(e) {
        preventDefault(e);
        if (form.valid) {
            const { name, establishmentType, law } = act;
            const request = {
                name, establishmentType,
                lawId: law.value
            };

            if (action === ACTIONS.EDIT) {
                request['id'] = data.id;
                updateAct(request);
            } else {
                createAct(request);
            }
        }
    }

    useEffect(() => {
        if (data) {
            setAct({ ...act, ...data });
        }
    }, [data]);

    return (
        <>
            <Modal show={true} backdrop="static" dialogClassName="drawer" animation={false}>
                <Modal.Header closeButton={true} onHide={onClose}>
                    <Modal.Title className="bg">{GetActionTitle('Act', action)}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormRenderer FormTemplate={FormTemplate}
                        initialValues={act}
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
                                <Button variant="primary" onClick={submit} className="px-4" disabled={!form.valid}>{'Submit'}</Button>
                            </> :
                            <Button variant="primary" onClick={onClose} className="px-4 ms-auto">{'Close'}</Button>

                    }
                </Modal.Footer>
            </Modal>
            {
                (creating || updating) &&
                <PageLoader>
                    {creating ? 'Creating Act...' : 'Updating Act...'}
                </PageLoader>
            }
        </>
    )
}

export default ActDetails;