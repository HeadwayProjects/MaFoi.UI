// import { faChevronCircleRight } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import * as auth from "../../../backend/auth";
import "./AuditorModule.css";
import { useGetAuditorLimeStatus } from "../../../backend/auditor";
import Performance from "./Performance"

const StatusMapping = [
    { label: 'Total Vendors', key: 'totalVendors', color: 'var(--light-green)', value: 'ActivitySaved' },
    // { label: 'Audit To Be Done This Month', key: 'auditToBeDoneForThisMonth', color: 'yellow', value: 'Pending' },
    { label: 'Audit Approval Pending', key: 'auditApprovalPending', color: 'var(--medium-red)', value: 'Overdue' },
    { label: 'Vendors Not Submitted', key: 'vendorsNotSubmitted', color: 'var(--yellow)', value: 'Submitted' }
]

function AuditorPerformance() {
    const user = auth.getUserDetails() || {};
    const { limeStatus } = useGetAuditorLimeStatus(user.userid);

    return (
        <div>
            <div className="mx-0 my-3 row">
                <div className="col-12 ">
                    <div className="d-flex flex-row justify-content-center card border-0 py-3">
                        <div className="d-flex flex-row">
                            {
                                StatusMapping.map(status => {
                                    return (
                                        <div className="card cardCount auditor-status-card mx-2 h-100" style={{ backgroundColor: status.color }} key={status.key}>
                                            <div className="card-body py-1">
                                                <div className="row d-flex flex-column align-items-center justify-content-end">
                                                    <label className="text-center px-3 text-md">{status.label}</label>
                                                    <div className="text-lg text-center">({(limeStatus || {})[status.key] || 0})</div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className="row m-0">
                <div className="col-12">
                    <Performance />
                </div>
            </div>
        </div>
    );
}

export default AuditorPerformance;