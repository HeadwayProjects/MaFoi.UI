import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import React, { useState } from "react";
import AuditorPerformance from "./AuditorPerformance";
import VendorPerformance from "./VendorPerformance";

const TABS = {
    AUDITOR: 'auditor',
    VENDOR: 'vendor'
};

function AuditorDashboard() {
    const [activeTab, setActiveTab] = useState(TABS.AUDITOR);

    return (
        <div style={{ paddingBottom: '44px', minHeight: '100%' }} className="d-flex flex-column bg-dashboard">
            <div className="d-flex mb-4 p-2 align-items-center pageHeading">
                <h4 className="mb-0">Auditor Dashboard</h4>
                <div className="d-flex align-items-end h-100">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0 d-flex justify-content-end">
                            <li className="breadcrumb-item">Home</li>
                            <li className="breadcrumb-item">Dashboard</li>
                        </ol>
                    </nav>
                </div>
            </div>
            <Tabs className="dashboardTabs mx-2"
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}>
                <Tab eventKey={TABS.AUDITOR} title="Auditor Performance">
                    {activeTab === TABS.AUDITOR && <AuditorPerformance />}
                </Tab>
                <Tab eventKey={TABS.VENDOR} title="Vendor Performance">
                    {activeTab === TABS.VENDOR && <VendorPerformance />}
                </Tab>
            </Tabs>
        </div>
    );
}

export default AuditorDashboard;