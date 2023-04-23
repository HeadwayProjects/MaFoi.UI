import React, { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import FormRenderer, { ComponentMapper, FormTemplate } from "../../common/FormRenderer";
import { componentTypes, validatorTypes } from "@data-driven-forms/react-form-renderer";
import { PATTERNS } from "../../common/Constants";

function ForgotPasswordModal({ onClose }) {
    const [recoverySent, setRecoverySent] = useState(false);


    function recoverPassword(event) {
        console.log(event);
        setRecoverySent(true);
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
                    { type: validatorTypes.PATTERN, pattern: PATTERNS.EMAIL }
                ]
            }
        ],
    };

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
                                    <div className="col-md-9 m-auto">
                                        <FormRenderer FormTemplate={FormTemplate}
                                            initialValues={{ submitBtnText: 'Send link to email', fullWidth: false }}
                                            componentMapper={ComponentMapper}
                                            schema={schema}
                                            onSubmit={recoverPassword}
                                        />
                                    </div>
                                </>
                        }
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default ForgotPasswordModal;