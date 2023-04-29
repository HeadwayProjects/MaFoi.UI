import React, { useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import { componentTypes, validatorTypes } from "@data-driven-forms/react-form-renderer";
import FormRenderer, { ComponentMapper, FormTemplate } from "../../common/FormRenderer";
import { Button } from "react-bootstrap";
import { ACTIONS } from "../../common/Constants";

function LawDetails({ action, data, onClose, onSubmit }) {
    const [form, setForm] = useState({});
    const [title, setTitle] = useState();

    const schema = {
        fields: [
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXT_FIELD,
                name: 'name',
                label: 'Law Name',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                content: (data || {}).name
            },
            {
                component: action === ACTIONS.VIEW ? componentTypes.PLAIN_TEXT : componentTypes.TEXTAREA,
                name: 'description',
                label: 'Description',
                content: (data || {}).description
            }
        ],
    };

    function onSubmit() {
        if (form.valid) {
            onSubmit();
        }
    }

    useEffect(() => {
        if (action) {
            switch (action) {
                case ACTIONS.ADD:
                    setTitle('Add Law Master');
                    break;
                case ACTIONS.EDIT:
                    setTitle('Edit Law Master');
                    break;
                case ACTIONS.VIEW:
                    setTitle('View Law Master');
                    break;
                default:
                    setTitle('Law Master');
            }
        }
    }, [action]);

    return (
        <>
            <Modal show={true} backdrop="static" dialogClassName="drawer" animation={false}>
                <Modal.Header closeButton={true} onHide={onClose}>
                    <Modal.Title className="bg">{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormRenderer FormTemplate={FormTemplate}
                        initialValues={{ hideButtons: true, ...data }}
                        componentMapper={ComponentMapper}
                        schema={schema}
                        debug={setForm}
                    />
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-between">
                    {
                        action !== ACTIONS.VIEW ?
                            <>
                                <Button variant="outline-secondary" className="btn btn-outline-secondary px-4" onClick={onClose}>{'Cancel'}</Button>
                                <Button variant="primary" onClick={onSubmit} className="px-4" disabled={!form.valid}>{'Submit'}</Button>
                            </> :
                            <Button variant="primary" onClick={onClose} className="px-4 ms-auto">{'Close'}</Button>

                    }
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default LawDetails;