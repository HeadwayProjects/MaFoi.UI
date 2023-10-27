import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import FormRenderer, { ComponentMapper, FormTemplate, componentTypes } from "../../../common/FormRenderer";
import { getValue, toBackendDateFormat } from "../../../../utils/common";
import { useDeleteComplianceDocument, useGetComplianceActivityDocuments, useGetComplianceById, useSubmitComplianceActivity, useUpdateComplianceSchedule, useUploadDocument } from "../../../../backend/compliance";
import styles from "./Styles.module.css";
import Icon from "../../../common/Icon";
import { ACTIONS, ALLOWED_FILES_REGEX, FILE_SIZE } from "../../../common/Constants";
import { validatorTypes } from "@data-driven-forms/react-form-renderer";
import { COMPLIANCE_ACTIVITY_INDICATION, ComplianceActivityStatus, ComplianceStatusIconMapping, ComplianceStatusMapping } from "../../../../constants/Compliance.constants";
import ConfirmModal from "../../../common/ConfirmModal";
import { download } from "../../../../utils/common";
import { hasUserAccess } from "../../../../backend/auth";
import { USER_PRIVILEGES } from "../../UserManagement/Roles/RoleConfiguration";
import { toast } from "react-toastify";
import dayjs from "dayjs";

function isFormEditable(status: ComplianceActivityStatus) {
    if (hasUserAccess(USER_PRIVILEGES.OWNER_DASHBOARD)) {
        return [ComplianceActivityStatus.DUE, ComplianceActivityStatus.NON_COMPLIANT, ComplianceActivityStatus.REJECTED].includes(status);
    } else if (hasUserAccess(USER_PRIVILEGES.MANAGER_DASHBOARD)) {
        return status === ComplianceActivityStatus.PENDING;
    }
    return false;
}

function hasEditableAccess() {
    return hasUserAccess(USER_PRIVILEGES.OWNER_ACTIVITIES_SUBMIT)
        || hasUserAccess(USER_PRIVILEGES.MANAGER_ACTIVITIES_REVIEW);
}

export default function ComplianceActivityDetails(this: any, { data, onCancel, onSubmit }: any) {
    const [t] = useState(new Date().getTime());
    const [form, setForm] = useState<any>({ valid: true });
    const [formData, setFormData] = useState<any>();
    const [action, setAction] = useState(ACTIONS.NONE);
    const [editableForm, setEditable] = useState(isFormEditable(data.status));
    const [activityDetails, setActivity] = useState<any>(null);
    const [document, setDocument] = useState<any>();
    const [ruleCompliance, setRuleCompliance] = useState<any>(null);
    const { activity, isFetching, invalidate } = useGetComplianceById(data.id, { t });
    const { documents, refetch } = useGetComplianceActivityDocuments({ complianceId: data.id, t });
    const [initialValue, setInitialValue] = useState<any>({ hideButtons: !(editableForm && hasUserAccess(USER_PRIVILEGES.OWNER_ACTIVITIES_DOCUMENT_UPLOAD)), buttonWrapStyles: styles.btnGroup, submitBtnText: 'Upload' })
    const { uploadDocument } = useUploadDocument(() => {
        refetch();
        setInitialValue({ ...initialValue, file: null });
    })
    const { submitComplianceActivity } = useSubmitComplianceActivity(onSubmit);
    const { updateComplianceSchedule } = useUpdateComplianceSchedule(() => {
        toast.success('Compliance activity reviewed successfully.');
        invalidate();
        onSubmit();
    });
    const { deleteDocument } = useDeleteComplianceDocument(() => {
        refetch();
        setAction(ACTIONS.NONE);
        setDocument(undefined);
    })

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
                label: 'Act Name',
                content: getValue(activityDetails, 'act.name'),
                className: 'grid-col-66'
            },
            {
                component: componentTypes.WIZARD,
                name: 'emptySpace2',
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'lawCategory',
                label: 'Law Category',
                content: getValue(activityDetails, 'act.law.name') || '-NA-'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'activityType',
                label: 'Activity Type',
                content: getValue(activityDetails, 'activity.type')
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'establishmentType',
                label: 'Establishment Type',
                content: getValue(activityDetails, 'act.establishmentType')
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'status',
                label: 'Status',
                content: ComplianceStatusMapping[getValue(activityDetails, 'status')]
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'dueDate',
                label: 'Due Date',
                content: dayjs(getValue(activityDetails, 'dueDate')).format('DD-MM-YYYY')
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'periodicity',
                label: 'Periodicity',
                content: getValue(activityDetails, 'activity.periodicity')
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
                component: componentTypes.TAB_ITEM,
                name: 'subHeader11',
                content: getValue(ruleCompliance, 'complianceDescription'),
                className: 'grid-col-100 pb-0',
                condition: {
                    when: 'subHeader11',
                    is: () => {
                        return Boolean(getValue(ruleCompliance, 'complianceDescription'))
                    },
                    then: { visible: true }
                }
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'rule',
                label: 'Rule Name',
                content: getValue(activityDetails, 'rule.name')
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'ruleNo',
                label: 'Rule No.',
                content: getValue(activityDetails, 'rule.ruleNo') || '-NA-'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'rule',
                label: 'Section No.',
                content: getValue(activityDetails, 'rule.setionNo') || '-NA-'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'ruleDescription',
                label: 'Rule Description',
                content: getValue(activityDetails, 'rule.description'),
                className: 'grid-col-100'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'risk',
                label: 'Risk',
                content: getValue(ruleCompliance, 'risk')
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'auditType',
                label: 'Audit Type',
                content: getValue(ruleCompliance, 'auditType')
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'statutoryAuthority',
                label: 'Statutory Authority',
                content: getValue(ruleCompliance, 'statutoryAuthority'),
                condition: {
                    when: 'auditType',
                    is: () => {
                        const auditType = getValue(ruleCompliance, 'auditType');
                        return auditType && auditType === 'Statutory';
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
                },
                className: 'grid-col-66'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'maximumPenaltyAmount',
                label: 'Max Penalty Amount',
                content: getValue(ruleCompliance, 'maximumPenaltyAmount')
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'proofOfCompliance',
                label: 'Proof Of Compliance',
                content: getValue(ruleCompliance, 'proofOfCompliance') || '-NA-',
                className: 'grid-col-100'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'impriosonment',
                label: 'Imprisonment',
                content: getValue(ruleCompliance, 'impriosonment', 'BOOLEAN')
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'continuingPenalty',
                label: 'Continuing Penalty',
                content: getValue(ruleCompliance, 'continuingPenalty', 'BOOLEAN')
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'cancellationSuspensionOfLicense',
                label: 'Cancellation/Suspension of License',
                content: getValue(ruleCompliance, 'cancellationSuspensionOfLicense', 'BOOLEAN')
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'formName',
                label: 'Form Name',
                content: getValue(activityDetails, 'actStateMapping.formName') || '-NA-'
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
                        const status = getValue(data, 'status');
                        return hasUserAccess(USER_PRIVILEGES.OWNER_DASHBOARD) &&
                            (status === ComplianceActivityStatus.APPROVED || status === ComplianceActivityStatus.REJECTED)
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
                upload: editableForm && hasUserAccess(USER_PRIVILEGES.OWNER_ACTIVITIES_DOCUMENT_UPLOAD),
                documents,
                delete: editableForm && hasUserAccess(USER_PRIVILEGES.OWNER_ACTIVITIES_DOCUMENT_UPLOAD),
                validate: editableForm && hasUserAccess(USER_PRIVILEGES.OWNER_ACTIVITIES_DOCUMENT_UPLOAD) ? [
                    { type: validatorTypes.REQUIRED },
                    { type: 'file-type', regex: ALLOWED_FILES_REGEX },
                    { type: 'file-size', maxSize: 25 * FILE_SIZE.MB }
                ] : [],
                className: 'w-33',
                downloadDocument: downloadDocument.bind(this),
                deleteDocument: handleDeleteDocument.bind(this)
            },
            {
                component: componentTypes.TAB_ITEM,
                name: 'reviewSubHeader',
                content: 'Review',
                className: 'grid-col-100 text-lg fw-bold pb-0',
                condition: {
                    when: 'reviewSubHeader',
                    is: () => {
                        const status = getValue(data, 'status');
                        return hasUserAccess(USER_PRIVILEGES.MANAGER_DASHBOARD) &&
                            status !== ComplianceActivityStatus.DUE && status !== ComplianceActivityStatus.NON_COMPLIANT
                    },
                    then: { visible: true }
                }
            },
            {
                component: editableForm ? componentTypes.SELECT : componentTypes.PLAIN_TEXT,
                name: 'status',
                label: 'Compliance Status',
                options: [
                    { id: ComplianceActivityStatus.APPROVED, name: 'Approve' },
                    { id: ComplianceActivityStatus.REJECTED, name: 'Reject' }
                ],
                className: 'w-33',
                content: getValue(activityDetails, 'status'),
                validate: [
                    { type: validatorTypes.REQUIRED },
                ],
                condition: {
                    when: 'status',
                    is: () => {
                        const status = getValue(data, 'status');
                        return hasUserAccess(USER_PRIVILEGES.MANAGER_DASHBOARD) &&
                            status !== ComplianceActivityStatus.DUE && status !== ComplianceActivityStatus.NON_COMPLIANT
                    },
                    then: { visible: true }
                }
            },
            {
                component: editableForm ? componentTypes.TEXTAREA : componentTypes.PLAIN_TEXT,
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
                        const status = getValue(data, 'status');
                        return hasUserAccess(USER_PRIVILEGES.MANAGER_DASHBOARD) &&
                            status !== ComplianceActivityStatus.DUE && status !== ComplianceActivityStatus.NON_COMPLIANT
                    },
                    then: { visible: true }
                }
            }
        ]
    }

    function TitleTmpl({ name, status }: any) {
        return (
            <div className="d-flex flex-row gap-2 mb-2">
                <Icon name={ComplianceStatusIconMapping[status]} className="text-xl" text={ComplianceStatusMapping[status]}
                    style={{ color: COMPLIANCE_ACTIVITY_INDICATION[status] || '', fill: COMPLIANCE_ACTIVITY_INDICATION[status] || '' }} />
                <span className={`text-xl fw-bold ellipse`}
                    style={{ color: COMPLIANCE_ACTIVITY_INDICATION[status] || '' }}>{name}</span>
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
                auditedDate: toBackendDateFormat(new Date())
            })
        }
    }

    function handleDeleteDocument(_document: any) {
        setDocument(_document);
        setAction(ACTIONS.DELETE);
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
            const { actStateMapping } = activity;
            const { ruleComplianceDetails } = actStateMapping;
            setActivity(activity);
            setRuleCompliance(ruleComplianceDetails);
            const _editable = isFormEditable(activity.status) && Boolean(ruleComplianceDetails);
            setEditable(_editable);
            setInitialValue({
                hideButtons: !(_editable && hasUserAccess(USER_PRIVILEGES.OWNER_ACTIVITIES_DOCUMENT_UPLOAD)),
                buttonWrapStyles: styles.btnGroup,
                submitBtnText: 'Upload'
            });
        }
    }, [isFetching])

    return (
        <>
            <div className={styles.overlay}>
                {
                    !isFetching && Boolean(activity) &&
                    <div className="card border-0 h-full w-full">
                        <div className="d-flex flex-row justify-space-between px-4 pt-4 align-items-center">
                            <TitleTmpl name={getValue(data, 'activity.name')} status={data.status} />
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
                            <div className="d-flex justify-content-end my-4">
                                {
                                    editableForm && hasEditableAccess() ?
                                        <>
                                            <Button variant="outline-secondary" className="btn btn-outline-secondary px-4" onClick={onCancel}>{'Cancel'}</Button>
                                            <Button variant="primary" onClick={performSubmit} disabled={!form.valid} className="px-4 ms-3" >{'Submit'}</Button>
                                        </> :

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
            {
                action === ACTIONS.DELETE && Boolean(document) &&
                <ConfirmModal title={'Delete Document'} onSubmit={() => deleteDocument(document.id)} onClose={() => setAction(ACTIONS.NONE)}>
                    <div className="text-center mb-4">Are you sure you want to delete document, <span className="fw-bold">{document.fileName}</span> ?</div>
                </ConfirmModal>
            }
        </>
    )
}