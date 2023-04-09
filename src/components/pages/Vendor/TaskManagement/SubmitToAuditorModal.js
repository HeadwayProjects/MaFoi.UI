import React from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function SubmitToAuditorModal({ onClose, onSubmit, selectedRows }) {
  return (
    <>
      <Modal show={true} backdrop="static" animation={false} size="lg">
        <Modal.Header closeButton={true} onHide={onClose}>
          <Modal.Title className="bg">Submit to Auditor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row mb-4">
            <div className="col-12">
              <p>You have selected <strong>{selectedRows.length} {selectedRows.length > 1 ? 'activities' : 'activity'}</strong> for submission. Upon submission to Auditor, you will not be able to edit them further</p>
              <p>Do you want to submit ? click "Yes"</p>
              <p>To cancel, click "No"</p>
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