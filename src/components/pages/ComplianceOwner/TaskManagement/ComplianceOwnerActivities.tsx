import React, { useState, useRef, useEffect } from "react";
import dayjs from "dayjs";
import { ACTIONS } from "../../../common/Constants";
import { ACTIVITY_TYPE, ACTIVITY_TYPE_ICONS, API_DELIMITER, ERROR_MESSAGES } from "../../../../utils/constants";
import { useExportComplianceActivities, useGetAllComplianceActivities } from "../../../../backend/compliance";
import { hasUserAccess } from "../../../../backend/auth";
import { USER_PRIVILEGES } from "../../UserManagement/Roles/RoleConfiguration";
import Icon from "../../../common/Icon";
import Table, { CellTmpl, DEFAULT_PAYLOAD, TitleTmpl, reactFormatter } from "../../../common/Table";
import styles from "./Styles.module.css";
import ComplianceActivityDetails from "./ComplianceActivityDetails";
import {
    COMPLIANCE_ACTIVITY_INDICATION,
    ComplianceStatusMapping, setUserDetailsInFilters
} from "../../../../constants/Compliance.constants";
import { get } from "../../../../backend/request";
import { download, downloadFileContent, preventDefault } from "../../../../utils/common";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import PageLoader from "../../../shared/PageLoader";
import * as api from "../../../../backend/request";

const SortFields: any = {
    'month': 'startDate',
    'act.name': 'actname',
    'rule.name': 'rulename',
    'activity.name': 'activityname',
    'associateCompany.name': 'associatecompanyname',
    'location.name': 'locationname',
    'activity.type': 'activityType',
    'veritical.name': 'verticalName'
};

function ComplianceOwnerActivities({ filters, handleCounts }: any) {
    const isEscalationManager = hasUserAccess(USER_PRIVILEGES.ESCALATION_DASHBOARD);
    const [activity, setActivity] = useState<any>();
    const [action, setAction] = useState(ACTIONS.NONE);
    const [data, setData] = useState<any>();
    const [params, setParams] = useState<any>();
    const [payload, setPayload] = useState<any>(null);
    const payloadRef: any = useRef();
    payloadRef.current = payload;
    const { activities, total, statusCount, isFetching, refetch } = useGetAllComplianceActivities(payload, enableActivities());
    const { exportComplianceActivities, exporting } = useExportComplianceActivities((response: any) => {
        downloadFileContent({
            name: 'Compliance Activities.xlsx',
            type: response.headers['content-type'],
            content: response.data
        });
    }, () => {
        toast.error(ERROR_MESSAGES.DEFAULT);
    });

    function enableActivities() {
        const hasCompany = hasFilters(null);
        const hasStartDate = hasFilters(null, 'startDateFrom');
        return isEscalationManager ? hasCompany && hasStartDate : hasStartDate;
    }

    function hasFilters(ref: any, field = 'companyId') {
        const _filters = (ref ? ref.current : { ...(payloadRef.current || {}) }.filters) || [];
        const column = _filters.find((x: any) => x.columnName === field);
        return Boolean((column || {}).value);
    }

    function dismissAction(refresh = false) {
        setAction(ACTIONS.NONE);
        setActivity(null);
        if (refresh) {
            refetch();
        }
    }

    function MonthTmpl({ cell }: any) {
        const row = cell.getData();
        return (
            <>{row.month} ({row.year})</>
        )
    }
    function LocationTmpl({ cell }: any) {
        const { company, associateCompany, location } = cell.getData();
        return (
            <>{company.code}-{associateCompany.code}-{location.code}</>
        )
    }

    function DueDateTmpl({ cell }: any) {
        const value = cell.getValue();
        return (
            <span className="text-warn" >{dayjs(value).format('DD-MM-YYYY')}</span>
        )
    }

    function FormStatusTmpl({ cell }: any) {
        const status = cell.getValue();
        return (
            <div className="d-flex align-items-center position-relative">
                <span className="ellipse" style={{ color: COMPLIANCE_ACTIVITY_INDICATION[status] || '' }}>{ComplianceStatusMapping[status] || status}</span>
            </div>
        )
    }

    function FormIndicationTmpl({ cell }: any) {
        const status = cell.getValue();
        return (
            <div className="d-flex align-items-center">
                <Icon name="circle" style={{ color: COMPLIANCE_ACTIVITY_INDICATION[status] || '' }} text={ComplianceStatusMapping[status]} />
            </div>
        )
    }

    function DownloadFormTmpl({ cell }: any) {
        const row = cell.getData();
        return (
            <div className="d-flex align-items-center">
                <Icon name="download" className={styles.downloadIcon} text={'Download Form'} data={row} action={downloadForm} />
            </div>
        )
    }

    function ActionColumnElements({ cell }: any) {
        const row = cell.getData();
        const hasAccess = hasUserAccess(USER_PRIVILEGES.OWNER_ACTIVITIES_SUBMIT) || hasUserAccess(USER_PRIVILEGES.MANAGER_ACTIVITIES_REVIEW);

        return (
            <div className="d-flex flex-row align-items-center position-relative">
                <Icon className="me-3" type="button" name={hasAccess ? "pencil" : "eye"} text={hasAccess ? "Edit" : "View"} data={row} action={handleEdit} />
            </div>
        )
    }

    function ActionHeaderTmpl() {
        return (
            <div className={`nav-item dropdown ${styles.tableActions}`}>
                <div className="nav-link text-white" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <FontAwesomeIcon icon={faEllipsisV} />
                </div>
                <div className="dropdown-menu">
                    <a className="dropdown-item" href="/" onClick={handleExport}>Export-m</a>
                    <a className="dropdown-item" href="/" onClick={bulkFileDownload}>All Files Download</a>
                    {/* <a className="dropdown-item" href="/" onClick={handleAddNotice}>Add Notice</a> */}
                </div>
            </div>
        )
    }

    function bulkFileDownload(event:any){
        //const _request = { ...reduceArraytoObj(lfRef.current), ...reduceArraytoObj(afRef.current) };
       // console.log(_request);
       // console.log(checkedStatuses);

        //const selectedStatuses = Object.keys(checkedStatuses)
        //.filter((status) => checkedStatuses[status] === true) // Filter only the true values
        //.join('-'); // Join them with a hyphen

    // Handle the case when no statuses are true (optional)
    //const finalStatuses = selectedStatuses || null;

        // const _payload = {
        //     company: _request.companyId,
        //     associateCompany: _request.associateCompanyId,
        //     location: _request.locationId,
        //     month: _request.month,
        //     year: _request.year,
        //     statuses: finalStatuses // Assign the concatenated true statuses
        // };

        const _payload = {
            company: '',
            associateCompany: '',
            location: '',
            month: '',
            year: '',
            statuses: '' // Assign the concatenated true statuses
        };

        console.log(_payload);
        const _idData=[];
        event.preventDefault();
        const arrayOfData=data.data;
        let filtered = arrayOfData.filter((t: { id: string; })=>t.id);
        for(let i of filtered){
            _idData.push(i.id)
        }
        console.log(_idData);
        if(_idData.length>0){
            // const fullPayload = {
            //     toDoIds: _idData, // Array of GUIDs
            //     searchParamsforToDo: {
            //         company: _request.companyId,
            //         associateCompany: _request.associateCompanyId,
            //         location: _request.locationId,
            //         month: _request.month ? _request.month : "", // Ensure month has a value or set a default string
            //         year: _request.year ? _request.year : 0,           // Ensure year has a value or set 0 as default
            //         statuses: finalStatuses ? finalStatuses : " "// The concatenated string of statuses
            //     }
            // };
            const fullPayload = {
                toDoIds: _idData, // Array of GUIDs
                searchParamsforToDo: {
                    company: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    associateCompany: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    location: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                    month: 'string', // Ensure month has a value or set a default string
                    year: 0,           // Ensure year has a value or set 0 as default
                    statuses: 'string'// The concatenated string of statuses
                }
            };
            console.log(fullPayload)
            api.post('/api/ComplianceDetails/GetByToDoWithZipFiles', fullPayload, {
                responseType: 'blob' // Set response type to 'blob' to handle binary data
            }).then(response => {
                // Since the filename is predefined on the server, use it directly
                const filename = 'Compliance-UploadedFiles.zip'; // Static filename
            
                // Create a new Blob object using the response data
                const blob = new Blob([response.data], { type: 'application/zip' });
            
                // Create a link element
                const link = document.createElement('a');
            
                // Create a URL for the Blob and set it as the href attribute
                const url = window.URL.createObjectURL(blob);
                link.href = url;
            
                // Set the download attribute to the filename
                link.download = filename;
            
                // Append the link to the document body and simulate a click to trigger the download
                document.body.appendChild(link);
                link.click();
            
                // Remove the link after the download is triggered
                document.body.removeChild(link);
            
                // Clean up the object URL after the download is complete
                window.URL.revokeObjectURL(url);
            }).catch(error => {
                console.error("Error downloading the file:", error);
                toast.error("Failed to download the ZIP file.");
            });
        }
        else{
                return toast.warning("No files found");        }
        
    }

    function ActivityTypeTmpl({ cell }: any) {
        const value = cell.getValue() || ACTIVITY_TYPE.AUDIT;
        return (
            <div className="d-flex flex-row align-items-center justify-content-center position-relative">
                <Icon name={ACTIVITY_TYPE_ICONS[value]} text={value} />
            </div>
        )
    }

    const columns = [
        {
            title: "Actions", hozAlign: "right", width: 120,
            headerSort: false,
            formatter: reactFormatter(<ActionColumnElements />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        },
        {
            title: "", width: 40,
            headerSort: false,
            formatter: reactFormatter(<ActionColumnElements />),
            // titleFormatter: reactFormatter(<ActionHeaderTmpl />)
        },
        {
            title: "", width: 30, field: "status",
            headerSort: false,
            formatter: reactFormatter(<FormIndicationTmpl />)
        },
        {
            title: "", width: 30, field: "download",
            headerSort: false,
            formatter: reactFormatter(<DownloadFormTmpl />)
        },
        {
            title: "Month (Year)", field: "month", width: 120,
            formatter: reactFormatter(<MonthTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        },
        {
            title: "Owner", field: "complianceOwner.name",
            formatter: reactFormatter(<CellTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />),
            widthGrow: 1, minWidth: 140,
            visible: hasUserAccess(USER_PRIVILEGES.MANAGER_DASHBOARD) || hasUserAccess(USER_PRIVILEGES.ESCALATION_DASHBOARD)
        },
        {
            title: "Manager", field: "complianceManager.name",
            formatter: reactFormatter(<CellTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />),
            widthGrow: 1, minWidth: 140,
            visible: hasUserAccess(USER_PRIVILEGES.OWNER_DASHBOARD) || hasUserAccess(USER_PRIVILEGES.ESCALATION_DASHBOARD)
        },
        {
            title: "Vertical", field: "veritical.name",
            formatter: reactFormatter(<CellTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />),
            widthGrow: 1, minWidth: 140
        },
        {
            title: "Department", field: "department.name",
            formatter: reactFormatter(<CellTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />),
            widthGrow: 1, minWidth: 140
        },
        {
            title: "Location", field: "location", headerSort: false,
            formatter: reactFormatter(<LocationTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />),
            widthGrow: 1, minWidth: 200
        },
        {
            title: "Act", field: "act.name", widthGrow: 2, minWidth: 140, maxWidth: 300,
            formatter: reactFormatter(<CellTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        },
        {
            title: "Rule", field: "rule.name", widthGrow: 2, minWidth: 140, maxWidth: 300,
            formatter: reactFormatter(<CellTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        },
        {
            title: "Activity", field: "activity.name", minWidth: 140, maxWidth: 300,
            formatter: reactFormatter(<CellTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />),
            widthGrow: 2
        },
        {
            title: "Activity Type", field: "activity.type",
            formatter: reactFormatter(<CellTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />),
            minWidth: 140, maxWidth: 200
        },
        {
            title: "Due Date", field: "dueDate", width: 120,
            formatter: reactFormatter(<DueDateTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        },
        {
            title: "Forms Status", field: "status", width: 160,
            formatter: reactFormatter(<FormStatusTmpl />),
            titleFormatter: reactFormatter(<TitleTmpl />)
        }
    ];

    function rowFormatter(row: any) {
        const data = row.getData();
        const element = row.getElement();
        if (data.isNotice) {
            element.classList.add('notice-activity');
        }
    }

    const [tableConfig] = useState({
        paginationMode: 'remote',
        ajaxRequestFunc,
        columns,
        rowHeight: 'auto',
        minHeight: '100%',
        selectable: false,
        paginate: true,
        bufferSpacing: 20,
        initialSort: [{ column: 'month', dir: 'desc' }],
        rowFormatter
    });

    function formatApiResponse(params: any, list: any[], totalRecords: number) {
        const { pagination } = params || {};
        const { pageSize, pageNumber } = pagination || {};
        const tdata = {
            data: list,
            total: totalRecords,
            last_page: Math.ceil(totalRecords / (pageSize || 1)) || 1,
            page: pageNumber || 1
        };
        setData(tdata);
        return tdata;
    }

    function ajaxRequestFunc(url: any, config: any, params: any) {
        const { field, dir } = (params.sort || [])[0] || {};
        const _params = {
            pagination: {
                pageSize: params.size,
                pageNumber: params.page
            },
            sort: {
                columnName: SortFields[field] || field || 'startDate',
                order: dir || 'desc'
            }
        };
        setParams(_params);
        const _payload = { ...DEFAULT_PAYLOAD, ...payloadRef.current };
        const _filters = _payload.filters || [];
        setPayload({
            ...DEFAULT_PAYLOAD,
            ..._params,
            filters: setUserDetailsInFilters(_filters)
        });
        return Promise.resolve(formatApiResponse(params, activities, total));
    }

    function handlePageNav(_pagination: any) {
        const _params = { ...params };
        _params.pagination = _pagination;
        setParams({ ..._params });
        setPayload({ ...payload, ..._params })
    }

    function handleEdit(_activity: any) {
        setActivity(_activity)
        setAction(ACTIONS.EDIT);
    }

    function handleCancel(refresh = false) {
        setAction(ACTIONS.NONE);
        if (refresh) {
            refetch();
        }
    }

    function handleExport(event: any) {
        event.preventDefault();
        if (!total) {
            toast.warn('There are no compliance activities available for the selected filter criteria.');
            return;
        }
        exportComplianceActivities({...payloadRef.current, pagination: null});
    }

    function handleAddNotice(event: any) {
        preventDefault(event);
    }

    function downloadForm(activity: any) {
        get(`/api/ActStateMapping/Get?id=${activity.actStateMappingId}`).then(response => {
            if (response.data.filePath) {
                download(response.data.fileName, response.data.filePath)
            } else {
                toast.warn('No files available');
            }
        });
    }

    useEffect(() => {
        if (filters) {
            const _payload = {
                ...DEFAULT_PAYLOAD,
                sort: { columnName: 'startDate', order: 'desc' },
                ...payload
            };
            setPayload({
                ..._payload, filters: setUserDetailsInFilters([...filters])
            });
        }
    }, [filters]);

    useEffect(() => {
        if (!isFetching && payload) {
            setData(formatApiResponse(params, activities, total));
            handleCounts(statusCount);
        }
    }, [isFetching])

    return (
        <>
            <div className="d-flex flex-column overflow-hidden">
                <div className={`card shadow ${styles.tableWrapper}`}>
                    <ActionHeaderTmpl />
                    <div className={styles.flexibleContainer}>
                        <Table data={data} options={tableConfig} isLoading={isFetching} onPageNav={handlePageNav} />
                    </div>
                </div>
            </div>
            {
                action === ACTIONS.EDIT && Boolean(activity) &&
                <ComplianceActivityDetails data={activity} onCancel={dismissAction} onSubmit={() => dismissAction(true)} />
            }
            {
                exporting && <PageLoader />
            }
        </>
    );

}

export default ComplianceOwnerActivities;