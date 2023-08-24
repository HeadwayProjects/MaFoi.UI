import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import FormRenderer, { ComponentMapper, FormTemplate, componentTypes } from "../../../common/FormRenderer";
import { getValue } from "../../../../utils/common";
import { useGetComplianceActivityDocuments, useGetComplianceById, useSubmitComplianceActivity, useUploadDocument } from "../../../../backend/compliance";
import styles from "./Styles.module.css";
import Icon from "../../../common/Icon";
import { ACTIONS, FILE_SIZE } from "../../../common/Constants";
import { validatorTypes } from "@data-driven-forms/react-form-renderer";
import { ComplianceActivityStatus } from "../Compliance.constants";
import ConfirmModal from "../../../common/ConfirmModal";
import { download } from "../../../../utils/common";
import { hasUserAccess } from "../../../../backend/auth";
import { USER_PRIVILEGES } from "../../UserManagement/Roles/RoleConfiguration";

export default function ComplianceActivityDetails(this: any, { data, onCancel, onSubmit }: any) {
    const [t] = useState(new Date().getTime());
    const [action, setAction] = useState(ACTIONS.NONE);
    const [editable] = useState(data.status === ComplianceActivityStatus.PENDING || data.status === ComplianceActivityStatus.REJECTED);
    const [activityDetails, setActivity] = useState<any>(null);
    const [ruleCompliance, setRuleCompliance] = useState<any>(null);
    const { activity, isFetching } = useGetComplianceById(data.id);
    const { documents, refetch } = useGetComplianceActivityDocuments({ complianceId: data.id, t });
    const [initialValue, setInitialValue] = useState({ hideButtons: !editable || !hasUserAccess(USER_PRIVILEGES.OWNER_ACTIVITIES_DOCUMENT_UPLOAD), buttonWrapStyles: styles.btnGroup, submitBtnText: 'Upload' })
    const { uploadDocument } = useUploadDocument(refetch)
    const { submitComplianceActivity } = useSubmitComplianceActivity(onSubmit)

    const schema = {
        fields: [
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'activity',
                label: 'Activity',
                content: getValue(activityDetails, 'activity.name'),
                className: 'grid-col-100'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'description',
                label: 'Description',
                content: getValue(activityDetails, 'activity.description'),
                className: 'grid-col-100'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'act',
                label: 'Act',
                content: getValue(activityDetails, 'act.name'),
                className: 'grid-col-100'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'dueDate',
                label: 'Due Date',
                content: getValue(activityDetails, 'dueDate'),
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'status',
                label: 'Status',
                content: getValue(activityDetails, 'status'),
            },
            {
                component: componentTypes.WIZARD,
                name: 'emptySpace1',
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'company',
                label: 'Company',
                content: getValue(activityDetails, 'company.name'),
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'associateCompany',
                label: 'Associate Company',
                content: getValue(activityDetails, 'associateCompany.name'),
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'location',
                label: 'Location',
                content: getValue(activityDetails, 'location.name'),
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'vertical',
                label: 'Vertical',
                content: getValue(activityDetails, 'vertical.name'),
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'department',
                label: 'Department',
                content: getValue(activityDetails, 'department.name'),
            },
            {
                component: componentTypes.WIZARD,
                name: 'emptySpace2',
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'owner',
                label: 'Owner',
                content: getValue(activityDetails, 'complianceOwner.name'),
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'manager',
                label: 'Manager',
                content: getValue(activityDetails, 'complianceManager.name'),
            },
            {
                component: componentTypes.WIZARD,
                name: 'emptySpace3',
            },
            {
                component: componentTypes.TAB_ITEM,
                name: 'subHeader1',
                content: 'Rule Compliance',
                className: 'grid-col-100 text-lg fw-bold pb-0'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'rule',
                label: 'Rule',
                content: getValue(activityDetails, 'rule.name'),
                className: 'grid-col-100'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'ruleDescription',
                label: 'Description',
                content: getValue(activityDetails, 'rule.description'),
                className: 'grid-col-100'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'auditType',
                label: 'Audit Type',
                content: getValue(ruleCompliance, 'auditType'),
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'complianceNature',
                label: 'Compliance Nature',
                content: getValue(ruleCompliance, 'complianceNature'),
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'risk',
                label: 'Risk',
                content: getValue(ruleCompliance, 'risk'),
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'penalty',
                label: 'Penalty',
                content: getValue(ruleCompliance, 'penalty'),
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'maximumPenaltyAmount',
                label: 'Max Penalty Amount',
                content: getValue(ruleCompliance, 'maximumPenaltyAmount'),
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'proofOfCompliance',
                label: 'Proof Of Compliance',
                content: getValue(ruleCompliance, 'proofOfCompliance'),
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'impriosonment',
                label: 'Impriosonment',
                content: getValue(ruleCompliance, 'impriosonment', 'BOOLEAN'),
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'continuingPenalty',
                label: 'Continuing Penalty',
                content: getValue(ruleCompliance, 'continuingPenalty', 'BOOLEAN'),
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'cancellationSuspensionOfLicense',
                label: 'Cancellation/Suspension of License',
                content: getValue(ruleCompliance, 'cancellationSuspensionOfLicense', 'BOOLEAN'),
            }
        ]
    }

    const schema2 = {
        fields: [
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'formsStatusRemarks',
                label: 'Remarks',
                content: getValue(activityDetails, 'formsStatusRemarks')
            },
            {
                component: componentTypes.TAB_ITEM,
                name: 'subHeader2',
                content: 'Documents',
                className: 'grid-col-100 text-lg fw-bold pb-0',
            },
            {
                component: componentTypes.DOCUMENTS_UPLOAD,
                label: 'Upload File',
                name: 'file',
                type: 'file',
                upload: editable && hasUserAccess(USER_PRIVILEGES.OWNER_ACTIVITIES_DOCUMENT_UPLOAD),
                documents,
                validate: [
                    { type: validatorTypes.REQUIRED },
                    { type: 'file-size', maxSize: 25 * FILE_SIZE.MB }
                ],
                className: 'w-33',
                downloadDocument: downloadDocument.bind(this)
            }
        ]
    }

    function downloadDocument({ fileName, filePath }: any) {
        download(fileName, filePath);
    }

    function handleSubmit() {
        setAction(ACTIONS.NONE);
        submitComplianceActivity([data.id]);
    }

    function handleUpload({ file }: any) {
        const formData = new FormData();
        const files = [...file.inputFiles];
        files.forEach(_file => {
            formData.append('file', _file, _file.name);
        });
        uploadDocument({
            formData,
            id: data.id
        });
    }

    useEffect(() => {
        if (!isFetching && activity) {
            const { compliance, ruleComplianceDetail } = activity;
            setActivity(compliance);
            setRuleCompliance(ruleComplianceDetail);
        }

    }, [isFetching])

    return (
        <>
            <div className={styles.overlay}>
                {
                    !isFetching && Boolean(activity) &&
                    <div className="card border-0 h-full w-full">
                        <div className="d-flex flex-row justify-space-between px-4 pt-4 align-items-center">
                            <h4 className="fw-bold mb-0">Compliance Activity Details</h4>
                            <Icon name="close" action={onCancel} className="ms-auto" />
                        </div>
                        <div className={`d-flex flex-column justify-space-between p-4 ${styles.activitydetailsContainer} `}>
                            <div className="horizontal-form">
                                <FormRenderer FormTemplate={FormTemplate}
                                    initialValues={{ ...activity, hideButtons: true }}
                                    componentMapper={ComponentMapper}
                                    schema={schema}
                                />

                            </div>
                            <FormRenderer FormTemplate={FormTemplate}
                                initialValues={initialValue}
                                componentMapper={ComponentMapper}
                                schema={schema2}
                                onSubmit={handleUpload}
                            />
                            <div className="d-flex justify-content-end mt-4">
                                {
                                    editable && hasUserAccess(USER_PRIVILEGES.OWNER_ACTIVITIES_SUBMIT) &&
                                    <>
                                        <Button variant="outline-secondary" className="btn btn-outline-secondary px-4" onClick={onCancel}>{'Cancel'}</Button>
                                        <Button variant="primary" onClick={() => setAction(ACTIONS.CONFIRM)} className="px-4 ms-3" >{'Submit'}</Button>
                                    </>
                                }
                                {
                                    (!editable || !hasUserAccess(USER_PRIVILEGES.OWNER_ACTIVITIES_SUBMIT)) &&
                                    <Button variant="primary" onClick={onCancel} className="px-4 ms-3" >{'Close'}</Button>
                                }
                            </div>
                        </div>
                    </div>
                }
            </div>
            {
                action === ACTIONS.CONFIRM &&
                <ConfirmModal title={'Submit Compliance Activity'} onSubmit={handleSubmit} onClose={() => setAction(ACTIONS.NONE)}>
                    {
                        (documents || []).length === 0 &&
                        <div className="text-center text-warn mb-4">There are no supporting documents uploaded to this activity!</div>
                    }
                    <div className="text-center mb-4">Are you sure you want to submit the compliance activity ?</div>
                </ConfirmModal>
            }
        </>
    )
}