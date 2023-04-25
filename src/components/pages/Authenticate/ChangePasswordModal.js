import React, { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import FormRenderer, { ComponentMapper, FormTemplate } from "../../common/FormRenderer";
import { componentTypes, validatorTypes } from "@data-driven-forms/react-form-renderer";
import { PATTERNS } from "../../common/Constants";
import { preventDefault } from "../../../utils/common";
import { navigate } from "raviger";
import { Alert, Button } from "react-bootstrap";
import { getUserDetails, clearAuthToken } from "../../../backend/auth";
import { post } from "../../../backend/request";
import PageLoader from "../../shared/PageLoader";

function ChangePasswordModal({ onClose }) {
    const [pwdChanged, setPwdChanged] = useState(false);
    const [user] = useState(getUserDetails());
    const [apiError, setApiError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    function signIn(event) {
        preventDefault(event);
        clearAuthToken();
        navigate('/login', { replace: true });
        setTimeout(() => {
            window.location.reload();
        });
    }

    const schema = {
        fields: [
            // {
            //     component: componentTypes.TEXT_FIELD,
            //     name: 'oldPassword',
            //     label: 'Old Password',
            //     fieldType: 'password',
            //     validate: [
            //         { type: validatorTypes.REQUIRED }
            //     ]
            // },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'newPassword',
                label: 'New Password',
                fieldType: 'password',
                validate: [
                    { type: validatorTypes.REQUIRED },
                    { type: validatorTypes.PATTERN, pattern: PATTERNS.PASSWORD, message: 'Should contain at least 8 letters and 1 numeric' },
                    // (value, { oldPassword }) => {
                    //     return value && value === oldPassword ? 'New password cannot be same as old password' : undefined
                    // }
                ]
            },
            {
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
        ]
    };

    function changePassword({ newPassword }) {
        setApiError(null);
        setSubmitting(true);
        post(`/api/Auth/ChangePassword?username=${user.username}&password=${newPassword}`, {}).then(response => {
            const data = (response || {}).data || {};
            if (data.result === 'SUCCESS') {
                setPwdChanged(true);
            } else {
                setApiError(data.message);
            }
        }).catch(e => {
            setApiError('Something went wrong! Please try again.');
        }).finally(() => {
            setSubmitting(false);
        });
    }

    return (
        <>
            <Modal show={true} backdrop="static" animation={true} dialogClassName="alert-modal" size="sm" centered={true}>
                <Modal.Header closeButton={!pwdChanged} onHide={onClose}>
                    <Modal.Title className="bg">Change Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex flex-column align-items-center">
                        {
                            pwdChanged ?
                                <>
                                    <FontAwesomeIcon icon={faCircleCheck} style={{ fontSize: '106px' }} className="mb-4 text-success" />
                                    <div className="fs-5 text-success">Password Changed successfully</div>
                                    <p className="pt-5 mt-5 text-black-600">Please log in with the new password.</p>
                                    <div className="text-center pt-4">
                                        <Button variant="primary" type="submit" className={`btn btn-primary px-4`} onClick={signIn}>
                                            Back To LOGIN
                                        </Button>
                                    </div>
                                </> :
                                <>
                                    <div className="col-md-10 m-auto">
                                        <div className="pt-4 pb-4">
                                            <span className="fs-6 text-black-600"> Password Requirements </span>
                                            <div><small className="text-error text-sm">Password must contain at least 8 letters and 1 number.</small></div>
                                            {
                                                !!apiError && <Alert variant="danger">{apiError}</Alert>
                                            }
                                        </div>
                                        <div className="col-md-9 mx-auto">
                                            <FormRenderer FormTemplate={FormTemplate}
                                                initialValues={{ submitBtnText: 'Change Password', fullWidth: true }}
                                                componentMapper={ComponentMapper}
                                                schema={schema}
                                                onSubmit={changePassword}
                                            />
                                        </div>
                                    </div>
                                </>
                        }
                    </div>
                </Modal.Body>
            </Modal>
            {submitting && <PageLoader />}
        </>
    )
}

export default ChangePasswordModal;