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
    const [role, setRole] = useState('');
    const [roles, setRoles] = useState<any[]>([]);
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

    function changeRole(_role: string) {
        const { role, pages } = auth.getUserDetails();
        const index = role.indexOf(_role);
        auth.setUserRole(_role, pages[index]);
        setTimeout(() => {
            navigate(`${getBasePath()}/`);
            window.location.reload();
        });
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
    }, [notifications]);

    useEffect(() => {
        if (showUser) {
            const _role = auth.getUserRole();
            setRole(_role);
            const { role } = auth.getUserDetails();
            if (typeof role === 'string' || role.length === 1) {
                setRoles([]);
            } else {
                setRoles(role.filter((x: string) => x !== _role));
            }
        }
    }, [showUser]);

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
                                                <div className="px-3 text-md fw-bold fst-italic">Role:</div>
                                                <div className="px-3 pb-3">{role}</div>
                                                {
                                                    roles.length > 0 &&
                                                    <>
                                                        <div className="px-3 text-md fw-bold fst-italic">Login As:</div>
                                                        {
                                                            roles.map((_role: string) => {
                                                                return (
                                                                    <div className="dropdown-item" key={_role} onClick={() => changeRole(_role)}>{_role}</div>
                                                                )
                                                            })
                                                        }
                                                    </>
                                                }
                                                <hr className="dropdown-divider" />
                                                <a className="dropdown-item" href="/" onClick={changePassword}>Change Password</a>
                                                <a className="dropdown-item" href="/" onClick={logout}>Logout</a>
                                            </div>
                                        </div>
                                    </ul>
                                    <img src={mofoi_logo} width={'50px'} height={'50px'} alt='Mofoi Logo' />
                                </div>
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