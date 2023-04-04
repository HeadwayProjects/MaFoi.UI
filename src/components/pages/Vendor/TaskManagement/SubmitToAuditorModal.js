import React from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function SubmitToAuditorModal({ onClose, onSubmit }) {
  return (
    <>
      <Modal show={true} backdrop="static" animation={false} size="lg">
        <Modal.Header closeButton={true} onHide={onClose}>
          <Modal.Title className="bg">Submit to Auditor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row mb-4">
            <div className="col-12">
              This will actually submit all the activities has submitted and you will not be able to edit further, Do you want to Submit (Yes/No)?
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          <Button variant="outline-secondary" onClick={onClose} className="btn btn-outline-secondary">
            No
          </Button>
          <div>
            <Button variant="primary" onClick={onSubmit}>
              Yes
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default SubmitToAuditorModal;