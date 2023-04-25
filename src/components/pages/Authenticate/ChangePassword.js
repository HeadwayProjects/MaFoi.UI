import React, { useState } from "react";
import changePasswordImg from '../../../assets/img/change-password.jpg';
import FormRenderer, { ComponentMapper, FormTemplate } from "../../common/FormRenderer";
import { componentTypes, validatorTypes } from "@data-driven-forms/react-form-renderer";
import { preventDefault } from "../../../utils/common";
import { PATTERNS } from "../../common/Constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { Button } from "react-bootstrap";
import { getUserDetails, useValidateToken } from "../../../backend/auth";
import PageLoader from "../../shared/PageLoader";
import { post } from "../../../backend/request";

function ChangePassword({ token }) {
    const [changePwdSuccess, setChangePwdSuccess] = useState(false);
    const [user] = useState(getUserDetails(token));
    const { status, isFetching } = useValidateToken(token);
    const [apiError, setApiError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    function signIn(event) {
        preventDefault(event);
        window.location.replace('/login');
    }

    const schema = {
        fields: [
            {
                component: componentTypes.TEXT_FIELD,
                name: 'newPassword',
                label: 'New Password',
                fieldType: 'password',
                validate: [
                    { type: validatorTypes.REQUIRED },
                    { type: validatorTypes.PATTERN, pattern: PATTERNS.PASSWORD }
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
                ]
            }
        ],
    };

    function onSubmit({ newPassword }) {
        setApiError(null);
        setSubmitting(true);
        post(`/api/Auth/ChangePassword?username=${user.username}&password=${newPassword}`, {}).then(response => {
            const data = (response || {}).data || {};
            if (data.result === 'SUCCESS') {
                setChangePwdSuccess(true);
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
            {
                isFetching ? <p>Loading...</p> :
                    <>
                        {
                            !status ? <div class="alert alert-danger m-3" role="alert">The url is either invalid / expired. Please contact admin for more details.</div> :
                                <>
                                    {
                                        !changePwdSuccess ?
                                            <div className="row m-0 overflow-hidden">
                                                <div className="col-md-7 text-center pt-5">
                                                    <img className="py-5" src={changePasswordImg} alt="First slide" width="75%" />
                                                </div>
                                                <div className="col-md-5 pt-5 my-5">
                                                    <div className="card shadow px-3 pt-4 pb-5 mb-5 bg-body rounded">
                                                        <div className="p-0 text-center pt-2 border-bottom">
                                                            <h5 className="text-appprimary fw-bold text-xl">New Password</h5>
                                                        </div>
                                                        <div className="col-md-10 m-auto">
                                                            <div className="pt-4 pb-4">
                                                                <span className="fs-6 text-black-600"> Password Requirements </span>
                                                                <div><small className="text-error text-sm">Password must contain at least 8 letters and 1 number.</small></div>
                                                            </div>
                                                            <div className="col-md-10 mx-auto">
                                                                <FormRenderer FormTemplate={FormTemplate}
                                                                    initialValues={{ submitBtnText: 'Change Password', fullWidth: true }}
                                                                    componentMapper={ComponentMapper}
                                                                    schema={schema}
                                                                    onSubmit={onSubmit}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex flex-column align-items-center">
                                                        <span className="text-black-600">-or-</span>
                                                        <div className="mt-4">Back to <a href="/" className="underline text-dark-gray" onClick={signIn}>Signin</a></div>
                                                    </div>
                                                </div>
                                            </div> :
                                            <div className="row m-0 overflow-hidden justify-content-center align-items-center">
                                                <div className="card border-0 rounded-0 h-100">
                                                    <div className="row m-0">
                                                        <div className="col-md-5 pt-5 my-5 mx-auto">
                                                            <div className="card shadow px-3 pt-4 pb-5 mb-5 bg-body rounded">
                                                                <div className="d-flex flex-column align-items-center pt-5">
                                                                    <FontAwesomeIcon icon={faCircleCheck} style={{ fontSize: '106px' }} className="mb-4 text-success" />
                                                                    <div className="fs-5 text-success">Password Changed successfully</div>
                                                                    <p className="pt-5 mt-5 text-black-600">Please log in with the new password.</p>
                                                                    <div className="text-center pt-4">
                                                                        <Button variant="primary" type="submit" className={`btn btn-primary px-4`} onClick={signIn}>
                                                                            Back To LOGIN
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                    }
                                </>
                        }

                    </>
            }
            {submitting && <PageLoader />}
        </>
    )
}

export default ChangePassword;