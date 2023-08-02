import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import "./Navbar.css";
import logo from '../../assets/img/header-logo.png';
import mofoi_logo from '../../assets/img/MOFOI_LOGO.png'
import * as auth from '../../backend/auth';
import { preventDefault } from '../../utils/common';
import ChangePasswordModal from '../pages/Authenticate/ChangePasswordModal';
import ConfirmModal from '../common/ConfirmModal';
import { navigate } from 'raviger';
import { getBasePath } from '../../App';
import Icon from '../common/Icon';
import NotificationsModal from './NotificationsModal';

function Navbar({ showUser = true }) {
    const [user] = useState(auth.getUserDetails() || {});
    const [changePwd, setChangePwd] = useState(false);
    const [newUser, setNewUser] = useState(false);
    const [unreadNotifications, setUnreadNotifications] = useState<any>([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications] = useState([]);

    function logout(event: any) {
        preventDefault(event)
        auth.clearUserSession();
        setTimeout(() => {
            navigate(`${getBasePath()}/`);
            window.location.reload();
        });
    }

    function changePassword(event: any) {
        preventDefault(event);
        setChangePwd(true);
    }

    useEffect(() => {
        if (user) {
            const _user = auth.getUserDetails();
            setNewUser(_user && !_user.lastlogindate);
        }
    }, [user]);

    useEffect(() => {
        if (notifications) {
            setUnreadNotifications(notifications.filter((x: any) => !x.isRead).length);
        }

    }, [notifications])

    return (
        <>
            <div className='container-full bg-white header-navbar-container shadow'>
                <nav className="navbar navbar-expand-lg border-bottom py-1">
                    <div className="container-fluid">
                        <div className="navbar-brand p-0"><img src={logo} alt="Logo" width="140" /></div>
                        {
                            showUser &&
                            <>
                                <div className="nav-item d-flex align-items-center">
                                    {
                                        (notifications || []).length > 0 &&
                                        <div className='p-2 position-relative'>
                                            <Icon name="notification" style={{ cursor: 'pointer' }} action={() => setShowNotifications(true)} />
                                            {
                                                unreadNotifications &&
                                                <span className="notification-badge">{unreadNotifications > 9 ? '9+' : unreadNotifications}</span>
                                            }
                                        </div>
                                    }
                                    <ul className="d-flex flex-column disabled mb-0 text-muted m-0 align-items-center align-content-center px-2">
                                        <span className='last-login-time filter-label'>Last Login Time</span>
                                        <small className='p-0 m-0 text-center'><span>{dayjs(new Date(user.lastlogindate)).format('DD/MM/YYYY hh:mm A')}</span></small>
                                    </ul>
                                    <ul className="navbar-nav px-2">
                                        <div className="nav-item dropdown">
                                            <div className="nav-link dropdown-toggle border rounded text-black" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                <span className='userNameL rounded-circle fw-semibold text-center text-white'>{(user.name || '').charAt(0)}</span> {user.name}
                                            </div>
                                            <div className="dropdown-menu">
                                                <div className="dropdown-item"><span className="fw-bold">Role: </span>{user.role}</div>
                                                {/* <div className="dropdown-item" to="">Settings</div> */}
                                                <a className="dropdown-item" href="/" onClick={changePassword}>Change Password</a>
                                                <hr className="dropdown-divider" />
                                                <a className="dropdown-item" href="/" onClick={logout}>Logout</a>
                                            </div>
                                        </div>
                                    </ul>
                                    <img src={mofoi_logo} width={'50px'} height={'50px'} alt='Mofoi Logo' />
                                </div>
                                {/* <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navTop" aria-controls="navTop" aria-expanded="false" aria-label="Toggle navigation">
                                    <span className="navbar-toggler-icon"></span>
                                </button> */}
                            </>
                        }
                    </div>
                </nav>
            </div>
            {changePwd && <ChangePasswordModal onClose={() => setChangePwd(false)} />}
            {
                newUser &&
                <ConfirmModal title={`Hello ${user.name}`} message={'You are logged in with a temporary password. Would you like to change it?'}
                    onSubmit={() => { setChangePwd(true) }} onClose={() => setNewUser(false)} yesText='Sure' noText='Maybe later' />
            }
            {
                showNotifications &&
                <NotificationsModal notifications={notifications}
                    onDismiss={() => setShowNotifications(false)} onSubmit={() => {
                        setShowNotifications(false);
                        // refetch();
                    }} />
            }
        </>
    );
}

export default Navbar;