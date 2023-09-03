import React, { useState, useRef, useEffect } from "react";
import dayjs from "dayjs";
import { ACTIONS, ACTIVITY_STATUS, STATUS_MAPPING } from "../../../common/Constants";
import { ACTIVITY_TYPE, ACTIVITY_TYPE_ICONS, API_DELIMITER } from "../../../../utils/constants";
import { useGetAllComplianceActivities } from "../../../../backend/compliance";
import { getUserDetails, hasUserAccess } from "../../../../backend/auth";
import { USER_PRIVILEGES } from "../../UserManagement/Roles/RoleConfiguration";
import Icon from "../../../common/Icon";
import Table, { CellTmpl, DEFAULT_PAYLOAD, TitleTmpl, reactFormatter } from "../../../common/Table";
import styles from "./Styles.module.css";
import ComplianceActivityDetails from "./ComplianceActivityDetails";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { COMPLIANCE_ACTIVITY_INDICATION, ComplianceStatusMapping, setUserDetailsInFilters } from "../../../../constants/Compliance.constants";

const SortFields: any = {
    'act.name': 'actname',
    'rule.name': 'rulename',
    'activity.name': 'activityname',
    'associateCompany.name': 'associatecompanyname',
    'location.name': 'locationname',
    'activity.type': 'activityType'
};

function ComplianceOwnerActivities({ dateRange, filters }: any) {
    const [activity, setActivity] = useState<any>();
    const [action, setAction] = useState(ACTIONS.NONE);
    const [data, setData] = useState<any>();
    const [params, setParams] = useState<any>();
    const [payload, setPayload] = useState<any>(null);
    const payloadRef: any = useRef();
    payloadRef.current = payload;
    const { activities, total, isFetching, refetch } = useGetAllComplianceActivities(payload, hasFilters(null, 'fromDate'));

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
                <FontAwesomeIcon icon={faCircle} className="text-md" style={{ color: COMPLIANCE_ACTIVITY_INDICATION[status] || '' }} />
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
            title: "", width: 40,
            headerSort: false,
            formatter: reactFormatter(<ActionColumnElements />)
        },
        {
            title: "", width: 40, field: "status",
            headerSort: false,
            formatter: reactFormatter(<FormIndicationTmpl />)
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
    ]

    const [tableConfig] = useState({
        paginationMode: 'remote',
        ajaxRequestFunc,
        columns,
        rowHeight: 'auto',
        selectable: false,
        paginate: true,
        bufferSpacing: 20,
        initialSort: [{ column: 'month', dir: 'desc' }]
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
                columnName: SortFields[field] || field || 'month',
                order: dir || 'desc'
            }
        };
        setParams(_params);
        setPayload({
            ...DEFAULT_PAYLOAD,
            ..._params,
            filters: setUserDetailsInFilters([])
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

    useEffect(() => {
        if (dateRange) {
            const _payload = { ...DEFAULT_PAYLOAD, ...payload };
            const _filters = _payload.filters;
            const fromIndex = _filters.findIndex((x: any) => x.columnName.toLowerCase() === 'fromdate');
            const fromDate = dayjs(dateRange.from).toISOString();
            if (fromIndex === -1) {
                _filters.push({ columnName: 'fromDate', value: fromDate });
            } else {
                _filters[fromIndex].value = fromDate;
            }
            const toIndex = _filters.findIndex((x: any) => x.columnName.toLowerCase() === 'todate');
            const toDate = dayjs(dateRange.to).toISOString();
            if (toIndex === -1) {
                _filters.push({ columnName: 'toDate', value: toDate });
            } else {
                _filters[toIndex].value = toDate;
            }
            setPayload({ ..._payload, filters: setUserDetailsInFilters(_filters) });
        }
    }, [dateRange]);

    useEffect(() => {
        if (filters) {
            const _payload = { ...DEFAULT_PAYLOAD, ...payload };
            const _filters = _payload.filters;
            const fromDate = _filters.find((x: any) => x.columnName.toLowerCase() === 'fromdate');
            const toDate = _filters.find((x: any) => x.columnName.toLowerCase() === 'todate');
            const _fs = Object.keys(filters).map((columnName: string) => {
                return { columnName, value: filters[columnName] }
            });

            setPayload({
                ..._payload, filters: setUserDetailsInFilters([..._fs, fromDate, toDate])
            });
        }
    }, [filters]);

    useEffect(() => {
        if (!isFetching && payload) {
            setData(formatApiResponse(params, activities, total));
        }
    }, [isFetching])

    return (
        <>
            <div className="d-flex flex-column overflow-hidden">
                {/* <div className="mb-0 text-appprimary text-xl fw-bold">Compliance Schedule</div> */}
                <div className={`card shadow ${styles.tableWrapper}`}>
                    <div className={styles.flexibleContainer}>
                        <Table data={data} options={tableConfig} isLoading={isFetching} onPageNav={handlePageNav} />
                    </div>
                </div>
            </div>
            {
                action === ACTIONS.EDIT && Boolean(activity) &&
                <ComplianceActivityDetails data={activity} onCancel={dismissAction} onSubmit={() => dismissAction(true)} />
            }
        </>
    );

}

export default ComplianceOwnerActivities;