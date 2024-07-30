import React, { useEffect } from 'react'
import PageLoader from '../../shared/PageLoader'
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import { getAllCompaniesDetails, getAssociateCompanies, getLocations } from '../../../redux/features/inputModule.slice';
import { Box, Button, Checkbox, Drawer, FormControl, FormControlLabel, FormLabel, IconButton, InputAdornment, InputLabel, MenuItem, Modal, OutlinedInput, Radio, RadioGroup, Select, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, TextField, Typography } from '@mui/material';
import { FaUpload, FaDownload } from "react-icons/fa";
import { IoMdAdd, IoMdClose, IoMdSearch } from "react-icons/io";
import { DEFAULT_OPTIONS_PAYLOAD, DEFAULT_PAYLOAD } from '../../common/Table';
import { addHoliday, deleteHoliday, editHoliday, getHolidaysList, resetAddHolidayDetails, resetBulkDeleteHolidaysDetails, resetDeleteHolidayDetails, resetEditHolidayDetails, resetUploadHolidayDetails, uploadHoliday } from '../../../redux/features/holidayList.slice';
import Icon from '../../common/Icon';
import { useExportEmployees, useExportHolidayList } from '../../../backend/exports';
import { download, downloadFileContent, preventDefault } from '../../../utils/common';
import { ERROR_MESSAGES } from '../../../utils/constants';
import { toast } from 'react-toastify';
import { Alert } from 'react-bootstrap';
import { bulkDeleteEmployees, getEmployees,resetBulkDeleteEmployees } from '../../../redux/features/employeeMaster.slice';
import { navigate, useQueryParams } from 'raviger';
import { getBasePath } from '../../../App';
import { hasUserAccess } from '../../../backend/auth';
import { USER_PRIVILEGES } from '../UserManagement/Roles/RoleConfiguration';


const style = {
  position: 'absolute' as 'absolute',
  top: '25%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
};

const styleUploadModal = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  boxShadow: 24,
};

const EmployeeMasterUpload = () => {

  const dispatch = useAppDispatch();

  const employeeDetails = useAppSelector((state) => state.employeeMaster.employeesDetails)

  const holidayListDetails = useAppSelector((state) => state.holidayList.holidayListDetails)
  const deleteHolidayDetails = useAppSelector((state) => state.holidayList.deleteHolidayDetails)
  const addHolidayDetails = useAppSelector((state) => state.holidayList.addHolidayDetails)
  const uploadHolidayDetails = useAppSelector((state) => state.holidayList.uploadHolidayDetails)
  const editHolidayDetails = useAppSelector((state) => state.holidayList.editHolidayDetails)

  const companiesDetails = useAppSelector((state) => state.inputModule.companiesDetails);
  const associateCompaniesDetails = useAppSelector((state) => state.inputModule.associateCompaniesDetails);
  const locationsDetails = useAppSelector((state) => state.inputModule.locationsDetails);
  const bulkDeleteEmployeeDetails = useAppSelector((state) => state.employeeMaster.bulkDeleteEmployeeDetails)

  const { exportEmployees, exporting } = useExportEmployees((response: any) => {
    downloadFileContent({
      name: 'Employees.xlsx',
      type: response.headers['content-type'],
      content: response.data
    });
  }, () => {
    toast.error(ERROR_MESSAGES.DEFAULT);
  });

  const employees = employeeDetails.data.list
  const employeesCount = employeeDetails.data.count
  console.log("employees", employees, 'employeesCount', employeesCount)

  const holidays = holidayListDetails.data.list
  const holidaysCount = holidayListDetails.data.count
  const companies = companiesDetails.data.list
  const associateCompanies = associateCompaniesDetails.data.list
  const locations = locationsDetails.data.list

  const loading = exporting || bulkDeleteEmployeeDetails.status === 'loading' || editHolidayDetails.status === 'loading' || uploadHolidayDetails.status === 'loading' || addHolidayDetails.status === 'loading' || deleteHolidayDetails.status === 'loading' || employeeDetails.status === 'loading' || companiesDetails.status === 'loading' || associateCompaniesDetails.status === 'loading' || locationsDetails.status === 'loading'

  const [query] = useQueryParams();

  const [company, setCompany] = React.useState(query.company ? query.company: '');
  const [associateCompany, setAssociateCompany] = React.useState(query.associateCompany ? query.associateCompany : '');
  const [location, setLocation] = React.useState((query.location && query.stateName) ? (query.location+ '^' + query.stateName) : '');
  const [year, setYear] = React.useState('');
  const [month, setMonth] = React.useState('');
  const [day, setDay] = React.useState('');
  const [name, setName] = React.useState('')

  const [searchInput, setSearchInput] = React.useState('');
  const [activeSort, setActiveSort] = React.useState('code')
  const [sortType, setSortType] = React.useState<any>('asc')

  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [page, setPage] = React.useState(0);

  const [holiday, setHoliday] = React.useState<any>({});
  const [openModal, setOpenModal] = React.useState(false);
  const [modalType, setModalType] = React.useState('');

  const [optionalHoliday, setOptionalHoliday] = React.useState(true);
  const [restrictedHoliday, setRestrictedHoliday] = React.useState(true);

  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [openUploadModal, setOpenUploadModal] = React.useState(false);
  const [uploadData, setUploadData] = React.useState<any>();
  const [uploadError, setUploadError] = React.useState(false);


  const [selectedEmployees, setSelectedEmployees] = React.useState<any>([]);
  const [openBulkDeleteModal, setOpenBulkDeleteModal] = React.useState(false);

  const handleChangeCompany = (event: any) => {
    setAssociateCompany(''); setLocation(''); setYear(''); setMonth(''); setCompany(event.target.value);
    const employeesPayload: any = {
      search: searchInput,
      filters: [
        {
          columnName: 'companyId',
          value: event.target.value
        }
      ],
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page + 1
      },
      sort: { columnName: 'code', order: 'asc' },
      "includeCentral": true
    }
    dispatch(getEmployees(employeesPayload))
  };

  const handleChangeAssociateCompany = (event: any) => {
    setLocation('')
    setYear('')
    setMonth('')
    setAssociateCompany(event.target.value);
    const employeesPayload: any = {
      search: searchInput,
      filters: [
        {
          columnName: 'companyId',
          value: company
        },
        {
          columnName: 'associateCompanyId',
          value: event.target.value
        }
      ],
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page + 1
      },
      sort: { columnName: 'code', order: 'asc' },
      "includeCentral": true
    }
    dispatch(getEmployees(employeesPayload))
  };

  const handleChangeLocation = (event: any) => {
    setYear('')
    setMonth('')
    setLocation(event.target.value);
    const employeesPayload: any = {
      search: searchInput,
      filters: [
        {
          columnName: 'companyId',
          value: company
        },
        {
          columnName: 'associateCompanyId',
          value: associateCompany
        },
        {
          columnName: 'locationId',
          value: event.target.value.split('^')[0]
        }
      ],
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page + 1
      },
      sort: { columnName: 'code', order: 'asc' },
      "includeCentral": true
    }
    dispatch(getEmployees(employeesPayload))
  };

  const handleChangeYear = (event: any) => {
    setYear('')
    setYear(event.target.value.toString());
    const employeesPayload: any = {
      search: searchInput,
      filters: [
        {
          columnName: 'companyId',
          value: company
        },
        {
          columnName: 'associateCompanyId',
          value: associateCompany
        },
        {
          columnName: 'locationId',
          value: location.split('^')[0]
        },
        {
          columnName: 'year',
          value: event.target.value.toString()
        }
      ],
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page + 1
      },
      sort: { columnName: 'code', order: 'asc' },
      "includeCentral": true
    }
    dispatch(getEmployees(employeesPayload))
  };

  const handleChangeMonth = (event: any) => {
    setMonth(event.target.value);
    const monthName = event.target.value
    let monthKey: any
    if (monthName === 'January') {
      monthKey = 1
    } else if (monthName === 'February') {
      monthKey = 2
    } else if (monthName === 'March') {
      monthKey = 3
    } else if (monthName === 'April') {
      monthKey = 4
    } else if (monthName === 'May') {
      monthKey = 5
    } else if (monthName === 'June') {
      monthKey = 6
    } else if (monthName === 'July') {
      monthKey = 7
    } else if (monthName === 'August') {
      monthKey = 8
    } else if (monthName === 'September') {
      monthKey = 9
    } else if (monthName === 'October') {
      monthKey = 10
    } else if (monthName === 'November') {
      monthKey = 11
    } else if (monthName === 'December') {
      monthKey = 12
    }
    const employeesPayload: any = {
      search: searchInput,
      filters: [
        {
          columnName: 'companyId',
          value: company
        },
        {
          columnName: 'associateCompanyId',
          value: associateCompany
        },
        {
          columnName: 'locationId',
          value: location.split('^')[0]
        },
        {
          columnName: 'year',
          value: year
        },
        {
          columnName: 'month',
          value: monthKey.toString()
        }
      ],
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page + 1
      },
      sort: { columnName: 'code', order: 'asc' },
      "includeCentral": true
    }
    dispatch(getEmployees(employeesPayload))
  };

  const handleChangeSearchInput = (event: any) => {
    setSearchInput(event.target.value)
  }

  const handleChangeOptionalHoliday = (event: any) => {
    if ('true' === event.target.value) {
      setOptionalHoliday(true)
    } else {
      setOptionalHoliday(false)
    }
  }

  const handleChangeRestrictedHoliday = (event: any) => {
    if ('true' === event.target.value) {
      setRestrictedHoliday(true)
    } else {
      setRestrictedHoliday(false)
    }
  }

  useEffect(() => {
   
    const employeesPayload: any = {
      search: "",
      filters: [],
      pagination: {
        pageSize: 10,
        pageNumber: 1
      },
      sort: { columnName: 'name', order: 'asc' },
      "includeCentral": true
    }

    dispatch(getEmployees(employeesPayload))
    const companiesPayload: any = { ...DEFAULT_OPTIONS_PAYLOAD, filters: [{ columnName: 'isParent', value: 'true' }] }
    dispatch(getAllCompaniesDetails(companiesPayload))
  }, [])

  useEffect(() => {
    const payload: any = { ...DEFAULT_OPTIONS_PAYLOAD, filters: [{ columnName: 'isParent', value: 'false' }, { columnName: 'parentCompanyId', value: company }] }
    if (company) {
      dispatch(getAssociateCompanies(payload))
    }
  }, [company])

  useEffect(() => {
    const payload: any = {
      ...DEFAULT_OPTIONS_PAYLOAD, filters: [
        { columnName: 'companyId', value: associateCompany }],
      sort: { columnName: 'locationName', order: 'asc' }
    }
    if (associateCompany) {
      dispatch(getLocations(payload))
    }
  }, [associateCompany])

  useEffect(() => {
    if (employeeDetails.status === 'succeeded') {
      
    } else if (employeeDetails.status === 'failed') {
      toast.error(ERROR_MESSAGES.DEFAULT);
    }
  }, [employeeDetails.status])

  useEffect(() => {
    if (deleteHolidayDetails.status === 'succeeded') {
      toast.success(`${holiday.name} deleted successfully.`)
      setHoliday({})
      dispatch(resetDeleteHolidayDetails())
      setOpenDeleteModal(false)
      const HolidayListDefaultPayload: any = {
        search: "",
        filters: [],
        pagination: {
          pageSize: 10,
          pageNumber: 1
        },
        sort: { columnName: 'name', order: 'asc' },
        "includeCentral": true
      }
      dispatch(getHolidaysList(HolidayListDefaultPayload))
    } else if (deleteHolidayDetails.status === 'failed') {
      toast.error(ERROR_MESSAGES.DEFAULT);
    }
  }, [deleteHolidayDetails.status])

  useEffect(() => {
    if (addHolidayDetails.status === 'succeeded') {
      toast.success(`Holiday Added successfully.`)
      dispatch(resetAddHolidayDetails())
      setOpenModal(false); setModalType(''); setHoliday({}); setCompany(''); setAssociateCompany(''); setLocation(''); setYear(''); setMonth(''); setDay(''); setName(''); setRestrictedHoliday(true); setOptionalHoliday(true);
      const HolidayListDefaultPayload: any = {
        search: "",
        filters: [],
        pagination: {
          pageSize: 10,
          pageNumber: 1
        },
        sort: { columnName: 'name', order: 'asc' },
        "includeCentral": true
      }
      dispatch(getHolidaysList(HolidayListDefaultPayload))
    } else if (addHolidayDetails.status === 'failed') {
      setOpenModal(false); setModalType(''); setHoliday({}); setCompany(''); setAssociateCompany(''); setLocation(''); setYear(''); setMonth(''); setDay(''); setName(''); setRestrictedHoliday(true); setOptionalHoliday(true);
      toast.error(ERROR_MESSAGES.DEFAULT);
    }
  }, [addHolidayDetails.status])

  useEffect(() => {
    if (uploadHolidayDetails.status === 'succeeded') {
      if (uploadHolidayDetails.data.size === 0) {
        toast.success(`Holiday List Uploaded successfully.`)
        dispatch(resetUploadHolidayDetails())
        setOpenUploadModal(false)
        setUploadError(false)
        const HolidayListDefaultPayload: any = {
          search: "",
          filters: [],
          pagination: {
            pageSize: 10,
            pageNumber: 1
          },
          sort: { columnName: 'name', order: 'asc' },
          "includeCentral": true
        }
        dispatch(getHolidaysList(HolidayListDefaultPayload))
      } else {
        setUploadError(true)
      }
    } else if (uploadHolidayDetails.status === 'failed') {
      toast.error(ERROR_MESSAGES.DEFAULT);
    }
  }, [uploadHolidayDetails])

  useEffect(() => {
    if (editHolidayDetails.status === 'succeeded') {
      toast.success(`Holiday Updated successfully.`)
      dispatch(resetEditHolidayDetails())
      setOpenModal(false); setModalType(''); setHoliday({}); setCompany(''); setAssociateCompany(''); setLocation(''); setYear(''); setMonth(''); setDay(''); setName(''); setRestrictedHoliday(true); setOptionalHoliday(true);
      const HolidayListDefaultPayload: any = {
        search: "",
        filters: [],
        pagination: {
          pageSize: 10,
          pageNumber: 1
        },
        sort: { columnName: 'name', order: 'asc' },
        "includeCentral": true
      }
      dispatch(getHolidaysList(HolidayListDefaultPayload))
    } else if (editHolidayDetails.status === 'failed') {
      setOpenModal(false); setModalType(''); setHoliday({}); setCompany(''); setAssociateCompany(''); setLocation(''); setYear(''); setMonth(''); setDay(''); setName(''); setRestrictedHoliday(true); setOptionalHoliday(true);
      toast.error(ERROR_MESSAGES.DEFAULT);
    }
  }, [editHolidayDetails.status])


  useEffect(() => {
    if(query.company && query.associateCompany && query.location && query.stateName){
      const payload = {
        search: "",
        filters: [
          {
            columnName: 'companyId',
            value: query.company
          },
          {
            columnName: 'associateCompanyId',
            value: query.associateCompany
          },
          {
            columnName: 'locationId',
            value: query.location.split('^')[0]
          }
        ],
        pagination: {
          pageSize: 10,
          pageNumber: 1
        },
        sort: { columnName: 'code', order: 'asc' },
        "includeCentral": true
      }
      dispatch(getEmployees(payload))
    }
  }, [])

  const yearsList = []
  const currentYear = new Date().getFullYear();

  for (let i = currentYear; i >= 1950; i--) {
    yearsList.push(i)
  }

  const monthList = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]

  const onClickExport = () => {
    const filters = []
    if (company) {
      filters.push({
        columnName: 'companyId',
        value: company
      })
    }
    if (associateCompany) {
      filters.push({
        columnName: 'associateCompanyId',
        value: associateCompany
      })
    }
    if (location) {
      filters.push({
        columnName: 'locationId',
        value: location.split('^')[0]
      })
    }
    if (year) {
      filters.push({
        columnName: 'year',
        value: year
      })
    }
    if (month) {
      filters.push({
        columnName: 'month',
        value: month
      })
    }

    const employeesPayload: any = {
      search: searchInput,
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page + 1
      },
      sort: { columnName: activeSort, order: sortType },
      "includeCentral": true
    }
    exportEmployees({ ...employeesPayload, pagination: null });
  }

  const onClickSearch = () => {
    const employeesPayload: any = {
      search: searchInput,
      filters: [],
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page + 1
      },
      sort: { columnName: 'code', order: 'asc' },
      "includeCentral": true
    }
    dispatch(getEmployees(employeesPayload))
  }

  const onClickClearSearch = () => {
    const employeesPayload: any = {
      search: '',
      filters: [],
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page + 1
      },
      sort: { columnName: 'code', order: 'asc' },
      "includeCentral": true
    }
    dispatch(getEmployees(employeesPayload))
    setSearchInput('')
  }

  const onClickSortCode = () => {
    let type = 'asc'
    setActiveSort('code');
    if (sortType === 'asc') {
      setSortType('desc')
      type = 'desc'
    } else {
      setSortType('asc')
    }

    const filters = []
    if (company) {
      filters.push({
        columnName: 'companyId',
        value: company
      })
    }
    if (associateCompany) {
      filters.push({
        columnName: 'associateCompanyId',
        value: associateCompany
      })
    }
    if (location) {
      filters.push({
        columnName: 'locationId',
        value: location.split('^')[0]
      })
    }
    if (year) {
      filters.push({
        columnName: 'year',
        value: year
      })
    }
    if (month) {
      filters.push({
        columnName: 'month',
        value: month
      })
    }

    const employeesPayload: any = {
      search: searchInput,
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page + 1
      },
      sort: { columnName: 'code', order: type },
      "includeCentral": true
    }
    dispatch(getEmployees(employeesPayload))
  }

  const onClickSortName = () => {
    let type = 'asc'
    setActiveSort('name');
    if (sortType === 'asc') {
      setSortType('desc')
      type = 'desc'
    } else {
      setSortType('asc')
    }

    const filters = []
    if (company) {
      filters.push({
        columnName: 'companyId',
        value: company
      })
    }
    if (associateCompany) {
      filters.push({
        columnName: 'associateCompanyId',
        value: associateCompany
      })
    }
    if (location) {
      filters.push({
        columnName: 'locationId',
        value: location.split('^')[0]
      })
    }
    if (year) {
      filters.push({
        columnName: 'year',
        value: year
      })
    }
    if (month) {
      filters.push({
        columnName: 'month',
        value: month
      })
    }

    const employeesPayload: any = {
      search: searchInput,
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page + 1
      },
      sort: { columnName: 'name', order: type },
      "includeCentral": true
    }
    dispatch(getEmployees(employeesPayload))

  }

  const onClickSortDOB = () => {
    let type = 'asc'
    setActiveSort('dateOfBirth');
    if (sortType === 'asc') {
      setSortType('desc')
      type = 'desc'
    } else {
      setSortType('asc')
    }

    const filters = []
    if (company) {
      filters.push({
        columnName: 'companyId',
        value: company
      })
    }
    if (associateCompany) {
      filters.push({
        columnName: 'associateCompanyId',
        value: associateCompany
      })
    }
    if (location) {
      filters.push({
        columnName: 'locationId',
        value: location.split('^')[0]
      })
    }
    if (year) {
      filters.push({
        columnName: 'year',
        value: year
      })
    }
    if (month) {
      filters.push({
        columnName: 'month',
        value: month
      })
    }

    const employeesPayload: any = {
      search: searchInput,
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page + 1
      },
      sort: { columnName: 'dateOfBirth', order: type },
      "includeCentral": true
    }
    dispatch(getEmployees(employeesPayload))
  }

  const onClickSortDOJ = () => {
    let type = 'asc'
    setActiveSort('dateOfJoining');
    if (sortType === 'asc') {
      setSortType('desc')
      type = 'desc'
    } else {
      setSortType('asc')
    }

    const filters = []
    if (company) {
      filters.push({
        columnName: 'companyId',
        value: company
      })
    }
    if (associateCompany) {
      filters.push({
        columnName: 'associateCompanyId',
        value: associateCompany
      })
    }
    if (location) {
      filters.push({
        columnName: 'locationId',
        value: location.split('^')[0]
      })
    }
    if (year) {
      filters.push({
        columnName: 'year',
        value: year
      })
    }
    if (month) {
      filters.push({
        columnName: 'month',
        value: month
      })
    }

    const employeesPayload: any = {
      search: searchInput,
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page + 1
      },
      sort: { columnName: 'dateOfJoining', order: type },
      "includeCentral": true
    }
    dispatch(getEmployees(employeesPayload))
  }

  const onClickSortGender = () => {
    let type = 'asc'
    setActiveSort('gender');
    if (sortType === 'asc') {
      setSortType('desc')
      type = 'desc'
    } else {
      setSortType('asc')
    }

    const filters = []
    if (company) {
      filters.push({
        columnName: 'companyId',
        value: company
      })
    }
    if (associateCompany) {
      filters.push({
        columnName: 'associateCompanyId',
        value: associateCompany
      })
    }
    if (location) {
      filters.push({
        columnName: 'locationId',
        value: location.split('^')[0]
      })
    }
    if (year) {
      filters.push({
        columnName: 'year',
        value: year
      })
    }
    if (month) {
      filters.push({
        columnName: 'month',
        value: month
      })
    }

    const employeesPayload: any = {
      search: searchInput,
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page + 1
      },
      sort: { columnName: 'gender', order: type },
      "includeCentral": true
    }
    dispatch(getEmployees(employeesPayload))

  }

  const onClickSortDesignation = () => {
    let type = 'asc'
    setActiveSort('designation');
    if (sortType === 'asc') {
      setSortType('desc')
      type = 'desc'
    } else {
      setSortType('asc')
    }

    const filters = []
    if (company) {
      filters.push({
        columnName: 'companyId',
        value: company
      })
    }
    if (associateCompany) {
      filters.push({
        columnName: 'associateCompanyId',
        value: associateCompany
      })
    }
    if (location) {
      filters.push({
        columnName: 'locationId',
        value: location.split('^')[0]
      })
    }
    if (year) {
      filters.push({
        columnName: 'year',
        value: year
      })
    }
    if (month) {
      filters.push({
        columnName: 'month',
        value: month
      })
    }

    const employeesPayload: any = {
      search: searchInput,
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page + 1
      },
      sort: { columnName: 'designation', order: type },
      "includeCentral": true
    }
    dispatch(getEmployees(employeesPayload))

  }

  const onClickSortPan = () => {
    let type = 'asc'
    setActiveSort('panNumber');
    if (sortType === 'asc') {
      setSortType('desc')
      type = 'desc'
    } else {
      setSortType('asc')
    }

    const filters = []
    if (company) {
      filters.push({
        columnName: 'companyId',
        value: company
      })
    }
    if (associateCompany) {
      filters.push({
        columnName: 'associateCompanyId',
        value: associateCompany
      })
    }
    if (location) {
      filters.push({
        columnName: 'locationId',
        value: location.split('^')[0]
      })
    }
    if (year) {
      filters.push({
        columnName: 'year',
        value: year
      })
    }
    if (month) {
      filters.push({
        columnName: 'month',
        value: month
      })
    }

    const employeesPayload: any = {
      search: searchInput,
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page + 1
      },
      sort: { columnName: 'panNumber', order: type },
      "includeCentral": true
    }
    dispatch(getEmployees(employeesPayload))

  }

  const onClickSortAdhar = () => {
    let type = 'asc'
    setActiveSort('aadharNumber');
    if (sortType === 'asc') {
      setSortType('desc')
      type = 'desc'
    } else {
      setSortType('asc')
    }

    const filters = []
    if (company) {
      filters.push({
        columnName: 'companyId',
        value: company
      })
    }
    if (associateCompany) {
      filters.push({
        columnName: 'associateCompanyId',
        value: associateCompany
      })
    }
    if (location) {
      filters.push({
        columnName: 'locationId',
        value: location.split('^')[0]
      })
    }
    if (year) {
      filters.push({
        columnName: 'year',
        value: year
      })
    }
    if (month) {
      filters.push({
        columnName: 'month',
        value: month
      })
    }

    const employeesPayload: any = {
      search: searchInput,
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page + 1
      },
      sort: { columnName: 'aadharNumber', order: type },
      "includeCentral": true
    }
    dispatch(getEmployees(employeesPayload))

  }

  const onClickUpload = () => {
    if (!company || !associateCompany || !location || !year || !month) {
      return toast.error(ERROR_MESSAGES.FILL_ALL);
    } else {
      setOpenUploadModal(true)
    }
  }

  const onClickSubmitUpload = () => {
    const formData = new FormData();
    formData.append('file', uploadData[0]);
    formData.append('Remarks', 'NA')
    formData.append('Year', year)
    formData.append('Month', month)
    formData.append('Mapped', 'false')
    formData.append('ConfigurationType', 'Employee')
    formData.append('CompanyId', company)
    formData.append('AssociateCompanyId', associateCompany)
    formData.append('LocationId', location.split('^')[0])
    formData.append('StateId', location.split('^')[1])

    // dispatch(employeeUpload(formData))
  }

  const addButtonDisable = !name || !company || !associateCompany || !location || !year || !month || !day

  const onClickAdd = () => {
    setOpenModal(true)
    setModalType('Add')
    setCompany('')
    setAssociateCompany('')
    setLocation('')
  }

  const onClickSubmitAdd = () => {
    let monthKey: any

    if (month === 'January') {
      monthKey = 1
    } else if (month === 'February') {
      monthKey = 2
    } else if (month === 'March') {
      monthKey = 3
    } else if (month === 'April') {
      monthKey = 4
    } else if (month === 'May') {
      monthKey = 5
    } else if (month === 'June') {
      monthKey = 6
    } else if (month === 'July') {
      monthKey = 7
    } else if (month === 'August') {
      monthKey = 8
    } else if (month === 'September') {
      monthKey = 9
    } else if (month === 'October') {
      monthKey = 10
    } else if (month === 'November') {
      monthKey = 11
    } else if (month === 'December') {
      monthKey = 12
    }
    const payload = {
      name,
      optionalHoliday,
      companyId: company,
      associateCompanyId: associateCompany,
      locationId: location.split('^')[0],
      stateId: location.split('^')[1],
      year,
      month: monthKey,
      day,
      restricted: restrictedHoliday,
      remarks: ''
    }
    dispatch(addHoliday(payload))
  }

  const onclickEdit = (holiday: any) => {
    let monthKey: any
    const monthNumber = holiday.month
    if (monthNumber === 1) {
      monthKey = 'January'
    } else if (monthNumber === 2) {
      monthKey = 'February'
    } else if (monthNumber === 3) {
      monthKey = 'March'
    } else if (monthNumber === 4) {
      monthKey = 'April'
    } else if (monthNumber === 5) {
      monthKey = 'May'
    } else if (monthNumber === 6) {
      monthKey = 'June'
    } else if (monthNumber === 7) {
      monthKey = 'July'
    } else if (monthNumber === 8) {
      monthKey = 'August'
    } else if (monthNumber === 9) {
      monthKey = 'September'
    } else if (monthNumber === 10) {
      monthKey = 'October'
    } else if (monthNumber === 11) {
      monthKey = 'November'
    } else if (monthNumber === 12) {
      monthKey = 'December'
    }
    setOpenModal(true)
    setModalType('Edit')
    setName(holiday.name)
    setCompany(holiday.company.id)
    setAssociateCompany(holiday.associateCompany.id)
    setLocation(holiday.location.id + '^' + holiday.stateId)
    setYear(holiday.year)
    setMonth(monthKey)
    setDay(holiday.day)
    setOptionalHoliday(holiday.optionalHoliday)
    setRestrictedHoliday(holiday.restricted)
    setHoliday(holiday)
  }

  const onClickSubmitEdit = () => {
    let monthKey: any

    if (month === 'January') {
      monthKey = 1
    } else if (month === 'February') {
      monthKey = 2
    } else if (month === 'March') {
      monthKey = 3
    } else if (month === 'April') {
      monthKey = 4
    } else if (month === 'May') {
      monthKey = 5
    } else if (month === 'June') {
      monthKey = 6
    } else if (month === 'July') {
      monthKey = 7
    } else if (month === 'August') {
      monthKey = 8
    } else if (month === 'September') {
      monthKey = 9
    } else if (month === 'October') {
      monthKey = 10
    } else if (month === 'November') {
      monthKey = 11
    } else if (month === 'December') {
      monthKey = 12
    }
    const payload = {
      id: holiday.id,
      name,
      optionalHoliday,
      companyId: company,
      associateCompanyId: associateCompany,
      locationId: location.split('^')[0],
      stateId: location.split('^')[1],
      year,
      month: monthKey,
      day,
      restricted: restrictedHoliday,
      remarks: ''
    }
    dispatch(editHoliday(payload))
  }

  const onclickView = (holiday: any) => {
    setOpenModal(true)
    setModalType('View')
    setHoliday(holiday)
  }

  const onclickDelete = (holiday: any) => {
    setHoliday(holiday)
    setOpenDeleteModal(true)
  }

  const onClickConfirmDelete = () => {
    dispatch(deleteHoliday(holiday.id))
  }

  const handleChangePage = (event: unknown, newPage: number) => {

    const filters = []
    if (company) {
      filters.push({
        columnName: 'companyId',
        value: company
      })
    }
    if (associateCompany) {
      filters.push({
        columnName: 'associateCompanyId',
        value: associateCompany
      })
    }
    if (location) {
      filters.push({
        columnName: 'locationId',
        value: location.split('^')[0]
      })
    }
    if (year) {
      filters.push({
        columnName: 'year',
        value: year
      })
    }
    if (month) {
      filters.push({
        columnName: 'month',
        value: month
      })
    }

    const employeesPayload: any = {
      search: '',
      filters: filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: newPage + 1
      },
      sort: { columnName: 'code', order: 'asc' },
      "includeCentral": true
    }

    dispatch(getEmployees(employeesPayload))
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {

    const filters = []
    if (company) {
      filters.push({
        columnName: 'companyId',
        value: company
      })
    }
    if (associateCompany) {
      filters.push({
        columnName: 'associateCompanyId',
        value: associateCompany
      })
    }
    if (location) {
      filters.push({
        columnName: 'locationId',
        value: location.split('^')[0]
      })
    }
    if (year) {
      filters.push({
        columnName: 'year',
        value: year
      })
    }
    if (month) {
      filters.push({
        columnName: 'month',
        value: month
      })
    }

    const employeesPayload: any = {
      search: '',
      filters: filters,
      pagination: {
        pageSize: parseInt(event.target.value, 10),
        pageNumber: 1
      },
      sort: { columnName: 'code', order: 'asc' },
      "includeCentral": true
    }

    dispatch(getEmployees(employeesPayload))
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const onClickAllCheckBox = () => {
    if (selectedEmployees.length !== employees.length) {
      const allIds = employees && employees.map((each: any) => each.id)
      setSelectedEmployees(allIds)
    } else {
      setSelectedEmployees([])
    }
  }
  const onClickIndividualCheckBox = (id: any) => {
    if (selectedEmployees.includes(id)) {
      const updatedSelectedEmployee: any = selectedEmployees.filter((each: any) => each != id)
      setSelectedEmployees(updatedSelectedEmployee)
    } else {
      setSelectedEmployees([...selectedEmployees, id])
    }
  }
  const onClickBulkDelete = () => {
    setOpenBulkDeleteModal(true)
  }
  const onClickConfirmBulkDelete = () => {
    dispatch(bulkDeleteEmployees(selectedEmployees))
    let type = 'asc'
    setActiveSort('restricted');
    if (sortType === 'asc') {
      setSortType('desc')
      type = 'desc'
    } else {
      setSortType('asc')
    }

    const filters = []
    if (company) {
      filters.push({
        columnName: 'companyId',
        value: company
      })
    }
    if (associateCompany) {
      filters.push({
        columnName: 'associateCompanyId',
        value: associateCompany
      })
    }
    if (location) {
      filters.push({
        columnName: 'locationId',
        value: location.split('^')[0]
      })
    }
    if (year) {
      filters.push({
        columnName: 'year',
        value: year
      })
    }
    if (month) {
      filters.push({
        columnName: 'month',
        value: month
      })
    }
 
    const employeesPayload: any = {
      search: searchInput,
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page + 1
      },
      sort: { columnName: 'code', order: 'asc' },
      "includeCentral": true
    }
    //alert(company);
    dispatch(getEmployees(employeesPayload))
  }

  useEffect(() => {
    if (bulkDeleteEmployeeDetails.status === 'succeeded') {
     
      toast.success(`Employees deleted successfully.`)
      setSelectedEmployees([])
      dispatch(resetBulkDeleteEmployees())
      setOpenBulkDeleteModal(false)

      const filters = []
      if (company) {
        filters.push({
          columnName: 'companyId',
          value: company
        })
      }
      if (associateCompany) {
        filters.push({
          columnName: 'associateCompanyId',
          value: associateCompany
        })
      }
      if (location) {
        filters.push({
          columnName: 'locationId',
          value: location.split('^')[0]
        })
      }
      if (year) {
        filters.push({
          columnName: 'year',
          value: year
        })
      }
      if (month) {
        filters.push({
          columnName: 'month',
          value: month
        })
      }

      const employeesPayload: any = {
        search: searchInput,
        filters,
        pagination: {
          pageSize: rowsPerPage,
          pageNumber: page + 1
        },
        sort: { columnName: 'code', order: 'asc' },
        "includeCentral": true
      }
      //alert(company);

      // const EmployeeDefaultPayload: any = {
      //   search: "",
      //   filters: [],
      //   pagination: {
      //     pageSize: 10,
      //     pageNumber: 1
      //   },
      //   sort: { columnName: 'name', order: 'asc' },
      //   "includeCentral": true
      // }
      dispatch(resetBulkDeleteEmployees())
      dispatch(getEmployees(employeesPayload))
    } else if (bulkDeleteEmployeeDetails.status === 'failed') {
      toast.error(ERROR_MESSAGES.DEFAULT);
    }
  }, [bulkDeleteEmployeeDetails.status])

  const onClickBackToDashboard = () => {
    navigate(`${getBasePath()}/inputUploads/dashboard`);
  }


  const formatDate = (dateString: string | number | Date) => {
    if (!dateString) {
      return ''; // or 'Invalid Date', or any placeholder you prefer
    }
  
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const date = new Date(dateString);
  
    if (isNaN(date.getTime())) {
      return ''; // handle invalid date formats
    }
  
    return date.toLocaleDateString('en-GB', options); // 'en-GB' for DD-MM-YYYY format
  };


  const formatTime = (timeString: string | number | Date) => {
    if (!timeString) {
      return ''; // or any placeholder you prefer, e.g., 'Invalid Time'
    }
  
    const date = new Date(timeString);
  
    if (isNaN(date.getTime())) {
      return ''; // handle invalid date formats
    }
  
    return date.toLocaleTimeString('en-GB'); // 'en-GB' for 24-hour format
  };
  

  return (
    <div style={{ height: '100vh', backgroundColor: '#ffffff' }}>

      <Modal
        open={openBulkDeleteModal}
        onClose={() => setOpenBulkDeleteModal(false)}
      >
        <Box sx={style}>
          <Box sx={{ backgroundColor: '#E2E3F8', padding: '10px', px: '20px', borderRadius: '6px', boxShadow: '0px 6px 10px #CDD2D9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ font: 'normal normal normal 32px/40px Calibri' }}>Delete Employees</Typography>
            <IconButton
              onClick={() => setOpenBulkDeleteModal(false)}
            >
              <IoMdClose />
            </IconButton>
          </Box>
          <Box sx={{ padding: '20px', backgroundColor: '#ffffff' }}>
            <Box>
              <Typography variant='h5'>There are {selectedEmployees.length} record(s) selected for deleting.</Typography>
              <Typography mt={2}>Are you sure you want to delete all of them ?</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
              <Button variant='outlined' color="error" onClick={() => setOpenBulkDeleteModal(false)}>No</Button>
              <Button variant='contained' onClick={onClickConfirmBulkDelete}>Yes</Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      {loading ? <PageLoader>Loading...</PageLoader> :

        <div>
          <Box sx={{ paddingX: '20px', paddingY: '10px', }}>
            <div style={{ backgroundColor: '#E2E3F8', padding: '20px', borderRadius: '6px', boxShadow: '0px 6px 10px #CDD2D9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', marginTop: '10px' }}>
                <h5 style={{ font: 'normal normal normal 32px/40px Calibri' }}>Employee Master</h5>
                <div style={{ marginRight: '12px', display: 'flex', alignItems: 'center', width: '400px', justifyContent: 'space-between' }}>
                  <Button onClick={onClickBackToDashboard} variant='contained'> Back To Dashboard</Button>

                  {
                    hasUserAccess(USER_PRIVILEGES.DELETE_EMPLOYEE_MASTER) &&
                  <Button onClick={onClickBulkDelete} variant='contained' color='error' disabled={selectedEmployees && selectedEmployees.length === 0}> Bulk Delete</Button>
                  }
e                  <button onClick={onClickExport} disabled={!employees} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: !employees ? '#707070' : '#ffffff', color: !employees ? '#ffffff' : '#000000', border: '1px solid #000000', width: '40px', height: '30px', borderRadius: '8px' }}> <FaDownload /> </button>
                </div>

              </div>
              <div style={{ display: 'flex' }}>

                <Box sx={{ mr: 1 }}>
                  <Typography mb={1}>Company</Typography>
                  <FormControl sx={{ width: '100%', maxWidth: '200px', backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                    <Select
                      sx={{ '.MuiOutlinedInput-notchedOutline': { border: 0 } }}
                      value={company}
                      displayEmpty
                      onChange={handleChangeCompany}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            maxHeight: 200,
                            width: 230,
                            // marginLeft: "21px", 
                            marginTop: "3px"
                          }
                        }
                      }}
                    >
                      <MenuItem disabled sx={{ display: 'none' }} value="">
                        Select Company
                      </MenuItem>
                      {companies && companies.map((each: any) => {
                        return <MenuItem sx={{ width: '240px', whiteSpace: 'initial' }} value={each.id}>{each.name}</MenuItem>
                      })}
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ mr: 1 }}>
                  <Typography mb={1}>Associate Company</Typography>
                  <FormControl sx={{ width: '100%', maxWidth: '200px', backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                    <Select
                      sx={{ '.MuiOutlinedInput-notchedOutline': { border: 0 } }}
                      displayEmpty
                      value={associateCompany}
                      disabled={!company}
                      onChange={handleChangeAssociateCompany}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            maxHeight: 215,
                            width: 230,
                            marginTop: '3px'
                          },
                        },
                      }}

                    >
                      <MenuItem disabled sx={{ display: 'none' }} value="">
                        Select Associate Company
                      </MenuItem>
                      {associateCompanies && associateCompanies.map((each: any) => {
                        return <MenuItem sx={{ width: '240px', whiteSpace: 'initial' }} value={each.id}>{each.name}</MenuItem>
                      })}
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ mr: 1 }}>
                  <Typography mb={1}>Location</Typography>
                  <FormControl sx={{ width: '100%', maxWidth: '200px', backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                    <Select
                      sx={{ '.MuiOutlinedInput-notchedOutline': { border: 0 } }}
                      displayEmpty
                      value={location}
                      disabled={!associateCompany}
                      onChange={handleChangeLocation}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            maxHeight: 200,
                            width: 230,
                            marginLeft: "27px",
                            marginTop: "3px"
                          }
                        }
                      }}
                    >
                      <MenuItem disabled sx={{ display: 'none' }} value="">
                        Select Location
                      </MenuItem>
                      {locations && locations.map((each: any) => {
                        const { id, name, code, cities }: any = each.location || {};
                        const { state } = cities || {};
                        return <MenuItem sx={{ whiteSpace: "initial" }} value={each.locationId + '^' + state.id}>{`${name} (${state.code}-${cities.code}-${code})`}</MenuItem>
                      })}
                    </Select>
                  </FormControl>
                </Box>

                {/* <Box sx={{width:'100%', mr:1}}>
                        <Typography mb={1}>Year</Typography>
                        <FormControl sx={{ width:'100%', backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                          <Select
                            sx={{'.MuiOutlinedInput-notchedOutline': { border: 0 }}}
                            displayEmpty
                            value={year}
                            disabled={!location}
                            onChange={handleChangeYear}
                            MenuProps={{
                              PaperProps: {
                                sx: {
                                  maxHeight: 200,
                                  width: 100,
                                  // marginLeft: "21px", 
                                  marginTop: "3px"
                                }
                              }
                            }}
                          >
                            <MenuItem disabled sx={{display:'none'}} value="">
                              Select Year
                            </MenuItem>
                            {yearsList && yearsList.map((each:any) => 
                              <MenuItem value={each}>{each}</MenuItem>
                            )}
                          </Select>
                        </FormControl>
                      </Box> */}
                {/* 
                      <Box sx={{width:'100%', mr:1}}>
                        <Typography mb={1}>Month</Typography>
                        <FormControl sx={{ width:'100%', backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                          <Select
                            sx={{'.MuiOutlinedInput-notchedOutline': { border: 0 }}}
                            displayEmpty
                            value={month}
                            disabled={!year}
                            onChange={handleChangeMonth}
                            MenuProps={{
                              PaperProps: {
                                sx: {
                                  maxHeight: 200,
                                  width: 100,
                                  // marginLeft: "21px", 
                                  marginTop: "3px"
                                }
                              }
                            }}
                          >
                            <MenuItem disabled sx={{display:'none'}} value="">
                              Select Month
                            </MenuItem>
                            {monthList && monthList.map((each:any) => 
                              <MenuItem value={each}>{each}</MenuItem>
                            )}
                          </Select>
                        </FormControl>
                      </Box> */}

                <Box sx={{ width: '100%', mr: 1 }}>
                  <Typography mb={1}>Search (Emp Name)</Typography>
                  <FormControl sx={{ width: '100%', backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                    <InputLabel htmlFor="outlined-adornment-search">Search</InputLabel>
                    <OutlinedInput
                      value={searchInput}
                      onChange={handleChangeSearchInput}
                      sx={{ '.MuiOutlinedInput-notchedOutline': { border: 0 } }}
                      id="outlined-adornment-search"
                      type='text'

                      endAdornment={
                        <InputAdornment position="end">
                          {searchInput &&
                            <IconButton
                              onClick={onClickClearSearch}
                              edge="end"
                            >
                              <IoMdClose />
                            </IconButton>
                          }
                          <IconButton
                            onClick={onClickSearch}
                            edge="end"
                          >
                            <IoMdSearch />
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Search"
                    />
                  </FormControl>
                </Box>

              </div>
            </div>
          </Box>

          <Box sx={{ paddingX: '20px',  height:'40px' }}>
            {
              employees && employees.length <= 0 ?

                <Box sx={{ height: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Typography variant='h5'>No Records Found</Typography>
                </Box>
                :
                <>
                  <TableContainer sx={{ border: '1px solid #e6e6e6', marginTop: '10px', maxHeight: '570px', overflowY: 'scroll' }}>
                    <Table stickyHeader sx={{ minWidth: 650 }} aria-label="sticky table">
                      <TableHead sx={{ '.MuiTableCell-root': { backgroundColor: '#E7EEF7',maxHeight: '10px' } }}>
                        <TableRow>
                          <TableCell><Checkbox checked={(selectedEmployees && selectedEmployees.length) === (employees && employees.length)} onClick={onClickAllCheckBox} /></TableCell>
                          <TableCell > <TableSortLabel active={activeSort === 'code'} direction={sortType} onClick={onClickSortCode}>Employee Code</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel active={activeSort === 'name'} direction={sortType} onClick={onClickSortName}> Name</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel active={activeSort === 'dateOfBirth'} direction={sortType} onClick={onClickSortDOB}>DOB</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel active={activeSort === 'gender'} direction={sortType} onClick={onClickSortGender}>Gender</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel active={activeSort === 'designation'} direction={sortType} onClick={onClickSortDesignation}>Designation</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel active={activeSort === 'gender'} direction={sortType} onClick={onClickSortGender}>Department</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel active={activeSort === 'dateOfJoining'} direction={sortType} onClick={onClickSortDOJ}>DOJ</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel active={activeSort === 'panNumber'} direction={sortType} onClick={onClickSortPan}>PAN no.</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel active={activeSort === 'aadharNumber'} direction={sortType} onClick={onClickSortAdhar}>Aadhar no.</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel active={activeSort === 'aadharNumber'} direction={sortType} onClick={onClickSortAdhar}>Date of Leave</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel active={activeSort === 'aadharNumber'} direction={sortType} onClick={onClickSortAdhar}>Reason of Exit</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel active={activeSort === 'aadharNumber'} direction={sortType} onClick={onClickSortAdhar}>Age</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel active={activeSort === 'aadharNumber'} direction={sortType} onClick={onClickSortAdhar}>FatherName</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel active={activeSort === 'aadharNumber'} direction={sortType} onClick={onClickSortAdhar}>Bank Account no.</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel active={activeSort === 'aadharNumber'} direction={sortType} onClick={onClickSortAdhar}>BankName</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel active={activeSort === 'aadharNumber'} direction={sortType} onClick={onClickSortAdhar}>PF UAN no.</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel active={activeSort === 'aadharNumber'} direction={sortType} onClick={onClickSortAdhar}>ESI no.</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel active={activeSort === 'aadharNumber'} direction={sortType} onClick={onClickSortAdhar}>Office In TIME</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel active={activeSort === 'aadharNumber'} direction={sortType} onClick={onClickSortAdhar}>Office Out Time</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel active={activeSort === 'aadharNumber'} direction={sortType} onClick={onClickSortAdhar}>Interval In Time</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel active={activeSort === 'aadharNumber'} direction={sortType} onClick={onClickSortAdhar}> Interval Out Time</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel active={activeSort === 'aadharNumber'} direction={sortType} onClick={onClickSortAdhar}>Date Of Payment</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel active={activeSort === 'aadharNumber'} direction={sortType} onClick={onClickSortAdhar}>Esi Date Of Payment</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel active={activeSort === 'aadharNumber'} direction={sortType} onClick={onClickSortAdhar}>Esi Date of Notice</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel active={activeSort === 'aadharNumber'} direction={sortType} onClick={onClickSortAdhar}>ESi Time of Notice</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel active={activeSort === 'aadharNumber'} direction={sortType} onClick={onClickSortAdhar}>Esi Cause</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel active={activeSort === 'aadharNumber'} direction={sortType} onClick={onClickSortAdhar}>Esi Nature</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel active={activeSort === 'aadharNumber'} direction={sortType} onClick={onClickSortAdhar}>Esi Date</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel active={activeSort === 'aadharNumber'} direction={sortType} onClick={onClickSortAdhar}>Esi Time</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel active={activeSort === 'aadharNumber'} direction={sortType} onClick={onClickSortAdhar}>Esi Place</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel active={activeSort === 'aadharNumber'} direction={sortType} onClick={onClickSortAdhar}>Vendor Nature Of Work</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel active={activeSort === 'aadharNumber'} direction={sortType} onClick={onClickSortAdhar}>Branch</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel active={activeSort === 'aadharNumber'} direction={sortType} onClick={onClickSortAdhar}>Establishment Type</TableSortLabel></TableCell>
                          {/* <TableCell > Actions</TableCell> */}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {employees && employees.map((each: any, index: number) => (
                          <TableRow
                            key={each._id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell><Checkbox checked={selectedEmployees.includes(each.id)} onClick={() => onClickIndividualCheckBox(each.id)} /></TableCell>
                            <TableCell >{each.code}</TableCell>
                            <TableCell >{each.name}</TableCell>
                            <TableCell >{formatDate(each.dateOfBirth)}</TableCell>
                            <TableCell >{each.gender}</TableCell>
                            <TableCell >{each.designation}</TableCell>
                            <TableCell >{each.department}</TableCell>
                            {/* <TableCell >{new Date(each.dateOfJoining).toLocaleDateString()}</TableCell> */}
                            <TableCell >{formatDate(each.dateOfJoining)}</TableCell>
                            <TableCell >{each.panNumber}</TableCell>
                            <TableCell >{each.aadharNumber}</TableCell>
                            <TableCell >{formatDate(each.dateOfLeave)}</TableCell>
                            <TableCell >{each.reasonOfExit}</TableCell>
                            <TableCell >{each.age}</TableCell>
                            <TableCell >{each.fatherName}</TableCell>
                            <TableCell >{each.bankAccountNumber}</TableCell>
                            <TableCell >{each.bankName}</TableCell>
                            <TableCell >{each.pfuanNumber}</TableCell>
                            <TableCell >{each.esiNumber}</TableCell>
                            <TableCell >{new Date(each.officeInTime).toLocaleTimeString()}</TableCell>
                            {/* <TableCell >{formatTime(each.officeInTime)}</TableCell> */}
                            <TableCell >{new Date(each.officeOutTime).toLocaleTimeString()}</TableCell>
                            <TableCell >{new Date(each.intervalInTime).toLocaleTimeString()}</TableCell>
                            <TableCell >{new Date(each.intervalOutTime).toLocaleTimeString()}</TableCell>
                            <TableCell >{formatDate(each.dateOfPayment)}</TableCell>
                            <TableCell >{formatDate(each.esiDateOfPayment)}</TableCell>
                            <TableCell >{formatDate(each.esiDateOfNotice)}</TableCell>
                            <TableCell >{formatTime(each.esiTimeOfNotice)}</TableCell>
                            <TableCell >{each.esiCause}</TableCell>
                            <TableCell >{each.esiNature}</TableCell>
                            <TableCell >{formatDate(each.esiDate)}</TableCell>
                            
                            <TableCell >{formatTime(each.esiTime)}</TableCell>
                            <TableCell >{each.esiPlace}</TableCell>
                            <TableCell >{each.vendorNatureOfWork}</TableCell>
                            <TableCell >{each.branch}</TableCell>
                            <TableCell >{each.establishmentType}</TableCell>
                        
                            {/* <TableCell >
                                        <Box sx={{display:'flex', justifyContent:'space-between', width:'100px'}}>
                                          <Icon action={() => onclickEdit(each)} style={{color:'#039BE5'}} type="button" name={'pencil'} text={'Edit'}/>
                                          <Icon action={() => onclickDelete(each)} style={{color:'#EB1010'}} type="button" name={'trash'} text={'Delete'}/>
                                          <Icon action={() => onclickView(each)}  style={{color:'#00C853'}} type="button" name={'eye'} text={'View'}/>
                                        </Box>
                                      </TableCell> */}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    sx={{
                      '.MuiTablePagination-toolbar': {
                        backgroundColor: '#EFEBFE',
                        height: '30px',
                        display: 'flex',
                        justifyContent: 'flex-end'
                      },
                      '.MuiTablePagination-displayedRows': {
                        margin: '0',
                      },
                      '.MuiTablePagination-selectLabel': {
                        margin: '0',
                      },
                      '.MuiTablePagination-spacer': {
                        display: 'none '
                      },
                      '.MuiTablePagination-input': {
                        marginRight: 'auto'
                      },
                    }}

                    labelRowsPerPage='Show'
                    labelDisplayedRows={(page) =>
                      `Showing ${page.from}-${page.to === -1 ? page.count : page.to} of ${page.count}`
                    }
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    component="div"
                    count={employeesCount}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </>
            }
          </Box>
        </div>
      }
    </div>
  )
}

export default EmployeeMasterUpload