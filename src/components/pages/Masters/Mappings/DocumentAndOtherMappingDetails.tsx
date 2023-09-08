import React, { useEffect, useRef, useState } from "react";
import { ACTIONS, ALLOWED_FILES_REGEX, FILE_SIZE } from "../../../common/Constants";
import FormRenderer, { ComponentMapper, FormTemplate, componentTypes } from "../../../common/FormRenderer";
import { validatorTypes } from "@data-driven-forms/react-form-renderer";
import { getValue } from "../../../../utils/common";

const BtnConfig = {
    buttonWrapStyles: 'justify-content-end flex-row-reverse',
    showCancel: true,
    cancelBtnText: 'Previous'
}

export default function DocumentAndOtherMappingDetails({ action, data, onSubmit, onCancel }: any) {
    const [formData, setFormData] = useState({});
    const [upload, setUpload] = useState(false);
    const uploadRef: any = useRef();
    uploadRef.current = false;
    const schema = {
        fields: [
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXT_FIELD,
                name: 'formName',
                label: 'Form Name',
                content: action === ACTIONS.VIEW ? (getValue(formData, 'formName') || '-NA-') : '',
            },
            {
                component: componentTypes.FILE_UPLOAD,
                label: 'File upload',
                name: 'file',
                type: 'file',
                validate: [
                    { type: validatorTypes.REQUIRED },
                    { type: 'file-type', regex: ALLOWED_FILES_REGEX },
                    { type: 'file-size', maxSize: 5 * FILE_SIZE.MB }
                ],
                condition: {
                    when: 'formName',
                    is: (value: any) => action === ACTIONS.ADD && value && /(?!^$)([^\s])/.test(value),
                    then: { visible: true }
                }
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
                upload: uploadRef.current,
                documents: [],
                validate: upload ? [
                    { type: validatorTypes.REQUIRED },
                    { type: 'file-type', regex: ALLOWED_FILES_REGEX },
                    { type: 'file-size', maxSize: 5 * FILE_SIZE.MB }
                ] : [],
                condition: {
                    when: 'formName',
                    is: () => action !== ACTIONS.ADD,
                    then: { visible: true }
                }
            },
            {
                component: componentTypes.CHECKBOX,
                name: 'sendNotification',
                label: 'Send Notification',
                condition: {
                    when: 'sendNotification',
                    is: () => action !== ACTIONS.VIEW,
                    then: { visible: true },
                    else: { set: { sendNotification: undefined } }
                }
            }
        ]
    };

    function debugForm({ values }: any) {
        const { formName } = values;
        setUpload(action === ACTIONS.EDIT && formName && /(?!^$)([^\s])/.test(formName))

    }

    useEffect(() => {
        if (data) {
            setFormData({ ...formData, ...data })
        }
    }, [data]);

    return (
        <>
            <FormRenderer FormTemplate={FormTemplate}
                initialValues={{ ...BtnConfig, ...formData, hideButtons: action === ACTIONS.VIEW }}
                componentMapper={ComponentMapper}
                debug={debugForm}
                schema={schema}
                onSubmit={onSubmit}
                onCancel={onCancel}
            />
        </>
    )
}