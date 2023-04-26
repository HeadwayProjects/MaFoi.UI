import React, { useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import { componentTypes, validatorTypes } from "@data-driven-forms/react-form-renderer";
import FormRenderer, { ComponentMapper, FormTemplate } from "../../common/FormRenderer";
import { Button } from "react-bootstrap";
import { ACTIONS } from "../../common/Constants";
import { getValue } from "../../../utils/common";
import { RuleType } from "./Master.constants";
import { useCreateRule, useUpdateRule } from "../../../backend/masters";
import { toast } from "react-toastify";
import { ERROR_MESSAGES } from "../../../utils/constants";
import PageLoader from "../../shared/PageLoader";

function RuleDetails({ action, data, onClose, onSubmit }) {
    const [form, setForm] = useState({});
    const [title, setTitle] = useState();
    const [ruleDetails, setRuleDetails] = useState({ hideButtons: true });
    const { createRule, isLoading: creatingRule } = useCreateRule((response) => {
        onSubmit();
    }, errorCallback);

    const { updateRule, isLoading: updatingRule } = useUpdateRule((response) => {
        onSubmit();
    }, errorCallback);

    function errorCallback() {
        toast.error(ERROR_MESSAGES.DEFAULT)
    }

    const schema = {
        fields: [
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXT_FIELD,
                name: 'name',
                label: 'Rule Name',
                validate: [
                    { type: validatorTypes.REQUIRED },
                    { type: validatorTypes.MAX_LENGTH, threshold: 255 }
                ],
                content: getValue(ruleDetails, 'name')
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXTAREA,
                name: 'description',
                label: 'Description',
                content: getValue(ruleDetails, 'description'),
                validate: [
                    { type: validatorTypes.MAX_LENGTH, threshold: 999 }
                ],
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.SELECT,
                name: 'type',
                label: 'Type',
                content: action === ACTIONS.VIEW ? (RuleType.find(x => x.id === getValue(ruleDetails, 'type')) || {}).name : '',
                options: [...RuleType],
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXT_FIELD,
                name: 'section',
                label: 'Section',
                validate: [
                    { type: validatorTypes.REQUIRED },
                    { type: validatorTypes.MAX_LENGTH, threshold: 255 }
                ],
                content: getValue(ruleDetails, 'section')
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXT_FIELD,
                name: 'rule',
                label: 'Rule',
                validate: [
                    { type: validatorTypes.REQUIRED },
                    { type: validatorTypes.MAX_LENGTH, threshold: 255 }
                ],
                content: getValue(ruleDetails, 'rule')
            }
        ],
    };

    function submitData() {
        if (form.valid) {
            const { name, description, type, section, rule } = form.values || {};
            const payload = {
                name,
                description,
                type: type.value,
                section,
                rule
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
        if (action) {
            switch (action) {
                case ACTIONS.ADD:
                    setTitle('Add Rule Master');
                    break;
                case ACTIONS.EDIT:
                    setTitle('Edit Rule Master');
                    break;
                case ACTIONS.VIEW:
                    setTitle('View Rule Master');
                    break;
                default:
                    setTitle('Rule Master');
            }
        }
    }, [action]);

    useEffect(() => {
        if (data) {
            setRuleDetails({ ...ruleDetails, ...data });
        }
    }, [data]);

    return (
        <>
            <Modal show={true} backdrop="static" dialogClassName="drawer" animation={false}>
                <Modal.Header closeButton={true} onHide={onClose}>
                    <Modal.Title className="bg">{title}</Modal.Title>
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
                creatingRule && <PageLoader message="Creating Rule. Please wait..." />
            }
            {
                updatingRule && <PageLoader message="Updating Rule. Please wait..." />
            }
        </>
    )
}

export default RuleDetails;