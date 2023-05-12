import React, { useEffect, useState } from "react";
import { useCreateStateRuleCompanyMapping, useGetActivities, useGetActs, useGetCompanies, useGetRules, useGetStates, useUploadActStateMappingTemplate } from "../../../../backend/masters";
import { toast } from "react-toastify";
import { API_RESULT, ERROR_MESSAGES } from "../../../../utils/constants";
import { componentTypes, validatorTypes } from "@data-driven-forms/react-form-renderer";
import { getValue, preventDefault } from "../../../../utils/common";
import { Button, Modal } from "react-bootstrap";
import { GetActionTitle, GetRuleDesc } from "../Master.constants";
import FormRenderer, { ComponentMapper, FormTemplate } from "../../../common/FormRenderer";
import { ACTIONS, ALLOWED_FILES_REGEX, FILE_SIZE } from "../../../common/Constants";
import PageLoader from "../../../shared/PageLoader";

function RuleStateCompanyMappingDetails({ action, data, onClose, onSubmit }) {
    const [form, setForm] = useState({});
    const [mapping, setMapping] = useState({ hideButtons: true });
    const { acts } = useGetActs();
    const { rules } = useGetRules();
    const { activities } = useGetActivities();
    const { states } = useGetStates();
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


    function errorCallback() {
        toast.error(ERROR_MESSAGES.DEFAULT);
    }

    function uploadTemplate(id) {
        const formData = new FormData();
        const files = [...mapping.file.inputFiles];
        files.forEach(file => {
            formData.append('file', file, file.name);
        });
        uploadActStateMappingTemplate({ id, formData })
    }

    const schema = {
        fields: [
            {
                component: action === ACTIONS.ADD ? componentTypes.SELECT : componentTypes.PLAIN_TEXT,
                name: 'act',
                label: 'Act Name',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: getValue(mapping, 'act.name'),
                options: acts
            },
            {
                component: action === ACTIONS.ADD ? componentTypes.SELECT : componentTypes.PLAIN_TEXT,
                name: 'rule',
                label: 'Rule',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: action !== ACTIONS.ADD ? GetRuleDesc(getValue(mapping, 'rule') || {}) : '',
                options: (rules || []).map(x => {
                    return {
                        id: x.id,
                        name: GetRuleDesc(x)
                    }
                })
            },
            {
                component: action === ACTIONS.ADD ? componentTypes.SELECT : componentTypes.PLAIN_TEXT,
                name: 'activity',
                label: 'Activity',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: getValue(mapping, 'activity.name'),
                options: activities
            },
            {
                component: action === ACTIONS.ADD ? componentTypes.SELECT : componentTypes.PLAIN_TEXT,
                name: 'state',
                label: 'State',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: getValue(mapping, 'state.name'),
                options: states
            },
            {
                component: action === ACTIONS.ADD ? componentTypes.TEXT_FIELD : componentTypes.PLAIN_TEXT,
                name: 'formName',
                label: 'Form Name',
                content: getValue(mapping, 'formName'),
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : 'file-upload',
                label: action === ACTIONS.VIEW ? 'Uploaded File' : 'File upload',
                name: 'file',
                type: 'file',
                validate: Boolean((mapping || {}).formName) ? [
                    { type: validatorTypes.REQUIRED },
                    { type: 'file-type', regex: ALLOWED_FILES_REGEX },
                    { type: 'file-size', maxSize: 5 * FILE_SIZE.MB }
                ] : [
                    { type: 'file-type', regex: ALLOWED_FILES_REGEX },
                    { type: 'file-size', maxSize: 5 * FILE_SIZE.MB }
                ],
                content: getValue(mapping, 'fileName'),
            },
        ],
    };

    function debugForm(_form) {
        setForm(_form);
        setMapping(_form.values);
    }

    function submit(e) {
        preventDefault(e);
        if (form.valid) {
            if (action === ACTIONS.ADD) {
                const { act, rule, activity, state, formData } = mapping;
                const request = {
                    actId: act.value,
                    ruleId: rule.value,
                    activityId: activity.value,
                    stateId: state.value,
                    formData: formData || ''
                };
                createStateRuleCompanyMapping(request);
            } else {
                uploadTemplate(mapping.id);
            }
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
                (creating || uploading) && <PageLoader>{uploading ? 'Uploading...' : 'Creating...'}</PageLoader>
            }
        </>
    )
}

export default RuleStateCompanyMappingDetails;