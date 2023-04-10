import React from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function AlertModal({ title, message, onClose }) {
    return (
        <Modal show={true} backdrop="static" animation={false} size="md">
            <Modal.Header closeButton={true} onHide={onClose}>
                <Modal.Title className="bg">{title || 'Alert'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div dangerouslySetInnerHTML={{ __html: message }}></div>
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-end">
                <Button variant="primary" onClick={onClose}>Ok</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default AlertModal;