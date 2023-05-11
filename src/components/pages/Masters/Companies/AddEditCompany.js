import React, { useState } from "react";
import { preventDefault } from "../../../../utils/common";
import { VIEWS } from "./Companies";
import { Link } from "raviger";
import styles from "../Masters.module.css";
import { API_RESULT, ERROR_MESSAGES } from "../../../../utils/constants";
import CompanyDetails from "./CompanyDetails";
import CompanySPOC from "./CompanySPOC";
import CompanyTDS from "./CompanyTDS";
import { Tab, Tabs } from "react-bootstrap";
import { useCreateCompany, useUpdateCompany, useUploadLogo } from "../../../../backend/masters";
import PageLoader from "../../../shared/PageLoader";
import { toast } from "react-toastify";
import companyStyles from "./Companies.module.css";

const STEPS = {
    DETAILS: 'STEP1',
    SPOC: 'STEP2',
    TDS_PF: 'STEP3'
};

function AddEditCompany({ action, company, parentCompany, changeView }) {
    const [isParentCompany] = useState(!Boolean(parentCompany));
    const [activeStep, setActiveStep] = useState(STEPS.DETAILS);
    const [companyDetails, setCompanyDetails] = useState(company);
    const { uploadLogo, uploading } = useUploadLogo(({ key, value }) => {
        if (key === API_RESULT.SUCCESS) {
            toast.success('Logo uploaded successfully.');
            if (!companyDetails.logo) {
                setActiveStep(STEPS.SPOC);
            }
            const _company = { ...companyDetails };
            delete _company.file;
            setCompanyDetails({ ..._company, logo: value });
        } else {
            toast.error(value || ERROR_MESSAGES.UPLOAD_FILE);
        }
    }, errorCallback);
    const { createCompany, creating } = useCreateCompany(({ id, name, message }) => {
        if (id) {
            toast.success(`Company ${name} created successfully.`);
            setCompanyDetails({ ...companyDetails, id });
            uploadCompanyLogo(id);
        } else {
            toast.error(message || ERROR_MESSAGES.ERROR);
        }
    }, errorCallback);
    const { updateCompany, updating } = useUpdateCompany(({ id, name, message }) => {
        if (id) {
            toast.success(`Company ${name} updated successfully.`);
            if (companyDetails.file) {
                uploadCompanyLogo(id);
            }
        } else {
            toast.error(message || ERROR_MESSAGES.ERROR);
        }
    }, errorCallback);

    function errorCallback() {
        toast.error(ERROR_MESSAGES.DEFAULT);
    }

    function backToCompaniesList(e) {
        preventDefault(e);
        changeView(VIEWS.LIST);
    }

    function backToAssociateCompaniesList(e) {
        preventDefault(e);
        changeView(VIEWS.LIST, { parentCompany });
    }

    function submitDetails(_company, step) {
        if (_company) {
            setCompanyDetails({ ..._company });
        }
        delete _company.file;
        if (companyDetails) {
            updateCompany(_company);
        } else {
            createCompany(_company);
        }
    }

    function uploadCompanyLogo(id) {
        const formData = new FormData();
        const files = [...companyDetails.file.inputFiles];
        files.forEach(file => {
            formData.append('file', file, file.name);
        });
        uploadLogo({ id, formData })
    }

    return (
        <>
            <div className="d-flex flex-column h-full position-relative">
                <nav aria-label="breadcrumb">
                    <ol className={`breadcrumb d-flex justify-content-start my-3 px-2 ${styles.breadcrumb}`}>
                        {
                            isParentCompany &&
                            <li className="breadcrumb-item ">
                                <Link href="/" onClick={backToCompaniesList} className="fw-bold">Companies</Link>
                            </li>
                        }
                        {
                            !isParentCompany &&
                            <li className="breadcrumb-item ">
                                <Link href="/" onClick={backToAssociateCompaniesList} className="fw-bold">Associate Companies</Link>
                            </li>
                        }
                        <li className="breadcrumb-item">
                            <span className="fw-bold">{Boolean(companyDetails) ? companyDetails.name : 'Add New Company'}</span>
                        </li>
                    </ol>
                </nav>
                {
                    companyDetails && companyDetails.logo &&
                    <div className={`${companyStyles.imageContainer}`}>
                        <img src={companyDetails.logo} />
                    </div>
                }
                <Tabs className="dashboardTabs mx-2"
                    activeKey={activeStep}
                    onSelect={(k) => setActiveStep(k)}>
                    <Tab eventKey={STEPS.DETAILS} title="Company Details">
                        {
                            activeStep === STEPS.DETAILS &&
                            <CompanyDetails company={companyDetails} onNext={submitDetails} parentCompany={parentCompany}
                                onPrevious={parentCompany ? backToAssociateCompaniesList : backToCompaniesList} />
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
            {
                uploading && <PageLoader>Uploading...</PageLoader>
            }
        </>
    )
}

export default AddEditCompany;