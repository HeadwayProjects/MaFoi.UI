import React, { Component } from "react";
import Navbar from "./Navbar";
import Sidenav from "./Sidenav";
import * as auth from "../../backend/auth";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './Toaster.css';
import "./Layout.css"

class AuthProtector extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const authToken = auth.getAuthToken()
    this.setState({ authToken });
    if (!authToken) {
      window.location.replace('/login');
    }
  }

  render() {
    return (
      <>
        {
          this.state.authToken ? this.props.children : null
        }
      </>
    )
  }

}

class LayoutWithSideNav extends Component {
  render() {
    return (
      <AuthProtector>
        <Navbar />
        <div className="page-layout-container">
          <div className="sidenav-container">
            <Sidenav />
          </div>
          <div className="main-container">
            {this.props.children}
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
}

export default LayoutWithSideNav;