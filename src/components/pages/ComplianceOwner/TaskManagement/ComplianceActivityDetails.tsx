import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import FormRenderer, { ComponentMapper, FormTemplate, componentTypes } from "../../../common/FormRenderer";
import { getValue } from "../../../../utils/common";
import { useGetComplianceActivityDocuments, useGetComplianceById, useSubmitComplianceActivity, useUpdateComplianceSchedule, useUploadDocument } from "../../../../backend/compliance";
import styles from "./Styles.module.css";
import Icon from "../../../common/Icon";
import { ACTIONS, FILE_SIZE, STATUS_MAPPING } from "../../../common/Constants";
import { validatorTypes } from "@data-driven-forms/react-form-renderer";
import { ComplianceActivityStatus, ComplianceStatusIconMapping } from "../Compliance.constants";
import ConfirmModal from "../../../common/ConfirmModal";
import { download } from "../../../../utils/common";
import { hasUserAccess } from "../../../../backend/auth";
import { USER_PRIVILEGES } from "../../UserManagement/Roles/RoleConfiguration";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";

function isEditable(status: string) {
    if (hasUserAccess(USER_PRIVILEGES.OWNER_ACTIVITIES_SUBMIT)) {
        return status === ComplianceActivityStatus.PENDING || status === ComplianceActivityStatus.REJECTED || status === ComplianceActivityStatus.DUE;
    } else if (hasUserAccess(USER_PRIVILEGES.MANAGER_ACTIVITIES_REVIEW)) {
        return status === ComplianceActivityStatus.SUBMITTED;
    }
    return false;
}

export default function ComplianceActivityDetails(this: any, { data, onCancel, onSubmit }: any) {
    const [t] = useState(new Date().getTime());
    const [form, setForm] = useState<any>({ valid: true });
    const [formData, setFormData] = useState<any>();
    const [action, setAction] = useState(ACTIONS.NONE);
    const [editable, setEditable] = useState(false);
    const [activityDetails, setActivity] = useState<any>(null);
    const [ruleCompliance, setRuleCompliance] = useState<any>(null);
    const { activity, isFetching, invalidate } = useGetComplianceById(data.id);
    const { documents, refetch } = useGetComplianceActivityDocuments({ complianceId: data.id, t });
    const [initialValue] = useState({ hideButtons: !editable || !hasUserAccess(USER_PRIVILEGES.OWNER_ACTIVITIES_DOCUMENT_UPLOAD), buttonWrapStyles: styles.btnGroup, submitBtnText: 'Upload' })
    const { uploadDocument } = useUploadDocument(refetch)
    const { submitComplianceActivity } = useSubmitComplianceActivity(onSubmit);
    const { updateComplianceSchedule } = useUpdateComplianceSchedule(() => {
        toast.success('Compliance activity reviewed successfully.');
        invalidate();
        onSubmit();
    });

    const schema = {
        fields: [
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'description',
                label: 'Description',
                content: getValue(activityDetails, 'activity.description'),
                className: 'grid-col-100',
                condition: {
                    when: 'description',
                    is: Boolean(getValue(activityDetails, 'activity.description')),
                    then: { visible: true }
                },
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
                content: dayjs(getValue(activityDetails, 'dueDate')).format('DD-MM-YYYY'),
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
                content: getValue(activityDetails, 'veritical.name'),
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
                condition: {
                    when: 'auditType',
                    is: () => {
                        return !isFetching && Boolean(ruleCompliance);
                    },
                    then: { visible: true }
                }
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'complianceNature',
                label: 'Compliance Nature',
                content: getValue(ruleCompliance, 'complianceNature'),
                condition: {
                    when: 'complianceNature',
                    is: () => {
                        return !isFetching && Boolean(ruleCompliance);
                    },
                    then: { visible: true }
                }

            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'risk',
                label: 'Risk',
                content: getValue(ruleCompliance, 'risk'),
                condition: {
                    when: 'risk',
                    is: () => {
                        return !isFetching && Boolean(ruleCompliance);
                    },
                    then: { visible: true }
                }
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'penalty',
                label: 'Penalty',
                content: getValue(ruleCompliance, 'penalty'),
                condition: {
                    when: 'penalty',
                    is: () => {
                        return !isFetching && Boolean(ruleCompliance);
                    },
                    then: { visible: true }
                }
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'maximumPenaltyAmount',
                label: 'Max Penalty Amount',
                content: getValue(ruleCompliance, 'maximumPenaltyAmount'),
                condition: {
                    when: 'maximumPenaltyAmount',
                    is: () => {
                        return !isFetching && Boolean(ruleCompliance);
                    },
                    then: { visible: true }
                }
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'proofOfCompliance',
                label: 'Proof Of Compliance',
                content: getValue(ruleCompliance, 'proofOfCompliance'),
                condition: {
                    when: 'proofOfCompliance',
                    is: () => {
                        return !isFetching && Boolean(ruleCompliance);
                    },
                    then: { visible: true }
                }
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'impriosonment',
                label: 'Imprisonment',
                content: getValue(ruleCompliance, 'impriosonment', 'BOOLEAN'),
                condition: {
                    when: 'impriosonment',
                    is: () => {
                        return !isFetching && Boolean(ruleCompliance);
                    },
                    then: { visible: true }
                }
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'continuingPenalty',
                label: 'Continuing Penalty',
                content: getValue(ruleCompliance, 'continuingPenalty', 'BOOLEAN'),
                condition: {
                    when: 'continuingPenalty',
                    is: () => {
                        return !isFetching && Boolean(ruleCompliance);
                    },
                    then: { visible: true }
                }
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'cancellationSuspensionOfLicense',
                label: 'Cancellation/Suspension of License',
                content: getValue(ruleCompliance, 'cancellationSuspensionOfLicense', 'BOOLEAN'),
                condition: {
                    when: 'cancellationSuspensionOfLicense',
                    is: () => {
                        return !isFetching && Boolean(ruleCompliance);
                    },
                    then: { visible: true }
                }
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'complianceNotAvailable',
                content: (
                    <div className="d-flex py-3 align-items-center gap-3">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="text-warn" />
                        <span className="text-appprimary fst-italic fw-bold">No compliance information available. Contact admin to add compliance details</span>
                    </div>
                ),
                className: 'grid-col-100',
                condition: {
                    when: 'complianceNotAvailable',
                    is: () => {
                        return !isFetching && !Boolean(ruleCompliance);
                    },
                    then: { visible: true }
                }
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'formsStatusRemarksReadOnly',
                label: 'Remarks',
                content: getValue(activityDetails, 'formsStatusRemarks'),
                className: 'grid-col-100',
                condition: {
                    when: 'formsStatusRemarksReadOnly',
                    is: () => {
                        return hasUserAccess(USER_PRIVILEGES.OWNER_DASHBOARD)
                    },
                    then: { visible: true }
                }
            },
        ]
    }

    const schema2 = {
        fields: [
            {
                component: componentTypes.TAB_ITEM,
                name: 'documentSubHeader',
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
                validate: editable && hasUserAccess(USER_PRIVILEGES.OWNER_ACTIVITIES_DOCUMENT_UPLOAD) ? [
                    { type: validatorTypes.REQUIRED },
                    { type: 'file-size', maxSize: 25 * FILE_SIZE.MB }
                ] : [],
                className: 'w-33',
                downloadDocument: downloadDocument.bind(this)
            },
            {
                component: componentTypes.TAB_ITEM,
                name: 'reviewSubHeader',
                content: 'Review',
                className: 'grid-col-100 text-lg fw-bold pb-0',
                condition: {
                    when: 'reviewSubHeader',
                    is: () => {
                        return hasUserAccess(USER_PRIVILEGES.MANAGER_DASHBOARD)
                    },
                    then: { visible: true }
                }
            },
            {
                component: editable ? componentTypes.SELECT : componentTypes.PLAIN_TEXT,
                name: 'status',
                label: 'Compliance Status',
                options: [
                    { id: ComplianceActivityStatus.APPROVE, name: 'Approve' },
                    { id: ComplianceActivityStatus.REJECT, name: 'Reject' }
                ],
                className: 'w-33',
                content: getValue(activityDetails, 'status'),
                validate: [
                    { type: validatorTypes.REQUIRED },
                ],
                condition: {
                    when: 'status',
                    is: () => {
                        return hasUserAccess(USER_PRIVILEGES.MANAGER_DASHBOARD)
                    },
                    then: { visible: true }
                }
            },
            {
                component: editable ? componentTypes.TEXTAREA : componentTypes.PLAIN_TEXT,
                name: 'formsStatusRemarks',
                label: 'Remarks',
                className: 'w-33',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: getValue(activityDetails, 'formsStatusRemarks'),
                condition: {
                    when: 'formsStatusRemarks',
                    is: () => {
                        return hasUserAccess(USER_PRIVILEGES.MANAGER_DASHBOARD)
                    },
                    then: { visible: true }
                }
            }
        ]
    }

    function TitleTmpl({ name, status }: any) {
        return (
            <div className="d-flex flex-row gap-2 mb-2">
                <Icon name={ComplianceStatusIconMapping[status]} className={`status-${status} text-xl`} />
                <span className={`text-xl fw-bold status-${status} ellipse`}>{name}</span>
            </div>
        )
    }

    function debugForm(_form: any) {
        setForm(_form);
        setFormData(_form.values);
    }

    function downloadDocument({ fileName, filePath }: any) {
        download(fileName, filePath);
    }

    function performSubmit() {
        if (hasUserAccess(USER_PRIVILEGES.OWNER_DASHBOARD)) {
            setAction(ACTIONS.CONFIRM);
        } else if (hasUserAccess(USER_PRIVILEGES.MANAGER_DASHBOARD)) {
            const { status, formsStatusRemarks } = formData;
            updateComplianceSchedule({
                ...activityDetails,
                status: status.value,
                formsStatusRemarks,
                auditedDate: new Date().toISOString()
            })
        }
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
            setEditable(Boolean(ruleComplianceDetail) && isEditable(data.status));
        }
    }, [isFetching])

    return (
        <>
            <div className={styles.overlay}>
                {
                    !isFetching && Boolean(activity) &&
                    <div className="card border-0 h-full w-full">
                        <div className="d-flex flex-row justify-space-between px-4 pt-4 align-items-center">
                            <TitleTmpl name={getValue(data, 'activity.name')} status={data.status}/>
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
                            {
                                hasUserAccess(USER_PRIVILEGES.OWNER_DASHBOARD) &&
                                <FormRenderer FormTemplate={FormTemplate}
                                    initialValues={initialValue}
                                    componentMapper={ComponentMapper}
                                    schema={schema2}
                                    onSubmit={handleUpload}
                                />
                            }
                            {
                                hasUserAccess(USER_PRIVILEGES.MANAGER_DASHBOARD) &&
                                <FormRenderer FormTemplate={FormTemplate}
                                    initialValues={{ hideButtons: true }}
                                    componentMapper={ComponentMapper}
                                    schema={schema2}
                                    debug={debugForm}
                                />
                            }
                            <div className="d-flex justify-content-end mt-4">
                                {
                                    editable &&
                                    <>
                                        <Button variant="outline-secondary" className="btn btn-outline-secondary px-4" onClick={onCancel}>{'Cancel'}</Button>
                                        <Button variant="primary" onClick={performSubmit} disabled={!form.valid} className="px-4 ms-3" >{'Submit'}</Button>
                                    </>
                                }
                                {
                                    !editable &&
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