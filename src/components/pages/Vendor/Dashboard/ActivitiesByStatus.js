import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NavTabs from "../../../shared/NavTabs";
import ActivityList from "./ActivityList";
import * as api from "../../../../backend/request";
import "./dashboard.css";

const StatusTabs = [
    { value: 'Overdue', label: 'Overdue' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Rejected', label: 'Rejected' },
    { value: 'Approved', label: 'Audited' }
]

function ActivitiesByStatus({ tabs, selectedCompany, selectedAssociateCompany, selectedLocation, children }) {
    const [statuses] = useState(tabs.map(tab => {
        return StatusTabs.find(status => status.value === tab);
    }));
    const [status, setStatus] = useState(tabs[0]);
    const [activities, setActivities] = useState([]);
    const [count, setCount] = useState(null);
    const [title, setTitle] = useState(null);

    function updateActivities() {
        setActivities([]);
        setCount(null);
        setTitle(null);
        if (selectedCompany && selectedAssociateCompany && selectedLocation) {
            const request = [
                `companyid=${selectedCompany}`,
                `associateCompanyId=${selectedAssociateCompany}`,
                `locationId=${selectedLocation}`,
                `status=${status}`
            ];
            api.get(`/api/ToDo/GetToDoByStatus?${request.join('&')}`).then(response => {
                const length = (response.data || []).length;
                setActivities((response.data || []).slice(0, 4));
                setCount(length > 0 ? String(length).padStart(2, '0') : 0);
                setTitle((StatusTabs.find(_status => _status.value === status) || {}).label);
            });
        }
    }


    useEffect(() => {
        if (selectedCompany && selectedAssociateCompany && selectedLocation) {
            updateActivities();
        }
    }, [selectedCompany, selectedAssociateCompany, selectedLocation]);

    useEffect(() => {
        if (status) {
            updateActivities();
        }
    }, [status]);

    return (
        <>
            <div className="card">
                <div className="card-body">
                    {
                        statuses &&
                        <NavTabs list={statuses} onTabChange={(tab) => setStatus(tab)}>
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
                                                <Link to="/dashboard/activities">View All</Link>
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