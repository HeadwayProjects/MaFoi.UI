import React, { useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import { validatorTypes } from "@data-driven-forms/react-form-renderer";
import FormRenderer, { ComponentMapper, FormTemplate, componentTypes } from "../../common/FormRenderer";
import { Button } from "react-bootstrap";
import { ACTIONS } from "../../common/Constants";
import { getValue } from "../../../utils/common";
import { GetActionTitle, RuleType } from "./Master.constants";
import { useCreateRule, useUpdateRule } from "../../../backend/masters";
import { toast } from "react-toastify";
import { API_RESULT, ERROR_MESSAGES } from "../../../utils/constants";
import PageLoader from "../../shared/PageLoader";
import { ResponseModel } from "../../../models/responseModel";

function RuleDetails({ action, data, onClose, onSubmit }: any) {
    const [form, setForm] = useState<any>({});
    const [ruleDetails, setRuleDetails] = useState<any>({ hideButtons: true });
    const { createRule, isLoading: creatingRule } = useCreateRule(({ key, value }: ResponseModel) => {
        if (key === API_RESULT.SUCCESS) {
            toast.success(`${ruleDetails.name} created successfully.`);
            onSubmit();
        } else {
            toast.error(value === ERROR_MESSAGES.DUPLICATE ? 'Similar Rule combination already exists.' : ERROR_MESSAGES.ERROR);
        }
    }, errorCallback);

    const { updateRule, isLoading: updatingRule } = useUpdateRule(({ key, value }: ResponseModel) => {
        if (key === API_RESULT.SUCCESS) {
            toast.success(`${ruleDetails.name} upated successfully.`);
            onSubmit();
        } else {
            toast.error(value === ERROR_MESSAGES.DUPLICATE ? 'Similar Rule combination already exists.' : ERROR_MESSAGES.ERROR);
        }
    }, errorCallback);

    function errorCallback() {
        toast.error(ERROR_MESSAGES.DEFAULT)
    }

    const schema = {
        fields: [
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.INPUT_AS_TEXT,
                name: 'name',
                label: 'Rule Name',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: getValue(ruleDetails, 'name')
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXTAREA,
                name: 'description',
                label: 'Description',
                content: getValue(ruleDetails, 'description') || '-NA-',
                validate: [
                    { type: validatorTypes.MAX_LENGTH, threshold: 999 }
                ],
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.SELECT,
                name: 'type',
                label: 'Type',
                content: action === ACTIONS.VIEW ? getValue(ruleDetails, 'type.value') : '',
                options: RuleType.map(x => {
                    return { id: x, name: x }
                }),
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXT_FIELD,
                name: 'sectionNo',
                label: 'Section No.',
                validate: [
                    { type: validatorTypes.REQUIRED },
                    { type: validatorTypes.MAX_LENGTH, threshold: 50 }
                ],
                content: getValue(ruleDetails, 'sectionNo')
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXT_FIELD,
                name: 'ruleNo',
                label: 'Rule No.',
                validate: [
                    { type: validatorTypes.REQUIRED },
                    { type: validatorTypes.MAX_LENGTH, threshold: 50 }
                ],
                content: getValue(ruleDetails, 'ruleNo')
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.INPUT_AS_TEXT,
                name: 'uniqueIdentifier',
                label: 'Unique Identifier',
                validate: [
                    { type: validatorTypes.REQUIRED },
                    { type: validatorTypes.MAX_LENGTH, threshold: 100 }
                ],
                content: getValue(ruleDetails, 'uniqueIdentifier')
            }
        ],
    };

    function submitData() {
        if (form.valid) {
            const { name, description, type, sectionNo, ruleNo, uniqueIdentifier } = form.values || {};
            const payload: any = {
                name: name.trim(),
                description: (description || '').trim(),
                type: type.value,
                sectionNo,
                ruleNo,
                uniqueIdentifier: uniqueIdentifier.trim(),
            }
            if (action === ACTIONS.ADD) {
                createRule(payload);
            } else if (action === ACTIONS.EDIT) {
                payload['id'] = data.id;
                updateRule(payload);
            }
        }
    }

    useEffect(() => {
        if (data) {
            setRuleDetails({
                ...ruleDetails, ...data,
                type: { value: data.type, label: data.type }
            });
        }
    }, [data]);

    return (
        <>
            <Modal show={true} backdrop="static" dialogClassName="drawer" animation={false}>
                <Modal.Header closeButton={true} onHide={onClose}>
                    <Modal.Title className="bg">{GetActionTitle('Rule', action)}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormRenderer FormTemplate={FormTemplate}
                        initialValues={ruleDetails}
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
                                <Button variant="primary" onClick={submitData} className="px-4" disabled={!form.valid}>{'Submit'}</Button>
                            </> :
                            <Button variant="primary" onClick={onClose} className="px-4 ms-auto">{'Close'}</Button>

                    }
                </Modal.Footer>
            </Modal>
            {
                creatingRule && <PageLoader message="Creating Rule..." />
            }
            {
                updatingRule && <PageLoader message="Updating Rule..." />
            }
        </>
    )
}

export default RuleDetails;