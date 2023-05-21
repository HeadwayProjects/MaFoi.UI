import { componentTypes, validatorTypes } from "@data-driven-forms/react-form-renderer";
import { PATTERNS } from "../../common/Constants";
import { preventDefault } from "../../../utils/common";

export const LOGIN_FIELDS = {
    USERNAME: {
        component: componentTypes.TEXT_FIELD,
        name: 'username',
        label: 'Username',
        fieldType: 'email',
        validate: [
            { type: validatorTypes.REQUIRED }
        ]
    },
    PASSWORD: {
        component: componentTypes.TEXT_FIELD,
        name: 'password',
        label: 'Password',
        fieldType: 'password',
        validate: [
            { type: validatorTypes.REQUIRED },
            { type: validatorTypes.MIN_LENGTH, threshold: 7 },
            { type: validatorTypes.MAX_LENGTH, threshold: 16 }
            
        ]
    },
    OTP: {
        component: componentTypes.TEXT_FIELD,
        name: 'otp',
        fieldType: 'number',
        styleClass: 'text-center p-2 fw-bold letter-spacing-2',
        validate: [
            { type: validatorTypes.REQUIRED },
            { type: validatorTypes.MAX_LENGTH, threshold: 6 }
        ]
    },
    NEW_PASSWORD: {
        component: componentTypes.TEXT_FIELD,
        name: 'newPassword',
        label: 'New Password',
        fieldType: 'password',
        validate: [
            { type: validatorTypes.REQUIRED },
            { type: validatorTypes.PATTERN, pattern: PATTERNS.PASSWORD, message: 'Invalid New Password' }
        ]
    },
    CONFIRM_PASSWORD: {
        component: componentTypes.TEXT_FIELD,
        name: 'confirmPassword',
        label: 'Re-Enter New Password',
        fieldType: 'password',
        validate: [
            { type: validatorTypes.REQUIRED },
            (value, { newPassword }) => {
                return value === newPassword ? undefined : 'New password and Re-enter password should be same';
            }
        ],
        onPaste: (e) => {
            preventDefault(e);
        }
    }
}