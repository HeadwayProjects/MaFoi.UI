import React from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Dashboard from "./components/pages/Dashboard/Dashboard";
import ManageUsers from "./components/pages/ManageUsers";
import InputModule from "./components/pages/InputModule";
import TaskManagement from "./components/pages/TaskManagement";
import Reports from "./components/pages/Reports";
import AuditorActivityToDo from "./components/pages/Dashboard/auditorActivityToDo";
import Login from "./components/pages/login";
import LayoutWithSideNav from "./components/shared/LayoutWithSideNav";
import VendorDashboard from "./components/pages/Vendor/Dashboard/Dashboard";
import ActivitiesManagement from "./components/pages/Vendor/TaskManagement/ActivitiesManagement";

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<LayoutWithSideNav><Dashboard /></LayoutWithSideNav>} />
          <Route path="/vendor-dashboard" element={<LayoutWithSideNav><VendorDashboard /></LayoutWithSideNav>} />
          <Route path="/dashboard/activities" element={<LayoutWithSideNav><ActivitiesManagement /></LayoutWithSideNav>} />
          <Route path="/vendor-activity-todo" element={<LayoutWithSideNav><ActivitiesManagement /></LayoutWithSideNav>} />
          <Route path="/auditor-activity-todo" element={<LayoutWithSideNav><AuditorActivityToDo /></LayoutWithSideNav>} />
          <Route path="/manage-users" element={<LayoutWithSideNav><ManageUsers /></LayoutWithSideNav>} />
          <Route path="/input-module" element={<LayoutWithSideNav><InputModule /></LayoutWithSideNav>} />
          <Route path="/task-management" element={<LayoutWithSideNav><TaskManagement /></LayoutWithSideNav>} />
          <Route path="/reports" element={<LayoutWithSideNav><Reports /></LayoutWithSideNav>} />
        </Routes>
      </Router>
    </QueryClientProvider>
  )
}
export default App;
