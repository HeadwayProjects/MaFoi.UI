import React, { useState, useEffect } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { STATUS_MAPPING } from "../../common/Constants";

function PublishModal({ onClose, onSubmit, selectedRows }) {
  const [counts, setCounts] = useState([]);

  useEffect(() => {
    if (selectedRows) {
      const _counts = {};
      selectedRows.forEach(row => {
        if (!_counts[row.status]) {
          _counts[row.status] = 0;
        }
        _counts[row.status] = _counts[row.status] + 1;
      });

      setCounts(Object.keys(_counts).map(key => {
        return {
          key,
          label: STATUS_MAPPING[key],
          count: _counts[key]
        }
      }));
    }

  }, [selectedRows]);

  return (
    <>
      <Modal show={true} backdrop="static" animation={false} size="md">
        <Modal.Header closeButton={true} onHide={onClose}>
          <Modal.Title className="bg">Publish</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row mb-4">
            <div className="col-12">
              <p>There are <strong>{selectedRows.length} {selectedRows.length > 1 ? 'activities' : 'activity'}</strong> available for publishing.</p>
              <div className="row justify-content-center my-3">
                <div className="col-8">
                  {
                    counts.map(count => {
                      return (
                        <div className="row my-1" key={count.key}>
                          <div className={`col-7 status-${count.key}`}><strong>{count.label}</strong></div>
                          <div className="col-4">{count.count}</div>
                        </div>
                      )
                    })
                  }
                </div>
              </div>
              <p>Upon publishing, you will not be able to edit them further.</p>
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

export default PublishModal;