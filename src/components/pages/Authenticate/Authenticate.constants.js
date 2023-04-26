import { componentTypes, validatorTypes } from "@data-driven-forms/react-form-renderer";
import { PATTERNS } from "../../common/Constants";

export const LOGIN_FIELDS = {
    USERNAME: {
        component: componentTypes.TEXT_FIELD,
        name: 'username',
        label: 'Email Address',
        fieldType: 'email',
        validate: [
            { type: validatorTypes.REQUIRED },
            { type: validatorTypes.PATTERN, pattern: PATTERNS.EMAIL, message: 'Invalid email address' }
        ]
    },
    PASSWORD: {
        component: componentTypes.TEXT_FIELD,
        name: 'password',
        label: 'Password',
        fieldType: 'password',
        validate: [
            { type: validatorTypes.REQUIRED }
        ]
    },
    OTP: {
        component: componentTypes.TEXT_FIELD,
        name: 'otp',
        fieldType: 'number',
        styleClass: 'text-center p-2 fw-bold letter-spacing-2',
        validate: [
            { type: validatorTypes.REQUIRED }
        ]
    }
}