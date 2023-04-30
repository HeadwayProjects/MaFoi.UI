import React, { useEffect, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import { componentTypes } from "@data-driven-forms/react-form-renderer";
import FormRenderer, { ComponentMapper, FormTemplate } from "../../../common/FormRenderer";
import { Button } from "react-bootstrap";
import { getValue } from "../../../../utils/common"

function ViewCompany({ company, parentCompany, onClose }) {
    const [companyDetails, setCompanyDetails] = useState(null);

    const schema = {
        fields: [
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'name',
                label: 'Company Name',
                content: getValue(companyDetails, 'name')
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'location',
                label: 'Location',
                content: getValue(companyDetails, 'location')
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'parentCompany',
                label: 'Parent Company',
                content: getValue(companyDetails, 'parentCompany')
            }
        ],
    };

    useEffect(() => {
        if (company) {
            setCompanyDetails({
                ...company,
                parentCompany: parentCompany ? parentCompany.name : null
            });
        }
    }, [company])

    return (
        <>
            <Modal show={true} backdrop="static" dialogClassName="drawer" animation={false}>
                <Modal.Header closeButton={true} onHide={onClose}>
                    <Modal.Title className="bg">{'View State Master'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                        companyDetails &&
                        <FormRenderer FormTemplate={FormTemplate}
                            initialValues={{ hideButtons: true }}
                            componentMapper={ComponentMapper}
                            schema={schema}
                        />
                    }
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-between">
                    <Button variant="primary" onClick={onClose} className="px-4 ms-auto">{'Close'}</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ViewCompany;