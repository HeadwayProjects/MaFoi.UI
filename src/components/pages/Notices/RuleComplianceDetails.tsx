import React, { useState, useEffect } from "react"
import { ACTIONS } from "../../common/Constants";
import FormRenderer, { ComponentMapper, FormTemplate, componentTypes } from "../../common/FormRenderer";
import { validatorTypes } from "@data-driven-forms/react-form-renderer";
import { getValue } from "../../../utils/common";
import { debounce } from "underscore";
import { getActivities, getActs, getRuleMappings, getRules, useGetRuleMappings } from "../../../backend/masters";
import { DEFAULT_PAYLOAD } from "../../common/Table";
import { DEBOUNCE_TIME } from "../../../utils/constants";
import { CentralId, GetRuleDesc, RuleType, RuleTypeEnum } from "../Masters/Master.constants";
import { activityOptionLabel, ruleOptionLabel } from "../Masters/Mappings/MappingDetails";
import { Alert, Button } from "react-bootstrap";

export default function RuleComplianceDetails(this: any, { action, data, onSubmit, onCancel }: any) {
    const [error, setError] = useState<string>();
    const [details, setDetails] = useState<any>({});
    const [acts, setActs] = useState<any[]>([]);
    const [rules, setRules] = useState<any[]>([]);
    const [activities, setActivities] = useState<any[]>([]);
    const [form, setForm] = useState<any>({});
    const [filters, setFilters] = useState<any[]>([]);
    const { mappings, isFetching } = useGetRuleMappings({ ...DEFAULT_PAYLOAD, filters }, filters.length === 4);

    const schema = {
        fields: [
            {
                component: action === ACTIONS.ADD ? componentTypes.SELECT : componentTypes.PLAIN_TEXT,
                name: 'type',
                label: 'Type',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: action !== ACTIONS.ADD ? getValue(details, 'type.label') : '',
                options: RuleType,
                onChange: handleTypeChange.bind(this)
            },
            {
                component: action === ACTIONS.ADD ? componentTypes.ASYNC_SELECT : componentTypes.PLAIN_TEXT,
                name: 'act',
                label: 'Act Name',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: action !== ACTIONS.ADD ? getValue(details, 'act.label') : '',
                defaultOptions: acts,
                isClearable: true,
                loadOptions: debounce((keyword: any, callback: any) => {
                    const { establishmentType } = data || {};
                    const _filters = [{ columnName: 'establishmentType', value: (establishmentType || {}).value }]
                    getActs({ ...DEFAULT_PAYLOAD, search: keyword, filters: _filters }).then(response => {
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
                content: action !== ACTIONS.ADD ? GetRuleDesc(getValue(details, 'rule.rule') || {}) : '',
                formatOptionLabel: action !== ACTIONS.VIEW ? ruleOptionLabel : '',
                defaultOptions: rules,
                isClearable: true,
                loadOptions: debounce((keyword: any, callback: any) => {
                    getRules({ ...DEFAULT_PAYLOAD, search: keyword, filters: [] }).then(response => {
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
                content: action !== ACTIONS.ADD ? getValue(details, 'activity.label') : '',
                formatOptionLabel: action !== ACTIONS.VIEW ? activityOptionLabel : '',
                defaultOptions: activities,
                isClearable: true,
                loadOptions: debounce((keyword: any, callback: any) => {
                    getActivities({ ...DEFAULT_PAYLOAD, search: keyword, filters: [] }).then(response => {
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
                component: componentTypes.TAB_ITEM,
                name: 'ruleCompliance',
                content: 'Rule Compliance Details',
                className: 'grid-col-100 text-md fw-bold pb-0',
                condition: {
                    when: 'act',
                    is: () => Boolean(getValue(details, 'ruleCompliance')) && action === ACTIONS.ADD,
                    then: { visible: true }
                }
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'complianceDescription',
                label: 'Compliance Description',
                content: getValue(details, 'ruleCompliance.ruleComplianceDetails.complianceDescription') || '-NA-',
                condition: {
                    when: 'ruleCompliance',
                    is: () => Boolean(getValue(details, 'ruleCompliance')),
                    then: { visible: true }
                }
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'risk',
                label: 'Risk',
                content: getValue(details, 'ruleCompliance.ruleComplianceDetails.risk'),
                condition: {
                    when: 'ruleCompliance',
                    is: () => Boolean(getValue(details, 'ruleCompliance')),
                    then: { visible: true }
                }
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'auditType',
                label: 'Audit Type',
                content: getValue(details, 'ruleCompliance.ruleComplianceDetails.auditType'),
                condition: {
                    when: 'ruleCompliance',
                    is: () => Boolean(getValue(details, 'ruleCompliance')),
                    then: { visible: true }
                }
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'statutoryAuthority',
                label: 'Statutory Authority',
                content: getValue(details, 'ruleCompliance.ruleComplianceDetails.statutoryAuthority'),
                condition: {
                    when: 'ruleCompliance',
                    is: ({ value }: any) => value && getValue(details, 'ruleCompliance.ruleComplianceDetails.auditType') === 'Statutory',
                    then: { visible: true }
                }
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'proofOfCompliance',
                label: 'Proof Of Compliance.',
                content: getValue(details, 'ruleCompliance.ruleComplianceDetails.proofOfCompliance') || '-NA-',
                condition: {
                    when: 'ruleCompliance',
                    is: () => Boolean(getValue(details, 'ruleCompliance')),
                    then: { visible: true }
                }
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'penalty',
                label: 'Penalty',
                content: getValue(details, 'ruleCompliance.ruleComplianceDetails.penalty') || '-NA-',
                condition: {
                    when: 'ruleCompliance',
                    is: () => Boolean(getValue(details, 'ruleCompliance')),
                    then: { visible: true }
                }
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'maximumPenaltyAmount',
                label: 'Maximum Penalty Amount',
                content: getValue(details, 'ruleCompliance.ruleComplianceDetails.maximumPenaltyAmount'),
                condition: {
                    when: 'ruleCompliance',
                    is: () => Boolean(getValue(details, 'ruleCompliance')),
                    then: { visible: true }
                }
            },

            {
                component: componentTypes.PLAIN_TEXT,
                name: 'impriosonment',
                label: 'Imprisonment',
                content: getValue(details, 'ruleCompliance.ruleComplianceDetails.impriosonment') ? 'Yes' : 'No',
                condition: {
                    when: 'ruleCompliance',
                    is: () => Boolean(getValue(details, 'ruleCompliance')),
                    then: { visible: true }
                }
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'continuingPenalty',
                label: 'Continuing Penalty',
                content: getValue(details, 'ruleCompliance.ruleComplianceDetails.continuingPenalty') ? 'Yes' : 'No',
                condition: {
                    when: 'ruleCompliance',
                    is: () => Boolean(getValue(details, 'ruleCompliance')),
                    then: { visible: true }
                }
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'cancellationSuspensionOfLicense',
                label: 'Cancellation/Suspension Of License',
                content: getValue(details, 'ruleCompliance.ruleComplianceDetails.cancellationSuspensionOfLicense') ? 'Yes' : 'No',
                condition: {
                    when: 'ruleCompliance',
                    is: () => Boolean(getValue(details, 'ruleCompliance')),
                    then: { visible: true }
                }
            }
        ]
    };

    function handleTypeChange(_type: any) {
        const { type } = details;
        if (type && type.value !== _type.value) {
            updateDetails({ type: _type, rule: null, ruleCompliance: null });
            setRules([]);
        }
    }

    function debugForm(_form: any) {
        setForm(_form);
        updateDetails(_form.values);
        updateRuleComplianceDetails(_form.values);
    }

    function updateRuleComplianceDetails(values: any) {
        const { type, act, rule, activity, stateId } = values;
        if (type && act && rule && activity) {
            setFilters([
                { columnName: 'actId', value: act.value },
                { columnName: 'ruleId', value: rule.value },
                { columnName: 'activityId', value: activity.value },
                { columnName: 'stateId', value: type.value === RuleTypeEnum.STATE ? stateId : CentralId }
            ]);
        } else {
            setFilters([]);
            updateDetails({ ...values, ruleCompliance: null })
        }
    }

    function handleSubmit() {
        onSubmit(details);
    }

    function updateDetails(obj: any = {}) {
        setDetails({ ...data, ...details, ...obj });
    }

    useEffect(() => {
        if (details) {
            const { type, act, rule, activity, stateId } = details;
            if (type && act && rule && activity) {
                setFilters([
                    { columnName: 'actId', value: act.value },
                    { columnName: 'ruleId', value: rule.value },
                    { columnName: 'activityId', value: activity.value },
                    { columnName: 'stateId', value: type.value === RuleTypeEnum.STATE ? stateId : CentralId }
                ]);
            } else {
                setFilters([]);
            }
        }
    }, [details]);

    useEffect(() => {
        if (!isFetching && filters.length > 0) {
            if (mappings.length) {
                setError(undefined);
                updateDetails({ ruleCompliance: mappings[0] })
            } else {
                setError('There is no mapping defined in the system for the selected Act, Rule and Activity combination.');
                updateDetails({ ruleCompliance: null })
            }
        }
    }, [isFetching]);

    return (
        <>
            {
                Boolean(error) &&
                <Alert variant={'danger'}>{error}</Alert>
            }
            <FormRenderer FormTemplate={FormTemplate}
                initialValues={{
                    ...details,
                    hideButtons: true
                }}
                debug={debugForm}
                componentMapper={ComponentMapper}
                schema={schema}
                onSubmit={handleSubmit}
            />
            {
                action !== ACTIONS.VIEW &&
                <div className="d-flex gap-3">
                    <Button variant="outline-secondary" className="btn btn-outline-secondary px-4" onClick={onCancel}>Previous</Button>
                    <Button variant="primary" onClick={handleSubmit} disabled={!form.valid || !getValue(details, 'ruleCompliance')}>Next</Button>
                </div>
            }
        </>
    )
}