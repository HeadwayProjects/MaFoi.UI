import React, { useEffect, useState } from "react";
import FormRenderer, { ComponentMapper, FormTemplate, componentTypes } from "../../common/FormRenderer";
import { validatorTypes } from "@data-driven-forms/react-form-renderer";
import { ACTIONS, ALLOWED_FILES_REGEX, FILE_SIZE } from "../../common/Constants";
import { download, getValue } from "../../../utils/common";
import dayjs from "dayjs";
import { useGetComplianceActivityDocuments } from "../../../backend/compliance";

export default function NoticeDetails({ action, data, onSubmit, onCancel }: any) {
    const [t] = useState(new Date().getTime())
    const [details, setDetails] = useState<any>({});
    const { documents } = useGetComplianceActivityDocuments({ complianceId: data.id, t});

    const schema = {
        fields: [
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXTAREA,
                name: 'noticeDescription',
                label: 'Notice Description',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: action === ACTIONS.VIEW ? getValue(details, 'noticeDescription') : '-NA-'
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXT_FIELD,
                name: 'issuedAuthority',
                label: 'Issued Authority',
                content: action === ACTIONS.VIEW ? getValue(details, 'issuedAuthority') : '-NA-'
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXT_FIELD,
                name: 'issuedDepartment',
                label: 'Issued Department',
                content: action === ACTIONS.VIEW ? getValue(details, 'issuedDepartment') : '-NA-'
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.DATE_PICKER,
                name: 'noticeDate',
                label: 'Notice Date',
                initialValue: details.noticeDate,
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: action === ACTIONS.VIEW ? dayjs(getValue(details, 'noticeDate')).format('DD-MM-YYYY') : ''
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.DATE_PICKER,
                name: 'noticeDueDate',
                label: 'Notice Due Date',
                initialValue: details.noticeDueDate,
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: action === ACTIONS.VIEW ? dayjs(getValue(details, 'noticeDueDate')).format('DD-MM-YYYY') : '',
                minDate: details.noticeDate ? dayjs(details.noticeDate).toDate() : null
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.DATE_PICKER,
                name: 'dueDate',
                label: 'Due Date',
                initialValue: details.dueDate,
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: action === ACTIONS.VIEW ? dayjs(getValue(details, 'dueDate')).format('DD-MM-YYYY') : '',
                minDate: new Date()
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.DATE_PICKER,
                name: 'approverDueDate',
                label: 'Approver Due Date',
                initialValue: details.approverDueDate,
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: action === ACTIONS.VIEW ? dayjs(getValue(details, 'approverDueDate')).format('DD-MM-YYYY') : '',
                minDate: details.dueDate ? dayjs(details.dueDate).toDate() : null
            },
            {
                component: componentTypes.TAB_ITEM,
                name: 'documentSubHeader',
                content: 'Documents',
                className: 'form-label text-sm pb-0',
                condition: {
                    when: 'documentSubHeader',
                    is: () => action !== ACTIONS.ADD,
                    then: { visible: true }
                }
            },
            {
                component: componentTypes.DOCUMENTS_UPLOAD,
                label: 'Upload File',
                name: 'uploadFile',
                type: 'file',
                upload: false,
                documents,
                condition: {
                    when: 'formName',
                    is: () => action !== ACTIONS.ADD,
                    then: { visible: true }
                },
                downloadDocument: ({ fileName, filePath }: any) => {
                    download(fileName, filePath);
                }
            },
            {
                component: componentTypes.FILE_UPLOAD,
                label: 'File upload',
                name: 'file',
                type: 'file',
                validate: [
                    { type: 'file-type', regex: ALLOWED_FILES_REGEX },
                    { type: 'file-size', maxSize: 25 * FILE_SIZE.MB }
                ],
                condition: {
                    and: [
                        {
                            when: 'file',
                            is: () => action !== ACTIONS.VIEW,
                        }
                    ]
                }
            },
        ]
    };

    function updateDetails(obj: any = {}) {
        setDetails({ ...data, ...details, ...obj });
    }

    useEffect(() => {
        if (data) {
            updateDetails({ ...data, file: null });
        }
    }, [data])

    return (
        <>
            <FormRenderer FormTemplate={FormTemplate}
                initialValues={{
                    ...details,
                    buttonWrapStyles: 'justify-content-end flex-row-reverse',
                    submitBtnText: 'Submit',
                    showCancel: true,
                    cancelBtnText: 'Previous',
                    hideButtons: action === ACTIONS.VIEW
                }}
                // debug={debugForm}
                componentMapper={ComponentMapper}
                schema={schema}
                onSubmit={onSubmit}
                onCancel={onCancel}
            />
        </>
    )
}