import React, { useEffect, useState } from 'react'
import PageLoader from '../../shared/PageLoader'
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import { callExcelHeaderToDbColumns, configUpload, employeeAttendanceUpload, employeeLeaveAvailedUpload, employeeLeaveCreditUpload, employeeUpload, employeeWageUpload, getAllCompaniesDetails, getAssociateCompanies, getColumns, getLocations, getStates, resetConfigUploadDetails, resetEmployeeAttendanceUploadDetails, resetEmployeeLeaveAvailedUploadDetails, resetEmployeeLeaveCreditUploadDetails, resetEmployeeUploadDetails, resetEmployeeWageUploadDetails, resetExcelHeaderToDbColumnsDetails, resetGetColumnsDetails } from '../../../redux/features/inputModule.slice';
import { Box, Button, Drawer, FormControl, FormControlLabel, FormLabel, IconButton, Select as MSelect, InputAdornment, InputLabel, MenuItem, Modal, OutlinedInput, Radio, RadioGroup, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, TextField, Typography } from '@mui/material';
import { DEFAULT_OPTIONS_PAYLOAD, DEFAULT_PAYLOAD } from '../../common/Table';
import { ERROR_MESSAGES } from '../../../utils/constants';
import { toast } from 'react-toastify';
import { IoMdClose } from 'react-icons/io';
import { Alert } from 'react-bootstrap';
import { download, downloadFileContent, preventDefault } from '../../../utils/common';
import { FaUpload } from 'react-icons/fa';
import Select from "react-select";
import { callSalaryComponentsExcelHeaderToDbColumns, getSalaryComponentsDetails, getSalaryComponentsMappingDetails, resetSalaryComponentDetails, resetSalaryComponentMappingDetails, resetSalaryConfigUploadDetails, resetSalaryExcelToDBColumnsDetails, resetSalaryUploadDetails, salaryComponentConfigUpload, salaryComponentUpload } from '../../../redux/features/salaryComponents.slice';
import { hasUserAccess } from '../../../backend/auth';
import { USER_PRIVILEGES } from '../UserManagement/Roles/RoleConfiguration';

const styleUploadModal = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  boxShadow: 24,
};

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '97%',
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


const SalaryComponents = () => {

  const dispatch = useAppDispatch();

  const companiesDetails = useAppSelector((state) => state.inputModule.companiesDetails);
  const companies = companiesDetails && companiesDetails.data.list

  const salaryComponentDetails = useAppSelector((state) => state.salaryComponent.salaryComponentDetails)
  const salaryComponentList = salaryComponentDetails && salaryComponentDetails.data.list
  const salaryComponentCount = salaryComponentDetails && salaryComponentDetails.data.count 

  const salaryComponentMappingDetails = useAppSelector((state) => state.salaryComponent.salaryComponentMappingDetails)
  const salaryComponentMappingList = salaryComponentMappingDetails && salaryComponentMappingDetails.data.list

  console.log("salaryComponentList", salaryComponentList)

  const salaryConfigUploadDetails = useAppSelector((state) => state.salaryComponent.salaryConfigUploadDetails);
  const getColumnsDetails = useAppSelector((state) => state.inputModule.getColumnsDetails);
  const salaryExcelHeaderToDbColumnsDetails = useAppSelector((state) => state.salaryComponent.salaryExcelHeaderToDbColumnsDetails);
  const salaryUploadDetails = useAppSelector((state) => state.salaryComponent.salaryUploadDetails);

  const configurationList = salaryConfigUploadDetails && salaryConfigUploadDetails.data.list
  const columnsList = getColumnsDetails && getColumnsDetails.data

  const loading =  salaryComponentMappingDetails.status === 'loading' || salaryComponentDetails.status === 'loading' || salaryUploadDetails.status === 'loading' || salaryConfigUploadDetails.status === 'loading' || getColumnsDetails.status === 'loading' || salaryExcelHeaderToDbColumnsDetails.status === 'loading' || companiesDetails.status === 'loading'

  const [company, setCompany] = React.useState('');
  const [year, setYear] = React.useState('');
  const [month, setMonth] =  React.useState<any>('');
  
  const [activeSort, setActiveSort] = React.useState('companyId')
  const [sortType, setSortType] = React.useState<any>('asc')

  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [page, setPage] = React.useState(0);

  const [openUploadModal, setOpenUploadModal] = React.useState(false);
  const [uploadData, setUploadData] =  React.useState<any>();

  const [openMappingModal, setOpenMappingModal] = React.useState(false);
  const [openPreviewModal, setOpenPreviewModal] = React.useState(false);

  const [tableData, setTableData] = React.useState<any>([])

  const handleChangeCompany = (event:any) => {
    setCompany(event.target.value);
    const payload: any =  { 
      search: '', 
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
    dispatch(getSalaryComponentsDetails(payload))
  };

  const handleChangeEzycompField = (event:any, fieldData: any) => {
    console.log('eve',event)
    const newTableData = tableData.map((each:any) => {
      if(each.id === fieldData.id){
        return {...each, ezcomp_SalaryComponentName: event.value}
      }else{
        return each
      }
    })
    console.log('new tb', newTableData)
    setTableData(newTableData)
  }

  const handleChangeComponentCategory = (event:any, fieldData: any) => {
    console.log('eve',event)
    const newTableData = tableData.map((each:any) => {
      if(each.id === fieldData.id){
        return {...each, compoentCategory: event.value}
      }else{
        return each
      }
    })
    console.log('new tb', newTableData)
    setTableData(newTableData)
  }

  useEffect(() => {
    resetStateValues()
    const companiesPayload: any = { ...DEFAULT_OPTIONS_PAYLOAD, filters: [{ columnName: 'isParent', value: 'true' }] }
    dispatch(getAllCompaniesDetails(companiesPayload))
    const salaryPayload: any = {
      search: "",
      filters: [],
      pagination: {
        pageSize: 10,
        pageNumber: 1
      },
      sort: { columnName: 'companyId', order: 'asc' },
      "includeCentral": true
    }
    
    dispatch(getSalaryComponentsDetails(salaryPayload))
  },[])

  useEffect(() => {
    if(salaryComponentDetails.status === 'succeeded'){

    }else if(salaryComponentDetails.status === 'failed'){
      toast.error(ERROR_MESSAGES.DEFAULT);
      resetSalaryComponentDetails()
    }
  },[salaryComponentDetails.status])

  useEffect(() => {
    if(salaryComponentMappingDetails.status === 'succeeded'){
      if(salaryComponentMappingDetails.data.status !== 'FAILURE'){        
        setTableData(salaryComponentMappingList)
      }
    }else if(salaryComponentMappingDetails.status === 'failed'){
      toast.error(ERROR_MESSAGES.DEFAULT);
      resetSalaryComponentMappingDetails()
    }
  }, [salaryComponentMappingDetails.status])

  useEffect(() => {
    if(salaryUploadDetails.status === 'succeeded'){
      if(salaryUploadDetails.data.key === 'FAILURE'){
        const formData = new FormData();
        const data = uploadData ? uploadData[0] : []
        formData.append('file', data);
        formData.append('Year', year)
        formData.append('Month', month)
        formData.append('CompanyId', company)
        dispatch(salaryComponentConfigUpload(formData))
      }else{
        resetStateValues()
        toast.success(`Upload Successfull`)
      }
    }else if (salaryUploadDetails.status === 'failed'){
      toast.error(ERROR_MESSAGES.DEFAULT);
    }
  }, [salaryUploadDetails.status])

  useEffect(() => {
    if(salaryConfigUploadDetails.status === 'succeeded'){
      if(salaryConfigUploadDetails.data.status === 'FAILURE'){
        toast.error(ERROR_MESSAGES.DEFAULT);
      }else{
        setTableData(salaryConfigUploadDetails.data.list)
        resetUploadDetails()
        dispatch(getColumns('salarycomponent'))
        setOpenUploadModal(false)
        setOpenMappingModal(true)
      }
    }else if (salaryConfigUploadDetails.status === 'failed'){
      toast.error(ERROR_MESSAGES.DEFAULT);
    }
  }, [salaryConfigUploadDetails.status])

  useEffect(() => {
    if(salaryExcelHeaderToDbColumnsDetails.status === 'succeeded'){
      const formData = new FormData();
      const data = uploadData ? uploadData[0] : []
      formData.append('file', data);
      formData.append('Year', year)
      formData.append('Month', month)
      formData.append('CompanyId', company)
      dispatch(salaryComponentUpload(formData))
    }else if(salaryExcelHeaderToDbColumnsDetails.status === 'failed'){
      toast.error(ERROR_MESSAGES.DEFAULT);
    }
  },[salaryExcelHeaderToDbColumnsDetails.status])

  const yearsList = []
  const currentYear = new Date().getFullYear();

  for (let i = currentYear; i >= 1950; i--) {
    yearsList.push(i)
  }

  const monthList = [
    {label: "January", value: "1"},
    {label: "February", value: "2"},
    {label: "March", value: "3"},
    {label: "April", value: "4"},
    {label: "May", value: "5"},
    {label: "June", value: "6"},
    {label: "July", value: "7"},
    {label: "August", value: "8"},
    {label: "September", value: "9"},
    {label: "October", value: "10"},
    {label: "November", value: "11"},
    {label: "December", value: "12"},
  ];

  const onClickUpload = () => {
      setOpenUploadModal(true)
  }

  const onClickSubmitUpload = () => {
    const formData = new FormData();
    const data = uploadData ? uploadData[0] : []
    formData.append('file', data);
    formData.append('Year', year)
    formData.append('Month', month)
    formData.append('CompanyId', company)
    dispatch(salaryComponentUpload(formData))
  }

  const onClickSave = () => {
    console.log('ttabbel', tableData)
    const check = tableData.find((each:any) => (each.ezcomp_SalaryComponentName === null || each.ezcomp_SalaryComponentName === ''))
    if(check){
      return toast.error('Please Select All Ezycomp Fields');
    } else{
      dispatch(callSalaryComponentsExcelHeaderToDbColumns({listSalaryConfigurations : tableData}))
    }
  }

  const onClickPreview = () => {
    if(!company){
      return toast.error('Please Select Company');
    }else{
      const payload = {
        search: '', 
        filters: [
          {
            columnName:'companyId',
            value: company
          }
        ],
        pagination: {
          pageSize: 200,
          pageNumber: 1
        },
        sort: { columnName: 'companyId', order: 'asc' },
        "includeCentral": true
      }
      dispatch(getSalaryComponentsMappingDetails(payload))
      setOpenPreviewModal(true)
    }
  }

  const handleChangePage = (event: unknown, newPage: number) => {

    const filters = []
    if(company){
      filters.push({
        columnName:'companyId',
        value: company
      })
    }

    const payload: any =  { 
      search: '', 
      filters: filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: newPage+1
      },
      sort: { columnName: 'companyId', order: 'asc' },
      "includeCentral": true
    }

    dispatch(getSalaryComponentsDetails(payload))
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

    const payload: any =  { 
      search: '', 
      filters: filters,
      pagination: {
        pageSize: parseInt(event.target.value, 10),
        pageNumber: 1
      },
      sort: { columnName: 'companyId', order: 'asc' },
      "includeCentral": true
    }

    dispatch(getSalaryComponentsDetails(payload))
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const resetUploadDetails = () => {
    dispatch(resetSalaryConfigUploadDetails())
    dispatch(resetSalaryUploadDetails())
  }

  const resetStateValues = () => {
    dispatch(resetSalaryConfigUploadDetails())
    dispatch(resetGetColumnsDetails())
    dispatch(resetSalaryExcelToDBColumnsDetails())
    dispatch(resetSalaryUploadDetails())
    dispatch(resetSalaryComponentMappingDetails())

    setOpenUploadModal(false)
    setOpenMappingModal(false)
    setOpenPreviewModal(false)
    setCompany('')
    setYear('')
    setMonth('')
    setUploadData(null)
    setTableData([])
  }

  console.log(salaryComponentMappingDetails, 'UploadDetails', salaryConfigUploadDetails, salaryUploadDetails, tableData)

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

    const salaryPayload: any = {
      search: '', 
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page + 1
      },
      sort: { columnName: 'employeeCode', order: type },
      "includeCentral": true
    }
    dispatch(getSalaryComponentsDetails(salaryPayload))
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

    const salaryPayload: any = {
      search: '',
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page + 1
      },
      sort: { columnName: 'dateofBirth', order: type },
      "includeCentral": true
    }
    dispatch(getSalaryComponentsDetails(salaryPayload))
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

    const salaryPayload: any = {
      search: '',
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page + 1
      },
      sort: { columnName: 'gender', order: type },
      "includeCentral": true
    }
    dispatch(getSalaryComponentsDetails(salaryPayload))
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

    const salaryPayload: any = {
      search: '',
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page + 1
      },
      sort: { columnName: 'designation', order: type },
      "includeCentral": true
    }
    dispatch(getSalaryComponentsDetails(salaryPayload))
  }

  const onClickSortPanNumber = () => {
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

    const salaryPayload: any = {
      search: '',
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page + 1
      },
      sort: { columnName: 'ctC_PA', order: type },
      "includeCentral": true
    }
    dispatch(getSalaryComponentsDetails(salaryPayload))
  }

  // ctC_PM

  const onClickSortPan = () => {
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

    const salaryPayload: any = {
      search: '',
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page + 1
      },
      sort: { columnName: 'ctC_PM', order: type },
      "includeCentral": true
    }
    dispatch(getSalaryComponentsDetails(salaryPayload))

  }

  const onClickSortMonth = () => {
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

    const salaryPayload: any = {
      search: '',
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page + 1
      },
      sort: { columnName: 'monthly_Gross', order: type },
      "includeCentral": true
    }
    dispatch(getSalaryComponentsDetails(salaryPayload))
  }

  const onClickSortDay = () => {
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

    const salaryPayload: any = {
      search: '',
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page + 1
      },
      sort: { columnName: 'presentDays', order: type },
      "includeCentral": true
    }
    dispatch(getSalaryComponentsDetails(salaryPayload))
  }

  const onClickSortGrossPay = () => {
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

    const salaryPayload: any = {
      search: '',
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page + 1
      },
      sort: { columnName: 'grosspay', order: type },
      "includeCentral": true
    }
    dispatch(getSalaryComponentsDetails(salaryPayload))
  }

  const onClickSortTotal = () => {
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

    const salaryPayload: any = {
      search: '',
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page + 1
      },
      sort: { columnName: 'total_Deductions', order: type },
      "includeCentral": true
    }
    dispatch(getSalaryComponentsDetails(salaryPayload))
  }

  const onClickSortNet = () => {
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

    const salaryPayload: any = {
      search: '',
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page + 1
      },
      sort: { columnName: 'netPayable', order: type },
      "includeCentral": true
    }
    dispatch(getSalaryComponentsDetails(salaryPayload))
  }

  return (
    <div style={{ backgroundColor:'#ffffff', height:'100vh'}}>

      {/* Upload Modal */}
      <Modal
        open={openUploadModal}
        onClose={() => {resetStateValues()}}
      >
        <Box sx={styleUploadModal}>
          <Box sx={{backgroundColor:'#E2E3F8', padding:'10px', px:'20px', borderRadius:'6px', boxShadow: '0px 6px 10px #CDD2D9', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <Typography sx={{font: 'normal normal normal 32px/40px Calibri'}}>Salary Components Upload</Typography>
            <IconButton
              onClick={() => {resetStateValues()}}
            >
              <IoMdClose />
            </IconButton>
          </Box>

          <Box sx={{padding:'20px', backgroundColor:'#ffffff',}}>
            <Box sx={{display:'flex'}}>
              <FormControl sx={{ m: 1, width:"100%", backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                <InputLabel id="demo-select-small-label" sx={{color:'#000000'}}>Company</InputLabel>
                <MSelect
                  labelId="demo-select-small-label"
                  id="demo-select-small"
                  value={company}
                  label="Company"
                  onChange={(e) => {setCompany(e.target.value)}}
                >
                  {companies && companies.map((each:any) => {
                      return <MenuItem value={each.id}>{each.name}</MenuItem>
                  })}
                </MSelect>
              </FormControl>

              <FormControl sx={{ m: 1, width:"100%", backgroundColor:'#ffffff', borderRadius:'5px' }} size="small">
                <InputLabel id="demo-select-small-label" sx={{color:'#000000'}}>Year</InputLabel>
                <MSelect
                  labelId="demo-select-small-label"
                  id="demo-select-small"
                  value={year}
                  label="Year"
                  onChange={(e:any) => setYear(e.target.value)}
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
                  onChange={(e:any) => setMonth(e.target.value)}
                >
                  {monthList && monthList.map((each:any) => 
                    <MenuItem value={each.value}>{each.label}</MenuItem>
                  )}
                </MSelect>
              </FormControl>
            </Box>

              <Box sx={{display:'flex', flexDirection:'column', ml:1, mt:2}}>
                  <Typography mb={1} color={'#0F67B1'} fontWeight={'bold'} sx={{font: 'normal normal normal 24px/28px Calibri'}}>Upload File <span style={{color:'red'}}>*</span></Typography>
                  <input
                    style={{ border:'1px solid #0F67B1', height:'40px', borderRadius:'5px'}}
                    type="file"
                    accept='.xlsx, .xls, .csv'
                    onClick={(e: any) => e.target.value = ''}
                    onChange={(e) => setUploadData(e.target.files)}
                  />
              </Box>
          </Box>

          <Box sx={{display:'flex', justifyContent:'center', alignItems:'center', mt:3}}>
            <Button variant='contained' disabled={!uploadData || !company || !year || !month} onClick={onClickSubmitUpload}>Submit</Button>
          </Box>

          <Box sx={{display:'flex', padding:'20px', borderTop:'1px solid #6F6F6F',justifyContent:'flex-end', alignItems:'center', mt:4}}>
                <Button variant='contained' sx={{backgroundColor:'#707070'}} onClick={() => {resetStateValues()}}>Cancel</Button>
          </Box>
        </Box>
      </Modal>

      {/* Mapping Modal */}
      <Modal
        open={openMappingModal}
        onClose={() => {resetStateValues()}}
      >

        <Box sx={style}> 
            <Box sx={{backgroundColor:'#E2E3F8', padding:'10px', px:'20px', borderRadius:'6px', boxShadow: '0px 6px 10px #CDD2D9', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <Typography sx={{font: 'normal normal normal 32px/40px Calibri'}}>Salary Components Upload</Typography>
              <IconButton
                onClick={() => {resetStateValues()}}
              >
                <IoMdClose />
              </IconButton>
            </Box>

            {tableData &&  tableData.length > 0 && <Box sx={{paddingX: '20px', display: 'flex', flexDirection:'column'}}>
              {
                tableData && tableData.length <= 0 ? 

                <Box sx={{height:'60vh', display:'flex', justifyContent:'center', alignItems:'center'}}>
                  <Typography variant='h5'>No Records Found</Typography>
                </Box>
                : 
                <>
                  <TableContainer sx={{border:'1px solid #e6e6e6', marginTop:'10px', maxHeight:'380px', overflowY:'scroll'}}>
                          <Table stickyHeader  sx={{ minWidth: 650 }} aria-label="sticky table">
                              <TableHead sx={{'.MuiTableCell-root':{ backgroundColor:'#E7EEF7'}}}>
                                  <TableRow>
                                      <TableCell > S.no</TableCell>
                                      <TableCell > Column Name</TableCell>
                                      <TableCell > Column Position</TableCell>
                                      <TableCell > Component Category</TableCell>
                                      <TableCell > Ezycomp Field</TableCell>
                                  </TableRow>
                              </TableHead>

                              <TableBody>

                              {tableData && tableData.map((each: any, index: number) => (
                                  <TableRow
                                  key={each._id}
                                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                  >   
                                      <TableCell >{index+1}</TableCell>
                                      <TableCell >{each.companyExcelHeaderName}</TableCell>
                                      <TableCell >{each.columnPosition}</TableCell>
                                      <TableCell >
                                        <FormControl sx={{ m: 1, width:"100%", maxWidth:'190px', backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                                          <Select
                                            options={['Employee Details', 'Earned Allowances', 'Gross Pay', 'Deductions', 'Others', 'NetPay'].map((each:any) => {return {label : each, value: each}})}
                                            className="basic-multi-select"
                                            classNamePrefix="select"
                                            value={each.compoentCategory ? {label: each.compoentCategory, value: each.compoentCategory} : ''}
                                            styles={customStyles}
                                            onChange={(e) => handleChangeComponentCategory(e, each)}
                                        />
                                      </FormControl>
                                      </TableCell>
                                      <TableCell >
                                        <FormControl sx={{ m: 1, width:"100%", maxWidth:'190px', backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                                          <Select
                                            options={columnsList ? columnsList.map((each:any) => {return {label : each, value: each}}) : []}
                                            className="basic-multi-select"
                                            classNamePrefix="select"
                                            value={each.ezcomp_SalaryComponentName ? {label: each.ezcomp_SalaryComponentName, value: each.ezcomp_SalaryComponentName} : ''}
                                            styles={customStyles}
                                            onChange={(e) => handleChangeEzycompField(e, each)}
                                        />
                                      </FormControl>
                                      </TableCell>
                                     </TableRow>
                              ))}
                              </TableBody>
                          </Table>
                  </TableContainer>
                </>
              }
            </Box>}

            <Box sx={{display:'flex', padding:'20px', borderTop:'1px solid #6F6F6F',justifyContent:'space-between', alignItems:'center', mt:4}}>
              <Button variant='contained' sx={{backgroundColor:'#707070'}} onClick={() => {resetStateValues()}}>Cancel</Button>
              <Button sx={{marginTop:'20px', alignSelf:'flex-end', width:'200px'}} variant='contained' onClick={onClickSave}>Save</Button>  
            </Box>

        </Box>

      </Modal>

      {/* Preview Modal */}
      <Modal
        open={openPreviewModal}
        onClose={() => {resetStateValues()}}
      >

        <Box sx={style}> 
            <Box sx={{backgroundColor:'#E2E3F8', padding:'10px', px:'20px', borderRadius:'6px', boxShadow: '0px 6px 10px #CDD2D9', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <Typography sx={{font: 'normal normal normal 32px/40px Calibri'}}>Salary Components Preview</Typography>
              <IconButton
                onClick={() => {resetStateValues()}}
              >
                <IoMdClose />
              </IconButton>
            </Box>

            <Box sx={{paddingX: '20px', display: 'flex', flexDirection:'column'}}>
              {
                tableData && tableData.length <= 0 ? 

                <Box sx={{height:'60vh', display:'flex', justifyContent:'center', alignItems:'center'}}>
                  <Typography variant='h5'>No Records Found</Typography>
                </Box>
                : 
                <>
                  <TableContainer sx={{border:'1px solid #e6e6e6', marginTop:'10px', maxHeight:'380px', overflowY:'scroll'}}>
                          <Table stickyHeader  sx={{ minWidth: 650 }} aria-label="sticky table">
                              <TableHead sx={{'.MuiTableCell-root':{ backgroundColor:'#E7EEF7'}}}>
                                  <TableRow>
                                      <TableCell > S.no</TableCell>
                                      <TableCell > Column Name</TableCell>
                                      <TableCell > Column Position</TableCell>
                                      <TableCell > Component Category</TableCell>
                                      <TableCell > Ezycomp Field</TableCell>
                                  </TableRow>
                              </TableHead>

                              <TableBody>

                              {tableData && tableData.map((each: any, index: number) => (
                                  <TableRow
                                  key={each._id}
                                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                  >   
                                      <TableCell >{index+1}</TableCell>
                                      <TableCell >{each.companyExcelHeaderName}</TableCell>
                                      <TableCell >{each.columnPosition}</TableCell>
                                      <TableCell >{each.compoentCategory}</TableCell>
                                      <TableCell >{each.ezcomp_SalaryComponentName}</TableCell>
                                     </TableRow>
                              ))}
                              </TableBody>
                          </Table>
                  </TableContainer>
                </>
              }
            </Box>

            <Box sx={{display:'flex', padding:'20px', borderTop:'1px solid #6F6F6F',justifyContent:'space-between', alignItems:'center', mt:4}}>
              <Button variant='contained' sx={{backgroundColor:'#707070'}} onClick={() => {resetStateValues()}}>Cancel</Button>
            </Box>

        </Box>

      </Modal>

      {loading ? <PageLoader>Loading...</PageLoader> : 
        <div >

            {/* Filter Box*/}
            <Box sx={{paddingX: '20px', paddingY:'10px',}}>
              <Box sx={{backgroundColor:'#E2E3F8', paddingX: '20px', paddingY:'10px', borderRadius:'6px', boxShadow: '0px 6px 10px #CDD2D9'}}>
                  <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px', marginTop:'5px'}}>
                      <h5 style={{ font: 'normal normal normal 32px/40px Calibri' }}>Salary Components</h5>
                      <Box sx={{marginRight:'12px', display:'flex', alignItems:'center', width:'260px', justifyContent: 'space-between'}}>
                        <Button onClick={onClickPreview} disabled={!company} variant='contained'> Preview</Button>

                        {
                    hasUserAccess(USER_PRIVILEGES.ADD_SALARY_COMPONENTS) &&
                        <Button onClick={onClickUpload} variant='contained' style={{marginRight:'10px', backgroundColor:'#E9704B', display:'flex', alignItems:'center'}}> <FaUpload /> &nbsp; Upload</Button>
                  }
                        {/* <Button onClick={onClickUpload} variant='contained' style={{marginRight:'10px', backgroundColor:'#E9704B', display:'flex', alignItems:'center'}}> <FaUpload /> &nbsp; Upload</Button> */}
                      </Box>
                  </div>
                  <div style={{display:'flex', marginBottom:'10px'}}>

                    <Box sx={{width:'100%', mr:1}}>
                      <Typography mb={1}>Company</Typography>
                      <FormControl sx={{ width:'100%', maxWidth:'190px', backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                        <MSelect
                          sx={{'.MuiOutlinedInput-notchedOutline': { border: 0 }}}
                          value={company}
                          displayEmpty
                          onChange={handleChangeCompany}
                          MenuProps={{
                            PaperProps:{
                             sx:{
                              maxHeight:200,
                              width:230,
                              marginTop:"3px"
                             }
                            }
                          }}
                        >
                          <MenuItem disabled sx={{display:'none'}} value="">
                            Select Company
                          </MenuItem>
                          {companies && companies.map((each:any) => {
                              return <MenuItem sx={{width:'240px', whiteSpace:'initial'}} value={each.id}>{each.name}</MenuItem>
                          })}
                        </MSelect>
                      </FormControl>
                    </Box>
                  </div>
              </Box>
            </Box>
            
            <Box sx={{paddingX: '20px'}}>
              {
                salaryComponentList && salaryComponentList.length <= 0 ? 

                <Box sx={{height:'60vh', display:'flex', justifyContent:'center', alignItems:'center'}}>
                  <Typography variant='h5'>No Records Found</Typography>
                </Box>
                : 
                <>
                  <TableContainer sx={{border:'1px solid #e6e6e6', marginTop:'10px',  maxHeight:'385px', overflowY:'scroll'}}>
                          <Table stickyHeader  sx={{ minWidth: 650 }} aria-label="sticky table">
                              <TableHead sx={{'.MuiTableCell-root':{ backgroundColor:'#E7EEF7'}}}>
                        <TableRow>
                         
                          <TableCell > <TableSortLabel active={activeSort === 'code'} direction={sortType} onClick={onClickSortCode} >Employee Code</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel active={activeSort === 'dateOfBirth'} direction={sortType} onClick={onClickSortDOB} > DOB</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel active={activeSort === 'gender'} direction={sortType} onClick={onClickSortGender} > Gender</TableSortLabel></TableCell>
                          
                          <TableCell > <TableSortLabel active={activeSort === 'designation'} direction={sortType} onClick={onClickSortDesignation} > Designation</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel active={activeSort === 'panNumber'} direction={sortType} onClick={onClickSortPanNumber} > CTC PA</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel active={activeSort === 'aadharNumber'} direction={sortType} onClick={onClickSortPan} > CTC PM</TableSortLabel></TableCell>
                                      <TableCell > <TableSortLabel active={activeSort === 'aadharNumber'} direction={sortType} onClick={onClickSortMonth} > Monthly Gross</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel active={activeSort === 'aadharNumber'} direction={sortType} onClick={onClickSortDay} > Present Days</TableSortLabel></TableCell>
                          {/* grossPay */}
                          <TableCell > <TableSortLabel active={activeSort === 'aadharNumber'} direction={sortType} onClick={onClickSortGrossPay} > Gross Pay</TableSortLabel></TableCell>
                                      <TableCell > <TableSortLabel active={activeSort === 'aadharNumber'} direction={sortType} onClick={onClickSortTotal} > Total Deductions </TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel active={activeSort === 'aadharNumber'} direction={sortType} onClick={onClickSortNet} > Net Payable </TableSortLabel></TableCell>
                                      {/* <TableCell > Actions</TableCell> */}
                                  </TableRow>
                              </TableHead>

                              <TableBody>
                              {salaryComponentList && salaryComponentList.map((each: any, index: number) => (
                                  <TableRow
                                  key={each._id}
                                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                  >   
                                      <TableCell >{each.employeeCode}</TableCell>
                                      <TableCell >{new Date(each.dateofBirth).toLocaleDateString()}</TableCell>
                                      <TableCell >{each.gender}</TableCell>
                                      <TableCell >{each.designation}</TableCell>
                                      <TableCell >{each.ctC_PA}</TableCell>
                                      <TableCell >{each.ctC_PM}</TableCell>
                                      <TableCell >{each.monthly_Gross}</TableCell>
                                      <TableCell >{each.presentDays}</TableCell>
                                      <TableCell >{each.grossPay}</TableCell>
                                      <TableCell >{each.total_Deductions}</TableCell>
                                      <TableCell >{each.netPayable}</TableCell>
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
                      count={salaryComponentCount}
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

export default SalaryComponents