import dayjs from 'dayjs';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import "./Navbar.css";

import logo from '../../assets/img/header-logo.png';
import * as auth from '../../backend/auth';


export class Navbar extends Component {
    constructor(props) {
        super(props)
        this.state = {};
    }

    componentDidMount() {
        const user = auth.getUserDetails() || {};
        console.log(user);
        this.setState({ name: user.name, role: user.role, lastLogin: new Date(user.lastlogindate) });
    }

    logout(event) {
        event.preventDefault();
        auth.clearAuthToken();
        window.location.replace('/login');
    }

    render() {
        return (
            <div className='container-full fixed-top bg-white header-navbar-container'>
                <nav className="navbar navbar-expand-lg border-bottom py-1">
                    <div className="container-fluid">

                        <div className="navbar-brand p-0"><img src={logo} alt="Logo" width="140" /></div>

                        <div className="nav-item d-flex">
                            <ul className="navbar-nav">
                                <div className="nav-item dropdown">
                                    <Link className="nav-link dropdown-toggle border rounded text-black" to="" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <span className='userNameL rounded-circle fw-semibold text-center text-white'>S</span> {this.state.name}
                                    </Link>
                                    <div className="dropdown-menu">
                                        <div className="dropdown-item"><span className="fw-bold">Role: </span>{this.state.role}</div>
                                        <Link className="dropdown-item" to="">Settings</Link>
                                        <Link className="dropdown-item" to="">Change Password</Link>
                                        <hr className="dropdown-divider" />
                                        <Link className="dropdown-item" to="" onClick={this.logout.bind(this)}>Logout</Link>
                                    </div>
                                </div>
                            </ul>
                            <ul className="d-flex row disabled mb-0 text-muted ps-2 m-0 align-items-center align-content-center">
                                <small className='p-0 m-0 text-center'><span>{dayjs(this.state.lastLogin).format('hh:mm A')}</span></small>
                                <small className='p-0 m-0 text-center'><span>{dayjs(this.state.lastLogin).format('DD/MM/YYYY')}</span></small>
                            </ul>
                        </div>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navTop" aria-controls="navTop" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>

                    </div>
                </nav>
            </div>
        );
    }
}

export default Navbar;