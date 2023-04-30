import React, { useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import { componentTypes, validatorTypes } from "@data-driven-forms/react-form-renderer";
import { Button } from "react-bootstrap";
import { ERROR_MESSAGES } from "../../../../utils/constants";
import { useGetRules, useGetStates } from "../../../../backend/masters";
import { getValue, preventDefault } from "../../../../utils/common";
import { ActivityType, GetActionTitle, RiskType } from "../Master.constants";
import FormRenderer, { ComponentMapper, FormTemplate } from "../../../common/FormRenderer";
import { ACTIONS } from "../../../common/Constants";
import { toast } from "react-toastify";

function RuleComplianceDetails({ action, data, onClose, onSubmit }) {
    const [form, setForm] = useState({});
    const { states, isFetching: loadingStates } = useGetStates();
    const { rules, isFetching: loadingRules } = useGetRules();
    const [compliance, setCompliance] = useState({ hideButtons: true });
    // const { updateLocation } = useUpdateLocation(() => {
    //     toast.success(`${locationDetails.name} updated successsfully.`);
    //     onSubmit();
    // }, errorCallback);
    // const { createLocation } = useCreateLocation((response) => {
    //     if (response instanceof AxiosError) {
    //         errorCallback();
    //     } else {
    //         toast.success(`${locationDetails.name} created successsfully.`);
    //         onSubmit();
    //     }
    // }, errorCallback);

    function errorCallback() {
        toast.error(ERROR_MESSAGES.DEFAULT);
    }

    const schema = {
        fields: [
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXT_FIELD,
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
                content: getValue(compliance, 'state.name'),
                isLoading: loadingStates,
                options: states
            },
            // {
            //     component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.SELECT,
            //     name: 'rule',
            //     label: 'Rule',
            //     options: rules,
            //     validate: [
            //         { type: validatorTypes.REQUIRED }
            //     ],
            //     isLoading: loadingRules,
            //     content: getValue(compliance, 'rule.name')
            // },
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
                content: getValue(compliance, 'risk'),
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
                label: 'Impriosonment',
                content: getValue(compliance, 'impriosonment')
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.CHECKBOX,
                name: 'continuingPenalty',
                label: 'Continuing Penalty',
                content: getValue(compliance, 'continuingPenalty')
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
                content: getValue(compliance, 'complianceNature'),
                options: ActivityType.map(x => {
                    return { id: x, name: x }
                }),
                validate: [
                    { type: validatorTypes.REQUIRED }
                ]
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXT_FIELD,
                name: 'auditType',
                label: 'Audit Type',
                content: getValue(compliance, 'auditType')
            }
        ],
    };

    function submit(e) {
        preventDefault(e);
        if (form.valid) {
            const payload = {
                complianceName: compliance.complianceName,
                complianceDescription: compliance.complianceDescription || '',
                stateId: compliance.state.value,
                // ruleId: compliance.rule.value,
                proofOfCompliance: compliance.proofOfCompliance || '',
                penalty: compliance.penalty,
                risk: compliance.risk.value,
                maximumPenaltyAmount: compliance.maximumPenaltyAmount || 0,
                impriosonment: compliance.impriosonment,
                continuingPenalty: compliance.continuingPenalty || false,
                cancellationSuspensionOfLicense: compliance.cancellationSuspensionOfLicense,
                statutoryAuthority: compliance.statutoryAuthority,
                complianceNature: compliance.complianceNature.value,
                auditType: compliance.auditType || ''
            };
            if (action === ACTIONS.EDIT) {
                payload['id'] = data.id;
                // updateLocation(payload)
            } else if (action === ACTIONS.ADD) {
                // createLocation(payload);
            }
            console.log(payload);
        }
    }

    function debugForm(_form) {
        setForm(_form);
        setCompliance(_form.values);
    }

    useEffect(() => {
        if (data) {
            // const { id, code, name, states: state, cities: city } = data;
            // setLocationDetails({
            //     ...locationDetails, id, code, name,
            //     state: { value: state.id, label: state.name },
            //     city: { value: city.id, label: city.name }
            // });
            // setStateId(state.id);
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
        </>
    )
}

export default RuleComplianceDetails;