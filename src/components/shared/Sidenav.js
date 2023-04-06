import React, { useEffect, useState } from 'react';
import { ActiveLink } from 'raviger';
import '../shared/Sidenav.css';
import * as auth from "../../backend/auth";

function Sidenav() {
    const [user] = useState(auth.getUserDetails());
    const [isVendor, setIsVendor] = useState(true);

    useEffect(() => {
        if (user) {
            setIsVendor(['VendorAdmin', 'VendorUser'].includes(user.role))
        }
    }, [user])

    function NavItem({ children, url }) {
        return (
            <ActiveLink href={url} activeClass="active">
                {children}
            </ActiveLink>
        )
    }

    return (
        <>
            {
                user !== null ?
                    <ul className='sideNav m-0 p-0'>
                        <li>
                            <NavItem url="/dashboard">
                                <span className="sidenav-item-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="3" y="3" width="8" height="8" rx="3" />
                                        <rect x="3" y="13" width="8" height="8" rx="3" />
                                        <rect x="13" y="3" width="8" height="8" rx="3" />
                                        <rect x="13" y="13" width="8" height="8" rx="3" />
                                    </svg>
                                </span>
                                <span className="sidenav-item-label">Dashboard</span>
                            </NavItem>
                        </li>
                        {
                            !isVendor &&
                            <>
                                <li>
                                    <NavItem url="/manage-users">
                                        <span className="sidenav-item-icon">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 5.5C12.9283 5.5 13.8185 5.86875 14.4749 6.52513C15.1313 7.1815 15.5 8.07174 15.5 9C15.5 9.92826 15.1313 10.8185 14.4749 11.4749C13.8185 12.1313 12.9283 12.5 12 12.5C11.0717 12.5 10.1815 12.1313 9.52513 11.4749C8.86875 10.8185 8.5 9.92826 8.5 9C8.5 8.07174 8.86875 7.1815 9.52513 6.52513C10.1815 5.86875 11.0717 5.5 12 5.5ZM5 8C5.56 8 6.08 8.15 6.53 8.42C6.38 9.85 6.8 11.27 7.66 12.38C7.16 13.34 6.16 14 5 14C4.20435 14 3.44129 13.6839 2.87868 13.1213C2.31607 12.5587 2 11.7956 2 11C2 10.2044 2.31607 9.44129 2.87868 8.87868C3.44129 8.31607 4.20435 8 5 8ZM19 8C19.7956 8 20.5587 8.31607 21.1213 8.87868C21.6839 9.44129 22 10.2044 22 11C22 11.7956 21.6839 12.5587 21.1213 13.1213C20.5587 13.6839 19.7956 14 19 14C17.84 14 16.84 13.34 16.34 12.38C17.2119 11.2544 17.6166 9.8362 17.47 8.42C17.92 8.15 18.44 8 19 8ZM5.5 18.25C5.5 16.18 8.41 14.5 12 14.5C15.59 14.5 18.5 16.18 18.5 18.25V20H5.5V18.25ZM0 20V18.5C0 17.11 1.89 15.94 4.45 15.6C3.86 16.28 3.5 17.22 3.5 18.25V20H0ZM24 20H20.5V18.25C20.5 17.22 20.14 16.28 19.55 15.6C22.11 15.94 24 17.11 24 18.5V20Z" />
                                            </svg>
                                        </span>
                                        <span className="sidenav-item-label">Manage Users</span>
                                    </NavItem>
                                </li>
                                <li>
                                    <NavItem url="/input-module">
                                        <span className="sidenav-item-icon">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect x="3" y="3" width="8" height="8" rx="3" />
                                                <rect x="3" y="13" width="8" height="8" rx="3" />
                                                <rect x="13" y="3" width="8" height="8" rx="3" />
                                                <rect x="13" y="13" width="8" height="8" rx="3" />
                                            </svg>
                                        </span>
                                        <span className="sidenav-item-label">Input Module</span>
                                    </NavItem>
                                </li>
                            </>
                        }

                        <li>
                            <NavItem url="/activities">
                                <span className="sidenav-item-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M13.75 2H10.25C9.69656 2.00002 9.16255 2.20401 8.75004 2.57297C8.33754 2.94194 8.07549 3.44999 8.014 4H6.25C5.65326 4 5.08097 4.23705 4.65901 4.65901C4.23705 5.08097 4 5.65326 4 6.25V19.75C4 20.3467 4.23705 20.919 4.65901 21.341C5.08097 21.7629 5.65326 22 6.25 22H17.75C18.0455 22 18.3381 21.9418 18.611 21.8287C18.884 21.7157 19.1321 21.5499 19.341 21.341C19.5499 21.1321 19.7157 20.884 19.8287 20.611C19.9418 20.3381 20 20.0455 20 19.75V6.25C20 5.95453 19.9418 5.66194 19.8287 5.38896C19.7157 5.11598 19.5499 4.86794 19.341 4.65901C19.1321 4.45008 18.884 4.28434 18.611 4.17127C18.3381 4.0582 18.0455 4 17.75 4H15.986C15.9245 3.44999 15.6625 2.94194 15.25 2.57297C14.8375 2.20401 14.3034 2.00002 13.75 2ZM10.25 3.5H13.75C13.9489 3.5 14.1397 3.57902 14.2803 3.71967C14.421 3.86032 14.5 4.05109 14.5 4.25C14.5 4.44891 14.421 4.63968 14.2803 4.78033C14.1397 4.92098 13.9489 5 13.75 5H10.25C10.0511 5 9.86032 4.92098 9.71967 4.78033C9.57902 4.63968 9.5 4.44891 9.5 4.25C9.5 4.05109 9.57902 3.86032 9.71967 3.71967C9.86032 3.57902 10.0511 3.5 10.25 3.5ZM17.03 11.03L11.53 16.53C11.3894 16.6705 11.1988 16.7493 11 16.7493C10.8012 16.7493 10.6106 16.6705 10.47 16.53L7.97 14.03C7.89631 13.9613 7.83721 13.8785 7.79622 13.7865C7.75523 13.6945 7.73319 13.5952 7.73141 13.4945C7.72963 13.3938 7.74816 13.2938 7.78588 13.2004C7.8236 13.107 7.87974 13.0222 7.95096 12.951C8.02218 12.8797 8.10701 12.8236 8.2004 12.7859C8.29379 12.7482 8.39382 12.7296 8.49452 12.7314C8.59522 12.7332 8.69454 12.7552 8.78654 12.7962C8.87854 12.8372 8.96134 12.8963 9.03 12.97L11 14.94L15.97 9.97C16.0387 9.89631 16.1215 9.83721 16.2135 9.79622C16.3055 9.75523 16.4048 9.73318 16.5055 9.73141C16.6062 9.72963 16.7062 9.74816 16.7996 9.78588C16.893 9.8236 16.9778 9.87974 17.049 9.95096C17.1203 10.0222 17.1764 10.107 17.2141 10.2004C17.2518 10.2938 17.2704 10.3938 17.2686 10.4945C17.2668 10.5952 17.2448 10.6945 17.2038 10.7865C17.1628 10.8785 17.1037 10.9613 17.03 11.03Z" />
                                    </svg>
                                </span>
                                <span className="sidenav-item-label">Task Management</span>
                            </NavItem>
                        </li>
                        {
                            !isVendor &&
                            <li>
                                <NavItem url="/reports">
                                    <span className="sidenav-item-icon">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M7.20005 2.3999C6.56353 2.3999 5.95308 2.65276 5.50299 3.10285C5.05291 3.55293 4.80005 4.16338 4.80005 4.7999V19.1999C4.80005 19.8364 5.05291 20.4469 5.50299 20.897C5.95308 21.347 6.56353 21.5999 7.20005 21.5999H16.8C17.4366 21.5999 18.047 21.347 18.4971 20.897C18.9472 20.4469 19.2 19.8364 19.2 19.1999V8.8967C19.1999 8.26024 18.947 7.64989 18.4968 7.1999L14.4 3.1031C13.9501 2.65298 13.3397 2.40004 12.7032 2.3999H7.20005ZM9.60005 14.3999C9.60005 14.0816 9.47362 13.7764 9.24858 13.5514C9.02353 13.3263 8.71831 13.1999 8.40005 13.1999C8.08179 13.1999 7.77656 13.3263 7.55152 13.5514C7.32648 13.7764 7.20005 14.0816 7.20005 14.3999V17.9999C7.20005 18.3182 7.32648 18.6234 7.55152 18.8484C7.77656 19.0735 8.08179 19.1999 8.40005 19.1999C8.71831 19.1999 9.02353 19.0735 9.24858 18.8484C9.47362 18.6234 9.60005 18.3182 9.60005 17.9999V14.3999ZM12 10.7999C12.3183 10.7999 12.6235 10.9263 12.8486 11.1514C13.0736 11.3764 13.2 11.6816 13.2 11.9999V17.9999C13.2 18.3182 13.0736 18.6234 12.8486 18.8484C12.6235 19.0735 12.3183 19.1999 12 19.1999C11.6818 19.1999 11.3766 19.0735 11.1515 18.8484C10.9265 18.6234 10.8 18.3182 10.8 17.9999V11.9999C10.8 11.6816 10.9265 11.3764 11.1515 11.1514C11.3766 10.9263 11.6818 10.7999 12 10.7999ZM16.8 9.5999C16.8 9.28164 16.6736 8.97642 16.4486 8.75137C16.2235 8.52633 15.9183 8.3999 15.6 8.3999C15.2818 8.3999 14.9766 8.52633 14.7515 8.75137C14.5265 8.97642 14.4 9.28164 14.4 9.5999V17.9999C14.4 18.3182 14.5265 18.6234 14.7515 18.8484C14.9766 19.0735 15.2818 19.1999 15.6 19.1999C15.9183 19.1999 16.2235 19.0735 16.4486 18.8484C16.6736 18.6234 16.8 18.3182 16.8 17.9999V9.5999Z" />
                                        </svg>
                                    </span>
                                    <span className="sidenav-item-label">Reports</span>
                                </NavItem>
                            </li>
                        }
                    </ul> : null

            }
        </>
    );

}

export default Sidenav;