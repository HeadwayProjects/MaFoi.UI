import React, { useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { MONTHS_ENUM } from "./Constants";
import * as dayjs from "dayjs";
import * as utc from "dayjs/plugin/utc";
import { ActivityType } from "../pages/Masters/Master.constants";
import FormRenderer, { ComponentMapper, FormTemplate, componentTypes } from "./FormRenderer";
import { getMaxMonthYear, getMinMonthYear } from "../../utils/common";
import { ACTIVITY_TYPE, API_DELIMITER } from "../../utils/constants";
dayjs.extend(utc);

function AdvanceSearchModal({ data, onSubmit, onCancel }) {
    const [filter, setFilter] = useState({ hideButtons: true });

    const schema = {
        fields: [
            {
                component: componentTypes.MONTH_PICKER,
                name: 'monthYear',
                label: 'Month & Year',
                className: 'grid-col-50',
                minDate: getMinMonthYear(),
                maxDate: getMaxMonthYear(),
                range: false,
                clearable: true,
                initialValue: (filter || {}).monthYear,
                onChange: onMonthYearChange.bind(this)
            },
            {
                component: componentTypes.DATE_PICKER,
                name: 'dueDate',
                label: 'Due Date',
                className: 'grid-col-100',
                range: true,
                clearable: true,
                initialValue: (filter || {}).dueDate,
                onChange: onDueDateChange.bind(this)
            },
            {
                component: componentTypes.SELECT,
                name: 'activityType',
                label: 'Activity Type',
                options: ActivityType,
                isMulti: true
            },
            {
                component: componentTypes.SELECT,
                name: 'auditType',
                label: 'Audit Type',
                options: Object.values(ACTIVITY_TYPE),
                isMulti: true
            }
        ]
    }

    function debugForm(_form) {
        setFilter(_form.values);
    }

    function isInvalid() {
        return false;
    }

    function clearFilter() {
        onSubmit({});
        onCancel();
    }

    function onMonthYearChange(event) {
        setFilter({ ...filter, monthYear: event ? event.toDate() : undefined })
    }

    function onDueDateChange(event) {
        setFilter({ ...filter, dueDate: event })
    }

    function search() {
        const { monthYear, dueDate, activityType, auditType } = filter;
        const _payload = {};
        if (monthYear) {
            const date = new Date(monthYear);
            const month = MONTHS_ENUM[date.getMonth()];
            const year = date.getFullYear();
            _payload.month = month;
            _payload.year = `${year}`;
        }

        if (dueDate) {
            let fromDate, toDate;
            if (Array.isArray(dueDate)) {
                fromDate = new Date(dueDate[0]);
                toDate = new Date(dueDate[1] || dueDate[0]);
            } else {
                fromDate = new Date(dueDate);
                toDate = new Date(dueDate);
            }
            fromDate.setHours(0);
            fromDate.setMinutes(0);
            fromDate.setSeconds(0);
            fromDate.setMilliseconds(0);
            toDate.setHours(0);
            toDate.setMinutes(0);
            toDate.setSeconds(0);
            toDate.setMilliseconds(0);
            _payload.fromDate = dayjs(new Date(fromDate)).local().format();
            _payload.toDate = dayjs(new Date(toDate)).local().format();
        }

        if (activityType) {
            _payload.activityType = activityType.map(x => x.value).join(API_DELIMITER);
        }
        if (auditType) {
            _payload.auditType = auditType.map(x => x.value).join(API_DELIMITER);
        }
        onSubmit(_payload);
        onCancel();
    }

    useEffect(() => {
        if (data) {
            const { month, year, fromDate, toDate, activityType, auditType } = data;
            const _filter = { hideButtons: true };
            if (month && year) {
                const date = new Date();
                date.setDate(1);
                date.setFullYear(parseInt(`${year}`));
                date.setMonth(MONTHS_ENUM.indexOf(month));
                _filter['monthYear'] = date;
            }

            if (fromDate && toDate) {
                if (fromDate === toDate) {
                    _filter['dueDate'] = new Date(fromDate);
                } else {
                    _filter['dueDate'] = [new Date(fromDate), new Date(toDate)];
                }
            }

            if (activityType) {
                _filter.activityType = activityType.split(API_DELIMITER).map(x => {
                    return { value: x, label: x };
                });
            }
            if (auditType) {
                _filter.auditType = auditType.split(API_DELIMITER).map(x => {
                    return { value: x, label: x };
                });
            }
            setFilter({ ..._filter });
        }
    }, [data]);

    return (
        <Modal show={true} backdrop="static" animation={false} dialogClassName="drawer" size="md">
            <Modal.Header closeButton={true} onHide={onCancel}>
                <Modal.Title className="bg">Advance Search</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex justify-content-start">
                    <div className="col-12">
                        <form>
                            <div className="row mt-3">
                                <div className="col-12">
                                    <FormRenderer FormTemplate={FormTemplate}
                                        initialValues={filter}
                                        componentMapper={ComponentMapper}
                                        schema={schema}
                                        debug={debugForm}
                                    />
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
                    <Button variant="primary" onClick={clearFilter} className="mx-3">Clear</Button>
                    <Button variant="primary" onClick={search} disabled={isInvalid()}>Submit</Button>
                </div>
            </Modal.Footer>
        </Modal>
    )
}

export default AdvanceSearchModal;