import React, { useState } from 'react';
import dayjs from 'dayjs';
import "./Navbar.css";
import logo from '../../assets/img/header-logo.png';
import * as auth from '../../backend/auth';
import { preventDefault } from '../../utils/common';

function Navbar() {
    const [user] = useState(auth.getUserDetails() || {});

    function logout(event) {
        preventDefault(event)
        auth.clearAuthToken();
        window.location.replace('/login');
    }

    return (
        <div className='container-full fixed-top bg-white header-navbar-container'>
            <nav className="navbar navbar-expand-lg border-bottom py-1">
                <div className="container-fluid">
                    <div className="navbar-brand p-0"><img src={logo} alt="Logo" width="140" /></div>
                    <div className="nav-item d-flex">
                        <ul className="navbar-nav">
                            <div className="nav-item dropdown">
                                <div className="nav-link dropdown-toggle border rounded text-black" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <span className='userNameL rounded-circle fw-semibold text-center text-white'>{(user.name || '').charAt(0)}</span> {user.name}
                                </div>
                                <div className="dropdown-menu">
                                    <div className="dropdown-item"><span className="fw-bold">Role: </span>{user.role}</div>
                                    <div className="dropdown-item" to="">Settings</div>
                                    <div className="dropdown-item" to="">Change Password</div>
                                    <hr className="dropdown-divider" />
                                    <a className="dropdown-item" href="/" onClick={logout}>Logout</a>
                                </div>
                            </div>
                        </ul>
                        <ul className="d-flex row disabled mb-0 text-muted ps-2 m-0 align-items-center align-content-center">
                            <span className='last-login-time'>Last Login Time</span>
                            <small className='p-0 m-0 text-center'><span>{dayjs(new Date(user.lastlogindate)).format('hh:mm A')}</span></small>
                            <small className='p-0 m-0 text-center'><span>{dayjs(new Date(user.lastlogindate)).format('DD/MM/YYYY')}</span></small>
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

export default Navbar;