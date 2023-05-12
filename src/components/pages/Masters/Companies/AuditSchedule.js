import React, { useState } from "react";
import MastersLayout from "../MastersLayout";
import { GetCompaniesBreadcrumb } from "./Companies.constants";
import { useExportAuditSchedule, useGetCompanies, useGetCompanyLocations } from "../../../../backend/masters";
import { componentTypes, validatorTypes } from "@data-driven-forms/react-form-renderer";
import FormRenderer, { ComponentMapper, FormTemplate } from "../../../common/FormRenderer";
import { Button } from "react-bootstrap";
import AuditScheduleImportModal from "./AuditScheduleImportModal";

function AuditSchedule() {
    const [form, setForm] = useState({});
    const [importFile, setImportFile] = useState(false);
    const [breadcrumb] = useState(GetCompaniesBreadcrumb('Audit Schedule'));
    const [exportData, setExportData] = useState({ hideButtons: true });
    const [parentCompany, setParentCompany] = useState(null);
    const [associateCompany, setAssociateCompany] = useState(null);
    const { companies, isFetching: fetchingCompanies } = useGetCompanies({ isParent: true });
    const { companies: associateCompanies, isFetching: fetchingAssociateCompanies } = useGetCompanies({ isParent: false, parentCompanyId: (parentCompany || {}).value }, Boolean(parentCompany));
    const { locations, isFetching: fetchingLocations } = useGetCompanyLocations({ associateCompanyId: (associateCompany || {}).value }, Boolean(associateCompany));
    const { exportAuditSchedule } = useExportAuditSchedule((response) => {
        const blob = new Blob([response.data], { type: response.headers['content-type'] })
        const URL = window.URL || window.webkitURL;
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = 'data1.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }, () => {

    })

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
                options: (locations || []).map(x => {
                    const { id, location } = x || {};
                    const { name, code, cities } = location || {};
                    const { state } = cities || {};
                    return {
                        id,
                        name: `${name} (${state.code}-${cities.code}-${code})`
                    }
                }),
                isDisabled: !Boolean(associateCompany),
                isLoading: fetchingLocations,
                className: 'grid-col-100'
            },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'fromDate',
                label: 'From Date',
                fieldType: 'date',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ]
            },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'toDate',
                label: 'To Date',
                fieldType: 'date',
                validate: [
                    { type: validatorTypes.REQUIRED }
                ]
            }
        ],
    };

    function debugForm(_form) {
        setForm(_form);
        setExportData(_form.values);
    }

    function onParentCompanyChange(e) {
        setParentCompany(e);
        setAssociateCompany(null);
        setExportData({ ...exportData, parentCompany: e, associateCompany: null, locations: null });
    }

    function onAssociateCompanyChange(e) {
        setAssociateCompany(e);
        setExportData({ ...exportData, associateCompany: e, locations: null });
    }

    function handleSubmit() {
        if (form.valid) {
            const { parentCompany, associateCompany, locations, fromDate, toDate } = exportData;
            const payload = {
                company: parentCompany.value,
                associateCompany: (associateCompany || {}).value || '',
                location: (locations || {}).value || '',
                fromDate: new Date(fromDate).toISOString(),
                toDate: new Date(toDate).toISOString()
            };
            exportAuditSchedule(payload);
        }
    }

    function resetForm() {
        setExportData({ hideButtons: true });
    }

    return (
        <>
            <MastersLayout title="Audit Schedule" breadcrumbs={breadcrumb}>
                <div className="d-flex flex-column mx-0 mt-4">
                    <div className="d-flex flex-row justify-content-center mb-4">
                        <div className="col-6 px-4 border-end">
                            <div className="d-flex flex-column">
                                <div className="text-lg fw-bold mb-4">Export Audit Schedule</div>
                                <div className="d-flex flex-column h-100 justify-space-between p-4 horizontal-form col2">
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
                        <div className="col-6 p-4">
                            <div className="d-flex flex-column card p-4">
                                <div className="text-lg fw-bold mb-4">Import Audit Schedule</div>
                                <p>
                                    Import an Audit schedule to create the ToDos for the associated company locations to be audited.
                                </p>
                                <p>
                                    In order to do the same, export the Audit schedule which gives download the excel with all the associate company locations and mappings assigned.
                                    Update the highlighted columns from the excel downloaded and import to see the ToDos generated.
                                </p>
                                <div>
                                    <Button variant="primary" onClick={() => setImportFile(true)} className="ms-4 px-4">{'Import'}</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </MastersLayout>
            {
                importFile && <AuditScheduleImportModal onClose={() => setImportFile(false)} />
            }
        </>
    )
}

export default AuditSchedule;