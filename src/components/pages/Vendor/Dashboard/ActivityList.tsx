import React from "react";
import dayjs from "dayjs";
import { STATUS_MAPPING } from "../../../common/Constants";
import Icon from "../../../common/Icon";
import { ACTIVITY_TYPE_ICONS } from "../../../../utils/constants";

function StatusTmp({ status }: any) {
    return (
        <span className={`status-${status}`}>{status}</span>
    )
}

function ActivityList({ list }: any) {
    return (
        <>
            <ul className="list-group overflow-hidden" style={{ height: '160px' }}>
                {
                    list.map((activity: any) => {
                        return (
                            <li className="list-group-item" key={activity.id} style={{ height: '40px' }}>
                                <Icon name={ACTIVITY_TYPE_ICONS[activity.auditted]} text={activity.auditted} className="me-2" />
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