import React, { useState } from "react";
import changePasswordImg from '../../../assets/img/change-password.jpg';
import FormRenderer, { ComponentMapper, FormTemplate } from "../../common/FormRenderer";
import { componentTypes, validatorTypes } from "@data-driven-forms/react-form-renderer";
import { preventDefault } from "../../../utils/common";
import { navigate } from "raviger";
import { PATTERNS } from "../../common/Constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { Button } from "react-bootstrap";

function ChangePassword({ token }) {
    const [changePwdSuccess, setChangePwdSuccess] = useState(false);

    function onSubmit(event) {
        console.log(event, token);
        setChangePwdSuccess(true);
    }

    function validateConfirmPwd(value, values = {}) {
        return value === values.newPassword ? undefined : 'Mismatch';
    }

    function signIn(event) {
        preventDefault(event);
        navigate('/login', { replace: true });
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
                    validateConfirmPwd.bind(this)
                ]
            }
        ],
    };

    return (
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
    )
}

export default ChangePassword;