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

const STEPS = {
    DETAILS: 'Company Details',
    SPOC: 'SPOC Details',
    TDS_PF: 'TDS/PF/ESIC'
};

const TAB_INDEX = [
    STEPS.DETAILS, STEPS.SPOC, STEPS.TDS_PF
];

function AddEditCompany({ action, company, parentCompany, changeView }) {
    const [isParentCompany] = useState(!Boolean(parentCompany));
    const steps = [
        { title: STEPS.DETAILS, onClick: onStepChange.bind(this) },
        { title: STEPS.SPOC, onClick: onStepChange.bind(this) },
        { title: STEPS.TDS_PF, onClick: onStepChange.bind(this) }
    ];
    const [activeStep, setActiveStep] = useState(0);
    function backToCompaniesList(e) {
        preventDefault(e);
        changeView(VIEWS.LIST);
    }
    function backToAssociateCompaniesList(e) {
        preventDefault(e);
        changeView(VIEWS.ASSOCIATE_COMPANIES, { company: parentCompany });
    }

    function onStepChange(e) {
        const tab = e.target.text;
        setActiveStep(TAB_INDEX.indexOf(tab));
    }

    function submitDetails() {
        setActiveStep(TAB_INDEX.indexOf(STEPS.SPOC));
    }

    function submitSPOC() {
        setActiveStep(TAB_INDEX.indexOf(STEPS.TDS_PF));
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
                <Stepper steps={steps} activeStep={activeStep} {...STEPPER_CONFIG} className="custom-stepper" />
                {
                    activeStep === TAB_INDEX.indexOf(STEPS.DETAILS) &&
                    <CompanyDetails onNext={submitDetails} onPrevious={parentCompany ? backToAssociateCompaniesList : backToCompaniesList}/>
                }
                {
                    activeStep === TAB_INDEX.indexOf(STEPS.SPOC) &&
                    <CompanySPOC onNext={submitSPOC} onPrevious={() => setActiveStep(TAB_INDEX.indexOf(STEPS.DETAILS))}/>
                }
                {
                    activeStep === TAB_INDEX.indexOf(STEPS.TDS_PF) &&
                    <CompanyTDS onNext={submitTDS} onPrevious={() => setActiveStep(TAB_INDEX.indexOf(STEPS.SPOC))}/>
                }
            </div>
        </>
    )
}

export default AddEditCompany;