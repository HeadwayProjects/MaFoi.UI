import React, { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import FormRenderer, { ComponentMapper, FormTemplate } from "../../common/FormRenderer";
import PageLoader from "../../shared/PageLoader";
import { Alert } from "react-bootstrap";
import { API_RESULT, ERROR_MESSAGES } from "../../../utils/constants";
import { useForgotPassword } from "../../../backend/auth";
import { LOGIN_FIELDS } from "./Authenticate.constants";

function ForgotPasswordModal({ onClose }) {
    const [recoverySent, setRecoverySent] = useState(false);
    const [apiError, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({});
    const { forgotPassword } = useForgotPassword(({ result, message }) => {
        setSubmitting(false);
        if (result === API_RESULT.SUCCESS) {
            setRecoverySent(message);
        } else {
            setError(message);
        }
    }, () => {
        setSubmitting(false);
        setError(ERROR_MESSAGES.DEFAULT);
    });

    const schema = {
        fields: [{ ...LOGIN_FIELDS.USERNAME }],
    };

    function recoverPassword({ username }) {
        setError(null);
        if (form.valid) {
            setSubmitting(true);
            forgotPassword({ username });
        }
    }

    return (
        <>
            <Modal show={true} backdrop="static" animation={true} dialogClassName="alert-modal" size="lg" centered={true}>
                <Modal.Header closeButton={true} onHide={onClose}>
                    <Modal.Title className="bg">Recover Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex flex-column align-items-center">
                        {
                            recoverySent ?
                                <>
                                    <FontAwesomeIcon icon={faCircleCheck} style={{ fontSize: '106px' }} className="mb-4 text-success" />
                                    <div className="text-xxl text-success">Email Sent</div>
                                    <div className="text-md mb-4">Check your email and open the link we sent to continue.</div>
                                </> :
                                <>
                                    <div className="text-md mb-4">Enter your email and we'll send you a link to reset your password</div>
                                    {
                                        apiError && <Alert variant="danger">{apiError}</Alert>
                                    }
                                    <div className="col-md-9 m-auto">
                                        <FormRenderer FormTemplate={FormTemplate}
                                            initialValues={{ submitBtnText: 'Send link to email', fullWidth: false }}
                                            componentMapper={ComponentMapper}
                                            schema={schema}
                                            debug={setForm}
                                            onSubmit={recoverPassword}
                                        />
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

export default ForgotPasswordModal;