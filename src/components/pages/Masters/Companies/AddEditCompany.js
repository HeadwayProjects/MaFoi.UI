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
import CompanySMTP from "./CompanySMTP";

const STEPS = {
    DETAILS: 'STEP1',
    SPOC: 'STEP2',
    TDS_PF: 'STEP3',
    SMTP: 'STEP4'
};

function AddEditCompany({ action, company, parentCompany, changeView, _t }) {
    const [payload, setPayload] = useState();
    const [doNext, setDoNext] = useState();
    const [isParentCompany] = useState(!Boolean(parentCompany));
    const [activeStep, setActiveStep] = useState(STEPS.DETAILS);
    const [companyDetails, setCompanyDetails] = useState(company);
    const { uploadLogo, uploading } = useUploadLogo(({ key, value }) => {
        if (key === API_RESULT.SUCCESS) {
            toast.success('Logo uploaded successfully.');
            const _company = { ...payload, id: companyDetails.id };
            delete _company.file;
            setCompanyDetails({ ..._company, logo: value });
            setPayload(null);
            handleNext();
        } else {
            toast.error(value || ERROR_MESSAGES.UPLOAD_FILE);
        }
    }, errorCallback);
    const { createCompany, creating } = useCreateCompany(({ id, name, message }) => {
        if (id) {
            toast.success(`Company ${name} created successfully.`);
            setCompanyDetails({ ...payload, id, parentCompany });
            uploadCompanyLogo(id);
        } else {
            toast.error(message || ERROR_MESSAGES.ERROR);
        }
    }, errorCallback);
    const { updateCompany, updating } = useUpdateCompany(({ id, name, message }) => {
        if (id) {
            toast.success(`Company ${name} updated successfully.`);
            if (payload.file) {
                uploadCompanyLogo(id);
            } else {
                setCompanyDetails(payload);
                setPayload(null);
                handleNext();
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

    function submitDetails(_company, next) {
        if (_company) {
            setPayload(_company);
            setDoNext(next);
            const _x = { ..._company };
            delete _x.file;
            if (companyDetails) {
                updateCompany(_x);
            } else {
                createCompany(_x);
            }
        }
    }

    function handleNext() {
        if (doNext) {
            setDoNext(false);
            switch (activeStep) {
                case STEPS.DETAILS:
                    setActiveStep(STEPS.SPOC);
                    break;
                case STEPS.SPOC:
                    setActiveStep(STEPS.TDS_PF);
                    break;
                case STEPS.TDS_PF:
                    setActiveStep(STEPS.SMTP);
                    break;
                case STEPS.SMTP:
                    parentCompany ? backToAssociateCompaniesList() : backToCompaniesList();
                    break;
                default:
                // Do nothing
            }
        }
    }

    function uploadCompanyLogo(id) {
        const formData = new FormData();
        const files = [...payload.file.inputFiles];
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
                        <img src={companyDetails.logo} alt="Logo Not Available"/>
                    </div>
                }
                <Tabs className="dashboardTabs mx-2"
                    activeKey={activeStep}
                    onSelect={(k) => setActiveStep(k)}>
                    <Tab eventKey={STEPS.DETAILS} title="Company Details">
                        {
                            activeStep === STEPS.DETAILS &&
                            <CompanyDetails company={companyDetails} parentCompany={parentCompany} _t={_t}
                                onPrevious={parentCompany ? backToAssociateCompaniesList : backToCompaniesList}
                                onNext={() => setActiveStep(STEPS.SPOC)}
                                onSubmit={submitDetails} />
                        }
                    </Tab>
                    <Tab eventKey={STEPS.SPOC} title="SPOC Details" disabled={!Boolean(companyDetails)}>
                        {
                            activeStep === STEPS.SPOC &&
                            <CompanySPOC company={companyDetails} parentCompany={parentCompany}
                                onPrevious={() => setActiveStep(STEPS.DETAILS)}
                                onNext={() => setActiveStep(STEPS.TDS_PF)}
                                onSubmit={submitDetails} />
                        }
                    </Tab>
                    <Tab eventKey={STEPS.TDS_PF} title="Statutory Details" disabled={!Boolean(companyDetails)}>
                        {
                            activeStep === STEPS.TDS_PF &&
                            <CompanyTDS company={companyDetails} parentCompany={parentCompany}
                                onPrevious={() => setActiveStep(STEPS.SPOC)}
                                onNext={() => setActiveStep(STEPS.SMTP)}
                                onSubmit={submitDetails} />
                        }
                    </Tab>
                    <Tab eventKey={STEPS.SMTP} title="SMTP Details" disabled={!Boolean(companyDetails)}>
                        {
                            activeStep === STEPS.SMTP &&
                            <CompanySMTP company={companyDetails} parentCompany={parentCompany}
                                onPrevious={() => setActiveStep(STEPS.TDS_PF)}
                                onNext={parentCompany ? backToAssociateCompaniesList : backToCompaniesList}
                                onSubmit={submitDetails} />
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