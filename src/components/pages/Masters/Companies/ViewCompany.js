import React, { useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import FormRenderer, { ComponentMapper, FormTemplate, componentTypes } from "../../../common/FormRenderer";
import { Button } from "react-bootstrap";
import { getValue } from "../../../../utils/common"
import { API_DELIMITER, UI_DELIMITER } from "../../../../utils/constants";
import { GetActionTitle } from "../Master.constants";
import { ACTIONS } from "../../../common/Constants";
import styles from "./Companies.module.css";

function ViewCompany({ company, onClose }) {
    const [companyDetails, setCompanyDetails] = useState({ hideButtons: true });

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
                content: getValue(companyDetails, 'code') || '-NA-'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'name',
                label: 'Name',
                content: getValue(companyDetails, 'name') || '-NA-'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'businessType',
                label: 'Business Type',
                content: (getValue(companyDetails, 'businessType') || '').replaceAll(API_DELIMITER, UI_DELIMITER) || '-NA-'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'websiteUrl',
                label: 'Website Url',
                content: getValue(companyDetails, 'websiteUrl') || '-NA-'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'establishmentType',
                label: 'Estabishment Type',
                content: (getValue(companyDetails, 'establishmentType') || '').replaceAll(API_DELIMITER, UI_DELIMITER) || '-NA-'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'employees',
                label: 'Employees',
                content: getValue(companyDetails, 'employees') || '-NA-'
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
                content: getValue(companyDetails, 'companyAddress') || '-NA-'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'address2',
                label: 'City/State/Country',
                content: [getValue(companyDetails, 'city'), getValue(companyDetails, 'state'), getValue(companyDetails, 'country')].join('/') || '-NA-'
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
                content: getValue(companyDetails, 'contactNumber') || '-NA-'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'email',
                label: 'Email',
                content: getValue(companyDetails, 'email') || '-NA-'
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
                content: getValue(companyDetails, 'contactPersonName') || '-NA-'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'contactPersonDesignation',
                label: 'Designation',
                content: getValue(companyDetails, 'contactPersonDesignation') || '-NA-'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'contactPersonDepartment',
                label: 'Depatment',
                content: getValue(companyDetails, 'contactPersonDepartment') || '-NA-'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'contactPersonMobile',
                label: 'Phone',
                content: getValue(companyDetails, 'contactPersonMobile') || '-NA-'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'contactPersonEmail',
                label: 'Business Email',
                content: getValue(companyDetails, 'contactPersonEmail') || '-NA-'
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
                content: getValue(companyDetails, 'pan') || '-NA-'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'tan',
                label: 'TAN',
                content: getValue(companyDetails, 'tan') || '-NA-'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'pan_fullname',
                label: 'Full Name',
                content: getValue(companyDetails, 'pan_fullname') || '-NA-'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'pan_surname',
                label: 'S/o D/o W/o',
                content: getValue(companyDetails, 'pan_surname') || '-NA-'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'pan_designation',
                label: 'Designation',
                content: getValue(companyDetails, 'pan_designation') || '-NA-'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'pan_mobile',
                label: 'Phone Number',
                content: getValue(companyDetails, 'pan_mobile') || '-NA-'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'pan_email',
                label: 'Email',
                content: getValue(companyDetails, 'pan_email') || '-NA-'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'pan_place',
                label: 'Place',
                content: getValue(companyDetails, 'pan_place') || '-NA-'
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
                content: getValue(companyDetails, 'pF_Ac_No') || '-NA-'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'pF_Base_Limit',
                label: 'PF Base Limit',
                content: getValue(companyDetails, 'pF_Base_Limit') || '-NA-'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'pF_Deduction_Percent',
                label: 'PF % Deduction',
                content: getValue(companyDetails, 'pF_Deduction_Percent') || '-NA-'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'pF_Establishment_Code',
                label: 'PF Establishment Code',
                content: getValue(companyDetails, 'pF_Establishment_Code') || '-NA-'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'pF_Establishment_Id',
                label: 'PF Establishment Id',
                content: getValue(companyDetails, 'pF_Establishment_Id') || '-NA-'
            },
            // {
            //     component: componentTypes.PLAIN_TEXT,
            //     name: 'pan_place',
            //     label: 'Place',
            //     content: getValue(companyDetails, 'pan_place') || '-NA-'
            // },
            // {
            //     component: componentTypes.PLAIN_TEXT,
            //     name: 'pan_place',
            //     label: 'Place',
            //     content: getValue(companyDetails, 'pan_place') || '-NA-'
            // },
            // {
            //     component: componentTypes.PLAIN_TEXT,
            //     name: 'pan_place',
            //     label: 'Place',
            //     content: getValue(companyDetails, 'pan_place') || '-NA-'
            // },
            // {
            //     component: componentTypes.PLAIN_TEXT,
            //     name: 'pan_place',
            //     label: 'Place',
            //     content: getValue(companyDetails, 'pan_place') || '-NA-'
            // },
            // {
            //     component: componentTypes.PLAIN_TEXT,
            //     name: 'pan_place',
            //     label: 'Place',
            //     content: getValue(companyDetails, 'pan_place') || '-NA-'
            // },
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
                content: getValue(companyDetails, 'gstn_no') || '-NA-'
            },
        ],
    };

    useEffect(() => {
        if (company) {
            setCompanyDetails({
                hideButtons: true,
                ...company,
            });
        }
    }, [company])

    return (
        <Modal show={true} backdrop="static" dialogClassName="drawer" animation={false}>
            <Modal.Header closeButton={true} onHide={onClose}>
                <Modal.Title className="bg">{GetActionTitle('Company', ACTIONS.VIEW)}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {
                    Boolean((companyDetails || {}).logo) &&
                    <div className="position-relative">
                        <div className={styles.imageContainer}>
                            <img src={companyDetails.logo} />
                        </div>
                    </div>
                }
                <FormRenderer FormTemplate={FormTemplate}
                    initialValues={companyDetails}
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

export default ViewCompany;