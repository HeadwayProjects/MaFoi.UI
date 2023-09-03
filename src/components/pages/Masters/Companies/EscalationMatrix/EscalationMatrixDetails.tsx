import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { validatorTypes } from "@data-driven-forms/react-form-renderer";
import { Button, Modal } from "react-bootstrap";
import { useCreateEscalationMatrix, useGetCompanies, useUpdateEscalationMatrix } from "../../../../../backend/masters";
import { ACTIONS } from "../../../../common/Constants";
import { DEFAULT_OPTIONS_PAYLOAD } from "../../../../common/Table";
import { API_RESULT, ERROR_MESSAGES } from "../../../../../utils/constants";
import FormRenderer, { ComponentMapper, FormTemplate, componentTypes } from "../../../../common/FormRenderer";
import { getValue, preventDefault } from "../../../../../utils/common";
import PageLoader from "../../../../shared/PageLoader";
import { useGetCompanyUsers } from "../../../../../backend/users";


function EscalationMatrixDetails({ action, data, onClose, onSubmit }: any) {
    const [t] = useState(new Date().getTime());
    const [form, setForm] = useState<any>({});
    const [matrix, setMatrix] = useState<any>({ hideButtons: true });
    const [companyId, setCompany] = useState();
    const { companies } = useGetCompanies({ ...DEFAULT_OPTIONS_PAYLOAD, filters: [{ columnName: 'isParent', value: 'true' }], t }, action !== ACTIONS.VIEW);
    const { companyUsers } = useGetCompanyUsers(companyId);
    const { createMatrix, creating } = useCreateEscalationMatrix((response: any) => {
        const { key, value } = response;
        if (key === API_RESULT.SUCCESS) {
            toast.success(`Escation matrix created successfully.`);
            onSubmit();
        } else {
            toast.error(value);
        }
    }, errorCallback);
    const { updateMatrix, updating } = useUpdateEscalationMatrix((response: any) => {
        const { key, value } = response;
        if (key === API_RESULT.SUCCESS) {
            toast.success(`Escation matrix updated successfully.`);
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
                content: action !== ACTIONS.ADD ? getValue(matrix, 'company.label') : null
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.SELECT,
                name: 'user',
                label: 'User',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                options: companyUsers,
                content: action === ACTIONS.VIEW ? getValue(matrix, 'user.label') : null
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXT_FIELD,
                name: 'days',
                label: 'Days',
                fieldType: 'number',
                validate: [
                    { type: validatorTypes.REQUIRED },
                    { type: validatorTypes.MAX_LENGTH, threshold: 2 },
                    // { type: validatorTypes.MAX_NUMBER_VALUE, threshold: 31, message: 'Days cannot be more than 31' }
                ],
                styleClass: 'text-uppercase',
                content: action === ACTIONS.VIEW ? getValue(matrix, 'days') : null,
                description: 'Days is a number to send the escalation emails before the compliance activity due date.'
            }
        ]
    };

    function debugForm(_form: any) {
        setForm(_form);
        setMatrix(_form.values);
        const { company = {} } = _form.values;
        if (companyId !== company.value) {
            setCompany(company.value);
        }
    }

    function submit(e: any) {
        preventDefault(e);
        if (form.valid) {
            const { user, days, company } = matrix;
            const request: any = {
                companyId: company.value,
                userId: user.value,
                days
            };

            if (action === ACTIONS.EDIT) {
                request['id'] = data.id;
                updateMatrix(request);
            } else {
                createMatrix(request);
            }
        }
    }

    function getTitle() {
        if (action === ACTIONS.ADD) {
            return 'Add Escalation Matrix';
        } else if (action === ACTIONS.EDIT) {
            return 'Edit Escalation Matrix';
        } else if (action === ACTIONS.VIEW) {
            return ' Escalation Matrix Details';
        }
    }

    useEffect(() => {
        if (data) {
            const { user, company, days } = data || {};
            setMatrix({
                ...data,
                ...matrix,
                company: { value: company.id, label: company.name },
                user: { value: user.id, label: user.name },
                days: `${days || ''}`
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
                        initialValues={matrix}
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
                    {creating ? 'Creating Escalation Matrix...' : 'Updating Escalation Matrix...'}
                </PageLoader>
            }
        </>
    )
}

export default EscalationMatrixDetails;