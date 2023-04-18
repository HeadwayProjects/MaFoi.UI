import React, { useEffect, useState } from 'react';
import { ActiveLink, navigate } from 'raviger';
import '../shared/Sidenav.css';
import * as auth from "../../backend/auth";
import { preventDefault } from '../../utils/common';
import Icon from '../common/Icon';

const SideNavMenu = [
    { id: 'dashboard', url: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { id: 'manage-users', url: '/manage-users', icon: 'users', label: 'Manage Users', disable: true },
    { id: 'input-module', url: '/input-modules', icon: 'input', label: 'Input Module', disable: true },
    { id: 'activities', url: '/activities', icon: 'activity', label: 'Activites' },
    { id: 'reports', url: '/reports', icon: 'report', label: 'Reports', disable: true }
];

const VendorPages = ['dashboard', 'activities'];

function Sidenav() {
    const [user] = useState(auth.getUserDetails());
    const [isVendor, setIsVendor] = useState(true);
    const [sideMenu, setSideMenu] = useState([]);

    useEffect(() => {
        if (user) {
            setIsVendor(['VendorAdmin', 'VendorUser'].includes(user.role))
        }
    }, [user]);

    useEffect(() => {
        setSideMenu(SideNavMenu.filter(x => isVendor ? VendorPages.includes(x.id) : true));
    }, [isVendor]);

    function NavItem({ children, url }) {
        function onClick(e) {
            preventDefault(e);
            navigate(url, { replace: true, state: null });
        }

        return (
            <ActiveLink href={url} activeClass="active" onClick={onClick}>
                {children}
            </ActiveLink>
        )
    }

    return (
        <>
            {
                user !== null ?
                    <ul className='sideNav m-0 p-0'>
                        {
                            sideMenu.map(item => {
                                return (
                                    <li key={item.id} >
                                        <button type="button" disabled={item.disable}>
                                            <NavItem url={item.url}>
                                                <span className="sidenav-item-icon">
                                                    <Icon name={item.icon} />
                                                </span>
                                                <span className="sidenav-item-label">{item.label}</span>
                                            </NavItem>
                                        </button>
                                    </li>
                                )
                            })
                        }
                    </ul> : null

            }
        </>
    );

}

export default Sidenav;