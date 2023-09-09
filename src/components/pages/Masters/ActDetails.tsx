import React, { useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import { validatorTypes } from "@data-driven-forms/react-form-renderer";
import FormRenderer, { ComponentMapper, FormTemplate, componentTypes } from "../../common/FormRenderer";
import { Button } from "react-bootstrap";
import { ACTIONS } from "../../common/Constants";
import { getValue, preventDefault } from "../../../utils/common";
import { useCreateAct, useGetLaws, useUpdateAct } from "../../../backend/masters";
import { EstablishmentTypes, GetActionTitle } from "./Master.constants";
import { toast } from "react-toastify";
import { API_DELIMITER, API_RESULT, ERROR_MESSAGES, UI_DELIMITER } from "../../../utils/constants";
import PageLoader from "../../shared/PageLoader";
import { DEFAULT_OPTIONS_PAYLOAD } from "../../common/Table";
import { ResponseModel } from "../../../models/responseModel";

function ActDetails({ action, data, onClose, onSubmit }: any) {
    const [t] = useState(new Date().getTime());
    const [form, setForm] = useState<any>({});
    const [act, setAct] = useState<any>({ hideButtons: true });
    const { laws, isFetching: loadingLaws } = useGetLaws({ ...DEFAULT_OPTIONS_PAYLOAD, t });
    const { createAct, creating } = useCreateAct(({ key, value }: ResponseModel) => {
        if (key === API_RESULT.SUCCESS) {
            toast.success(`${act.name} created successfully.`);
            onSubmit();
        } else {
            toast.error(value === ERROR_MESSAGES.DUPLICATE ? 'Similar Act, Establishment Type and Law combination already exists.' : ERROR_MESSAGES.ERROR);
        }
    }, errorCallback);
    const { updateAct, updating } = useUpdateAct(({ key, value }: ResponseModel) => {
        if (key === API_RESULT.SUCCESS) {
            toast.success(`${act.name} updated successfully.`);
            onSubmit();
        } else {
            toast.error(value === ERROR_MESSAGES.DUPLICATE ? 'Similar Act, Establishment Type and Law combination already exists.' : ERROR_MESSAGES.ERROR);
        }
    }, errorCallback);

    function errorCallback() {
        toast.error(ERROR_MESSAGES.DEFAULT);
    }

    const schema = {
        fields: [
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.INPUT_AS_TEXT,
                name: 'name',
                label: 'Act Name',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: getValue(data, 'name')
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.SELECT,
                name: 'establishmentType',
                label: 'Establishment Type',
                content: action === ACTIONS.VIEW ? getValue(data, 'establishmentType') : '',
                options: EstablishmentTypes,
                validate: [
                    { type: validatorTypes.REQUIRED }
                ]
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.SELECT,
                name: 'law',
                label: 'Law',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: getValue(data, 'law.name'),
                options: laws,
                isLoading: loadingLaws,
            }
        ],
    };

    function debugForm(_form: any) {
        setForm(_form);
        setAct(_form.values);
    }

    function submit(e: any) {
        preventDefault(e);
        if (form.valid) {
            const { name, establishmentType, law } = act;
            const request: any = {
                name: name.trim(),
                lawId: law.value,
                establishmentType: establishmentType.value
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
            const { establishmentType, law } = data;
            setAct({
                ...act,
                ...data,
                establishmentType: {
                    value: establishmentType,
                    label: establishmentType
                },
                law: law ? { value: law.id, label: law.name } : null
            });
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