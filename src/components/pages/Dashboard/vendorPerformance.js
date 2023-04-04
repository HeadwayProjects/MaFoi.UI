import React, { Component } from "react";
import { preventDefault } from "../../../utils/common";

export class Vendor extends Component {
  render() {
    return (
      <div>
        <div className="my-3 row">

          <div className="row m-0">
            <div className="col-2 col-md-2">
              <select className="form-select">
                <option>Select</option>
                <option>Company A</option>
                <option>Company B</option>
                <option>Company C</option>
              </select>
            </div>
            <div className="col-3 col-md-3">
              <select className="form-select">
                <option>Associate Company</option>
                <option>Company A</option>
                <option>Company B</option>
                <option>Company C</option>
              </select>
            </div>
            <div className="col-2 col-md-2">
              <select className="form-select">
                <option>Location</option>
                <option>Company A</option>
                <option>Company B</option>
                <option>Company C</option>
              </select>
            </div>
          </div>
        </div>

        <div className="row m-0">
          {/* ----------------- Current Performance starts --------------- */}
          <div className="col-md-6">
            <div className="card">
              <div className="card-header bg-white border-0 underline text-appprimary fw-semibold fs-5">
                Current Performance
              </div>
              <div className="card-body">
                {/* Chartstarts Today | This week | This Month */}

                <div className="nav-tabs-rounded col-7 mx-auto">
                  <ul className="nav nav-tabs border-0 d-flex justify-content-center" id="VendorWeek" role="tablist">
                    <li className="nav-item">
                      <button
                        className="nav-link active"
                        id="VendorToday"
                        data-bs-toggle="tab"
                        data-bs-target="#VendorToday-pane"
                        type="button"
                        role="tab"
                        aria-controls="VendorToday-pane"
                        aria-selected="true"
                      >
                        Today
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className="nav-link"
                        id="VendorThisWeek"
                        data-bs-toggle="tab"
                        data-bs-target="#VendorThisWeek-pane"
                        type="button"
                        role="tab"
                        aria-controls="VendorThisWeek-pane"
                        aria-selected="false"
                      >
                        This Week
                      </button>
                    </li>

                  </ul>
                </div>

                <div className="tab-content" id="VendorContent">
                  <div
                    className="tab-pane fade show active"
                    id="VendorToday-pane"
                    role="tabpanel"
                    aria-labelledby="VendorToday"
                    tabindex="0"
                  >
                    <div className="my-3">
                      <div className="text-center mb-3">
                        <strong className="text-primary">(09-Mar-2023)</strong>
                      </div>


                      <div className="row m-0  vendorPerformance-cards">

                        <div className="col-md-4">
                          <a href="/" onClick={preventDefault} className="text-link text-appprimary underline"> Submit Status </a>
                          <div className="col-md-12 mb-3">
                            <div className="card cardCount grey">
                              <div className="card-body">
                                <div className="row d-flex align-items-center">
                                  <div className="col-5 px-0 py-0">
                                    <label>Activities Saved</label>
                                  </div>
                                  <div className="col-5 px-1 py-1">
                                    <h3 className="p-0 m-0">(12)</h3>
                                  </div>
                                  <div className="col-1 px-0 py-0">
                                    {/* <Link className="rounded-circle"> - </Link> */}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-md-12 mb-3">
                            <div className="card cardCount yellow">
                              <div className="card-body">
                                <div className="row d-flex align-items-center">
                                  <div className="col-5 px-0 py-0">
                                    <label>Pending</label>
                                  </div>
                                  <div className="col-6  px-1 py-1">
                                    <h3 className="p-0 m-0">(36/50)</h3>
                                  </div>
                                  <div className="col-1 px-0 py-0">
                                    {/* <Link className="rounded-circle"> - </Link> */}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-md-12 mb-3">
                            <div className="card cardCount red">
                              <div className="card-body">
                                <div className="row d-flex align-items-center">
                                  <div className="col-5 px-0 py-0">
                                    <small>Overdue</small>
                                  </div>
                                  <div className="col-6  px-1 py-1">
                                    <h3 className="p-0 m-0">(14/50)</h3>
                                  </div>
                                  <div className="col-1 px-0 py-0">
                                    {/* <Link className="rounded-circle"> - </Link> */}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-md-12 mb-3">
                            <div className="card cardCount green">
                              <div className="card-body">
                                <div className="row d-flex align-items-center">
                                  <div className="col-5 px-0 py-0">
                                    <label>Submitted</label>
                                  </div>
                                  <div className="col-6  px-1 py-1">
                                    <h3 className="p-0 m-0">(36/50)</h3>
                                  </div>
                                  <div className="col-1 px-0 py-0">
                                    {/* <Link className="rounded-circle"> - </Link> */}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-4">
                          <a href="/" onClick={preventDefault} className="text-link text-appprimary underline">Audit Status</a>
                          <div className="col-md-12 mb-3">
                            <div className="card cardCount green">
                              <div className="card-body">
                                <div className="row d-flex align-items-center">
                                  <div className="col-5 px-0 py-0">
                                    <label>Audited</label>
                                  </div>
                                  <div className="col-6  px-1 py-1">
                                    <h3 className="p-0 m-0">(12)</h3>
                                  </div>
                                  <div className="col-1 px-0 py-0">
                                    {/* <Link className="rounded-circle"> - </Link> */}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-md-12 mb-3">
                            <div className="card cardCount red">
                              <div className="card-body">
                                <div className="row d-flex align-items-center">
                                  <div className="col-5 px-0 py-0">
                                    <label>Rejected</label>
                                  </div>
                                  <div className="col-6 px-1 py-1">
                                    <h3 className="p-0 m-0">(36/50)</h3>
                                  </div>
                                  <div className="col-1 px-0 py-0">
                                    {/* <Link className="rounded-circle"> - </Link> */}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                        </div>



                        <div className="col-md-4">
                          Charts
                        </div>

                      </div>

                    </div>
                  </div>
                  <div
                    className="tab-pane fade"
                    id="VendorThisWeek-pane"
                    role="tabpanel"
                    aria-labelledby="VendorThisWeek"
                    tabindex="0"
                  >
                    <div className="my-3">
                      <div className="text-center mb-3">
                        <strong className="text-primary">(09-Mar-2023) - (15-Mar-2023)</strong>
                      </div>
                    </div>
                  </div>
                  <div
                    className="tab-pane fade"
                    id="VendorThisMonth-pane"
                    role="tabpanel"
                    aria-labelledby="contact-tabVendorThisMonth"
                    tabindex="0"
                  >
                    <div className="my-3">
                      <div className="text-center mb-3">
                        <strong className="text-primary">(01-Mar-2023) - (31-Mar-2023)</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* ----------------- Current Performance ends --------------- */}

          {/* ----------------- Previous Performance starts --------------- */}
          <div className="col-md-6">
            <div className="card">
              <div className="card-header bg-white border-0 underline text-appprimary fw-semibold fs-5">
                Previous Performance
              </div>
              <div className="card-body">
                {/* Chartstarts Today | This week | This Month */}

                <div className="nav-tabs-rounded col-12 mx-auto">
                  <ul className="nav nav-tabs border-0 d-flex justify-content-center" id="Month" role="tablist">
                    <li className="nav-item">
                      <button
                        className="nav-link active"
                        id="VendorThisMonthV"
                        data-bs-toggle="tab"
                        data-bs-target="#VendorThisMonthV-pane"
                        type="button"
                        role="tab"
                        aria-controls="VendorThisMonthV-pane"
                        aria-selected="true"
                      >
                        This <br />Month
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className="nav-link"
                        id="VendorLast3Months"
                        data-bs-toggle="tab"
                        data-bs-target="#VendorLast3Months-pane"
                        type="button"
                        role="tab"
                        aria-controls="VendorLast3Months-pane"
                        aria-selected="false"
                      >
                        Last <br />3 Months
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className="nav-link"
                        id="VendorLast6Months"
                        data-bs-toggle="tab"
                        data-bs-target="#VendorLast6Months-pane"
                        type="button"
                        role="tab"
                        aria-controls="VendorLast6Months-pane"
                        aria-selected="false"
                      >
                        Last <br />6 Months
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className="nav-link"
                        id="VendorLast12Months"
                        data-bs-toggle="tab"
                        data-bs-target="#VendorLast12Months-pane"
                        type="button"
                        role="tab"
                        aria-controls="VendorLast12Months-pane"
                        aria-selected="false"
                      >
                        Last <br />12 Months
                      </button>
                    </li>
                  </ul>
                </div>

                <div className="tab-content" id="MonthContent">

                  <div
                    className="tab-pane fade show active"
                    id="VendorThisMonthV-pane"
                    role="tabpanel"
                    aria-labelledby="VendorThisMonthV"
                    tabindex="0"
                  >
                    <div className="my-3">
                      <div className="text-center mb-3">
                        <strong className="text-primary">(09-Mar-2023)</strong>
                      </div>

                      <div className="row m-0  vendorPerformance-cards">

                        <div className="col-md-4">
                          {/* <Link className="text-link text-appprimary underline"> Submit Status </Link> */}
                          <div className="col-md-12 mb-3">
                            <div className="card cardCount grey">
                              <div className="card-body">
                                <div className="row d-flex align-items-center">
                                  <div className="col-5 px-0 py-0">
                                    <label>Activities Saved</label>
                                  </div>
                                  <div className="col-5 px-1 py-1">
                                    <h3 className="p-0 m-0">(12)</h3>
                                  </div>
                                  <div className="col-1 px-0 py-0">
                                    {/* <Link className="rounded-circle"> - </Link> */}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-md-12 mb-3">
                            <div className="card cardCount yellow">
                              <div className="card-body">
                                <div className="row d-flex align-items-center">
                                  <div className="col-5 px-0 py-0">
                                    <label>Pending</label>
                                  </div>
                                  <div className="col-6  px-1 py-1">
                                    <h3 className="p-0 m-0">(36/50)</h3>
                                  </div>
                                  <div className="col-1 px-0 py-0">
                                    {/* <Link className="rounded-circle"> - </Link> */}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-md-12 mb-3">
                            <div className="card cardCount red">
                              <div className="card-body">
                                <div className="row d-flex align-items-center">
                                  <div className="col-5 px-0 py-0">
                                    <small>Overdue</small>
                                  </div>
                                  <div className="col-6  px-1 py-1">
                                    <h3 className="p-0 m-0">(14/50)</h3>
                                  </div>
                                  <div className="col-1 px-0 py-0">
                                    {/* <Link className="rounded-circle"> - </Link> */}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-md-12 mb-3">
                            <div className="card cardCount green">
                              <div className="card-body">
                                <div className="row d-flex align-items-center">
                                  <div className="col-5 px-0 py-0">
                                    <label>Submitted</label>
                                  </div>
                                  <div className="col-6  px-1 py-1">
                                    <h3 className="p-0 m-0">(36/50)</h3>
                                  </div>
                                  <div className="col-1 px-0 py-0">
                                    {/* <Link className="rounded-circle"> - </Link> */}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-4">
                          {/* <Link className="text-link text-appprimary underline"> Audit Status </Link> */}
                          <div className="col-md-12 mb-3">
                            <div className="card cardCount green">
                              <div className="card-body">
                                <div className="row d-flex align-items-center">
                                  <div className="col-5 px-0 py-0">
                                    <label>Audited</label>
                                  </div>
                                  <div className="col-6  px-1 py-1">
                                    <h3 className="p-0 m-0">(12)</h3>
                                  </div>
                                  <div className="col-1 px-0 py-0">
                                    {/* <Link className="rounded-circle"> - </Link> */}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-md-12 mb-3">
                            <div className="card cardCount red">
                              <div className="card-body">
                                <div className="row d-flex align-items-center">
                                  <div className="col-5 px-0 py-0">
                                    <label>Rejected</label>
                                  </div>
                                  <div className="col-6 px-1 py-1">
                                    <h3 className="p-0 m-0">(36/50)</h3>
                                  </div>
                                  <div className="col-1 px-0 py-0">
                                    {/* <Link className="rounded-circle"> - </Link> */}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                        </div>



                        <div className="col-md-4">
                          Charts
                        </div>

                      </div>


                    </div>
                  </div>



                  <div
                    className="tab-pane fade"
                    id="VendorLast3Months-pane"
                    role="tabpanel"
                    aria-labelledby="contact-VendorLast3Months"
                    tabindex="0"
                  >
                    <div className="my-3">
                      <div className="text-center mb-3">
                        <strong className="text-primary">Vendor Last 3 Months</strong>
                      </div>
                    </div>
                  </div>

                  <div
                    className="tab-pane fade"
                    id="VendorLast6Months-pane"
                    role="tabpanel"
                    aria-labelledby="contact-VendorLast6Months"
                    tabindex="0"
                  >
                    <div className="my-3">
                      <div className="text-center mb-3">
                        <strong className="text-primary">Vendor Last 6 Months </strong>
                      </div>
                    </div>
                  </div>

                  <div
                    className="tab-pane fade"
                    id="VendorLast12Months-pane"
                    role="tabpanel"
                    aria-labelledby="contact-VendorLast12Months"
                    tabindex="0"
                  >
                    <div className="my-3">
                      <div className="text-center mb-3">
                        <strong className="text-primary">Vendor Last 12 Months </strong>
                      </div>
                    </div>
                  </div>



                </div>
              </div>
            </div>
          </div>
          {/* ----------------- Previous Performance ends --------------- */}

        </div>



        <div className="row m-0 mt-4">

          {/* ----------------- To Do starts --------------- */}
          <div className="col-md-6">
            <div className="card">
              <div className="card-header bg-white border-0 underline text-appprimary fw-semibold fs-5">
                To-Do
              </div>
              <div className="card-body">
                {/* Chartstarts Today | This week | This Month */}

                <div className="nav-tabs-rounded col-7 mx-auto">
                  <ul className="nav nav-tabs border-0 d-flex justify-content-center" id="VendorWeek" role="tablist">
                    <li className="nav-item">
                      <button
                        className="nav-link active"
                        id="VendorToDo"
                        data-bs-toggle="tab"
                        data-bs-target="#VendorToDo-pane"
                        type="button"
                        role="tab"
                        aria-controls="VendorToDo-pane"
                        aria-selected="true"
                      >
                        Today
                      </button>
                    </li>

                    <li className="nav-item">
                      <button
                        className="nav-link"
                        id="VendorToDoThisWeek"
                        data-bs-toggle="tab"
                        data-bs-target="#VendorToDoThisWeek-pane"
                        type="button"
                        role="tab"
                        aria-controls="VendorToDoThisWeek-pane"
                        aria-selected="false"
                      >
                        This Week
                      </button>
                    </li>

                    <li className="nav-item">
                      <button
                        className="nav-link"
                        id="VendorToDoThisMonth"
                        data-bs-toggle="tab"
                        data-bs-target="#VendorToDoThisMonth-pane"
                        type="button"
                        role="tab"
                        aria-controls="VendorToDoThisMonth-pane"
                        aria-selected="false"
                      >
                        This Month
                      </button>
                    </li>

                  </ul>
                </div>

                <div className="tab-content" id="VendorContent">
                  <div
                    className="tab-pane fade show active"
                    id="VendorToDo-pane"
                    role="tabpanel"
                    aria-labelledby="VendorToDo"
                    tabindex="0"
                  >
                    <div className="my-3">
                      <div className="text-center mb-3">
                        <strong className="text-primary">(09-Mar-2023)</strong>
                      </div>


                      <div className="row m-0 card cardList yellow border-0">
                        <div className="card-body p-0">
                          <ul class="list-group list-group-flush">
                            <li class="list-group-item">Hyderabad-<span>Pending</span>-09-Mar/2023-Rule 24 (9-A) r/w Section Pending </li>
                            <li class="list-group-item">Hyderabad-<span>Pending</span>-09-Mar/2023-Rule 24 </li>
                            <li class="list-group-item">Hyderabad-<span>Pending</span>-09-Mar/2023-Rule</li>
                            <li class="list-group-item">Hyderabad-<span>Pending</span>-09-Mar/2023-Rule 24 (9) </li>
                          </ul>
                          <div className="text-primary d-flex justify-content-end fw-bold">
                            {/* <Link to="/auditorActivityToDo">View All</Link> */}
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                  <div
                    className="tab-pane fade"
                    id="VendorToDoThisWeek-pane"
                    role="tabpanel"
                    aria-labelledby="VendorToDoThisWeek"
                    tabindex="0"
                  >
                    <div className="my-3">
                      <div className="text-center mb-3">
                        <strong className="text-primary">(09-Mar-2023) - (15-Mar-2023)</strong>
                      </div>
                    </div>
                  </div>

                  <div
                    className="tab-pane fade"
                    id="VendorToDoThisMonth-pane"
                    role="tabpanel"
                    aria-labelledby="contact-tabVendorToDoThisMonth"
                    tabindex="0"
                  >
                    <div className="my-3">
                      <div className="text-center mb-3">
                        <strong className="text-primary">To Do This Month</strong>
                      </div>
                    </div>
                  </div>


                </div>
              </div>
            </div>
          </div>
          {/* ----------------- To Do ends --------------- */}


          {/* ----------------- Upcoming starts --------------- */}
          <div className="col-md-6">
            <div className="card">
              <div className="card-header bg-white border-0 underline text-appprimary fw-semibold fs-5">
                Upcoming
              </div>
              <div className="card-body">
                {/* Chartstarts Today | This week | This Month */}

                <div className="nav-tabs-rounded col-8 mx-auto">
                  <ul className="nav nav-tabs border-0" id="VendorUpcomingWeek" role="tablist">

                    <li className="nav-item">
                      <button
                        className="nav-link active"
                        id="VendorUpcomingNextWeek"
                        data-bs-toggle="tab"
                        data-bs-target="#VendorUpcomingNextWeek-pane"
                        type="button"
                        role="tab"
                        aria-controls="VendorUpcomingNextWeek-pane"
                        aria-selected="false"
                      >
                        Next Week
                      </button>
                    </li>

                    <li className="nav-item">
                      <button
                        className="nav-link"
                        id="VendorUpcomingNextMonth"
                        data-bs-toggle="tab"
                        data-bs-target="#VendorUpcomingNextMonth-pane"
                        type="button"
                        role="tab"
                        aria-controls="VendorUpcomingNextMonth-pane"
                        aria-selected="false"
                      >
                        Next Month
                      </button>
                    </li>

                    <li className="nav-item">
                      <button
                        className="nav-link"
                        id="VendorUpcomingNextQtr"
                        data-bs-toggle="tab"
                        data-bs-target="#VendorUpcomingNextQtr-pane"
                        type="button"
                        role="tab"
                        aria-controls="VendorUpcomingNextQtr-pane"
                        aria-selected="false"
                      >
                        Next Quarter
                      </button>
                    </li>

                  </ul>
                </div>

                <div className="tab-content" id="VendorContent">
                  <div
                    className="tab-pane fade show active"
                    id="VendorUpcomingNextWeek-pane"
                    role="tabpanel"
                    aria-labelledby="VendorUpcomingNextWeek"
                    tabindex="0"
                  >
                    <div className="my-3">
                      <div className="text-center mb-3">
                        <strong className="text-primary">(09-Mar-2023) - (14-Mar-2023)</strong>
                      </div>


                      <div className="row m-0 card cardList yellow border-0">
                        <div className="card-body p-0">
                          <ul class="list-group list-group-flush">
                            <li class="list-group-item">Hyderabad-<span>Pending</span>-09-Mar/2023-Rule 24 (9-A) r/w Section Pending </li>
                            <li class="list-group-item">Hyderabad-<span>Pending</span>-09-Mar/2023-Rule 24 </li>
                            <li class="list-group-item">Hyderabad-<span>Pending</span>-09-Mar/2023-Rule</li>
                            <li class="list-group-item">Hyderabad-<span>Pending</span>-09-Mar/2023-Rule 24 (9) </li>
                          </ul>
                          <div className="text-primary d-flex justify-content-end fw-bold">
                            {/* <Link to="">View All</Link> */}
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                  <div
                    className="tab-pane fade"
                    id="VendorUpcomingNextWeek-pane"
                    role="tabpanel"
                    aria-labelledby="VendorUpcomingNextWeek"
                    tabindex="0"
                  >
                    <div className="my-3">
                      <div className="text-center mb-3">
                        <strong className="text-primary">(09-Mar-2023) - (15-Mar-2023)</strong>
                      </div>
                    </div>
                  </div>

                  <div
                    className="tab-pane fade"
                    id="VendorUpcomingNextMonth-pane"
                    role="tabpanel"
                    aria-labelledby="contact-tabVendorUpcomingNextMonth"
                    tabindex="0"
                  >
                    <div className="my-3">
                      <div className="text-center mb-3">
                        <strong className="text-primary">Upcoming Next Month</strong>
                      </div>
                    </div>
                  </div>


                  <div
                    className="tab-pane fade"
                    id="VendorUpcomingNextQtr-pane"
                    role="tabpanel"
                    aria-labelledby="contact-tabVendorUpcomingNextQtr"
                    tabindex="0"
                  >
                    <div className="my-3">
                      <div className="text-center mb-3">
                        <strong className="text-primary">Upcoming Next Quarter</strong>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
          {/* ----------------- To Do ends --------------- */}

        </div>




        <div className="row m-0 mt-4">

          {/* ----------------- OverDue-Pending starts --------------- */}
          <div className="col-md-6">
            <div className="card">
              {/* <div className="card-header bg-white border-0 underline text-appprimary fw-semibold fs-5">
                To-Do
              </div> */}
              <div className="card-body">
                {/* Chartstarts Today | This week | This Month */}

                <div className="nav-tabs-rounded col-7 mx-auto">
                  <ul className="nav nav-tabs border-0 d-flex justify-content-center" id="VendorWeekOverDue" role="tablist">
                    <li className="nav-item">
                      <button
                        className="nav-link active"
                        id="VendorOverDue"
                        data-bs-toggle="tab"
                        data-bs-target="#VendorOverDue-pane"
                        type="button"
                        role="tab"
                        aria-controls="VendorOverDue-pane"
                        aria-selected="true"
                      >
                        OverDue
                      </button>
                    </li>

                    <li className="nav-item">
                      <button
                        className="nav-link"
                        id="VendorPending"
                        data-bs-toggle="tab"
                        data-bs-target="#VendorPending-pane"
                        type="button"
                        role="tab"
                        aria-controls="VendorPending-pane"
                        aria-selected="false"
                      >
                        Pending
                      </button>
                    </li>

                  </ul>
                </div>

                <div className="tab-content" id="VendorOverDuePendingContent">
                  <div
                    className="tab-pane fade show active"
                    id="VendorOverDue-pane"
                    role="tabpanel"
                    aria-labelledby="VendorOverDue"
                    tabindex="0"
                  >
                    <div className="my-3">
                      <div className="text-center mb-3">
                        <strong className="text-primary">(09-Mar-2023)</strong>
                      </div>


                      <div className="row m-0 card cardList red border-0">
                        <div className="card-body p-0">
                          <ul class="list-group list-group-flush">
                            <li class="list-group-item">Hyderabad-<span>OverDue</span>-09-Mar/2023-Rule 24 (9-A) r/w Section Pending </li>
                            <li class="list-group-item">Hyderabad-<span>OverDue</span>-09-Mar/2023-Rule 24 </li>
                            <li class="list-group-item">Hyderabad-<span>OverDue</span>-09-Mar/2023-Rule</li>
                            <li class="list-group-item">Hyderabad-<span>OverDue</span>-09-Mar/2023-Rule 24 (9) </li>
                          </ul>
                          <div className="text-primary d-flex justify-content-end fw-bold">
                            {/* <Link to="">View All</Link> */}
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                  <div
                    className="tab-pane fade"
                    id="VendorPending-pane"
                    role="tabpanel"
                    aria-labelledby="VendorPending"
                    tabindex="0"
                  >
                    <div className="my-3">
                      <div className="text-center mb-3">
                        <strong className="text-primary">Pending</strong>
                      </div>
                    </div>
                  </div>



                </div>
              </div>
            </div>
          </div>
          {/* ----------------- OverDue-Pending ends --------------- */}


          {/* ----------------- Rejected-Audited starts --------------- */}
          <div className="col-md-6">
            <div className="card">
              {/* <div className="card-header bg-white border-0 underline text-appprimary fw-semibold fs-5">
                Upcoming
              </div> */}
              <div className="card-body">
                {/* Chartstarts Today | This week | This Month */}

                <div className="nav-tabs-rounded col-4 mx-auto">
                  <ul className="nav nav-tabs border-0" id="VendorRejectedWeek" role="tablist">

                    <li className="nav-item">
                      <button
                        className="nav-link active"
                        id="VendorRejected"
                        data-bs-toggle="tab"
                        data-bs-target="#VendorRejected-pane"
                        type="button"
                        role="tab"
                        aria-controls="VendorRejected-pane"
                        aria-selected="false"
                      >
                        Rejected
                      </button>
                    </li>

                    <li className="nav-item">
                      <button
                        className="nav-link"
                        id="VendorAudited"
                        data-bs-toggle="tab"
                        data-bs-target="#VendorAudited-pane"
                        type="button"
                        role="tab"
                        aria-controls="VendorAudited-pane"
                        aria-selected="false"
                      >
                        Audited
                      </button>
                    </li>

                  </ul>
                </div>

                <div className="tab-content" id="VendorRejectedContent">
                  <div
                    className="tab-pane fade show active"
                    id="VendorRejected-pane"
                    role="tabpanel"
                    aria-labelledby="VendorRejected"
                    tabindex="0"
                  >
                    <div className="my-3">
                      <div className="text-center mb-3">
                        <strong className="text-primary">08 Rejected</strong>
                      </div>


                      <div className="row m-0 card cardList red border-0">
                        <div className="card-body p-0">
                          <ul class="list-group list-group-flush">
                            <li class="list-group-item">Hyderabad-<span>Rejected</span>-09-Mar/2023-Rule 24 (9-A) r/w Section Pending </li>
                            <li class="list-group-item">Hyderabad-<span>Rejected</span>-09-Mar/2023-Rule 24 </li>
                            <li class="list-group-item">Hyderabad-<span>Rejected</span>-09-Mar/2023-Rule</li>
                            <li class="list-group-item">Hyderabad-<span>Rejected</span>-09-Mar/2023-Rule 24 (9) </li>
                          </ul>
                          <div className="text-primary d-flex justify-content-end fw-bold">
                            {/* <Link to="">View All</Link> */}
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>


                  <div
                    className="tab-pane fade"
                    id="VendorAudited-pane"
                    role="tabpanel"
                    aria-labelledby="contact-tabVendorAudited"
                    tabindex="0"
                  >
                    <div className="my-3">
                      <div className="text-center mb-3">
                        <strong className="text-primary">Audited</strong>
                      </div>
                    </div>
                  </div>



                </div>
              </div>
            </div>
          </div>
          {/* ----------------- Rejected-Audited ends --------------- */}

        </div>
      </div>
    );
  }
}

export default Vendor;
