import React, { useEffect, useState } from "react";
import { Alert, Button, Modal } from "react-bootstrap";
import FormRenderer, { ComponentMapper, FormTemplate, componentTypes } from "../../common/FormRenderer";
import { useGetAllActivities, useGetUserCompanies } from "../../../backend/query";
import { validatorTypes } from "@data-driven-forms/react-form-renderer";
import { DEFAULT_OPTIONS_PAYLOAD } from "../../common/Table";
import { MONTHS_ENUM } from "../../common/Constants";
import { useSendReportAsEmail } from "../../../backend/auditor";
import { getUserDetails } from "../../../backend/auth";
import { toast } from "react-toastify";

export default function SendEmailModal({ onCancel }: any) {
    const [details, setDetails] = useState({});
    const [error, setError] = useState<any>();
    const [form, setForm] = useState<any>({});
    const [companies, setCompanies] = useState<any[]>([]);
    const [associateCompanies, setAssociateCompanies] = useState<any[]>([]);
    const [locations, setLocations] = useState<any[]>([]);
    const { userCompanies, isFetching } = useGetUserCompanies();
    const [filters, setFilters] = useState<any[]>([]);
    const { activities, isFetching: fetchingActivities } = useGetAllActivities({ ...DEFAULT_OPTIONS_PAYLOAD, sort: { columnName: 'month', order: 'desc' }, filters }, (filters || []).length >= 5);
    const { sendEmail } = useSendReportAsEmail(({ statusCode, downloadFilePath, message }: any) => {
        if (statusCode === 100 && downloadFilePath) {
            const email = message.replace(/^(.{2})[^@]+/, "$1XXX");
            toast.success(`Email sent successfully to ${email}.`);
            onCancel();
        } else {
            toast.error("Error in generating email. Please try again after sometime.");
        }
    }, () => {
        toast.error("Error in generating email. Please try again after sometime.");
    });

    const schema: any = {
        fields: [
            {
                component: componentTypes.MONTH_PICKER,
                name: 'monthYear',
                label: 'Month & Year',
                className: 'grid-col-50',
                range: false,
                clearable: false,
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                onChange: (event: any) => {
                    setDetails({ ...details, monthYear: new Date(event) });
                }
            },
            {
                component: componentTypes.SELECT,
                name: 'company',
                label: 'Company',
                className: 'grid-col-100',
                options: companies,
                onChange: ({ value, label, company }: any) => {
                    setDetails({ ...details, company: { value, label }, associateCompany: null, location: null });
                    const { associateCompanies } = company;
                    setLocations([]);
                    setAssociateCompanies(associateCompanies.map(({ associateCompany, locations }: any) => {
                        return {
                            id: associateCompany.id,
                            name: associateCompany.name,
                            locations
                        }
                    }));
                },
                validate: [
                    { type: validatorTypes.REQUIRED }
                ]
            },
            {
                component: componentTypes.SELECT,
                name: 'associateCompany',
                label: 'Associate Company',
                className: 'grid-col-100',
                options: associateCompanies,
                onChange: ({ value, label, associateCompany }: any) => {
                    setDetails({ ...details, associateCompany: { value, label }, location: null });
                    const { locations } = associateCompany;
                    setLocations(locations.map(({ id, name, cities }: any) => {
                        return {
                            id, name,
                            city: cities.name,
                            state: cities.state.name
                        }
                    }));
                },
                isDisabled: associateCompanies.length === 0,
                validate: [
                    { type: validatorTypes.REQUIRED }
                ]
            },
            {
                component: componentTypes.SELECT,
                name: 'location',
                label: 'Location',
                className: 'grid-col-100',
                options: locations,
                isDisabled: locations.length === 0,
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                formatOptionLabel: locationOptionLabel,
                onChange: ({ value, label }: any) => {
                    setDetails({ ...details, location: { value, label } });
                }
            }
        ]
    }

    function locationOptionLabel({ label, location }: any) {
        return (
            <div className="d-flex flex-column">
                <div>{label}</div>
                {
                    Boolean(location) &&
                    <>
                        <div className="text-sm fw-bold">{location.city} | {location.state}</div>
                    </>
                }
            </div>
        )
    }

    function sendReport() {
        const { monthYear, company, associateCompany, location }: any = details;
        const date = new Date(monthYear);
        const _payload: any = {
            Company: company.value,
            AssociateCompany: associateCompany.value,
            Location: location.value,
            Month: MONTHS_ENUM[date.getMonth()],
            Year: `${date.getFullYear()}`,
            ReportType: 'AuditReport',
            userId: getUserDetails().userid
        };
        sendEmail(_payload);
    }

    useEffect(() => {
        if (!fetchingActivities && activities) {
            if (!activities.length) {
                setError("There are no activities available for the selected combination.")
            } else {
                const published = activities.filter(({ published }: any) => published);
                const diff = activities.length - published.length;
                if (diff) {
                    setError(published ? 'There are few activities that are not published.' : 'There are no activies that are published');
                }
            }
        }
    }, [fetchingActivities])

    useEffect(() => {
        if (details) {
            const _filters = [];
            const { monthYear, company, associateCompany, location }: any = details;
            if ((company || {}).value) {
                _filters.push({ columnName: 'companyId', value: company.value });
            }
            if ((associateCompany || {}).value) {
                _filters.push({ columnName: 'associateCompanyId', value: associateCompany.value });
            }
            if ((location || {}).value) {
                _filters.push({ columnName: 'locationId', value: location.value });
            }
            if (monthYear) {
                const date = new Date(monthYear);
                _filters.push({ columnName: 'month', value: MONTHS_ENUM[date.getMonth()] });
                _filters.push({ columnName: 'year', value: `${date.getFullYear()}` });
            }
            setError(undefined);
            setFilters(_filters);
        }
    }, [details]);

    useEffect(() => {
        if (!isFetching && userCompanies) {
            setCompanies(userCompanies.map(({ id, name, associateCompanies }: any) => {
                return {
                    id, name, associateCompanies
                }
            }))
        }
    }, [isFetching]);

    return (
        <Modal show={true} backdrop="static" animation={false} dialogClassName="drawer" size="lg">
            <Modal.Header closeButton={true} onHide={onCancel}>
                <Modal.Title className="bg">Send Report</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex justify-content-start">
                    <div className="col-12">
                        {
                            Boolean(error) &&
                            <Alert variant={'danger'}>{error}</Alert>
                        }
                        <form>
                            <div className="row mt-3">
                                <div className="col-12">
                                    <FormRenderer FormTemplate={FormTemplate}
                                        initialValues={{ hideButtons: true, ...details }}
                                        componentMapper={ComponentMapper}
                                        schema={schema}
                                        debug={setForm}
                                    />
                                    <div className="d-flex justify-content-center my-3">
                                        <Button variant="primary" onClick={sendReport} disabled={!form.valid || error}>Send Report</Button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}