import React, { useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import { componentTypes, validatorTypes } from "@data-driven-forms/react-form-renderer";
import FormRenderer, { ComponentMapper, FormTemplate } from "../../common/FormRenderer";
import { Button } from "react-bootstrap";
import { ACTIONS } from "../../common/Constants";
import { getValue, preventDefault } from "../../../utils/common";
import { useCreateLocation, useGetCities, useGetStates, useUpdateLocation } from "../../../backend/masters";
import { toast } from 'react-toastify';
import { AxiosError } from "axios";

function LocationDetails({ action, data, onClose, onSubmit }) {
    const [form, setForm] = useState({});
    const [title, setTitle] = useState();
    const { states, isFetching: loadingStates } = useGetStates();
    const { cities, isFetching: loadingCities } = useGetCities();
    const [locationDetails, setLocationDetails] = useState({ hideButtons: true });
    const { updateLocation } = useUpdateLocation(() => {
        toast.success(`${locationDetails.name} updated successsfully.`);
        onSubmit();
    }, () => {
        toast.error('Something went wrong! Please try again.');
    });
    const { createLocation } = useCreateLocation((response) => {
        if (response instanceof AxiosError ) {
            toast.error('Something went wrong! Please try again.');
        } else {
            toast.success(`${locationDetails.name} created successsfully.`);
            onSubmit();
        }
    }, () => {
        toast.error('Something went wrong! Please try again.');
    });

    const schema = {
        fields: [
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXT_FIELD,
                name: 'code',
                label: 'Short Code',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: getValue(locationDetails, 'code')
            },
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
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.SELECT,
                name: 'state',
                label: 'State',
                content: (data || {}).description,
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
                content: (data || {}).description,
                options: cities,
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                isDisabled: !locationDetails.state,
                isLoading: loadingCities,
                content: getValue(locationDetails, 'city.label')
            }
        ],
    };

    function onStateChange(state) {
        if (state) {
            setLocationDetails({ ...locationDetails, state, city: null });
            console.log(state);
        }
    }

    function submit(e) {
        preventDefault(e);
        if (form.valid) {
            const { code, name, state, city } = locationDetails;
            const payload = {
                code, name,
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

    function debugForm(_form) {
        setForm(_form);
        setLocationDetails(_form.values);
    }

    useEffect(() => {
        if (action) {
            switch (action) {
                case ACTIONS.ADD:
                    setTitle('Add Location Master');
                    break;
                case ACTIONS.EDIT:
                    setTitle('Edit Location Master');
                    break;
                case ACTIONS.VIEW:
                    setTitle('View Location Master');
                    break;
                default:
                    setTitle('Location Master');
            }
        }
    }, [action]);

    useEffect(() => {
        if (data) {
            const { id, code, name, states: state, cities: city } = data;
            setLocationDetails({
                ...locationDetails, id, code, name,
                state: { value: state.id, label: state.name },
                city: { value: city.id, label: city.name }
            });
        }
    }, [data])

    return (
        <>
            <Modal show={true} backdrop="static" dialogClassName="drawer" animation={false}>
                <Modal.Header closeButton={true} onHide={onClose}>
                    <Modal.Title className="bg">{title}</Modal.Title>
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
                                <Button variant="primary" onClick={submit} className="px-4" disabled={!form.valid}>{'Submit'}</Button>
                            </> :
                            <Button variant="primary" onClick={onClose} className="px-4 ms-auto">{'Close'}</Button>

                    }
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default LocationDetails;