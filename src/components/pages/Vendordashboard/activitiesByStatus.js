import React, { Component } from "react";
import { Link } from "react-router-dom";
import NavTabs from "../../shared/NavTabs";
import ActivityList from "./activityList";
import * as api from "../../../backend/request";
import "./vendordashboard.css";

const StatusTabs = [
    { value: 'Overdue', label: 'Overdue' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Rejected', label: 'Rejected' },
    { value: 'Approved', label: 'Audited' }
]

class ActivitiesByStatus extends Component {
    constructor(props) {
        super(props);
        this.state = { activites: [] };
    }

    componentDidMount() {
        if (!this.mountDone) {
            this.mountDone = true;
            const tabs = this.props.tabs.map(tab => {
                return StatusTabs.find(status => status.value === tab);
            });
            this.setState({ tabs, status: tabs[0].value });
        }
    }


    componentWillReceiveProps({ selectedCompany, selectedAssociateCompany, selectedLocation }) {
        if (selectedCompany && selectedLocation && (selectedCompany !== this.state.selectedCompany ||
            selectedAssociateCompany !== this.state.selectedAssociateCompany ||
            selectedLocation !== this.state.selectedLocation)) {
            this.setState({ selectedCompany, selectedAssociateCompany, selectedLocation }, this.updateActivities);
        }
    }

    updateActivities() {
        const request = [
            `companyid=${this.state.selectedCompany}`,
            `associateCompanyId=${this.state.selectedAssociateCompany}`,
            `locationId=${this.state.selectedLocation}`,
            `status=${this.state.status}`
        ];
        api.get(`/api/ToDo/GetToDoByStatus?${request.join('&')}`).then(response => {
            const length = (response.data || []).length;
            this.setState({
                activites: (response.data || []).slice(0, 4),
                count: length > 0 ? String(length).padStart(2, '0') : 0
            });
            this.updateTitle();
        });
    }

    onTabChange(status) {
        this.setState({ status, count: null, activites: [], title: null }, this.updateActivities);
    }

    updateTitle() {
        const tab = StatusTabs.find(_status => _status.value === this.state.status) || {};
        this.setState({ title: tab.label });
    }

    render() {
        return (
            <>
                <div className="card">
                    <div className="card-body">
                        {
                            this.state.tabs &&
                            <NavTabs list={this.state.tabs} onTabChange={this.onTabChange.bind(this)}>
                                {this.props.children}
                            </NavTabs>
                        }

                        <div className="tab-content" id="VendorOverDuePendingContent">
                            <div className="tab-pane fade show active" role="tabpanel">
                                <div className="my-3">
                                    <div className="text-center mb-3 dashboard-date-range-label">
                                        {
                                            this.state.title &&
                                            <strong className="text-primary">{this.state.count} {this.state.title}</strong>
                                        }
                                    </div>
                                    <div className="row m-0 card cardList border-0">
                                        <div className="card-body p-0">
                                            <ActivityList list={this.state.activites} />
                                            {
                                                this.state.activites.length > 0 &&
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
}

export default ActivitiesByStatus;