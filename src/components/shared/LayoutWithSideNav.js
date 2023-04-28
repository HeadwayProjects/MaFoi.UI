import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Sidenav from "./Sidenav";
import * as auth from "../../backend/auth";
import 'react-toastify/dist/ReactToastify.css';
import './Toaster.css';
import "./Layout.css"
import { useIdleTimer } from "react-idle-timer";
import { navigate } from "raviger";
import { getBasePath } from "../../App";

function AuthProtector(props) {
    const [authToken] = useState(auth.getAuthToken());

    function logout() {
        auth.clearAuthToken();
        navigate(`${getBasePath()}/login`, { replace: true });
        window.location.reload();
    }

    useIdleTimer({
        onIdle: () => logout(),
        timeout: 20 * 60 * 1000, // In milliseconds,
        events: [
            'keydown',
            'mousedown'
        ]
    })

    useEffect(() => {
        if (!authToken) {
            logout();
        }
    }, [authToken]);

    return (
        <>{
            authToken ? props.children : null
        }</>
    )
}

function LayoutWithSideNav(props) {
    return (
        <AuthProtector>
            <Navbar />
            <div className="page-layout-container">
                <div className="sidenav-container">
                    <Sidenav />
                </div>
                <div className="main-container">
                    {props.children}
                </div>
            </div>
        </AuthProtector>
    )
}

export default LayoutWithSideNav;