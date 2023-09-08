import React, { useEffect, useState } from "react";
import {
    useCreateRuleMapping,
    useUpdateRuleMapping,
    useUploadActStateMappingTemplate
} from "../../../../backend/masters";
import { toast } from "react-toastify";
import { API_RESULT, ERROR_MESSAGES } from "../../../../utils/constants";
import { Modal } from "react-bootstrap";
import { CentralId, GetActionTitle, RuleTypeEnum } from "../Master.constants";
import { ACTIONS } from "../../../common/Constants";
import PageLoader from "../../../shared/PageLoader";
import { ResponseModel } from "../../../../models/responseModel";
import Stepper from "../../../common/Stepper/Stepper";
import StepperItem from "../../../common/Stepper/StepperItem";
import MappingDetails from "./MappingDetails";
import RuleComplianceDetails from "./RuleComplianceDetails";
import DocumentAndOtherMappingDetails from "./DocumentAndOtherMappingDetails";
import { Steps } from "./RuleStateCompanyMapping";
const DefaultRule = RuleTypeEnum.STATE;

function RuleStateCompanyMappingDetails(this: any, { step, action, data, onClose, onSubmit }: any) {
    const [activeStep, setActiveStep] = useState(step || Steps.MAPPING);
    const [form] = useState<any>({});
    const [mapping, setMapping] = useState<any>({ type: { value: DefaultRule, label: DefaultRule } });
    const { uploadActStateMappingTemplate, uploading } = useUploadActStateMappingTemplate(({ key, value }: ResponseModel) => {
        if (key === API_RESULT.SUCCESS) {
            toast.success(`Template uploaded successfully.`);
            onSubmit();
        } else {
            toast.error(value || ERROR_MESSAGES.UPLOAD_FILE);
        }
    }, errorCallback);
    const { createRuleMapping, creating } = useCreateRuleMapping(({ key, value }: ResponseModel) => {
        if (key === API_RESULT.SUCCESS) {
            toast.success(`Mapping created successfully.`);
            // if (mapping.file) {
            //     uploadTemplate(value);
            // } else {
            // }
            onSubmit();
        } else {
            toast.error(value || ERROR_MESSAGES.ERROR);
        }
    }, errorCallback);
    const { updateRuleMapping, updating } = useUpdateRuleMapping(({ key, value }: ResponseModel) => {
        if (key === API_RESULT.SUCCESS) {
            toast.success(`Mapping updated successfully.`);
            // if (mapping.file) {
            //     uploadTemplate(data.id);
            // } else {
            // }
            onSubmit();
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

    function handleMappingsSubmit(values: any) {
        setMapping({ ...mapping, ...values });
        setActiveStep(Steps.RULE_COMPLIANCE);
    }

    function handleRuleComplianceSubmit(ruleComplianceDetails: any) {
        setMapping({ ...mapping, ruleComplianceDetails });
        setActiveStep(Steps.DOCUMENTS);
    }

    function handleDocumentsSubmit({ formName, sendNotification }: any) {
        const { id, ruleComplianceDetailId, actRuleActivityMappingId } = data || {};
        const { act, rule, activity, state, ruleComplianceDetails } = mapping;
        const { complianceDescription, proofOfCompliance, penalty, risk, maximumPenaltyAmount,
            impriosonment, continuingPenalty, cancellationSuspensionOfLicense,
            statutoryAuthority, complianceNature = '', auditType } = ruleComplianceDetails;
        const _payload: any = {
            id: id ? id : undefined,
            actId: action === ACTIONS.ADD ? act.value : undefined,
            activityId: action === ACTIONS.ADD ? activity.value : undefined,
            stateId: action === ACTIONS.ADD ? state.value : undefined,
            ruleId: action === ACTIONS.ADD ? rule.value : undefined,
            formName: formName || '',
            ruleComplianceDetailId: ruleComplianceDetailId ? ruleComplianceDetailId : undefined,
            actRuleActivityMappingId: actRuleActivityMappingId ? actRuleActivityMappingId : undefined,
            complianceDescription,
            proofOfCompliance: proofOfCompliance || '',
            penalty : penalty || '',
            risk: risk.value,
            maximumPenaltyAmount: maximumPenaltyAmount || 0,
            impriosonment: impriosonment || false,
            continuingPenalty: continuingPenalty || false,
            cancellationSuspensionOfLicense: cancellationSuspensionOfLicense || false,
            statutoryAuthority: statutoryAuthority || '',
            complianceNature: complianceNature || '',
            auditType: auditType.value,
            sendNotification: sendNotification || false
        }

        if (action === ACTIONS.ADD) {
            createRuleMapping(_payload);
        } else {
            updateRuleMapping(_payload);
        }
    }

    useEffect(() => {
        if (data) {
            const { act, rule, activity, state, ruleComplianceDetails } = data;
            const { risk, auditType } = ruleComplianceDetails || {};
            const type = (state || {}).id === CentralId ? RuleTypeEnum.CENTRAL : RuleTypeEnum.STATE;
            setMapping({
                ...mapping, ...data,
                type: { value: type, label: type },
                act: { value: act.id, label: act.name, act },
                rule: { value: rule.id, label: rule.name, rule },
                activity: { value: activity.id, label: activity.name, activity },
                state: { value: state.id, label: state.name, state },
                ruleComplianceDetails: {
                    ...ruleComplianceDetails,
                    risk: risk ? { value: risk, label: risk } : null,
                    auditType: risk ? { value: auditType, label: auditType } : null
                }
            });
        }
    }, [data]);

    return (
        <>
            <Modal show={true} backdrop="static" dialogClassName="drawer noFooter" animation={false}>
                <Modal.Header closeButton={true} onHide={onClose}>
                    <Modal.Title className="bg">{GetActionTitle('Mapping', action)}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Stepper>
                        <StepperItem title="1. Mapping Details" stepId={Steps.MAPPING} activeStep={activeStep}
                            valid={activeStep > Steps.MAPPING}>
                            {
                                activeStep === Steps.MAPPING && Boolean(mapping) &&
                                <MappingDetails action={action} data={mapping} onSubmit={handleMappingsSubmit} />
                            }
                        </StepperItem>
                        <StepperItem title="2. Rule Compliance" stepId={Steps.RULE_COMPLIANCE} activeStep={activeStep}
                            valid={activeStep > Steps.RULE_COMPLIANCE}>
                            {
                                activeStep === Steps.RULE_COMPLIANCE && Boolean(mapping) &&
                                <RuleComplianceDetails action={action} data={mapping} onSubmit={handleRuleComplianceSubmit}
                                    onCancel={() => setActiveStep(Steps.MAPPING)} />
                            }
                        </StepperItem>
                        <StepperItem title="3. Documents & Others" stepId={Steps.DOCUMENTS} activeStep={activeStep}
                            valid={activeStep > Steps.DOCUMENTS}>
                            <DocumentAndOtherMappingDetails action={action} data={data} onSubmit={handleDocumentsSubmit}
                                onCancel={() => setActiveStep(Steps.RULE_COMPLIANCE)} />
                        </StepperItem>
                    </Stepper>
                </Modal.Body>
            </Modal>
            {
                (creating || uploading || updating) && <PageLoader />
            }
        </>
    )
}

export default RuleStateCompanyMappingDetails;