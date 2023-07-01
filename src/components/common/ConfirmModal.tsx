import React from "react";
import { Button, Modal } from "react-bootstrap";


function ConfirmModal({ onSubmit, onClose, yesText = 'Yes', noText = 'No', title, message, children }: any) {

    function submit(event: any) {
        onSubmit(event);
        onClose();
    }

    return (
        <Modal show={true} backdrop="static" animation={false} dialogClassName="confirm-modal" >
            <Modal.Header closeButton={true} onHide={onClose}>
                {
                    title &&
                    <Modal.Title className="bg">{title}</Modal.Title>
                }
            </Modal.Header>
            <Modal.Body>
                <div dangerouslySetInnerHTML={{ __html: message }}></div>
                {children}
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-between">
                <Button variant="outline-secondary" className="btn btn-outline-secondary px-4" onClick={onClose}>{noText}</Button>
                <Button variant="primary" onClick={submit} className="px-4">{yesText}</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ConfirmModal;