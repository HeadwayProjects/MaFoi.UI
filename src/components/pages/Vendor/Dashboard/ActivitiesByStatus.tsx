import React, { useEffect, useState } from "react";
import NavTabs from "../../../shared/NavTabs";
import ActivityList from "./ActivityList";
import * as api from "../../../../backend/request";
import "./dashboard.css";
import { preventDefault } from "../../../../utils/common";
import { navigate } from "raviger";
import { getBasePath } from "../../../../App";
import { ACTIVITY_TYPE } from "../../../../utils/constants";
import { useGetActivities } from "../../../../backend/masters";
import { useGetAllActivities } from "../../../../backend/query";
import { DEFAULT_PAYLOAD } from "../../../common/Table";

const StatusTabs = [
    { value: 'Overdue', label: 'Overdue' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Rejected', label: 'Rejected' },
    { value: 'Approved', label: 'Audited' }
]

function ActivitiesByStatus({ tabs, selectedCompany, selectedAssociateCompany, selectedLocation, children }: any) {
    const [statuses] = useState(tabs.map((tab: string) => {
        return StatusTabs.find(status => status.value === tab);
    }));
    const [status, setStatus] = useState(tabs[0]);
    const [count, setCount] = useState<any>(null);
    const [title, setTitle] = useState<any>(null);
    const [payload, setPayload] = useState<any>(null);
    const { activities, isFetching, total } = useGetAllActivities(payload, Boolean(payload));

    function viewActivities(e: any) {
        preventDefault(e);
        navigate(`${getBasePath()}/dashboard/activities`, {
            state: {
                company: selectedCompany,
                associateCompany: selectedAssociateCompany,
                location: selectedLocation,
                status,
                auditType: ACTIVITY_TYPE.AUDIT
            }
        });
    }

    useEffect(() => {
        if (selectedCompany && selectedAssociateCompany && selectedLocation && status) {
            setPayload({
                ...DEFAULT_PAYLOAD,
                pagination: { pageSize: 4, pageNumber: 1 },
                filters: [
                    { columnName: 'companyId', value: selectedCompany },
                    { columnName: 'associateCompanyId', value: selectedAssociateCompany },
                    { columnName: 'locationId', value: selectedLocation },
                    { columnName: 'status', value: status },
                ],
                sort: { columnName: "dueDate", order: "desc" }
            });
        }
    }, [selectedCompany, selectedAssociateCompany, selectedLocation, status]);

    useEffect(() => {
        if (!isFetching) {
            setCount(total > 0 ? String(total).padStart(2, '0') : 0);
            setTitle((StatusTabs.find(_status => _status.value === status) || {}).label);
        }
    }, [isFetching, total]);

    return (
        <>
            <div className="card todo-card shadow">
                <div className="card-body">
                    {
                        statuses &&
                        <NavTabs list={statuses} onTabChange={(tab: string) => setStatus(tab)}>
                            {children}
                        </NavTabs>
                    }

                    <div className="tab-content" id="VendorOverDuePendingContent">
                        <div className="tab-pane fade show active" role="tabpanel">
                            <div className="my-3">
                                <div className="text-center mb-3 dashboard-date-range-label">
                                    {
                                        title &&
                                        <strong className="text-primary">{count} {title}</strong>
                                    }
                                </div>
                                <div className="row m-0 card cardList border-0">
                                    <div className="card-body p-0">
                                        <ActivityList list={activities} />
                                        {
                                            activities.length > 0 &&
                                            <div className="text-primary d-flex justify-content-end fw-bold position-absolute" style={{ right: '1rem' }}>
                                                <a href="/dashboard/activities" onClick={viewActivities}>View All</a>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}

export default ActivitiesByStatus;