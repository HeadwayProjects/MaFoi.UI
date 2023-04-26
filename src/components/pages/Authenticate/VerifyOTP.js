import React, { useState } from "react";
import verifyOtpImg from "../../../assets/img/verify-otp.svg";
import ezycompLogo from "../../../assets/img/logo.png";
import Navbar from "../../shared/Navbar";
import { preventDefault } from "../../../utils/common";
import FormRenderer, { ComponentMapper, FormTemplate } from "../../common/FormRenderer";
import { LOGIN_FIELDS } from "./Authenticate.constants";
import { useGenerateOTP, useLoginWithOtp } from "../../../backend/auth";
import { toast } from "react-toastify";
import PageLoader from "../../shared/PageLoader";
import { ERROR_MESSAGES } from "../../../utils/constants";

function VerifyOTP({ request, editUser, onCancel, onSubmit }) {
    const [form, setForm] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const { loginWithOtp } = useLoginWithOtp(({ key, value }) => {
        setSubmitting(false);
        if (key === 'SUCCESS') {
            onSubmit(value);
        } else {
            toast.error(value || 'Error!!!');
        }
    }, errorCallback);
    const { generateOTP } = useGenerateOTP(({ result, message }) => {
        setSubmitting(false);
        if (result === 'SUCCESS') {
            toast.success('OTP resent to your registered email.')
        } else {
            toast.error(message || 'Error');
        }
    }, errorCallback);

    function errorCallback() {
        setSubmitting(false);
        toast.error(ERROR_MESSAGES.DEFAULT);
    }

    const schema = {
        fields: [{ ...LOGIN_FIELDS.OTP }]
    }

    function editUsername(event) {
        preventDefault(event);
        editUser();
    }

    function verifyOTP({ otp }) {
        if (form.valid) {
            setSubmitting(true);
            loginWithOtp({ username: request.username, otp });
        }
    }

    function resendOTP(event) {
        preventDefault(event);
        setSubmitting(true);
        generateOTP({ username: request.username });
    }

    return (
        <>
            <Navbar showUser={false} />
            <div className="page-layout-container bg-white">
                <div className="main-container overflow-hidden">
                    <div className="d-flex flex-row h-100 overflow-hidden justify-content-center my-4">
                        <div className="col-7" style={{ maxWidth: '700px' }}>
                            <div className="d-flex flex-row justify-content-center align-items-center mb-3">
                                <div className="text-xxxl fw-900 text-nowrap">Welcome to</div>
                                <div className="">
                                    <img src={ezycompLogo} alt="EZYCOMP LOGO" height={'100px'} />
                                </div>
                            </div>
                            <div className="card shadow px-3 pt-4 pb-5 mb-5 bg-body rounded">
                                <div className="p-0 text-center pt-2">
                                    <h5 className="text-xl text-black-600">Verify OTP</h5>
                                </div>
                                <div className="d-flex justify-content-center py-3">
                                    <img src={verifyOtpImg} alt="VERIFY OTP" height={'75px'} />
                                </div>
                                <div className="d-flex flex-column justify-content-center mx-auto">
                                    <div className="text-center mt-5">
                                        <span>Please verify the OTP sent to </span>
                                        <a href="/" className="text-decoration-underline fw-bold">{request.username}</a>
                                    </div>
                                    <div className="text-end">
                                        <a href="/" className="text-sm" onClick={editUsername}>(Edit)</a>
                                    </div>
                                </div>
                                <div className="col-md-10 m-auto mt-4" style={{ maxWidth: '300px' }}>
                                    <div className="col-md-10 mx-auto">
                                        <FormRenderer FormTemplate={FormTemplate}
                                            initialValues={{ submitBtnText: 'Verify OTP' }}
                                            componentMapper={ComponentMapper}
                                            schema={schema}
                                            debug={setForm}
                                            onSubmit={verifyOTP}
                                        />
                                    </div>
                                </div>
                                <div className="mt-5 text-black-600 text-center">OTP expires in 15 minutes</div>
                                <div className="text-center">
                                    <a href="/" className="mt-2 text-md" onClick={resendOTP}>RESEND OTP</a>
                                </div>
                            </div>
                            <div className="text-black-600 mt-3 text-center"><small>-or-</small></div>
                            <div className="text-center">
                                <a href="/" onClick={onCancel} className="text-appprimary">Login with Password</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {
                submitting && <PageLoader />
            }
        </>
    );
}

export default VerifyOTP;