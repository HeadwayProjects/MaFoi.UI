import React from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useGetActivityDocuments } from "../../../backend/query";

function StatusTmp({ status }) {
    function computeStatusColor(status) {
        if (status === 'Pending') {
            return 'text-warning';
        } else if (status === 'Reject' || status === 'Overdue') {
            return 'text-danger';
        } else if (status === 'Submitted') {
            return 'text-success';
        } else if (status === 'Approved') {
            return 'text-success-emphasis'
        }
        return 'text-secondary'
    }
    return (
        <span className={computeStatusColor(status)}>{status}</span>
    )
}

function ViewActivityModal({ activity = {}, onClose }) {
    const { documents } = useGetActivityDocuments(activity.id);

    function downloadFile(file) {
        const link = document.createElement('a');
        link.href = file.filePath;
        link.download = file.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <>
            <Modal show={true} backdrop="static" animation={false} size="lg">
                <Modal.Header closeButton={true} onHide={onClose}>
                    <Modal.Title className="bg">Activity Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex justify-content-center">
                        <div className="col-8">
                            <div className="row mb-2">
                                <div className="col-4 fw-bold">Act</div>
                                <div className="col">{(activity.act || {}).name}</div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-4 fw-bold">Rule</div>
                                <div className="col">{(activity.rule || {}).name}</div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-4 fw-bold">Forms/Registers & Returns</div>
                                <div className="col">{(activity.activity || {}).name}</div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-4 fw-bold">Month(Year)</div>
                                <div className="col">{activity.month} ({activity.year})</div>
                            </div>
                            <div className="row mb-4">
                                <div className="col-4 fw-bold">Forms Status</div>
                                <div className="col">{activity.status && <StatusTmp status={activity.status} />}</div>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-center">
                        <div className="col-10">
                            <table className="table modalTable fixed_header">
                                <thead>
                                    <tr>
                                        <th width="75%">File Name</th>
                                        <th width="25%">Actions</th>
                                    </tr>
                                </thead>
                                <tbody height="300px">
                                    {
                                        documents.map((file, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td width="75%">{file.fileName}</td>
                                                    <td width="25%">
                                                        <div className="d-flex flex-row align-items-center">
                                                            {/* Download */}
                                                            <span className="me-4" style={{ zoom: 1.6, opacity: 0.5, cursor: "pointer" }}
                                                                onClick={() => downloadFile(file)} title="Download">
                                                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M9.75 7.875V9.75H2.25V7.875H1V9.75C1 10.4375 1.5625 11 2.25 11H9.75C10.4375 11 11 10.4375 11 9.75V7.875H9.75Z" fill="var(--bs-blue)" />
                                                                    <path d="M9.125 5.375L8.24375 4.49375L6.625 6.10625L6.625 1L5.375 1L5.375 6.10625L3.75625 4.49375L2.875 5.375L6 8.5L9.125 5.375Z" fill="var(--bs-blue)" />
                                                                </svg>
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                    {
                                        documents.length === 0 &&
                                        <tr>
                                            <td colSpan={2} rowSpan={4} width="100%" style={{ height: '200px', border: 0 }}>
                                                <div className="d-flex w-100 h-100 align-items-center justify-content-center">
                                                    No files available
                                                </div>
                                            </td>
                                        </tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-end">
                    <Button variant="primary" onClick={onClose} >Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ViewActivityModal;