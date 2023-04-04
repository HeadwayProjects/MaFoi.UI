import React, { Component } from "react";
import Auditor from "./auditorPerformance";
import Vendor from "./vendorPerformance";

export class Dashboard extends Component {
  render() {
    return (
      <div>
        {/* Page Heading starts */}
        <div className="row ml-0 mr-0 mb-3 pageHeading p-3">
          <div className="col-8">
            <h4 className="mb-0"> <i className="fa fa-user"></i> Auditor Dashboard</h4>
          </div>
          <div className="col-4">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0 d-flex justify-content-end">
                {/* <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
                <li className="breadcrumb-item active">Activity</li> */}
              </ol>
            </nav>
          </div>
        </div>
        {/* Page Heading ends */}

        {/* Dashboard Auditor starts */}
        <ul className="nav nav-tabs DashboardTabs" id="myTab" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              className="nav-link active"
              id="home-tab"
              data-bs-toggle="tab"
              data-bs-target="#home-tab-pane"
              type="button"
              role="tab"
              aria-controls="home-tab-pane"
              aria-selected="true"
            >
              Auditor Performance
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link"
              id="profile-tab"
              data-bs-toggle="tab"
              data-bs-target="#profile-tab-pane"
              type="button"
              role="tab"
              aria-controls="profile-tab-pane"
              aria-selected="false"
            >
              Vendor Performance
            </button>
          </li>
        </ul>
        <div className="tab-content" id="myTabContent">
          <div
            className="tab-pane fade show active"
            id="home-tab-pane"
            role="tabpanel"
            aria-labelledby="home-tab"
            tabindex="0"
          >
            <Auditor/>
          </div>
          <div
            className="tab-pane fade"
            id="profile-tab-pane"
            role="tabpanel"
            aria-labelledby="profile-tab"
            tabindex="0"
          >
            <Vendor/>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
