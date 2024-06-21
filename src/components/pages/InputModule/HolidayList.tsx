import React, { useEffect } from 'react'
import PageLoader from '../../shared/PageLoader'
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import { getAllCompaniesDetails, getAssociateCompanies, getLocations, getStates } from '../../../redux/features/inputModule.slice';
import { Box, Button, Checkbox, Drawer, FormControl, FormControlLabel, FormLabel, IconButton, InputAdornment, InputLabel, MenuItem, Modal, OutlinedInput, Radio, RadioGroup, Select, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, TextField, Typography } from '@mui/material';
import { FaUpload, FaDownload } from "react-icons/fa";
import { IoMdAdd, IoMdClose, IoMdSearch } from "react-icons/io";
import { DEFAULT_OPTIONS_PAYLOAD, DEFAULT_PAYLOAD } from '../../common/Table';
import { addHoliday, bulkDeleteHolidays, deleteHoliday, editHoliday, getHolidaysList, resetAddHolidayDetails, resetBulkDeleteHolidaysDetails, resetDeleteHolidayDetails, resetEditHolidayDetails, resetGetHolidayDetailsStatus, resetUploadHolidayDetails, uploadHoliday } from '../../../redux/features/holidayList.slice';
import Icon from '../../common/Icon';
import { useExportHolidayList } from '../../../backend/exports';
import { download, downloadFileContent, preventDefault } from '../../../utils/common';
import { ERROR_MESSAGES } from '../../../utils/constants';
import { toast } from 'react-toastify';
import { Alert } from 'react-bootstrap';


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

//new code 26may

const HolidayList = () => {

  const dispatch = useAppDispatch();

  const holidayListDetails = useAppSelector((state) => state.holidayList.holidayListDetails)
  const deleteHolidayDetails = useAppSelector((state) => state.holidayList.deleteHolidayDetails)
  const addHolidayDetails = useAppSelector((state) => state.holidayList.addHolidayDetails)
  const uploadHolidayDetails = useAppSelector((state) => state.holidayList.uploadHolidayDetails)
  const editHolidayDetails = useAppSelector((state) => state.holidayList.editHolidayDetails)
  const bulkDeleteHolidaysDetails = useAppSelector((state) => state.holidayList.bulkDeleteHolidaysDetails)

  const companiesDetails = useAppSelector((state) => state.inputModule.companiesDetails);
  const associateCompaniesDetails = useAppSelector((state) => state.inputModule.associateCompaniesDetails);
  const locationsDetails = useAppSelector((state) => state.inputModule.locationsDetails);
  const statesDetails = useAppSelector((state) => state.inputModule.statesDetails);



  const holidays = holidayListDetails && holidayListDetails.data.list
  const holidaysCount = holidayListDetails && holidayListDetails.data.count
  const companies = companiesDetails && companiesDetails.data.list
  const associateCompanies = associateCompaniesDetails && associateCompaniesDetails.data.list
  const locations = locationsDetails && locationsDetails.data.list
  let states = locations && locations.map((each: any) => {
    const { id, name, code, cities }: any = each.location || {};
    const { state } = cities || {};
    return { name: state.name, id: state.id }
  })

  states = states && states.filter((each: any, index: any, self: any) => {
    if (index === self.findIndex((t: any) => t.id === each.id)) {
      return each
    }
  })

  const [company, setCompany] = React.useState('');
  const [associateCompany, setAssociateCompany] = React.useState('');
  const [stateName, setStateName] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [year, setYear] = React.useState('');
  const [month, setMonth] = React.useState<any>('');
  const [day, setDay] = React.useState('');
  const [name, setName] = React.useState('')

  const [searchInput, setSearchInput] = React.useState('');
  const [activeSort, setActiveSort] = React.useState('name')
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

  const [selectedHolidays, setSelectedHolidays] = React.useState<any>([]);
  const [openBulkDeleteModal, setOpenBulkDeleteModal] = React.useState(false);

  const { exportHolidayList, exporting } = useExportHolidayList((response: any) => {
    const companyDetails = companies.find((each: any) => each.id === company)
    const assCompNameDetails = associateCompanies.find((each: any) => each.id === associateCompany)
    //const locationdetails = locations.find((each:any) => each.id === location).toString()
    const stateNameDetailsextracting = states.find((each: any) => each.id === stateName)
    // Extract the name from the found state object
    const stateNameDetails = stateNameDetailsextracting ? stateNameDetailsextracting.name : null;
    //const locationdetails = location.toString()
    const locationdetailsextracting = locations.find((each: any) => each.location && each.location.id === location);
    const locationdetails = locationdetailsextracting ? locationdetailsextracting.location.name : null;
    const yeardetails = year.toString()
    const momnthdetails = month

    interface CompanyDetails {
      name?: string;
    }

    interface AssCompNameDetails {
      name?: string;
    }

    function constructFileName(
      companyDetails: CompanyDetails,
      assCompNameDetails: AssCompNameDetails,
      stateNameDetails: string,
      locationdetails: string,
      monthdetails: string,
      yeardetails: string
    ): string {
      const parts = [
        'HolidayList',
        companyDetails && companyDetails.name ? companyDetails.name : null,
        assCompNameDetails && assCompNameDetails.name ? assCompNameDetails.name : null,
        stateNameDetails,
        locationdetails,
        monthdetails,
        yeardetails,
        'HolidayList.xlsx'
      ];

      const validParts = parts.filter(part => part != null && part !== '');

      return validParts.join(' - ');
    }

    const fileName = constructFileName(companyDetails, assCompNameDetails, stateNameDetails, locationdetails, momnthdetails, yeardetails);

    downloadFileContent({
      //name: `HolidayList - ${companyDetails.name} - ${assCompNameDetails.name} - ${locationdetails}  - ${momnthdetails} - ${yeardetails} - HolidayList.xlsx`,
      name: fileName,
      type: response.headers['content-type'],
      content: response.data
    });
  }, () => {
    toast.error(ERROR_MESSAGES.DEFAULT);
  });

  const loading = exporting || bulkDeleteHolidaysDetails.status === 'loading' || editHolidayDetails.status === 'loading' || uploadHolidayDetails.status === 'loading' || addHolidayDetails.status === 'loading' || deleteHolidayDetails.status === 'loading' || holidayListDetails.status === 'loading' || companiesDetails.status === 'loading' || associateCompaniesDetails.status === 'loading' || locationsDetails.status === 'loading' || statesDetails.status === 'loading'

  const handleChangeCompany = (event: any) => {
    setAssociateCompany('')
    setStateName('')
    setLocation('')
    setYear('')
    setMonth('')
    setCompany(event.target.value);
    const HolidayListPayload: any = {
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
      sort: { columnName: 'name', order: 'asc' },
      "includeCentral": true
    }
    dispatch(getHolidaysList(HolidayListPayload))
  };

  const handleChangeAssociateCompany = (event: any) => {
    setStateName('')
    setLocation('')
    setYear('')
    setMonth('')
    setAssociateCompany(event.target.value);
    const HolidayListPayload: any = {
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
      sort: { columnName: 'name', order: 'asc' },
      "includeCentral": true
    }
    dispatch(getHolidaysList(HolidayListPayload))
  };

  const handleChangeStateName = (event: any) => {
    setYear('')
    setMonth('')
    setLocation('')
    setStateName(event.target.value);
    const HolidayListPayload: any = {
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
          columnName: 'stateId',
          value: event.target.value
        }
      ],
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page + 1
      },
      sort: { columnName: 'name', order: 'asc' },
      "includeCentral": true
    }
    dispatch(getHolidaysList(HolidayListPayload))
  }

  const handleChangeLocation = (event: any) => {
    setYear('')
    setMonth('')
    setLocation(event.target.value);
    const HolidayListPayload: any = {
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
          columnName: 'stateId',
          value: stateName
        },
        {
          columnName: 'locationId',
          value: event.target.value
        }
      ],
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page + 1
      },
      sort: { columnName: 'name', order: 'asc' },
      "includeCentral": true
    }
    dispatch(getHolidaysList(HolidayListPayload))
  };

  const handleChangeYear = (event: any) => {
    setMonth('')
    setYear(event.target.value.toString());
    const HolidayListPayload: any = {
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
          columnName: 'stateId',
          value: stateName
        },
        {
          columnName: 'locationId',
          value: location
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
      sort: { columnName: 'name', order: 'asc' },
      "includeCentral": true
    }
    dispatch(getHolidaysList(HolidayListPayload))
  };

  const handleChangeMonth = (event: any) => {
    const monthKey = (monthList.findIndex((each) => each === event.target.value) + 1).toString()
    setMonth(event.target.value);

    const HolidayListPayload: any = {
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
          columnName: 'stateId',
          value: stateName
        },
        {
          columnName: 'locationId',
          value: location
        },
        {
          columnName: 'year',
          value: year
        },
        {
          columnName: 'month',
          value: monthKey
        }
      ],
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page + 1
      },
      sort: { columnName: 'name', order: 'asc' },
      "includeCentral": true
    }
    dispatch(getHolidaysList(HolidayListPayload))
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

    const companiesPayload: any = { ...DEFAULT_OPTIONS_PAYLOAD, filters: [{ columnName: 'isParent', value: 'true' }] }
    dispatch(getHolidaysList(HolidayListDefaultPayload))
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
    const statesPayload = { ...DEFAULT_OPTIONS_PAYLOAD }

    if (associateCompany) {
      dispatch(getLocations(payload))
      dispatch(getStates(statesPayload))
    }
  }, [associateCompany])

  useEffect(() => {
    if (holidayListDetails.status === 'succeeded') {

    } else if (holidayListDetails.status === 'failed') {
      toast.error(ERROR_MESSAGES.DEFAULT);
      resetGetHolidayDetailsStatus()
    }
  }, [holidayListDetails.status])



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
      if (addHolidayDetails.data.key === 'FAILURE') {
        toast.error(`Holiday Already Exist.`)
      } else {
        toast.success(`Holiday Added successfully.`)
        dispatch(resetAddHolidayDetails())
        setOpenModal(false); setModalType(''); setHoliday({}); setCompany(''); setAssociateCompany(''); setStateName(''); setLocation(''); setYear(''); setMonth(''); setDay(''); setName(''); setRestrictedHoliday(true); setOptionalHoliday(true);
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
      }
    } else if (addHolidayDetails.status === 'failed') {
      setOpenModal(false); setModalType(''); setHoliday({}); setCompany(''); setAssociateCompany(''); setStateName(''); setLocation(''); setYear(''); setMonth(''); setDay(''); setName(''); setRestrictedHoliday(true); setOptionalHoliday(true);
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
        setUploadData({})
      }
    } else if (uploadHolidayDetails.status === 'failed') {
      toast.error(ERROR_MESSAGES.DEFAULT);
    }
  }, [uploadHolidayDetails.status])

  useEffect(() => {
    if (editHolidayDetails.status === 'succeeded') {
      toast.success(`Holiday Updated successfully.`)
      dispatch(resetEditHolidayDetails())
      setOpenModal(false); setModalType(''); setHoliday({}); setCompany(''); setAssociateCompany(''); setStateName(''); setLocation(''); setYear(''); setMonth(''); setDay(''); setName(''); setRestrictedHoliday(true); setOptionalHoliday(true);
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
      setOpenModal(false); setModalType(''); setHoliday({}); setCompany(''); setAssociateCompany(''); setStateName(''); setLocation(''); setYear(''); setMonth(''); setDay(''); setName(''); setRestrictedHoliday(true); setOptionalHoliday(true);
      toast.error(ERROR_MESSAGES.DEFAULT);
    }
  }, [editHolidayDetails.status])

  useEffect(() => {
    if (bulkDeleteHolidaysDetails.status === 'succeeded') {
      toast.success(`Holidays deleted successfully.`)
      setSelectedHolidays([])
      dispatch(resetBulkDeleteHolidaysDetails())
      setOpenBulkDeleteModal(false)
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
    } else if (bulkDeleteHolidaysDetails.status === 'failed') {
      toast.error(ERROR_MESSAGES.DEFAULT);
    }
  }, [bulkDeleteHolidaysDetails.status])

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

  const [originalDayList, setOriginalDayList] = React.useState(daysList);

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
    if (stateName) {
      filters.push({
        columnName: 'stateId',
        value: stateName
      })
    }
    if (location) {
      filters.push({
        columnName: 'locationId',
        value: location
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
        value: (monthList.findIndex((each) => each === month) + 1).toString()
      })
    }

    const HolidayListPayload: any = {
      search: searchInput,
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page + 1
      },
      sort: { columnName: activeSort, order: sortType },
      "includeCentral": true
    }
    exportHolidayList({ ...HolidayListPayload, pagination: null });
  }

  const onClickSearch = () => {
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
    if (stateName) {
      filters.push({
        columnName: 'stateId',
        value: stateName
      })
    }
    if (location) {
      filters.push({
        columnName: 'locationId',
        value: location
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
        value: (monthList.findIndex((each) => each === month) + 1).toString()
      })
    }

    const HolidayListPayload: any = {
      search: searchInput,
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page + 1
      },
      sort: { columnName: 'name', order: 'asc' },
      "includeCentral": true
    }
    dispatch(getHolidaysList(HolidayListPayload))
  }

  const onClickClearSearch = () => {

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
    if (stateName) {
      filters.push({
        columnName: 'stateId',
        value: stateName
      })
    }
    if (location) {
      filters.push({
        columnName: 'locationId',
        value: location
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
        value: (monthList.findIndex((each) => each === month) + 1).toString()
      })
    }

    const HolidayListPayload: any = {
      search: '',
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page + 1
      },
      sort: { columnName: 'name', order: 'asc' },
      "includeCentral": true
    }
    dispatch(getHolidaysList(HolidayListPayload))
    setSearchInput('')
  }

  const onClickSortYear = () => {
    let type = 'asc'
    setActiveSort('year');
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
    if (stateName) {
      filters.push({
        columnName: 'stateId',
        value: stateName
      })
    }
    if (location) {
      filters.push({
        columnName: 'locationId',
        value: location
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
        columnName: 'companyId',
        value: (monthList.findIndex((each) => each === month) + 1).toString()
      })
    }

    const HolidayListPayload: any = {
      search: searchInput,
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page + 1
      },
      sort: { columnName: 'year', order: type },
      "includeCentral": true
    }
    dispatch(getHolidaysList(HolidayListPayload))

  }

  const onClickSortDate = () => {
    let type = 'asc'
    setActiveSort('day');
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
    if (stateName) {
      filters.push({
        columnName: 'stateId',
        value: stateName
      })
    }
    if (location) {
      filters.push({
        columnName: 'locationId',
        value: location
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
        value: (monthList.findIndex((each) => each === month) + 1).toString()
      })
    }

    const HolidayListPayload: any = {
      search: searchInput,
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page + 1
      },
      sort: { columnName: 'day', order: type },
      "includeCentral": true
    }
    dispatch(getHolidaysList(HolidayListPayload))
  }

  const onClickSortCompanyName = () => {
    let type = 'asc'
    setActiveSort('company');
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
    if (stateName) {
      filters.push({
        columnName: 'stateId',
        value: stateName
      })
    }
    if (location) {
      filters.push({
        columnName: 'locationId',
        value: location
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
        value: (monthList.findIndex((each) => each === month) + 1).toString()
      })
    }

    const HolidayListPayload: any = {
      search: searchInput,
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page + 1
      },
      sort: { columnName: 'company.name', order: type },
      "includeCentral": true
    }
    dispatch(getHolidaysList(HolidayListPayload))

  }

  const onClickSortassociateCompanyName = () => {
    let type = 'asc'
    setActiveSort('associatecompany');
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
    if (stateName) {
      filters.push({
        columnName: 'stateId',
        value: stateName
      })
    }
    if (location) {
      filters.push({
        columnName: 'locationId',
        value: location
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
        value: (monthList.findIndex((each) => each === month) + 1).toString()
      })
    }

    const HolidayListPayload: any = {
      search: searchInput,
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page + 1
      },
      sort: { columnName: 'associatecompany.name', order: type },
      "includeCentral": true
    }
    dispatch(getHolidaysList(HolidayListPayload))

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
    if (stateName) {
      filters.push({
        columnName: 'stateId',
        value: stateName
      })
    }
    if (location) {
      filters.push({
        columnName: 'locationId',
        value: location
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
        value: (monthList.findIndex((each) => each === month) + 1).toString()
      })
    }

    const HolidayListPayload: any = {
      search: searchInput,
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page + 1
      },
      sort: { columnName: 'name', order: type },
      "includeCentral": true
    }
    dispatch(getHolidaysList(HolidayListPayload))

  }

  const onClickSortState = () => {
    let type = 'asc'
    setActiveSort('stateId');
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
    if (stateName) {
      filters.push({
        columnName: 'stateId',
        value: stateName
      })
    }
    if (location) {
      filters.push({
        columnName: 'locationId',
        value: location
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
        value: (monthList.findIndex((each) => each === month) + 1).toString()
      })
    }

    const HolidayListPayload: any = {
      search: searchInput,
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page + 1
      },
      sort: { columnName: 'stateId', order: type },
      "includeCentral": true
    }
    dispatch(getHolidaysList(HolidayListPayload))

  }

  const onClickSortRestricted = () => {
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
    if (stateName) {
      filters.push({
        columnName: 'stateId',
        value: stateName
      })
    }
    if (location) {
      filters.push({
        columnName: 'locationId',
        value: location
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
        value: (monthList.findIndex((each) => each === month) + 1).toString()
      })
    }

    const HolidayListPayload: any = {
      search: searchInput,
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page + 1
      },
      sort: { columnName: 'restricted', order: type },
      "includeCentral": true
    }
    dispatch(getHolidaysList(HolidayListPayload))

  }

  const onClickUpload = () => {
    setOpenUploadModal(true)
  }

  const onClickSubmitUpload = () => {
    const formData = new FormData();
    formData.append('file', uploadData[0]);
    dispatch(uploadHoliday(formData))
  }

  const addButtonDisable = !name || !company || !associateCompany || !location || !year || !month || !day

  const onClickAdd = () => {
    setOpenModal(true)
    setModalType('Add')
    setCompany('')
    setAssociateCompany('')
    setStateName('')
    setLocation('')

  }

  const onClickCancelAdd = () => {
    setOpenModal(false);
    setModalType('');
    setHoliday({});
    setCompany('');
    setAssociateCompany('');
    setStateName('');
    setLocation('');
    setYear('');
    setMonth('');
    setDay('');
    setName('');
    setRestrictedHoliday(true);
    setOptionalHoliday(true);

    let type = 'asc'
    setActiveSort('restricted');
    if (sortType === 'asc') {
      setSortType('desc')
      type = 'desc'
    } else {
      setSortType('asc')
    }


    const HolidayListPayload: any = {
      search: searchInput,
      filters: [],
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page + 1
      },
      sort: { columnName: 'stateId', order: type },
      "includeCentral": true
    }
    dispatch(getHolidaysList(HolidayListPayload))
  }

  const onClickSubmitAdd = () => {

    if (addButtonDisable) {
      return toast.error(ERROR_MESSAGES.FILL_ALL);
    }

    const payload = {
      name,
      optionalHoliday,
      companyId: company,
      associateCompanyId: associateCompany,
      locationId: location,
      stateId: stateName,
      year,
      month: (monthList.findIndex((each) => each === month) + 1).toString(),
      day,
      restricted: restrictedHoliday,
      remarks: ''
    }
    dispatch(addHoliday(payload))
  }

  const onclickEdit = (holiday: any) => {
    const monthNumber = holiday.month

    setOpenModal(true)
    setModalType('Edit')
    setName(holiday.name)
    setCompany(holiday.company.id)
    setAssociateCompany(holiday.associateCompany.id)
    setLocation(holiday.location.id)
    setStateName(holiday.stateId)
    setYear(holiday.year)
    setMonth((monthList.find((each, i) => i === (monthNumber - 1))))
    setDay(holiday.day)
    setOptionalHoliday(holiday.optionalHoliday)
    setRestrictedHoliday(holiday.restricted)
    setHoliday(holiday)
  }

  const onClickSubmitEdit = () => {

    if (addButtonDisable) {
      return toast.error(ERROR_MESSAGES.FILL_ALL);
    }

    const payload = {
      id: holiday.id,
      name,
      optionalHoliday,
      companyId: company,
      associateCompanyId: associateCompany,
      locationId: location,
      stateId: stateName,
      year,
      month: (monthList.findIndex((each) => each === month) + 1).toString(),
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
    let type = 'asc'
    setActiveSort('restricted');
    if (sortType === 'asc') {
      setSortType('desc')
      type = 'desc'
    } else {
      setSortType('asc')
    }
    setCompany('')
    setAssociateCompany('')
    setStateName('')
    setLocation('')
    setYear('')
    setMonth('')


    const HolidayListPayload: any = {
      search: searchInput,
      filters: [],
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page + 1
      },
      sort: { columnName: 'stateId', order: type },
      "includeCentral": true
    }
    dispatch(getHolidaysList(HolidayListPayload))


  }

  const onClickIndividualCheckBox = (id: any) => {
    if (selectedHolidays.includes(id)) {
      const updatedSelectedHolidays: any = selectedHolidays.filter((each: any) => each != id)
      setSelectedHolidays(updatedSelectedHolidays)
    } else {
      setSelectedHolidays([...selectedHolidays, id])
    }
  }

  const onClickAllCheckBox = () => {
    if (selectedHolidays.length !== holidays.length) {
      const allIds = holidays && holidays.map((each: any) => each.id)
      setSelectedHolidays(allIds)
    } else {
      setSelectedHolidays([])
    }
  }

  const onClickBulkDelete = () => {
    setOpenBulkDeleteModal(true)
  }

  const onClickConfirmBulkDelete = () => {
    dispatch(bulkDeleteHolidays(selectedHolidays))
    let type = 'asc'
    setActiveSort('restricted');
    if (sortType === 'asc') {
      setSortType('desc')
      type = 'desc'
    } else {
      setSortType('asc')
    }
    setCompany('')
    setAssociateCompany('')
    setStateName('')
    setLocation('')
    setYear('')
    setMonth('')
    const HolidayListPayload: any = {
      search: searchInput,
      filters: [],
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page + 1
      },
      sort: { columnName: 'stateId', order: type },
      "includeCentral": true
    }
    dispatch(getHolidaysList(HolidayListPayload))
  }

  const handleMonth = (e: any) => {
    setMonth(e.target.value)

    let updatedDaysList = [...daysList];




    if (e.target.value == 'April' || e.target.value == 'June' || e.target.value == 'September' || e.target.value == 'November') {
      updatedDaysList.splice(30, 1)


    } else if (e.target.value == 'February') {
      if (((0 == parseInt(year) % 4) && (0 != parseInt(year) % 100)) || (0 == parseInt(year) % 400)) {
        updatedDaysList.splice(29, 2)
      }
      else {
        updatedDaysList.splice(28, 3)
      }
    }
    setOriginalDayList(updatedDaysList);
  }
  const handleYear = (e: any) => {
    setYear(e.target.value)
    setOriginalDayList(daysList);
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
    if (stateName) {
      filters.push({
        columnName: 'stateId',
        value: stateName
      })
    }
    if (location) {
      filters.push({
        columnName: 'locationId',
        value: location
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
        value: (monthList.findIndex((each) => each === month) + 1).toString()
      })
    }

    const HolidayListPayload: any = {
      search: '',
      filters: filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: newPage + 1
      },
      sort: { columnName: 'name', order: 'asc' },
      "includeCentral": true
    }

    dispatch(getHolidaysList(HolidayListPayload))
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
    if (stateName) {
      filters.push({
        columnName: 'stateId',
        value: stateName
      })
    }
    if (location) {
      filters.push({
        columnName: 'locationId',
        value: location
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
        value: (monthList.findIndex((each) => each === month) + 1).toString()
      })
    }

    const HolidayListPayload: any = {
      search: '',
      filters: filters,
      pagination: {
        pageSize: parseInt(event.target.value, 10),
        pageNumber: 1
      },
      sort: { columnName: 'name', order: 'asc' },
      "includeCentral": true
    }

    dispatch(getHolidaysList(HolidayListPayload))
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const downloadSample = (e: any) => {
    preventDefault(e);
    download('Sample Holidays.xlsx', 'https://mafoi.s3.ap-south-1.amazonaws.com/bulkuploadtemplates/HolidaysTemplate.xlsx')
  }

  const downloadErrors = (e: any) => {
    preventDefault(e);
    const data = uploadHolidayDetails.data;
    const blob = new Blob([data])
    const URL = window.URL || window.webkitURL;
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = 'Errors.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  return (
    <div style={{ height: '100vh', backgroundColor: '#ffffff' }}>

      {/*Add Edit and View Modals */}
      <Drawer anchor='right' open={openModal}>
        <Box sx={{ height: '100%', width: 500, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ backgroundColor: '#E2E3F8', padding: '10px', px: '20px', borderRadius: '6px', boxShadow: '0px 6px 10px #CDD2D9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ font: 'normal normal normal 32px/40px Calibri' }}>{modalType} Holiday List</Typography>
            <IconButton
              onClick={() => { setOpenModal(false); setModalType(''); setHoliday({}); setCompany(''); setAssociateCompany(''); setStateName(''); setLocation(''); setYear(''); setMonth(''); setDay(''); setName(''); setRestrictedHoliday(true); setOptionalHoliday(true); }}
            >
              <IoMdClose />
            </IconButton>
          </Box>

          {/*Add Modal */}
          <>
            {modalType === 'Add' &&
              <Box sx={{ width: 400, padding: '20px' }}>
                <FormControl sx={{ m: 1, width: "100%", backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                  <FormLabel id="demo-radio-buttons-group-label" sx={{ color: '#000000' }}>Holiday Name</FormLabel>
                  {/* <InputLabel htmlFor="outlined-adornment-name" sx={{color:'#000000'}}>Name</InputLabel> */}
                  <OutlinedInput
                    placeholder='Holiday Name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    id="outlined-adornment-name"
                    type='text'
                    label="Name"
                    inputProps={{
                      maxLength: 50
                    }}
                  />
                </FormControl>

                <FormControl sx={{ m: 1, width: "100%", backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                  <InputLabel id="demo-select-small-label" sx={{ color: '#000000' }}>Company</InputLabel>
                  <Select
                    labelId="demo-select-small-label"
                    id="demo-select-small"
                    value={company}
                    label="Company"
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          maxHeight: 215,
                          width: 230,
                          marginTop: '3px'
                        },
                      },
                    }}

                    onChange={(e) => { setCompany(e.target.value), setAssociateCompany(''), setLocation('') }}
                  >
                    {companies && companies.map((each: any) => {
                      return <MenuItem sx={{ width: '240px', whiteSpace: 'initial' }}  value={each.id}>{each.name}</MenuItem>
                    })}
                  </Select>
                </FormControl>

                <FormControl disabled={!company} sx={{ m: 1, width: "100%", backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                  <InputLabel id="demo-select-small-label" sx={{ color: '#000000' }}>Associate Company</InputLabel>
                  <Select
                    labelId="demo-select-small-label"
                    id="demo-select-small"
                    value={associateCompany}
                    label="Associate Company"
                    disabled={!company}
                    onChange={(e) => setAssociateCompany(e.target.value)}
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
                    {associateCompanies && associateCompanies.map((each: any) => {
                      return <MenuItem sx={{ width: '240px', whiteSpace: 'initial' }} value={each.id}>{each.name}</MenuItem>
                    })}
                  </Select>
                </FormControl>

                <FormControl disabled={!associateCompany} sx={{ m: 1, width: "100%", backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                  <InputLabel id="demo-select-small-label" sx={{ color: '#000000' }}>States</InputLabel>
                  <Select
                    labelId="demo-select-small-label"
                    id="demo-select-small"
                    value={stateName}
                    label="States"
                    disabled={!associateCompany}
                    onChange={(e) => setStateName(e.target.value)}
                  >
                    {states && states.map((each: any) => {
                      return <MenuItem sx={{ width: '240px', whiteSpace: 'initial' }} value={each.id}>{each.name}</MenuItem>
                    })}
                  </Select>
                </FormControl>

                <FormControl disabled={!stateName} sx={{ m: 1, width: "100%", backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                  <InputLabel id="demo-select-small-label" sx={{ color: '#000000' }}>Location</InputLabel>
                  <Select
                    labelId="demo-select-small-label"
                    id="demo-select-small"
                    value={location}
                    label="Location"
                    disabled={!stateName}
                    onChange={(e) => setLocation(e.target.value)}
                  >
                    {locations && locations.map((each: any) => {
                      const { id, name, code, cities }: any = each.location || {};
                      const { state } = cities || {};
                      if (state.id === stateName) {
                        return <MenuItem sx={{ width: '240px', whiteSpace: 'initial' }} value={each.locationId}>{`${name} (${state.code}-${cities.code}-${code})`}</MenuItem>
                      }
                    })}
                  </Select>
                </FormControl>

                <Box sx={{ display: 'flex' }}>
                  <FormControl sx={{ m: 1, width: "100%", backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                    <InputLabel id="demo-select-small-label" sx={{ color: '#000000' }}>Year</InputLabel>
                    <Select
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      value={year}
                      label="Year"
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            maxHeight: 200,
                            width: 100,
                            marginTop: '3px'
                          },
                        },
                      }}
                      // onChange={(e) => setYear(e.target.value)}
                      onChange={handleYear}
                    >
                      {yearsList && yearsList.map((each: any) =>
                        <MenuItem sx={{ width: '240px', whiteSpace: 'initial' }} value={each}>{each}</MenuItem>
                      )}
                    </Select>
                  </FormControl>

                  <FormControl sx={{ m: 1, width: "100%", backgroundColor: '#ffffff', borderRadius: '5px' }} size="small" disabled={!year}>
                    <InputLabel id="demo-select-small-label" sx={{ color: '#000000' }}>Month</InputLabel>
                    <Select
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      value={month}
                      label="Month"
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            maxHeight: 200,
                            width: 115,
                            marginTop: '3px'
                          },
                        },
                      }}
                      // onChange={(e) => setMonth(e.target.value)}

                      onChange={handleMonth}
                    >
                      {monthList && monthList.map((each: any) =>
                        <MenuItem sx={{ width: '240px', whiteSpace: 'initial' }} value={each}>{each}</MenuItem>
                      )}
                    </Select>
                  </FormControl>

                  <FormControl sx={{ m: 1, width: "100%", backgroundColor: '#ffffff', borderRadius: '5px' }} size="small" disabled={!year || !month}>
                    <InputLabel id="demo-select-small-label" sx={{ color: '#000000' }}>Day</InputLabel>
                    <Select
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      value={day}
                      label="Day"
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            maxHeight: 200,
                            width: 100,
                            marginTop: '3px'
                          },
                        },
                      }}
                      onChange={(e) => setDay(e.target.value)}
                    >
                      {originalDayList && originalDayList.map((each: any) =>
                        <MenuItem  value={each}>{each}</MenuItem>
                      )}
                    </Select>
                  </FormControl>

                </Box>

                <FormControl sx={{ m: 1, width: "100%", backgroundColor: '#ffffff', borderRadius: '5px' }}>
                  <FormLabel id="demo-radio-buttons-group-label" sx={{ color: '#000000' }}>Optional Holiday</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="true"
                    name="radio-buttons-group"
                    value={optionalHoliday}
                    onChange={handleChangeOptionalHoliday}
                  >
                    <FormControlLabel value="true" control={<Radio />} label="Yes" />
                    <FormControlLabel value="false" control={<Radio />} label="No" />
                  </RadioGroup>
                </FormControl>

                <FormControl sx={{ m: 1, width: "100%", backgroundColor: '#ffffff', borderRadius: '5px' }}>
                  <FormLabel id="demo-radio-buttons-group-label" sx={{ color: '#000000' }}>Restricted</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="true"
                    name="radio-buttons-group"
                    value={restrictedHoliday}
                    onChange={handleChangeRestrictedHoliday}
                  >
                    <FormControlLabel value="true" control={<Radio />} label="Yes" />
                    <FormControlLabel value="false" control={<Radio />} label="No" />
                  </RadioGroup>
                </FormControl>


              </Box>
            }

            {modalType === 'Add' &&
              <Box sx={{ display: 'flex', padding: '20px', borderTop: '1px solid #6F6F6F', justifyContent: 'space-between', alignItems: 'center', mt: 6 }}>
                {/* <Button variant='outlined' color="error" onClick={() => {setOpenModal(false); setModalType(''); setHoliday({}); setCompany(''); setAssociateCompany(''); setStateName(''); setLocation(''); setYear(''); setMonth(''); setDay(''); setName(''); setRestrictedHoliday(true); setOptionalHoliday(true);}}>Cancel</Button> */}
                <Button variant='outlined' color="error" onClick={onClickCancelAdd}>Cancel</Button>

                <Button variant='contained' onClick={onClickSubmitAdd}>Submit</Button>
              </Box>
            }
          </>

          {/* View Modal */}
          <>
            {modalType === "View" &&
              <Box sx={{ width: '100%', padding: '20px' }}>

                <Typography variant='h5' color='#0F67B1' sx={{ fontSize: '22px', mt: 1 }}>Company Name</Typography>
                <Typography color="#000000" sx={{ fontSize: '20px' }} >{holiday.company.name}</Typography>
                <Typography variant='h5' color='#0F67B1' sx={{ fontSize: '22px', mt: 2 }}>Associate Company Name</Typography>
                <Typography color="#000000" sx={{ fontSize: '20px' }} >{holiday.associateCompany.name}</Typography>

                <Typography variant='h5' color='#0F67B1' sx={{ fontSize: '22px' }}>Holiday Name</Typography>
                <Typography color="#000000" sx={{ fontSize: '20px' }} >{holiday.name}</Typography>

                <Typography variant='h5' color='#0F67B1' sx={{ fontSize: '24px', mt: 2 }}>State</Typography>
                <Typography color="#000000" sx={{ fontSize: '22px' }}>{holiday.state.name}</Typography>

                <Typography variant='h5' color='#0F67B1' sx={{ fontSize: '24px', mt: 2 }}>Date</Typography>
                <Typography color="#000000" sx={{ fontSize: '22px' }}>{`${holiday.day}-${holiday.month > 9 ? holiday.month : '0' + holiday.month}-${holiday.year}`}</Typography>

                <Typography variant='h5' color='#0F67B1' sx={{ fontSize: '24px', mt: 2 }}>Year</Typography>
                <Typography color="#000000" sx={{ fontSize: '22px' }}>{holiday.year}</Typography>

                <Typography variant='h5' color='#0F67B1' sx={{ fontSize: '24px', mt: 2 }}>Restricted</Typography>
                <Typography color="#000000" sx={{ fontSize: '22px' }}>{holiday.restricted ? "Yes" : "No"}</Typography>
              </Box>
            }
            {modalType === 'View' &&
              <Box sx={{ display: 'flex', padding: '20px', borderTop: '1px solid #6F6F6F', justifyContent: 'flex-end', alignItems: 'center', mt: 2 }}>
                <Button variant='contained' onClick={() => { setOpenModal(false); setModalType(''); setHoliday({}) }}>Close</Button>
              </Box>
            }
          </>

          {/*Edit Modal */}
          <>
            {modalType === 'Edit' &&
              <Box sx={{ width: 400, padding: '20px' }}>
                <FormControl sx={{ m: 1, width: "100%", backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                  <FormLabel id="demo-radio-buttons-group-label" sx={{ color: '#000000' }}>Holiday Name</FormLabel>
                  {/* <InputLabel htmlFor="outlined-adornment-name" sx={{color:'#000000'}}>Name</InputLabel> */}
                  <OutlinedInput
                    placeholder='Holiday Name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    id="outlined-adornment-name"
                    type='text'
                    label="Name"
                    inputProps={{
                      maxLength: 50
                    }}
                  />
                </FormControl>

                <FormControl sx={{ m: 1, width: "100%", backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                  <InputLabel id="demo-select-small-label" sx={{ color: '#000000' }}>Company</InputLabel>
                  <Select
                    labelId="demo-select-small-label"
                    id="demo-select-small"
                    value={company}
                    label="Company"
                    onChange={(e) => { setCompany(e.target.value), setAssociateCompany(''), setLocation('') }}
                  >
                    {companies && companies.map((each: any) => {
                      return <MenuItem value={each.id}>{each.name}</MenuItem>
                    })}
                  </Select>
                </FormControl>

                <FormControl disabled={!company} sx={{ m: 1, width: "100%", backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                  <InputLabel id="demo-select-small-label" sx={{ color: '#000000' }}>Associate Company</InputLabel>
                  <Select
                    labelId="demo-select-small-label"
                    id="demo-select-small"
                    value={associateCompany}
                    label="Associate Company"
                    disabled={!company}
                    onChange={(e) => setAssociateCompany(e.target.value)}
                  >
                    {associateCompanies && associateCompanies.map((each: any) => {
                      return <MenuItem value={each.id}>{each.name}</MenuItem>
                    })}
                  </Select>
                </FormControl>

                <FormControl disabled={!associateCompany} sx={{ m: 1, width: "100%", backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                  <InputLabel id="demo-select-small-label" sx={{ color: '#000000' }}>States</InputLabel>
                  <Select
                    labelId="demo-select-small-label"
                    id="demo-select-small"
                    value={stateName}
                    label="States"
                    disabled={!associateCompany}
                    onChange={(e) => setStateName(e.target.value)}
                  >
                    {states && states.map((each: any) => {
                      return <MenuItem value={each.id}>{each.name}</MenuItem>
                    })}
                  </Select>
                </FormControl>

                <FormControl disabled={!stateName} sx={{ m: 1, width: "100%", backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                  <InputLabel id="demo-select-small-label" sx={{ color: '#000000' }}>Location</InputLabel>
                  <Select
                    labelId="demo-select-small-label"
                    id="demo-select-small"
                    value={location}
                    label="Location"
                    disabled={!stateName}
                    onChange={(e) => setLocation(e.target.value)}
                  >
                    {locations && locations.map((each: any) => {
                      const { id, name, code, cities }: any = each.location || {};
                      const { state } = cities || {};
                      if (state.id === stateName) {
                        return <MenuItem value={each.locationId}>{`${name} (${state.code}-${cities.code}-${code})`}</MenuItem>
                      }
                    })}
                  </Select>
                </FormControl>

                <Box sx={{ display: 'flex' }}>
                  <FormControl sx={{ m: 1, width: "100%", backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                    <InputLabel id="demo-select-small-label" sx={{ color: '#000000' }}>Year</InputLabel>
                    <Select
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      value={year}
                      label="Year"
                      // onChange={(e) => setYear(e.target.value)}

                      onChange={handleYear}
                    >
                      {yearsList && yearsList.map((each: any) =>
                        <MenuItem value={each}>{each}</MenuItem>
                      )}
                    </Select>
                  </FormControl>

                  <FormControl sx={{ m: 1, width: "100%", backgroundColor: '#ffffff', borderRadius: '5px' }} size="small" disabled={!year}>
                    <InputLabel id="demo-select-small-label" sx={{ color: '#000000' }}>Month</InputLabel>
                    <Select
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      value={month}
                      label="Month"
                      // onChange={(e) => setMonth(e.target.value)}

                      onChange={handleMonth}
                    >
                      {monthList && monthList.map((each: any) =>
                        <MenuItem value={each}>{each}</MenuItem>
                      )}
                    </Select>
                  </FormControl>

                  <FormControl sx={{ m: 1, width: "100%", backgroundColor: '#ffffff', borderRadius: '5px' }} size="small" disabled={!year || !month}>
                    <InputLabel id="demo-select-small-label" sx={{ color: '#000000' }}>Day</InputLabel>
                    <Select
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      value={day}
                      label="Day"
                      onChange={(e) => setDay(e.target.value)}
                    >
                      {originalDayList && originalDayList.map((each: any) =>
                        <MenuItem value={each}>{each}</MenuItem>
                      )}
                    </Select>
                  </FormControl>

                </Box>

                <FormControl sx={{ m: 1, width: "100%", backgroundColor: '#ffffff', borderRadius: '5px' }}>
                  <FormLabel id="demo-radio-buttons-group-label" sx={{ color: '#000000' }}>Optional Holiday</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue={true}
                    name="radio-buttons-group"
                    value={optionalHoliday}
                    onChange={handleChangeOptionalHoliday}
                  >
                    <FormControlLabel value={true} control={<Radio />} label="Yes" />
                    <FormControlLabel value={false} control={<Radio />} label="No" />
                  </RadioGroup>
                </FormControl>

                <FormControl sx={{ m: 1, width: "100%", backgroundColor: '#ffffff', borderRadius: '5px' }}>
                  <FormLabel id="demo-radio-buttons-group-label" sx={{ color: '#000000' }}>Restricted</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue={true}
                    name="radio-buttons-group"
                    value={restrictedHoliday}
                    onChange={handleChangeRestrictedHoliday}
                  >
                    <FormControlLabel value={true} control={<Radio />} label="Yes" />
                    <FormControlLabel value={false} control={<Radio />} label="No" />
                  </RadioGroup>
                </FormControl>

              </Box>
            }

            {modalType === 'Edit' &&
              <Box sx={{ display: 'flex', padding: '20px', borderTop: '1px solid #6F6F6F', justifyContent: 'space-between', alignItems: 'center', mt: 6 }}>
                <Button variant='outlined' color="error" onClick={() => { setOpenModal(false); setModalType(''); setHoliday({}); setCompany(''); setAssociateCompany(''); setStateName(''); setLocation(''); setYear(''); setMonth(''); setDay(''); setName(''); setRestrictedHoliday(true); setOptionalHoliday(true); }}>Cancel</Button>
                <Button variant='contained' onClick={onClickSubmitEdit}>Submit</Button>
              </Box>
            }
          </>
        </Box>
      </Drawer>

      {/* Delete Modal */}
      <Modal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
      >
        <Box sx={style}>
          <Box sx={{ backgroundColor: '#E2E3F8', padding: '10px', px: '20px', borderRadius: '6px', boxShadow: '0px 6px 10px #CDD2D9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ font: 'normal normal normal 32px/40px Calibri' }}>Delete Holiday List</Typography>
            <IconButton
              onClick={() => setOpenDeleteModal(false)}
            >
              <IoMdClose />
            </IconButton>
          </Box>
          <Box sx={{ padding: '20px', backgroundColor: '#ffffff' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography >Are you sure you want to delete the Holiday, &nbsp;</Typography>
              <Typography variant='h5'>{holiday && holiday.name}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
              <Button variant='outlined' color="error" onClick={() => setOpenDeleteModal(false)}>No</Button>
              <Button variant='contained' onClick={onClickConfirmDelete}>Yes</Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      {/* Upload Modal */}
      <Modal
        open={openUploadModal}
        onClose={() => { setOpenUploadModal(false); setUploadError(false); setUploadData(null) }}
      >
        <Box sx={styleUploadModal}>
          <Box sx={{ backgroundColor: '#E2E3F8', padding: '10px', px: '20px', borderRadius: '6px', boxShadow: '0px 6px 10px #CDD2D9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ font: 'normal normal normal 32px/40px Calibri' }}>Upload Holiday List</Typography>
            <IconButton
              onClick={() => { setOpenUploadModal(false); setUploadError(false); setUploadData(null) }}
            >
              <IoMdClose />
            </IconButton>
          </Box>

          {uploadError &&
            <Alert variant="danger" className="mx-4 my-4">
              There are few errors identified in the file uploaded. Correct the errors and upload again. <a href="/" onClick={downloadErrors}>Click here</a> to download the errors.
            </Alert>
          }
          <Box sx={{ padding: '20px', backgroundColor: '#ffffff', display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography mb={1} color={'#0F67B1'} fontWeight={'bold'} sx={{ font: 'normal normal normal 24px/28px Calibri' }}>Upload File <span style={{ color: 'red' }}>*</span></Typography>
              <input
                style={{ border: '1px solid #0F67B1', width: '500px', height: '40px', borderRadius: '5px' }}
                type="file"
                accept='.xlsx, .xls, .csv'
                onClick={(e: any) => e.target.value = ''}
                onChange={(e) => { console.log('chandeeddd', e.target.files); setUploadData(e.target.files) }}
              />
              <a href="/" style={{ marginTop: '10px', width: '210px' }} onClick={downloadSample}>Dowload Sample Holiday</a>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 5 }}>
            <Button variant='contained' disabled={!uploadData} onClick={onClickSubmitUpload}>Submit</Button>
          </Box>

          <Box sx={{ display: 'flex', padding: '20px', borderTop: '1px solid #6F6F6F', justifyContent: 'flex-end', alignItems: 'center', mt: 4 }}>
            <Button variant='contained' sx={{ backgroundColor: '#707070' }} onClick={() => { setOpenUploadModal(false); setUploadError(false); setUploadData(null) }}>Cancel</Button>
          </Box>
        </Box>
      </Modal>

      {/* Bulk Delete Modal */}
      <Modal
        open={openBulkDeleteModal}
        onClose={() => setOpenBulkDeleteModal(false)}
      >
        <Box sx={style}>
          <Box sx={{ backgroundColor: '#E2E3F8', padding: '10px', px: '20px', borderRadius: '6px', boxShadow: '0px 6px 10px #CDD2D9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ font: 'normal normal normal 32px/40px Calibri' }}>Delete Holidays</Typography>
            <IconButton
              onClick={() => setOpenBulkDeleteModal(false)}
            >
              <IoMdClose />
            </IconButton>
          </Box>
          <Box sx={{ padding: '20px', backgroundColor: '#ffffff' }}>
            <Box>
              <Typography variant='h5'>There are {selectedHolidays.length} record(s) selected for deleting.</Typography>
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
                <h5 style={{ font: 'normal normal normal 32px/40px Calibri' }}>Holiday List</h5>
                <div style={{ marginRight: '12px', display: 'flex', alignItems: 'center', width: '400px', justifyContent: 'space-between' }}>
                  <Button onClick={onClickUpload} title='Import Data' variant='contained' style={{ backgroundColor: '#E9704B', display: 'flex', alignItems: 'center' }}> <FaUpload /> &nbsp; Upload</Button>
                  <Button onClick={onClickAdd} variant='contained' style={{ backgroundColor: '#0654AD', display: 'flex', alignItems: 'center' }}> <IoMdAdd /> &nbsp; Add</Button>
                  <Button onClick={onClickBulkDelete} variant='contained' color='error' disabled={selectedHolidays && selectedHolidays.length === 0}> Bulk Delete</Button>
                  <button onClick={onClickExport} title='Export Data' disabled={(holidays && holidays.length <= 0) || !company || !associateCompany || !stateName} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: ((holidays && holidays.length <= 0) || !company || !associateCompany) ? '#707070' : '#ffffff', color: ((holidays && holidays.length <= 0) || !company || !associateCompany) ? '#ffffff' : '#000000', border: '1px solid #000000', width: '40px', height: '30px', borderRadius: '8px' }}> <FaDownload /> </button>
                </div>
              </div>
              <div style={{ display: 'flex' }}>

                <Box sx={{ width: '100%', mr: 1 }}>
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
                            maxHeight: 210,
                            width: 230,
                            marginLeft: "21px",
                            marginTop: '3px'
                          },
                        },
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

                <Box sx={{ width: '100%', mr: 1 }}>
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
                            maxHeight: 210,
                            width: 215,
                            marginLeft: "10px",
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

                <Box sx={{ width: '100%', mr: 1 }}>
                  <Typography mb={1}>States</Typography>
                  <FormControl sx={{ width: '100%', maxWidth: '200px', backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                    <Select
                      sx={{ '.MuiOutlinedInput-notchedOutline': { border: 0 } }}
                      displayEmpty
                      value={stateName}
                      disabled={!associateCompany}
                      onChange={handleChangeStateName}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            maxHeight: 210,
                            width: 180,
                            marginLeft: "0px",
                            marginTop: '3px'
                          },
                        },
                      }}
                    >
                      <MenuItem disabled sx={{ display: 'none' }} value="">
                        Select State
                      </MenuItem>
                      {states && states.map((each: any) => {
                        return <MenuItem sx={{ width: '240px', whiteSpace: 'initial' }} value={each.id}>{each.name}</MenuItem>
                      })}
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ width: '100%', mr: 1 }}>
                  <Typography mb={1}>Location</Typography>
                  <FormControl sx={{ width: '100%', maxWidth: '200px', backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                    <Select
                      sx={{ '.MuiOutlinedInput-notchedOutline': { border: 0 } }}
                      displayEmpty
                      value={location}
                      disabled={!stateName}
                      onChange={handleChangeLocation}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            maxHeight: 210,
                            width: 215,
                            marginLeft: "10px",
                            marginTop: '3px'
                          },
                        },
                      }}
                    >
                      <MenuItem disabled sx={{ display: 'none' }} value="">
                        Select Location
                      </MenuItem>
                      {locations && locations.map((each: any) => {
                        const { id, name, code, cities }: any = each.location || {};
                        const { state } = cities || {};
                        if (state.id === stateName) {
                          return <MenuItem sx={{ width: '250px', whiteSpace: 'initial' }} value={each.locationId}>{`${name} (${state.code}-${cities.code}-${code})`}</MenuItem>
                        }
                      })}
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ width: '100%', mr: 1 }}>
                  <Typography mb={1}>Year</Typography>
                  <FormControl sx={{ width: '100%', maxWidth: '200px', backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                    <Select
                      sx={{ '.MuiOutlinedInput-notchedOutline': { border: 0 } }}
                      displayEmpty
                      value={year}
                      disabled={!location}
                      onChange={handleChangeYear}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            maxHeight: 210,
                            width: 110,
                            marginLeft: "0px",
                            marginTop: '3px'
                          },
                        },
                      }}
                    >
                      <MenuItem disabled sx={{ display: 'none' }} value="">
                        Select Year
                      </MenuItem>
                      {yearsList && yearsList.map((each: any) =>
                        <MenuItem sx={{ width: '250px', whiteSpace: 'initial' }} value={each}>{each}</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ width: '100%', mr: 1 }}>
                  <Typography mb={1}>Month</Typography>
                  <FormControl sx={{ width: '100%', maxWidth: '200px', backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                    <Select
                      sx={{ '.MuiOutlinedInput-notchedOutline': { border: 0 } }}
                      displayEmpty
                      value={month}
                      disabled={!year}
                      onChange={handleChangeMonth}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            maxHeight: 210,
                            width: 100,
                            marginLeft: "0px",
                            marginTop: '3px'
                          },
                        },
                      }}
                    >
                      <MenuItem disabled sx={{ display: 'none' }} value="">
                        Select Month
                      </MenuItem>
                      {monthList && monthList.map((each: any) =>
                        <MenuItem sx={{ width: '250px', whiteSpace: 'initial' }} value={each}>{each}</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ width: '100%', mr: 1 }}>
                  <Typography mb={1}>Search(HolidayName)</Typography>
                  <FormControl sx={{ width: '100%', maxWidth: '200px', backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                    <InputLabel htmlFor="outlined-adornment-search">Search</InputLabel>
                    <OutlinedInput
                      value={searchInput}
                      onChange={handleChangeSearchInput}
                      sx={{ '.MuiOutlinedInput-notchedOutline': { border: 0 } }}
                      id="outlined-adornment-search"
                      type='text'
                      inputProps={{
                        maxLength: 30
                      }}

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

          <Box sx={{ paddingX: '20px' }}>
            {
              holidays && holidays.length <= 0 ?

                <Box sx={{ height: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Typography variant='h5'>No Records Found</Typography>
                </Box>
                :
                <>
                  <TableContainer sx={{ border: '1px solid #e6e6e6', marginTop: '10px', maxHeight: '385px', overflowY: 'scroll' }}>
                    <Table stickyHeader sx={{ minWidth: 650 }} aria-label="sticky table">
                      <TableHead sx={{ '.MuiTableCell-root': { backgroundColor: '#E7EEF7' } }}>
                        <TableRow>
                          <TableCell><Checkbox checked={(selectedHolidays && selectedHolidays.length) === (holidays && holidays.length)} onClick={onClickAllCheckBox} /></TableCell>
                          <TableCell > <TableSortLabel active={activeSort === 'year'} direction={sortType} onClick={onClickSortYear}> Year</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel active={activeSort === 'day'} direction={sortType} onClick={onClickSortDate}> Date</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel active={activeSort === 'company'} direction={sortType} onClick={onClickSortassociateCompanyName}> Company</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel active={activeSort === 'associatecompany'} direction={sortType} onClick={onClickSortassociateCompanyName}>Associate Company</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel active={activeSort === 'name'} direction={sortType} onClick={onClickSortName}> Holiday Name</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel active={activeSort === 'stateId'} direction={sortType} onClick={onClickSortState}> State</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel active={activeSort === 'restricted'} direction={sortType} onClick={onClickSortRestricted}> Restricted</TableSortLabel></TableCell>
                          <TableCell > Actions</TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {holidays && holidays.map((each: any, index: number) => (
                          <TableRow
                            key={each._id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell><Checkbox checked={selectedHolidays.includes(each.id)} onClick={() => onClickIndividualCheckBox(each.id)} /></TableCell>
                            <TableCell >{each.year}</TableCell>
                            <TableCell >{`${each.day > 9 ? each.day : '0' + each.day}-${each.month > 9 ? each.month : '0' + each.month}-${each.year}`}</TableCell>
                            <TableCell >{each.company.name}</TableCell>
                            <TableCell >{each.associateCompany.name}</TableCell>
                            <TableCell >{each.name}</TableCell>
                            <TableCell >{each.state.name}</TableCell>
                            <TableCell >{each.restricted ? 'Yes' : 'No'}</TableCell>
                            <TableCell >
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100px' }}>
                                <Icon action={() => onclickEdit(each)} style={{ color: '#039BE5' }} type="button" name={'pencil'} text={'Edit'} />
                                <Icon action={() => onclickDelete(each)} style={{ color: '#EB1010' }} type="button" name={'trash'} text={'Delete'} />
                                <Icon action={() => onclickView(each)} style={{ color: '#00C853' }} type="button" name={'eye'} text={'View'} />
                              </Box>
                            </TableCell>
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
                    count={holidaysCount}
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

export default HolidayList