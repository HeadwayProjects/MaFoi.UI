import React, { useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import { validatorTypes } from "@data-driven-forms/react-form-renderer";
import FormRenderer, { ComponentMapper, FormTemplate, componentTypes } from "../../common/FormRenderer";
import { Button } from "react-bootstrap";
import { ACTIONS } from "../../common/Constants";
import { getValue } from "../../../utils/common";
import { ActivityType, CalendarType, GetActionTitle, Periodicity } from "./Master.constants";
import { useCreateActivity, useUpdateActivity } from "../../../backend/masters";
import { toast } from "react-toastify";
import { API_RESULT, ERROR_MESSAGES } from "../../../utils/constants";
import PageLoader from "../../shared/PageLoader"
import { ResponseModel } from "../../../models/responseModel";

function ActivityDetails({ action, data, onClose, onSubmit }: any) {
    const [form, setForm] = useState<any>({});
    const [activity, setActivity] = useState<any>({ hideButtons: true })
    const { createActivity, creating } = useCreateActivity(({ key, value }: ResponseModel) => {
        if (key === API_RESULT.SUCCESS) {
            toast.success(`${activity.name} created successfully.`);
            onSubmit();
        } else {
            toast.error(value === ERROR_MESSAGES.DUPLICATE ? 'A similar combination of activity already exists.' : ERROR_MESSAGES.ERROR);
        }
    }, errorCallback);
    const { updateActivity, updating } = useUpdateActivity(({ key, value }: ResponseModel) => {
        if (key === API_RESULT.SUCCESS) {
            toast.success(`${activity.name} updated successfully.`);
            onSubmit();
        } else {
            toast.error(value === ERROR_MESSAGES.DUPLICATE ? 'A similar combination of activity already exists.' : ERROR_MESSAGES.ERROR);
        }
    }, errorCallback);

    const schema = {
        fields: [
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.INPUT_AS_TEXT,
                name: 'name',
                label: 'Activity',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: action === ACTIONS.VIEW ? getValue(activity, 'name') : ''
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.SELECT,
                name: 'type',
                label: 'Activity Type',
                options: ActivityType.map(x => {
                    return { id: x, name: x };
                }),
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: action === ACTIONS.VIEW ? getValue(activity, 'type.label') : ''
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.SELECT,
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
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.SELECT,
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

    function debugForm(_form: any) {
        setForm(_form);
        setActivity(_form.values);
    }

    function errorCallback() {
        toast.error(ERROR_MESSAGES.DEFAULT);
    }

    function handleSubmit() {
        if (form.valid) {
            const { name, type, periodicity, calendarType } = form.values;
            const payload: any = {
                name: name.trim(),
                type: type.value,
                periodicity: periodicity.value,
                calendarType: calendarType.value,
            };
            if (action === ACTIONS.ADD) {
                createActivity(payload);
            } else if (action === ACTIONS.EDIT) {
                payload['id'] = data.id;
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
                type: type ? { value: type, label: type } : null,
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
                                <Button variant="primary" onClick={handleSubmit} className="px-4" disabled={!form.valid}>{'Submit'}</Button>
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