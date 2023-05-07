import React, { useState } from "react";
import Stepper from "react-stepper-horizontal"
import { preventDefault } from "../../../../utils/common";
import { VIEWS } from "./Companies";
import { Link } from "raviger";
import styles from "../Masters.module.css";
import { STEPPER_CONFIG } from "../../../../utils/constants";
import CompanyDetails from "./CompanyDetails";
import CompanySPOC from "./CompanySPOC";
import CompanyTDS from "./CompanyTDS";
import { Tab, Tabs } from "react-bootstrap";

const STEPS = {
    DETAILS: 'STEP1',
    SPOC: 'STEP2',
    TDS_PF: 'STEP3'
};

function AddEditCompany({ action, company, parentCompany, changeView }) {
    const [isParentCompany] = useState(!Boolean(parentCompany));
    const [activeStep, setActiveStep] = useState(STEPS.DETAILS);
    function backToCompaniesList(e) {
        preventDefault(e);
        changeView(VIEWS.LIST);
    }
    function backToAssociateCompaniesList(e) {
        preventDefault(e);
        changeView(VIEWS.ASSOCIATE_COMPANIES, { company: parentCompany });
    }

    // function onStepChange(e) {
    //     const tab = e.target.text;
    //     setActiveStep(TAB_INDEX.indexOf(tab));
    // }

    function submitDetails() {
        // setActiveStep(TAB_INDEX.indexOf(STEPS.SPOC));
    }

    function submitSPOC() {
        // setActiveStep(TAB_INDEX.indexOf(STEPS.TDS_PF));
    }

    function submitTDS() {
        parentCompany ? backToAssociateCompaniesList() : backToCompaniesList()
    }

    return (
        <>
            <div className="d-flex flex-column h-full">
                <nav aria-label="breadcrumb">
                    <ol className={`breadcrumb d-flex justify-content-start my-3 px-2 ${styles.breadcrumb}`}>
                        <li className="breadcrumb-item ">
                            <Link href="/" onClick={backToCompaniesList} className="fw-bold">Companies</Link>
                        </li>
                        {
                            !isParentCompany &&
                            <li className="breadcrumb-item ">
                                <Link href="/" onClick={backToAssociateCompaniesList} className="fw-bold">{parentCompany.name}</Link>
                            </li>
                        }
                        <li className="breadcrumb-item">
                            <span className="fw-bold">Add New{!isParentCompany ? ' Associate' : ''} Company</span>
                        </li>
                    </ol>
                </nav>
                <Tabs className="dashboardTabs mx-2"
                    activeKey={activeStep}
                    onSelect={(k) => setActiveStep(k)}>
                    <Tab eventKey={STEPS.DETAILS} title="Company Details">
                        {
                            activeStep === STEPS.DETAILS &&
                            <CompanyDetails onNext={submitDetails} onPrevious={parentCompany ? backToAssociateCompaniesList : backToCompaniesList} />
                        }
                    </Tab>
                    <Tab eventKey={STEPS.SPOC} title="SPOC Details" disabled={!Boolean(company)}>
                        {
                            activeStep === STEPS.SPOC &&
                            <CompanySPOC onNext={submitSPOC} onSTEPSPrevious={() => {}}/>
                        }
                    </Tab>
                    <Tab eventKey={STEPS.TDS_PF} title="TDS/PF" disabled={!Boolean(company)}>
                        {
                        activeStep  === STEPS.TDS_PF &&
                            <CompanyTDS onNext={submitTDS} onPrevious={() => {}}/>
                        }
                    </Tab>
                </Tabs>
                {/* <Stepper steps={steps} activeStep={activeStep} {...STEPPER_CONFIG} className="custom-stepper" />
                {
                    activeStep === TAB_INDEX.indexOf(STEPS.DETAILS) &&
                    <CompanyDetails onNext={submitDetails} onPrevious={parentCompany ? backToAssociateCompaniesList : backToCompaniesList}/>
                }
                {
                    activeStep === TAB_INDEX.indexOf(.SPOC) &&
                    <CompanySPOC onNext={submitSPOC} onSTEPSPrevious={() => setActiveStep(TAB_INDEX.indexOf(STEPS.DETAILS))}/>
                }
                {
                    activeStep === TAB_INDEX.indexOf(STEPS.TDS_PF) &&
                    <CompanyTDS onNext={submitTDS} onPrevious={() => setActiveStep(TAB_INDEX.indexOf(STEPS.SPOC))}/>
                } */}
            </div>
        </>
    )
}

export default AddEditCompany;