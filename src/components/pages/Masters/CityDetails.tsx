import React, { useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import { validatorTypes } from "@data-driven-forms/react-form-renderer";
import FormRenderer, { ComponentMapper, FormTemplate, componentTypes } from "../../common/FormRenderer";
import { Button } from "react-bootstrap";
import { ACTIONS } from "../../common/Constants";
import { getValue, preventDefault } from "../../../utils/common";
import { useCreateCity, useUpdateCity, useGetStates, useGetCities } from "../../../backend/masters";
import { toast } from 'react-toastify';
import { AxiosError } from "axios";
import { ERROR_MESSAGES } from "../../../utils/constants";
import { FindDuplicateMasters, GetActionTitle } from "./Master.constants";
import { DEFAULT_OPTIONS_PAYLOAD } from "../../common/Table";

function CityDetails(this: any, { action, data, onClose, onSubmit }: any) {
    const [form, setForm] = useState<any>({});
    const [city, setCity] = useState<any>({ hideButtons: true });
    const [stateId, setStateId] = useState<any>();
    const { states } = useGetStates({ ...DEFAULT_OPTIONS_PAYLOAD });
    const { cities } = useGetCities(stateId ? { ...DEFAULT_OPTIONS_PAYLOAD, filters: [{ columnName: 'stateId', value: stateId }] } : null, Boolean(stateId));

    const { updateCity } = useUpdateCity(() => {
        toast.success(`${form.values.name} updated successsfully.`);
        onSubmit();
    }, errorCallback);

    const { createCity } = useCreateCity((response: any) => {
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
                content: getValue(city, 'name')
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
                content: getValue(city, 'code')

            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.SELECT,
                name: 'state',
                label: 'State',
                options: states,
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                onChange: onStateChange.bind(this),
                content: getValue(city, 'state.label')
            },
        ],
    };

    function debugForm(_form: any) {
        setForm(_form);
        setCity(_form.values);
    }

    function onStateChange(state: any) {
        if (state) {
            setStateId(state.value);
        }
    }

    function submitCity(e: any) {
        preventDefault(e);
        if (form.valid) {
            const { code, name, state } = form.values;
            const existingData = action === ACTIONS.EDIT ? cities.filter((x: any) => x.id !== (data || {}).id) : [...cities];
            const duplicateCities = FindDuplicateMasters(existingData, { code, name });
            if (duplicateCities.length) {
                toast.error(`${duplicateCities.length} ${duplicateCities.length > 1 ? 'cities' : 'city'} matching code or name. Please update code or name`);
                return;
            }
            const payload: any = {
                code: code.toUpperCase(),
                name: name.trim(),
                stateId: state.value,
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
        if (data) {
            setCity({ ...city, ...data, state: { value: data.state.id, label: data.state.name } });
            setStateId(data.stateId);
        }
    }, [data]);

    return (
        <>
            <Modal show={true} backdrop="static" dialogClassName="drawer" animation={false}>
                <Modal.Header closeButton={true} onHide={onClose}>
                    <Modal.Title className="bg">{GetActionTitle('City', action)}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormRenderer FormTemplate={FormTemplate}
                        initialValues={city}
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