import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Sidenav from "./Sidenav";
import * as auth from "../../backend/auth";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './Toaster.css';
import "./Layout.css"
import { useIdleTimer } from "react-idle-timer";

function AuthProtector(props) {
  const [authToken] = useState(auth.getAuthToken());

  function logout() {
    auth.clearAuthToken();
    window.location.replace('/login');
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
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </AuthProtector>
  )
}

export default LayoutWithSideNav;