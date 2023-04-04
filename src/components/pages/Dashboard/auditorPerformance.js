import React, { Component } from "react";

export class Auditor extends Component {
  render() {
    return (
      <div>
        <div className="my-3 row">
          <div className="col-6 col-md-3 mb-3">
            <div className="card cardCount grey">
              <div className="card-body">
                <div className="row d-flex align-items-center">
                  <div className="col-7 px-0 py-1">
                    <label>Total Vendors</label>
                  </div>
                  <div className="col-3 px-0 py-1">
                    <h3 className="p-0 m-0">(13)</h3>
                  </div>
                  <div className="col-2 px-0 py-1">
                    {/* <Link className="rounded-circle"> - </Link> */}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3 mb-3">
            <div className="card cardCount yellow">
              <div className="card-body">
                <div className="row d-flex align-items-center">
                  <div className="col-7 px-0 py-1">
                    <label>Audit Approval Pending</label>
                  </div>
                  <div className="col-3 px-0 py-1">
                    <h3 className="p-0 m-0">(03)</h3>
                  </div>
                  <div className="col-2 px-0 py-1">
                    {/* <Link className="rounded-circle"> - </Link> */}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3 mb-3">
            <div className="card cardCount red">
              <div className="card-body">
                <div className="row d-flex align-items-center">
                  <div className="col-7 px-0 py-1">
                    <label>Audit Approval Pending</label>
                  </div>
                  <div className="col-3 px-0 py-1">
                    <h3 className="p-0 m-0">(09)</h3>
                  </div>
                  <div className="col-2 px-0 py-1">
                    {/* <Link className="rounded-circle"> - </Link> */}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3 mb-3">
            <div className="card cardCount yellow">
              <div className="card-body">
                <div className="row d-flex align-items-center">
                  <div className="col-7 px-0 py-1">
                    <label>Vendors Not Submitted</label>
                  </div>
                  <div className="col-3 px-0 py-1">
                    <h3 className="p-0 m-0">(21)</h3>
                  </div>
                  <div className="col-2 px-0 py-1">
                    {/* <Link className="rounded-circle"> - </Link> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row m-0">
          
          <div className="col-md-6">
            <div className="card">
              <div className="card-header bg-white border-0 underline text-appprimary fw-semibold fs-5">
                Auditor Current Performance
              </div>
              <div className="card-body">
                {/* Chartstarts Today | This week | This Month */}

                <div className="nav-tabs-rounded col-7 mx-auto">
                  <ul className="nav nav-tabs border-0 d-flex justify-content-center" id="Week" role="tablist">
                    <li className="nav-item">
                      <button
                        className="nav-link active"
                        id="AuditorToday"
                        data-bs-toggle="tab"
                        data-bs-target="#AuditorToday-pane"
                        type="button"
                        role="tab"
                        aria-controls="AuditorToday-pane"
                        aria-selected="true"
                      >
                        Today
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className="nav-link"
                        id="AuditorThisWeek"
                        data-bs-toggle="tab"
                        data-bs-target="#AuditorThisWeek-pane"
                        type="button"
                        role="tab"
                        aria-controls="AuditorThisWeek-pane"
                        aria-selected="false"
                      >
                        This Week
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className="nav-link"
                        id="AuditorThisMonth"
                        data-bs-toggle="tab"
                        data-bs-target="#AuditorThisMonth-pane"
                        type="button"
                        role="tab"
                        aria-controls="AuditorThisMOnth-pane"
                        aria-selected="false"
                      >
                        This Month
                      </button>
                    </li>
                  </ul>
                </div>

                <div className="tab-content d-flex justify-content-center" id="WeekContent">
                  <div
                    className="tab-pane fade show active"
                    id="AuditorToday-pane"
                    role="tabpanel"
                    aria-labelledby="AuditorToday"
                    tabindex="0"
                  >
                    <div className="my-3">
                      <div className="text-center">
                        <strong className="text-primary">(09-Mar-2023)</strong>
                      </div>
                    </div>
                  </div>
                  <div
                    className="tab-pane fade"
                    id="AuditorThisWeek-pane"
                    role="tabpanel"
                    aria-labelledby="AuditorThisWeek"
                    tabindex="0"
                  >
                    <div className="my-3">
                      <div className="text-center">
                        <strong className="text-primary">(09-Mar-2023) - (15-Mar-2023)</strong>
                      </div>
                    </div>
                  </div>
                  <div
                    className="tab-pane fade"
                    id="AuditorThisMonth-pane"
                    role="tabpanel"
                    aria-labelledby="contact-tabAuditorThisMonth"
                    tabindex="0"
                  >
                    <div className="my-3">
                      <div className="text-center">
                        <strong className="text-primary">(01-Mar-2023) - (31-Mar-2023)</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card">
              <div className="card-header bg-white border-0 underline text-appprimary fw-semibold fs-5">
                Auditor Previous Performance
              </div>
              <div className="card-body">
                {/* Chartstarts Today | This week | This Month */}

                <div className="nav-tabs-rounded col-12 mx-auto">
                  <ul className="nav nav-tabs border-0 d-flex justify-content-center" id="Month" role="tablist">
                    {/* <li className="nav-item">
                      <button
                        className="nav-link active"
                        id="AuditorThisMonth1"
                        data-bs-toggle="tab"
                        data-bs-target="#AuditorThisMonth1-pane"
                        type="button"
                        role="tab"
                        aria-controls="AuditorThisMonth1-pane"
                        aria-selected="true"
                      >
                        This <br/>Month
                      </button>
                    </li> */}
                    <li className="nav-item">
                      <button
                        className="nav-link active"
                        id="AuditorLastMonth"
                        data-bs-toggle="tab"
                        data-bs-target="#AuditorLastMonth-pane"
                        type="button"
                        role="tab"
                        aria-controls="AuditorLastMonth-pane"
                        aria-selected="false"
                      >
                        Last <br/>Month
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className="nav-link"
                        id="AuditorLast3Months"
                        data-bs-toggle="tab"
                        data-bs-target="#AuditorLast3Months-pane"
                        type="button"
                        role="tab"
                        aria-controls="AuditorLast3Months-pane"
                        aria-selected="false"
                      >
                        Last <br/>3 Months
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className="nav-link"
                        id="AuditorLast6Months"
                        data-bs-toggle="tab"
                        data-bs-target="#AuditorLast6Months-pane"
                        type="button"
                        role="tab"
                        aria-controls="AuditorLast6Months-pane"
                        aria-selected="false"
                      >
                        Last <br/>6 Months 
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className="nav-link"
                        id="AuditorLast12Months"
                        data-bs-toggle="tab"
                        data-bs-target="#AuditorLast12Months-pane"
                        type="button"
                        role="tab"
                        aria-controls="AuditorLast12Months-pane"
                        aria-selected="false"
                      >
                        Last <br/>12 Months 
                      </button>
                    </li>
                  </ul>
                </div>

                <div className="tab-content d-flex justify-content-center" id="MonthContent">
                  
                  <div
                    className="tab-pane fade show active"
                    id="AuditorThisMonth1-pane"
                    role="tabpanel"
                    aria-labelledby="AuditorThisMonth1"
                    tabindex="0"
                  >
                    <div className="my-3">
                      <div className="text-center">
                        <strong className="text-primary">(09-Mar-2023)</strong>
                      </div>
                    </div>
                  </div>

                  <div
                    className="tab-pane fade"
                    id="AuditorLastMonth-pane"
                    role="tabpanel"
                    aria-labelledby="AuditorLastMonth"
                    tabindex="0"
                  >
                    <div className="my-3">
                      <div className="text-center">
                        <strong className="text-primary">(09-Mar-2023) - (15-Mar-2023)</strong>
                      </div>
                    </div>
                  </div>

                  <div
                    className="tab-pane fade"
                    id="AuditorLast3Months-pane"
                    role="tabpanel"
                    aria-labelledby="contact-AuditorLast3Months"
                    tabindex="0"
                  >
                    <div className="my-3">
                      <div className="text-center">
                        <strong className="text-primary">Auditor Last 3 Months</strong>
                      </div>
                    </div>
                  </div>

                  <div
                    className="tab-pane fade"
                    id="AuditorLast6Months-pane"
                    role="tabpanel"
                    aria-labelledby="contact-AuditorLast6Months"
                    tabindex="0"
                  >
                    <div className="my-3">
                      <div className="text-center">
                        <strong className="text-primary">Auditor Last 6 Months </strong>
                      </div>
                    </div>
                  </div>

                  <div
                    className="tab-pane fade"
                    id="AuditorLast12Months-pane"
                    role="tabpanel"
                    aria-labelledby="contact-AuditorLast12Months"
                    tabindex="0"
                  >
                    <div className="my-3">
                      <div className="text-center">
                        <strong className="text-primary">Auditor Last 12 Months </strong>
                      </div>
                    </div>
                  </div>



                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }
}

export default Auditor;
