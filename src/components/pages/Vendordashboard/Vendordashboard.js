import React, { Component } from "react";
import { Link } from 'react-router-dom';

import Vendor from "./vendorPerformance";

export class Dashboard extends Component {
  render() {

    return (
      <div className="d-flex flex-column">
        <div className="d-flex  p-2 align-items-center pageHeading">
          <div className="ps-4">
            <h4 className="mb-0 ps-1">Vendor-Dashboard</h4>
          </div>
          <div className="d-flex align-items-end h-100">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0 d-flex justify-content-end">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item"><Link to="/vendordashboard">Dashboard</Link></li>
                <li className="breadcrumb-item active">Activity</li>
              </ol>
            </nav>
          </div>
        </div>

        <Vendor />
      </div>
    );

  }
}

export default Dashboard;
