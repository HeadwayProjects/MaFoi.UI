import React, { useEffect, useState } from "react";
import changePasswordImg from '../../../assets/img/change-password.jpg';
import FormRenderer, { ComponentMapper, FormTemplate } from "../../common/FormRenderer";
import { preventDefault } from "../../../utils/common";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { Button } from "react-bootstrap";
import { clearAuthToken, getUserDetails, useChangePassword, useValidateUrl } from "../../../backend/auth";
import PageLoader from "../../shared/PageLoader";
import { toast } from "react-toastify";
import { API_RESULT, ERROR_MESSAGES } from "../../../utils/constants";
import { LOGIN_FIELDS } from "./Authenticate.constants";
import { navigate } from "raviger";
import { getBasePath } from "../../../App";

function ChangePassword({ token }: any) {
    const [changePwdSuccess, setChangePwdSuccess] = useState(false);
    const [user] = useState(getUserDetails(token));
    const { status, isFetching } = useValidateUrl(token);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState<any>({});
    const { changePassword } = useChangePassword(({ result, message }: any) => {
        setSubmitting(false);
        if (result === API_RESULT.SUCCESS) {
            setChangePwdSuccess(true);
        } else {
            toast.error(message);
        }
    }, () => {
        setSubmitting(false);
        toast.error(ERROR_MESSAGES.DEFAULT);
    });


    function signIn(event: any) {
        preventDefault(event);
        navigate(`${getBasePath()}/`);
        window.location.reload();
    }

    const schema = {
        fields: [{ ...LOGIN_FIELDS.NEW_PASSWORD }, { ...LOGIN_FIELDS.CONFIRM_PASSWORD }],
    };

    function onSubmit({ newPassword }: any) {
        if (form.valid) {
            setSubmitting(true);
            changePassword({ username: user.username, newPassword, token });
        }
    }

    useEffect(() => {
        clearAuthToken();
    }, []);

    return (
        <>
            {
                isFetching ? <p>Loading...</p> :
                    <>
                        {
                            (status || {}).result === 'FAILURE' ? <div className="alert alert-danger m-3" role="alert">The url is either invalid / expired. Please contact admin for more details.</div> :
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
                                                                    debug={setForm}
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