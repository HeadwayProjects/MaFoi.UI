import React, { useEffect, useState } from "react";
import {
    getActivities,
    getActs,
    getRules,
    useCreateStateRuleCompanyMapping,
    useGetStates,
    useUpdateStateRuleMapping,
    useUploadActStateMappingTemplate
} from "../../../../backend/masters";
import { toast } from "react-toastify";
import { API_RESULT, DEBOUNCE_TIME, ERROR_MESSAGES } from "../../../../utils/constants";
import { validatorTypes } from "@data-driven-forms/react-form-renderer";
import { getValue, preventDefault } from "../../../../utils/common";
import { Button, Modal } from "react-bootstrap";
import { CentralId, GetActionTitle, GetRuleDesc, RuleType, RuleTypeEnum } from "../Master.constants";
import FormRenderer, { ComponentMapper, FormTemplate, componentTypes } from "../../../common/FormRenderer";
import { ACTIONS, ALLOWED_FILES_REGEX, FILE_SIZE } from "../../../common/Constants";
import PageLoader from "../../../shared/PageLoader";
import { DEFAULT_OPTIONS_PAYLOAD, DEFAULT_PAYLOAD } from "../../../common/Table";
import { debounce } from "underscore";
import { ResponseModel } from "../../../../models/responseModel";
const DefaultRule = RuleTypeEnum.STATE;

function RuleStateCompanyMappingDetails(this: any, { action, data, onClose, onSubmit }: any) {
    const [form, setForm] = useState<any>({});
    const [mapping, setMapping] = useState<any>({ hideButtons: true, type: { value: DefaultRule, label: DefaultRule } });
    const [defaultPayload] = useState({ ...DEFAULT_OPTIONS_PAYLOAD, t: new Date().getTime() });
    const [acts, setActs] = useState<any[]>([]);
    const [rules, setRules] = useState<any[]>([]);
    const [activities, setActivities] = useState<any[]>([]);
    const { states } = useGetStates({ ...defaultPayload }, Boolean(defaultPayload && action !== ACTIONS.VIEW));
    const { uploadActStateMappingTemplate, uploading } = useUploadActStateMappingTemplate(({ key, value }: ResponseModel) => {
        if (key === API_RESULT.SUCCESS) {
            toast.success(`Template uploaded successfully.`);
            onSubmit();
        } else {
            toast.error(value || ERROR_MESSAGES.UPLOAD_FILE);
        }
    }, errorCallback);
    const { createStateRuleCompanyMapping, creating } = useCreateStateRuleCompanyMapping(({ key, value }: ResponseModel) => {
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
    const { updateStateRuleMapping, updating } = useUpdateStateRuleMapping(({ key, value }: ResponseModel) => {
        if (key === API_RESULT.SUCCESS) {
            toast.success(`Mapping updated successfully.`);
            if (mapping.file) {
                uploadTemplate(data.id);
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

    function uploadTemplate(id: string) {
        const formData = new FormData();
        const files = [...mapping.file.inputFiles];
        files.forEach(file => {
            const ext = file.name.split('.').pop();
            formData.append('file', file, `${mapping.formName}.${ext}`);
        });
        uploadActStateMappingTemplate({ id, formData })
    }

    function ruleOptionLabel({ label, rule }: any) {
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

    function onTypeChange(e: any) {
        if (e) {
            setMapping({ ...mapping, type: e, rule: undefined });
        }
    }

    function activityOptionLabel({ label, activity }: any) {
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
                component: (action === ACTIONS.VIEW || action === ACTIONS.EDIT) ? componentTypes.PLAIN_TEXT : componentTypes.SELECT,
                name: 'type',
                label: 'Type',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: getValue(mapping, 'type.label'),
                options: RuleType,
                onChange: onTypeChange.bind(this),
                disabled: action === ACTIONS.EDIT
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.ASYNC_SELECT,
                name: 'act',
                label: 'Act Name',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: getValue(mapping, 'act.label'),
                defaultOptions: acts,
                loadOptions: debounce((keyword: any, callback: any) => {
                    getActs({ ...DEFAULT_PAYLOAD, search: keyword }).then(response => {
                        const list = ((response || {}).data || {}).list || [];
                        const _options = list.map((act: any) => {
                            return { value: act.id, label: act.name, act }
                        });
                        setActs(_options);
                        callback(_options);
                    })
                }, DEBOUNCE_TIME)
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.ASYNC_SELECT,
                name: 'rule',
                label: 'Rule',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: action !== ACTIONS.ADD ? GetRuleDesc(getValue(mapping, 'rule.rule') || {}) : '',
                formatOptionLabel: ruleOptionLabel,
                defaultOptions: rules,
                loadOptions: debounce((keyword: any, callback: any) => {
                    getRules({ ...DEFAULT_PAYLOAD, search: keyword }).then(response => {
                        const list = ((response || {}).data || {}).list || [];
                        const _options = list.map((rule: any) => {
                            return { value: rule.id, label: rule.name, rule }
                        });
                        setRules(_options);
                        callback(_options);
                    })
                }, DEBOUNCE_TIME)
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.ASYNC_SELECT,
                name: 'activity',
                label: 'Activity',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: getValue(mapping, 'activity.label'),
                formatOptionLabel: activityOptionLabel,
                defaultOptions: activities,
                loadOptions: debounce((keyword: any, callback: any) => {
                    getActivities({ ...DEFAULT_PAYLOAD, search: keyword }).then(response => {
                        const list = ((response || {}).data || {}).list || [];
                        const _options = list.map((activity: any) => {
                            return { value: activity.id, label: activity.name, activity }
                        });
                        setActivities(_options);
                        callback(_options);
                    })
                }, DEBOUNCE_TIME)
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.SELECT,
                name: 'state',
                label: 'State',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                condition: {
                    when: 'type',
                    is: ({ value }: any) => value === RuleTypeEnum.STATE,
                    then: { visible: true },
                    else: { set: { state: undefined } }
                },
                content: getValue(mapping, 'state.label'),
                options: (states || []).filter((x: any) => x.id !== CentralId)
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXT_FIELD,
                name: 'formName',
                label: 'Form Name',
                content: getValue(mapping, 'formName'),
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.FILE_UPLOAD,
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

    function debugForm(_form: any) {
        setForm(_form);
        setMapping(_form.values);
    }

    function submit(e: any) {
        preventDefault(e);
        if (form.valid) {
            const { act, rule, activity, state, formName, type } = mapping;
            const stateId = type.value === RuleTypeEnum.CENTRAL ? CentralId : state.value;
            const request: any = {
                actId: act.value,
                ruleId: rule.value,
                activityId: activity.value,
                stateId,
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
            const type = (state || {}).id === CentralId ? RuleTypeEnum.CENTRAL : RuleTypeEnum.STATE;
            setMapping({
                ...mapping, ...data,
                type: { value: type, label: type },
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
                (creating || uploading || updating) && <PageLoader />
            }
        </>
    )
}

export default RuleStateCompanyMappingDetails;