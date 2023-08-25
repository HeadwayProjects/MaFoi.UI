import React, { useState } from "react";
import { validatorTypes } from "@data-driven-forms/react-form-renderer";
import { Button } from "react-bootstrap";
import dayjs from "dayjs";
import { useGetCompanies, useGetCompanyLocations } from "../../../backend/masters";
import { DEFAULT_OPTIONS_PAYLOAD } from "../../common/Table";
import { GetCompaniesBreadcrumb } from "../Masters/Companies/Companies.constants";
import { GetComplianceBreadcrumb } from "./Compliance.constants";
import { useExportComplianceSchedule } from "../../../backend/compliance";
import { download, getMaxMonthYear, getMinMonthYear } from "../../../utils/common";
import FormRenderer, { ComponentMapper, FormTemplate, componentTypes } from "../../common/FormRenderer";
import { ActivityType } from "../Masters/Master.constants";
import { API_DELIMITER } from "../../../utils/constants";
import MastersLayout from "../Masters/MastersLayout";
import PageLoader from "../../shared/PageLoader";
import ComplianceScheduleImportModal from "./ComplianceScheduleImportModal";

const DEFAULT_EXPORT_DATA = {
    hideButtons: true,
    month: new Date(),
    types: ['Display', 'Registers', 'Returns'].map(x => {
        return { value: x, label: x }
    })
}

function ComplianceSchedule(this: any) {
    const [form, setForm] = useState<any>({});
    const [importFile, setImportFile] = useState(false);
    const [breadcrumb] = useState(GetComplianceBreadcrumb('Compliance Schedule'));
    const [exportData, setExportData] = useState<any>({ ...DEFAULT_EXPORT_DATA });
    const [parentCompany, setParentCompany] = useState<any>(null);
    const [associateCompany, setAssociateCompany] = useState<any>(null);
    const { companies, isFetching: fetchingCompanies } = useGetCompanies({ ...DEFAULT_OPTIONS_PAYLOAD, filters: [{ columnName: 'isParent', value: 'true' }] });
    const { companies: associateCompanies, isFetching: fetchingAssociateCompanies } = useGetCompanies({
        ...DEFAULT_OPTIONS_PAYLOAD,
        filters: [{ columnName: 'isParent', value: 'false' }, { columnName: 'parentCompanyId', value: (parentCompany || {}).value }]
    }, Boolean(parentCompany));
    const { locations, isFetching: fetchingLocations } = useGetCompanyLocations({
        ...DEFAULT_OPTIONS_PAYLOAD, filters: [
            { columnName: 'companyId', value: (associateCompany || {}).value }],
        sort: { columnName: 'locationName', order: 'asc' }
    }, Boolean(associateCompany));
    const { exportComplianceSchedule, exporting } = useExportComplianceSchedule((response: any) => {
        const blob = new Blob([response.data], { type: response.headers['content-type'] })
        const URL = window.URL || window.webkitURL;
        const downloadUrl = URL.createObjectURL(blob);
        download(getFileName(), downloadUrl);
    }, () => {

    });

    const schema = {
        fields: [
            {
                component: componentTypes.SELECT,
                name: 'parentCompany',
                label: 'Company',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                options: companies,
                isLoading: fetchingCompanies,
                onChange: onParentCompanyChange.bind(this),
                className: 'grid-col-100'
            },
            {
                component: componentTypes.SELECT,
                name: 'associateCompany',
                label: 'Associate Company',
                options: associateCompanies,
                isDisabled: !Boolean(parentCompany),
                isLoading: fetchingAssociateCompanies,
                onChange: onAssociateCompanyChange.bind(this),
                className: 'grid-col-100'
            },
            {
                component: componentTypes.SELECT,
                name: 'locations',
                label: 'Locations',
                options: (locations || []).map((x: { location: {}; }) => {
                    const { id, name, code, cities }: any = x.location || {};
                    const { state } = cities || {};
                    return {
                        id,
                        name: `${name} (${state.code}-${cities.code}-${code})`,
                        code: `${state.code}-${cities.code}-${code}`
                    }
                }),
                isDisabled: !Boolean(associateCompany),
                isLoading: fetchingLocations,
                className: 'grid-col-100'
            },
            {
                component: componentTypes.SELECT,
                name: 'types',
                label: 'Activity Types',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                className: 'grid-col-100',
                options: ActivityType,
                isMulti: true
            },
            {
                component: componentTypes.MONTH_PICKER,
                name: 'month',
                label: 'Month',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ],
                className: 'grid-col-100',
                initialValue: exportData.month,
                minDate: getMinMonthYear(),
                maxDate: getMaxMonthYear(),
                range: true
            }
        ]
    };

    function getFileName() {
        const { parentCompany, associateCompany, locations } = exportData;
        const _d = { ...parentCompany, ...associateCompany, ...locations };
        const result = [
            _d.parentCompany.code
        ];
        if (_d.associateCompany) {
            result.push(_d.associateCompany.code);
        }
        if (_d.locations) {
            result.push(_d.locations.code);
        }
        return `${result.join('-')}.xlsx`
    }

    function debugForm(_form: any[]) {
        setForm(_form);
        setExportData(_form.values);
    }

    function onParentCompanyChange(e: any) {
        setParentCompany(e);
        setAssociateCompany(null);
        setExportData({ ...exportData, parentCompany: e, associateCompany: null, locations: null });
    }

    function onAssociateCompanyChange(e: any) {
        setAssociateCompany(e);
        setExportData({ ...exportData, associateCompany: e, locations: null });
    }

    function handleSubmit() {
        if (form.valid) {
            const { parentCompany, associateCompany, locations, month, types } = exportData;
            let fromDate, toDate;
            if (Array.isArray(month)) {
                fromDate = new Date(month[0]);
                fromDate.setDate(1);
                toDate = new Date(month[1] || month[0]);
                toDate.setDate(1);
            } else {
                fromDate = new Date(month);
                fromDate.setDate(1);
                toDate = new Date(month);
                toDate.setDate(1);
            }
            const payload = {
                company: parentCompany.value,
                associateCompany: (associateCompany || {}).value || '',
                location: (locations || {}).value || '',
                fromDate: dayjs(new Date(fromDate)).local().format(),
                toDate: dayjs(new Date(toDate)).local().format(),
                types: types.map((x: { value: any; }) => x.value).join(API_DELIMITER)
            };
            exportComplianceSchedule(payload);
        }
    }

    function resetForm() {
        setExportData({ ...DEFAULT_EXPORT_DATA });
    }

    return (
        <>
            <MastersLayout title="Compliance Schedule" breadcrumbs={breadcrumb}>
                <div className="d-flex flex-column mx-0 mt-4">
                    <div className="d-flex flex-row justify-content-center mb-4">
                        <div className="w-50 px-4 border-end" style={{ maxWidth: '550px' }}>
                            <div className="d-flex flex-column card shadow p-4">
                                <div className="text-lg fw-bold">Export Audit Schedule</div>
                                <div className="d-flex flex-column h-100 justify-space-between py-2 horizontal-form col2">
                                    <FormRenderer FormTemplate={FormTemplate}
                                        initialValues={exportData}
                                        componentMapper={ComponentMapper}
                                        schema={schema}
                                        debug={debugForm}
                                    />
                                </div>
                                <div className="d-flex justify-content-end mt-4 me-4">
                                    <Button variant="outline-secondary" className="btn btn-outline-secondary px-4" onClick={resetForm}>{'Reset'}</Button>
                                    <Button variant="primary" onClick={handleSubmit} className="ms-4 px-4" disabled={!form.valid}>{'Export'}</Button>
                                </div>
                            </div>
                        </div>
                        <div className="w-100 px-4" style={{ maxWidth: "calc(100% - 550px)", minWidth: "50%" }}>
                            <div className="d-flex flex-column">
                                <div className="d-flex flex-column card shadow p-4 mb-4">
                                    <div className="text-lg fw-bold mb-4">Import Compliance Schedule</div>
                                    <ul>
                                        <li>Click on Import Button</li>
                                        <li>Select the file and upload</li>
                                        <li>If there are errors, click on the hyper link and the application will export the errors in excel file for you to edit and re-upload</li>
                                    </ul>
                                    <div>
                                        <Button variant="primary" onClick={() => setImportFile(true)} className="px-4">{'Import'}</Button>
                                    </div>
                                </div>
                                <div className="d-flex flex-column card shadow p-4">
                                    <div className="text-lg fw-bold mb-4">Instructions for Export</div>
                                    <ul>
                                        <li>Select Company</li>
                                        <li>Select Associate Company (Optional)</li>
                                        <li>Select Location (Optional)</li>
                                        <li>Please note that if you are not selecting the Associate Company or Location, then the application will export all data for all Associate Companies or Locations.</li>
                                        <li>Select Month & Year. Here you can select the range of months to create the excel export</li>
                                        <li>Click Export button to export the data into an excel sheet.</li>
                                    </ul>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </MastersLayout>
            {
                importFile && <ComplianceScheduleImportModal onClose={() => setImportFile(false)} />
            }
            {
                exporting && <PageLoader>Generating Audit Schedule...</PageLoader>
            }
        </>
    )
}

export default ComplianceSchedule;