import React, { useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import { validatorTypes } from "@data-driven-forms/react-form-renderer";
import { Button } from "react-bootstrap";
import { API_RESULT, DEBOUNCE_TIME, ERROR_MESSAGES } from "../../../../utils/constants";
import { getRules, useCreateRuleCompliance, useGetStates, useUpdateRuleCompliance } from "../../../../backend/masters";
import { getValue, preventDefault } from "../../../../utils/common";
import { ActivityType, AuditType, GetActionTitle, RiskType } from "../Master.constants";
import FormRenderer, { ComponentMapper, FormTemplate, componentTypes } from "../../../common/FormRenderer";
import { ACTIONS } from "../../../common/Constants";
import { toast } from "react-toastify";
import PageLoader from "../../../shared/PageLoader";
import { DEFAULT_OPTIONS_PAYLOAD, DEFAULT_PAYLOAD } from "../../../common/Table";
import { debounce } from "underscore";

function RuleComplianceDetails({ action, data, onClose, onSubmit }) {
    const [form, setForm] = useState({});
    const { states, isFetching: loadingStates } = useGetStates({ ...DEFAULT_OPTIONS_PAYLOAD });
    const [rules, setRules] = useState([]);
    const [compliance, setCompliance] = useState({ hideButtons: true });
    const { updateRuleCompliance, updating } = useUpdateRuleCompliance(({ key, value }) => {
        if (key === API_RESULT.SUCCESS) {
            toast.success(`${compliance.complianceName} updated successsfully.`);
            onSubmit();
        } else {
            toast.error(value === ERROR_MESSAGES.DUPLICATE ? 'Similar Compliance name, state and rule combination already exists.' : ERROR_MESSAGES.ERROR);
        }
    }, errorCallback);
    const { createRuleCompliance, creating } = useCreateRuleCompliance(({ key, value }) => {
        if (key === API_RESULT.SUCCESS) {
            toast.success(`${compliance.complianceName} created successsfully.`);
            onSubmit();
        } else {
            toast.error(value === ERROR_MESSAGES.DUPLICATE ? 'Similar Compliance name, state and rule combination already exists.' : ERROR_MESSAGES.ERROR);
        }
    }, errorCallback);

    function errorCallback() {
        toast.error(ERROR_MESSAGES.DEFAULT);
    }

    function ruleOptionLabel({ label, rule }) {
        return (
            <div className="d-flex flex-column">
                <div>{label}</div>
                {
                    rule &&
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
                }
            </div>
        )
    }

    const schema = {
        fields: [
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.INPUT_AS_TEXT,
                name: 'complianceName',
                label: 'Compliance Name',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: getValue(compliance, 'complianceName')
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXTAREA,
                name: 'complianceDescription',
                label: 'Compliance Description',
                validate: [
                    { type: validatorTypes.MAX_LENGTH, threshold: 1000 }
                ],
                content: getValue(compliance, 'complianceDescription')
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.SELECT,
                name: 'state',
                label: 'State',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: getValue(compliance, 'state.label'),
                isLoading: loadingStates,
                options: states
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.ASYNC_SELECT,
                name: 'rule',
                label: 'Rule',
                options: rules,
                formatOptionLabel: ruleOptionLabel,
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: getValue(compliance, 'rule.label'),
                defaultOptions: rules,
                loadOptions: debounce((keyword, callback) => {
                    getRules({ ...DEFAULT_PAYLOAD, search: keyword }).then(response => {
                        const list = ((response || {}).data || {}).list || [];
                        const _options = list.map(rule => {
                            return { value: rule.id, label: rule.name, rule }
                        });
                        setRules(_options);
                        callback(_options);
                    })
                }, DEBOUNCE_TIME)
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXT_FIELD,
                name: 'proofOfCompliance',
                label: 'Proof Of Compliance.',
                content: getValue(compliance, 'proofOfCompliance')
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXT_FIELD,
                name: 'penalty',
                label: 'Penalty',
                content: getValue(compliance, 'penalty')
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXT_FIELD,
                name: 'maximumPenaltyAmount',
                label: 'Maximum Penalty Amount',
                content: getValue(compliance, 'maximumPenaltyAmount'),
                fieldType: 'number'
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.SELECT,
                name: 'risk',
                label: 'Risk',
                content: getValue(compliance, 'risk.label'),
                options: RiskType.map(x => {
                    return { id: x, name: x }
                }),
                validate: [
                    { type: validatorTypes.REQUIRED }
                ]
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.CHECKBOX,
                name: 'impriosonment',
                label: 'Imprisonment',
                content: getValue(compliance, 'impriosonment') ? 'Yes' : 'No'
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.CHECKBOX,
                name: 'continuingPenalty',
                label: 'Continuing Penalty',
                content: getValue(compliance, 'continuingPenalty') ? 'Yes' : 'No'
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.CHECKBOX,
                name: 'cancellationSuspensionOfLicense',
                label: 'Cancellation/Suspension Of License',
                content: getValue(compliance, 'cancellationSuspensionOfLicense') ? 'Yes' : 'No'
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXT_FIELD,
                name: 'statutoryAuthority',
                label: 'Statutory Authority',
                content: getValue(compliance, 'statutoryAuthority'),
                validate: [
                    { type: validatorTypes.REQUIRED }
                ]
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.SELECT,
                name: 'complianceNature',
                label: 'Compliance Nature',
                content: getValue(compliance, 'complianceNature.label'),
                options: ActivityType.map(x => {
                    return { id: x, name: x }
                }),
                validate: [
                    { type: validatorTypes.REQUIRED }
                ]
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.SELECT,
                name: 'auditType',
                label: 'Audit Type',
                content: getValue(compliance, 'auditType.label'),
                options: AuditType.map(x => {
                    return { id: x, name: x }
                }),
                validate: [
                    { type: validatorTypes.REQUIRED }
                ]
            }
        ],
    };

    function submit(e) {
        preventDefault(e);
        if (form.valid) {
            const payload = {
                complianceName: compliance.complianceName.trim(),
                complianceDescription: (compliance.complianceDescription || '').trim(),
                stateId: compliance.state.value,
                ruleId: compliance.rule.value,
                proofOfCompliance: (compliance.proofOfCompliance || '').trim(),
                penalty: `${compliance.penalty || 0}`,
                risk: compliance.risk.value,
                maximumPenaltyAmount: compliance.maximumPenaltyAmount ? parseFloat(compliance.maximumPenaltyAmount) : 0,
                impriosonment: compliance.impriosonment,
                continuingPenalty: compliance.continuingPenalty || false,
                cancellationSuspensionOfLicense: compliance.cancellationSuspensionOfLicense,
                statutoryAuthority: compliance.statutoryAuthority,
                complianceNature: compliance.complianceNature.value,
                auditType: compliance.auditType.value
            };
            if (action === ACTIONS.EDIT) {
                payload['id'] = data.id;
                updateRuleCompliance(payload)
            } else if (action === ACTIONS.ADD) {
                createRuleCompliance(payload);
            }
        }
    }

    function debugForm(_form) {
        setForm(_form);
        setCompliance(_form.values);
    }

    useEffect(() => {
        if (data) {
            const { risk, complianceNature, state, rule, auditType } = data;
            setCompliance({
                ...compliance,
                ...data,
                risk: risk ? { value: risk, label: risk } : null,
                auditType: risk ? { value: auditType, label: auditType } : null,
                complianceNature: complianceNature ? { value: complianceNature, label: complianceNature } : null,
                state: { value: state.id, label: state.name },
                rule: { value: rule.id, label: rule.name, rule }
            });
        }
    }, [data])

    return (
        <>
            <Modal show={true} backdrop="static" dialogClassName="drawer" animation={false}>
                <Modal.Header closeButton={true} onHide={onClose}>
                    <Modal.Title className="bg">{GetActionTitle('Rule Compliance', action)}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormRenderer FormTemplate={FormTemplate}
                        initialValues={compliance}
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
                <PageLoader>{creating ? 'Creating' : 'Updating'}  Rule Compliance...</PageLoader>
            }
        </>
    )
}

export default RuleComplianceDetails;