import React, { useEffect, useState } from "react";
import { PAGES_CONFIGURATION } from "./RoleConfiguration";
import styles from "./Roles.module.css";
import { Button, Modal } from "react-bootstrap";
import FormRenderer, { ComponentMapper, FormTemplate, componentTypes } from "../../../common/FormRenderer";
import { getValue } from "../../../../utils/common";
import { API_DELIMITER } from "../../../../utils/constants";
import ViewPrivileges from "./ViewPrivileges";


export default function RoleDetails({ role, onClose }: any) {
    const [roleDetails] = useState<any>({ hideButtons: true });
    const schema = {
        fields: [
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'name',
                label: 'Name',
                content: getValue(role, 'name') || '-NA-'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'description',
                label: 'Sescription',
                content: getValue(role, 'description') || '-NA-'
            },
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'privileges',
                label: 'Privileges',
                content: '',
                className: '-mb-3'
            }
        ]
    };

    // useEffect(() => {
    //     if (role) {
    //         const { pages } = role;
    //         // const privileges: any[] = pages.split(API_DELIMITER);
    //         const privileges: any[] = 'LAW_CATEGORY_VIEW;ACTS_VIEW;ACTIVITIES_VIEW;RULES_VIEW;STATE_VIEW;CITY_VIEW;RULE_COMPLIANCE_VIEW;MAPPING_VIEW;VIEW_COMPANIES;VIEW_ASSOCIATE_COMPANY;VIEW_LOCATION_MAPPING;AUDIT_SCHEDULE;VIEW_USERS;VIEW_COMPANY_MAPPING;VIEW_EMAIL_TEMPLATES'.split(API_DELIMITER);
    //         const _mappings: any = [];
    //         PAGES_CONFIGURATION.forEach((page: any) => {
    //             const _privileges: any[] = [];
    //             page.privileges.forEach((privilege: any) => {
    //                 if (privileges.includes(privilege.id)) {
    //                     _privileges.push(privilege);
    //                 }
    //             });
    //             if (_privileges.length > 0) {
    //                 _mappings.push({
    //                     ...page,
    //                     privileges: _privileges
    //                 })
    //             }
    //         });
    //         setMappings(_mappings);
    //     }
    // }, [role]);
    return (
        <Modal show={true} backdrop="static" dialogClassName="drawer" animation={false}>
            <Modal.Header closeButton={true} onHide={onClose}>
                <Modal.Title className="bg">View Role Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FormRenderer FormTemplate={FormTemplate}
                    initialValues={roleDetails}
                    componentMapper={ComponentMapper}
                    schema={schema}
                />
                <ViewPrivileges privileges={role.pages} />
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-between">
                <Button variant="primary" onClick={onClose} className="px-4 ms-auto">{'Close'}</Button>
            </Modal.Footer>
        </Modal>
    )
}