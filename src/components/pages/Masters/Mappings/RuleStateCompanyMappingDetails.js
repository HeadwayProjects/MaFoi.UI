import React, { useEffect, useState } from "react";
import { useCreateStateRuleCompanyMapping, useGetActivities, useGetActs, useGetCompanies, useGetRules, useGetStates } from "../../../../backend/masters";
import { toast } from "react-toastify";
import { ERROR_MESSAGES } from "../../../../utils/constants";
import { componentTypes, validatorTypes } from "@data-driven-forms/react-form-renderer";
import { getValue, preventDefault } from "../../../../utils/common";
import { Button, Modal } from "react-bootstrap";
import { GetActionTitle } from "../Master.constants";
import FormRenderer, { ComponentMapper, FormTemplate } from "../../../common/FormRenderer";
import { ACTIONS } from "../../../common/Constants";
import PageLoader from "../../../shared/PageLoader";

function RuleStateCompanyMappingDetails({ action, data, onClose, onSubmit }) {
    const [form, setForm] = useState({});
    const [mapping, setMapping] = useState({ hideButtons: true });
    const { acts } = useGetActs();
    const { rules } = useGetRules();
    const { activities } = useGetActivities();
    const { states } = useGetStates();
    const { companies } = useGetCompanies();
    const { createStateRuleCompanyMapping, creating } = useCreateStateRuleCompanyMapping(({ id, message }) => {
        if (id) {
            toast.success(`Mapping created successfully.`);
            onSubmit();
        } else {
            toast.error(message);
        }
    }, errorCallback);


    function errorCallback() {
        toast.error(ERROR_MESSAGES.DEFAULT);
    }

    const schema = {
        fields: [
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.SELECT,
                name: 'act',
                label: 'Act Name',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: getValue(mapping, 'act.name'),
                options: acts
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.SELECT,
                name: 'rule',
                label: 'Rule',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: getValue(mapping, 'rule.name'),
                options: rules
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.SELECT,
                name: 'activity',
                label: 'Activity',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: getValue(mapping, 'activity.name'),
                options: activities
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.SELECT,
                name: 'state',
                label: 'State',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: getValue(mapping, 'state.name'),
                options: states
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.SELECT,
                name: 'company',
                label: 'Company',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: getValue(mapping, 'company.name'),
                options: companies
            }
        ],
    };

    function debugForm(_form) {
        setForm(_form);
        setMapping(_form.values);
    }

    function submit(e) {
        preventDefault(e);
        if (form.valid) {
            const { act, rule, activity, state, company } = mapping;
            const request = {
                actId: act.value,
                ruleId: rule.value,
                activityId: activity.value,
                stateId: state.value,
                companyId: company.value,
            };

            createStateRuleCompanyMapping(request);
        }
    }

    useEffect(() => {
        if (data) {
            setMapping({ ...mapping, ...data });
        }
    }, [data]);

    return (
        <>
            <Modal show={true} backdrop="static" dialogClassName="drawer" animation={false}>
                <Modal.Header closeButton={true} onHide={onClose}>
                    <Modal.Title className="bg">{GetActionTitle('Mapping', action)}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormRenderer FormTemplate={FormTemplate}
                        initialValues={mapping}
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
                creating && <PageLoader>Creating...</PageLoader>
            }
        </>
    )
}

export default RuleStateCompanyMappingDetails;