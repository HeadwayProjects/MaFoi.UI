import React, { Component } from "react";
import NavTabs from "../../shared/NavTabs";
import * as api from "../../../backend/request";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import ActivityList from "./activityList";

const TodosTabs = [
    { value: 'Today', label: 'Today' },
    { value: 'ThisWeek', label: 'This Week' },
    { value: 'ThisMonth', label: 'This Month' }
];

const UpcomingTabs = [
    { value: 'NextWeek', label: 'Next Week' },
    { value: 'NextMonth', label: 'Next Month' },
    { value: 'NextQuarter', label: 'Next Year' }
];


export class Todo extends Component {
    constructor(props) {
        super(props);
        this.state = { todos: [] };
    }

    componentDidMount() {
        this.setState({ title: this.props.upcoming ? 'Upcoming' : 'To-Do' });
        this.setState({ tabs: this.props.upcoming ? UpcomingTabs : TodosTabs });
        this.setState({ frequency: this.props.upcoming ? UpcomingTabs[0].value : TodosTabs[0].value });
    }

    componentWillReceiveProps({ selectedCompany, selectedAssociateCompany, selectedLocation }) {
        if (selectedCompany && selectedLocation) {
            this.updateTodos({ selectedCompany, selectedAssociateCompany, selectedLocation, frequency: this.state.frequency });
        }
    }

    updateTodos({ selectedCompany, selectedAssociateCompany, selectedLocation, frequency }) {
        this.setState({ selectedCompany, selectedAssociateCompany, selectedLocation, frequency });
        api.get(`/api/ToDo/GetToDoByCompanyLocation?companyid=${selectedCompany}&associateCompanyId=${selectedAssociateCompany}&locationId=${selectedLocation}&frequency=${frequency}`).then(response => {
            if (response && response.data) {
                this.setState({ todos: (response.data || []).slice(0, 4), count: (response.data || []).length });
            }
        });
    }

    getLabel() {
        if (this.state.frequency === 'Today') {
            return dayjs(new Date()).format('DD-MMM-YYYY');
        }
        return this.state.frequency;
    }

    onTabChange(frequency) {
        this.setState({ frequency, count: null, todos: [] });
        this.updateTodos({ ...this.state, frequency });
        // this.updateTitle(frequency);
    }

    render() {
        return (
            <>
                <div className="card">
                    <div className="card-header bg-white border-0 underline text-appprimary fw-semibold fs-5 d-flex align-items-center">
                        <div>
                            {
                                this.props.upcoming ?
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M17 3H21C21.2652 3 21.5196 3.10536 21.7071 3.29289C21.8946 3.48043 22 3.73478 22 4V20C22 20.2652 21.8946 20.5196 21.7071 20.7071C21.5196 20.8946 21.2652 21 21 21H3C2.73478 21 2.48043 20.8946 2.29289 20.7071C2.10536 20.5196 2 20.2652 2 20V4C2 3.73478 2.10536 3.48043 2.29289 3.29289C2.48043 3.10536 2.73478 3 3 3H7V1H9V3H15V1H17V3ZM4 9V19H20V9H12H4Z" fill="#2965AD" />
                                        <path d="M8.69835 17L12.0272 14L8.69835 11L8 11.6294L10.6305 14L8 16.3706L8.69835 17Z" fill="#2965AD" />
                                        <path d="M16 14L12.6712 11L11.9728 11.6294L14.6033 14L11.9728 16.3706L12.6712 17L16 14Z" fill="#2965AD" />
                                    </svg>
                                    :
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M17 3H21C21.2652 3 21.5196 3.10536 21.7071 3.29289C21.8946 3.48043 22 3.73478 22 4V20C22 20.2652 21.8946 20.5196 21.7071 20.7071C21.5196 20.8946 21.2652 21 21 21H3C2.73478 21 2.48043 20.8946 2.29289 20.7071C2.10536 20.5196 2 20.2652 2 20V4C2 3.73478 2.10536 3.48043 2.29289 3.29289C2.48043 3.10536 2.73478 3 3 3H7V1H9V3H15V1H17V3ZM4 9V19H20V9H4ZM6 11H8V13H6V11ZM6 15H8V17H6V15ZM10 11H18V13H10V11ZM10 15H15V17H10V15Z" fill="#2965AD" />
                                    </svg>
                            }
                        </div>
                        <div className="mx-2">
                            {this.state.title}
                        </div>
                    </div>
                    <div className="card-body pt-1">
                        <h5 className="text-center mb-3 fw-semibold"><Link to="">{this.state.count || 0} Activities</Link></h5>
                        {
                            this.state.tabs &&
                            <NavTabs list={this.state.tabs} onTabChange={this.onTabChange.bind(this)} />
                        }
                        <div className="tab-content">
                            <div className="tab-pane fade show active" role="tabpanel">
                                <div className="my-3">
                                    <div className="text-center mb-3">
                                        <strong className="text-primary">({this.getLabel()})</strong>
                                    </div>

                                    <div className="row m-0 card cardList border-0">
                                        <div className="card-body p-0" >
                                            <ActivityList list={this.state.todos} />
                                            <div className="text-primary d-flex justify-content-end fw-bold position-absolute" style={{right: '1rem'}}>
                                                {
                                                    this.state.todos.length > 0 &&
                                                    <Link to="/vendor-activity-todo">View All</Link>
                                                }
                                            </div>
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
