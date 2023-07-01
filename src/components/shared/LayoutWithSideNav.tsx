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

function AuthProtector(props: any) {
    const [authToken] = useState(auth.getAuthToken());

    function logout() {
        auth.clearAuthToken();
        navigate(`${getBasePath()}/`, { replace: true });
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
        <>
            {
                authToken ? props.children : null
            }
        </>
    )
}

function LayoutWithSideNav(props: any) {
    const [open, setOpen] = useState(false);

    return (
        <AuthProtector>
            <div className="main-conatiner" >
                <Navbar />
                < div className="page-layout-container" >
                    <div className={`sidenav-container ${open ? 'open' : ''}`} >
                        <Sidenav open={open} toggleSidenav={setOpen} />
                    </div>
                    < div className="main-container" >
                        {props.children}
                    </div>
                </div>
            </div>
        </AuthProtector>
    )
}

export default LayoutWithSideNav;