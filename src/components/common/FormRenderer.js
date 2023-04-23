import React, { useState } from "react";
import {
    FormRenderer as DDFFormRenderer, componentTypes,
    useFieldApi, useFormApi, validatorTypes
} from "@data-driven-forms/react-form-renderer";
import { Button } from "react-bootstrap";
import Icon from "./Icon";

function TextField(props) {
    const { label, meta = {}, input, type = 'text', name } = useFieldApi(props);
    const required = (props.validate || []).find(x => x.type === validatorTypes.REQUIRED) ? true : false;
    const isPasswordField = props.fieldType === 'password';
    const [showPassword, setShowPassword] = useState(false);

    function onInput(input) {
        return {
            ...input,
            type: isPasswordField ? (showPassword ? 'text' : 'password') : (type || 'text'),
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
            <div className={`input-group ${isPasswordField ? 'has-group-text-right' : ''}`}>
                <input id={name} className={`form-control ${meta.touched ? (meta.error ? 'is-invalid' : 'is-valid') : ''}`} {...onInput(input)} />
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
                    {
                        meta.error === 'Required' ?
                            <>{label} required</> :
                            <>Invalid {label}</>
                    }
                </div>
            }
        </div>
    )
}

export const ComponentMapper = {
    [componentTypes.TEXT_FIELD]: TextField,
    [componentTypes.DATE_PICKER]: TextField,
    [componentTypes.TEXTAREA]: TextField,
    [componentTypes.SELECT]: TextField
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