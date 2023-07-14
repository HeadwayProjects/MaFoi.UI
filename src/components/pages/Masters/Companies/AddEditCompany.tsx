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
import { useCreateCompany, useGetCompanies, useUpdateCompany, useUploadLogo } from "../../../../backend/masters";
import PageLoader from "../../../shared/PageLoader";
import { toast } from "react-toastify";
import companyStyles from "./Companies.module.css";
import CompanySMTP from "./CompanySMTP";
import { DEFAULT_PAYLOAD } from "../../../common/Table";
import { ResponseModel } from "../../../../models/responseModel";

enum STEPS {
    DETAILS = 'STEP1',
    SPOC = 'STEP2',
    TDS_PF = 'STEP3',
    SMTP = 'STEP4'
};

function AddEditCompany({ company, parentCompany, changeView, _t }: any) {
    const [payload, setPayload] = useState<any>();
    const [doNext, setDoNext] = useState<any>();
    const [isParentCompany] = useState(!Boolean(parentCompany));
    const [activeStep, setActiveStep] = useState(STEPS.DETAILS);
    const [companyDetails, setCompanyDetails] = useState<any>(company);
    const { companies, refetch } = useGetCompanies({
        ...DEFAULT_PAYLOAD,
        filters: [
            { columnName: 'isCopied', value: 'YES' },
            { columnName: 'isParent', value: 'false' },
            { columnName: 'parentCompanyId', value: (companyDetails || {}).id }
        ]
    }, Boolean((companyDetails || {}).id && !parentCompany))
    const { uploadLogo, uploading } = useUploadLogo(({ key, value }: ResponseModel) => {
        if (key === API_RESULT.SUCCESS) {
            toast.success('Logo uploaded successfully.');
            const _company = { ...payload, id: companyDetails.id };
            delete _company.file;
            if (_company.isCopied === 'YES') {
                updateAssociateCompany({ ..._company, logo: value });
            }
            setCompanyDetails({ ..._company, logo: value });
            setPayload(null);
            handleNext();
        } else {
            toast.error(value || ERROR_MESSAGES.UPLOAD_FILE);
        }
    }, errorCallback);
    const { createCompany, creating } = useCreateCompany(({ key, value }: ResponseModel) => {
        if (key === API_RESULT.SUCCESS) {
            toast.success(`Company ${payload.name} created successfully.`);
            setCompanyDetails({ ...payload, id: value, parentCompany });
            uploadCompanyLogo(value);
        } else {
            toast.error(value === 'DUPLICATE' ? 'Company with similar name or code already exists.' : (value || ERROR_MESSAGES.ERROR));
        }
    }, errorCallback);
    const { updateCompany, updating } = useUpdateCompany(({ key, value }: ResponseModel) => {
        if (key === API_RESULT.SUCCESS) {
            toast.success(`Company ${payload.name} updated successfully.`);
            if (payload.file) {
                uploadCompanyLogo(value);
            } else {
                setCompanyDetails(payload);
                if (payload.isCopied === 'YES') {
                    updateAssociateCompany(payload);
                }
                setPayload(null);
                handleNext();
            }
        } else {
            toast.error(value === 'DUPLICATE' ? 'Company with similar name or code already exists.' : (value || ERROR_MESSAGES.ERROR));
        }
    }, errorCallback);
    const { createCompany: _createAssociateCompany } = useCreateCompany(refetch);
    const { updateCompany: _updateAssociateCompany } = useUpdateCompany();

    function errorCallback() {
        toast.error(ERROR_MESSAGES.DEFAULT);
    }

    function backToCompaniesList(e?: any) {
        preventDefault(e);
        changeView(VIEWS.LIST);
    }

    function backToAssociateCompaniesList(e?: any) {
        preventDefault(e);
        changeView(VIEWS.LIST, { parentCompany });
    }

    function submitDetails(_company: any, next: string) {
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

    function uploadCompanyLogo(id: string) {
        const formData = new FormData();
        const files = [...payload.file.inputFiles];
        files.forEach(file => {
            formData.append('file', file, file.name);
        });
        uploadLogo({ id, formData })
    }

    function updateAssociateCompany(company: any) {
        const acRequest = { ...company, isParent: false, isCopied: 'YES', parentCompanyId: company.id };
        delete acRequest.id;
        delete acRequest.parentCompany;
        if ((companies || []).length) {
            acRequest.id = companies[0].id;
            _updateAssociateCompany(acRequest);
        } else {
            _createAssociateCompany(acRequest);
        }
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
                        <img src={companyDetails.logo} alt="Logo Not Available" />
                    </div>
                }
                <Tabs className="dashboardTabs mx-2"
                    activeKey={activeStep}
                    onSelect={(k: any) => setActiveStep(k)}>
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