import React, { useEffect, useState } from "react";
import { validatorTypes } from "@data-driven-forms/react-form-renderer";
import { getValue } from "../../../../utils/common";
import { AuditType, RiskType } from "../Master.constants";
import FormRenderer, { ComponentMapper, FormTemplate, componentTypes } from "../../../common/FormRenderer";
import { ACTIONS } from "../../../common/Constants";

const BtnConfig = {
    buttonWrapStyles: 'justify-content-end flex-row-reverse',
    showCancel: true,
    cancelBtnText: 'Previous',
    submitBtnText: 'Next'
}

function RuleComplianceDetails({ action, data, onCancel, onSubmit }: any) {
    const [form, setForm] = useState<any>({});
    const [compliance, setCompliance] = useState<any>({});

    const schema = {
        fields: [
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXTAREA,
                name: 'complianceDescription',
                label: 'Compliance Description',
                validate: [
                    { type: validatorTypes.REQUIRED },
                    { type: validatorTypes.MAX_LENGTH, threshold: 1000 }
                ],
                content: getValue(compliance, 'complianceDescription')
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
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXT_FIELD,
                name: 'statutoryAuthority',
                label: 'Statutory Authority',
                content: getValue(compliance, 'statutoryAuthority'),
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                condition: {
                    when: 'auditType',
                    is: ({ value }: any) => value === 'Statutory',
                    then: { visible: true },
                    else: { set: { statutoryAuthority: '' } }
                }
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXT_FIELD,
                name: 'proofOfCompliance',
                label: 'Proof Of Compliance.',
                content: getValue(compliance, 'proofOfCompliance') || '-NA-'
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXT_FIELD,
                name: 'penalty',
                label: 'Penalty',
                content: getValue(compliance, 'penalty') || '-NA-'
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXT_FIELD,
                name: 'maximumPenaltyAmount',
                label: 'Maximum Penalty Amount',
                content: getValue(compliance, 'maximumPenaltyAmount'),
                fieldType: 'number'
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
            }
        ]
    };

    useEffect(() => {
        if (data) {
            const complianceDetails = (data || {}).ruleComplianceDetails;
            setCompliance({
                ...compliance,
                ...(complianceDetails || {})
            });
        }
    }, [data])

    return (
        <FormRenderer FormTemplate={FormTemplate}
            initialValues={{ ...BtnConfig, ...compliance }}
            componentMapper={ComponentMapper}
            schema={schema}
            onSubmit={onSubmit}
            onCancel={onCancel}
        />
    )
}

export default RuleComplianceDetails;