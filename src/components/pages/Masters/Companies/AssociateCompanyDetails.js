import React, { useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import { Button } from "react-bootstrap";
import { API_DELIMITER, UI_DELIMITER } from "../../../../utils/constants";
import { getValue } from "../../../../utils/common";
import FormRenderer, { ComponentMapper, FormTemplate, componentTypes } from "../../../common/FormRenderer";
import { GetActionTitle } from "../Master.constants";
import { COMPANY_STATUS } from "./Companies.constants";
import styles from "./Companies.module.css";
import { useGetSmtpDetails } from "../../../../backend/masters";

function AssociateCompanyDetails({ action, parentCompany, data, onClose }) {
    const [t] = useState(new Date().getTime());
    const [associateCompany, setAssociateCompany] = useState({ hideButtons: true });
    const { smtp, isFetching } = useGetSmtpDetails((data || {}).id, { t }, Boolean((data || {}).id));

    const schema = {
        fields: [
            {
                component: componentTypes.TAB_ITEM,
                name: 'subHeader1',
                content: 'Company Details',
                className: 'text-lg fw-bold pb-0'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'code',
                label: 'Short Code',
                content: getValue(associateCompany, 'code') || '-NA-'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'name',
                label: 'Name',
                content: getValue(associateCompany, 'name') || '-NA-'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'parentCompanyId',
                label: 'Parent Company',
                content: getValue(parentCompany, 'label') || '-NA-'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'businessType',
                label: 'Business Type',
                content: (getValue(associateCompany, 'businessType') || '').replaceAll(API_DELIMITER, UI_DELIMITER) || '-NA-'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'websiteUrl',
                label: 'Website Url',
                content: getValue(associateCompany, 'websiteUrl') || '-NA-'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'establishmentType',
                label: 'Estabishment Type',
                content: (getValue(associateCompany, 'establishmentType') || '').replaceAll(API_DELIMITER, UI_DELIMITER) || '-NA-'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'employees',
                label: 'Employees',
                content: getValue(associateCompany, 'employees') || '-NA-'
            },
            {
                component: componentTypes.TAB_ITEM,
                name: 'subHeader2',
                content: 'Corporate Register Office Address',
                className: 'text-lg fw-bold pb-0'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'companyAddress',
                label: 'Address',
                content: getValue(associateCompany, 'companyAddress') || '-NA-'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'address2',
                label: 'City/State/Country',
                content: [getValue(associateCompany, 'city'), getValue(associateCompany, 'state'), getValue(associateCompany, 'country')].join('/') || '-NA-'
            },
            {
                component: componentTypes.TAB_ITEM,
                name: 'subHeader3',
                content: 'Company Phone',
                className: 'text-lg fw-bold pb-0'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'contactNumber',
                label: 'Phone',
                content: getValue(associateCompany, 'contactNumber') || '-NA-'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'email',
                label: 'Email',
                content: getValue(associateCompany, 'email') || '-NA-'
            },
            {
                component: componentTypes.TAB_ITEM,
                name: 'subHeader4',
                content: 'Contact Person',
                className: 'text-lg fw-bold pb-0'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'contactPersonName',
                label: 'Name',
                content: getValue(associateCompany, 'contactPersonName') || '-NA-'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'contactPersonDesignation',
                label: 'Designation',
                content: getValue(associateCompany, 'contactPersonDesignation') || '-NA-'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'contactPersonDepartment',
                label: 'Depatment',
                content: getValue(associateCompany, 'contactPersonDepartment') || '-NA-'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'contactPersonMobile',
                label: 'Phone',
                content: getValue(associateCompany, 'contactPersonMobile') || '-NA-'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'contactPersonEmail',
                label: 'Business Email',
                content: getValue(associateCompany, 'contactPersonEmail') || '-NA-'
            },
            {
                component: componentTypes.TAB_ITEM,
                name: 'subHeader5',
                content: 'TDS Details',
                className: 'text-lg fw-bold pb-0'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'pan',
                label: 'PAN',
                content: getValue(associateCompany, 'pan') || '-NA-'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'tan',
                label: 'TAN',
                content: getValue(associateCompany, 'tan') || '-NA-'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'pan_fullname',
                label: 'Full Name',
                content: getValue(associateCompany, 'pan_fullname') || '-NA-'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'pan_surname',
                label: 'S/o D/o W/o',
                content: getValue(associateCompany, 'pan_surname') || '-NA-'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'pan_designation',
                label: 'Designation',
                content: getValue(associateCompany, 'pan_designation') || '-NA-'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'pan_mobile',
                label: 'Phone Number',
                content: getValue(associateCompany, 'pan_mobile') || '-NA-'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'pan_email',
                label: 'Email',
                content: getValue(associateCompany, 'pan_email') || '-NA-'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'pan_place',
                label: 'Place',
                content: getValue(associateCompany, 'pan_place') || '-NA-'
            },
            {
                component: componentTypes.TAB_ITEM,
                name: 'subHeader6',
                content: 'TPF Details',
                className: 'text-lg fw-bold pb-0'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'pF_Ac_No',
                label: 'PF Account No.',
                content: getValue(associateCompany, 'pF_Ac_No') || '-NA-'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'pF_Base_Limit',
                label: 'PF Base Limit',
                content: getValue(associateCompany, 'pF_Base_Limit') || '-NA-'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'pF_Deduction_Percent',
                label: 'PF % Deduction',
                content: getValue(associateCompany, 'pF_Deduction_Percent') || '-NA-'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'pF_Establishment_Code',
                label: 'PF Establishment Code',
                content: getValue(associateCompany, 'pF_Establishment_Code') || '-NA-'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'pF_Establishment_Id',
                label: 'PF Establishment Id',
                content: getValue(associateCompany, 'pF_Establishment_Id') || '-NA-'
            },
            {
                component: componentTypes.TAB_ITEM,
                name: 'subHeader7',
                content: 'GSTN Details',
                className: 'text-lg fw-bold pb-0'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'gstn_no',
                label: 'GSTN No.',
                content: getValue(associateCompany, 'gstn_no') || '-NA-'
            },
            {
                component: componentTypes.TAB_ITEM,
                name: 'subHeader8',
                content: 'SMTP Details',
                className: 'text-lg fw-bold pb-0',
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'smtp',
                label: '',
                content: 'Details Not Available',
                condition: {
                    when: 'smtp',
                    is: () => {
                        const { smtp } = associateCompany
                        return !Boolean((smtp || {}).id)
                    },
                    then: { visible: true }
                },
                className: 'fst-italic'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'smtpEmailAddress',
                label: 'Email Address',
                content: getValue(associateCompany, 'smtp.emailAddress') || '-NA-',
                condition: {
                    when: 'smtp',
                    is: () => {
                        const { smtp } = associateCompany
                        return Boolean((smtp || {}).id)
                    },
                    then: { visible: true }
                }
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'smtpHost',
                label: 'Host',
                content: getValue(associateCompany, 'smtp.host') || '-NA-',
                condition: {
                    when: 'smtp',
                    is: () => {
                        const { smtp } = associateCompany
                        return Boolean((smtp || {}).id)
                    },
                    then: { visible: true }
                }
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'smtpPort',
                label: 'Port',
                content: getValue(associateCompany, 'smtp.port') || '-NA-',
                condition: {
                    when: 'smtp',
                    is: () => {
                        const { smtp } = associateCompany
                        return Boolean((smtp || {}).id)
                    },
                    then: { visible: true }
                }
            }
        ],
    };

    useEffect(() => {
        if (data) {
            const { isActive } = data;
            setAssociateCompany({
                hideButtons: true,
                ...data,
                status: isActive ? { value: COMPANY_STATUS.ACTIVE, label: COMPANY_STATUS.ACTIVE } : { value: COMPANY_STATUS.INACTIVE, label: COMPANY_STATUS.INACTIVE }
            });
        }
    }, [data]);

    useEffect(() => {
        if (!isFetching && smtp) {
            if (smtp.id) {
                setAssociateCompany({ ...associateCompany, smtp });
            }
        }
    }, [isFetching]);

    return (
        <Modal show={true} backdrop="static" dialogClassName="drawer" animation={false}>
            <Modal.Header closeButton={true} onHide={onClose}>
                <Modal.Title className="bg">{GetActionTitle('Associate Company', action)}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {
                    Boolean((associateCompany || {}).logo) &&
                    <div className="position-relative">
                        <div className={styles.imageContainer}>
                            <img src={associateCompany.logo} alt="Company Logo" />
                        </div>
                    </div>
                }
                <FormRenderer FormTemplate={FormTemplate}
                    initialValues={associateCompany}
                    componentMapper={ComponentMapper}
                    schema={schema}
                />
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-between">
                <Button variant="primary" onClick={onClose} className="px-4 ms-auto">{'Close'}</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default AssociateCompanyDetails;