// import { faChevronCircleRight } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import * as auth from "../../../backend/auth";
import "./AuditorModule.css";
import { useGetAuditorLimeStatus } from "../../../backend/auditor";
import Performance from "./Performance"

const StatusMapping = [
    { label: 'Total Vendors', key: 'totalVendors', className: 'gray-bg', value: 'ActivitySaved' },
    // { label: 'Audit To Be Done This Month', key: 'auditToBeDoneForThisMonth', color: 'yellow', value: 'Pending' },
    { label: 'Audit Approval Pending', key: 'auditApprovalPending', className: 'medium-red-bg', value: 'Overdue' },
    { label: 'Vendors Not Submitted', key: 'vendorsNotSubmitted', className: 'yellow-bg', value: 'Submitted' }
]

function AuditorPerformance() {
    const user = auth.getUserDetails() || {};
    const { limeStatus } = useGetAuditorLimeStatus(user.userid);

    return (
        <div className="d-flex flex-row my-4 mx-3 card shadow p-4">
            <div className="col-1"></div>
            <div className="col-2">
                <div className="col-12 h-100">
                    <div className="d-flex flex-column justify-content-between h-100">
                        {
                            StatusMapping.map(status => {
                                return (
                                    <div className={`card cardCount auditor-status-card border-0 p-2 ${status.className}`} key={status.key}>
                                        <div className="card-body py-1">
                                            <div className="row d-flex flex-column align-items-center justify-content-between h-100 fw-bold">
                                                <label className="text-center px-3 text-md">{status.label}</label>
                                                <div className="text-lg text-center">{(limeStatus || {})[status.key] || 0}</div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
            <div className="col-1"></div>
            <div className="col-7">
                <div className="col-12">
                    <Performance />
                </div>
            </div>
            <div className="col-1"></div>
        </div>
    );
}

export default AuditorPerformance;