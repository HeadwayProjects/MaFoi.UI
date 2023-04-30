import React, { useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import { componentTypes, validatorTypes } from "@data-driven-forms/react-form-renderer";
import FormRenderer, { ComponentMapper, FormTemplate } from "../../common/FormRenderer";
import { Button } from "react-bootstrap";
import { ACTIONS } from "../../common/Constants";
import { getValue } from "../../../utils/common";
import { ActivityType, CalendarType, GetActionTitle, Periodicity } from "./Master.constants";
import { useCreateActivity, useUpdateActivity } from "../../../backend/masters";
import { toast } from "react-toastify";
import { ERROR_MESSAGES } from "../../../utils/constants";
import PageLoader from "../../shared/PageLoader"

function ActivityDetails({ action, data, onClose, onSubmit }) {
    const [form, setForm] = useState({});
    const [activity, setActivity] = useState({ hideButtons: true })
    const { createActivity, creating } = useCreateActivity(({ id, message }) => {
        if (id) {
            onSubmit();
        } else {
            toast.error(message);
        }
    }, errorCallback);
    const { updateActivity, updating } = useUpdateActivity(() => ({ id, message }) => {
        if (id) {
            onSubmit();
        } else {
            toast.error(message);
        }
    }, errorCallback);

    const schema = {
        fields: [
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXT_FIELD,
                name: 'name',
                label: 'Activity',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: action === ACTIONS.VIEW ? getValue(activity, 'name') : ''
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.SELECT : componentTypes.TEXT_FIELD,
                name: 'type',
                label: 'Activity Type',
                options: ActivityType.map(x => {
                    return { id: x, name: x };
                }),
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: action === ACTIONS.VIEW ? getValue(activity, 'type') : ''
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.SELECT : componentTypes.SELECT,
                name: 'periodicity',
                label: 'Periodicity',
                options: Periodicity.map(x => {
                    return { id: x, name: x };
                }),
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: action === ACTIONS.VIEW ? getValue(activity, 'periodicity.label') : ''
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.SELECT : componentTypes.SELECT,
                name: 'calendarType',
                label: 'Calendar Type',
                options: CalendarType.map(x => {
                    return { id: x, name: x };
                }),
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: action === ACTIONS.VIEW ? getValue(activity, 'calendarType.label') : ''
            }
        ]
    };

    function debugForm(_form) {
        setForm(_form);
        setActivity(_form.values);
    }

    function errorCallback() {
        toast.error(ERROR_MESSAGES.DEFAULT);
    }

    function onSubmit() {
        if (form.valid) {
            const { name, type, periodicity, calendarType } = form.values;
            const payload = {
                name,
                type,
                periodicity: periodicity.value,
                calendarType: calendarType.value,
            };
            if (action === ACTIONS.ADD) {
                createActivity(payload);
            } else if (action === ACTIONS.EDIT) {
                updateActivity(payload);
            }
        }
    }

    useEffect(() => {
        if (data) {
            const { name, type, periodicity, calendarType } = data;
            setActivity({
                ...activity,
                name,
                type,
                periodicity: periodicity ? { value: periodicity, label: periodicity } : null,
                calendarType: calendarType ? { value: calendarType, label: calendarType } : null
            });
        }
    }, [data]);

    return (
        <>
            <Modal show={true} backdrop="static" dialogClassName="drawer" animation={false}>
                <Modal.Header closeButton={true} onHide={onClose}>
                    <Modal.Title className="bg">{GetActionTitle('Activity', action)}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormRenderer FormTemplate={FormTemplate}
                        initialValues={activity}
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
                                <Button variant="primary" onClick={onSubmit} className="px-4" disabled={!form.valid}>{'Submit'}</Button>
                            </> :
                            <Button variant="primary" onClick={onClose} className="px-4 ms-auto">{'Close'}</Button>

                    }
                </Modal.Footer>
            </Modal>
            {
                (creating || updating) &&
                <PageLoader>
                    {creating ? 'Adding...' : 'Updating...'}
                </PageLoader>
            }
        </>
    )
}

export default ActivityDetails;