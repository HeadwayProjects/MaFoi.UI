import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DateTime } from 'luxon'
import "./App.css";
import Dashboard from "./components/pages/Dashboard/Dashboard";
import Vendordashboard from "./components/pages/Vendordashboard/Vendordashboard";
import VendorActivityToDo from "./components/pages/Vendordashboard/vendorActivityToDo"
import ManageUsers from "./components/pages/ManageUsers";
import InputModule from "./components/pages/InputModule";
import TaskManagement from "./components/pages/TaskManagement";
import Reports from "./components/pages/Reports";
import AuditorActivityToDo from "./components/pages/Dashboard/auditorActivityToDo";
import Login from "./components/pages/login";
import LayoutWithSideNav from "./components/shared/LayoutWithSideNav";


window.DateTime = DateTime;

class App extends Component {
  render() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<LayoutWithSideNav><Dashboard /></LayoutWithSideNav>} />
          <Route path="/vendor-dashboard" element={<LayoutWithSideNav><Vendordashboard /></LayoutWithSideNav>} />
          <Route path="/vendor-activity-todo" element={<LayoutWithSideNav><VendorActivityToDo /></LayoutWithSideNav>} />
          <Route path="/auditor-activity-todo" element={<LayoutWithSideNav><AuditorActivityToDo /></LayoutWithSideNav>} />
          <Route path="/manage-users" element={<LayoutWithSideNav><ManageUsers /></LayoutWithSideNav>} />
          <Route path="/input-module" element={<LayoutWithSideNav><InputModule /></LayoutWithSideNav>} />
          <Route path="/task-management" element={<LayoutWithSideNav><TaskManagement /></LayoutWithSideNav>} />
          <Route path="/reports" element={<LayoutWithSideNav><Reports /></LayoutWithSideNav>} />
        </Routes>
      </Router>
    );
  }
}

export default App;
