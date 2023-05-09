import React, { useEffect, useState } from 'react';
import { ActiveLink, navigate } from 'raviger';
import '../shared/Sidenav.css';
import * as auth from "../../backend/auth";
import { preventDefault } from '../../utils/common';
import Icon from '../common/Icon';
import { getBasePath } from '../../App';
import { ROLE_MAPPING } from '../../containers/AuthenticatedContent';

const SideNavMenu = [
    { id: 'dashboard', url: '/dashboard', icon: 'th', label: 'Dashboard' },
    {
        id: 'masters', url: '/masters/act', icon: 'crown', label: 'Masters', children: [
            { id: 'masters/law', url: '/masters/law', label: 'Law Category' },
            { id: 'masters/Act', url: '/masters/Act', label: 'Act' },
            { id: 'masters/activity', url: '/masters/activity', label: 'Activity' },
            { id: 'masters/rule', url: '/masters/rule', label: 'Rule' },
            { id: 'masters/state', url: '/masters/state', label: 'State' },
            { id: 'masters/city', url: '/masters/city', label: 'City' },
            // { id: 'masters/location', url: '/masters/location', label: 'Location' },
            // { id: 'masters/companies', url: '/masters/companies', label: 'Companies' },
            { id: 'masters/compliance', url: '/masters/compliance', label: 'Rule Compliance' },
            { id: 'masters/mapping', url: '/masters/mapping', label: 'Mappings' }
        ]
    },
    {
        id: 'companies', url: '/companies/list', icon: 'building', label: 'Companies', children: [
            { id: 'companies/list', url: '/companies/list', label: 'Manage Companies' },
            { id: 'companies/associateCompanies', url: '/companies/associateCompanies', label: 'Associate Companies' },
            { id: 'companies/locationMapping', url: '/companies/locationMapping', label: 'Location Mapping' },
            { id: 'companies/auditSchedule', url: '/companies/auditSchedule', label: 'Audit Schedule' },
            { id: 'companies/blockUnblock', url: '/companies/blockUnblock', label: 'Block Un-Block' }
        ]
    },
    {
        id: 'userManagement', url: '/userManagement/users', icon: 'users', label: 'User Management', children: [
            { id: 'userManagement/users', url: '/userManagement/users', label: 'Users' },
            { id: 'userManagement/mapping', url: '/userManagement/mapping', label: 'Mapping' },
        ]
    },
    { id: 'activities', url: '/activities', icon: 'task', label: 'Activities' },
    { id: 'reports', url: '/reports', icon: 'report', label: 'Reports', disable: true }
];

function Sidenav() {
    const [user] = useState(auth.getUserDetails());
    const [sideMenu, setSideMenu] = useState([]);

    useEffect(() => {
        if (user) {
            const pages = ROLE_MAPPING[user.role] || [];
            setSideMenu(SideNavMenu.filter(x => pages.includes(x.id)));
        }
    }, [user]);

    function NavItem({ children, url, name, hasChild, index, parentIndex }) {
        const [isActive, setActive] = useState(false);
        const urlPath = window.location.pathname;
        function onClick(e) {
            preventDefault(e);
            if (!hasChild) {
                navigate(`${getBasePath()}${url}`, { replace: true, state: null });
            }
        }

        useEffect(() => {
            if (urlPath) {
                setActive(urlPath.includes(name));
                if (urlPath === '/' && parentIndex === 0 && (index === undefined || index === 0)) {
                    setActive(true);
                }
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
                            sideMenu.map((item, index) => {
                                return (
                                    <li key={item.id} >
                                        <button type="button" disabled={item.disable}>
                                            <NavItem url={item.url} name={item.id} hasChild={(item.children || []).length > 0} parentIndex={index}>
                                                <div className='d-flex flex-row align-items-center w-100'>
                                                    {
                                                        item.icon &&
                                                        <span className="sidenav-item-icon">
                                                            <Icon name={item.icon} />
                                                        </span>
                                                    }
                                                    <span className="sidenav-item-label">{item.label}</span>
                                                </div>
                                            </NavItem>
                                            {
                                                item.children &&
                                                <div className='d-flex flex-column w-100 justify-content-start children'>
                                                    {
                                                        item.children.map((child, childIndex) => (
                                                            <NavItem url={child.url} key={child.id} name={child.id} index={childIndex} parentIndex={index}>
                                                                <span className="sidenav-item-label">{child.label}</span>
                                                            </NavItem>
                                                        ))
                                                    }
                                                </div>
                                            }
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