import React, { useEffect, useState } from "react";
import { navigate } from "raviger";
import Carousel from "react-bootstrap/Carousel";
import logo from './../../../assets/img/logo.png';
import EZYCOMP from "./../../../assets/img/EZYCOMP.jpg";
import Aim from "./../../../assets/img/our-aim.jpg";
import Promise from "./../../../assets/img/our-promise.jpg";
import Products from "./../../../assets/img/our-product.jpg";
import Performer from "./../../../assets/img/performer.jpg";
import Checker from "./../../../assets/img/checker.jpg";
import Contact from "./../../../assets/img/Contact.jpg";
import { preventDefault } from "../../../utils/common";
import { toast } from 'react-toastify';
import "./Authenticate.css";
import ForgotPasswordModal from "./ForgotPasswordModal";
import FormRenderer, { ComponentMapper, FormTemplate } from "../../common/FormRenderer";
import PageLoader from "../../shared/PageLoader";
import { LOGIN_FIELDS } from "./Authenticate.constants";
import VerifyOTP from "./VerifyOTP";
import { clearUserSession, getAuthToken, parseToken, setUserSession, useGenerateOTP, useUserLogin } from "../../../backend/auth";
import { API_RESULT, ERROR_MESSAGES } from "../../../utils/constants";
import { getBasePath } from "../../../App";

function Login() {
    const [token] = useState(getAuthToken());
    const [forgotPassword, setForgotPassword] = useState(false);
    const [loginWithOtp, setLoginWithOtp] = useState(false);
    const [verifyOTP, setVerifyOTP] = useState(false);
    const [schema, setSchema] = useState<any>({ fields: [LOGIN_FIELDS.USERNAME, LOGIN_FIELDS.PASSWORD] });
    const [form, setForm] = useState<any>({});
    const [payload, setPayload] = useState<any>({});
    const { userLogin, isLoading: logging } = useUserLogin((response: any) => {
        const { result, token, privileges, message } = response || {};
        if (result === API_RESULT.SUCCESS) {
            loginCallback({ token });
        } else {
            toast.error(message || 'Something went wrong. Please try again.');
        }
    }, errorCallback);
    const { generateOTP, isLoading: generatingOTP } = useGenerateOTP(({ result, message }: any) => {
        if (result === API_RESULT.SUCCESS) {
            setPayload({ ...payload, token: message });
            setVerifyOTP(true);
        } else {
            toast.error(message || ERROR_MESSAGES.ERROR);
        }
    }, errorCallback)

    function errorCallback() {
        toast.error(ERROR_MESSAGES.DEFAULT);
    }

    function login({ username, password }: any) {
        userLogin({ username, password });
    }

    function loginCallback({ token }: any) {
        const { pages, role, ...others } = parseToken(token);
        const page = typeof pages === 'string' ? pages : pages[0];
        const _role = typeof role === 'string' ? role : role[0];
        setUserSession(token, page, _role);
        navigate(`${getBasePath()}/`);
        window.location.reload();
    }

    function getOtp({ username }: any) {
        if (form.valid) {
            setPayload({ username });
            generateOTP({ username });
        }
    }

    function showForgotPwd(event: any) {
        preventDefault(event);
        setForgotPassword(true);
    }

    function toggleLoginWithOtp(event: any) {
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
                        <a href="/" onClick={showForgotPwd} className="text-black-600">
                            <small>Forgot Password</small>
                        </a>
                    ),
                })
            }
            setSchema({ fields });
        }
    }, [loginWithOtp]);

    useEffect(() => {
        if (token) {
            clearUserSession();
        }
    }, [token]);

    return (
        <>
            {
                !verifyOTP &&
                <div className="row m-0 overflow-hidden">
                    <div className="col-md-8 p-0 bannerSlider">
                        <Carousel>
                            <Carousel.Item>
                                <img className="d-block" src={EZYCOMP} alt="First slide" />
                            </Carousel.Item>
                            <Carousel.Item>
                                <img className="d-block" src={Aim} alt="Second slide" />
                            </Carousel.Item>
                            <Carousel.Item>
                                <img className="d-block" src={Promise} alt="Third slide" />
                            </Carousel.Item>
                            <Carousel.Item>
                                <img className="d-block" src={Products} alt="Third slide" />
                            </Carousel.Item>
                            <Carousel.Item>
                                <img className="d-block" src={Performer} alt="Third slide" />
                            </Carousel.Item>
                            <Carousel.Item>
                                <img className="d-block" src={Checker} alt="Third slide" />
                            </Carousel.Item>
                            <Carousel.Item>
                                <img className="d-block" src={Contact} alt="Third slide" />
                            </Carousel.Item>
                        </Carousel>
                    </div>

                    <div className="col-md-4 loginSection px-5 py-3">
                        <div className="d-flex flex-column h-100 justify-content-between align-items-center mt-5">
                            <div className="d-flex flex-column justify-content-center align-items-center">
                                <div className="navbar-brand p-0 text-center mb-4"><img src={logo} alt="Logo" width="344" /></div>
                                <div className="col-9" style={{ minHeight: loginWithOtp ? '150px' : '250px' }}>
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
                            <div className="">
                                <div className="card"></div>
                            </div>
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
