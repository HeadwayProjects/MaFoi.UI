import React, { Component } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import BulkUploadModal from "./bulkuploadModal";
import SubmitToAuditorModal from "./submitToAuditorModal";
import * as api from "../../../backend/request";
import Select from 'react-select';
import EditActivity from "./editActivity";
import { toast } from 'react-toastify';
import PageLoader from "../../shared/PageLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faSearch, faUpload } from "@fortawesome/free-solid-svg-icons";

function StatusTmp({ status }) {
  function computeStatusColor(status) {
    if (status === 'Pending') {
      return 'text-warning';
    } else if (status === 'Reject' || status === 'Overdue') {
      return 'text-danger';
    } else if (status === 'Submitted') {
      return 'text-success';
    } else if (status === 'Audited') {
      return 'text-success-emphasis'
    }
    return 'text-secondary'
  }
  return (
    <span className={computeStatusColor(status)}>{status}</span>
  )
}

export class VendorActivityToDo extends Component {

  constructor(props) {
    super(props);
    this.state = { companies: [], res: [], show: false, isAuditorModalShow: false, selectedFormStatuses: {}, submitting: false };
  }

  componentDidMount() {
    if (this.fetchPromise) {
      // already mounted previously
      return;
    }
    this.fetchPromise = api.get('/api/Company/GetUserCompanies').then(response => {
      const companies = (response.data || []).map(company => {
        return { value: company.id, label: company.name, company }
      });
      this.setState({ companies }, this.onCompanyChange);
    });
  }

  handleShow(event) {
    event.preventDefault();
    this.setState({ show: true });
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleSubmitToAuditorModalShow(event) {
    event.preventDefault();
    this.setState({ isAuditorModalShow: true });
  }

  handleSubmitToAuditorModalClose() {
    this.setState({ isAuditorModalShow: false });
  }

  onCompanyChange = (event) => {
    event = event ? event : this.state.companies[0];
    this.setState({ associateCompanies: [], locations: [], selectedAssociateCompany: null, selectedLocation: null });
    this.setState({ selectedCompany: event });
    if (event && event.value) {
      const associateCompanies = event.company.associateCompanies.map(associateCompany => {
        return { label: associateCompany.name, value: associateCompany.id };
      });
      const locations = event.company.locations.map(location => {
        return { label: `${location.name}, ${location.cities.name}`, value: location.id, location };
      });
      this.setState({ associateCompanies, locations, selectedAssociateCompany: associateCompanies[0], selectedLocation: locations[0] }, this.getToDoByCriteria);
    }
  }

  editActivity(activity) {
    this.setState({ edit: true, activity });
  }

  downloadForm(activity) {
    if (activity.rule.filePath) {
      const link = document.createElement('a');
      link.href = activity.rule.filePath;
      link.download = activity.rule.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  dismissEdit() {
    this.setState({ edit: false, activity: null });
  }

  onFormStatusChangeHandler = (e) => {
    const { selectedFormStatuses } = this.state;
    this.setState({
      selectedFormStatuses: {
        ...selectedFormStatuses,
        [e.target.name]: e.target.checked
      }
    }, this.filterRecordsByFormStatuses)
  }

  filterRecordsByFormStatuses = () => {
    const { selectedFormStatuses } = this.state;
    const array = Object.entries(selectedFormStatuses).map((item) => {
      const [key, value] = item;
      if (value) {
        return key
      }
      return undefined;
    })
    const statusArray = array.filter((el) => el !== undefined);
    this.setState({ statuses: statusArray.length > 0 ? statusArray : [""] }, this.getToDoByCriteria);
  }

  getToDoByCriteria = () => {
    const { selectedCompany, selectedAssociateCompany, selectedLocation, fromDate, toDate, statuses } = this.state;
    const payload = {
      company: selectedCompany.value,
      associateCompany: selectedAssociateCompany.value,
      location: selectedLocation.value,
      fromDate: fromDate || null,
      toDate: toDate || null,
      statuses: statuses || [""]
    }
    api.post('/api/ToDo/GetToDoByCriteria', payload).then(response => {
      this.setState({
        res: (response.data || []).map(x => {
          return { ...x, edit: this.editActivity.bind(this), download: this.downloadForm.bind(this) }
        })
      });
    });
  }

  // TODO: Need to enhance
  onSubmitToAuditorHandler = (e) => {
    e.preventDefault();
    const { res } = this.state;
    const filterStatuses = ["ActivitySaved", "Pending", "Overdue"]
    const array = res.filter(resItem => filterStatuses.includes(resItem.status));
    const filteredIds = array.map(item => item.id);
    if (filteredIds.length === 0) {
      toast.warn('There are no "Activity Saved", "Pending" or "Overdue" activities available for submission.')
      return;
    }
    this.setState({ submitting: true });
    // API CAll
    api.post('/api/ToDo/SubmitToAudit', filteredIds).then(() => {
      toast.success('Selected activities submitted successfully.');
      this.getToDoByCriteria();
    }).finally(() => this.setState({ submitting: false }));
  }

  render() {
    return (
      <div>
        {/* Page Heading starts */}
        <div className="row ml-0 mr-0 mb-3 pageHeading p-3 d-flex justify-content-between">
          <div className="col-3">
            <h4 className="mb-0">
              <i className="fa fa-user"></i> Vendor - Activity
            </h4>
          </div>

          <div className="col-3">
            <small>Status: 25% completed</small>
            <div className="progress">
              <div
                className="progress-bar w-25"
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
              className="form-control bg-transparent border-1"
              placeholder="Search for Law/Rule"
            ></input>
          </div>

          <div className="col-3">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0 d-flex justify-content-end">
                <li className="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/dashboard">Dashboard</Link>
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
                <Select options={this.state.companies} onChange={this.onCompanyChange.bind(this)}
                  placeholder='Company' value={this.state.selectedCompany} />
              </div>
              <div className="col-3 col-md-3">
                <Select options={this.state.associateCompanies} onChange={(event) => this.setState({ selectedAssociateCompany: event })}
                  placeholder='Associate Company' value={this.state.selectedAssociateCompany} />
              </div>
              <div className="col-2 col-md-2">
                <Select options={this.state.locations} onChange={(event) => this.setState({ selectedLocation: event })}
                  placeholder='Location' value={this.state.selectedLocation} />
              </div>
              <div className="col-md-4">
                <div className="row">
                  <div className="col-6 col-md-6">
                    <div className="row d-flex align-items-center">
                      <div className="col-3 pr-0">
                        <label>From</label>
                      </div>
                      <div className="col-9 p-0">
                        <input type="date" className="form-control"></input>
                      </div>
                    </div>
                  </div>
                  <div className="col-6 col-md-6">
                    <div className="row d-flex align-items-center">
                      <div className="col-3 pr-0">
                        <label>To</label>
                      </div>
                      <div className="col-9 p-0">
                        <input type="date" className="form-control"></input>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-1">
                <button type="submit" className="btn btn-primary">
                  <div className="d-flex align-items-center">
                    <FontAwesomeIcon icon={faSearch} />
                    <span className="ms-2">Search</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="card-footer border-0 px-0">
            <div className="d-flex justify-content-between">
              <div className="d-flex align-items-center status-btn-group">
                <div className="text-appprimary">Forms Status</div>
                <div className="mx-2">
                  <input name="ActivitySaved" type="checkbox" className="btn-check" id="activitiesSaved" autoComplete="off" onChange={this.onFormStatusChangeHandler} />
                  <label className="btn btn-outline-secondary" htmlFor="activitiesSaved">Activities Saved</label>
                </div>

                <div className="mx-2">
                  <input name="Pending" type="checkbox" className="btn-check" id="pending" autoComplete="off" onChange={this.onFormStatusChangeHandler} />
                  <label className="btn btn-outline-warning" htmlFor="pending">Pending</label>
                </div>

                <div className="mx-2">
                  <input name="Overdue" type="checkbox" className="btn-check" id="Overdue" autoComplete="off" onChange={this.onFormStatusChangeHandler} />
                  <label className="btn btn-outline-danger" htmlFor="Overdue">Overdue</label>
                </div>

                <div className="mx-2">
                  <input name="Rejected" type="checkbox" className="btn-check" id="Reject" autoComplete="off" onChange={this.onFormStatusChangeHandler} />
                  <label className="btn btn-outline-danger" htmlFor="Reject">Reject</label>
                </div>

                <div className="mx-2">
                  <input name="Submitted" type="checkbox" className="btn-check" id="Submitted" autoComplete="off" onChange={this.onFormStatusChangeHandler} />
                  <label className="btn btn-outline-danger" htmlFor="Submitted">Submitted</label>
                </div>

                <div className="mx-2">
                  <input name="Audited" type="checkbox" className="btn-check" id="Audited" autoComplete="off" onChange={this.onFormStatusChangeHandler} />
                  <label className="btn btn-outline-danger" htmlFor="Audited">Audited</label>
                </div>
              </div>
              <div className="d-flex">
                <div className="mx-2">
                  <button className="btn btn-primary" onClick={this.handleShow.bind(this)}>
                    <div className="d-flex align-items-center">
                      <FontAwesomeIcon icon={faUpload} />
                      <span className="ms-2">Bulk Upload</span>
                    </div>
                  </button>
                </div>

                <div>
                  <button className="btn btn-primary" onClick={this.handleSubmitToAuditorModalShow.bind(this)}>
                    <div className="d-flex align-items-center">
                      <FontAwesomeIcon icon={faSave} />
                      <span className="ms-2">Submit To Auditor</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>

        <table className="table table-bordered bg-white">
          <thead>
            <tr>
              <th scope="col"><input type="checkbox" /> </th>
              <th scope="col">Month(year)</th>
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
            {
              this.state.res.map(function (item) {
                return (
                  <tr key={item.id}>
                    <td><input type="checkbox" /></td>
                    <td>{item.month}({item.year})</td>
                    <td>{item.act.name}</td>
                    <td>{item.rule.name}</td>
                    <td>{item.activity.name}</td>
                    <td>{item.associateCompany.name}</td>
                    <td>{item.location.name}</td>
                    <td className="text-warning">{dayjs(item.dueDate).format('DD-MM-YYYY')}</td>
                    <td className="text-danger">{item.auditStatus}</td>
                    <td><StatusTmp status={item.status} /></td>
                    <td className="text-danger">{item.auditRemarks}</td>
                    <td>
                      <div className="d-flex flex-row align-items-center">
                        {/* Download */}
                        <span className="me-1" style={{ zoom: 1.6, opacity: 0.5, cursor: "pointer" }} onClick={() => item.download(item)}>
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.75 7.875V9.75H2.25V7.875H1V9.75C1 10.4375 1.5625 11 2.25 11H9.75C10.4375 11 11 10.4375 11 9.75V7.875H9.75Z" fill="#322C2D" />
                            <path d="M9.125 5.375L8.24375 4.49375L6.625 6.10625L6.625 1L5.375 1L5.375 6.10625L3.75625 4.49375L2.875 5.375L6 8.5L9.125 5.375Z" fill="#322C2D" />
                          </svg>
                        </span>
                        {/* Edit */}
                        <span className="ms-1" style={{ zoom: 1.6, opacity: 0.5, cursor: "pointer" }} onClick={() => item.edit(item)}>
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.5 10.8499C2.225 10.8499 1.9895 10.7521 1.7935 10.5564C1.5975 10.3607 1.49967 10.1252 1.5 9.8499V2.8499C1.5 2.5749 1.598 2.3394 1.794 2.1434C1.99 1.9474 2.22533 1.84957 2.5 1.8499H6.9625L5.9625 2.8499H2.5V9.8499H9.5V6.3749L10.5 5.3749V9.8499C10.5 10.1249 10.402 10.3604 10.206 10.5564C10.01 10.7524 9.77467 10.8502 9.5 10.8499H2.5ZM8.0875 2.1374L8.8 2.8374L5.5 6.1374V6.8499H6.2L9.5125 3.5374L10.225 4.2374L6.9125 7.5499C6.82083 7.64157 6.7145 7.71457 6.5935 7.7689C6.4725 7.82324 6.3455 7.85024 6.2125 7.8499H5C4.85833 7.8499 4.7395 7.8019 4.6435 7.7059C4.5475 7.6099 4.49967 7.49124 4.5 7.3499V6.1374C4.5 6.00407 4.525 5.8769 4.575 5.7559C4.625 5.6349 4.69583 5.52874 4.7875 5.4374L8.0875 2.1374ZM10.225 4.2374L8.0875 2.1374L9.3375 0.887402C9.5375 0.687402 9.77717 0.587402 10.0565 0.587402C10.3358 0.587402 10.5712 0.687402 10.7625 0.887402L11.4625 1.5999C11.6542 1.79157 11.75 2.0249 11.75 2.2999C11.75 2.5749 11.6542 2.80824 11.4625 2.9999L10.225 4.2374Z" fill="#322C2D" />
                          </svg>
                        </span>
                        {/* Save */}
                        {/* <span className="me-1" style={{ zoom: 1.6, opacity: 0.5, cursor: "pointer" }}>
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.5 3.5V10C10.5 10.275 10.4022 10.5105 10.2065 10.7065C10.0105 10.9022 9.775 11 9.5 11H2.5C2.225 11 1.9895 10.9022 1.7935 10.7065C1.59783 10.5105 1.5 10.275 1.5 10L1.5 2C1.5 1.725 1.59783 1.4895 1.7935 1.2935C1.9895 1.09783 2.225 1 2.5 1H8.5L10.5 3.5ZM9.5 3.925L8.075 2H2.5V10H9.5V3.925ZM6 9C6.41667 9 6.77083 8.85417 7.0625 8.5625C7.35417 8.27083 7.5 7.91667 7.5 7.5C7.5 7.08333 7.35417 6.72917 7.0625 6.4375C6.77083 6.14583 6.41667 6 6 6C5.58333 6 5.22917 6.14583 4.9375 6.4375C4.64583 6.72917 4.5 7.08333 4.5 7.5C4.5 7.91667 4.64583 8.27083 4.9375 8.5625C5.22917 8.85417 5.58333 9 6 9ZM3 4.575H7.5V3.5H3V4.575ZM2.5 3.925V10V2V3.925Z" fill="#322C2D" />
                          </svg>
                        </span> */}
                        {/* View */}
                        {/* <span style={{ zoom: 1.6, opacity: 0.5, cursor: "pointer" }}>
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 4.5C6.39782 4.5 6.77936 4.65804 7.06066 4.93934C7.34196 5.22064 7.5 5.60218 7.5 6C7.5 6.39782 7.34196 6.77936 7.06066 7.06066C6.77936 7.34196 6.39782 7.5 6 7.5C5.60218 7.5 5.22064 7.34196 4.93934 7.06066C4.65804 6.77936 4.5 6.39782 4.5 6C4.5 5.60218 4.65804 5.22064 4.93934 4.93934C5.22064 4.65804 5.60218 4.5 6 4.5ZM6 2.25C8.5 2.25 10.635 3.805 11.5 6C10.635 8.195 8.5 9.75 6 9.75C3.5 9.75 1.365 8.195 0.5 6C1.365 3.805 3.5 2.25 6 2.25ZM1.59 6C1.99413 6.82515 2.62165 7.52037 3.40124 8.00663C4.18083 8.49288 5.0812 8.75066 6 8.75066C6.9188 8.75066 7.81917 8.49288 8.59876 8.00663C9.37835 7.52037 10.0059 6.82515 10.41 6C10.0059 5.17485 9.37835 4.47963 8.59876 3.99337C7.81917 3.50712 6.9188 3.24934 6 3.24934C5.0812 3.24934 4.18083 3.50712 3.40124 3.99337C2.62165 4.47963 1.99413 5.17485 1.59 6Z" fill="#322C2D" />
                          </svg>
                        </span> */}
                      </div>
                    </td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
        {
          this.state.show &&
          <BulkUploadModal onClose={this.handleClose.bind(this)} onSubmit={this.getToDoByCriteria.bind(this)} />
        }
        {
          this.state.isAuditorModalShow &&
          <SubmitToAuditorModal todo={this.state.res} onClose={this.handleSubmitToAuditorModalClose.bind(this)} onSubmit={this.onSubmitToAuditorHandler} />
        }
        {
          this.state.edit && this.state.activity &&
          <EditActivity activity={this.state.activity} onClose={this.dismissEdit.bind(this)} onSubmit={this.getToDoByCriteria.bind(this)} />
        }
        {this.state.submitting && <PageLoader />}
      </div>
    );
  }
}

export default VendorActivityToDo;
