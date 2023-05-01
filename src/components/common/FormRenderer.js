import React, { useEffect, useState } from "react";
import {
    FormRenderer as DDFFormRenderer, componentTypes,
    useFieldApi, useFormApi, validatorTypes
} from "@data-driven-forms/react-form-renderer";
import { Button } from "react-bootstrap";
import Select from 'react-select';
import Icon from "./Icon";

function TextField(props) {
    const { label, meta = {}, input, type = 'text', name } = useFieldApi(props);
    const required = (props.validate || []).find(x => x.type === validatorTypes.REQUIRED) ? true : false;
    const maxLength = ((props.validate || []).find(x => x.type === validatorTypes.MAX_LENGTH) || {}).threshold || 255;
    const isPasswordField = props.fieldType === 'password';
    const [showPassword, setShowPassword] = useState(false);

    function onInput(input) {
        return {
            ...input,
            type: isPasswordField ? (showPassword ? 'text' : 'password') : (props.fieldType || 'text'),
            required,
            placeholder: label ? (props.placeholder || `Enter ${label}`) : undefined,
            onChange: (e) => {
                input.onChange(e);
                if (props.onChange) {
                    props.onChange(e);
                }
            },
            onPaste: (e) => {
                if (props.onPaste) {
                    props.onPaste(e);
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

function TextAreaField(props) {
    const { label, meta = {}, input, name } = useFieldApi(props);
    const required = (props.validate || []).find(x => x.type === validatorTypes.REQUIRED) ? true : false;
    const maxLength = ((props.validate || []).find(x => x.type === validatorTypes.MAX_LENGTH) || {}).threshold || 255;

    function onInput(input) {
        return {
            ...input,
            required,
            placeholder: props.placeholder || `Enter ${label}`,
            onChange: (e) => {
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

function SelectField(props) {
    const { label, meta = {}, input, name } = useFieldApi(props);
    const required = (props.validate || []).find(x => x.type === validatorTypes.REQUIRED) ? true : false;
    const [options, setOptions] = useState(props.options);

    function onInput(input) {
        return {
            ...input,
            required,
            placeholder: props.placeholder || `Select ${label}`,
            onChange: (e) => {
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
            setOptions((props.options || []).map(x => {
                return { value: x.id, label: x.name }
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
                    styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
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

function HtmlField(props) {
    const { label } = useFieldApi(props);

    return (
        <div className={`form-group ${props.className || ''}`}>
            <label className="form-label text-sm">{label}</label>
            <div className="input-group">
                <div dangerouslySetInnerHTML={{ __html: props.content || '--NA--' }}></div>
            </div>
        </div>
    )
}

function CheckboxField(props) {
    const { label, input } = useFieldApi(props);

    function onInput(input) {
        return {
            ...input,
            type: 'checkbox',
            onChange: (e) => {
                input.onChange(e);
                if (props.onChange) {
                    props.onChange(e);
                }
            }
        }
    }
    return (
        <div className="form-check my-3">
            <input type="checkbox" id={props.name} className="form-check-input" {...onInput(input)} />
            <label title={label} htmlFor={props.name} className="form-check-label">{label}</label>
        </div>
    )

}

export const ComponentMapper = {
    [componentTypes.TEXT_FIELD]: TextField,
    [componentTypes.DATE_PICKER]: TextField,
    [componentTypes.TEXTAREA]: TextAreaField,
    [componentTypes.SELECT]: SelectField,
    [componentTypes.PLAIN_TEXT]: HtmlField,
    [componentTypes.CHECKBOX]: CheckboxField
};


export function FormTemplate({ formFields }) {
    const { handleSubmit, initialValues = { fullWidth: true }, getState } = useFormApi();
    const { valid, touched } = getState();

    return (
        <form onSubmit={handleSubmit} noValidate>
            {formFields}
            {
                !initialValues.hideButtons &&
                <div className="d-flex flex-row mt-4 justify-content-center">
                    <Button variant="primary" type="submit" className={`btn btn-primary px-4 ${initialValues.fullWidth ? 'w-100' : ''}`}
                        disabled={!valid || !touched}>
                        {initialValues.submitBtnText || 'Submit'}
                    </Button>
                </div>
            }
        </form>
    )
}

function FormRenderer(props) {
    return (
        <>
            <DDFFormRenderer {...props} />
        </>
    )
}

export default FormRenderer;