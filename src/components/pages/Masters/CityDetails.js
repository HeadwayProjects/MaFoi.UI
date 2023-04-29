import React, { useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import { componentTypes, validatorTypes } from "@data-driven-forms/react-form-renderer";
import FormRenderer, { ComponentMapper, FormTemplate } from "../../common/FormRenderer";
import { Button } from "react-bootstrap";
import { ACTIONS } from "../../common/Constants";
import { getValue, preventDefault } from "../../../utils/common";
import { useCreateCity,useUpdateCity,useGetStates } from "../../../backend/masters";
import { toast } from 'react-toastify';
import { AxiosError } from "axios";
import { ERROR_MESSAGES } from "../../../utils/constants";

function CityDetails({ action, data, onClose, onSubmit }) {
    const [form, setForm] = useState({});
    const [title, setTitle] = useState();
    const { states, isFetching, refetch } = useGetStates();

    const { updateCity } = useUpdateCity(() => {
        toast.success(`${ form.values.name} updated successsfully.`);
        onSubmit();
    }, errorCallback);

    const { createCity } = useCreateCity((response) => {
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
                label: 'City Name',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: getValue(data, 'name')
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXT_FIELD,
                name: 'code',
                label: 'City Code',
                validate: [
                    { type: validatorTypes.REQUIRED },
                    { type: validatorTypes.MAX_LENGTH, threshold: 50 },
                    { type: validatorTypes.PATTERN, pattern: /[a-zA-Z]{2}/, message: 'Should be alpha value of length 2' }
                ],
                styleClass: 'text-uppercase',
                content: getValue(data, 'code')
                
            } ,
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.SELECT,
                name: 'state',
                label: 'State',
                content: (data || {}).description,
                options: states,
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                
                content: getValue(data, 'state')
            },
        ],
    };

    function submitCity(e) {
        preventDefault(e);
        if (form.valid) {
            const { code, name,state } = form.values;
            const payload = {
                code: code.toUpperCase(),
                name,
                state,
            };
            if (action === ACTIONS.EDIT) {
                payload['id'] = data.id;
                updateCity(payload)
            } else if (action === ACTIONS.ADD) {
                createCity(payload);
            }
        }
    }

    useEffect(() => {
        if (action) {
            switch (action) {
                case ACTIONS.ADD:
                    setTitle('Add City Master');
                    break;
                case ACTIONS.EDIT:
                    setTitle('Edit City Master');
                    break;
                case ACTIONS.VIEW:
                    setTitle('View City Master');
                    break;
                default:
                    setTitle('City Master');
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
                                <Button variant="primary" onClick={submitCity} className="px-4" disabled={!form.valid}>{'Submit'}</Button>
                            </> :
                            <Button variant="primary" onClick={onClose} className="px-4 ms-auto">{'Close'}</Button>
                    }
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default CityDetails;