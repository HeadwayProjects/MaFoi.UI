import React, { Component } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import PageLoader from "../../shared/PageLoader";

export class SubmitToAuditorModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleClose() {
    this.props.onClose();
  }

  render() {
    return (
      <>
        <Modal show={true} backdrop="static" animation={false} size="lg">
          <Modal.Header closeButton={true} onHide={this.handleClose.bind(this)}>
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
            <Button variant="outline-secondary" onClick={() => this.handleClose()} className="btn btn-outline-secondary">
              No
            </Button>
            <div>
              <Button variant="primary" onClick={this.props.onSubmit}>
                Yes
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
        {this.state.submitting && <PageLoader />}
      </>
    )
  }
}

export default SubmitToAuditorModal;