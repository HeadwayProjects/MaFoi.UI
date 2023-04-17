import React from "react";
import dayjs from "dayjs";
import { STATUS_MAPPING } from "../../../common/Constants";

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

function ActivityList({ list }) {
    return (
        <>
            <ul className="list-group overflow-hidden" style={{ height: '160px' }}>
                {
                    list.map(activity => {
                        return (
                            <li className="list-group-item" key={activity.id} style={{ height: '40px' }}>
                                <span>{activity.location.name}</span>
                                <span>-</span>
                                <StatusTmp status={STATUS_MAPPING[activity.status]} />
                                <span>-</span>
                                <span>{dayjs(new Date(activity.dueDate)).format('DD/MMM/YYYY')}</span>
                                <span>-</span>
                                <span>{activity.rule.name}</span>
                            </li>
                        )
                    })
                }
                {
                    list.length === 0 &&
                    <li className="list-group-item" style={{ height: '150px' }}>
                        <div className="d-flex flex-row justify-content-center align-items-center h-100"><span>No Data Available</span></div>
                    </li>
                }
            </ul>
        </>
    )
}

export default ActivityList;