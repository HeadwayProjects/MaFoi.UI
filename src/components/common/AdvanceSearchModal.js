import React, { useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Select from 'react-select';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FILTERS, MONTHS, SEARCH_FIELDS, YEARS } from "./Constants";
import * as dayjs from "dayjs";
import * as utc from "dayjs/plugin/utc";
dayjs.extend(utc);


function AdvanceSearchModal({ data, fields = [], onSubmit, onCancel }) {
    const [options, setOptions] = useState([]);
    const [payload, setPayload] = useState({});
    const [filter, setFilter] = useState(null);

    function isInvalid() {
        if (filter) {
            if (filter.value === FILTERS.MONTH) {
                return false;
            } else {
                return !payload.fromDate || !payload.toDate;
            }
        }
        return true;
    }

    function onFilterChange(event) {
        setPayload({});
        setFilter(event);
        if (event && event.value === FILTERS.MONTH) {
            const month = MONTHS[new Date().getMonth()];
            const year = YEARS.find(x => x.value === `${new Date().getFullYear()}`);
            setPayload({ month, year, fromDate: null, toDate: null });
        } else if (!event) {
            search(false);
        }
    }

    function onMonthChange(event) {
        setPayload({ ...payload, month: event });
    }

    function onYearChange(event) {
        setPayload({ ...payload, year: event });
    }

    function fromDateChange(fromDate) {
        const toDate = payload.toDate;
        if (toDate && fromDate > toDate) {
            setPayload({ ...payload, fromDate, toDate: fromDate });
        } else {
            setPayload({ ...payload, fromDate })
        }
    }

    function toDateChange(toDate) {
        const fromDate = payload.fromDate;
        if (fromDate && toDate > fromDate) {
            setPayload({ ...payload, toDate });
        } else {
            setPayload({ ...payload, toDate: fromDate });
        }
    }

    function search(event) {
        const _payload = {};
        if (event && filter) {
            switch (filter.value) {
                case FILTERS.MONTH:
                    _payload.month = payload.month.value;
                    _payload.year = payload.year.value;
                    break;
                case FILTERS.DUE_DATE:
                case FILTERS.SUBMITTED_DATE:
                    _payload.fromDate = dayjs(new Date(payload.fromDate)).local().format();
                    _payload.toDate = dayjs(new Date(payload.toDate)).local().format();
                    break;
                default:
                // Do Nothing
            }
        }
        onSubmit(_payload);
        onCancel();
    }

    useEffect(() => {
        setOptions(SEARCH_FIELDS.filter(x => fields.includes(x.value)));
    }, [fields]);

    useEffect(() => {
        if (data) {
            const _payload = { month: null, year: null, fromDate: null, toDate: null };
            if (data.month) {
                _payload.month = MONTHS.find(x => x.value === data.month);
                _payload.year = YEARS.find(x => x.value === data.year);
                setFilter(SEARCH_FIELDS.find(x => x.value === FILTERS.MONTH));
            } else if (data.fromDate) {
                _payload.fromDate = new Date(data.fromDate);
                _payload.toDate = new Date(data.toDate || data.fromDate);
                setFilter(SEARCH_FIELDS.find(x => x.value !== FILTERS.MONTH && fields.includes(x.value)));
            }
            setPayload(_payload);
        }
        setOptions(SEARCH_FIELDS.filter(x => fields.includes(x.value)));
    }, [data]);


    return (
        <Modal show={true} backdrop="static" animation={false} size="md">
            <Modal.Header closeButton={true} onHide={onCancel}>
                <Modal.Title className="bg">Advance Search</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex justify-content-start">
                    <div className="col-12">
                        <form>
                            <div className="row mt-3">
                                <div className="col-8">
                                    <div className="row">
                                        <div className="col-12 mb-4">
                                            <label className="filter-label">Filter By</label>
                                            <Select placeholder='Select Filter' options={options} onChange={onFilterChange} value={filter}
                                                menuPosition="fixed" />
                                        </div>
                                    </div>
                                    {
                                        filter && filter.value === FILTERS.MONTH &&
                                        <div className="row">
                                            <div className="col-6 mb-4">
                                                <label className="filter-label">Month</label>
                                                <Select placeholder='Select Month' options={MONTHS} onChange={onMonthChange} value={payload.month}
                                                    menuPosition="fixed" />
                                            </div>
                                            <div className="col-6 mb-4">
                                                <label className="filter-label">Year</label>
                                                <Select placeholder='Select Year' options={YEARS} onChange={onYearChange} value={payload.year}
                                                    menuPosition="fixed" />
                                            </div>
                                        </div>
                                    }
                                    {
                                        filter && [FILTERS.DUE_DATE, FILTERS.SUBMITTED_DATE].includes(filter.value) &&
                                        <div className="row">
                                            <div className="col-6 mb-4">
                                                <label className="filter-label">From</label>
                                                <DatePicker className="form-control" selected={payload.fromDate} dateFormat="dd-MM-yyyy"
                                                    onChange={fromDateChange} placeholderText="dd-mm-yyyy"
                                                    showMonthDropdown
                                                    showYearDropdown
                                                    dropdownMode="select" />
                                            </div>
                                            <div className="col-6 mb-4">
                                                <label className="filter-label">To</label>
                                                <DatePicker className="form-control" selected={payload.toDate} dateFormat="dd-MM-yyyy"
                                                    onChange={toDateChange} placeholderText="dd-mm-yyyy"
                                                    showMonthDropdown
                                                    showYearDropdown
                                                    dropdownMode="select" />
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-between">
                <Button variant="outline-secondary" onClick={onCancel} className="btn btn-outline-secondary">
                    Back
                </Button>
                <div>
                    <Button variant="primary" onClick={() => onFilterChange(null)} className="mx-3">Clear</Button>
                    <Button variant="primary" onClick={search} disabled={isInvalid()}>Submit</Button>
                </div>
            </Modal.Footer>
        </Modal>
    )
}

export default AdvanceSearchModal;