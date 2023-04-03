import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../shared/Sidenav.css';
import * as auth from "../../backend/auth";

class Sidenav extends Component {

    constructor(props) {
        super(props);
        this.state = { vendor: false, user: null };
    }

    componentDidMount() {
        const user = auth.getUserDetails();
        this.setState({ user, vendor: ['VendorAdmin', 'VendorUser'].includes(user.role) });
    }

    render() {
        return (
            <>
                {
                    this.state.user !== null ?
                        <ul className='sideNav m-0 p-0'>
                            {
                                !this.state.vendor &&
                                <>
                                    <li><Link className="active" to="/dashboard">Dashboard</Link></li>
                                    <li><Link className="" to="/manage-users">Manage Users</Link></li>
                                    <li><Link className="" to="/input-module">Input Module</Link></li>
                                    <li><Link className="" to="/task-management">Task Management</Link></li>
                                    <li><Link className="" to="/reports">reports</Link></li>
                                </>
                            }
                            {
                                this.state.vendor &&
                                <>
                                    <li>
                                        <Link className={window.location.pathname.includes('/vendor-dashboard') || window.location.pathname.includes('/dashboard/activities')? 'active' : ''} to="/vendor-dashboard">
                                            <span className="sidenav-item-icon">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect x="3" y="3" width="8" height="8" rx="3" />
                                                    <rect x="3" y="13" width="8" height="8" rx="3" />
                                                    <rect x="13" y="3" width="8" height="8" rx="3" />
                                                    <rect x="13" y="13" width="8" height="8" rx="3" />
                                                </svg>
                                            </span>
                                            <span className="sidenav-item-label">Dashboard</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className={window.location.pathname.includes('/vendor-activity-todo') ? 'active' : ''} to="/vendor-activity-todo">
                                            <span className="sidenav-item-icon">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M13.75 2H10.25C9.69656 2.00002 9.16255 2.20401 8.75004 2.57297C8.33754 2.94194 8.07549 3.44999 8.014 4H6.25C5.65326 4 5.08097 4.23705 4.65901 4.65901C4.23705 5.08097 4 5.65326 4 6.25V19.75C4 20.3467 4.23705 20.919 4.65901 21.341C5.08097 21.7629 5.65326 22 6.25 22H17.75C18.0455 22 18.3381 21.9418 18.611 21.8287C18.884 21.7157 19.1321 21.5499 19.341 21.341C19.5499 21.1321 19.7157 20.884 19.8287 20.611C19.9418 20.3381 20 20.0455 20 19.75V6.25C20 5.95453 19.9418 5.66194 19.8287 5.38896C19.7157 5.11598 19.5499 4.86794 19.341 4.65901C19.1321 4.45008 18.884 4.28434 18.611 4.17127C18.3381 4.0582 18.0455 4 17.75 4H15.986C15.9245 3.44999 15.6625 2.94194 15.25 2.57297C14.8375 2.20401 14.3034 2.00002 13.75 2ZM10.25 3.5H13.75C13.9489 3.5 14.1397 3.57902 14.2803 3.71967C14.421 3.86032 14.5 4.05109 14.5 4.25C14.5 4.44891 14.421 4.63968 14.2803 4.78033C14.1397 4.92098 13.9489 5 13.75 5H10.25C10.0511 5 9.86032 4.92098 9.71967 4.78033C9.57902 4.63968 9.5 4.44891 9.5 4.25C9.5 4.05109 9.57902 3.86032 9.71967 3.71967C9.86032 3.57902 10.0511 3.5 10.25 3.5ZM17.03 11.03L11.53 16.53C11.3894 16.6705 11.1988 16.7493 11 16.7493C10.8012 16.7493 10.6106 16.6705 10.47 16.53L7.97 14.03C7.89631 13.9613 7.83721 13.8785 7.79622 13.7865C7.75523 13.6945 7.73319 13.5952 7.73141 13.4945C7.72963 13.3938 7.74816 13.2938 7.78588 13.2004C7.8236 13.107 7.87974 13.0222 7.95096 12.951C8.02218 12.8797 8.10701 12.8236 8.2004 12.7859C8.29379 12.7482 8.39382 12.7296 8.49452 12.7314C8.59522 12.7332 8.69454 12.7552 8.78654 12.7962C8.87854 12.8372 8.96134 12.8963 9.03 12.97L11 14.94L15.97 9.97C16.0387 9.89631 16.1215 9.83721 16.2135 9.79622C16.3055 9.75523 16.4048 9.73318 16.5055 9.73141C16.6062 9.72963 16.7062 9.74816 16.7996 9.78588C16.893 9.8236 16.9778 9.87974 17.049 9.95096C17.1203 10.0222 17.1764 10.107 17.2141 10.2004C17.2518 10.2938 17.2704 10.3938 17.2686 10.4945C17.2668 10.5952 17.2448 10.6945 17.2038 10.7865C17.1628 10.8785 17.1037 10.9613 17.03 11.03Z" />
                                                </svg>
                                            </span>
                                            <span className="sidenav-item-label">Task Management</span>
                                        </Link>
                                    </li>
                                </>
                            }
                        </ul> : null

                }
            </>
        );
    }
}

export default Sidenav;