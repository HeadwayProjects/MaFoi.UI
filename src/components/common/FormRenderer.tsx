import React, { useEffect, useState } from "react";
import {
    FormRenderer as DDFFormRenderer, componentTypes as iComponentTypes,
    useFieldApi, useFormApi, validatorTypes
} from "@data-driven-forms/react-form-renderer";
import { Button } from "react-bootstrap";
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import Icon from "./Icon";
import { humanReadableFileSize } from "../../utils/common";
import DatePicker from "react-multi-date-picker";
import ReactQuill from "react-quill";

export const componentTypes = {
    TEXT_FIELD: iComponentTypes.TEXT_FIELD,
    DATE_PICKER: iComponentTypes.DATE_PICKER,
    TEXTAREA: iComponentTypes.TEXTAREA,
    SELECT: iComponentTypes.SELECT,
    PLAIN_TEXT: iComponentTypes.PLAIN_TEXT,
    CHECKBOX: iComponentTypes.CHECKBOX,
    WIZARD: iComponentTypes.WIZARD,
    TAB_ITEM: iComponentTypes.TAB_ITEM,
    FILE_UPLOAD: 'file-upload',
    DOCUMENTS_UPLOAD: 'documents-upload',
    ASYNC_SELECT: 'async-select',
    MONTH_PICKER: 'month-picker',
    INPUT_AS_TEXT: 'input-as-text',
    TEXT_EDITOR: 'text-editor',
    HTML: 'html'
}

const editorConfig = {
    modules: {
        toolbar: [
            [{ 'header': '1' }, { 'header': '2' }],
            [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link']
        ],
        clipboard: {
            // toggle to add extra line breaks when pasting HTML:
            matchVisual: false,
        }
    },
    formats: [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image', 'video'
    ]
};

function fileSizeValidator({ maxSize }: any) {
    return (value: any) => {
        if (value && value.inputFiles[0] && value.inputFiles[0].size > maxSize) {
            return `Maximum allowed size is ${humanReadableFileSize(maxSize)}.`;
        }
    }
}
function fileTypeValidator({ regex }: any) {
    return (value: any) => {
        if (value && value.inputFiles) {
            const file = value.inputFiles[0];
            if (file && !regex.exec(file.name)) {
                return `Invalid file extension.`
            }
        }
    }
}

function TextField(props: any) {
    const { label, meta = {}, input, name } = useFieldApi(props);
    const required = (props.validate || []).find((x: any) => x.type === validatorTypes.REQUIRED) ? true : false;
    const maxLength = ((props.validate || []).find((x: any) => x.type === validatorTypes.MAX_LENGTH) || {}).threshold || 255;
    const isPasswordField = props.fieldType === 'password';
    const [showPassword, setShowPassword] = useState(false);

    function onInput(input: any) {
        return {
            ...input,
            type: isPasswordField ? (showPassword ? 'text' : 'password') : (props.fieldType || 'text'),
            required,
            placeholder: label ? (props.placeholder || `Enter ${label}`) : undefined,
            onChange: (e: any) => {
                input.onChange(e);
                if (props.onChange) {
                    props.onChange(e);
                }
            },
            onPaste: (e: any) => {
                if (props.onPaste) {
                    props.onPaste(e);
                }
            },
            onKeyDown: (e: any) => {
                if (props.fieldType === 'number') {
                    const key = e.charCode || e.keyCode || 0;
                    const value = e.target.value;
                    const keys = [8, 9, 13, 35, 36, 37, 39, 46, 110, 190];
                    if (keys.includes(key) || (key >= 48 && key <= 57) || (key >= 96 && key <= 105)) {
                        if (((key >= 48 && key <= 57) || (key >= 96 && key <= 105)) && `${value}`.length >= maxLength) {
                            e.preventDefault();
                        }
                    } else {
                        e.preventDefault();
                    }
                }
            }
        }
    }

    return (
        <div className={`form-group ${props.className || ''}`}>
            {
                label &&
                <label className="form-label text-sm" htmlFor={name}>{label} {required && <span className="text-error">*</span>}</label>
            }
            <div className={`input-group ${isPasswordField ? 'has-group-text-right' : ''}`}>
                <input id={name}
                    className={`form-control ${meta.touched ? (meta.error ? 'is-invalid' : 'is-valid') : ''} ${props.styleClass || ''}`}
                    {...onInput(input)} maxLength={maxLength || 255} />
                {
                    isPasswordField &&
                    <span className="text-black-600 input-group-text">
                        <Icon name={showPassword ? 'eye-slash' : 'eye'} text={showPassword ? 'Hide' : 'Show'}
                            action={() => setShowPassword(!showPassword)} />
                    </span>
                }
            </div>
            {
                props.description &&
                <span className="text-muted form-text">{props.description}</span>
            }
            {
                meta.touched && meta.error && <div className="invalid-feedback d-block">
                    {meta.error}
                </div>
            }
        </div>
    )
}

function TextAreaField(props: any) {
    const { label, meta = {}, input, name } = useFieldApi(props);
    const required = (props.validate || []).find((x: any) => x.type === validatorTypes.REQUIRED) ? true : false;
    const maxLength = ((props.validate || []).find((x: any) => x.type === validatorTypes.MAX_LENGTH) || {}).threshold || 255;

    function onInput(input: any) {
        return {
            ...input,
            required,
            placeholder: props.placeholder || `Enter ${label}`,
            onChange: (e: any) => {
                input.onChange(e);
                if (props.onChange) {
                    props.onChange(e);
                }
            }
        }
    }

    return (
        <div className={`form-group ${props.className || ''}`}>
            <label className="form-label text-sm" htmlFor={name}>{label} {required && <span className="text-error">*</span>}</label>
            <div className="input-group">
                <textarea id={name} className={`form-control ${meta.touched ? (meta.error ? 'is-invalid' : 'is-valid') : ''}`}
                    maxLength={maxLength} {...onInput(input)} rows={3} />
            </div>
            {
                props.description &&
                <span className="text-muted form-text">{props.description}</span>
            }
            {
                meta.touched && meta.error && <div className="invalid-feedback d-block">
                    {meta.error}
                </div>
            }
        </div>
    )
}

function InputasTextAreaField(props: any) {
    const { label, meta = {}, input, name } = useFieldApi(props);
    const required = (props.validate || []).find((x: any) => x.type === validatorTypes.REQUIRED) ? true : false;
    const maxLength = ((props.validate || []).find((x: any) => x.type === validatorTypes.MAX_LENGTH) || {}).threshold || 255;

    function onInput(input: any) {
        return {
            ...input,
            required,
            placeholder: props.placeholder || `Enter ${label}`,
            onChange: (e: any) => {
                const oldVal = e.target.value;
                const value = (oldVal || '').replace(/[\r\n\t]/g, ' ');
                const newEvent = { ...e, target: { ...e.target, value } };
                input.onChange(newEvent);
                if (props.onChange) {
                    props.onChange(newEvent);
                }
            }
        }
    }

    return (
        <div className={`form-group ${props.className || ''}`}>
            <label className="form-label text-sm" htmlFor={name}>{label} {required && <span className="text-error">*</span>}</label>
            <div className="input-group">
                <textarea id={name} className={`form-control input-as-textarea ${meta.touched ? (meta.error ? 'is-invalid' : 'is-valid') : ''}`}
                    maxLength={maxLength} {...onInput(input)} rows={4} />
            </div>
            {
                props.description &&
                <span className="text-muted form-text">{props.description}</span>
            }
            {
                meta.touched && meta.error && <div className="invalid-feedback d-block">
                    {meta.error}
                </div>
            }
        </div>
    )
}

function SelectField(props: any) {
    const { label, meta = {}, input, name } = useFieldApi(props);
    const required = (props.validate || []).find((x: any) => x.type === validatorTypes.REQUIRED) ? true : false;
    const [options, setOptions] = useState(props.options);

    function onInput(input: any) {
        return {
            ...input,
            required,
            placeholder: props.placeholder || `Select ${label}`,
            onChange: (e: any) => {
                input.onChange(e);
                if (props.onChange) {
                    props.onChange(e);
                }
            },
            isLoading: props.isLoading,
            isDisabled: props.isDisabled
        };
    }

    useEffect(() => {
        if (props.options) {
            setOptions((props.options || []).map((x: any) => {
                if (typeof x === 'string') {
                    return { value: x, label: x };
                }
                return { value: x.value || x.id, label: x.label || x.name, [props.name]: x }
            }));
        }
    }, [props.options])

    return (
        <div className={`form-group ${props.className || ''}`}>
            <label className="form-label text-sm" htmlFor={name}>{label} {required && <span className="text-error">*</span>}</label>
            <div className="input-group">
                <Select
                    name={name}
                    className={`select-control ${meta.touched && meta.error ? 'error-field' : ''}`}
                    options={options}
                    id={name}
                    label="label"
                    menuPosition="fixed"
                    isMulti={props.isMulti || false}
                    styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                    formatOptionLabel={props.formatOptionLabel}
                    {...onInput(input)}
                />
            </div>
            {
                props.description &&
                <span className="text-muted form-text">{props.description}</span>
            }
            {
                meta.touched && meta.error && <div className="invalid-feedback d-block">
                    {meta.error}
                </div>
            }
        </div>
    )
}

function AsyncSelectField(props: any) {
    const { label, meta = {}, input, name } = useFieldApi(props);
    const required = (props.validate || []).find((x: any) => x.type === validatorTypes.REQUIRED) ? true : false;

    function onInput(input: any) {
        return {
            ...input,
            required,
            placeholder: props.placeholder || `Search for ${label}`,
            onChange: (e: any) => {
                input.onChange(e);
                if (props.onChange) {
                    props.onChange(e);
                }
            },
            isLoading: props.isLoading,
            isDisabled: props.isDisabled
        };
    }


    return (
        <div className={`form-group ${props.className || ''}`}>
            <label className="form-label text-sm" htmlFor={name}>{label} {required && <span className="text-error">*</span>}</label>
            <div className="input-group">
                <AsyncSelect
                    name={name}
                    className={`select-control ${meta.touched && meta.error ? 'error-field' : ''}`}
                    id={name}
                    label="label"
                    menuPosition="fixed"
                    isMulti={props.isMulti || false}
                    styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                    formatOptionLabel={props.formatOptionLabel}
                    loadOptions={props.loadOptions}
                    defaultOptions={props.defaultOptions}
                    {...onInput(input)}
                />
            </div>
            <span className="text-muted form-text">{props.description || `Hint: Start typing ${label} to see results.`}</span>
            {
                meta.touched && meta.error && <div className="invalid-feedback d-block">
                    {meta.error}
                </div>
            }
        </div>
    )
}

function HtmlField(props: any) {
    const { label } = useFieldApi(props);

    return (
        <div className={`form-group ${props.className || ''}`}>
            {
                label &&
                <label className="form-label text-sm">{label}</label>
            }
            <div className="input-group">
                <div>{props.content}</div>
            </div>
        </div>
    )
}
function HtmlContentField(props: any) {
    const { label } = useFieldApi(props);

    return (
        <div className={`form-group ${props.className || ''}`}>
            <label className="form-label text-sm">{label}</label>
            <div className="input-group" dangerouslySetInnerHTML={{ __html: props.content || '--NA--' }}></div>
        </div>
    )
}

function CheckboxField(props: any) {
    const { label, input } = useFieldApi(props);

    function onInput(input: any) {
        return {
            ...input,
            type: 'checkbox',
            onChange: (e: any) => {
                input.onChange(e);
                if (props.onChange) {
                    props.onChange(e);
                }
            },
            disabled: props.disabled
        }
    }
    return (
        <div className="form-check my-3">
            <input type="checkbox" id={props.name} className="form-check-input" {...onInput(input)} />
            <label title={label} htmlFor={props.name} className="form-check-label">{label}</label>
        </div>
    )

}

function TabItemField(props: any) {
    return (
        <div className={`form-group ${props.className || ''}`}
            dangerouslySetInnerHTML={{ __html: props.content || '--NA--' }}>
        </div>
    )
}

function FileUploadField(props: any) {
    const { input, meta, label, name } = useFieldApi(props);
    const required = (props.validate || []).find((x: any) => x.type === validatorTypes.REQUIRED) ? true : false;
    return (
        <div className={`form-group ${props.className || ''}`}>
            {
                label &&
                <label className="form-label text-sm" htmlFor={name}>{label} {required && <span className="text-error">*</span>}</label>
            }
            <div className={`input-group`}>
                <input id={name}
                    className={`form-control ${meta.touched ? (meta.error ? 'is-invalid' : 'is-valid') : ''} ${props.styleClass || ''}`}
                    {...input} />
            </div>
            {
                props.description &&
                <span className="text-muted form-text">{props.description}</span>
            }
            {
                meta.touched && meta.error && <div className="invalid-feedback d-block">
                    {meta.error}
                </div>
            }
        </div>
    );
};

function DocumentsWithUploadField(props: any) {
    const { input, meta, label, name } = useFieldApi(props);
    const [documents, setDocuments] = useState(props.documents);
    const required = (props.validate || []).find((x: any) => x.type === validatorTypes.REQUIRED) ? true : false;

    useEffect(() => {
        if (props.documents) {
            setDocuments(props.documents)
        }
    }, [props.documents]);
    return (
        <div className={`form-group ${props.className || ''}`}>
            {
                documents !== undefined &&
                <>
                    {
                        (documents || []).length === 0 && <div className="fst-italic text-sm mb-2">No documents available</div>
                    }
                    {
                        (documents || []).length > 0 &&
                        <div className="d-flex flex-column">
                            {
                                (documents || []).map((document: any) => {
                                    return (
                                        <div className="d-flex flex-row w-100 align-items-center mb-2" key={document.id}>
                                            <Icon action={props.downloadDocument} data={document} name="download" className="text-appprimary text-md me-3" />
                                            <span>{document.fileName}</span>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    }
                </>
            }
            {
                props.upload &&
                <>
                    {
                        label &&
                        <label className="text-sm" htmlFor={name}>{label} {required && <span className="text-error">*</span>}</label>
                    }
                    <div className={`input-group`}>
                        <input id={name}
                            className={`form-control ${meta.touched ? (meta.error ? 'is-invalid' : 'is-valid') : ''} ${props.styleClass || ''}`}
                            {...input} />
                    </div>
                    {
                        props.description &&
                        <span className="text-muted form-text">{props.description}</span>
                    }
                    {
                        meta.touched && meta.error && <div className="invalid-feedback d-block">
                            {meta.error}
                        </div>
                    }
                </>
            }
        </div>
    );
};

export function DatePickerField(props: any) {
    const { input, meta, label, name } = useFieldApi(props);
    const [value, setValue] = useState(props.initialValue);
    const required = (props.validate || []).find((x: any) => x.type === validatorTypes.REQUIRED) ? true : false;

    function onInput(input: any) {
        return {
            ...input,
            placeholder: props.placeholder || `Select ${label}`,
            onChange: (e: any) => {
                setValue(e);
                input.onChange(e);
                if (props.onChange) {
                    props.onChange(e);
                }
            },
            disabled: props.disabled
        }
    }

    function clearValue() {
        setValue(null);
        if (props.onChange) {
            props.onChange(null);
        }
    }

    useEffect(() => {
        if (props.initialValue) {
            setValue(props.initialValue);
        }

    }, [props.initialValue]);

    return (
        <div className={`form-group ${props.className || ''}`}>
            {
                label &&
                <label className="form-label text-sm" htmlFor={name}>{label} {required && <span className="text-error">*</span>}</label>
            }
            <div className={`input-group date-picker`}>
                <DatePicker range={props.range || false}
                    minDate={props.minDate} format={'DD/MM/YYYY'} maxDate={props.maxDate} {...onInput(input)} value={value}>
                    {
                        value && props.clearable &&
                        <Button variant="link" className="mb-2" onClick={clearValue}>Clear</Button>
                    }
                </DatePicker>
            </div>
            {
                props.description &&
                <span className="text-muted form-text">{props.description}</span>
            }
            {
                meta.touched && meta.error && <div className="invalid-feedback d-block">
                    {meta.error}
                </div>
            }
        </div>
    );
}
export function MonthPickerField(props: any) {
    const { input, meta, label, name } = useFieldApi(props);
    const [value, setValue] = useState(props.initialValue);
    const required = (props.validate || []).find((x: any) => x.type === validatorTypes.REQUIRED) ? true : false;

    function onInput(input: any) {
        return {
            ...input,
            placeholder: props.placeholder || `Select ${label}`,
            onChange: (e: any) => {
                setValue(e);
                input.onChange(e);
                if (props.onChange) {
                    props.onChange(e);
                }
            },
            disabled: props.disabled
        }
    }

    function clearValue() {
        setValue(null);
        if (props.onChange) {
            props.onChange(null);
        }
    }

    useEffect(() => {
        if (props.initialValue) {
            setValue(props.initialValue);
        }

    }, [props.initialValue])

    return (
        <div className={`form-group ${props.className || ''}`}>
            {
                label &&
                <label className="form-label text-sm" htmlFor={name}>{label} {required && <span className="text-error">*</span>}</label>
            }
            <div className={`input-group month-picker`}>
                <DatePicker onlyMonthPicker={true} editable={false} range={props.range || false}
                    minDate={props.minDate} format={'MMM, YYYY'} maxDate={props.maxDate} {...onInput(input)} value={value} >
                    {
                        value && props.clearable &&
                        <Button variant="link" className="mb-2" onClick={clearValue}>Clear</Button>
                    }
                </DatePicker>
            </div>
            {
                props.description &&
                <span className="text-muted form-text">{props.description}</span>
            }
            {
                meta.touched && meta.error && <div className="invalid-feedback d-block">
                    {meta.error}
                </div>
            }
        </div>
    );
}

function TextEditorField(props: any) {
    const { input, meta, label, name } = useFieldApi(props);
    const [value, setValue] = useState(props.initialValue);
    const required = (props.validate || []).find((x: any) => x.type === validatorTypes.REQUIRED) ? true : false;
    function onInput(input: any) {
        return {
            ...input,
            placeholder: props.placeholder || `Enter ${label}`,
            onChange: (e: any) => {
                setValue(e);
                input.onChange(e);
                if (props.onChange) {
                    props.onChange(e);
                }
            },
            disabled: props.disabled
        }
    }

    return (
        <div className={`form-group ${props.className || ''}`}>
            {
                label &&
                <label className="form-label text-sm" htmlFor={name}>{label} {required && <span className="text-error">*</span>}</label>
            }
            <div className={`input-group`}>
                <ReactQuill theme="snow" className={`form-control ${meta.touched ? (meta.error ? 'is-invalid' : 'is-valid') : ''}`}
                    modules={editorConfig.modules} formats={editorConfig.formats} {...onInput(input)} value={value} />
            </div>
            {
                props.description &&
                <span className="text-muted form-text">{props.description}</span>
            }
            {
                meta.touched && meta.error && <div className="invalid-feedback d-block">
                    {meta.error}
                </div>
            }
        </div>
    );
}

export const ComponentMapper = {
    [componentTypes.TEXT_FIELD]: TextField,
    [componentTypes.DATE_PICKER]: DatePickerField,
    [componentTypes.TEXTAREA]: TextAreaField,
    [componentTypes.SELECT]: SelectField,
    [componentTypes.PLAIN_TEXT]: HtmlField,
    [componentTypes.HTML]: HtmlContentField,
    [componentTypes.CHECKBOX]: CheckboxField,
    [componentTypes.WIZARD]: () => {
        return (<div></div>)
    },
    [componentTypes.TAB_ITEM]: TabItemField,
    [componentTypes.FILE_UPLOAD]: FileUploadField,
    [componentTypes.DOCUMENTS_UPLOAD]: DocumentsWithUploadField,
    [componentTypes.ASYNC_SELECT]: AsyncSelectField,
    [componentTypes.MONTH_PICKER]: MonthPickerField,
    [componentTypes.INPUT_AS_TEXT]: InputasTextAreaField,
    [componentTypes.TEXT_EDITOR]: TextEditorField
};


export function FormTemplate({ formFields }: any) {
    const { handleSubmit, onCancel, initialValues = { fullWidth: true }, getState } = useFormApi();
    const { valid, touched } = getState();

    return (
        <form onSubmit={handleSubmit} noValidate>
            {formFields}
            {
                !initialValues.hideButtons &&
                <div className={`d-flex flex-row mt-4 gap-3 ${initialValues.buttonWrapStyles || 'justify-content-center'}`}>
                    <Button variant="primary" type="submit" className={`btn btn-primary px-4 ${initialValues.fullWidth ? 'w-100' : ''}`}
                        disabled={!valid || !touched}>
                        {initialValues.submitBtnText || 'Submit'}
                    </Button>
                    {
                        initialValues.showCancel &&
                        <Button variant="outline-secondary" className="btn btn-outline-secondary px-4" onClick={onCancel}>
                            {initialValues.cancelBtnText || 'Cancel'}
                        </Button>
                    }
                </div>
            }
        </form>
    )
}

function FormRenderer(props: any) {
    const validatorMapper = { 'file-size': fileSizeValidator, 'file-type': fileTypeValidator };
    return (
        <>
            <DDFFormRenderer validatorMapper={validatorMapper} {...props} />
        </>
    )
}

export default FormRenderer;