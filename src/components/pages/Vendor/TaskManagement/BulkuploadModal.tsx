import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { sortBy } from "underscore";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Select from "react-select";
import * as api from "../../../../backend/request";
import { useGetForms, useGetUserCompanies } from "../../../../backend/query";
import { toast } from 'react-toastify';
import PageLoader from "../../../shared/PageLoader";
import { ALLOWED_FILES_REGEX } from "../../../common/Constants";
import { ACTIVITY_TYPE } from "../../../../utils/constants";

const Months = [
    { value: 'January', label: 'January' },
    { value: 'February', label: 'February' },
    { value: 'March', label: 'March' },
    { value: 'April', label: 'April' },
    { value: 'May', label: 'May' },
    { value: 'June', label: 'June' },
    { value: 'July', label: 'July' },
    { value: 'August', label: 'August' },
    { value: 'September', label: 'September' },
    { value: 'October', label: 'October' },
    { value: 'November', label: 'November' },
    { value: 'December', label: 'December' }
]

function getYears() {
    const year = new Date().getFullYear();
    let years = [];
    for (let i = 0; i < 5; i++) {
        years.push(year - i);
    }
    return years.map(year => {
        return { value: `${year}`, label: year }
    });
}

function BulkUploadModal({ onClose }: any) {
    const [submitting, setSubmitting] = useState(false);
    const [uploadFiles, setUploadedFiles] = useState<any>([]);
    const [companies, setCompanies] = useState<any>([]);
    const [associateCompanies, setAssociateCompanies] = useState<any>([]);
    const [locations, setLocations] = useState<any>([]);
    const [rules, setRules] = useState<any>([]);
    const [months] = useState<any>(Months);
    const [years] = useState<any>(getYears());
    const [company, setCompany] = useState<any>(null);
    const [associateCompany, setAssociateCompany] = useState<any>(null);
    const [location, setLocation] = useState<any>(null);
    const [month, setMonth] = useState<any>(Months[new Date().getMonth()]);
    const [year, setYear] = useState<any>(years[0]);
    const { userCompanies, isFetching } = useGetUserCompanies();
    const [payload, setPayload] = useState<any>({});
    const { forms, isFetching: fetchingForms } = useGetForms(payload, Boolean(payload.location) && Boolean(payload.month) && Boolean(payload.year));

    function validateFormSelection() {
        const _uploadedFiles = [...uploadFiles];
        _uploadedFiles.forEach(file => {
            file.type = null;
            file.duplicate = false;
            file.required = false;
        });
        setUploadedFiles(_uploadedFiles);
    }

    function onFileChange(event: any) {
        const _uploadedFiles = [...uploadFiles];
        if (event) {
            const length = event.target.files.length;
            const time = new Date().getTime();
            for (let i = 0; i < length; i++) {
                const file = event.target.files[i];
                const invalidFile = !ALLOWED_FILES_REGEX.exec(file.name);
                _uploadedFiles.push({ id: time + i, file, invalidFile });
            }
            setUploadedFiles(_uploadedFiles);
            event.target.value = null;
        }
    }

    function onTypeChange(event: any, index: number) {
        const _uploadedFiles = [...uploadFiles];
        delete _uploadedFiles[index].required;
        delete _uploadedFiles[index].duplicate;
        const valueExists = _uploadedFiles.find(file => {
            return file.type && file.type.value === event.value;
        });
        if (valueExists) {
            _uploadedFiles[index].duplicate = true;
        }
        _uploadedFiles[index].type = event;
        const selectedForms = _uploadedFiles.filter(file => !!file.type).map(file => file.type.value);
        _uploadedFiles.forEach(file => {
            if (file.type && file.type.value && file.duplicate) {
                const duplicates = selectedForms.filter(form => form === file.type.value);
                file.duplicate = duplicates.length > 1;
            }
        });
        setUploadedFiles(_uploadedFiles);
    }

    function onDeleteFile(index: number) {
        const _uploadedFiles = [...uploadFiles];
        _uploadedFiles.splice(index, 1);
        setUploadedFiles(_uploadedFiles);
    }

    function clearAll() {
        setUploadedFiles([]);
        setCompany(companies[0]);
        setMonth(Months[new Date().getMonth()]);
        setYear(years[0]);
    }

    function validateAndSubmit() {
        let hasError = false;
        const _uploadedFiles = [...uploadFiles];
        _uploadedFiles.forEach(file => {
            if (!file.type && !file.invalidFile) {
                file.required = true;
                hasError = true;
            }

            if (file.invalidFile || file.duplicate) {
                hasError = true;
            }
        });
        setUploadedFiles(_uploadedFiles);
        if (hasError) {
            return;
        }
        setSubmitting(true);
        const _payload = {
            company: company.value,
            associateCompany: associateCompany.value,
            location: location.value,
            month: month.value,
            year: year.value,
            statuses: ['']
        };
        api.post('/api/ToDo/GetToDoByCriteria', _payload).then(response => {
            if (response && response.data) {
                const _rows = response.data || [];
                const _applicableRows = _rows.filter((x: any) => x.auditted === ACTIVITY_TYPE.AUDIT);
                const _published = _applicableRows.filter((x: any) => x.published);
                if (_published.length > 0) {
                    setSubmitting(false);
                    toast.warn('All the activities are published for the selected month and year. You cannot modify them by performing bulk upload.');
                } else if (_applicableRows.length === 0) {
                    setSubmitting(false);
                    toast.warn('There are no activities available for the selected month and year.');
                } else {
                    submit();
                }
            }
        });
    }

    function submit() {
        const formData = new FormData();
        const _uploadedFiles = [...uploadFiles];
        _uploadedFiles.forEach(file => {
            formData.append('files', file.file, `${file.file.name}|${file.type.value}`);
        });
        formData.append('company', company.value);
        formData.append('associateCompany', associateCompany.value);
        formData.append('location', location.value);
        formData.append('month', month.value);
        formData.append('year', year.value);
        api.post('/api/FileUpload/UploadBulkFiles', formData).then(response => {
            onClose(true);
            toast.success('Files saved successfully.');
        }, error => {
            console.error(error);
        }).finally(() => setSubmitting(false))
    }

    function ruleOptionLabel({ label, form }: any) {
        return (
            <div className="d-flex flex-column">
                <div>{label}</div>
                {
                    form &&
                    <div className="text-sm d-flex align-items-center">
                        {
                            form.sectionNo &&
                            <>
                                <span className="fst-italic">Section No.</span>
                                <span className="fw-bold ms-1">{form.sectionNo}</span>
                            </>
                        }
                        {
                            form.sectionNo && form.ruleNo &&
                            <span className="text-md mx-2">|</span>
                        }
                        {
                            form.sectionNo &&
                            <>
                                <span className="fst-italic">Rule No.</span>
                                <span className="fw-bold ms-1">{form.ruleNo}</span>
                            </>
                        }
                    </div>
                }
            </div>
        )
    }

    useEffect(() => {
        setAssociateCompanies([]);
        setLocations([]);
        setAssociateCompany(null);
        setLocation(null);
        if (company) {
            const associateCompanies = (company.company.associateCompanies || []).map((associateCompany: any) => {
                return {
                    label: associateCompany.associateCompany.name,
                    value: associateCompany.associateCompany.id,
                    associateCompany: associateCompany.associateCompany,
                    locations: associateCompany.locations
                };
            });
            const sorted = sortBy(associateCompanies, 'label');
            setAssociateCompanies(sorted);
            setAssociateCompany((sorted || [])[0] || null);
        }
    }, [company]);

    useEffect(() => {
        setLocations([]);
        setLocation(null);
        if (associateCompany) {
            const locations = (associateCompany.locations || []).map((location: any) => {
                return { label: `${location.name}, ${location.cities.name}`, value: location.id, location, stateId: location.cities.stateId };
            });
            const sorted = sortBy(locations, 'label');
            setLocations(sorted);
            setLocation((sorted || [])[0] || null);
        }
    }, [associateCompany]);

    useEffect(() => {
        if ((location || {}).stateId) {
            setPayload({
                company: company.value,
                associateCompany: associateCompany.value,
                location: location.value,
                month: month.value,
                year: year.value
            });
        }
    }, [location])
    useEffect(() => {
        if (month && year) {
            setPayload({
                ...payload,
                month: month.value,
                year: year.value
            });
        }
    }, [month, year])


    useEffect(() => {
        if (!isFetching && userCompanies) {
            const companies = userCompanies.map((company: any) => {
                return { value: company.id, label: company.name, company }
            });
            const sorted = sortBy(companies, 'label');
            setCompanies(sorted);
            setCompany(sorted[0]);
        }
    }, [isFetching]);


    useEffect(() => {
        if (!fetchingForms && forms) {
            validateFormSelection();
        }
    }, [fetchingForms])

    return (
        <>
            <Modal show={true} backdrop="static" animation={false} size="lg">
                <Modal.Header closeButton={true} onHide={onClose}>
                    <Modal.Title className="bg">Bulk Upload</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row mb-4">
                        <div className="col-3">
                            <label className="filter-label">Company</label>
                            <Select options={companies} onChange={setCompany} placeholder='Company'
                                value={company} className="select-control" />
                        </div>
                        <div className="col-4">
                            <label className="filter-label">Associate Company</label>
                            <Select options={associateCompanies} onChange={setAssociateCompany} placeholder='Associate Company'
                                value={associateCompany} className="select-control" />
                        </div>
                        <div className="col-3">
                            <label className="filter-label">Location</label>
                            <Select options={locations} onChange={setLocation} placeholder='Location'
                                value={location} className="select-control" />
                        </div>
                    </div>
                    <div className="row mb-4">
                        <div className="col-3">
                            <label className="filter-label">Month</label>
                            <Select options={months} onChange={setMonth} placeholder='Month'
                                value={month} className="select-control" />
                        </div>
                        <div className="col-4">
                            <label className="filter-label">Year</label>
                            <Select options={years} onChange={setYear} placeholder='Year'
                                value={year} className="select-control" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-7 mb-3">
                            <label className="filter-label">Select file to upload</label>
                            <input type="file" className="form-control" id="inputGroupFile01"
                                onChange={onFileChange} multiple />
                        </div>
                        <div className="col-5"></div>
                    </div>
                    <div className="row m-0">
                        <table className="table modalTable fixed_header">
                            <thead>
                                <tr>
                                    <th style={{ width: '5%' }}></th>
                                    <th style={{ width: '50%' }}>File Name</th>
                                    <th style={{ width: '40%' }}>Forms/Registers & Returns</th>
                                    <th style={{ width: '5%' }}></th>
                                </tr>
                            </thead>
                            <tbody style={{ height: '300px' }}>
                                {
                                    uploadFiles.map((file: any, index: number) => {
                                        return (
                                            <tr key={index}>
                                                <td width="5%">{index + 1}</td>
                                                <td width="50%" >
                                                    <div>{file.file.name}</div>
                                                    {
                                                        file.invalidFile &&
                                                        <div className="text-danger">
                                                            {file.invalidFile && <small>Invalid file format.</small>}
                                                        </div>
                                                    }
                                                </td>
                                                <td width="40%">
                                                    <Select options={sortBy(forms, 'formName').map((form: any) => {
                                                        return { value: form.actStateMappingId, label: form.formName, form }
                                                    })} className={`${(file.required || file.duplicate) && 'error'} select-control`}
                                                        value={file.type} menuPlacement="auto" menuPosition="fixed"
                                                        onChange={(event) => onTypeChange(event, index)}
                                                        isDisabled={file.invalidFile} formatOptionLabel={ruleOptionLabel} />
                                                    {
                                                        (file.required || file.duplicate) &&
                                                        <div className="text-danger">
                                                            {file.required && <small>Required</small>}
                                                            {file.duplicate && <small>Form selection duplicate</small>}
                                                        </div>
                                                    }
                                                </td>
                                                <td width="5%">
                                                    <span style={{ opacity: 0.5, cursor: "pointer", color: "var(--red)" }} title="Delete">
                                                        <FontAwesomeIcon icon={faTrash} className="opacity-50" onClick={() => onDeleteFile(index)} />
                                                    </span>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                                {
                                    uploadFiles.length === 0 &&
                                    <tr >
                                        <td colSpan={4} width="100%" className="text-center" >No files uploaded</td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-between">
                    <Button variant="outline-secondary" onClick={onClose} className="btn btn-outline-secondary">
                        Back
                    </Button>
                    <div>
                        <Button variant="secondary" className="me-3" onClick={clearAll}>
                            Reset
                        </Button>
                        <Button variant="primary" onClick={validateAndSubmit} disabled={uploadFiles.length === 0}>
                            Submit
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
            {submitting && <PageLoader />}
        </>
    )

}

export default BulkUploadModal;