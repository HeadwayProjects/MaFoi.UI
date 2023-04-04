import React, { Component } from "react";
import { Link } from "react-router-dom";

export class AuditorActivityToDo extends Component {
  render() {
    return (
      <div>
        {/* Page Heading starts */}
        <div className="row ml-0 mr-0 mb-3 pageHeading p-3 d-flex justify-content-between">
          <div className="col-3">
            <h4 className="mb-0">
              <i className="fa fa-user"></i> Auditor - Activity
            </h4>
          </div>

          <div className="col-3">
            <small>Status: 25% completed</small>
            <div class="progress">
              <div
                class="progress-bar w-25"
                role="progressbar"
                aria-label="Basic example"
                aria-valuenow="25"
                aria-valuemin="25"
                aria-valuemax="100"
              ></div>
            </div>
          </div>

          <div className="col-3">
            <input
              type="text"
              class="form-control bg-transparent border-1"
              placeholder="Search for Law/Rule"
            ></input>
          </div>

          <div className="col-3">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0 d-flex justify-content-end">
                <li className="breadcrumb-item">
                  {/* <Link to="/">Home</Link> */}
                </li>
                <li className="breadcrumb-item">
                  {/* <Link to="/dashboard">Dashboard</Link> */}
                </li>
                <li className="breadcrumb-item active">Activity</li>
              </ol>
            </nav>
          </div>
        </div>
        {/* Page Heading ends */}

        <form className="card border-0 p-0 mb-3">
          <div className="card-body">
            <div className="row">
              <div className="col-2 col-md-2">
                <select className="form-select">
                  <option>Select</option>
                  <option>Company A</option>
                  <option>Company A</option>
                  <option>Company C</option>
                </select>
              </div>
              <div className="col-3 col-md-3">
                <select className="form-select">
                  <option>Associate Company</option>
                  <option>Company A</option>
                  <option>Company A</option>
                  <option>Company C</option>
                </select>
              </div>
              <div className="col-2 col-md-2">
                <select className="form-select">
                  <option>Location</option>
                  <option>Company A</option>
                  <option>Company A</option>
                  <option>Company C</option>
                </select>
              </div>
              <div className="col-md-4">
                <div className="row">
                  <div className="col-6 col-md-6">
                    <div className="row d-flex align-items-center">
                      <div className="col-3 pr-0">
                        <label>From</label>
                      </div>
                      <div className="col-9 p-0">
                        <input type="date" class="form-control"></input>
                      </div>
                    </div>
                  </div>
                  <div className="col-6 col-md-6">
                    <div className="row d-flex align-items-center">
                      <div className="col-3 pr-0">
                        <label>To</label>
                      </div>
                      <div className="col-9 p-0">
                        <input type="date" class="form-control"></input>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-1">
                <button type="submit" class="btn btn-primary">
                  Search
                </button>
              </div>
            </div>
          </div>

          <div className="card-footer border-0">
            <div className="d-flex  justify-content-between">
                <label className="text-appprimary">Forms Status</label>
                <div>
                    <input type="checkbox" class="btn-check" id="activitiesSaved" autocomplete="off"/>
                    <label class="btn btn-outline-secondary" for="activitiesSaved">Activities Saved</label>
                </div>

                <div>
                    <input type="checkbox" class="btn-check" id="pending" autocomplete="off"/>
                    <label class="btn btn-outline-warning" for="pending">Pending</label>
                </div>

                <div>
                    <input type="checkbox" class="btn-check" id="Overdue" autocomplete="off"/>
                    <label class="btn btn-outline-danger" for="Overdue">Overdue</label>
                </div>

                <div>
                    <input type="checkbox" class="btn-check" id="Reject" autocomplete="off"/>
                    <label class="btn btn-outline-danger" for="Reject">Reject</label>
                </div>
                
                <div>
                    <input type="checkbox" class="btn-check" id="Submitted" autocomplete="off"/>
                    <label class="btn btn-outline-danger" for="Submitted">Submitted</label>
                </div>
                
                <div>
                    <input type="checkbox" class="btn-check" id="Audited" autocomplete="off"/>
                    <label class="btn btn-outline-danger" for="Audited">Audited</label>
                </div>

                <div>
                    <button type="submit" class="btn btn-success">
                        Audit Approved
                    </button>
                </div>

                <div>
                    <button type="submit" class="btn btn-danger">
                        Audit Rejected
                    </button>
                </div>

            </div>
          </div>
        </form>


        <table class="table table-bordered bg-white">
            <thead>
                <tr>
                    <th scope="col"><input type="checkbox"/> </th>
                    <th scope="col">ID</th>
                    <th scope="col">Month</th>
                    <th scope="col">Act</th>
                    <th scope="col">Rule</th>
                    <th scope="col">Forms/Registers & Returns</th>
                    <th scope="col">Associate Company</th>
                    <th scope="col">Location Name</th>
                    <th scope="col">Audit Due Date</th>
                    <th scope="col">Audit Status</th>
                    <th scope="col">Forms Status</th>
                    <th scope="col">Audit Remarks</th>
                    <th scope="col">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><input type="checkbox"/> </td>
                    <td>01</td>
                    <td>March 23</td>
                    <td>The Minium Wage </td>
                    <td>Rule 24(11)</td>
                    <td>Register of Advance</td>
                    <td>Associate Company A</td>
                    <td>Hyderabad</td>
                    <td className="text-warning">08-03-2023</td>
                    <td className="text-danger">Not-Applicable</td>
                    <td className="text-danger">Reject</td>
                    <td><input type="text" /></td>
                    <td>
                        {/* <Link to="">D</Link>
                        <Link to="">E</Link>
                        <Link to="">S</Link>
                        <Link to="">V</Link> */}
                    </td>
                </tr>
                <tr>
                    <td><input type="checkbox"/> </td>
                    <td>01</td>
                    <td>March 23</td>
                    <td>The Minium Wage </td>
                    <td>Rule 24(11)</td>
                    <td>Register of Advance</td>
                    <td>Associate Company A</td>
                    <td>Hyderabad</td>
                    <td className="text-warning">08-03-2023</td>
                    <td className="text-danger">Not-Applicable</td>
                    <td className="text-danger">Reject</td>
                    <td><input type="text" /></td>
                    <td>
                        {/* <Link to="">D</Link>
                        <Link to="">E</Link>
                        <Link to="">S</Link>
                        <Link to="">V</Link> */}
                    </td>
                </tr>
                <tr>
                    <td><input type="checkbox"/> </td>
                    <td>01</td>
                    <td>March 23</td>
                    <td>The Minium Wage </td>
                    <td>Rule 24(11)</td>
                    <td>Register of Advance</td>
                    <td>Associate Company A</td>
                    <td>Hyderabad</td>
                    <td className="text-warning">08-03-2023</td>
                    <td className="text-danger">Not-Applicable</td>
                    <td className="text-danger">Reject</td>
                    <td><input type="text" /></td>
                    <td>
                        {/* <Link to="">D</Link>
                        <Link to="">E</Link>
                        <Link to="">S</Link>
                        <Link to="">V</Link> */}
                    </td>
                </tr>
                <tr>
                    <td><input type="checkbox"/> </td>
                    <td>01</td>
                    <td>March 23</td>
                    <td>The Minium Wage </td>
                    <td>Rule 24(11)</td>
                    <td>Register of Advance</td>
                    <td>Associate Company A</td>
                    <td>Hyderabad</td>
                    <td className="text-warning">08-03-2023</td>
                    <td className="text-danger">Not-Applicable</td>
                    <td className="text-danger">Reject</td>
                    <td><input type="text" /></td>
                    <td>
                        {/* <Link to="">D</Link>
                        <Link to="">E</Link>
                        <Link to="">S</Link>
                        <Link to="">V</Link> */}
                    </td>
                </tr>
            </tbody>
        </table>


      </div>
    );
  }
}

export default AuditorActivityToDo;
