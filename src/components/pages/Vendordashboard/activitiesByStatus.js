import React, { Component } from "react";
import { Link } from "react-router-dom";
import NavTabs from "../../shared/NavTabs";
import ActivityList from "./activityList";
import * as api from "../../../backend/request";

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
        const tabs = this.props.tabs.map(tab => {
            return StatusTabs.find(status => status.value === tab);
        });
        this.setState({ tabs });
        this.setState({ status: tabs[0].value });
        this.updateTitle(tabs[0].value);
    }


    componentWillReceiveProps({ selectedCompany, selectedAssociateCompany, selectedLocation }) {
        if (selectedCompany && selectedLocation) {
            this.updateActivities({ selectedCompany, selectedAssociateCompany, selectedLocation, status: this.state.status });
        }
    }

    updateActivities({ selectedCompany, selectedAssociateCompany, selectedLocation, status }) {
        this.setState({ selectedCompany, selectedAssociateCompany, selectedLocation, status });
        api.get(`/api/ToDo/GetToDoByStatus?companyid=${selectedCompany}&associateCompanyId=${selectedAssociateCompany}&locationId=${selectedLocation}&status=${status}`).then(response => {
            if (response && response.data) {
                const length = (response.data || []).length;
                this.setState({ activites: (response.data || []).slice(0, 4) });
                this.setState({ count: length > 0 ? String(length).padStart(2, '0') : 0 });
            }
        });
    }

    onTabChange(status) {
        this.setState({ status, count: null, activites: [] });
        this.updateActivities({ ...this.state, status });
        this.updateTitle(status);
    }

    updateTitle(status) {
        const tab = StatusTabs.find(_status => _status.value === status) || {};
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
                                    <div className="text-center mb-3">
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
                                                <div className="text-primary d-flex justify-content-end fw-bold position-absolute" style={{right: '1rem'}}>
                                                    <Link to="">View All</Link>
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