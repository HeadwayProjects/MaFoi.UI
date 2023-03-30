import React, { Component } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import * as api from "../../../backend/request";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faUpload } from "@fortawesome/free-solid-svg-icons";
import PageLoader from "../../shared/PageLoader";
import { toast } from 'react-toastify';

const SUBMITED_STATUSES = ['Submitted', 'Audited'];

function StatusTmp({ status }) {
    function computeStatusColor(status) {
        if (status === 'Pending') {
            return 'text-warning';
        } else if (status === 'Reject' || status === 'Overdue') {
            return 'text-danger';
        } else if (status === 'Submitted') {
            return 'text-success';
        } else if (status === 'Audited') {
            return 'text-success-emphasis'
        }
        return 'text-secondary'
    }
    return (
        <span className={computeStatusColor(status)}>{status}</span>
    )
}

class EditActivity extends Component {
    constructor(props) {
        super(props);
        this.state = { activity: {}, files: [], allowEdit: false, submitting: false };
    }

    componentDidMount() {
        if (this.props.activity) {
            this.setState({ activity: this.props.activity, allowEdit: !SUBMITED_STATUSES.includes(this.props.activity.status) });
            this.fetchDocuments();
        }
    }

    fetchDocuments() {
        api.get(`/api/ToDoDetails/GetByToDo?toDoId=${this.props.activity.id}`).then(response => {
            const files = (response.data || []).map(file => {
                return {
                    ...file,
                    download: this.downloadFile.bind(this),
                    preview: this.previewFile.bind(this),
                    delete: this.deleteFile.bind(this)
                }
            });
            this.setState({ files });
        }).finally(() => this.setState({ submitting: false }));
    }

    onFileChange(event) {
        const file = event.target.files[0];
        const allowedExtensions = /(\.xlsx|\.xls|\.pdf)$/i;
        const invalidFile = !allowedExtensions.exec(file.name);
        this.setState({ file, invalidFile, event });
    }

    uploadFile() {
        this.setState({ submitting: true });
        const formData = new FormData();
        formData.append('file', this.state.file, this.state.file.name);
        api.post(`/api/FileUpload/UploadSingleFile?toDoId=${this.state.activity.id}`, formData).then(() => {
            this.fetchDocuments();
            this.state.event.target.value = null;
            this.setState({ file: null, invalidFile: false, event: null });
            toast.success('File uploaded successfully.');
        }, () => this.setState({ submitting: false }));
    }

    downloadFile(file) {
        const link = document.createElement('a');
        link.href = file.filePath;
        link.download = file.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    previewFile(file) {
        window.open(file.filePath, '_blank');
    }

    deleteFile(file) {
        this.setState({ submitting: true });
        api.del(`/api/ToDoDetails/Delete?Id=${file.id}`).then(() => {
            this.fetchDocuments();
            toast.success('File deleted successfully.');
        }, () => this.setState({ submitting: false }));
    }

    handleClose() {
        this.props.onClose();
    }

    submit() {
        this.setState({ submitting: true });
        api.get(`/api/ToDo/SaveActivity?toDo=${this.state.activity.id}`).then(response => {
            toast.success('Activity saved successfully.');
            this.props.onClose();
            this.props.onSubmit();
        }).finally(() => this.setState({ submitting: false }));
    }


    render() {
        return (
            <>
                <Modal show={true} backdrop="static" animation={false} size="lg">
                    <Modal.Header closeButton={true} onHide={this.handleClose.bind(this)} />
                    <Modal.Body>
                        <div className="d-flex justify-content-center">
                            <div className="col-8">
                                <div className="row mb-2">
                                    <div className="col-2">Act</div>
                                    <div className="col">{(this.state.activity.act || {}).name}</div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-2">Rule</div>
                                    <div className="col">{(this.state.activity.rule || {}).name}</div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-2">Forms</div>
                                    <div className="col">{(this.state.activity.activity || {}).name}</div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-2">Month</div>
                                    <div className="col">{this.state.activity.month} ({this.state.activity.year})</div>
                                </div>
                                <div className="row mb-4">
                                    <div className="col-2">Status</div>
                                    <div className="col">{this.state.activity.status && <StatusTmp status={this.state.activity.status} />}</div>
                                </div>
                                {
                                    this.state.allowEdit &&
                                    <>
                                        <div className="row mb-4">
                                            <div className="col w-100">
                                                <input type="file" className="form-control" onChange={this.onFileChange.bind(this)} />
                                                {
                                                    this.state.invalidFile &&
                                                    <div className="text-danger"> <small>Invalid file format.</small></div>
                                                }

                                            </div>
                                        </div>
                                        <div className="row justify-content-center">
                                            <div className="col-2">
                                                <Button variant="outline-primary" disabled={!this.state.file || this.state.invalidFile}
                                                    onClick={this.uploadFile.bind(this)}>
                                                    <div className="d-flex align-items-center justify-content-center w-100">
                                                        <FontAwesomeIcon icon={faUpload} />
                                                        <span className="ms-2">Upload</span>
                                                    </div>
                                                </Button>
                                            </div>
                                        </div>
                                    </>
                                }
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
                                            this.state.files.map((file, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td width="75%">{file.fileName}</td>
                                                        <td width="25%">
                                                            <div className="d-flex flex-row align-items-center">
                                                                {/* Preview */}
                                                                {/* <span className="me-4" style={{ zoom: 1.6, opacity: 0.5, cursor: "pointer" }} onClick={() => file.preview(file)}>
                                                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M6 4.5C6.39782 4.5 6.77936 4.65804 7.06066 4.93934C7.34196 5.22064 7.5 5.60218 7.5 6C7.5 6.39782 7.34196 6.77936 7.06066 7.06066C6.77936 7.34196 6.39782 7.5 6 7.5C5.60218 7.5 5.22064 7.34196 4.93934 7.06066C4.65804 6.77936 4.5 6.39782 4.5 6C4.5 5.60218 4.65804 5.22064 4.93934 4.93934C5.22064 4.65804 5.60218 4.5 6 4.5ZM6 2.25C8.5 2.25 10.635 3.805 11.5 6C10.635 8.195 8.5 9.75 6 9.75C3.5 9.75 1.365 8.195 0.5 6C1.365 3.805 3.5 2.25 6 2.25ZM1.59 6C1.99413 6.82515 2.62165 7.52037 3.40124 8.00663C4.18083 8.49288 5.0812 8.75066 6 8.75066C6.9188 8.75066 7.81917 8.49288 8.59876 8.00663C9.37835 7.52037 10.0059 6.82515 10.41 6C10.0059 5.17485 9.37835 4.47963 8.59876 3.99337C7.81917 3.50712 6.9188 3.24934 6 3.24934C5.0812 3.24934 4.18083 3.50712 3.40124 3.99337C2.62165 4.47963 1.99413 5.17485 1.59 6Z" fill="#322C2D" />
                                                                    </svg>
                                                                </span> */}
                                                                {/* Download */}
                                                                <span className="me-4" style={{ zoom: 1.6, opacity: 0.5, cursor: "pointer" }} onClick={() => file.download(file)}>
                                                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M9.75 7.875V9.75H2.25V7.875H1V9.75C1 10.4375 1.5625 11 2.25 11H9.75C10.4375 11 11 10.4375 11 9.75V7.875H9.75Z" fill="#322C2D" />
                                                                        <path d="M9.125 5.375L8.24375 4.49375L6.625 6.10625L6.625 1L5.375 1L5.375 6.10625L3.75625 4.49375L2.875 5.375L6 8.5L9.125 5.375Z" fill="#322C2D" />
                                                                    </svg>
                                                                </span>
                                                                {/* Delet */}
                                                                {
                                                                    this.state.allowEdit &&
                                                                    <span style={{ opacity: 0.5, cursor: "pointer" }} onClick={() => file.delete(file)}>
                                                                        <FontAwesomeIcon icon={faTrash} />
                                                                    </span>
                                                                }
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                        {
                                            this.state.files.length === 0 &&
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
                    {
                        this.state.allowEdit ?
                            <>
                                <Modal.Footer className="d-flex justify-content-between">
                                    <Button variant="outline-secondary" onClick={() => this.handleClose()} className="btn btn-outline-secondary">
                                        Back
                                    </Button>
                                    <Button variant="primary" onClick={() => this.submit()}>Save Activity</Button>
                                </Modal.Footer>
                            </> :
                            <>
                                <Modal.Footer className="d-flex justify-content-end">
                                    <Button variant="primary" onClick={() => this.handleClose()} >Close</Button>
                                </Modal.Footer>
                            </>
                    }
                </Modal>
                {this.state.submitting && <PageLoader />}
            </>
        )
    }
}

export default EditActivity;