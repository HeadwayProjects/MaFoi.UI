import React, { useState, useEffect } from "react";
import { useGetDepartmentUserMappings, useGetDepartments, useGetVerticals } from "../../../backend/masters";
import { DEFAULT_OPTIONS_PAYLOAD } from "../../common/Table";
import { toast } from "react-toastify";
import { API_RESULT, ERROR_MESSAGES } from "../../../utils/constants";
import FormRenderer, { ComponentMapper, FormTemplate, componentTypes } from "../../common/FormRenderer";
import { getValue, preventDefault } from "../../../utils/common";
import { validatorTypes } from "@data-driven-forms/react-form-renderer";
import { Button, Modal } from "react-bootstrap";
import { useBulkUpdateComplianceSchedule } from "../../../backend/compliance";
import { ResponseModel } from "../../../models/responseModel";
import { USER_PRIVILEGES } from "../UserManagement/Roles/RoleConfiguration";

export default function ComplianceAssignUser(this: any, { activities, onCancel }: any) {
    const [t] = useState(new Date().getTime());
    const [form, setForm] = useState<any>({});
    const [data, setData] = useState<any>({ hideButtons: true });
    const [company, setCompany] = useState<any>(null);
    const [owners, setOwners] = useState<any[]>([]);
    const [managers, setManagers] = useState<any[]>([]);
    const [vertical, setVertical] = useState<any>(null);
    const [department, setDepartment] = useState<any>(null);
    const { verticals } = useGetVerticals({
        ...DEFAULT_OPTIONS_PAYLOAD,
        filters: [{ columnName: 'companyId', value: (company || {}).value }], t
    }, Boolean(company));
    const { departments } = useGetDepartments({
        ...DEFAULT_OPTIONS_PAYLOAD,
        filters: [{ columnName: 'verticalId', value: (vertical || {}).value }], t
    }, Boolean(vertical));
    const { departmentUsers, isFetching } = useGetDepartmentUserMappings({
        ...DEFAULT_OPTIONS_PAYLOAD,
        filters: [{ columnName: 'departmentId', value: (department || {}).value }]
    }, Boolean(department));
    const { updateBulkComplianceSchedule, updating } = useBulkUpdateComplianceSchedule(({ key, value }: ResponseModel) => {
        if (key === API_RESULT.SUCCESS) {
            toast.success(`Users assigned successfully.`);
            onCancel(true);
        } else {
            toast.error(value === ERROR_MESSAGES.DUPLICATE ? 'Similar Act, Establishment Type and Law combination already exists.' : ERROR_MESSAGES.ERROR);
        }
    }, errorCallback);

    function errorCallback() {
        toast.error(ERROR_MESSAGES.DEFAULT);
    }

    const schema = {
        fields: [
            {
                component: componentTypes.PLAIN_TEXT,
                name: 'company',
                label: 'Company',
                content: getValue(activities[0], 'company.name')
            },
            {
                component: componentTypes.SELECT,
                name: 'vertical',
                label: 'Vertical',
                options: verticals,
                onChange: handleVerticalChange.bind(this),
                validate: [
                    { type: validatorTypes.REQUIRED }
                ]
            },
            {
                component: componentTypes.SELECT,
                name: 'department',
                label: 'Department',
                options: departments,
                onChange: handleDepartmentChange.bind(this),
                validate: [
                    { type: validatorTypes.REQUIRED }
                ]
            },
            {
                component: componentTypes.SELECT,
                name: 'owner',
                label: 'Owner',
                options: owners,
                validate: [
                    { type: validatorTypes.REQUIRED }
                ]
            },
            {
                component: componentTypes.SELECT,
                name: 'manager',
                label: 'Manager',
                options: managers,
                validate: [
                    { type: validatorTypes.REQUIRED }
                ]
            }
        ],
    };

    function handleVerticalChange(e: any) {
        setVertical(e);
        setDepartment(null);
        setData({ ...data, vertical: e, department: null, user: null });
    }

    function handleDepartmentChange(e: any) {
        setDepartment(e);
        setData({ ...data, department: e, user: null });
    }

    function debugForm(_form: any) {
        setForm(_form);
        setData(_form.values);
    }

    function submit(e: any) {
        preventDefault(e);
        if (form.valid) {
            const { vertical, department, owner, manager } = data;
            const request = activities.map((activity: any) => {
                return {
                    ...activity,
                    veriticalId: vertical.value,
                    departmentId: department.value,
                    complianceOwnerId: owner.value,
                    complianceManagerId: manager.value
                }
            });
            updateBulkComplianceSchedule(request);
            // const request: any = {
            //     name: name.trim(),
            //     lawId: law.value,
            //     establishmentType: establishmentType ? establishmentType.map((x: any) => x.value).sort().join(API_DELIMITER) : ''
            // };

            // if (action === ACTIONS.EDIT) {
            //     request['id'] = data.id;
            //     updateAct(request);
            // } else {
            //     createAct(request);
            // }
        }
    }

    function handleClose() {
        onCancel(false);
    }

    useEffect(() => {
        if (activities) {
            const { company } = activities[0];
            setCompany({ value: company.id, label: company.name });
        }
    }, [activities]);

    useEffect(() => {
        if (isFetching) {
            setOwners([]);
            setManagers([]);
        }
        if (!isFetching && departmentUsers) {
            const _owners = departmentUsers.filter(({user}: any) => {
                const isOwner = user.userRoles.find(({pages}: any) => pages.includes(USER_PRIVILEGES.OWNER_DASHBOARD));
                return Boolean(isOwner);
            }).map(({user}: any) => user);
            const _managers = departmentUsers.filter(({user}: any) => {
                const isManager = user.userRoles.find(({pages}: any) => pages.includes(USER_PRIVILEGES.MANAGER_DASHBOARD));
                return Boolean(isManager);
            }).map(({user}: any) => user);
            setOwners(_owners);
            setManagers(_managers);
        }

    }, [isFetching]);

    return (
        <>
            <Modal show={true} backdrop="static" dialogClassName="drawer" animation={false}>
                <Modal.Header closeButton={true} onHide={handleClose}>
                    <Modal.Title className="bg">Assign Owner / Manager</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormRenderer FormTemplate={FormTemplate}
                        initialValues={data}
                        componentMapper={ComponentMapper}
                        schema={schema}
                        debug={debugForm}
                    />
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-between">
                    <Button variant="outline-secondary" className="btn btn-outline-secondary px-4" onClick={handleClose}>{'Cancel'}</Button>
                    <Button variant="primary" onClick={submit} className="px-4" disabled={!form.valid}>{'Submit'}</Button>

                </Modal.Footer>
            </Modal>
            {/* {
                (creating || updating) &&
                <PageLoader>
                    {creating ? 'Creating Act...' : 'Updating Act...'}
                </PageLoader>
            } */}
        </>
    )
}