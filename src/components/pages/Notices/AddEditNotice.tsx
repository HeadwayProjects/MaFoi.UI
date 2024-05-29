import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { GetActionTitle } from "../Masters/Master.constants";
import Stepper from "../../common/Stepper/Stepper";
import StepperItem from "../../common/Stepper/StepperItem";
import { ACTIONS } from "../../common/Constants";
import CompanyDetails from "./CompanyDetails";
import RuleComplianceDetails from "./RuleComplianceDetails";
import NoticeDetails from "./NoticeDetails";
import { getNoticeData, getNoticePayload } from "./Notices.constants";
import { useAddNotice, useUpdateNotice, useUploadDocument } from "../../../backend/compliance";
import PageLoader from "../../shared/PageLoader";
import { toast } from "react-toastify";
import { ERROR_MESSAGES } from "../../../utils/constants";

enum Steps {
    COMPANY_DETAILS = 1,
    RULE_COMPLIANCE = 2,
    NOTICE_DETAILS = 3,
    ALL = -1
}

export default function AddEditNotice({ action, onClose, onSubmit, data }: any) {
    const [activeStep, setActive] = useState(action === ACTIONS.VIEW ? Steps.ALL : Steps.COMPANY_DETAILS);
    const [notice, setNotice] = useState<any>(action === ACTIONS.ADD ? {} : null);
    const { uploadDocument } = useUploadDocument(() => {
        if (action === ACTIONS.ADD) {
            toast.success('Notice created successfully.');
        } else {
            toast.success('Notice updated successfully.');
        }
        onSubmit();
    });
    const { addNotice, adding } = useAddNotice(({ id }: any) => {
        if (Boolean(id)) {
            if (notice.file) {
                handleUpload({...notice, id});
            } else {
                toast.success('Notice created successfully.');
                onSubmit();
            }
        } else {
            toast.error(ERROR_MESSAGES.DEFAULT);
        }
    }, () => {
        toast.error(ERROR_MESSAGES.DEFAULT);
    })
    const { updateNotice, updating } = useUpdateNotice(({ id }: any) => {
        if (Boolean(id)) {
            if (notice.file) {
                handleUpload({...notice, id});
            } else {
                toast.success('Notice updated successfully.');
                onSubmit();
            }
        } else {
            toast.error(ERROR_MESSAGES.DEFAULT);
        }
    }, () => {
        toast.error(ERROR_MESSAGES.DEFAULT);
    })

    function handleMappingsSubmit(_data: any) {
        setNotice(_data);
        setActive(Steps.RULE_COMPLIANCE);
    }

    function handleRuleComplianceSubmit(_data: any) {
        setNotice(_data);
        setActive(Steps.NOTICE_DETAILS);
    }

    function handleNoticeDetailsSubmit(_data: any) {
        setNotice(_data);
        const payload: any = getNoticePayload(_data);
        if (action === ACTIONS.ADD) {
            addNotice(payload);
        } else {
            updateNotice(payload);
        }
    }

    function handleUpload({ file, id }: any) {
        const formData = new FormData();
        const files = [...file.inputFiles];
        files.forEach(_file => {
            formData.append('file', _file, _file.name);
        });
        uploadDocument({
            formData,
            id
        });
    }

    useEffect(() => {
        if (data) {
            setNotice(getNoticeData(data))
        }
    }, [data]);

    return (
        <>

            <Modal show={true} backdrop="static" dialogClassName="drawer noFooter" animation={false}>
                <Modal.Header closeButton={true} onHide={onClose}>
                    <Modal.Title className="bg">{GetActionTitle('Notice', action, false)}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Stepper>
                        <StepperItem title="1. Company Details" stepId={Steps.COMPANY_DETAILS} activeStep={activeStep}
                            valid={action === ACTIONS.ADD && activeStep > Steps.COMPANY_DETAILS}>
                            {
                                (activeStep === Steps.COMPANY_DETAILS || activeStep === Steps.ALL) && Boolean(notice) &&
                                <CompanyDetails action={action} data={notice} onSubmit={handleMappingsSubmit} />
                            }
                        </StepperItem>
                        <StepperItem title="2. Rule Compliance" stepId={Steps.RULE_COMPLIANCE} activeStep={activeStep}
                            valid={(action === ACTIONS.ADD || action === ACTIONS.EDIT) && activeStep > Steps.RULE_COMPLIANCE}>
                            {
                                (activeStep === Steps.RULE_COMPLIANCE || activeStep === Steps.ALL) && Boolean(notice) &&
                                <RuleComplianceDetails action={action} data={notice} onSubmit={handleRuleComplianceSubmit}
                                    onCancel={() => setActive(Steps.COMPANY_DETAILS)} />
                            }
                        </StepperItem>
                        <StepperItem title="3. Notice Details" stepId={Steps.NOTICE_DETAILS} activeStep={activeStep}
                            valid={activeStep > Steps.NOTICE_DETAILS}>
                            {
                                (activeStep === Steps.NOTICE_DETAILS || activeStep === Steps.ALL) && Boolean(notice) &&
                                <NoticeDetails action={action} data={notice} onSubmit={handleNoticeDetailsSubmit}
                                    onCancel={() => setActive(Steps.RULE_COMPLIANCE)} />
                            }
                        </StepperItem>
                    </Stepper>
                </Modal.Body>
            </Modal>
            {
                (adding || updating) && <PageLoader />
            }
        </>
    )
}