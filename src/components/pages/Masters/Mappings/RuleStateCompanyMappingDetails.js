import React, { useEffect, useState } from "react";
import { useCreateStateRuleCompanyMapping, useGetActivities, useGetActs, useGetCompanies, useGetRules, useGetStates, useUpdateStateRuleMapping, useUploadActStateMappingTemplate } from "../../../../backend/masters";
import { toast } from "react-toastify";
import { API_RESULT, ERROR_MESSAGES } from "../../../../utils/constants";
import { componentTypes, validatorTypes } from "@data-driven-forms/react-form-renderer";
import { getValue, preventDefault } from "../../../../utils/common";
import { Button, Modal } from "react-bootstrap";
import { GetActionTitle, GetRuleDesc } from "../Master.constants";
import FormRenderer, { ComponentMapper, FormTemplate } from "../../../common/FormRenderer";
import { ACTIONS, ALLOWED_FILES_REGEX, FILE_SIZE } from "../../../common/Constants";
import PageLoader from "../../../shared/PageLoader";
import { DEFAULT_OPTIONS_PAYLOAD } from "../../../common/Table";

function RuleStateCompanyMappingDetails({ action, data, onClose, onSubmit }) {
    const [form, setForm] = useState({});
    const [mapping, setMapping] = useState({ hideButtons: true });
    const [defaultPayload] = useState({ ...DEFAULT_OPTIONS_PAYLOAD, t: new Date().getTime() });
    const { acts } = useGetActs({ ...defaultPayload }, Boolean(defaultPayload));
    const { rules } = useGetRules({ ...defaultPayload }, Boolean(defaultPayload));
    const { activities } = useGetActivities({ ...defaultPayload }, Boolean(defaultPayload));
    const { states } = useGetStates({ ...defaultPayload }, Boolean(defaultPayload));
    const { uploadActStateMappingTemplate, uploading } = useUploadActStateMappingTemplate(({ key, value }) => {
        if (key === API_RESULT.SUCCESS) {
            toast.success(`Template uploaded successfully.`);
            onSubmit();
        } else {
            toast.error(value || ERROR_MESSAGES.UPLOAD_FILE);
        }
    }, errorCallback);
    const { createStateRuleCompanyMapping, creating } = useCreateStateRuleCompanyMapping(({ key, value }) => {
        if (key === API_RESULT.SUCCESS) {
            toast.success(`Mapping created successfully.`);
            if (mapping.file) {
                uploadTemplate(value);
            } else {
                onSubmit();
            }
        } else {
            toast.error(value || ERROR_MESSAGES.ERROR);
        }
    }, errorCallback);
    const { updateStateRuleMapping, updating } = useUpdateStateRuleMapping(({ key, value }) => {
        if (key === API_RESULT.SUCCESS) {
            toast.success(`Mapping updated successfully.`);
            if (mapping.file) {
                uploadTemplate(value);
            } else {
                onSubmit();
            }
        } else {
            toast.error(value || ERROR_MESSAGES.ERROR);
        }
    }, errorCallback);


    function errorCallback() {
        toast.error(ERROR_MESSAGES.DEFAULT);
    }

    function uploadTemplate(id) {
        const formData = new FormData();
        const files = [...mapping.file.inputFiles];
        files.forEach(file => {
            const ext = file.name.split('.').pop();
            formData.append('file', file, `${mapping.formName}.${ext}`);
        });
        uploadActStateMappingTemplate({ id, formData })
    }

    function ruleOptionLabel({ label, rule }) {
        return (
            <div className="d-flex flex-column">
                <div>{label}</div>
                <div className="text-sm d-flex align-items-center">
                    {
                        rule.sectionNo &&
                        <>
                            <span className="fst-italic">Section No.</span>
                            <span className="fw-bold ms-1">{rule.sectionNo}</span>
                        </>
                    }
                    {
                        rule.sectionNo && rule.ruleNo &&
                        <span className="text-md mx-2">|</span>
                    }
                    {
                        rule.sectionNo &&
                        <>
                            <span className="fst-italic">Rule No.</span>
                            <span className="fw-bold ms-1">{rule.ruleNo}</span>
                        </>
                    }
                </div>
            </div>
        )
    }

    function activityOptionLabel({ label, activity }) {
        return (
            <div className="d-flex flex-column">
                <div>{label}</div>
                {
                    Boolean(activity) &&
                    <>
                        <div className="text-sm fw-bold">Type: {activity.type}</div>
                        <div className="text-sm fw-bold">{activity.periodicity} | {activity.calendarType}</div>
                    </>
                }
            </div>
        )
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
                content: action !== ACTIONS.ADD ? GetRuleDesc(getValue(mapping, 'rule') || {}) : '',
                options: rules,
                formatOptionLabel: ruleOptionLabel
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.SELECT,
                name: 'activity',
                label: 'Activity',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: getValue(mapping, 'activity.name'),
                options: activities,
                formatOptionLabel: activityOptionLabel
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
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXT_FIELD,
                name: 'formName',
                label: 'Form Name',
                content: getValue(mapping, 'formName'),
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : 'file-upload',
                label: action === ACTIONS.VIEW ? 'Uploaded File' : 'File upload',
                name: 'file',
                type: 'file',
                validate: [
                    { type: validatorTypes.REQUIRED },
                    { type: 'file-type', regex: ALLOWED_FILES_REGEX },
                    { type: 'file-size', maxSize: 5 * FILE_SIZE.MB }
                ],
                condition: {
                    when: 'formName',
                    pattern: /(?!^$)([^\s])/,
                    then: { visible: true }
                },
                content: getValue(mapping, 'fileName')
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
            const { act, rule, activity, state, formName } = mapping;
            const request = {
                actId: act.value,
                ruleId: rule.value,
                activityId: activity.value,
                stateId: state.value,
                formName: (formName || '').trim()
            };
            if (action === ACTIONS.ADD) {
                createStateRuleCompanyMapping(request);
            } else {
                request['id'] = data.id
                if (request.actId === data.act.id &&
                    request.ruleId === data.rule.id &&
                    request.activityId === data.activity.id &&
                    request.stateId === data.state.id) {
                    delete request.actId;
                    delete request.ruleId;
                    delete request.activityId;
                    delete request.stateId;
                }
                updateStateRuleMapping(request);
            }
        }
    }

    useEffect(() => {
        if (data) {
            const { act, rule, activity, state } = data;
            setMapping({
                ...mapping, ...data,
                act: { value: act.id, label: act.name, act },
                rule: { value: rule.id, label: rule.name, rule },
                activity: { value: activity.id, label: activity.name, activity },
                state: { value: state.id, label: state.name, state }
            });
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
                (creating || uploading) && <PageLoader>{uploading ? 'Uploading...' : 'Creating...'}</PageLoader>
            }
        </>
    )
}

export default RuleStateCompanyMappingDetails;