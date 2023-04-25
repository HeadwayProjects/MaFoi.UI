import React, { useState } from "react";
import { navigate } from "raviger";
import Carousel from "react-bootstrap/Carousel";
import logo from './../../../assets/img/logo.png';
import bannerimg1 from "./../../../assets/img/banner1.jpg";
import bannerimg2 from "./../../../assets/img/banner2.jpg";
import bannerimg3 from "./../../../assets/img/banner3.jpg";
import * as api from "./../../../backend/request";
import * as auth from "./../../../backend/auth";
import { preventDefault } from "../../../utils/common";
import { toast } from 'react-toastify';
import "./Authenticate.css";
import ForgotPasswordModal from "./ForgotPasswordModal";
import { PATTERNS } from "../../common/Constants";
import FormRenderer, { ComponentMapper, FormTemplate } from "../../common/FormRenderer";
import { componentTypes, validatorTypes } from "@data-driven-forms/react-form-renderer";
import PageLoader from "../../shared/PageLoader";

function Login() {
    const [forgotPassword, setForgotPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    function login({ username, password }) {
        setSubmitting(true);
        api.post(`/api/Auth/Login?username=${username}&password=${password}`).then(response => {
            if (response && response.data) {
                auth.setAuthToken(response.data);
                navigate('/dashboard', { replace: true });
                window.location.reload();
            } else {
                toast.error('Email/Phone No. or password is incorrect.');
            }
        }).finally(() => {
            setSubmitting(false);
        });
    }

    const schema = {
        fields: [
            {
                component: componentTypes.TEXT_FIELD,
                name: 'username',
                label: 'Email Address',
                fieldType: 'email',
                validate: [
                    { type: validatorTypes.REQUIRED },
                    { type: validatorTypes.PATTERN, pattern: PATTERNS.EMAIL, message: 'Invalid email address' }
                ]
            },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'password',
                label: 'Password',
                fieldType: 'password',
                description: (
                    <a href="/" onClick={(e) => { preventDefault(e); setForgotPassword(true) }} className="text-black-600">
                        <small>Forgot Password</small>
                    </a>
                ),
                validate: [
                    { type: validatorTypes.REQUIRED }
                ]
            }
        ],
    };

    return (
        <>
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
                        <FormRenderer FormTemplate={FormTemplate}
                            initialValues={{ submitBtnText: 'Login', fullWidth: false }}
                            componentMapper={ComponentMapper}
                            schema={schema}
                            onSubmit={login}
                        />
                        <div className="text-black-600 mt-3"><small>-or-</small></div>
                        <a href="/" onClick={preventDefault} className="text-appprimary">Login with OTP</a>
                    </div>
                </div>
            </div>
            {
                forgotPassword && <ForgotPasswordModal onClose={() => setForgotPassword(false)} />
            }
            {
                submitting && <PageLoader />
            }
        </>
    );
}

export default Login;
