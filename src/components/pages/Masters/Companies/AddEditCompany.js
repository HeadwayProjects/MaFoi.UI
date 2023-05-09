import React, { useState } from "react";
import { preventDefault } from "../../../../utils/common";
import { VIEWS } from "./Companies";
import { Link } from "raviger";
import styles from "../Masters.module.css";
import { ERROR_MESSAGES } from "../../../../utils/constants";
import CompanyDetails from "./CompanyDetails";
import CompanySPOC from "./CompanySPOC";
import CompanyTDS from "./CompanyTDS";
import { Tab, Tabs } from "react-bootstrap";
import { useCreateCompany, useUpdateCompany } from "../../../../backend/masters";
import PageLoader from "../../../shared/PageLoader";
import { toast } from "react-toastify";

const STEPS = {
    DETAILS: 'STEP1',
    SPOC: 'STEP2',
    TDS_PF: 'STEP3'
};

function AddEditCompany({ action, company, parentCompany, changeView }) {
    const [isParentCompany] = useState(!Boolean(parentCompany));
    const [activeStep, setActiveStep] = useState(STEPS.DETAILS);
    const [companyDetails, setCompanyDetails] = useState(company);
    const { createCompany, creating } = useCreateCompany((response) => {
        if (response.id) {
            toast.success(`Company ${response.name} created successfully.`);
           setActiveStep(STEPS.SPOC);
        } else {
            toast.error(response.message || ERROR_MESSAGES.ERROR);
        }
    }, () => {
        toast.error(ERROR_MESSAGES.DEFAULT);
    });
    const { updateCompany, updating } = useUpdateCompany((response) => {
        if (response.id) {
            toast.success(`Company ${response.name} updated successfully.`);
        } else {
            toast.error(response.message || ERROR_MESSAGES.ERROR);
        }
    }, () => {
        toast.error(ERROR_MESSAGES.DEFAULT);
    });
    function backToCompaniesList(e) {
        preventDefault(e);
        changeView(VIEWS.LIST);
    }
    function backToAssociateCompaniesList(e) {
        preventDefault(e);
        changeView(VIEWS.ASSOCIATE_COMPANIES, { company: parentCompany });
    }

    function submitDetails(_company, step) {
        if (_company) {
            setCompanyDetails(_company);
        }
        if (companyDetails) {
            updateCompany(_company);
        } else {
            createCompany(_company);
        }
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
                            <span className="fw-bold">{Boolean(companyDetails) ? companyDetails.name : 'Add New Company'}</span>
                        </li>
                    </ol>
                </nav>
                <Tabs className="dashboardTabs mx-2"
                    activeKey={activeStep}
                    onSelect={(k) => setActiveStep(k)}>
                    <Tab eventKey={STEPS.DETAILS} title="Company Details">
                        {
                            activeStep === STEPS.DETAILS &&
                            <CompanyDetails company={companyDetails} onNext={submitDetails} onPrevious={parentCompany ? backToAssociateCompaniesList : backToCompaniesList} />
                        }
                    </Tab>
                    <Tab eventKey={STEPS.SPOC} title="SPOC Details" disabled={!Boolean(companyDetails)}>
                        {
                            activeStep === STEPS.SPOC &&
                            <CompanySPOC company={companyDetails} onNext={submitDetails} onSTEPSPrevious={() => { }} />
                        }
                    </Tab>
                    <Tab eventKey={STEPS.TDS_PF} title="Statutory Details" disabled={!Boolean(companyDetails)}>
                        {
                            activeStep === STEPS.TDS_PF &&
                            <CompanyTDS company={companyDetails} onNext={submitDetails} onPrevious={() => { }} />
                        }
                    </Tab>
                </Tabs>
            </div>
            {
                (creating || updating) &&
                <PageLoader>{creating ? 'Creating Company...' : 'Updating Company...'}</PageLoader>
            }
        </>
    )
}

export default AddEditCompany;