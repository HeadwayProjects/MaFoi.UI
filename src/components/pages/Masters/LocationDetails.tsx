import React, { useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import { validatorTypes } from "@data-driven-forms/react-form-renderer";
import FormRenderer, { ComponentMapper, FormTemplate, componentTypes } from "../../common/FormRenderer";
import { Button } from "react-bootstrap";
import { ACTIONS } from "../../common/Constants";
import { getValue, preventDefault } from "../../../utils/common";
import {
    useCreateLocation, useGetCities, useGetLocations,
    useGetStates, useUpdateLocation
} from "../../../backend/masters";
import { toast } from 'react-toastify';
import { AxiosError } from "axios";
import { ERROR_MESSAGES } from "../../../utils/constants";
import { FindDuplicateMasters, GetActionTitle } from "./Master.constants";

function LocationDetails(this: any, { action, data, onClose, onSubmit }: any) {
    const [form, setForm] = useState<any>({});
    const [stateId, setStateId] = useState<any>();
    const [cityId, setCityId] = useState<any>();
    const { states, isFetching: loadingStates } = useGetStates(null);
    const { cities, isFetching: loadingCities } = useGetCities(stateId ? { stateId } : null, Boolean(stateId));
    const { locations, isFetching: loadingLocations } = useGetLocations(stateId && cityId ? { stateId, cityId } : null, Boolean(stateId) && Boolean(cityId));
    const [locationDetails, setLocationDetails] = useState<any>({ hideButtons: true });
    const { updateLocation } = useUpdateLocation(() => {
        toast.success(`${locationDetails.name} updated successfully.`);
        onSubmit();
    }, errorCallback);
    const { createLocation } = useCreateLocation((response: any) => {
        if (response instanceof AxiosError) {
            errorCallback();
        } else {
            toast.success(`${locationDetails.name} created successfully.`);
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
                label: 'Location Name',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: getValue(locationDetails, 'name')
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXT_FIELD,
                name: 'code',
                label: 'Short Code',
                validate: [
                    { type: validatorTypes.REQUIRED },
                    { type: validatorTypes.MAX_LENGTH, threshold: 4 },
                    { type: validatorTypes.PATTERN, pattern: /^[a-zA-Z0-9]{3,4}$/, message: 'Should be alphanumeric value of length 3 or 4' }
                ],
                styleClass: 'text-uppercase',
                content: getValue(locationDetails, 'code')
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
                isLoading: loadingStates,
                content: getValue(locationDetails, 'state.label')
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.SELECT,
                name: 'city',
                label: 'City',
                options: cities,
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                onChange: onCityChange.bind(this),
                isDisabled: !locationDetails.state,
                isLoading: loadingCities,
                content: getValue(locationDetails, 'city.label')
            }
        ],
    };

    function onStateChange(state: any) {
        if (state) {
            setLocationDetails({ ...locationDetails, state, city: null });
            setStateId(state.value);
        }
    }

    function onCityChange(city: any) {
        if (city) {
            setCityId(city.value);
        }
    }

    function submit(e: any) {
        preventDefault(e);
        if (form.valid) {
            const { code, name, state, city } = locationDetails;
            const existingData = action === ACTIONS.EDIT ? locations.filter((x: any) => x.id !== (data || {}).id) : [...locations];
            const duplicateLocations = FindDuplicateMasters(existingData, { code, name });
            if (duplicateLocations.length) {
                toast.error(`${duplicateLocations.length} location(s) matching code or name. Please update code or name`);
                return;
            }
            const payload: any = {
                code: code.toUpperCase(),
                name,
                stateId: state.value,
                cityId: city.value
            };
            if (action === ACTIONS.EDIT) {
                payload['id'] = data.id;
                updateLocation(payload)
            } else if (action === ACTIONS.ADD) {
                createLocation(payload);
            }
        }
    }

    function debugForm(_form: any) {
        setForm(_form);
        setLocationDetails(_form.values);
    }

    useEffect(() => {
        if (data) {
            const { id, code, name, states: state, cities: city } = data;
            setLocationDetails({
                ...locationDetails, id, code, name,
                state: { value: state.id, label: state.name },
                city: { value: city.id, label: city.name }
            });
            setStateId(state.id);
        }
    }, [data])

    return (
        <>
            <Modal show={true} backdrop="static" dialogClassName="drawer" animation={false}>
                <Modal.Header closeButton={true} onHide={onClose}>
                    <Modal.Title className="bg">{GetActionTitle('Location', action)}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormRenderer FormTemplate={FormTemplate}
                        initialValues={locationDetails}
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
                                <Button variant="primary" onClick={submit} className="px-4" disabled={!form.valid || loadingLocations}>{'Submit'}</Button>
                            </> :
                            <Button variant="primary" onClick={onClose} className="px-4 ms-auto">{'Close'}</Button>

                    }
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default LocationDetails;