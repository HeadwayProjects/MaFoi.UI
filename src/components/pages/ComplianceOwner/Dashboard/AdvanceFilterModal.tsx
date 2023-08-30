import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import FormRenderer, { ComponentMapper, FormTemplate, componentTypes } from "../../../common/FormRenderer";
import { getMaxMonthYear, getMinMonthYear } from "../../../../utils/common";
import { ActivityType } from "../../Masters/Master.constants";
import { useGetDepartmentUserMappings } from "../../../../backend/masters";
import { getUserDetails } from "../../../../backend/auth";
import { DEFAULT_OPTIONS_PAYLOAD } from "../../../common/Table";
import { MONTHS_ENUM } from "../../../common/Constants";
import dayjs from "dayjs";
import { API_DELIMITER } from "../../../../utils/constants";
import { ComplianceActivityStatus, ComplianceStatusMapping } from "../Compliance.constants";

export default function AdvanceFilterModal(this: any, { data, onSubmit, onCancel }: any) {
    const [filter, setFilter] = useState<any>({ hideButtons: true, ...data });
    const [verticals, setVerticals] = useState<any[]>([]);
    const [departments, setDepartments] = useState<any[]>([]);
    const { departmentUsers, isFetching } = useGetDepartmentUserMappings({ ...DEFAULT_OPTIONS_PAYLOAD, filters: [{ columnName: 'userId', value: getUserDetails().userid }] });

    const schema: any = {
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
                initialValue: filter.monthYear,
                onChange: onMonthYearChange.bind(this)
            },
            {
                component: componentTypes.DATE_PICKER,
                name: 'dueDate',
                label: 'Due Date',
                className: 'grid-col-100',
                range: true,
                clearable: true,
                initialValue: filter.dueDate,
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
                name: 'vertical',
                label: 'Vertical',
                options: verticals,
                formatOptionLabel: verticalOptionLabel
            },
            {
                component: componentTypes.SELECT,
                name: 'department',
                label: 'Department',
                options: Boolean(filter.vertical) ? (departments || []).filter(({ verticalId }: any) => {
                    const { value } = filter.vertical || {};
                    return verticalId === value;
                }) : [],
                disabled: !Boolean(filter.vertical)
            },
            {
                component: componentTypes.SELECT,
                name: 'status',
                label: 'Status',
                isMulti: true,
                options: [
                    ComplianceActivityStatus.PENDING,
                    ComplianceActivityStatus.NON_COMPLIANT,
                    ComplianceActivityStatus.SUBMITTED,
                    ComplianceActivityStatus.OVERDUE,   
                    ComplianceActivityStatus.APPROVE,
                    ComplianceActivityStatus.REJECTED].map((status: any) => {
                    return {
                        id: status,
                        name: ComplianceStatusMapping[status]
                    }
                }),
                disabled: !Boolean(filter.vertical)
            }
        ]
    }

    function verticalOptionLabel({ label, vertical }: any) {
        const { company } = vertical;
        return (
            <div className="d-flex flex-column">
                <div>{label}</div>
                <div className="text-sm fw-bold fst-italic text-black-600">Company: {company.name}</div>
            </div>
        )
    }

    function onMonthYearChange(event: any) {
        setFilter({ ...filter, monthYear: event ? event.toDate() : undefined })
    }

    function onDueDateChange(event: any) {
        setFilter({ ...filter, dueDate: event })
    }

    function debugForm(_form: any) {
        setFilter(_form.values);
    }



    function clearFilter() {
        onSubmit({ payload: {}, data: {} });
        onCancel();
    }

    function search() {
        const { monthYear, dueDate, activityType, vertical, department, status } = filter;
        const _payload: any = {};
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
            _payload.fromDate = dayjs(fromDate).startOf('D').local().format();
            _payload.toDate = dayjs(toDate).endOf('D').local().format();
        }

        if (activityType) {
            _payload.activityType = activityType.map((x: any) => x.value).join(API_DELIMITER);
        }

        if (vertical) {
            _payload.veriticalId = vertical.value;
        }
        if (department) {
            _payload.departmentId = department.value;
        }
        if ((status ||[]).length) {
            _payload.status = status.map((s: any) => s.value).join(API_DELIMITER);
        }
        onSubmit({ payload: _payload, data: filter });
        onCancel();
    }

    useEffect(() => {
        if (!isFetching && departmentUsers) {
            const _verticals: any[] = [];
            const _departments: any[] = [];
            departmentUsers.forEach(({ department }: any) => {
                const { id, name, vertical } = department;
                if (!_verticals.find(({ id }: any) => id === vertical.id)) {
                    _verticals.push({
                        id: vertical.id,
                        name: vertical.name,
                        company: vertical.company
                    });
                }
                _departments.push({ id, name, verticalId: vertical.id });
            });
            setVerticals(_verticals);
            setDepartments(_departments);
        }
    }, [isFetching])

    return (
        <>
            <Modal show={true} backdrop="static" animation={false} dialogClassName="drawer" size="lg">
                <Modal.Header closeButton={true} onHide={onCancel}>
                    <Modal.Title className="bg">Advance Filters</Modal.Title>
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
                        <Button variant="primary" onClick={search} >Submit</Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )
}