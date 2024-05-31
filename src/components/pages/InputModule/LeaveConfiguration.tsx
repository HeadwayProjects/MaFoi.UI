import React, { useEffect, useState } from 'react'
import PageLoader from '../../shared/PageLoader'
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import { getAllCompaniesDetails, getAssociateCompanies, getLocations } from '../../../redux/features/inputModule.slice';
import { Box, Button,Checkbox, Drawer, FormControl, FormLabel, IconButton, InputAdornment, InputLabel, MenuItem, Modal, OutlinedInput, Select as MSelect, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, TextField, Typography, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { FaUpload, FaDownload } from "react-icons/fa";
import { IoMdAdd, IoMdClose, IoMdSearch } from "react-icons/io";
import { DEFAULT_OPTIONS_PAYLOAD, DEFAULT_PAYLOAD } from '../../common/Table';
import Icon from '../../common/Icon';
import { useExportAttendanceConfig, useExportLeaveConfig, } from '../../../backend/exports';
import { download, downloadFileContent, preventDefault } from '../../../utils/common';
import { ERROR_MESSAGES } from '../../../utils/constants';
import { toast } from 'react-toastify';
import { Alert } from 'react-bootstrap';
import { addAttendance, deleteAttendance, editAttendance, getAttendanceConfiguration, resetAddAttendanceDetails, resetDeleteAttendanceDetails, resetEditAttendanceDetails, resetUploadAttendanceDetails, uploadAttendance } from '../../../redux/features/attendanceConfiguration.slice';
import  Select from "react-select";
import { resetBulkDeleteLeaveDetails, bulkDeleteLeaves, addLeave, deleteLeave, editLeave, getLeaveConfiguration, resetAddLeaveDetails, resetDeleteLeaveDetails, resetEditLeaveDetails, resetGetLeaveDetailsStatus, resetUploadLeavesDetails, uploadLeaves } from '../../../redux/features/leaveConfiguration.slice';
import { EMPLOYEMENT_TYPES, EZYCOMP_LEAVE_TYPES,Leave_Credit_Frequency } from '../../common/Constants';


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

  const uploadLeavesDetails = useAppSelector((state) => state.leaveConfiguration.uploadLeavesDetails)
  const deleteLeaveDetails = useAppSelector((state) => state.leaveConfiguration.deleteLeaveDetails)
  const addLeaveDetails = useAppSelector((state) => state.leaveConfiguration.addLeaveDetails)
  const editLeaveDetails = useAppSelector((state) => state.leaveConfiguration.editLeaveDetails)

  const companiesDetails = useAppSelector((state) => state.inputModule.companiesDetails);
  const associateCompaniesDetails = useAppSelector((state) => state.inputModule.associateCompaniesDetails);
  const locationsDetails = useAppSelector((state) => state.inputModule.locationsDetails);

  const bulkDeleteLeaveDetails = useAppSelector((state) => state.leaveConfiguration.bulkDeleteLeaveDetails)

  const leaves = leaveConfigurationDetails.data.list
  const leavesCount = leaveConfigurationDetails.data.count

  const companies = companiesDetails && companiesDetails.data.list
  const associateCompanies = associateCompaniesDetails && associateCompaniesDetails.data.list
  const locations = locationsDetails && locationsDetails.data.list
  const employementTypes = EMPLOYEMENT_TYPES
  const ezycompLeaveTypes = EZYCOMP_LEAVE_TYPES
  const leaveCreditFrequency = Leave_Credit_Frequency

  const [company, setCompany] = React.useState('');
  const [associateCompany, setAssociateCompany] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [employmentType, setEmploymentType] = React.useState('');
  const [ezycompLeave, setEzycompLeave] = React.useState('')

  const [carryForward, setCarryForward] = React.useState(true);
  const [leaveType, setLeaveType] = React.useState('')
  const [frequency, setFrequency] = React.useState('')
  const [totalLeaves, setTotalLeaves] = React.useState('')
  const [remarkLeaves, setRemarkLeaves] = React.useState('')

  const [searchInput, setSearchInput] = React.useState('');
  const [activeSort, setActiveSort] = React.useState('companyId')
  const [sortType, setSortType] = React.useState<any>('asc')

  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [page, setPage] = React.useState(0);

  const [leaveDetails, setLeaveDetails] = React.useState<any>({});
  const [openModal, setOpenModal] = React.useState(false);
  const [modalType, setModalType] = React.useState('');

  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [openUploadModal, setOpenUploadModal] = React.useState(false);
  const [uploadData, setUploadData] =  React.useState<any>();
  const [uploadError, setUploadError] = React.useState(false);

  const [selectedLeaves, setSelectedLeaves] = React.useState<any>([]);
  const [openBulkDeleteModal, setOpenBulkDeleteModal] = React.useState(false);

  const { exportLeaveConfig, exporting } = useExportLeaveConfig((response: any) => {
    const companyDetails = companies.find((each:any) => each.id === company)
    const assCompNameDetails = associateCompanies.find((each:any) => each.id === associateCompany)
    const locationDetails = locations.find((each:any)=> each.id === location)
    interface CompanyDetails {
      name?: string;
  }
  
  interface AssCompNameDetails {
      name?: string;
  }

    
  interface LocationDetails {
    name?: string;
}

  function constructFileName(
    companyDetails: CompanyDetails, 
    assCompNameDetails: AssCompNameDetails, 
    locationDetails : LocationDetails


    
): string {
    const parts = [
      'LeaveConfig',
      companyDetails && companyDetails.name ? companyDetails.name : null,
      assCompNameDetails && assCompNameDetails.name ? assCompNameDetails.name : null,
      locationDetails && locationDetails.name ? locationDetails.name : null,
     
      'LeaveConfig.xlsx'
    ];

    const validParts = parts.filter(part => part != null && part !== '');

    return validParts.join(' - ');
}

const fileName = constructFileName(companyDetails, assCompNameDetails,locationDetails);

    downloadFileContent({
        //name: `Leave Configuration - ${companyDetails.name} - ${assCompNameDetails.name} - ${employmentType} - Leaves.xlsx`,
        name :fileName,
        type: response.headers['content-type'],
        content: response.data
    });
  }, () => {
      toast.error(ERROR_MESSAGES.DEFAULT);
  });

  const loading = exporting || editLeaveDetails.status === 'loading' || uploadLeavesDetails.status === 'loading' || addLeaveDetails.status === 'loading' || deleteLeaveDetails.status === 'loading' || leaveConfigurationDetails.status === 'loading' || companiesDetails.status === 'loading'
   || associateCompaniesDetails.status === 'loading' || locationsDetails.status === 'loading'

  const handleChangeCompany = (event:any) => {
    setAssociateCompany('')
    setEmploymentType('')
    setCompany(event.target.value);
    const leavesPayload: any =  { 
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
      sort: { columnName: 'ezycompLeave', order: 'asc' },
      "includeCentral": true
    }
    dispatch(getLeaveConfiguration(leavesPayload))
  };

  const handleChangeAssociateCompany = (event:any) => {
    setEmploymentType('')
    setAssociateCompany(event.target.value);
    const leavesPayload: any =  { 
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
      sort: { columnName: 'ezycompLeave', order: 'asc' },
      "includeCentral": true
    }
    dispatch(getLeaveConfiguration(leavesPayload))
  };

  const handleChangeEmployementType = (event:any) => {
    setEmploymentType(event.target.value);
    const leavesPayload: any =  { 
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
          columnName:'employeeType',
          value: event.target.value
        }
      ],
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page+1
      },
      sort: { columnName: 'ezycompLeave', order: 'asc' },
      "includeCentral": true
    }
    dispatch(getLeaveConfiguration(leavesPayload))
  };
  
  const handleChangeSearchInput = (event:any) => {
    setSearchInput(event.target.value)
  }

  const handleChangeCarryForward = (event: any) => {
    if('true' === event.target.value){
      setCarryForward(true)
    }else{
      setCarryForward(false)
    }
  }

  useEffect(() => {
    const leaveConfigurationDefaultPayload: any =  { 
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
    dispatch(getLeaveConfiguration(leaveConfigurationDefaultPayload))
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
    if(leaveConfigurationDetails.status === 'succeeded'){

    }else if(leaveConfigurationDetails.status === 'failed'){
      toast.error(ERROR_MESSAGES.DEFAULT);
      resetGetLeaveDetailsStatus()
    }
  },[leaveConfigurationDetails.status])

  useEffect(() => {
    if(deleteLeaveDetails.status === 'succeeded'){
      toast.success(`Leave deleted successfully.`)
      setLeaveDetails({})
      dispatch(resetDeleteLeaveDetails())
      setOpenDeleteModal(false)
      const leavesPayload: any =  { 
        search: "",
        filters: [],
        pagination: {
          pageSize: 10,
          pageNumber: 1
        },
        sort: { columnName: 'ezycompLeave', order: 'asc' },
        "includeCentral": true
      }
      dispatch(getLeaveConfiguration(leavesPayload))
    }else if(deleteLeaveDetails.status === 'failed'){
      toast.error(ERROR_MESSAGES.DEFAULT);
    }
  }, [deleteLeaveDetails.status])

  useEffect(() => {
    if(addLeaveDetails.status === 'succeeded'){
      if(addLeaveDetails.data.key === 'FAILURE'){
        toast.error(`Leave Already Exist.`)
      }else{
      toast.success(`Leave Added successfully.`)
      dispatch(resetAddLeaveDetails())
      setOpenModal(false); setModalType(''); setLeaveDetails({}); setCompany(''); setAssociateCompany(''); setEmploymentType(''); setEzycompLeave(''); setLeaveType(''); setFrequency(''); setTotalLeaves(''); setCarryForward(true)
      const leavesPayload: any =  { 
        search: "",
        filters: [],
        pagination: {
          pageSize: 10,
          pageNumber: 1
        },
        sort: { columnName: 'ezycompLeave', order: 'asc' },
        "includeCentral": true
      }
      dispatch(getLeaveConfiguration(leavesPayload))
    }
    }else if(addLeaveDetails.status === 'failed'){
      setOpenModal(false); setModalType(''); setLeaveDetails({}); setCompany(''); setAssociateCompany(''); setEmploymentType(''); setEzycompLeave(''); setLeaveType(''); setFrequency(''); setTotalLeaves(''); setCarryForward(true)
      toast.error(ERROR_MESSAGES.DEFAULT);
    }
  }, [addLeaveDetails.status])

  useEffect(() => {
    if(uploadLeavesDetails.status === 'succeeded'){
      if(uploadLeavesDetails.data.size === 0){
        toast.success(`Leaves Uploaded successfully.`)
        dispatch(resetUploadLeavesDetails())
        setOpenUploadModal(false)
        setUploadError(false)
        setCompany('')
        setAssociateCompany('')
        setEmploymentType('')
        const leavesPayload: any =  { 
          search: "",
          filters: [],
          pagination: {
            pageSize: 10,
            pageNumber: 1
          },
          sort: { columnName: 'ezycompLeave', order: 'asc' },
          "includeCentral": true
        }
        dispatch(getLeaveConfiguration(leavesPayload))
      }else{
        setUploadError(true)
      }
    }else if(uploadLeavesDetails.status === 'failed'){
      toast.error(ERROR_MESSAGES.DEFAULT);
    }
  }, [uploadLeavesDetails.status])

  useEffect(() => {
    if(editLeaveDetails.status === 'succeeded'){
      toast.success(`Attendance Updated successfully.`)
      dispatch(resetEditLeaveDetails())
      setOpenModal(false); setModalType(''); setLeaveDetails({}); setCompany(''); setAssociateCompany(''); setEmploymentType(''); setEzycompLeave(''); setLeaveType(''); setFrequency(''); setTotalLeaves(''); setCarryForward(true)
      const leavesPayload: any =  { 
        search: "",
        filters: [],
        pagination: {
          pageSize: 10,
          pageNumber: 1
        },
        sort: { columnName: 'ezycompLeave', order: 'asc' },
        "includeCentral": true
      }
      dispatch(getLeaveConfiguration(leavesPayload))
    }else if(editLeaveDetails.status === 'failed'){
      setOpenModal(false); setModalType(''); setLeaveDetails({}); setCompany(''); setAssociateCompany(''); setEmploymentType(''); setEzycompLeave(''); setLeaveType(''); setFrequency(''); setTotalLeaves(''); setCarryForward(true)
      toast.error(ERROR_MESSAGES.DEFAULT);
    }
  }, [editLeaveDetails.status])

  useEffect(() => {
    if(bulkDeleteLeaveDetails.status === 'succeeded'){
      toast.success(`Leaves deleted successfully.`)
      setSelectedLeaves([])
      dispatch(resetBulkDeleteLeaveDetails())
      setOpenBulkDeleteModal(false)
      const LeaveDetailsDefaultPayload: any =  { 
        search: "",
        filters: [],
        pagination: {
          pageSize: 10,
          pageNumber: 1
        },
        sort: { columnName: 'ezycompLeave', order: 'asc' },
        "includeCentral": true
      }
      dispatch(getLeaveConfiguration(LeaveDetailsDefaultPayload))
    }else if(bulkDeleteLeaveDetails.status === 'failed'){
      toast.error(ERROR_MESSAGES.DEFAULT);
    }
  }, [bulkDeleteLeaveDetails.status])
 
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
    if(employmentType){
      filters.push({
        columnName:'employeeType',
        value: employmentType
      })
    }

    const leavesPayload: any =  { 
      search: searchInput, 
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page+1
      },
      sort: { columnName: activeSort, order: sortType },
      "includeCentral": true
    }
    exportLeaveConfig({ ...leavesPayload, pagination: null });
  }

  const onClickSearch = () => {

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
    if(employmentType){
      filters.push({
        columnName:'employeeType',
        value: employmentType
      })
    }

    const leavesPayload: any =  { 
      search: searchInput, 
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page+1
      },
      sort: { columnName: 'ezycompLeave', order: 'asc' },
      "includeCentral": true
    }
    dispatch(getLeaveConfiguration(leavesPayload))
  }

  const onClickClearSearch = () => {
    
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
    if(employmentType){
      filters.push({
        columnName:'employeeType',
        value: employmentType
      })
    }

    const leavesPayload: any =  { 
      search: '', 
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page+1
      },
      sort: { columnName: 'ezycompLeave', order: 'asc' },
      "includeCentral": true
    }
    dispatch(getLeaveConfiguration(leavesPayload))
    setSearchInput('')
  }

  const onClickSortcompany = () => {
    let type = 'asc'
    setActiveSort('company'); 
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
    if(employmentType){
      filters.push({
        columnName:'employeeType',
        value: employmentType
      })
    }

    const leavesPayload: any =  { 
      search: searchInput, 
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page+1
      },
      sort: { columnName: 'company.name', order: type },
      "includeCentral": true
    }
    dispatch(getLeaveConfiguration(leavesPayload))

  }


    const onClickSortassociatecompany = () => {
      let type = 'asc'
      setActiveSort('associatecompany'); 
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
    if(employmentType){
      filters.push({
        columnName:'employeeType',
        value: employmentType
      })
    }

    const leavesPayload: any =  { 
      search: searchInput, 
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page+1
      },
      sort: { columnName: 'associatecompany.name', order: type },
      "includeCentral": true
    }
    dispatch(getLeaveConfiguration(leavesPayload))

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
    if(employmentType){
      filters.push({
        columnName:'employeeType',
        value: employmentType
      })
    }

    const leavesPayload: any =  { 
      search: "",
      filters,
      pagination: {
        pageSize: 10,
        pageNumber: 1
      },
      sort: { columnName: 'ezycompLeave', order: type },
      "includeCentral": true
    }
    dispatch(getLeaveConfiguration(leavesPayload))
    
  }

  const onClickSortLeaveType = () => {
    let type = 'asc'
    setActiveSort('leaveType'); 
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
    if(employmentType){
      filters.push({
        columnName:'employeeType',
        value: employmentType
      })
    }

    const leavesPayload: any =  { 
      search: searchInput, 
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page+1
      },
      sort: { columnName: 'leaveType', order: type },
      "includeCentral": true
    }
    dispatch(getLeaveConfiguration(leavesPayload)) 
  }

  const onClickSortCreditFrequency = () => {
    let type = 'asc'
    setActiveSort('creditFrequency'); 
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
    if(employmentType){
      filters.push({
        columnName:'employeeType',
        value: employmentType
      })
    }

    const leavesPayload: any =  { 
      search: searchInput, 
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page+1
      },
      sort: { columnName: 'creditFrequency', order: type },
      "includeCentral": true
    }
    dispatch(getLeaveConfiguration(leavesPayload))
    
  }
  
  const onClickSortTotalLeaves = () => {
    let type = 'asc'
    setActiveSort('totalLeaves'); 
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
    if(employmentType){
      filters.push({
        columnName:'employeeType',
        value: employmentType
      })
    }

    const leavesPayload: any =  { 
      search: searchInput, 
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page+1
      },
      sort: { columnName: 'totalLeaves', order: type },
      "includeCentral": true
    }
    dispatch(getLeaveConfiguration(leavesPayload))
    
  }
  
  const onClickSortEmployeeType = () => {
    let type = 'asc'
    setActiveSort('employeeType'); 
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
    if(employmentType){
      filters.push({
        columnName:'employeeType',
        value: employmentType
      })
    }

    const leavesPayload: any =  { 
      search: searchInput, 
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page+1
      },
      sort: { columnName: 'employeeType', order: type },
      "includeCentral": true
    }
    dispatch(getLeaveConfiguration(leavesPayload))
    
  }
  
  const onClickUpload = () => {
    setOpenUploadModal(true)
  }

  const onClickSubmitUpload = () => {
    const formData = new FormData();
    formData.append('file', uploadData[0]);
    dispatch(uploadLeaves(formData))
  }

  const addButtonDisable = !ezycompLeave || !company || !associateCompany || !location || !employmentType || !leaveType || !frequency || !totalLeaves

  const onClickAdd = () => {
    setOpenModal(true)
    setModalType('Add')
    setCompany('')
    setAssociateCompany('')
    setLocation('')
    setEzycompLeave('')
    setEmploymentType('')
    setLeaveType('')
    setFrequency('')
    setTotalLeaves('')
    setCarryForward(true)
  }

  const onClickSubmitAdd = () => {
    if(addButtonDisable){
      return toast.error(ERROR_MESSAGES.FILL_ALL);
    }

    const payload = {
      ezycompLeave,
      leaveType,
      totalLeaves,
      creditFrequency: frequency,
      carryForward,
      employeeType: employmentType,
      companyId: company,
      associateCompanyId: associateCompany,
      locationId: location.split('^')[0],
      stateId: location.split('^')[1],
      remarks: remarkLeaves
    }
    dispatch(addLeave(payload))
  }

  const onclickEdit = (leaveDetails:any) => {
    setOpenModal(true)
    setModalType('Edit')
    setEzycompLeave(leaveDetails.ezycompLeave)
    setCompany(leaveDetails.company.id)
    setAssociateCompany(leaveDetails.associateCompany.id)
    setLocation(leaveDetails.location.id+'^'+leaveDetails.stateId)
    setEmploymentType(leaveDetails.employeeType)
    setLeaveType(leaveDetails.leaveType)
    setFrequency(leaveDetails.creditFrequency)
    setTotalLeaves(leaveDetails.totalLeaves)
    setCarryForward(leaveDetails.carryForward)
    setLeaveDetails(leaveDetails)
  }

  const onClickCancelAdd = ()=>{
    setOpenModal(false);
     setModalType(''); 
     setLeaveDetails({});
      setCompany('');
       setAssociateCompany(''); 
       setEmploymentType(''); 
       setEzycompLeave(''); 
       setLeaveType(''); 
       setFrequency('');
        setTotalLeaves('');
         setCarryForward(true)
         const leavesPayload: any =  { 
          search: "", 
          filters: [],
          pagination: {
            pageSize: 10,
            pageNumber: 1
          },
          sort: { columnName: 'ezycompLeave', order: 'asc' },
          "includeCentral": true
        }
        dispatch(getLeaveConfiguration(leavesPayload))
  }
  const onClickSubmitEdit = () => {

    if(addButtonDisable){
      return toast.error(ERROR_MESSAGES.FILL_ALL);
    }
    const payload = {
      id: leaveDetails.id,
      ezycompLeave,
      leaveType,
      totalLeaves,
      creditFrequency: frequency,
      carryForward,
      employeeType: employmentType,
      companyId: company,
      associateCompanyId: associateCompany,
      locationId: location.split('^')[0],
      stateId: location.split('^')[1],
      remarks: ''
    }
    dispatch(editLeave(payload))
  }

  const onclickView = (leaveDetails:any) => {
    setOpenModal(true)
    setModalType('View')
    setLeaveDetails(leaveDetails)
  }

  const onclickDelete = (leaveDetails:any) => {
    setLeaveDetails(leaveDetails)
    setOpenDeleteModal(true)
  }
 
  const onClickConfirmDelete = () => {
    dispatch(deleteLeave(leaveDetails.id))
    setCompany('')
    setAssociateCompany('')
    setEmploymentType('')
    const leavesPayload: any =  { 
      search: "", 
      filters: [],
      pagination: {
        pageSize: 10,
        pageNumber: 1
      },
      sort: { columnName: 'ezycompLeave', order: 'asc' },
      "includeCentral": true
    }
    dispatch(getLeaveConfiguration(leavesPayload))
  }

  const onClickIndividualCheckBox = (id:any) => {
    if(selectedLeaves.includes(id)){
      const updatedSelectedLeaves:any = selectedLeaves.filter((each:any) => each != id)
      setSelectedLeaves(updatedSelectedLeaves)
    }else{
      setSelectedLeaves([...selectedLeaves, id])
    }
  }

  const onClickAllCheckBox = () => {
    if(selectedLeaves.length !== leaves.length){
      const allIds = leaves && leaves.map((each:any) => each.id)
      setSelectedLeaves(allIds)
    }else{
      setSelectedLeaves([])
    }
  }

  const onClickBulkDelete = () => {
    setOpenBulkDeleteModal(true)
  }

  const onClickConfirmBulkDelete = () => {
    dispatch(bulkDeleteLeaves(selectedLeaves))
    setCompany('')
    setAssociateCompany('')
    setEmploymentType('')
    const leavesPayload: any =  { 
      search: "", 
      filters: [],
      pagination: {
        pageSize: 10,
        pageNumber: 1
      },
      sort: { columnName: 'ezycompLeave', order: 'asc' },
      "includeCentral": true
    }
    dispatch(getLeaveConfiguration(leavesPayload))
  }



  const handleChangePage = (event: unknown, newPage: number) => {
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
    if(employmentType){
      filters.push({
        columnName:'employeeType',
        value: employmentType
      })
    }

    const leavesPayload: any =  { 
      search: '', 
      filters: filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: newPage+1
      },
      sort: { columnName: 'ezycompLeave', order: 'asc' },
      "includeCentral": true
    }

    dispatch(getLeaveConfiguration(leavesPayload))
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {

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
    if(employmentType){
      filters.push({
        columnName:'employeeType',
        value: employmentType
      })
    }

    const leavesPayload: any =  { 
      search: '', 
      filters: filters,
      pagination: {
        pageSize: parseInt(event.target.value, 10),
        pageNumber: 1
      },
      sort: { columnName: 'ezycompLeave', order: 'asc' },
      "includeCentral": true
    }

    dispatch(getLeaveConfiguration(leavesPayload))
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const downloadSample = (e: any) => {
    preventDefault(e);
    download('Sample Leaves.xlsx', 'https://mafoi.s3.ap-south-1.amazonaws.com/bulkuploadtemplates/LeavesTemplate.xlsx')
  }

  const downloadErrors = (e: any) => {
    preventDefault(e);
    const data = uploadLeavesDetails.data;
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

  const handleCompanyLeaveTypeChange =(e: React.ChangeEvent<HTMLInputElement>)=>{
    const value = e.target.value;
    const alphabetOnly = value.replace(/[^a-zA-Z\s]/g, ''); 
    setLeaveType(alphabetOnly);
  }

  const handleTotalLeavesChange =(e: React.ChangeEvent<HTMLInputElement>)=>{
    const value = e.target.value;
    const numericOnly =  value.replace(/[^0-9.]/g, '');
    setTotalLeaves(numericOnly);
  }

console.log(leaves);

const handleChangeLocation = (event: any) => {
  setEmploymentType('')
  setLocation(event.target.value);
  console.log(event.target.value);
  const leavesPayload: any =  { 
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
    sort: { columnName: 'ezycompLeave', order: 'asc' },
    "includeCentral": true
  }
  dispatch(getLeaveConfiguration(leavesPayload))
}

  return (
    <div style={{ height:'100vh', backgroundColor:'#ffffff'}}>

      {/*Add Edit and View Modals */}
      <Drawer anchor='right' open={openModal}>
        <Box  sx={{height:'100%',width: 500, display:'flex', flexDirection:'column'}}>
          <Box sx={{backgroundColor:'#E2E3F8', padding:'10px', px:'20px', borderRadius:'6px', boxShadow: '0px 6px 10px #CDD2D9', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <Typography sx={{font: 'normal normal normal 32px/40px Calibri'}}>{modalType} Leave</Typography>
            <IconButton
              onClick={() => {setOpenModal(false); setModalType(''); setLeaveDetails({}); setCompany(''); setAssociateCompany(''); setEmploymentType(''); setEzycompLeave(''); setLeaveType(''); setFrequency(''); setTotalLeaves(''); setCarryForward(true)}}
            >
              <IoMdClose />
            </IconButton>
          </Box>

          {/*Add Modal */}
          <>
            {modalType === 'Add' && 
            <Box sx={{ width: '100%', padding:'15px'}}>
                 
                  <FormControl sx={{ m: 1, width:"100%", backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                    <InputLabel id="demo-select-small-label" sx={{color:'#000000'}}>Company</InputLabel>
                    <MSelect
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      value={company}
                      label="Company"
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            maxHeight: 200,
                            width: 100,
                            marginTop: '3px'
                          },
                        },
                      }}
                      onChange={(e) => {setCompany(e.target.value), setAssociateCompany(''), setEmploymentType('')}}
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
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            maxHeight: 200,
                            width: 100,
                            marginTop: '3px'
                          },
                        },
                      }}
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
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            maxHeight: 200,
                            width: 100,
                            marginTop: '3px'
                          },
                        },
                      }}
                      onChange={(e) => setLocation(e.target.value)}
                    >
                      {locations && locations.map((each:any) => {
                          const { id, name, code, cities }: any = each.location || {};
                          const { state } = cities || {};
                          return <MenuItem value={each.locationId+'^'+state.id}>{`${name} (${state.code}-${cities.code}-${code})`}</MenuItem>
                      })}
                    </MSelect>
                  </FormControl>

                  <FormControl sx={{ m: 1, width:"100%", backgroundColor:'#ffffff', borderRadius:'5px' }} size="small">
                    <InputLabel id="demo-select-small-label" sx={{color:'#000000'}}>Employment Types</InputLabel>
                    <MSelect
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      value={employmentType}
                      label="Employment Types"
                      onChange={(e) => setEmploymentType(e.target.value)}
                    >
                      {employementTypes && employementTypes.map((each:any) => {
                          return <MenuItem value={each}>{each}</MenuItem>
                      })}
                    </MSelect>
                  </FormControl>

                  <FormControl sx={{ m: 1, width:"100%", backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                    <InputLabel htmlFor="outlined-adornment-name" sx={{color:'#000000'}}>Ezycomp Leave Type</InputLabel>
                    <MSelect
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      value={ezycompLeave}
                      label="Employment Types"
                      onChange={(e) => setEzycompLeave(e.target.value)}
                    >
                      {ezycompLeaveTypes && ezycompLeaveTypes.map((each:any) => {
                          return <MenuItem value={each}>{each}</MenuItem>
                      })}
                    </MSelect>
                  </FormControl>

                  <FormControl sx={{ m: 1, width: '100%', backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
      <InputLabel htmlFor="outlined-adornment-name">Company Leave Type</InputLabel>
      <OutlinedInput
        label='Company Leave Type'
        value={leaveType}
        onChange={handleCompanyLeaveTypeChange}
        id="outlined-adornment-name"
        type='text'
      />
    </FormControl>

    <FormControl sx={{ m: 1, width: "100%", backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                  <InputLabel htmlFor="outlined-adornment-name">Leave Credit Frequency</InputLabel>
                  <MSelect
                    labelId="demo-select-small-label"
                    value={frequency}
                    label='Leave Credit Frequency'
                    onChange={(e) => setFrequency(e.target.value)}
                    id="outlined-adornment-name"
                    type='text'
                  
                    >
                    {leaveCreditFrequency && leaveCreditFrequency.map((each: any) => {
                      return <MenuItem value={each}>{each}</MenuItem>
                    })}
                  </MSelect >
                </FormControl>

                  <FormControl sx={{ m: 1, width:"100%", backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                    <InputLabel htmlFor="outlined-adornment-name">Total Leaves</InputLabel>
                    <OutlinedInput
                      label='Total Leaves'
                      value={totalLeaves}
                      onChange={handleTotalLeavesChange}
                      id="outlined-adornment-name"
                      type='text'
                    />
                  </FormControl>
                  
                  <FormControl sx={{ m: 1, width:"100%", backgroundColor:'#ffffff', borderRadius:'5px' }}>
                    <FormLabel id="demo-radio-buttons-group-label"  sx={{color:'#000000'}}>Carry Forward...</FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="demo-radio-buttons-group-label"
                      defaultValue="true"
                      name="radio-buttons-group"
                      value={carryForward}
                      onChange={handleChangeCarryForward}
                    >
                      <FormControlLabel value="true" control={<Radio />} label="Yes" />
                      <FormControlLabel value="false" control={<Radio />} label="No" />
                    </RadioGroup>
                  </FormControl>

                  <FormControl sx={{ m: 1, width: "100%", backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                  <InputLabel htmlFor="outlined-adornment-name">Remarks </InputLabel>
                  <OutlinedInput
                    label='Remark Leaves'
                    value={remarkLeaves}
                    onChange={(e) => setRemarkLeaves(e.target.value)}
                    id="outlined-adornment-name"
                    type='text'
                  />
                </FormControl>

            </Box>
            }

            {modalType === 'Add' && 
            <Box sx={{display:'flex', padding:'20px', borderTop:'1px solid #6F6F6F',justifyContent:'space-between', alignItems:'center'}}>
              {/* <Button variant='outlined' color="error" onClick={() => {setOpenModal(false); setModalType(''); setLeaveDetails({}); setCompany(''); setAssociateCompany(''); setEmploymentType(''); setEzycompLeave(''); setLeaveType(''); setFrequency(''); setTotalLeaves(''); setCarryForward(true)}}>Cancel</Button> */}
             
              <Button variant='outlined' color="error" onClick={onClickCancelAdd}>Cancel</Button>
 <Button variant='contained' onClick={onClickSubmitAdd}>Submit</Button>
            </Box>
            }
          </>

          {/* View Modal */}
          <>
            {modalType === "View" && 
              <Box sx={{ width: '100%', padding:'20px'}}>
                <Typography variant='h5' color='#0F67B1' sx={{fontSize:'22px', mt:0.5}}>Company</Typography>
                  <Typography color="#000000" sx={{fontSize:'20px'}} >{leaveDetails.company.name}</Typography>

                  <Typography variant='h5' color='#0F67B1' sx={{fontSize:'22px', mt:2}}>Associate Company</Typography>
                  <Typography color="#000000" sx={{fontSize:'20px'}} >{leaveDetails.associateCompany.name}</Typography>
                
                  <Typography variant='h5' color='#0F67B1' sx={{fontSize:'22px'}}>Ezycomp Leave Type</Typography>
                  <Typography color="#000000" sx={{fontSize:'20px'}} >{leaveDetails.ezycompLeave}</Typography>
                  
                  <Typography variant='h5' color='#0F67B1' sx={{fontSize:'24px', mt:1.5}}>Company Leave Type</Typography>
                  <Typography color="#000000" sx={{fontSize:'22px'}}>{leaveDetails.leaveType}</Typography>

                  <Typography variant='h5' color='#0F67B1' sx={{fontSize:'24px', mt:1.5}}>Leave Credit Frequency</Typography>
                  <Typography color="#000000" sx={{fontSize:'22px'}}>{leaveDetails.creditFrequency}</Typography>

                  <Typography variant='h5' color='#0F67B1' sx={{fontSize:'24px', mt:1.5}}>Total Leaves</Typography>
                  <Typography color="#000000" sx={{fontSize:'22px'}}>{leaveDetails.totalLeaves}</Typography>

                  <Typography variant='h5' color='#0F67B1' sx={{fontSize:'24px', mt:1.5}}>Employment Type</Typography>
                  <Typography color="#000000" sx={{fontSize:'22px'}}>{leaveDetails.employeeType}</Typography>

                  <Typography variant='h5' color='#0F67B1' sx={{fontSize:'24px', mt:1.5}}>Carry Forward</Typography>
                  <Typography color="#000000" sx={{fontSize:'22px'}}>{leaveDetails.carryForward ? "Yes" : "No"}</Typography>
              </Box>
            }
            {modalType === 'View' && 
              <Box sx={{display:'flex', padding:'20px', borderTop:'1px solid #6F6F6F',justifyContent:'flex-end', alignItems:'center', mt:0.2}}>
                <Button variant='contained' onClick={() => {setOpenModal(false); setModalType('');  setLeaveDetails({})}}>Cancel</Button>
              </Box>
            }
          </>

          {/*Edit Modal */}
          <>
            {modalType === 'Edit' && 
            <Box sx={{ width: 400, padding:'15px'}}>

                  <FormControl sx={{ m: 1, width:"100%", backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                    <InputLabel id="demo-select-small-label" sx={{color:'#000000'}}>Company</InputLabel>
                    <MSelect
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      value={company}
                      label="Company"
                      onChange={(e) => {setCompany(e.target.value), setAssociateCompany(''), setEmploymentType('')}}
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

                  <FormControl sx={{ m: 1, width:"100%", backgroundColor:'#ffffff', borderRadius:'5px' }} size="small">
                    <InputLabel id="demo-select-small-label" sx={{color:'#000000'}}>Employment Types</InputLabel>
                    <MSelect
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      value={employmentType}
                      label="Employment Types"
                      onChange={(e) => setEmploymentType(e.target.value)}
                    >
                      {employementTypes && employementTypes.map((each:any) => {
                          return <MenuItem value={each}>{each}</MenuItem>
                      })}
                    </MSelect>
                  </FormControl>

                  <FormControl sx={{ m: 1, width:"100%", backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                    <InputLabel htmlFor="outlined-adornment-name" sx={{color:'#000000'}}>Ezycomp Leave Type</InputLabel>
                    <MSelect
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      value={ezycompLeave}
                      label="Employment Types"
                      onChange={(e) => setEzycompLeave(e.target.value)}
                    >
                      {ezycompLeaveTypes && ezycompLeaveTypes.map((each:any) => {
                          return <MenuItem value={each}>{each}</MenuItem>
                      })}
                    </MSelect>
                  </FormControl>

                  <FormControl sx={{ m: 1, width:"100%", backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                    <InputLabel htmlFor="outlined-adornment-name">Company Leave Type</InputLabel>
                    <OutlinedInput
                      label='Company Leave Type'
                      value={leaveType}
                      onChange={handleCompanyLeaveTypeChange}
                      id="outlined-adornment-name"
                      type='text'
                    />
                  </FormControl>

                  <FormControl sx={{ m: 1, width:"100%", backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                    <InputLabel htmlFor="outlined-adornment-name">Leave Credit Frequency</InputLabel>
                    <OutlinedInput
                      label='Frequency'
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                      id="outlined-adornment-name"
                      type='text'
                    />
                  </FormControl>

                  <FormControl sx={{ m: 1, width:"100%", backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                    <InputLabel htmlFor="outlined-adornment-name">Total Leaves</InputLabel>
                    <OutlinedInput
                      label='Total Leaves'
                      value={totalLeaves}
                      onChange={handleTotalLeavesChange}
                      id="outlined-adornment-name"
                      type='text'
                    />
                  </FormControl>
                  
                  <FormControl sx={{ m: 1, width:"100%", backgroundColor:'#ffffff', borderRadius:'5px' }}>
                    <FormLabel id="demo-radio-buttons-group-label"  sx={{color:'#000000'}}>Carry Forward</FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="demo-radio-buttons-group-label"
                      defaultValue="true"
                      name="radio-buttons-group"
                      value={carryForward}
                      onChange={handleChangeCarryForward}
                    >
                      <FormControlLabel value="true" control={<Radio />} label="Yes" />
                      <FormControlLabel value="false" control={<Radio />} label="No" />
                    </RadioGroup>
                  </FormControl>

            </Box>
            }

            {modalType === 'Edit' && 
            <Box sx={{display:'flex', padding:'20px', borderTop:'1px solid #6F6F6F',justifyContent:'space-between', alignItems:'center'}}>
              <Button variant='outlined' color="error" onClick={() => {setOpenModal(false); setModalType(''); setLeaveDetails({}); setCompany(''); setAssociateCompany(''); setEmploymentType(''); setEzycompLeave(''); ; setLeaveType(''); setFrequency(''); setTotalLeaves(''); setCarryForward(true)}}>Cancel</Button>
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
          <Box sx={{backgroundColor:'#E2E3F8', padding:'10px', px:'20px', borderRadius:'6px', boxShadow: '0px 6px 10px #CDD2D9', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <Typography sx={{font: 'normal normal normal 32px/40px Calibri'}}>Delete Leave</Typography>
            <IconButton
              onClick={() => setOpenDeleteModal(false)}
            >
              <IoMdClose />
            </IconButton>
          </Box>
          <Box sx={{padding:'20px', backgroundColor:'#ffffff'}}>
            <Box sx={{display:'flex', alignItems:'center'}}>
              <Typography >Are you sure you want to delete the Leave</Typography>
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
        onClose={() => {setOpenUploadModal(false); setUploadError(false); setUploadData(null)}}
      >
        <Box sx={styleUploadModal}>
          <Box sx={{backgroundColor:'#E2E3F8', padding:'10px', px:'20px', borderRadius:'6px', boxShadow: '0px 6px 10px #CDD2D9', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <Typography sx={{font: 'normal normal normal 32px/40px Calibri'}}>Upload Leaves</Typography>
            <IconButton
              onClick={() => {setOpenUploadModal(false); setUploadError(false); setUploadData(null)}}
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
                <a href="/" style={{marginTop: '10px', width:'210px'}} onClick={downloadSample}>Dowload Sample Leaves</a>
            </Box>
          </Box>

          <Box sx={{display:'flex', justifyContent:'center', alignItems:'center', mt:5}}>
            <Button variant='contained' disabled={!uploadData} onClick={onClickSubmitUpload}>Submit</Button>
          </Box>

          <Box sx={{display:'flex', padding:'20px', borderTop:'1px solid #6F6F6F',justifyContent:'flex-end', alignItems:'center', mt:4}}>
                <Button variant='contained' sx={{backgroundColor:'#707070'}} onClick={() => {setOpenUploadModal(false); setUploadError(false); setUploadData(null)}}>Cancel</Button>
                </Box>
        </Box>
      </Modal>

      {/* Bulk Delete Modal */}
      <Modal
          open={openBulkDeleteModal}
          onClose={() => setOpenBulkDeleteModal(false)}
        >
          <Box sx={style}>
            <Box sx={{backgroundColor:'#E2E3F8', padding:'10px', px:'20px', borderRadius:'6px', boxShadow: '0px 6px 10px #CDD2D9', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <Typography sx={{font: 'normal normal normal 32px/40px Calibri'}}>Delete Leaves</Typography>
              <IconButton
                onClick={() => setOpenBulkDeleteModal(false)}
              >
                <IoMdClose />
              </IconButton>
            </Box>
            <Box sx={{padding:'20px', backgroundColor:'#ffffff'}}>
              <Box>
                <Typography variant='h5'>There are {selectedLeaves.length} record(s) selected for deleting.</Typography>
                <Typography mt={2}>Are you sure you want to delete all of them ?</Typography>
              </Box>
              <Box sx={{display:'flex', justifyContent:'space-between', alignItems:'center', mt:2}}>
                <Button variant='outlined' color="error" onClick={() => setOpenBulkDeleteModal(false)}>No</Button>
                <Button variant='contained' onClick={onClickConfirmBulkDelete}>Yes</Button>
              </Box>
          </Box>
        </Box>
      </Modal>

      {loading ? <PageLoader>Loading...</PageLoader> : 
      
        <div>
             <Box sx={{paddingX: '20px', paddingY:'10px',}}>
                <div style={{backgroundColor:'#E2E3F8', padding:'20px', borderRadius:'6px', boxShadow: '0px 6px 10px #CDD2D9'}}>
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px', marginTop:'10px'}}>
                        <h5 style={{ font: 'normal normal normal 32px/40px Calibri' }}>Leave Configuration</h5>
                        <div style={{marginRight:'12px', display:'flex', alignItems:'center', width:'400px', justifyContent: 'space-between'}}>
                          <Button onClick={onClickUpload} variant='contained' style={{backgroundColor:'#E9704B', display:'flex', alignItems:'center'}}> <FaUpload /> &nbsp; Upload</Button>
                          <Button onClick={onClickAdd} variant='contained' style={{backgroundColor:'#0654AD', display:'flex', alignItems:'center'}}> <IoMdAdd /> &nbsp; Add</Button>
                          <Button onClick={onClickBulkDelete} variant='contained' color='error' disabled={selectedLeaves && selectedLeaves.length === 0}> Bulk Delete</Button>
                          <button onClick={onClickExport} disabled={(leaves && leaves <=0) || !company || !associateCompany} style={{display:'flex', justifyContent:'center', alignItems:'center', backgroundColor: ((leaves && leaves <=0) || !company || !associateCompany) ? '#707070': '#ffffff' , color: ((leaves && leaves <=0) || !company || !associateCompany) ? '#ffffff': '#000000', border:'1px solid #000000', width:'40px', height:'30px', borderRadius:'8px'}}> <FaDownload /> </button>
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
                            MenuProps={{
                              PaperProps: {
                                sx: {
                                  maxHeight: 210,
                                  width: 230, 
                                  marginLeft: "10px",
                                  marginTop: '3px'
                                },
                              },
                            }}
                          >
                            <MenuItem disabled sx={{display:'none'}} value="">
                              Select Company
                            </MenuItem>
                            {companies && companies.map((each:any) => {
                                return <MenuItem  sx={{width:'240px', whiteSpace:'initial'}} value={each.id}>{each.name}</MenuItem>
                            })}
                          </MSelect>
                        </FormControl>
                      </Box>

                      <Box sx={{ mr:1}}>
                        <Typography mb={1}>Associate Company</Typography>
                        <FormControl sx={{ width:'100%', maxWidth:'200px', backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                          <MSelect
                            sx={{'.MuiOutlinedInput-notchedOutline': { border: 0 }}}
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
                            <MenuItem disabled sx={{display:'none'}} value="">
                              Select Associate Company
                            </MenuItem>
                            {associateCompanies && associateCompanies.map((each:any) => {
                              return <MenuItem sx={{width:'240px', whiteSpace:'initial'}} value={each.id}>{each.name}</MenuItem>
                            })}
                          </MSelect>
                        </FormControl>
                      </Box>

                      <Box sx={{ mr: 1 }}>
                  <Typography mb={1}>Location</Typography>
                  <FormControl sx={{ width: "220px", backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                    <MSelect
                      sx={{ '.MuiOutlinedInput-notchedOutline': { border: 0 } }}
                      displayEmpty
                      value={location}
                      disabled={!associateCompany}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            maxHeight: 210,
                            width: 215,
                            // marginLeft: "10px",
                            marginTop: '3px'
                          },
                        },
                      }}
                      onChange={handleChangeLocation}
                    >
                      <MenuItem disabled sx={{ display: 'none' }} value="">
                        Location
                      </MenuItem>
                    {locations && locations.map((each: any) => {
                      const { id, name, code, cities }: any = each.location || {};
                      const { state } = cities || {};
                      return <MenuItem value={each.locationIds}>{`${name} (${state.code}-${cities.code}-${code})`}</MenuItem>
                    })}
                  </MSelect>
                  </FormControl>
                  </Box>

                      <Box sx={{ mr:1}}>
                        <Typography mb={1}>Employment Types</Typography>
                        <FormControl sx={{ width:"220px", backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                          <MSelect
                            sx={{'.MuiOutlinedInput-notchedOutline': { border: 0 }}}
                            displayEmpty
                            value={employmentType}
                            disabled={!associateCompany}
                            onChange={handleChangeEmployementType}
                          >
                            <MenuItem disabled sx={{display:'none'}} value="">
                              Select Employment Type
                            </MenuItem>
                            {employementTypes && employementTypes.map((each:any) => {
                              return <MenuItem value={each}>{each}</MenuItem>
                            })}
                          </MSelect>
                        </FormControl>
                      </Box>

                      <Box sx={{ mr:1}}>
                        <Typography mb={1}>Search for EzycompLeave</Typography>
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
                  <TableContainer sx={{border:'1px solid #e6e6e6', marginTop:'10px',  maxHeight:'385px', overflowY:'scroll'}}>
                          <Table stickyHeader  sx={{ minWidth: 650 }} aria-label="sticky table">
                              <TableHead sx={{'.MuiTableCell-root':{ backgroundColor:'#E7EEF7'}}}>
                                  <TableRow>
                                  <TableCell><Checkbox checked={(selectedLeaves && selectedLeaves.length) === (leaves && leaves.length)} onClick={onClickAllCheckBox}/></TableCell>
                                  <TableCell > <TableSortLabel active={activeSort === 'company'} direction={sortType} onClick={onClickSortcompany}> Company</TableSortLabel></TableCell>
                                  <TableCell > <TableSortLabel active={activeSort === 'associateCompany'} direction={sortType} onClick={onClickSortassociatecompany}>Associate Company</TableSortLabel></TableCell>
                                      <TableCell > <TableSortLabel active={activeSort === 'ezycompLeave'} direction={sortType} onClick={onClickSortEzycompLeave}> Ezycomp Leave Type</TableSortLabel></TableCell>
                                      <TableCell > <TableSortLabel active={activeSort === 'leaveType'} direction={sortType} onClick={onClickSortLeaveType}>Company Leave Type</TableSortLabel></TableCell>
                                      <TableCell > <TableSortLabel active={activeSort === 'creditFrequency'} direction={sortType} onClick={onClickSortCreditFrequency}>Leave credit Frequency</TableSortLabel></TableCell>
                                      <TableCell > <TableSortLabel active={activeSort === 'totalLeaves'} direction={sortType} onClick={onClickSortTotalLeaves}> Total Leaves</TableSortLabel></TableCell>
                                      <TableCell > <TableSortLabel active={activeSort === 'employeeType'} direction={sortType} onClick={onClickSortEmployeeType}> Employee Type</TableSortLabel></TableCell>
                                      <TableCell > Actions</TableCell>
                                  </TableRow>
                              </TableHead>

                              <TableBody>

                              {leaves && leaves.map((each: any, index: number) => (
                                  <TableRow
                                  key={each._id}
                                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                  >   
                                     <TableCell><Checkbox checked={selectedLeaves.includes(each.id)} onClick={() => onClickIndividualCheckBox(each.id)}/></TableCell>
                                     <TableCell >{each.company.name}</TableCell>
                                     <TableCell >{each.associateCompany.name}</TableCell>
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
                      count={leavesCount}
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