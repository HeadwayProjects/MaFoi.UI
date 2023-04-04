import { faChevronCircleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import * as auth from "../../../backend/auth";
import "./AuditorModule.css";
import { useGetAuditorLimeStatus } from "../../../backend/auditor";
import Performance from "./Performance"

const StatusMapping = [
    { label: 'Total Vendors', key: 'totalVendors', color: 'grey', value: 'ActivitySaved' },
    { label: 'Audit To Be Done This Month', key: 'auditToBeDoneForThisMonth', color: 'yellow', value: 'Pending' },
    { label: 'Audit Approval Pending', key: 'auditApprovalPending', color: 'red', value: 'Overdue' },
    { label: 'Vendors Not Submitted', key: 'vendorsNotSubmitted', color: 'yellow', value: 'Submitted' }
]


function AuditorPerformance() {
    const user = auth.getUserDetails() || {};
    const { limeStatus } = useGetAuditorLimeStatus(user.userid);

    function viewActivities(status) {
        console.log(status);
    }
    return (
        <div>
            <div className="mx-0 my-3 row">
                {
                    StatusMapping.map(status => {
                        return (
                            <div className="col-6 col-md-3 mb-3" key={status.key}>
                                <div className={`card cardCount ${status.color} auditor-status-card`}>
                                    <div className="card-body">
                                        <div className="row d-flex align-items-center">
                                            <div className="col-7 px-0 py-1">
                                                <label>{status.label}</label>
                                            </div>
                                            <div className="col-3 px-0 py-1">
                                                <h3 className="p-0 m-0">({(limeStatus || {})[status.key] || 0})</h3>
                                            </div>
                                            <div className="col-2 px-0 py-1">
                                                <span style={{ zoom: 1.5, cursor: 'pointer', background: 'transparent' }}
                                                    onClick={() => viewActivities(status.value)}>
                                                    <FontAwesomeIcon className={status.color} icon={faChevronCircleRight} />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>

            <div className="row m-0">
                <div className="col-md-6">
                    <Performance current={true} />
                </div>

                <div className="col-md-6">
                    <Performance current={false} />
                </div>
            </div>
        </div>
    );
}

export default AuditorPerformance;