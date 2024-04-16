import React, { useEffect } from 'react'
import PageLoader from '../../shared/PageLoader'
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import { getAllCompaniesDetails, getAssociateCompanies, getLocations } from '../../../redux/features/inputModule.slice';
import { Box, Button, Drawer, FormControl, FormControlLabel, FormLabel, IconButton, InputAdornment, InputLabel, MenuItem, Modal, OutlinedInput, Radio, RadioGroup, Select, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, TextField, Typography } from '@mui/material';
import { FaUpload, FaDownload } from "react-icons/fa";
import { IoMdAdd, IoMdClose, IoMdSearch } from "react-icons/io";
import { DEFAULT_OPTIONS_PAYLOAD, DEFAULT_PAYLOAD } from '../../common/Table';
import { addHoliday, deleteHoliday, editHoliday, getHolidaysList, resetAddHolidayDetails, resetDeleteHolidayDetails, resetEditHolidayDetails, resetUploadHolidayDetails, uploadHoliday } from '../../../redux/features/holidayList.slice';
import Icon from '../../common/Icon';
import { useExportHolidayList } from '../../../backend/exports';
import { download, downloadFileContent, preventDefault } from '../../../utils/common';
import { ERROR_MESSAGES } from '../../../utils/constants';
import { toast } from 'react-toastify';
import { Alert } from 'react-bootstrap';
import { getleaveConfiguration } from '../../../redux/features/leaveConfiguration.slice';


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

const LeaveConfiguration = () => {

  const dispatch = useAppDispatch();

  const leaveConfigurationDetails = useAppSelector((state) => state.leaveConfiguration.leaveConfigurationDetails)
  const holidayListDetails = useAppSelector((state) => state.holidayList.holidayListDetails)
  const deleteHolidayDetails = useAppSelector((state) => state.holidayList.deleteHolidayDetails)
  const addHolidayDetails = useAppSelector((state) => state.holidayList.addHolidayDetails)
  const uploadHolidayDetails = useAppSelector((state) => state.holidayList.uploadHolidayDetails)
  const editHolidayDetails = useAppSelector((state) => state.holidayList.editHolidayDetails)

  const companiesDetails = useAppSelector((state) => state.inputModule.companiesDetails);
  const associateCompaniesDetails = useAppSelector((state) => state.inputModule.associateCompaniesDetails);
  const locationsDetails = useAppSelector((state) => state.inputModule.locationsDetails);

  const { exportHolidayList, exporting } = useExportHolidayList((response: any) => {
    downloadFileContent({
        name: 'HolidayList.xlsx',
        type: response.headers['content-type'],
        content: response.data
    });
  }, () => {
      toast.error(ERROR_MESSAGES.DEFAULT);
  });

  const leaves = leaveConfigurationDetails.data.list

  const holidays = holidayListDetails.data.list
  const holidaysCount = holidayListDetails.data.count
  const companies = companiesDetails.data.list
  const associateCompanies = associateCompaniesDetails.data.list
  const locations = locationsDetails.data.list

  const loading = exporting|| editHolidayDetails.status === 'loading' || uploadHolidayDetails.status === 'loading' || addHolidayDetails.status === 'loading' || deleteHolidayDetails.status === 'loading' || holidayListDetails.status === 'loading' || companiesDetails.status === 'loading' || associateCompaniesDetails.status === 'loading' || locationsDetails.status === 'loading'

  const [company, setCompany] = React.useState('');
  const [associateCompany, setAssociateCompany] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [year, setYear] = React.useState('');
  const [month, setMonth] =  React.useState('');
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
  const [uploadData, setUploadData] =  React.useState<any>();
  const [uploadError, setUploadError] = React.useState(false);

  const handleChangeCompany = (event:any) => {
    setAssociateCompany('')
    setLocation('')
    setYear('')
    setMonth('')
    setCompany(event.target.value);
    const HolidayListPayload: any =  { 
      search: searchInput, 
      filters: [
        {
          columnName:'companyId',
          value: event.target.value
        }
      ],
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page+1
      },
      sort: { columnName: 'name', order: 'asc' },
      "includeCentral": true
    }
    dispatch(getHolidaysList(HolidayListPayload))
  };

  const handleChangeAssociateCompany = (event:any) => {
    setLocation('')
    setYear('')
    setMonth('')
    setAssociateCompany(event.target.value);
    const HolidayListPayload: any =  { 
      search: searchInput, 
      filters: [
        {
          columnName:'companyId',
          value: company
        },
        {
          columnName:'associateCompanyId',
          value: event.target.value
        }
      ],
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page+1
      },
      sort: { columnName: 'name', order: 'asc' },
      "includeCentral": true
    }
    dispatch(getHolidaysList(HolidayListPayload))
  };

  const handleChangeLocation = (event:any) => {
    setYear('')
    setMonth('')
    setLocation(event.target.value);
    const HolidayListPayload: any =  { 
      search: searchInput, 
      filters: [
        {
          columnName:'companyId',
          value: company
        },
        {
          columnName:'associateCompanyId',
          value: associateCompany
        },
        {
          columnName:'locationId',
          value: event.target.value
        }
      ],
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page+1
      },
      sort: { columnName: 'name', order: 'asc' },
      "includeCentral": true
    }
    dispatch(getHolidaysList(HolidayListPayload))
  };
  
  const handleChangeYear = (event:any) => {
    setYear('')
    setYear(event.target.value);
    const HolidayListPayload: any =  { 
      search: searchInput, 
      filters: [
        {
          columnName:'companyId',
          value: company
        },
        {
          columnName:'associateCompanyId',
          value: associateCompany
        },
        {
          columnName:'locationId',
          value: location
        },
        {
          columnName:'year',
          value: event.target.value
        }
      ],
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page+1
      },
      sort: { columnName: 'name', order: 'asc' },
      "includeCentral": true
    }
    dispatch(getHolidaysList(HolidayListPayload))
  };
  
  const handleChangeMonth = (event:any) => {
    setMonth(event.target.value);
    const monthName = event.target.value
    let monthKey:any
    if(monthName === 'January'){
      monthKey = 1
    }else if(monthName === 'February'){
      monthKey = 2
    }else if(monthName === 'March'){
      monthKey = 3
    }else if(monthName === 'April'){
      monthKey = 4
    }else if(monthName === 'May'){
      monthKey = 5
    }else if(monthName === 'June'){
      monthKey = 6
    }else if(monthName === 'July'){
      monthKey = 7
    }else if(monthName === 'August'){
      monthKey = 8
    }else if(monthName === 'September'){
      monthKey = 9
    }else if(monthName === 'October'){
      monthKey = 10
    }else if(monthName === 'November'){
      monthKey = 11
    }else if(monthName === 'December'){
      monthKey = 12
    }
    const HolidayListPayload: any =  { 
      search: searchInput, 
      filters: [
        {
          columnName:'companyId',
          value: company
        },
        {
          columnName:'associateCompanyId',
          value: associateCompany
        },
        {
          columnName:'locationId',
          value: location
        },
        {
          columnName:'year',
          value: year
        },
        {
          columnName:'month',
          value: event.target.value
        }
      ],
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page+1
      },
      sort: { columnName: 'name', order: 'asc' },
      "includeCentral": true
    }
    dispatch(getHolidaysList(HolidayListPayload))
  };

  const handleChangeSearchInput = (event:any) => {
    setSearchInput(event.target.value)
  }

  const handleChangeOptionalHoliday = (event: any) => {
    if('true' === event.target.value){
      setOptionalHoliday(true)
    }else{
      setOptionalHoliday(false)
    }
  }

  const handleChangeRestrictedHoliday = (event: any) => {
    if('true' === event.target.value){
      setRestrictedHoliday(true)
    }else{
      setRestrictedHoliday(false)
    }
  }

  useEffect(() => {
    const leaveConfigurationSliceDefaultPayload: any =  { 
      search: "",
      filters: [],
      pagination: {
        pageSize: 10,
        pageNumber: 1
      },
      sort: { columnName: 'ezycompLeave', order: 'asc' },
      "includeCentral": true
    }

    const companiesPayload: any = { ...DEFAULT_OPTIONS_PAYLOAD, filters: [{ columnName: 'isParent', value: 'true' }] }
    dispatch(getleaveConfiguration(leaveConfigurationSliceDefaultPayload))
    dispatch(getAllCompaniesDetails(companiesPayload))
  },[])

  useEffect(() => {
    const payload:any = { ...DEFAULT_OPTIONS_PAYLOAD, filters: [{ columnName: 'isParent', value: 'false' }, { columnName: 'parentCompanyId', value: company }] }
    if(company){
      dispatch(getAssociateCompanies(payload))
    }
  }, [company])

  useEffect(() => {
    const payload:any ={
      ...DEFAULT_OPTIONS_PAYLOAD, filters: [
          { columnName: 'companyId', value: associateCompany }],
      sort: { columnName: 'locationName', order: 'asc' }
    }
    if(associateCompany){
      dispatch(getLocations(payload))
    }
  }, [associateCompany])

  useEffect(() => {
    if(holidayListDetails.status === 'succeeded'){

    }else if(holidayListDetails.status === 'failed'){
      toast.error(ERROR_MESSAGES.DEFAULT);
    }
  },[holidayListDetails.status])

  useEffect(() => {
    if(deleteHolidayDetails.status === 'succeeded'){
      toast.success(`${holiday.name} deleted successfully.`)
      setHoliday({})
      dispatch(resetDeleteHolidayDetails())
      setOpenDeleteModal(false)
      const HolidayListDefaultPayload: any =  { 
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
    }else if(deleteHolidayDetails.status === 'failed'){
      toast.error(ERROR_MESSAGES.DEFAULT);
    }
  }, [deleteHolidayDetails.status])

  useEffect(() => {
    if(addHolidayDetails.status === 'succeeded'){
      toast.success(`Holiday Added successfully.`)
      dispatch(resetAddHolidayDetails())
      setOpenModal(false); setModalType(''); setHoliday({}); setCompany(''); setAssociateCompany(''); setLocation(''); setYear(''); setMonth(''); setDay(''); setName(''); setRestrictedHoliday(true); setOptionalHoliday(true); 
      const HolidayListDefaultPayload: any =  { 
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
    }else if(addHolidayDetails.status === 'failed'){
      setOpenModal(false); setModalType(''); setHoliday({}); setCompany(''); setAssociateCompany(''); setLocation(''); setYear(''); setMonth(''); setDay(''); setName(''); setRestrictedHoliday(true); setOptionalHoliday(true); 
      toast.error(ERROR_MESSAGES.DEFAULT);
    }
  }, [addHolidayDetails.status])

  useEffect(() => {
    if(uploadHolidayDetails.status === 'succeeded'){
      if(uploadHolidayDetails.data.size === 0){
        toast.success(`Holiday List Uploaded successfully.`)
        dispatch(resetUploadHolidayDetails())
        setOpenUploadModal(false)
        setUploadError(false)
        const HolidayListDefaultPayload: any =  { 
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
      }else{
        setUploadError(true)
      }
    }else if(uploadHolidayDetails.status === 'failed'){
      toast.error(ERROR_MESSAGES.DEFAULT);
    }
  }, [uploadHolidayDetails])

  useEffect(() => {
    if(editHolidayDetails.status === 'succeeded'){
      toast.success(`Holiday Updated successfully.`)
      dispatch(resetEditHolidayDetails())
      setOpenModal(false); setModalType(''); setHoliday({}); setCompany(''); setAssociateCompany(''); setLocation(''); setYear(''); setMonth(''); setDay(''); setName(''); setRestrictedHoliday(true); setOptionalHoliday(true); 
      const HolidayListDefaultPayload: any =  { 
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
    }else if(editHolidayDetails.status === 'failed'){
      setOpenModal(false); setModalType(''); setHoliday({}); setCompany(''); setAssociateCompany(''); setLocation(''); setYear(''); setMonth(''); setDay(''); setName(''); setRestrictedHoliday(true); setOptionalHoliday(true); 
      toast.error(ERROR_MESSAGES.DEFAULT);
    }
  }, [editHolidayDetails.status])

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
    if(company){
      filters.push({
        columnName:'companyId',
        value: company
      })
    }
    if(associateCompany){
      filters.push({
        columnName:'associateCompanyId',
        value: associateCompany
      })
    }
    if(location){
      filters.push({
        columnName:'locationId',
        value: location
      })
    }
    if(year){
      filters.push({
        columnName:'year',
        value: year
      })
    }
    if(month){
      filters.push({
        columnName:'companyId',
        value: month
      })
    }

    const HolidayListPayload: any =  { 
      search: searchInput, 
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page+1
      },
      sort: { columnName: activeSort, order: sortType },
      "includeCentral": true
    }
    exportHolidayList({ ...HolidayListPayload, pagination: null });
  }

  const onClickSearch = () => {
    const HolidayListPayload: any =  { 
      search: searchInput, 
      filters: [],
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page+1
      },
      sort: { columnName: 'name', order: 'asc' },
      "includeCentral": true
    }
    dispatch(getHolidaysList(HolidayListPayload))
  }

  const onClickClearSearch = () => {
    const HolidayListPayload: any =  { 
      search: '', 
      filters: [],
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page+1
      },
      sort: { columnName: 'name', order: 'asc' },
      "includeCentral": true
    }
    dispatch(getHolidaysList(HolidayListPayload))
    setSearchInput('')
  }

  const onClickSortEzycompLeave = () => {
    let type = 'asc'
    setActiveSort('ezycompLeave'); 
    if(sortType === 'asc'){
      setSortType('desc')
      type = 'desc'
    }else{
      setSortType('asc')
    }

    const filters = []
    if(company){
      filters.push({
        columnName:'companyId',
        value: company
      })
    }
    if(associateCompany){
      filters.push({
        columnName:'associateCompanyId',
        value: associateCompany
      })
    }
    if(location){
      filters.push({
        columnName:'locationId',
        value: location
      })
    }

    const leaveConfigurationPayload: any =  { 
      search: searchInput, 
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page+1
      },
      sort: { columnName: 'ezycompLeave', order: type },
      "includeCentral": true
    }
    dispatch(getleaveConfiguration(leaveConfigurationPayload))
    
  }

  const onClickSortDate = () => {
    let type = 'asc'
    setActiveSort('date'); 
    if(sortType === 'asc'){
      setSortType('desc')
      type = 'desc'
    }else{
      setSortType('asc')
    }

    const filters = []
    if(company){
      filters.push({
        columnName:'companyId',
        value: company
      })
    }
    if(associateCompany){
      filters.push({
        columnName:'associateCompanyId',
        value: associateCompany
      })
    }
    if(location){
      filters.push({
        columnName:'locationId',
        value: location
      })
    }
    if(year){
      filters.push({
        columnName:'year',
        value: year
      })
    }
    if(month){
      filters.push({
        columnName:'companyId',
        value: month
      })
    }

    const HolidayListPayload: any =  { 
      search: searchInput, 
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page+1
      },
      sort: { columnName: 'day', order: type },
      "includeCentral": true
    }
    dispatch(getHolidaysList(HolidayListPayload)) 
  }

  const onClickSortName = () => {
    let type = 'asc'
    setActiveSort('name'); 
    if(sortType === 'asc'){
      setSortType('desc')
      type = 'desc'
    }else{
      setSortType('asc')
    }

    const filters = []
    if(company){
      filters.push({
        columnName:'companyId',
        value: company
      })
    }
    if(associateCompany){
      filters.push({
        columnName:'associateCompanyId',
        value: associateCompany
      })
    }
    if(location){
      filters.push({
        columnName:'locationId',
        value: location
      })
    }
    if(year){
      filters.push({
        columnName:'year',
        value: year
      })
    }
    if(month){
      filters.push({
        columnName:'companyId',
        value: month
      })
    }

    const HolidayListPayload: any =  { 
      search: searchInput, 
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page+1
      },
      sort: { columnName: 'name', order: type },
      "includeCentral": true
    }
    dispatch(getHolidaysList(HolidayListPayload))
    
  }
  
  const onClickSortState = () => {
    let type = 'asc'
    setActiveSort('state'); 
    if(sortType === 'asc'){
      setSortType('desc')
      type = 'desc'
    }else{
      setSortType('asc')
    }

    const filters = []
    if(company){
      filters.push({
        columnName:'companyId',
        value: company
      })
    }
    if(associateCompany){
      filters.push({
        columnName:'associateCompanyId',
        value: associateCompany
      })
    }
    if(location){
      filters.push({
        columnName:'locationId',
        value: location
      })
    }
    if(year){
      filters.push({
        columnName:'year',
        value: year
      })
    }
    if(month){
      filters.push({
        columnName:'companyId',
        value: month
      })
    }

    const HolidayListPayload: any =  { 
      search: searchInput, 
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page+1
      },
      sort: { columnName: 'state', order: type },
      "includeCentral": true
    }
    dispatch(getHolidaysList(HolidayListPayload))
    
  }

  const onClickSortRestricted = () => {
    let type = 'asc'
    setActiveSort('restricted'); 
    if(sortType === 'asc'){
      setSortType('desc')
      type = 'desc'
    }else{
      setSortType('asc')
    }

    const filters = []
    if(company){
      filters.push({
        columnName:'companyId',
        value: company
      })
    }
    if(associateCompany){
      filters.push({
        columnName:'associateCompanyId',
        value: associateCompany
      })
    }
    if(location){
      filters.push({
        columnName:'locationId',
        value: location
      })
    }
    if(year){
      filters.push({
        columnName:'year',
        value: year
      })
    }
    if(month){
      filters.push({
        columnName:'companyId',
        value: month
      })
    }

    const HolidayListPayload: any =  { 
      search: searchInput, 
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page+1
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
    setLocation('')
  }

  const onClickSubmitAdd = () => {
    let monthKey:any

    if(month === 'January'){
      monthKey = 1
    }else if(month === 'February'){
      monthKey = 2
    }else if(month === 'March'){
      monthKey = 3
    }else if(month === 'April'){
      monthKey = 4
    }else if(month === 'May'){
      monthKey = 5
    }else if(month === 'June'){
      monthKey = 6
    }else if(month === 'July'){
      monthKey = 7
    }else if(month === 'August'){
      monthKey = 8
    }else if(month === 'September'){
      monthKey = 9
    }else if(month === 'October'){
      monthKey = 10
    }else if(month === 'November'){
      monthKey = 11
    }else if(month === 'December'){
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
      restricted:restrictedHoliday,
      remarks: ''
    }
    dispatch(addHoliday(payload))
  }

  const onclickEdit = (holiday:any) => {
    let monthKey:any
    const monthNumber = holiday.month
    if(monthNumber === 1){
      monthKey = 'January'
    }else if(monthNumber === 2){
      monthKey = 'February'
    }else if(monthNumber === 3){
      monthKey = 'March'
    }else if(monthNumber === 4){
      monthKey = 'April'
    }else if(monthNumber === 5){
      monthKey = 'May'
    }else if(monthNumber === 6){
      monthKey = 'June'
    }else if(monthNumber === 7){
      monthKey = 'July'
    }else if(monthNumber === 8){
      monthKey = 'August'
    }else if(monthNumber === 9){
      monthKey = 'September'
    }else if(monthNumber === 10){
      monthKey = 'October'
    }else if(monthNumber === 11){
      monthKey = 'November'
    }else if(monthNumber === 12){
      monthKey = 'December'
    }
    setOpenModal(true)
    setModalType('Edit')
    setName(holiday.name)
    setCompany(holiday.company.id)
    setAssociateCompany(holiday.associateCompany.id)
    setLocation(holiday.location.id+'^'+holiday.stateId)
    setYear(holiday.year)
    setMonth(monthKey)
    setDay(holiday.day)
    setOptionalHoliday(holiday.optionalHoliday)
    setRestrictedHoliday(holiday.restricted)
    setHoliday(holiday)
  }

  const onClickSubmitEdit = () => {
    let monthKey:any

    if(month === 'January'){
      monthKey = 1
    }else if(month === 'February'){
      monthKey = 2
    }else if(month === 'March'){
      monthKey = 3
    }else if(month === 'April'){
      monthKey = 4
    }else if(month === 'May'){
      monthKey = 5
    }else if(month === 'June'){
      monthKey = 6
    }else if(month === 'July'){
      monthKey = 7
    }else if(month === 'August'){
      monthKey = 8
    }else if(month === 'September'){
      monthKey = 9
    }else if(month === 'October'){
      monthKey = 10
    }else if(month === 'November'){
      monthKey = 11
    }else if(month === 'December'){
      monthKey = 12
    }
    const payload = {
      id:holiday.id,
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

  const onclickView = (holiday:any) => {
    setOpenModal(true)
    setModalType('View')
    setHoliday(holiday)
  }

  const onclickDelete = (holiday:any) => {
    setHoliday(holiday)
    setOpenDeleteModal(true)
  }
 
  const onClickConfirmDelete = () => {
    dispatch(deleteHoliday(holiday.id))
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    const HolidayListPayload: any =  { 
      search: '', 
      filters: [],
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: newPage+1
      },
      sort: { columnName: 'name', order: 'asc' },
      "includeCentral": true
    }

    dispatch(getHolidaysList(HolidayListPayload))
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const HolidayListPayload: any =  { 
      search: '', 
      filters: [],
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
    download('Sample Holidays.xlsx', 'https://mafoi.s3.ap-south-1.amazonaws.com/bulkuploadtemplates/ActsTemplate.xlsx')
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
    <div style={{ height:'100vh', backgroundColor:'#ffffff'}}>

      {/*Add Edit and View Modals */}
      <Drawer anchor='right' open={openModal}>
        <Box  sx={{height:'100%',width: 500, display:'flex', flexDirection:'column'}}>
          <Box sx={{backgroundColor:'#E2E3F8', padding:'10px', px:'20px', borderRadius:'6px', boxShadow: '0px 6px 10px #CDD2D9', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <Typography sx={{font: 'normal normal normal 32px/40px Calibri'}}>{modalType} Holiday List</Typography>
            <IconButton
              onClick={() => {setOpenModal(false); setModalType(''); setHoliday({}); setCompany(''); setAssociateCompany(''); setLocation(''); setYear(''); setMonth(''); setDay(''); setName(''); setRestrictedHoliday(true); setOptionalHoliday(true); }}
            >
              <IoMdClose />
            </IconButton>
          </Box>

          {/*Add Modal */}
          <>
            {modalType === 'Add' && 
            <Box sx={{ width: 400, padding:'20px'}}>
                  <FormControl sx={{ m: 1, width:"100%", backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                    <FormLabel id="demo-radio-buttons-group-label"  sx={{color:'#000000'}}>Name</FormLabel>
                    {/* <InputLabel htmlFor="outlined-adornment-name" sx={{color:'#000000'}}>Name</InputLabel> */}
                    <OutlinedInput
                      placeholder='Name'
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      id="outlined-adornment-name"
                      type='text'
                      label="Name"
                    />
                  </FormControl>

                  <FormControl sx={{ m: 1, width:"100%", backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                    <InputLabel id="demo-select-small-label" sx={{color:'#000000'}}>Company</InputLabel>
                    <Select
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      value={company}
                      label="Company"
                      onChange={(e) => {setCompany(e.target.value), setAssociateCompany(''), setLocation('')}}
                    >
                      {companies && companies.map((each:any) => {
                          return <MenuItem value={each.id}>{each.name}</MenuItem>
                      })}
                    </Select>
                  </FormControl>

                  <FormControl disabled={!company} sx={{ m: 1, width:"100%", backgroundColor:'#ffffff', borderRadius:'5px' }} size="small">
                    <InputLabel id="demo-select-small-label" sx={{color:'#000000'}}>Associate Company</InputLabel>
                    <Select
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      value={associateCompany}
                      label="Associate Company"
                      disabled={!company}
                      onChange={(e) => setAssociateCompany(e.target.value)}
                    >
                      {associateCompanies && associateCompanies.map((each:any) => {
                          return <MenuItem value={each.id}>{each.name}</MenuItem>
                      })}
                    </Select>
                  </FormControl>

                  <FormControl disabled={!associateCompany} sx={{ m: 1, width:"100%", backgroundColor:'#ffffff', borderRadius:'5px' }} size="small">
                    <InputLabel id="demo-select-small-label" sx={{color:'#000000'}}>Locations</InputLabel>
                    <Select
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      value={location}
                      label="Locations"
                      disabled={!associateCompany}
                      onChange={(e) => setLocation(e.target.value)}
                    >
                      {locations && locations.map((each:any) => {
                          const { id, name, code, cities }: any = each.location || {};
                          const { state } = cities || {};
                          return <MenuItem value={each.locationId+'^'+state.id}>{`${name} (${state.code}-${cities.code}-${code})`}</MenuItem>
                      })}
                    </Select>
                  </FormControl>

                  <Box sx={{display:'flex'}}>
                    <FormControl sx={{ m: 1, width:"100%", backgroundColor:'#ffffff', borderRadius:'5px' }} size="small">
                      <InputLabel id="demo-select-small-label" sx={{color:'#000000'}}>Year</InputLabel>
                      <Select
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        value={year}
                        label="Year"
                        onChange={(e) => setYear(e.target.value)}
                      >
                        {yearsList && yearsList.map((each:any) => 
                          <MenuItem value={each}>{each}</MenuItem>
                        )}
                      </Select>
                    </FormControl>

                    <FormControl sx={{ m: 1, width:"100%", backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                      <InputLabel id="demo-select-small-label" sx={{color:'#000000'}}>Month</InputLabel>
                      <Select
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        value={month}
                        label="Month"
                        onChange={(e) => setMonth(e.target.value)}
                      >
                        {monthList && monthList.map((each:any) => 
                          <MenuItem value={each}>{each}</MenuItem>
                        )}
                      </Select>
                    </FormControl>

                    <FormControl sx={{ m: 1, width:"100%", backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                      <InputLabel id="demo-select-small-label" sx={{color:'#000000'}}>Day</InputLabel>
                      <Select
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        value={day}
                        label="Day"
                        onChange={(e) => setDay(e.target.value)}
                      >
                        {daysList && daysList.map((each:any) => 
                          <MenuItem value={each}>{each}</MenuItem>
                        )}
                      </Select>
                    </FormControl>

                  </Box>
                  
                  <FormControl sx={{ m: 1, width:"100%", backgroundColor:'#ffffff', borderRadius:'5px' }}>
                    <FormLabel id="demo-radio-buttons-group-label"  sx={{color:'#000000'}}>Optional Holiday</FormLabel>
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

                  <FormControl sx={{ m: 1, width:"100%", backgroundColor:'#ffffff', borderRadius:'5px' }}>
                    <FormLabel id="demo-radio-buttons-group-label"  sx={{color:'#000000'}}>Restricted</FormLabel>
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
            <Box sx={{display:'flex', padding:'20px', borderTop:'1px solid #6F6F6F',justifyContent:'space-between', alignItems:'center', mt:6}}>
              <Button variant='outlined' color="error" onClick={() => {setOpenModal(false); setModalType(''); setHoliday({}); setCompany(''); setAssociateCompany(''); setLocation(''); setYear(''); setMonth(''); setDay(''); setName(''); setRestrictedHoliday(true); setOptionalHoliday(true);}}>Cancel</Button>
              <Button variant='contained' disabled={addButtonDisable} onClick={onClickSubmitAdd}>Submit</Button>
            </Box>
            }
          </>

          {/* View Modal */}
          <>
            {modalType === "View" && 
              <Box sx={{ width: '100%', padding:'20px'}}>
                  <Typography variant='h5' color='#0F67B1' sx={{fontSize:'22px'}}>Holiday Name</Typography>
                  <Typography color="#000000" sx={{fontSize:'20px'}} >{holiday.name}</Typography>
                  
                  <Typography variant='h5' color='#0F105E' sx={{fontSize:'24px', mt:2}}>State</Typography>
                  <Typography color="#000000" sx={{fontSize:'22px'}}>{holiday.state.name}</Typography>

                  <Typography variant='h5' color='#0F105E' sx={{fontSize:'24px', mt:2}}>Date</Typography>
                  <Typography color="#000000" sx={{fontSize:'22px'}}>{`${holiday.day}-${holiday.month > 9 ? holiday.month : '0'+ holiday.month}-${holiday.year}`}</Typography>

                  <Typography variant='h5' color='#0F105E' sx={{fontSize:'24px', mt:2}}>Year</Typography>
                  <Typography color="#000000" sx={{fontSize:'22px'}}>{holiday.year}</Typography>

                  <Typography variant='h5' color='#0F105E' sx={{fontSize:'24px', mt:2}}>Restricted</Typography>
                  <Typography color="#000000" sx={{fontSize:'22px'}}>{holiday.restricted ? "Yes": "No"}</Typography>
              </Box>
            }
            {modalType === 'View' && 
              <Box sx={{display:'flex', padding:'20px', borderTop:'1px solid #6F6F6F',justifyContent:'flex-end', alignItems:'center', mt:15}}>
                <Button variant='contained' onClick={() => {setOpenModal(false); setModalType('');  setHoliday({})}}>Cancel</Button>
              </Box>
            }
          </>

          {/*Edit Modal */}
          <>
            {modalType === 'Edit' && 
            <Box sx={{ width: 400, padding:'20px'}}>
                  <FormControl sx={{ m: 1, width:"100%", backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                    <FormLabel id="demo-radio-buttons-group-label"  sx={{color:'#000000'}}>Name</FormLabel>
                    {/* <InputLabel htmlFor="outlined-adornment-name" sx={{color:'#000000'}}>Name</InputLabel> */}
                    <OutlinedInput
                      placeholder='Name'
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      id="outlined-adornment-name"
                      type='text'
                      label="Name"
                    />
                  </FormControl>

                  <FormControl sx={{ m: 1, width:"100%", backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                    <InputLabel id="demo-select-small-label" sx={{color:'#000000'}}>Company</InputLabel>
                    <Select
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      value={company}
                      label="Company"
                      onChange={(e) => {setCompany(e.target.value), setAssociateCompany(''), setLocation('')}}
                    >
                      {companies && companies.map((each:any) => {
                          return <MenuItem value={each.id}>{each.name}</MenuItem>
                      })}
                    </Select>
                  </FormControl>

                  <FormControl disabled={!company} sx={{ m: 1, width:"100%", backgroundColor:'#ffffff', borderRadius:'5px' }} size="small">
                    <InputLabel id="demo-select-small-label" sx={{color:'#000000'}}>Associate Company</InputLabel>
                    <Select
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      value={associateCompany}
                      label="Associate Company"
                      disabled={!company}
                      onChange={(e) => setAssociateCompany(e.target.value)}
                    >
                      {associateCompanies && associateCompanies.map((each:any) => {
                          return <MenuItem value={each.id}>{each.name}</MenuItem>
                      })}
                    </Select>
                  </FormControl>

                  <FormControl disabled={!associateCompany} sx={{ m: 1, width:"100%", backgroundColor:'#ffffff', borderRadius:'5px' }} size="small">
                    <InputLabel id="demo-select-small-label" sx={{color:'#000000'}}>Locations</InputLabel>
                    <Select
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      value={location}
                      label="Locations"
                      disabled={!associateCompany}
                      onChange={(e) => setLocation(e.target.value)}
                    >
                      {locations && locations.map((each:any) => {
                          const { id, name, code, cities }: any = each.location || {};
                          const { state } = cities || {};
                          return <MenuItem value={each.locationId+'^'+state.id}>{`${name} (${state.code}-${cities.code}-${code})`}</MenuItem>
                      })}
                    </Select>
                  </FormControl>

                  <Box sx={{display:'flex'}}>
                    <FormControl sx={{ m: 1, width:"100%", backgroundColor:'#ffffff', borderRadius:'5px' }} size="small">
                      <InputLabel id="demo-select-small-label" sx={{color:'#000000'}}>Year</InputLabel>
                      <Select
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        value={year}
                        label="Year"
                        onChange={(e) => setYear(e.target.value)}
                      >
                        {yearsList && yearsList.map((each:any) => 
                          <MenuItem value={each}>{each}</MenuItem>
                        )}
                      </Select>
                    </FormControl>

                    <FormControl sx={{ m: 1, width:"100%", backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                      <InputLabel id="demo-select-small-label" sx={{color:'#000000'}}>Month</InputLabel>
                      <Select
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        value={month}
                        label="Month"
                        onChange={(e) => setMonth(e.target.value)}
                      >
                        {monthList && monthList.map((each:any) => 
                          <MenuItem value={each}>{each}</MenuItem>
                        )}
                      </Select>
                    </FormControl>

                    <FormControl sx={{ m: 1, width:"100%", backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                      <InputLabel id="demo-select-small-label" sx={{color:'#000000'}}>Day</InputLabel>
                      <Select
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        value={day}
                        label="Day"
                        onChange={(e) => setDay(e.target.value)}
                      >
                        {daysList && daysList.map((each:any) => 
                          <MenuItem value={each}>{each}</MenuItem>
                        )}
                      </Select>
                    </FormControl>

                  </Box>
                  
                  <FormControl sx={{ m: 1, width:"100%", backgroundColor:'#ffffff', borderRadius:'5px' }}>
                    <FormLabel id="demo-radio-buttons-group-label"  sx={{color:'#000000'}}>Optional Holiday</FormLabel>
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

                  <FormControl sx={{ m: 1, width:"100%", backgroundColor:'#ffffff', borderRadius:'5px' }}>
                    <FormLabel id="demo-radio-buttons-group-label"  sx={{color:'#000000'}}>Restricted</FormLabel>
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
            <Box sx={{display:'flex', padding:'20px', borderTop:'1px solid #6F6F6F',justifyContent:'space-between', alignItems:'center', mt:6}}>
              <Button variant='outlined' color="error" onClick={() => {setOpenModal(false); setModalType(''); setHoliday({}); setCompany(''); setAssociateCompany(''); setLocation(''); setYear(''); setMonth(''); setDay(''); setName(''); setRestrictedHoliday(true); setOptionalHoliday(true);}}>Cancel</Button>
              <Button variant='contained' disabled={addButtonDisable} onClick={onClickSubmitEdit}>Submit</Button>
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
          <Box sx={{backgroundColor:'#E2E3F8', padding:'10px', px:'20px', borderRadius:'6px', boxShadow: '0px 6px 10px #CDD2D9', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <Typography sx={{font: 'normal normal normal 32px/40px Calibri'}}>Delete Holiday List</Typography>
            <IconButton
              onClick={() => setOpenDeleteModal(false)}
            >
              <IoMdClose />
            </IconButton>
          </Box>
          <Box sx={{padding:'20px', backgroundColor:'#ffffff'}}>
            <Box sx={{display:'flex', alignItems:'center'}}>
              <Typography >Are you sure you want to delete the Holiday, &nbsp;</Typography>
              <Typography variant='h5'>{holiday && holiday.name}</Typography>
            </Box>
            <Box sx={{display:'flex', justifyContent:'space-between', alignItems:'center', mt:2}}>
              <Button variant='outlined' color="error" onClick={() => setOpenDeleteModal(false)}>No</Button>
              <Button variant='contained' onClick={onClickConfirmDelete}>Yes</Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      {/* Upload Modal */}
      <Modal
        open={openUploadModal}
        onClose={() => setOpenUploadModal(false)}
      >
        <Box sx={styleUploadModal}>
          <Box sx={{backgroundColor:'#E2E3F8', padding:'10px', px:'20px', borderRadius:'6px', boxShadow: '0px 6px 10px #CDD2D9', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <Typography sx={{font: 'normal normal normal 32px/40px Calibri'}}>Upload Holiday List</Typography>
            <IconButton
              onClick={() => {setOpenUploadModal(false); setUploadError(false)}}
            >
              <IoMdClose />
            </IconButton>
          </Box>

          {uploadError &&
            <Alert variant="danger" className="mx-4 my-4">
              There are few errors identified in the file uploaded. Correct the errors and upload again. <a href="/" onClick={downloadErrors}>Click here</a> to download the errors.
            </Alert>
          }
          <Box sx={{padding:'20px', backgroundColor:'#ffffff', display:'flex', justifyContent:'center'}}>
            <Box sx={{display:'flex', flexDirection:'column'}}>
                <Typography mb={1} color={'#0F67B1'} fontWeight={'bold'} sx={{font: 'normal normal normal 24px/28px Calibri'}}>Upload File <span style={{color:'red'}}>*</span></Typography>
                <input
                  style={{ border:'1px solid #0F67B1', width:'500px', height:'40px', borderRadius:'5px'}}
                  type="file"
                  onChange={(e) => setUploadData(e.target.files)}
                />
                <a href="/" style={{marginTop: '10px', width:'210px'}} onClick={downloadSample}>Dowload Sample Holiday</a>
            </Box>
          </Box>

          <Box sx={{display:'flex', justifyContent:'center', alignItems:'center', mt:5}}>
            <Button variant='contained' onClick={onClickSubmitUpload}>Submit</Button>
          </Box>

          <Box sx={{display:'flex', padding:'20px', borderTop:'1px solid #6F6F6F',justifyContent:'flex-end', alignItems:'center', mt:4}}>
                <Button variant='contained' sx={{backgroundColor:'#707070'}} onClick={() => {setOpenUploadModal(false); setUploadError(false)}}>Cancel</Button>
          </Box>
        </Box>
      </Modal>

      {loading ? <PageLoader>Loading...</PageLoader> : 
      
        <div>
             <Box sx={{paddingX: '20px', paddingY:'10px',}}>
                <div style={{backgroundColor:'#E2E3F8', padding:'20px', borderRadius:'6px', boxShadow: '0px 6px 10px #CDD2D9'}}>
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px', marginTop:'10px'}}>
                        <h5 style={{ font: 'normal normal normal 32px/40px Calibri' }}>Leave Configuration</h5>
                        <div style={{marginRight:'12px', display:'flex', alignItems:'center', width:'280px', justifyContent: 'space-between'}}>
                          <Button onClick={onClickUpload} variant='contained' style={{backgroundColor:'#E9704B', display:'flex', alignItems:'center'}}> <FaUpload /> &nbsp; Upload</Button>
                          <Button onClick={onClickAdd} variant='contained' style={{backgroundColor:'#0654AD', display:'flex', alignItems:'center'}}> <IoMdAdd /> &nbsp; Add</Button>
                          <button onClick={onClickExport} disabled={!holidays} style={{display:'flex', justifyContent:'center', alignItems:'center', backgroundColor: !holidays ? '#707070': '#ffffff' , color: !holidays ? '#ffffff': '#000000', border:'1px solid #000000', width:'40px', height:'30px', borderRadius:'8px'}}> <FaDownload /> </button>
                        </div>
                    </div>
                    <div style={{display:'flex'}}>

                      <Box sx={{ mr:1}}>
                        <Typography mb={1}>Company</Typography>
                        <FormControl sx={{ width:"220px", backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                          <Select
                            sx={{'.MuiOutlinedInput-notchedOutline': { border: 0 }}}
                            value={company}
                            displayEmpty
                            onChange={handleChangeCompany}
                          >
                            <MenuItem disabled sx={{display:'none'}} value="">
                              Select Company
                            </MenuItem>
                            {companies && companies.map((each:any) => {
                                return <MenuItem value={each.id}>{each.name}</MenuItem>
                            })}
                          </Select>
                        </FormControl>
                      </Box>

                      <Box sx={{ mr:1}}>
                        <Typography mb={1}>Associate Company</Typography>
                        <FormControl sx={{ width:"220px", backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                          <Select
                            sx={{'.MuiOutlinedInput-notchedOutline': { border: 0 }}}
                            displayEmpty
                            value={associateCompany}
                            disabled={!company}
                            onChange={handleChangeAssociateCompany}
                          >
                            <MenuItem disabled sx={{display:'none'}} value="">
                              Select Associate Company
                            </MenuItem>
                            {associateCompanies && associateCompanies.map((each:any) => {
                              return <MenuItem value={each.id}>{each.name}</MenuItem>
                            })}
                          </Select>
                        </FormControl>
                      </Box>

                      <Box sx={{ mr:1}}>
                        <Typography mb={1}>Employee Type</Typography>
                        <FormControl sx={{ width:"220px", backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                          <Select
                            sx={{'.MuiOutlinedInput-notchedOutline': { border: 0 }}}
                            displayEmpty
                            value={location}
                            disabled={!associateCompany}
                            onChange={handleChangeLocation}
                          >
                            <MenuItem disabled sx={{display:'none'}} value="">
                              Select Location
                            </MenuItem>
                            {locations && locations.map((each:any) => {
                              const { id, name, code, cities }: any = each.location || {};
                              const { state } = cities || {};
                              return <MenuItem value={each.locationId}>{`${name} (${state.code}-${cities.code}-${code})`}</MenuItem>
                            })}
                          </Select>
                        </FormControl>
                      </Box>

                      <Box sx={{ mr:1}}>
                        <Typography mb={1}>Search</Typography>
                        <FormControl sx={{ width:"220px", backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                          <InputLabel htmlFor="outlined-adornment-search">Search</InputLabel>
                          <OutlinedInput
                            value={searchInput}
                            onChange={handleChangeSearchInput}
                            sx={{'.MuiOutlinedInput-notchedOutline': { border: 0 }}}
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

            <Box sx={{paddingX: '20px'}}>
              {
                leaves && leaves.length <= 0 ? 

                <Box sx={{height:'60vh', display:'flex', justifyContent:'center', alignItems:'center'}}>
                  <Typography variant='h5'>No Records Found</Typography>
                </Box>
                : 
                <>
                  <TableContainer sx={{border:'1px solid #e6e6e6', marginTop:'10px', height:'385px', overflowY:'scroll'}}>
                          <Table stickyHeader  sx={{ minWidth: 650 }} aria-label="sticky table">
                              <TableHead sx={{'.MuiTableCell-root':{ backgroundColor:'#E7EEF7'}}}>
                                  <TableRow>
                                      <TableCell > <TableSortLabel active={activeSort === 'ezycompLeave'} direction={sortType} onClick={onClickSortEzycompLeave}> Ezycomp Leave</TableSortLabel></TableCell>
                                      <TableCell > <TableSortLabel active={activeSort === 'leaveType'} direction={sortType} onClick={onClickSortDate}> Leave Type</TableSortLabel></TableCell>
                                      <TableCell > <TableSortLabel active={activeSort === 'creditFrequency'} direction={sortType} onClick={onClickSortName}> Frequency</TableSortLabel></TableCell>
                                      <TableCell > <TableSortLabel active={activeSort === 'totalLeaves'} direction={sortType} onClick={onClickSortState}> Total Leaves</TableSortLabel></TableCell>
                                      <TableCell > <TableSortLabel active={activeSort === 'employeeType'} direction={sortType} onClick={onClickSortRestricted}> Employee Type</TableSortLabel></TableCell>
                                      <TableCell > Actions</TableCell>
                                  </TableRow>
                              </TableHead>

                              <TableBody>

                              {leaves && leaves.map((each: any, index: number) => (
                                  <TableRow
                                  key={each._id}
                                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                  >   
                                      <TableCell >{each.ezycompLeave}</TableCell>
                                      <TableCell >{each.leaveType}</TableCell>
                                      <TableCell >{each.creditFrequency}</TableCell>
                                      <TableCell >{each.totalLeaves}</TableCell>
                                      <TableCell >{each.employeeType}</TableCell>
                                      <TableCell >
                                        <Box sx={{display:'flex', justifyContent:'space-between', width:'100px'}}>
                                          <Icon action={() => onclickEdit(each)} style={{color:'#039BE5'}} type="button" name={'pencil'} text={'Edit'}/>
                                          <Icon action={() => onclickDelete(each)} style={{color:'#EB1010'}} type="button" name={'trash'} text={'Delete'}/>
                                          <Icon action={() => onclickView(each)}  style={{color:'#00C853'}} type="button" name={'eye'} text={'View'}/>
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
                          display:'flex',
                          justifyContent:'flex-end'
                        },
                        '.MuiTablePagination-displayedRows':{
                          margin:'0',
                        },
                        '.MuiTablePagination-selectLabel':{
                          margin:'0',
                        },
                        '.MuiTablePagination-spacer':{
                          display:'none '
                        },
                        '.MuiTablePagination-input':{
                          marginRight:'auto'
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

export default LeaveConfiguration