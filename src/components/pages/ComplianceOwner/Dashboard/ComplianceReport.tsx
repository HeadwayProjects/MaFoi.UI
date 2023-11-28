import React, { useEffect, useState } from "react";
import { useGetCompanies, useGetCompanyLocations, useGetDepartmentUserMappings } from "../../../../backend/masters";
import { DEFAULT_OPTIONS_PAYLOAD } from "../../../common/Table";
import FormRenderer, { ComponentMapper, FormTemplate, componentTypes } from "../../../common/FormRenderer";
import { validatorTypes } from "@data-driven-forms/react-form-renderer";
import { Modal } from "react-bootstrap";
import { getUserDetails } from "../../../../backend/auth";
import { download, getValue } from "../../../../utils/common";
import { getAllComplianceActivies, useExportComplianceReport } from "../../../../backend/compliance";
import { MONTHS_ENUM } from "../../../common/Constants";
import { toast } from "react-toastify";
import { ERROR_MESSAGES } from "../../../../utils/constants";
import PageLoader from "../../../shared/PageLoader";

function locationOptionLabel({ label, location }: any) {
    return (
        <div className="d-flex flex-column">
            <div>{label}</div>
            {
                Boolean(location) &&
                <>
                    <div className="text-sm fw-bold">{location.city.label} | {location.state.label}</div>
                </>
            }
        </div>
    )
}

export default function ComplianceReport({ onCancel }: any) {
    const [filters, setFilters] = useState<any>({})
    const [companies, setCompanies] = useState<any[]>([]);
    const [associateCompanies, setAssociateCompanies] = useState<any[]>();
    const [locations, setLocations] = useState<any[]>();
    const { departmentUsers, isFetching: fetchingCompanies }: any = useGetDepartmentUserMappings({
        ...DEFAULT_OPTIONS_PAYLOAD,
        filters: [{ columnName: 'userId', value: getUserDetails().userid }]
    }, true);

    const { companies: acs, isFetching: fetchingAcs } = useGetCompanies({
        ...DEFAULT_OPTIONS_PAYLOAD,
        filters: [
            { columnName: 'isParent', value: 'false' },
            { columnName: 'parentCompanyId', value: (filters.company || {}).value }
        ]
    }, enableAcs());
    const { locations: locs, isFetching: fetchingLocs } = useGetCompanyLocations({
        ...DEFAULT_OPTIONS_PAYLOAD,
        filters: [{ columnName: 'companyId', value: (filters.associateCompany || {}).value }],
        sort: { columnName: 'locationName', order: 'asc' }
    }, enableLocations());

    const { exportReport, exporting } = useExportComplianceReport(({ DownloadfilePath }: any) => {
        if (DownloadfilePath) {
            const [filePath] = DownloadfilePath.split('?');
            const chunks = filePath.split('/');
            download(chunks[chunks.length - 1], filePath);
            onCancel();
        }
    }, () => {
        toast.error(ERROR_MESSAGES.DEFAULT)
    })

    function enableAcs() {
        const { company } = filters;
        return Boolean(company && company.value);
    }

    function enableLocations() {
        const { associateCompany } = filters;
        return Boolean(associateCompany && associateCompany.value);
    }

    const schema = {
        fields: [
            {
                component: componentTypes.MONTH_PICKER,
                name: 'monthYear',
                label: 'Month & Year',
                className: 'grid-col-50',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                range: false,
                onChange: (date: any) => {
                    setFilters({
                        ...filters,
                        monthYear: date ? date.toDate() : undefined
                    })
                }
            },
            {
                component: componentTypes.SELECT,
                name: 'company',
                label: 'Company',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                options: companies,
                onChange: (company: any) => {
                    setAssociateCompanies([]);
                    setLocations([]);
                    setFilters({
                        ...filters,
                        company,
                        associateCompany: null,
                        location: null
                    });
                }
            },
            {
                component: componentTypes.SELECT,
                name: 'associateCompany',
                label: 'Associate Company',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                options: associateCompanies,
                onChange: (associateCompany: any) => {
                    setFilters({
                        ...filters,
                        associateCompany,
                        location: null
                    });
                }
            },
            {
                component: componentTypes.SELECT,
                name: 'location',
                label: 'Location',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                options: locations,
                onChange: (location: any) => {
                    setFilters({
                        ...filters,
                        location
                    });
                },
                formatOptionLabel: locationOptionLabel,
            }
        ]
    };

    function handleSubmit(data: any) {
        const {
            company, associateCompany, location, monthYear
        } = data;
        const _filters = [];

        const date = new Date(monthYear);
        const month = MONTHS_ENUM[date.getMonth()];
        const year = date.getFullYear();
        if (month) {
            _filters.push({ columnName: 'month', value: month });
        }
        if (year) {
            _filters.push({ columnName: 'year', value: `${year}` });
        }

        if (company && company.value) {
            _filters.push({ columnName: 'companyId', value: company.value });
        }
        if (associateCompany && associateCompany.value) {
            _filters.push({ columnName: 'associateCompanyId', value: associateCompany.value });
        }
        if (location && location.value) {
            _filters.push({ columnName: 'locationId', value: location.value });
        }
        const payload = {
            filters: _filters,
            pagination: null,
            search: '',
            sort: null
        };
        getAllComplianceActivies({
            ...payload, pagination: {
                pageSize: 1,
                pageNumber: 1
            }
        }).then(({ data }: any) => {
            if (data.count > 0) {
                exportReport(payload);
            } else {
                toast.warn("There are no compliance activites available for provided filter.");
            }
        })
    }

    useEffect(() => {
        if (!fetchingCompanies) {
            const comps: any = {};
            departmentUsers.forEach((usr: any) => {
                const company = getValue(usr, 'department.vertical.company');
                if (!comps[company.id]) {
                    comps[company.id] = company;
                }
            });
            setCompanies(Object.values(comps).map(({ id, name }: any) => {
                return { value: id, label: name }
            }))
        }
    }, [fetchingCompanies])

    useEffect(() => {
        if (!fetchingLocs && locs) {
            setLocations((locs || []).map(({ location }: any) => {
                const { id, name, code, cities } = location;
                const { state } = cities;
                return {
                    id, name, code,
                    city: { code: cities.code, label: cities.name, value: cities.id },
                    state: { code: state.code, label: state.name, value: state.id }
                }
            }));
        }
    }, [fetchingLocs]);

    useEffect(() => {
        if (!fetchingCompanies && acs) {
            setLocations([]);
            setAssociateCompanies(acs.map(({ id, name }: any) => {
                return { value: id, label: name }
            }));
        }
    }, [fetchingAcs]);
    return (
        <>
            <Modal show={true} backdrop="static" animation={false} dialogClassName="drawer no-footer" size="lg">
                <Modal.Header closeButton={true} onHide={onCancel}>
                    <Modal.Title className="bg">Generate Compliance Report</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormRenderer FormTemplate={FormTemplate}
                        initialValues={{
                            submitBtnText: 'Generate Report',
                            ...filters
                        }}
                        componentMapper={ComponentMapper}
                        schema={schema}
                        onSubmit={handleSubmit}
                    />
                </Modal.Body>
            </Modal>
            {
                exporting && <PageLoader>{'Preparing Data'}</PageLoader>
            }
        </>
    )
}