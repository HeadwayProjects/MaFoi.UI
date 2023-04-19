import React, { useEffect, useState } from 'react';
import { ActiveLink, navigate } from 'raviger';
import '../shared/Sidenav.css';
import * as auth from "../../backend/auth";
import { preventDefault } from '../../utils/common';
import Icon from '../common/Icon';

const SideNavMenu = [
    { id: 'dashboard', url: '/dashboard', icon: 'th', label: 'Dashboard' },
    {
        id: 'masters', url: '/masters/act', icon: 'crown', label: 'Masters', children: [
            { id: 'Act', url: '/masters/Act', label: 'Act' },
            { id: 'activity', url: '/masters/activity', label: 'Activity' },
            { id: 'rule', url: '/masters/rule', label: 'Rule' },
            { id: 'state', url: '/masters/state', label: 'State' },
            { id: 'city', url: '/masters/city', label: 'City' },
            { id: 'location', url: '/masters/location', label: 'Location' },
            { id: 'companies', url: '/masters/companies', label: 'Companies' }
        ]
    },
    { id: 'manage-users', url: '/manage-users', icon: 'users', label: 'Manage Users', disable: true },
    // { id: 'input-module', url: '/input-modules', icon: 'input', label: 'Input Module', disable: true },
    { id: 'activities', url: '/activities', icon: 'task', label: 'Activites' },
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

    function NavItem({ children, url, name, hasChild }) {
        const [isActive, setActive] = useState(false);
        const urlPath = window.location.pathname;
        function onClick(e) {
            preventDefault(e);
            if (!hasChild) {
                navigate(url, { replace: true, state: null });
            }
        }

        useEffect(() => {
            if (urlPath) {
                setActive(urlPath.includes(name))
            }
        }, [urlPath]);

        return (
            <ActiveLink href={url} onClick={onClick} className={isActive ? 'active' : ''}>
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
                                            <NavItem url={item.url} name={item.id} hasChild={(item.children || []).length > 0}>
                                                <div className='d-flex flex-row align-items-center w-100'>
                                                    {
                                                        item.icon &&
                                                        <span className="sidenav-item-icon">
                                                            <Icon name={item.icon} />
                                                        </span>
                                                    }
                                                    <span className="sidenav-item-label">{item.label}</span>
                                                </div>
                                                {
                                                    item.children &&
                                                    <div className='d-flex flex-column w-100 ps-3 justify-content-start children'>
                                                        {
                                                            item.children.map(child => (
                                                                <NavItem url={child.url} key={child.id} name={child.id}>
                                                                    <span className="sidenav-item-label">{child.label}</span>
                                                                </NavItem>
                                                            ))
                                                        }
                                                    </div>
                                                }
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