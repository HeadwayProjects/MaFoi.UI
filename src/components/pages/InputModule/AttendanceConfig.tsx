import React, { useEffect, useState } from 'react'
import PageLoader from '../../shared/PageLoader'
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import { getAllCompaniesDetails, getAssociateCompanies, getLocations } from '../../../redux/features/inputModule.slice';
import { Box, Button, Drawer, FormControl, FormControlLabel, FormLabel, IconButton, InputAdornment, InputLabel, MenuItem, Modal, OutlinedInput, Radio, RadioGroup, Select as MSelect, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, TextField, Typography } from '@mui/material';
import { FaUpload, FaDownload } from "react-icons/fa";
import { IoMdAdd, IoMdClose, IoMdSearch } from "react-icons/io";
import { DEFAULT_OPTIONS_PAYLOAD, DEFAULT_PAYLOAD } from '../../common/Table';
import { addHoliday, deleteHoliday, editHoliday, getHolidaysList, resetAddHolidayDetails, resetDeleteHolidayDetails, resetEditHolidayDetails,  } from '../../../redux/features/holidayList.slice';
import Icon from '../../common/Icon';
import { useExportAttendanceConfig, } from '../../../backend/exports';
import { download, downloadFileContent, preventDefault } from '../../../utils/common';
import { ERROR_MESSAGES } from '../../../utils/constants';
import { toast } from 'react-toastify';
import { Alert } from 'react-bootstrap';
import { deleteAttendance, getAttendanceConfiguration, resetDeleteAttendanceDetails, resetUploadAttendanceDetails, uploadAttendance } from '../../../redux/features/attendanceConfiguration.slice';
import  Select from "react-select";


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

const customStyles = {
  control: (base:any) => ({
    ...base,
    maxHeight: 150,
    overflow:"auto"
  })
};

const AttendanceConfig = () => {

  const dispatch = useAppDispatch();

  const attendanceConfigurationDetails = useAppSelector((state) => state.attendanceConfiguration.attendanceConfigurationDetails)
  const uploadAttendanceDetails = useAppSelector((state) => state.attendanceConfiguration.uploadAttendanceDetails)
  const deleteAttendanceDetails = useAppSelector((state) => state.attendanceConfiguration.deleteAttendanceDetails)
  const addHolidayDetails = useAppSelector((state) => state.holidayList.addHolidayDetails)
  const editHolidayDetails = useAppSelector((state) => state.holidayList.editHolidayDetails)

  const companiesDetails = useAppSelector((state) => state.inputModule.companiesDetails);
  const associateCompaniesDetails = useAppSelector((state) => state.inputModule.associateCompaniesDetails);
  const locationsDetails = useAppSelector((state) => state.inputModule.locationsDetails);

  const { exportAttendanceConfig, exporting } = useExportAttendanceConfig((response: any) => {
    downloadFileContent({
        name: 'Attendance.xlsx',
        type: response.headers['content-type'],
        content: response.data
    });
  }, () => {
      toast.error(ERROR_MESSAGES.DEFAULT);
  });

  const attendance = attendanceConfigurationDetails && attendanceConfigurationDetails.data.list
  const attendanceCount = attendanceConfigurationDetails && attendanceConfigurationDetails.data.count

  const companies = companiesDetails && companiesDetails.data.list
  const associateCompanies = associateCompaniesDetails && associateCompaniesDetails.data.list
  const locations = locationsDetails && locationsDetails.data.list

  const loading = exporting || editHolidayDetails.status === 'loading' || uploadAttendanceDetails.status === 'loading' || addHolidayDetails.status === 'loading' || deleteAttendanceDetails.status === 'loading' || attendanceConfigurationDetails.status === 'loading' || companiesDetails.status === 'loading' || associateCompaniesDetails.status === 'loading' || locationsDetails.status === 'loading'

  const [company, setCompany] = React.useState('');
  const [associateCompany, setAssociateCompany] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [year, setYear] = React.useState('');
  const [month, setMonth] =  React.useState('');
  const [day, setDay] = React.useState('');
  const [shiftName, setShiftName] = React.useState('')
  const [sessionOneStartTime, setSessionOneStartTime] = React.useState('')
  const [sessionOneEndTime, setSessionOneEndTime] = React.useState('')
  const [sessionTwoStartTime, setSessionTwoStartTime] = React.useState('')
  const [sessionTwoEndTime, setSessionTwoEndTime] = React.useState('')
  const [workDays, setWorkDays] = React.useState('')
  const [weekDays, setWeekDays] = React.useState('')

  const [searchInput, setSearchInput] = React.useState('');
  const [activeSort, setActiveSort] = React.useState('companyId')
  const [sortType, setSortType] = React.useState<any>('asc')

  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [page, setPage] = React.useState(0);

  const [holiday, setHoliday] = React.useState<any>({});
  const [attendanceDetails, setAtttendanceDetails] = React.useState<any>({});
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
    setCompany(event.target.value);
    const attendancePayload: any =  { 
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
      sort: { columnName: 'companyId', order: 'asc' },
      "includeCentral": true
    }
    dispatch(getAttendanceConfiguration(attendancePayload))
  };

  const handleChangeAssociateCompany = (event:any) => {
    setLocation('')
    setAssociateCompany(event.target.value);
    const attendancePayload: any =  { 
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
      sort: { columnName: 'companyId', order: 'asc' },
      "includeCentral": true
    }
    dispatch(getAttendanceConfiguration(attendancePayload))
  };

  const handleChangeLocation = (event:any) => {
    setLocation(event.target.value);
    const attendancePayload: any =  { 
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
      sort: { columnName: 'companyId', order: 'asc' },
      "includeCentral": true
    }
    dispatch(getAttendanceConfiguration(attendancePayload))
  };
  
  const handleChangeSearchInput = (event:any) => {
    setSearchInput(event.target.value)
  }

  const handleChangeWeekDays = (arr:any) => {
    setWeekDays(arr)
  };

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
    const attendanceConfigurationDefaultPayload: any =  { 
      search: "",
      filters: [],
      pagination: {
        pageSize: 10,
        pageNumber: 1
      },
      sort: { columnName: 'companyId', order: 'asc' },
      "includeCentral": true
    }

    const companiesPayload: any = { ...DEFAULT_OPTIONS_PAYLOAD, filters: [{ columnName: 'isParent', value: 'true' }] }
    dispatch(getAttendanceConfiguration(attendanceConfigurationDefaultPayload))
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
    if(attendanceConfigurationDetails.status === 'succeeded'){

    }else if(attendanceConfigurationDetails.status === 'failed'){
      toast.error(ERROR_MESSAGES.DEFAULT);
    }
  },[attendanceConfigurationDetails.status])

  useEffect(() => {
    if(deleteAttendanceDetails.status === 'succeeded'){
      toast.success(`Attendance deleted successfully.`)
      setAtttendanceDetails({})
      dispatch(resetDeleteAttendanceDetails())
      setOpenDeleteModal(false)
      const attendancePayload: any =  { 
        search: "",
        filters: [],
        pagination: {
          pageSize: 10,
          pageNumber: 1
        },
        sort: { columnName: 'companyId', order: 'asc' },
        "includeCentral": true
      }
      dispatch(getAttendanceConfiguration(attendancePayload))
    }else if(deleteAttendanceDetails.status === 'failed'){
      toast.error(ERROR_MESSAGES.DEFAULT);
    }
  }, [deleteAttendanceDetails.status])

  useEffect(() => {
    if(addHolidayDetails.status === 'succeeded'){
      toast.success(`Holiday Added successfully.`)
      dispatch(resetAddHolidayDetails())
      setOpenModal(false); setModalType(''); setAtttendanceDetails({}); setCompany(''); setAssociateCompany(''); setLocation(''); setYear(''); setMonth(''); setDay(''); setShiftName(''); setRestrictedHoliday(true); setOptionalHoliday(true); 
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
      setOpenModal(false); setModalType(''); setAtttendanceDetails({}); setCompany(''); setAssociateCompany(''); setLocation(''); setYear(''); setMonth(''); setDay(''); setShiftName(''); setRestrictedHoliday(true); setOptionalHoliday(true); 
      toast.error(ERROR_MESSAGES.DEFAULT);
    }
  }, [addHolidayDetails.status])

  useEffect(() => {
    if(uploadAttendanceDetails.status === 'succeeded'){
      if(uploadAttendanceDetails.data.size === 0){
        toast.success(`Attendance List Uploaded successfully.`)
        dispatch(resetUploadAttendanceDetails())
        setOpenUploadModal(false)
        setUploadError(false)
        const attendancePayload: any =  { 
          search: "",
          filters: [],
          pagination: {
            pageSize: 10,
            pageNumber: 1
          },
          sort: { columnName: 'companyId', order: 'asc' },
          "includeCentral": true
        }
        dispatch(getAttendanceConfiguration(attendancePayload))
      }else{
        setUploadError(true)
      }
    }else if(uploadAttendanceDetails.status === 'failed'){
      toast.error(ERROR_MESSAGES.DEFAULT);
    }
  }, [uploadAttendanceDetails])

  useEffect(() => {
    if(editHolidayDetails.status === 'succeeded'){
      toast.success(`Holiday Updated successfully.`)
      dispatch(resetEditHolidayDetails())
      setOpenModal(false); setModalType(''); setAtttendanceDetails({}); setCompany(''); setAssociateCompany(''); setLocation(''); setYear(''); setMonth(''); setDay(''); setShiftName(''); setRestrictedHoliday(true); setOptionalHoliday(true); 
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
      setOpenModal(false); setModalType(''); setAtttendanceDetails({}); setCompany(''); setAssociateCompany(''); setLocation(''); setYear(''); setMonth(''); setDay(''); setShiftName(''); setRestrictedHoliday(true); setOptionalHoliday(true); 
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

  const values = [{ label: "Select All", value: "all" }, {label: 'Monday', value: 'Monday'}, {label: 'Tuesday', value: 'Tuesday'}, {label: 'Wednesday', value: 'Wednesday'}, {label: 'Thursday', value: 'Thursday'}, {label: 'Friday', value: 'Friday'},{label: 'Saturday', value: 'Saturday'},{label: 'Sunday', value: 'Sunday'}]
 
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

    const attendancePayload: any =  { 
      search: searchInput, 
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page+1
      },
      sort: { columnName: activeSort, order: sortType },
      "includeCentral": true
    }
    exportAttendanceConfig({ ...attendancePayload, pagination: null });
  }

  const onClickSearch = () => {
    const attendancePayload: any =  { 
      search: searchInput, 
      filters: [],
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page+1
      },
      sort: { columnName: 'companyId', order: 'asc' },
      "includeCentral": true
    }
    dispatch(getAttendanceConfiguration(attendancePayload))
  }

  const onClickClearSearch = () => {
    const attendancePayload: any =  { 
      search: '', 
      filters: [],
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page+1
      },
      sort: { columnName: 'companyId', order: 'asc' },
      "includeCentral": true
    }
    dispatch(getAttendanceConfiguration(attendancePayload))
    setSearchInput('')
  }


  const onClickSortcompany = () => {
    let type = 'asc'
    setActiveSort('companyId'); 
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

    const attendanceConfigurationDefaultPayload: any =  { 
      search: "",
      filters: [],
      pagination: {
        pageSize: 10,
        pageNumber: 1
      },
      sort: { columnName: 'companyId', order: type },
      "includeCentral": true
    }
    dispatch(getAttendanceConfiguration(attendanceConfigurationDefaultPayload))
    
  }

  const onClickSortAssociateCompany = () => {
    let type = 'asc'
    setActiveSort('associateCompanyId'); 
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

    const attendancePayload: any =  { 
      search: searchInput, 
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page+1
      },
      sort: { columnName: 'associateCompanyId', order: type },
      "includeCentral": true
    }
    dispatch(getAttendanceConfiguration(attendancePayload)) 
  }

  const onClickSortlocation = () => {
    let type = 'asc'
    setActiveSort('locationId'); 
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

    const attendancePayload: any =  { 
      search: searchInput, 
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page+1
      },
      sort: { columnName: 'locationId', order: type },
      "includeCentral": true
    }
    dispatch(getAttendanceConfiguration(attendancePayload))
    
  }
  
  const onClickSortShiftName = () => {
    let type = 'asc'
    setActiveSort('shiftName'); 
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

    const attendancePayload: any =  { 
      search: searchInput, 
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page+1
      },
      sort: { columnName: 'shiftName', order: type },
      "includeCentral": true
    }
    dispatch(getAttendanceConfiguration(attendancePayload))
    
  }
  
  const onClickSortSession = () => {
    let type = 'asc'
    setActiveSort('session1StartTime'); 
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

    const attendancePayload: any =  { 
      search: searchInput, 
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page+1
      },
      sort: { columnName: 'session1StartTime', order: type },
      "includeCentral": true
    }
    dispatch(getAttendanceConfiguration(attendancePayload))
    
  }
  
  const onClickSortSession2 = () => {
    let type = 'asc'
    setActiveSort('session2StartTime'); 
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

    const attendancePayload: any =  { 
      search: searchInput, 
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page+1
      },
      sort: { columnName: 'session2StartTime', order: type },
      "includeCentral": true
    }
    dispatch(getAttendanceConfiguration(attendancePayload))
    
  }

  const onClickSortWorkDays = () => {
    let type = 'asc'
    setActiveSort('workDaysPerWeek'); 
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

    const attendancePayload: any =  { 
      search: searchInput, 
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page+1
      },
      sort: { columnName: 'workDaysPerWeek', order: type },
      "includeCentral": true
    }
    dispatch(getAttendanceConfiguration(attendancePayload))
    
  }

  const onClickUpload = () => {
    setOpenUploadModal(true)
  }

  const onClickSubmitUpload = () => {
    const formData = new FormData();
    formData.append('file', uploadData[0]);
    dispatch(uploadAttendance(formData))
  }

  const addButtonDisable = !shiftName || !company || !associateCompany || !location || !year || !month || !day 

  const onClickAdd = () => {
    setOpenModal(true)
    setModalType('Add')
    setCompany('')
    setAssociateCompany('')
    setLocation('')
  }

  const onClickSubmitAdd = () => {

    const payload = {
      shiftName,
      optionalHoliday,
      companyId: company,
      associateCompanyId: associateCompany,
      locationId: location.split('^')[0],
      stateId: location.split('^')[1],
      year,
      day,
      restricted:restrictedHoliday,
      remarks: ''
    }
    dispatch(addHoliday(payload))
  }

  const onclickEdit = (attendanceDetails:any) => {
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
    setShiftName(holiday.name)
    setCompany(holiday.company.id)
    setAssociateCompany(holiday.associateCompany.id)
    setLocation(holiday.location.id+'^'+holiday.stateId)
    setYear(holiday.year)
    setMonth(monthKey)
    setDay(holiday.day)
    setOptionalHoliday(holiday.optionalHoliday)
    setRestrictedHoliday(holiday.restricted)
    setAtttendanceDetails(holiday)
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

  const onclickView = (attendanceDetails:any) => {
    setOpenModal(true)
    setModalType('View')
    setAtttendanceDetails(attendanceDetails)
  }

  const onclickDelete = (attendanceDetails:any) => {
    setAtttendanceDetails(attendanceDetails)
    setOpenDeleteModal(true)
  }
 
  const onClickConfirmDelete = () => {
    dispatch(deleteAttendance(attendanceDetails.id))
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    const attendancePayload: any =  { 
      search: '', 
      filters: [],
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: newPage+1
      },
      sort: { columnName: 'companyId', order: 'asc' },
      "includeCentral": true
    }

    dispatch(getAttendanceConfiguration(attendancePayload))
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const attendancePayload: any =  { 
      search: '', 
      filters: [],
      pagination: {
        pageSize: parseInt(event.target.value, 10),
        pageNumber: 1
      },
      sort: { columnName: 'companyId', order: 'asc' },
      "includeCentral": true
    }

    dispatch(getAttendanceConfiguration(attendancePayload))
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const downloadSample = (e: any) => {
    preventDefault(e);
    download('Sample Attendance.xlsx', 'https://mafoi.s3.ap-south-1.amazonaws.com/bulkuploadtemplates/ActsTemplate.xlsx')
  }

  const downloadErrors = (e: any) => {
    preventDefault(e);
    const data = uploadAttendanceDetails.data;
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

  console.log('weeokdays', weekDays)
  return (
    <div style={{ height:'100vh', backgroundColor:'#ffffff'}}>

      {/*Add Edit and View Modals */}
      <Drawer anchor='right' open={openModal}>
        <Box  sx={{height:'100%',width: 500, display:'flex', flexDirection:'column'}}>
          <Box sx={{backgroundColor:'#E2E3F8', padding:'10px', px:'20px', borderRadius:'6px', boxShadow: '0px 6px 10px #CDD2D9', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <Typography sx={{font: 'normal normal normal 32px/40px Calibri'}}>{modalType} Attendance</Typography>
            <IconButton
              onClick={() => {setOpenModal(false); setModalType(''); setAtttendanceDetails({}); setCompany(''); setAssociateCompany(''); setLocation(''); setYear(''); setMonth(''); setDay(''); setShiftName(''); setRestrictedHoliday(true); setOptionalHoliday(true); }}
            >
              <IoMdClose />
            </IconButton>
          </Box>

          {/*Add Modal */}
          <>
            {modalType === 'Add' && 
            <Box sx={{ width: 400, padding:'20px'}}>
                 

                  <FormControl sx={{ m: 1, width:"100%", backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                    <InputLabel id="demo-select-small-label" sx={{color:'#000000'}}>Company</InputLabel>
                    <MSelect
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      value={company}
                      label="Company"
                      onChange={(e) => {setCompany(e.target.value), setAssociateCompany(''), setLocation('')}}
                    >
                      {companies && companies.map((each:any) => {
                          return <MenuItem value={each.id}>{each.name}</MenuItem>
                      })}
                    </MSelect>
                  </FormControl>

                  <FormControl disabled={!company} sx={{ m: 1, width:"100%", backgroundColor:'#ffffff', borderRadius:'5px' }} size="small">
                    <InputLabel id="demo-select-small-label" sx={{color:'#000000'}}>Associate Company</InputLabel>
                    <MSelect
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
                    </MSelect>
                  </FormControl>

                  <FormControl disabled={!associateCompany} sx={{ m: 1, width:"100%", backgroundColor:'#ffffff', borderRadius:'5px' }} size="small">
                    <InputLabel id="demo-select-small-label" sx={{color:'#000000'}}>Location</InputLabel>
                    <MSelect
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      value={location}
                      label="Location"
                      disabled={!associateCompany}
                      onChange={(e) => setLocation(e.target.value)}
                    >
                      {locations && locations.map((each:any) => {
                          const { id, name, code, cities }: any = each.location || {};
                          const { state } = cities || {};
                          return <MenuItem value={each.locationId+'^'+state.id}>{`${name} (${state.code}-${cities.code}-${code})`}</MenuItem>
                      })}
                    </MSelect>
                  </FormControl>

                  <FormControl sx={{ m: 1, width:"100%", backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                    <OutlinedInput
                      sx={{
                        '& input::placeholder':{
                          fontSize:'14px'
                        }
                      }}
                      placeholder='Shift Name'
                      value={shiftName}
                      onChange={(e) => setShiftName(e.target.value)}
                      id="outlined-adornment-name"
                      type='text'
                    />
                  </FormControl>

                  <Box sx={{display:'flex'}}>
                    <FormControl sx={{ m: 1, width:"100%", backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                      <FormLabel id="demo-radio-buttons-group-label"  sx={{color:'#000000'}}>Session 1 Start Time</FormLabel>
                      <OutlinedInput
                        placeholder='Start Time'
                        value={sessionOneStartTime}
                        onChange={(e) => setSessionOneStartTime(e.target.value)}
                        id="outlined-adornment-name"
                        type='text'
                      />
                    </FormControl>

                    <FormControl sx={{ m: 1, width:"100%", backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                      <FormLabel id="demo-radio-buttons-group-label"  sx={{color:'#000000'}}>Session 1 End Time</FormLabel>
                      <OutlinedInput
                        placeholder='End Time'
                        value={sessionOneEndTime}
                        onChange={(e) => setSessionOneEndTime(e.target.value)}
                        id="outlined-adornment-name"
                        type='text'
                      />
                    </FormControl>
                  </Box> 

                  <Box sx={{display:'flex'}}>
                    <FormControl sx={{ m: 1, width:"100%", backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                      <FormLabel id="demo-radio-buttons-group-label"  sx={{color:'#000000'}}>Session 2 Start Time</FormLabel>
                      <OutlinedInput
                        placeholder='Start Time'
                        value={sessionTwoStartTime}
                        onChange={(e) => setSessionTwoStartTime(e.target.value)}
                        id="outlined-adornment-name"
                        type='text'
                      />
                    </FormControl>

                    <FormControl sx={{ m: 1, width:"100%", backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                      <FormLabel id="demo-radio-buttons-group-label"  sx={{color:'#000000'}}>Session 2 End Time</FormLabel>
                      <OutlinedInput
                        placeholder='End Time'
                        value={sessionTwoEndTime}
                        onChange={(e) => setSessionTwoEndTime(e.target.value)}
                        id="outlined-adornment-name"
                        type='text'
                      />
                    </FormControl>
                  </Box> 
                  
                  <FormControl sx={{ m: 1, width:"100%", backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                    <FormLabel id="demo-radio-buttons-group-label"  sx={{color:'#000000'}}>Total Working Days Per Week</FormLabel>
                    <OutlinedInput
                      placeholder='Work days'
                      value={workDays}
                      onChange={(e) => setWorkDays(e.target.value)}
                      id="outlined-adornment-name"
                      type='text'
                    />
                  </FormControl>

                  <FormControl sx={{ m: 1, width:"100%", backgroundColor:'#ffffff', borderRadius:'5px' }}>
                    <FormLabel id="demo-radio-buttons-group-label"  sx={{color:'#000000'}}>Week Days</FormLabel>
                    <Select
                      options={values}
                      isClearable={true}
                      className="basic-multi-select"
                      classNamePrefix="Select"
                      placeholder='Week Days'
                      isMulti
                      value={weekDays}
                      closeMenuOnSelect={false}
                      onChange={(selected:any) => {
                          selected.length &&
                          selected.find((option:any) => option.value === "all")
                          ? handleChangeWeekDays(values.slice(1))
                          : !true
                          ? handleChangeWeekDays((selected && selected.value) || null)
                          : handleChangeWeekDays(selected);
                      }}
                      styles={customStyles}
                    />
                  </FormControl>
            </Box>
            }

            {modalType === 'Add' && 
            <Box sx={{display:'flex', padding:'20px', borderTop:'1px solid #6F6F6F',justifyContent:'space-between', alignItems:'center', mt:2}}>
              <Button variant='outlined' color="error" onClick={() => {setOpenModal(false); setModalType(''); setAtttendanceDetails({}); setCompany(''); setAssociateCompany(''); setLocation(''); setShiftName('')}}>Cancel</Button>
              <Button variant='contained' disabled={addButtonDisable} onClick={onClickSubmitAdd}>Submit</Button>
            </Box>
            }
          </>

          {/* View Modal */}
          <>
            {modalType === "View" && 
              <Box sx={{ width: '100%', padding:'20px'}}>
                  <Typography variant='h5' color='#0F67B1' sx={{fontSize:'22px'}}>Company</Typography>
                  <Typography color="#000000" sx={{fontSize:'20px'}} >{attendanceDetails.company.name}</Typography>
                  
                  <Typography variant='h5' color='#0F67B1' sx={{fontSize:'24px', mt:2}}>Associate Company</Typography>
                  <Typography color="#000000" sx={{fontSize:'22px'}}>{attendanceDetails.associateCompany.name}</Typography>

                  <Typography variant='h5' color='#0F67B1' sx={{fontSize:'24px', mt:2}}>Location</Typography>
                  <Typography color="#000000" sx={{fontSize:'22px'}}>{attendanceDetails.location.name}</Typography>

                  <Typography variant='h5' color='#0F67B1' sx={{fontSize:'24px', mt:2}}>ShiftName</Typography>
                  <Typography color="#000000" sx={{fontSize:'22px'}}>{attendanceDetails.shiftName}</Typography>

                  <Typography variant='h5' color='#0F67B1' sx={{fontSize:'24px', mt:2}}>Session</Typography>
                  <Typography color="#000000" sx={{fontSize:'22px'}}>{attendanceDetails.session1StartTime+ " - "+ attendanceDetails.session1EndTime}</Typography>

                  <Typography variant='h5' color='#0F67B1' sx={{fontSize:'24px', mt:2}}>Session 2</Typography>
                  <Typography color="#000000" sx={{fontSize:'22px'}}>{attendanceDetails.session2StartTime+ " - "+ attendanceDetails.session2EndTime}</Typography>

                  <Typography variant='h5' color='#0F67B1' sx={{fontSize:'24px', mt:2}}>Work Days Per Week</Typography>
                  <Typography color="#000000" sx={{fontSize:'22px'}}>{attendanceDetails.workDaysPerWeek}</Typography>
              </Box>
            }
            {modalType === 'View' && 
              <Box sx={{display:'flex', padding:'20px', borderTop:'1px solid #6F6F6F',justifyContent:'flex-end', alignItems:'center', mt:15}}>
                <Button variant='contained' onClick={() => {setOpenModal(false); setModalType('');  setAtttendanceDetails({})}}>Cancel</Button>
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
                      onChange={(e) => setShiftName(e.target.value)}
                      id="outlined-adornment-name"
                      type='text'
                      label="Name"
                    />
                  </FormControl>

                  <FormControl sx={{ m: 1, width:"100%", backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                    <InputLabel id="demo-select-small-label" sx={{color:'#000000'}}>Company</InputLabel>
                    <MSelect
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      value={company}
                      label="Company"
                      onChange={(e) => {setCompany(e.target.value), setAssociateCompany(''), setLocation('')}}
                    >
                      {companies && companies.map((each:any) => {
                          return <MenuItem value={each.id}>{each.name}</MenuItem>
                      })}
                    </MSelect>
                  </FormControl>

                  <FormControl disabled={!company} sx={{ m: 1, width:"100%", backgroundColor:'#ffffff', borderRadius:'5px' }} size="small">
                    <InputLabel id="demo-select-small-label" sx={{color:'#000000'}}>Associate Company</InputLabel>
                    <MSelect
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
                    </MSelect>
                  </FormControl>

                  <FormControl disabled={!associateCompany} sx={{ m: 1, width:"100%", backgroundColor:'#ffffff', borderRadius:'5px' }} size="small">
                    <InputLabel id="demo-select-small-label" sx={{color:'#000000'}}>Location</InputLabel>
                    <MSelect
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      value={location}
                      label="Location"
                      disabled={!associateCompany}
                      onChange={(e) => setLocation(e.target.value)}
                    >
                      {locations && locations.map((each:any) => {
                          const { id, name, code, cities }: any = each.location || {};
                          const { state } = cities || {};
                          return <MenuItem value={each.locationId+'^'+state.id}>{`${name} (${state.code}-${cities.code}-${code})`}</MenuItem>
                      })}
                    </MSelect>
                  </FormControl>

                  <Box sx={{display:'flex'}}>
                    <FormControl sx={{ m: 1, width:"100%", backgroundColor:'#ffffff', borderRadius:'5px' }} size="small">
                      <InputLabel id="demo-select-small-label" sx={{color:'#000000'}}>Year</InputLabel>
                      <MSelect
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        value={year}
                        label="Year"
                        onChange={(e) => setYear(e.target.value)}
                      >
                        {yearsList && yearsList.map((each:any) => 
                          <MenuItem value={each}>{each}</MenuItem>
                        )}
                      </MSelect>
                    </FormControl>

                    <FormControl sx={{ m: 1, width:"100%", backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                      <InputLabel id="demo-select-small-label" sx={{color:'#000000'}}>Month</InputLabel>
                      <MSelect
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        value={month}
                        label="Month"
                        onChange={(e) => setMonth(e.target.value)}
                      >
                        {monthList && monthList.map((each:any) => 
                          <MenuItem value={each}>{each}</MenuItem>
                        )}
                      </MSelect>
                    </FormControl>

                    <FormControl sx={{ m: 1, width:"100%", backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                      <InputLabel id="demo-select-small-label" sx={{color:'#000000'}}>Day</InputLabel>
                      <MSelect
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        value={day}
                        label="Day"
                        onChange={(e) => setDay(e.target.value)}
                      >
                        {daysList && daysList.map((each:any) => 
                          <MenuItem value={each}>{each}</MenuItem>
                        )}
                      </MSelect>
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
              <Button variant='outlined' color="error" onClick={() => {setOpenModal(false); setModalType(''); setAtttendanceDetails({}); setCompany(''); setAssociateCompany(''); setLocation(''); setYear(''); setMonth(''); setDay(''); setShiftName(''); setRestrictedHoliday(true); setOptionalHoliday(true);}}>Cancel</Button>
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
            <Typography sx={{font: 'normal normal normal 32px/40px Calibri'}}>Delete Attendance</Typography>
            <IconButton
              onClick={() => setOpenDeleteModal(false)}
            >
              <IoMdClose />
            </IconButton>
          </Box>
          <Box sx={{padding:'20px', backgroundColor:'#ffffff'}}>
            <Box sx={{display:'flex', alignItems:'center'}}>
              <Typography >Are you sure you want to delete the Attendance</Typography>
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
            <Typography sx={{font: 'normal normal normal 32px/40px Calibri'}}>Upload Attendance</Typography>
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
                  accept='.xlsx, .xls, .csv'
                  onChange={(e) => setUploadData(e.target.files)}
                />
                <a href="/" style={{marginTop: '10px', width:'210px'}} onClick={downloadSample}>Dowload Sample Attendance</a>
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
                        <h5 style={{ font: 'normal normal normal 32px/40px Calibri' }}>Attendance Configuration</h5>
                        <div style={{marginRight:'12px', display:'flex', alignItems:'center', width:'280px', justifyContent: 'space-between'}}>
                          <Button onClick={onClickUpload} variant='contained' style={{backgroundColor:'#E9704B', display:'flex', alignItems:'center'}}> <FaUpload /> &nbsp; Upload</Button>
                          <Button onClick={onClickAdd} variant='contained' style={{backgroundColor:'#0654AD', display:'flex', alignItems:'center'}}> <IoMdAdd /> &nbsp; Add</Button>
                          <button onClick={onClickExport} disabled={attendance && attendance <=0} style={{display:'flex', justifyContent:'center', alignItems:'center', backgroundColor: (attendance && attendance <=0) ? '#707070': '#ffffff' , color: !attendance ? '#ffffff': '#000000', border:'1px solid #000000', width:'40px', height:'30px', borderRadius:'8px'}}> <FaDownload /> </button>
                        </div>
                    </div>
                    <div style={{display:'flex'}}>

                      <Box sx={{ mr:1}}>
                        <Typography mb={1}>Company</Typography>
                        <FormControl sx={{ width:"220px", backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                          <MSelect
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
                          </MSelect>
                        </FormControl>
                      </Box>

                      <Box sx={{ mr:1}}>
                        <Typography mb={1}>Associate Company</Typography>
                        <FormControl sx={{ width:"220px", backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                          <MSelect
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
                          </MSelect>
                        </FormControl>
                      </Box>

                      <Box sx={{ mr:1}}>
                        <Typography mb={1}>Location</Typography>
                        <FormControl sx={{ width:"220px", backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                          <MSelect
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
                          </MSelect>
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
                attendance && attendance.length <= 0 ? 

                <Box sx={{height:'60vh', display:'flex', justifyContent:'center', alignItems:'center'}}>
                  <Typography variant='h5'>No Records Found</Typography>
                </Box>
                : 
                <>
                  <TableContainer sx={{border:'1px solid #e6e6e6', marginTop:'10px',  maxHeight:'385px', overflowY:'scroll'}}>
                          <Table stickyHeader  sx={{ minWidth: 650 }} aria-label="sticky table">
                              <TableHead sx={{'.MuiTableCell-root':{ backgroundColor:'#E7EEF7'}}}>
                                  <TableRow>
                                      <TableCell > <TableSortLabel active={activeSort === 'companyId'} direction={sortType} onClick={onClickSortcompany}> Company</TableSortLabel></TableCell>
                                      <TableCell > <TableSortLabel active={activeSort === 'associateCompanyId'} direction={sortType} onClick={onClickSortAssociateCompany}> Associate Company</TableSortLabel></TableCell>
                                      <TableCell > <TableSortLabel active={activeSort === 'locationId'} direction={sortType} onClick={onClickSortlocation}> Location</TableSortLabel></TableCell>
                                      <TableCell > <TableSortLabel active={activeSort === 'shiftName'} direction={sortType} onClick={onClickSortShiftName}> Shift Name</TableSortLabel></TableCell>
                                      <TableCell > <TableSortLabel active={activeSort === 'session1StartTime'} direction={sortType} onClick={onClickSortSession}> Session</TableSortLabel></TableCell>
                                      <TableCell > <TableSortLabel active={activeSort === 'session2StartTime'} direction={sortType} onClick={onClickSortSession2}> Session-2</TableSortLabel></TableCell>
                                      <TableCell > <TableSortLabel active={activeSort === 'workDaysPerWeek'} direction={sortType} onClick={onClickSortWorkDays}> Workdays Per Week</TableSortLabel></TableCell>
                                      <TableCell > Actions</TableCell>
                                  </TableRow>
                              </TableHead>

                              <TableBody>

                              {attendance && attendance.map((each: any, index: number) => (
                                  <TableRow
                                  key={each._id}
                                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                  >   
                                      <TableCell >{each.company.name}</TableCell>
                                      <TableCell >{each.associateCompany.name}</TableCell>
                                      <TableCell >{each.location.name}</TableCell>
                                      <TableCell >{each.shiftName}</TableCell>
                                      <TableCell >{each.session1StartTime+ " - "+ each.session1EndTime}</TableCell>
                                      <TableCell >{each.session2StartTime+ " - "+ each.session2EndTime}</TableCell>
                                      <TableCell >{each.workDaysPerWeek}</TableCell>
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
                      count={attendanceCount}
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

export default AttendanceConfig