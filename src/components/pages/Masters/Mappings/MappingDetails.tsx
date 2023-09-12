import React, { useState, useEffect } from "react"
import FormRenderer, { ComponentMapper, FormTemplate, componentTypes } from "../../../common/FormRenderer";
import { ACTIONS } from "../../../common/Constants";
import { validatorTypes } from "@data-driven-forms/react-form-renderer";
import { getValue } from "../../../../utils/common";
import { CentralId, GetRuleDesc, RuleType, RuleTypeEnum } from "../Master.constants";
import { debounce } from "underscore";
import { getActivities, getActs, getRuleMappings, getRules, useGetStates } from "../../../../backend/masters";
import { DEFAULT_OPTIONS_PAYLOAD, DEFAULT_PAYLOAD } from "../../../common/Table";
import { DEBOUNCE_TIME } from "../../../../utils/constants";
import { Alert } from "react-bootstrap";

export function ruleOptionLabel({ label, rule = {} }: any) {
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

export function activityOptionLabel({ label, activity }: any) {
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

export default function MappingDetails(this: any, { action, data = {}, onSubmit }: any) {
    const [defaultPayload] = useState({ ...DEFAULT_OPTIONS_PAYLOAD, t: new Date().getTime() });
    const [error, setError] = useState<string>();
    const [mappingDetails, setMappingDetails] = useState({});
    const [acts, setActs] = useState<any[]>([]);
    const [rules, setRules] = useState<any[]>([]);
    const [activities, setActivities] = useState<any[]>([]);
    const [type, setType] = useState(RuleTypeEnum.STATE)
    const { states } = useGetStates({ ...defaultPayload }, Boolean(defaultPayload && action !== ACTIONS.VIEW));

    const schema = {
        fields: [
            {
                component: action === ACTIONS.ADD ? componentTypes.SELECT : componentTypes.PLAIN_TEXT,
                name: 'type',
                label: 'Type',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: action !== ACTIONS.ADD ? getValue(mappingDetails, 'type.label') : '',
                options: RuleType,
                onChange: (option: any) => {
                    const { value } = option;
                    if (type !== value) {
                        setType(value);
                        setMappingDetails({ ...mappingDetails, type: option, rule: null });
                        setRules([]);
                    }
                }
            },
            {
                component: action === ACTIONS.ADD ? componentTypes.ASYNC_SELECT : componentTypes.PLAIN_TEXT,
                name: 'act',
                label: 'Act Name',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: action !== ACTIONS.ADD ? getValue(mappingDetails, 'act.label') : '',
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
                component: action === ACTIONS.ADD ? componentTypes.ASYNC_SELECT : componentTypes.PLAIN_TEXT,
                name: 'rule',
                label: 'Rule',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: action !== ACTIONS.ADD ? GetRuleDesc(getValue(mappingDetails, 'rule.rule') || {}) : '',
                formatOptionLabel: action !== ACTIONS.VIEW ? ruleOptionLabel : '',
                defaultOptions: rules,
                loadOptions: debounce((keyword: any, callback: any) => {
                    const filters = [{ columnName: 'type', value: type }]
                    getRules({ ...DEFAULT_PAYLOAD, search: keyword, filters }).then(response => {
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
                component: action === ACTIONS.ADD ? componentTypes.ASYNC_SELECT : componentTypes.PLAIN_TEXT,
                name: 'activity',
                label: 'Activity',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: action !== ACTIONS.ADD ? getValue(mappingDetails, 'activity.label') : '',
                formatOptionLabel: action !== ACTIONS.VIEW ? activityOptionLabel : '',
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
                component: action === ACTIONS.ADD ? componentTypes.SELECT : componentTypes.PLAIN_TEXT,
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
                content: action !== ACTIONS.ADD ? getValue(mappingDetails, 'state.label') : '',
                options: (states || []).filter((x: any) => x.id !== CentralId)
            }
        ]
    };

    function debugForm({ values }: any) {
        setMappingDetails({ ...mappingDetails, ...values });
    }

    function handleSubmit(request: any) {
        if (action === ACTIONS.ADD) {
            setError(undefined);
            const { id, act, rule, activity, state } = request;
            const filters = [
                { columnName: 'actId', value: act.value },
                { columnName: 'ruleId', value: rule.value },
                { columnName: 'activityId', value: activity.value },
                { columnName: 'stateId', value: state ? state.value : CentralId }
            ]
            const _payload = { ...DEFAULT_PAYLOAD, filters, pagination: { pageSize: 2, pageNumber: 1 } };
            getRuleMappings(_payload).then(({ list = [] }: any) => {
                if (list.length === 0) {
                    onSubmit(request);
                } else {
                    setError('Duplicate: Mapping for the selected Act, Rule, Activity and State already exists');
                }
            });
        } else {
            onSubmit(request);
        }
    }

    useEffect(() => {
        if (data) {
            setMappingDetails({ ...mappingDetails, ...data });
            setType(data.type.value);
        }
    }, [data]);

    return (
        <>
            {
                Boolean(error) &&
                <Alert variant={'danger'}>{error}</Alert>
            }
            {
                action === ACTIONS.EDIT &&
                <Alert variant={'warning'}>This step is not editable. However, rule compliance and documents can be edited.</Alert>
            }
            <FormRenderer FormTemplate={FormTemplate}
                initialValues={{
                    buttonWrapStyles: 'justify-content-start',
                    submitBtnText: 'Next',
                    ...mappingDetails,
                    hideButtons: action === ACTIONS.VIEW
                }}
                debug={debugForm}
                componentMapper={ComponentMapper}
                schema={schema}
                onSubmit={handleSubmit}
            />
        </>
    )
}