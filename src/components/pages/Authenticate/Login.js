import React, { useEffect, useState } from "react";
import { navigate } from "raviger";
import Carousel from "react-bootstrap/Carousel";
import logo from './../../../assets/img/logo.png';
import bannerimg1 from "./../../../assets/img/banner1.jpg";
import bannerimg2 from "./../../../assets/img/banner2.jpg";
import bannerimg3 from "./../../../assets/img/banner3.jpg";
import * as api from "./../../../backend/request";
import { preventDefault } from "../../../utils/common";
import { toast } from 'react-toastify';
import "./Authenticate.css";
import ForgotPasswordModal from "./ForgotPasswordModal";
import FormRenderer, { ComponentMapper, FormTemplate } from "../../common/FormRenderer";
import PageLoader from "../../shared/PageLoader";
import { LOGIN_FIELDS } from "./Authenticate.constants";
import VerifyOTP from "./VerifyOTP";
import { setAuthToken, useGenerateOTP, useUserLogin } from "../../../backend/auth";
import { ERROR_MESSAGES } from "../../../utils/constants";

function Login() {
    const [forgotPassword, setForgotPassword] = useState(false);
    const [loginWithOtp, setLoginWithOtp] = useState(false);
    const [verifyOTP, setVerifyOTP] = useState(false);
    const [schema, setSchema] = useState({ fields: [LOGIN_FIELDS.USERNAME, LOGIN_FIELDS.PASSWORD] });
    const [form, setForm] = useState({});
    const [payload, setPayload] = useState({});
    const { userLogin, isLoading: logging } = useUserLogin((token) => {
        if (token) {
            loginCallback(token);
        } else {
            toast.error('Email/Phone No. or password is incorrect.');
        }
    }, errorCallback);
    const { generateOTP, isLoading: generatingOTP } = useGenerateOTP(({ result, message, token }) => {
        if (result === 'SUCCESS') {
            setPayload({ ...payload, token });
            setVerifyOTP(true);
        } else {
            toast.error(message || 'Error');
        }
    }, errorCallback)

    function errorCallback() {
        toast.error(ERROR_MESSAGES.DEFAULT);
    }

    function login({ username, password }) {
        userLogin({ username, password });
    }

    function loginCallback(token) {
        setAuthToken(token);
        navigate('/dashboard', { replace: true });
        window.location.reload();
    }

    function getOtp({ username }) {
        if (form.valid) {
            setPayload({ username });
            generateOTP({ username });
        }
    }

    function showForgotPwd(event) {
        preventDefault(event);
        setForgotPassword(true);
    }

    function toggleLoginWithOtp(event) {
        preventDefault(event);
        setLoginWithOtp(!loginWithOtp);
        setVerifyOTP(false);
    }

    useEffect(() => {
        if (typeof loginWithOtp !== undefined) {
            setSchema(null);
            const fields = [];
            fields.push({ ...LOGIN_FIELDS.USERNAME });
            if (!loginWithOtp) {
                fields.push({
                    ...LOGIN_FIELDS.PASSWORD,
                    description: (
                        <a href="/" onClick={showForgotPwd.bind(this)} className="text-black-600">
                            <small>Forgot Password</small>
                        </a>
                    ),
                })
            }
            setSchema({ fields });
        }
    }, [loginWithOtp]);

    return (
        <>
            {
                !verifyOTP &&
                <div className="row m-0 overflow-hidden">
                    <div className="col-md-8 p-0 bannerSlider">
                        <Carousel>
                            <Carousel.Item>
                                <img className="d-block" src={bannerimg1} alt="First slide" />
                            </Carousel.Item>
                            <Carousel.Item>
                                <img className="d-block" src={bannerimg2} alt="Second slide" />
                            </Carousel.Item>
                            <Carousel.Item>
                                <img className="d-block" src={bannerimg3} alt="Third slide" />
                            </Carousel.Item>
                        </Carousel>
                    </div>

                    <div className="col-md-4 loginSection px-5 py-3">
                        <div className="d-flex flex-column h-100 justify-content-center align-items-center">
                            <div className="navbar-brand p-0 text-center mb-4"><img src={logo} alt="Logo" width="344" /></div>
                            <div className="col-9" style={{ minHeight: '250px' }}>
                                {
                                    schema &&
                                    <>
                                        {
                                            loginWithOtp ? <FormRenderer FormTemplate={FormTemplate}
                                                initialValues={{ submitBtnText: 'Get OTP', fullWidth: false }}
                                                componentMapper={ComponentMapper}
                                                schema={schema}
                                                debug={setForm}
                                                onSubmit={getOtp}
                                                clearOnUnmount={true}
                                            /> :
                                                <FormRenderer FormTemplate={FormTemplate}
                                                    initialValues={{ submitBtnText: 'Login', fullWidth: false }}
                                                    componentMapper={ComponentMapper}
                                                    debug={setForm}
                                                    schema={schema}
                                                    onSubmit={login}
                                                    clearOnUnmount={true}
                                                />
                                        }
                                    </>
                                }
                            </div>
                            <div className="text-black-600 mt-3"><small>-or-</small></div>
                            <a href="/" onClick={toggleLoginWithOtp} className="text-appprimary">{loginWithOtp ? 'Login with Password' : 'Login with OTP'}</a>
                        </div>
                    </div>
                </div>
            }
            {
                verifyOTP && <VerifyOTP editUser={() => setVerifyOTP(false)} onCancel={toggleLoginWithOtp}
                    request={payload} onSubmit={loginCallback} />
            }
            {
                forgotPassword && <ForgotPasswordModal onClose={() => setForgotPassword(false)} />
            }
            {
                (logging || generatingOTP) && <PageLoader>
                    {
                        logging && <p>Logging...</p>
                    }
                    {
                        generatingOTP && <p>Generating OTP...</p>
                    }
                </PageLoader>
            }
        </>
    );
}

export default Login;
