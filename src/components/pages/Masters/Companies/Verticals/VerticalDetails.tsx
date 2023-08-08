import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { validatorTypes } from "@data-driven-forms/react-form-renderer";
import { Button, Modal } from "react-bootstrap";
import { useCreateVertical, useGetCompanies, useUpdateVertical } from "../../../../../backend/masters";
import { DEFAULT_OPTIONS_PAYLOAD } from "../../../../common/Table";
import { ACTIONS } from "../../../../common/Constants";
import { API_RESULT, ERROR_MESSAGES } from "../../../../../utils/constants";
import FormRenderer, { ComponentMapper, FormTemplate, componentTypes } from "../../../../common/FormRenderer";
import { getValue, preventDefault } from "../../../../../utils/common";
import PageLoader from "../../../../shared/PageLoader";

function VerticalDetails({ action, data, onClose, onSubmit }: any) {
    const [t] = useState(new Date().getTime());
    const [form, setForm] = useState<any>({});
    const [vertical, setvertical] = useState<any>({ hideButtons: true });
    const { companies } = useGetCompanies({ ...DEFAULT_OPTIONS_PAYLOAD, filters: [{ columnName: 'isParent', value: 'true' }], t }, action !== ACTIONS.VIEW);
    const { createVertical, creating } = useCreateVertical((response: any) => {
        console.log(response);
        const { key, value } = response;
        if (key === API_RESULT.SUCCESS) {
            toast.success(`${vertical.name} created successfully.`);
            onSubmit();
        } else {
            toast.error(value);
        }
    }, errorCallback);
    const { updateVertical, updating } = useUpdateVertical((response: any) => {
        console.log(response);
        const { key, value } = response;
        if (key === API_RESULT.SUCCESS) {
            toast.success(`${vertical.name} updated successfully.`);
            onSubmit();
        } else {
            toast.error(value);
        }
    }, errorCallback);

    function errorCallback() {
        toast.error(ERROR_MESSAGES.DEFAULT);
    }

    const schema = {
        fields: [
            {
                component: action === ACTIONS.ADD ? componentTypes.SELECT : componentTypes.PLAIN_TEXT,
                name: 'company',
                label: 'Company',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                options: companies,
                content: getValue(vertical, 'company.label')
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXT_FIELD,
                name: 'shortCode',
                label: 'Short Code',
                validate: [
                    { type: validatorTypes.REQUIRED },
                    { type: validatorTypes.MAX_LENGTH, threshold: 10 },
                    { type: validatorTypes.PATTERN, pattern: /[a-zA-Z0-9]{2,10}/, message: 'Should be alphanumeric value of length 2' }
                ],
                styleClass: 'text-uppercase',
                content: getValue(vertical, 'shortCode')
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXT_FIELD,
                name: 'name',
                label: 'Name',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: getValue(vertical, 'name')
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXTAREA,
                name: 'description',
                label: 'Description',
                content: getValue(vertical, 'description')
            }
        ]
    };

    function debugForm(_form: any) {
        setForm(_form);
        setvertical(_form.values);
    }

    function submit(e: any) {
        preventDefault(e);
        if (form.valid) {
            const { id, shortCode, name, description, company } = vertical;
            const request: any = {
                shortCode,
                name: name.trim(),
                description: (description || '').trim(),
                companyId: company.value
            };

            if (action === ACTIONS.EDIT) {
                request['id'] = data.id;
                updateVertical(request);
            } else {
                createVertical(request);
            }
        }
    }

    function getTitle() {
        if (action === ACTIONS.ADD) {
            return 'Add Vertical';
        } else if (action === ACTIONS.EDIT) {
            return 'Edit Vertical';
        } else if (action === ACTIONS.VIEW) {
            return 'Vertical Details';
        }
    }

    useEffect(() => {
        if (data) {
            const { id, name } = data.company || {};
            setvertical({
                ...vertical,
                ...data,
                company: { value: id, label: name }
            });
        }
    }, [data]);

    return (
        <>
            <Modal show={true} backdrop="static" dialogClassName="drawer" animation={false}>
                <Modal.Header closeButton={true} onHide={onClose}>
                    <Modal.Title className="bg">{getTitle()}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormRenderer FormTemplate={FormTemplate}
                        initialValues={vertical}
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
                    {creating ? 'Creating Vertical...' : 'Updating Vertical...'}
                </PageLoader>
            }
        </>
    )
}

export default VerticalDetails;