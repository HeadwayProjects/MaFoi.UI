import React, { useEffect, useState } from "react";
import { ACTIONS, ALLOWED_FILES_REGEX, FILE_SIZE } from "../../../common/Constants";
import FormRenderer, { ComponentMapper, FormTemplate, componentTypes } from "../../../common/FormRenderer";
import { download, getValue } from "../../../../utils/common";
import { toast } from "react-toastify";

const BtnConfig = {
    buttonWrapStyles: 'justify-content-end flex-row-reverse',
    showCancel: true,
    cancelBtnText: 'Previous'
}

export default function DocumentAndOtherMappingDetails({ action, data, onSubmit, onCancel }: any) {
    const [formData, setFormData] = useState<any>();
    const [documents, setDocuments] = useState<{ fileName: string, filePath: string, id: string }[]>([])
    const schema = {
        fields: [
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXT_FIELD,
                name: 'formName',
                label: 'Form Name',
                content: action === ACTIONS.VIEW ? (getValue(data, 'formName') || '-NA-') : '',
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
                        },
                        {
                            when: 'formName',
                            pattern: /(?!^$)([^\s])/
                        }
                    ]
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
        const { formName, file } = values;
        setFormData({ ...(formData || {}), ...values, file: formName ? file : null })
    }

    function handleSubmit({ formName, file, sendNotification }: any) {
        if ((formName || '').trim() && !documents.length && !file) {
            toast.error('Please upload relevant file.');
            return;
        }
        onSubmit({ formName, file, sendNotification });
    }

    useEffect(() => {
        if (data) {
            const { fileName, filePath } = data;
            setFormData({ ...(formData || {}), ...data });
            if (fileName && filePath) {
                setDocuments([{
                    fileName,
                    filePath,
                    id: `${new Date().getTime()}`
                }]);
            }
        }
    }, [data]);

    return (
        <>
            {
                Boolean(formData) &&
                <FormRenderer FormTemplate={FormTemplate}
                    initialValues={{ ...BtnConfig, ...formData, hideButtons: action === ACTIONS.VIEW }}
                    componentMapper={ComponentMapper}
                    debug={debugForm}
                    schema={schema}
                    onSubmit={handleSubmit}
                    onCancel={onCancel}
                />
            }
        </>
    )
}