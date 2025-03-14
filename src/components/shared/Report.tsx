import React, { useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { preventDefault } from "../../utils/common";

function Report({ data, onClose, payload }: any) {
    const [summary, setSummary] = useState<any>({});

    function downloadAuditReport(e: any) {
        preventDefault(e);
    }

    function downloadCheckList(e: any) {
        preventDefault(e);
    }
    useEffect(() => {
        if ((data || []).length > 0) {
            const _record = data[0];
            const _summary = {
                company: _record.company.name,
                associateCompany: _record.associateCompany.name,
                location: _record.location.name,
                month: _record.month,
                year: _record.year
            }
            setSummary(_summary);
        }
    }, [data])
    return (
        <Modal show={true} backdrop="static" animation={false} size="lg">
            <Modal.Header closeButton={true} onHide={onClose}>
                <Modal.Title className="bg">Adudit Report</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex flex-row mb-3">
                    <div className="col-5"><strong>Company</strong></div>
                    <div className="col-7">{summary.company}</div>
                </div>
                <div className="d-flex flex-row mb-3">
                    <div className="col-5"><strong>Associate Company</strong></div>
                    <div className="col-7">{summary.associateCompany}</div>
                </div>
                <div className="d-flex flex-row mb-3">
                    <div className="col-5"><strong>Location</strong></div>
                    <div className="col-7">{summary.location}</div>
                </div>
                <div className="d-flex flex-row mb-3">
                    <div className="col-5"><strong>Month & Year</strong></div>
                    <div className="col-7">{summary.month} ({summary.year})</div>
                </div>

                <div className="d-flex flex-column my-3">
                    <a href="/" className="mb-3" onClick={downloadAuditReport}>Audit Report</a>
                    <a href="/" className="mb-3" onClick={downloadCheckList}>FA Check-List</a>
                </div>


            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-end">
                <Button variant="primary" onClick={onClose}>Ok</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default Report;