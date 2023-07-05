import React, { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import FormRenderer, { ComponentMapper, FormTemplate } from "../../common/FormRenderer";
import { validatorTypes } from "@data-driven-forms/react-form-renderer";
import { PATTERNS } from "../../common/Constants";
import { preventDefault } from "../../../utils/common";
import { navigate } from "raviger";
import { Alert, Button } from "react-bootstrap";
import { getUserDetails, clearAuthToken, getAuthToken, useChangePassword } from "../../../backend/auth";
import PageLoader from "../../shared/PageLoader";
import { API_RESULT, ERROR_MESSAGES } from "../../../utils/constants";
import { LOGIN_FIELDS } from "./Authenticate.constants";
import { getBasePath } from "../../../App";

function ChangePasswordModal({ onClose }: any) {
    const [pwdChanged, setPwdChanged] = useState(false);
    const [user] = useState(getUserDetails());
    const [apiError, setApiError] = useState<any>(null);
    const [submitting, setSubmitting] = useState(false);
    const { changePassword } = useChangePassword(({ result, message }: any) => {
        setSubmitting(false);
        if (result === API_RESULT.SUCCESS) {
            setPwdChanged(true);
        } else {
            setApiError(message);
        }
    }, () => {
        setSubmitting(false);
        setApiError(ERROR_MESSAGES.DEFAULT);
    });

    function signIn(event: any) {
        preventDefault(event);
        clearAuthToken();
        navigate(`${getBasePath()}/login`, { replace: true });
        setTimeout(() => {
            window.location.reload();
        });
    }

    const schema = {
        fields: [
            {
                ...LOGIN_FIELDS.PASSWORD,
                name: 'oldPassword',
                label: 'Old Password'
            },
            {
                ...LOGIN_FIELDS.NEW_PASSWORD,
                validate: [
                    { type: validatorTypes.REQUIRED },
                    { type: validatorTypes.PATTERN, pattern: PATTERNS.PASSWORD, message: 'Should contain at least 8 letters and 1 numeric' },
                    (value: any, { oldPassword }: any) => {
                        return value && value === oldPassword ? 'New password cannot be same as old password' : undefined
                    }
                ]
            },
            { ...LOGIN_FIELDS.CONFIRM_PASSWORD }
        ]
    };

    function onSubmit({ oldPassword, newPassword }: any) {
        setApiError(null);
        setSubmitting(true);
        changePassword({ username: user.username, oldPassword, newPassword, token: getAuthToken() });
    }

    return (
        <>
            <Modal show={true} backdrop="static" animation={true} dialogClassName="alert-modal" size="lg" centered={true}>
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
                                                onSubmit={onSubmit}
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