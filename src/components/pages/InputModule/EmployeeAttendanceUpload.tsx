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
import { useExportEmployees, useExportHolidayList } from '../../../backend/exports';
import { download, downloadFileContent, preventDefault } from '../../../utils/common';
import { ERROR_MESSAGES } from '../../../utils/constants';
import { toast } from 'react-toastify';
import { Alert } from 'react-bootstrap';
import { getEmployees, getEmployeesAttendance } from '../../../redux/features/employeeMaster.slice';

const EmployeeAttendanceUpload = () => {

  const dispatch = useAppDispatch();

  const employeesAttendanceDetails = useAppSelector((state) => state.employeeMaster.employeesAttendanceDetails)

  const companiesDetails = useAppSelector((state) => state.inputModule.companiesDetails);
  const associateCompaniesDetails = useAppSelector((state) => state.inputModule.associateCompaniesDetails);
  const locationsDetails = useAppSelector((state) => state.inputModule.locationsDetails);

  const employeesAttendance = employeesAttendanceDetails.data.list
  const employeesAttendanceCount = employeesAttendanceDetails.data.count 
  console.log("employeesAttendance", employeesAttendance, 'employeesAttendanceCount', employeesAttendanceCount)

  const companies = companiesDetails.data.list
  const associateCompanies = associateCompaniesDetails.data.list
  const locations = locationsDetails.data.list

  const loading =  employeesAttendanceDetails.status === 'loading' || companiesDetails.status === 'loading' || associateCompaniesDetails.status === 'loading' || locationsDetails.status === 'loading'

  const [company, setCompany] = React.useState('');
  const [associateCompany, setAssociateCompany] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [year, setYear] = React.useState('');
  const [month, setMonth] =  React.useState('');

  const [searchInput, setSearchInput] = React.useState('');
  const [activeSort, setActiveSort] = React.useState('code')
  const [sortType, setSortType] = React.useState<any>('asc')

  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [page, setPage] = React.useState(0);

  const handleChangeCompany = (event:any) => {
    setAssociateCompany(''); setLocation(''); setYear(''); setMonth(''); setCompany(event.target.value);
    const payload: any =  { 
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
      sort: { columnName: 'employeeName', order: 'asc' },
      "includeCentral": true
    }
    dispatch(getEmployeesAttendance(payload))
  };

  const handleChangeAssociateCompany = (event:any) => {
    setLocation('')
    setYear('')
    setMonth('')
    setAssociateCompany(event.target.value);
    const payload: any =  { 
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
      sort: { columnName: 'employeeName', order: 'asc' },
      "includeCentral": true
    }
    dispatch(getEmployeesAttendance(payload))
  };

  const handleChangeLocation = (event:any) => {
    setYear('')
    setMonth('')
    setLocation(event.target.value);
    const payload: any =  { 
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
          value: event.target.value.split('^')[0]
        }
      ],
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page+1
      },
      sort: { columnName: 'employeeName', order: 'asc' },
      "includeCentral": true
    }
    dispatch(getEmployeesAttendance(payload))
  };
  
  const handleChangeYear = (event:any) => {
    setYear('')
    setYear(event.target.value.toString());
    const payload: any =  { 
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
          value: event.target.value.toString()
        }
      ],
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page+1
      },
      sort: { columnName: 'employeeName', order: 'asc' },
      "includeCentral": true
    }
    dispatch(getEmployeesAttendance(payload))
  };
  
  const handleChangeMonth = (event:any) => {
    setMonth(event.target.value);
    const monthKey = (monthList.findIndex((each) => each === event.target.value) + 1).toString()
    const payload: any =  { 
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
          value: monthKey
        }
      ],
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page+1
      },
      sort: { columnName: 'employeeName', order: 'asc' },
      "includeCentral": true
    }
    dispatch(getEmployeesAttendance(payload))
  };

  const handleChangeSearchInput = (event:any) => {
    setSearchInput(event.target.value)
  }

  useEffect(() => {
    const employeesAttendancePayload: any =  { 
      search: "",
      filters: [],
      pagination: {
        pageSize: 10,
        pageNumber: 1
      },
      sort: { columnName: 'EmployeeName', order: 'asc' },
      "includeCentral": true
    }

    dispatch(getEmployeesAttendance(employeesAttendancePayload))
    const companiesPayload: any = { ...DEFAULT_OPTIONS_PAYLOAD, filters: [{ columnName: 'isParent', value: 'true' }] }
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
    if(employeesAttendanceDetails.status === 'succeeded'){

    }else if(employeesAttendanceDetails.status === 'failed'){
      toast.error(ERROR_MESSAGES.DEFAULT);
    }
  },[employeesAttendanceDetails.status])

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

  const onClickSearch = () => {
    const payload: any =  { 
      search: searchInput, 
      filters: [],
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page+1
      },
      sort: { columnName: 'employeeName', order: 'asc' },
      "includeCentral": true
    }
    dispatch(getEmployeesAttendance(payload))
  }

  const onClickClearSearch = () => {
    const payload: any =  { 
      search: '', 
      filters: [],
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page+1
      },
      sort: { columnName: 'employeeName', order: 'asc' },
      "includeCentral": true
    }
    dispatch(getEmployeesAttendance(payload))
    setSearchInput('')
  }

  const onClickSortCode = () => {
    let type = 'asc'
    setActiveSort('employeeCode'); 
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
        columnName:'month',
        value: month
      })
    }

    const employeesAttendancePayload: any =  { 
      search: searchInput, 
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page+1
      },
      sort: { columnName: 'employeeCode', order: type },
      "includeCentral": true
    }
    dispatch(getEmployeesAttendance(employeesAttendancePayload))
  }

  const onClickSortName = () => {
    let type = 'asc'
    setActiveSort('employeeName'); 
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
        columnName:'month',
        value: month
      })
    }

    const employeesAttendancePayload: any =  { 
      search: searchInput, 
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page+1
      },
      sort: { columnName: 'employeeName', order: type },
      "includeCentral": true
    }
    dispatch(getEmployeesAttendance(employeesAttendancePayload))
    
  }

  const onClickSortPresentDays = () => {
    let type = 'asc'
    setActiveSort('presentDays'); 
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
        columnName:'month',
        value: month
      })
    }

    const payload: any =  { 
      search: searchInput, 
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page+1
      },
      sort: { columnName: 'presentDays', order: type },
      "includeCentral": true
    }
    dispatch(getEmployeesAttendance(payload))
    
  }
  
  const onClickSortWageMonth = () => {
    let type = 'asc'
    setActiveSort('wageMonth'); 
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
        columnName:'month',
        value: month
      })
    }

    const payload: any =  { 
      search: searchInput, 
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page+1
      },
      sort: { columnName: 'wageMonth', order: type },
      "includeCentral": true
    }
    dispatch(getEmployeesAttendance(payload))
    
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
        columnName:'month',
        value: month
      })
    }


    const employeesAttendancePayload: any =  { 
      search: '', 
      filters: filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: newPage+1
      },
      sort: { columnName: 'EmployeeName', order: 'asc' },
      "includeCentral": true
    }

    dispatch(getEmployeesAttendance(employeesAttendancePayload))
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
        columnName:'month',
        value: month
      })
    }


    const employeesAttendancePayload: any =  { 
      search: '', 
      filters: filters,
      pagination: {
        pageSize: parseInt(event.target.value, 10),
        pageNumber: 1
      },
      sort: { columnName: 'EmployeeName', order: 'asc' },
      "includeCentral": true
    }

    dispatch(getEmployeesAttendance(employeesAttendancePayload))
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div style={{ height:'100vh', backgroundColor:'#ffffff'}}>

      {loading ? <PageLoader>Loading...</PageLoader> : 
      
        <div>
             <Box sx={{paddingX: '20px', paddingY:'10px',}}>
                <div style={{backgroundColor:'#E2E3F8', padding:'20px', borderRadius:'6px', boxShadow: '0px 6px 10px #CDD2D9'}}>
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px', marginTop:'10px'}}>
                        <h5 style={{ font: 'normal normal normal 32px/40px Calibri' }}>Employee Attendance</h5>
                        {/* <button onClick={onClickExport} disabled={!employeesAttendance} style={{display:'flex', justifyContent:'center', alignItems:'center', backgroundColor: !employeesAttendance ? '#707070': '#ffffff' , color: !employeesAttendance ? '#ffffff': '#000000', border:'1px solid #000000', width:'40px', height:'30px', borderRadius:'8px'}}> <FaDownload /> </button> */}
                    </div>
                    <div style={{display:'flex'}}>

                      <Box sx={{mr:1}}>
                        <Typography mb={1}>Company</Typography>
                        <FormControl sx={{ width:'100%', maxWidth:'200px',backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                          <Select
                            sx={{'.MuiOutlinedInput-notchedOutline': { border: 0 }}}
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
                            <MenuItem disabled sx={{display:'none'}} value="">
                              Select Company
                            </MenuItem>
                            {companies && companies.map((each:any) => {
                                return <MenuItem  sx={{ width: '240px', whiteSpace: 'initial' }}  value={each.id}>{each.name}</MenuItem>
                            })}
                          </Select>
                        </FormControl>
                      </Box>

                      <Box sx={{ mr:1}}>
                        <Typography mb={1}>Associate Company</Typography>
                        <FormControl sx={{ width:'100%',maxWidth:'200px', backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
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
                        <Typography mb={1}>Location</Typography>
                        <FormControl sx={{ width:'100%',maxWidth:'200px', backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                          <Select
                            sx={{'.MuiOutlinedInput-notchedOutline': { border: 0 }}}
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
                            <MenuItem disabled sx={{display:'none'}} value="">
                              Select Location
                            </MenuItem>
                            {locations && locations.map((each:any) => {
                              const { id, name, code, cities }: any = each.location || {};
                              const { state } = cities || {};
                              return <MenuItem   sx={{whiteSpace:"initial"}} value={each.locationId+'^'+ state.id}>{`${name} (${state.code}-${cities.code}-${code})`}</MenuItem>
                            })}
                          </Select>
                        </FormControl>
                      </Box>

                      <Box sx={{ mr:1}}>
                        <Typography mb={1}>Year</Typography>
                        <FormControl sx={{ width:'100%',maxWidth:'200px', backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
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
                      </Box>

                      <Box sx={{ mr:1}}>
                        <Typography mb={1}>Month</Typography>
                        <FormControl sx={{ width:'100%', maxWidth:'200px',backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
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
                      </Box>

                      <Box sx={{width:'100%', mr:1}}>
                        <Typography mb={1}>Search</Typography>
                        <FormControl sx={{ width:'100%', backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
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
                employeesAttendance && employeesAttendance.length <= 0 ? 

                <Box sx={{height:'60vh', display:'flex', justifyContent:'center', alignItems:'center'}}>
                  <Typography variant='h5'>No Records Found</Typography>
                </Box>
                : 
                <>
                  <TableContainer sx={{border:'1px solid #e6e6e6', marginTop:'10px',  maxHeight:'385px', overflowY:'scroll'}}>
                          <Table stickyHeader  sx={{ minWidth: 650 }} aria-label="sticky table">
                              <TableHead sx={{'.MuiTableCell-root':{ backgroundColor:'#E7EEF7'}}}>
                                  <TableRow>
                                      <TableCell > <TableSortLabel active={activeSort === 'employeeCode'} direction={sortType} onClick={onClickSortCode}>Employee Code</TableSortLabel></TableCell>
                                      <TableCell > <TableSortLabel active={activeSort === 'employeeName'} direction={sortType} onClick={onClickSortName}> Name</TableSortLabel></TableCell>
                                      <TableCell > <TableSortLabel active={activeSort === 'presentDays'} direction={sortType} onClick={onClickSortPresentDays}> Present Days</TableSortLabel></TableCell>
                                      <TableCell > <TableSortLabel active={activeSort === 'wageMonth'} direction={sortType} onClick={onClickSortWageMonth}> Wage Month</TableSortLabel></TableCell>
                                      <TableCell > <TableSortLabel > Day 1</TableSortLabel></TableCell>
                                      <TableCell > <TableSortLabel > Day 2</TableSortLabel></TableCell>
                                      <TableCell > <TableSortLabel > Day 3</TableSortLabel></TableCell>
                                      <TableCell > <TableSortLabel > Day 4</TableSortLabel></TableCell>
                                      <TableCell > <TableSortLabel > Day 5</TableSortLabel></TableCell>
                                      <TableCell > <TableSortLabel > Day 6</TableSortLabel></TableCell>
                                      <TableCell > <TableSortLabel > Day 7</TableSortLabel></TableCell>
                                      <TableCell > <TableSortLabel > Day 8</TableSortLabel></TableCell>
                                      <TableCell > <TableSortLabel > Day 9</TableSortLabel></TableCell>
                                      <TableCell > <TableSortLabel > Day 10</TableSortLabel></TableCell>
                                      <TableCell > <TableSortLabel > Day 11</TableSortLabel></TableCell>
                                      <TableCell > <TableSortLabel > Day 12</TableSortLabel></TableCell>
                                      <TableCell > <TableSortLabel > Day 13</TableSortLabel></TableCell>
                                      <TableCell > <TableSortLabel > Day 14</TableSortLabel></TableCell>
                                      <TableCell > <TableSortLabel > Day 15</TableSortLabel></TableCell>
                                      <TableCell > <TableSortLabel > Day 16</TableSortLabel></TableCell>
                                      <TableCell > <TableSortLabel > Day 17</TableSortLabel></TableCell>
                                      <TableCell > <TableSortLabel > Day 18</TableSortLabel></TableCell>
                                      <TableCell > <TableSortLabel > Day 19</TableSortLabel></TableCell>
                                      <TableCell > <TableSortLabel > Day 20</TableSortLabel></TableCell>
                                      <TableCell > <TableSortLabel > Day 21</TableSortLabel></TableCell>
                                      <TableCell > <TableSortLabel > Day 22</TableSortLabel></TableCell>
                                      <TableCell > <TableSortLabel > Day 23</TableSortLabel></TableCell>
                                      <TableCell > <TableSortLabel > Day 24</TableSortLabel></TableCell>
                                      <TableCell > <TableSortLabel > Day 25</TableSortLabel></TableCell>
                                      <TableCell > <TableSortLabel > Day 26</TableSortLabel></TableCell>
                                      <TableCell > <TableSortLabel > Day 27</TableSortLabel></TableCell>
                                      <TableCell > <TableSortLabel > Day 28</TableSortLabel></TableCell>
                                      <TableCell > <TableSortLabel > Day 29</TableSortLabel></TableCell>
                                      <TableCell > <TableSortLabel > Day 30</TableSortLabel></TableCell>
                                      <TableCell > <TableSortLabel > Day 31</TableSortLabel></TableCell>
                                      {/* <TableCell > Actions</TableCell> */}
                                  </TableRow>
                              </TableHead>

                              <TableBody>
                              {employeesAttendance && employeesAttendance.map((each: any, index: number) => (
                                  <TableRow
                                  key={each._id}
                                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                  >   
                                      <TableCell >{each.employeeCode}</TableCell>
                                      <TableCell >{each.employeeName}</TableCell>
                                      <TableCell >{each.presentDays}</TableCell>
                                      <TableCell >{each.wageMonth}</TableCell>
                                      <TableCell >{each.day1}</TableCell>
                                      <TableCell >{each.day2}</TableCell>
                                      <TableCell >{each.day3}</TableCell>
                                      <TableCell >{each.day4}</TableCell>
                                      <TableCell >{each.day5}</TableCell>
                                      <TableCell >{each.day6}</TableCell>
                                      <TableCell >{each.day7}</TableCell>
                                      <TableCell >{each.day8}</TableCell>
                                      <TableCell >{each.day9}</TableCell>
                                      <TableCell >{each.day10}</TableCell>
                                      <TableCell >{each.day11}</TableCell>
                                      <TableCell >{each.day12}</TableCell>
                                      <TableCell >{each.day13}</TableCell>
                                      <TableCell >{each.day14}</TableCell>
                                      <TableCell >{each.day15}</TableCell>
                                      <TableCell >{each.day16}</TableCell>
                                      <TableCell >{each.day17}</TableCell>
                                      <TableCell >{each.day18}</TableCell>
                                      <TableCell >{each.day19}</TableCell>
                                      <TableCell >{each.day20}</TableCell>
                                      <TableCell >{each.day21}</TableCell>
                                      <TableCell >{each.day22}</TableCell>
                                      <TableCell >{each.day23}</TableCell>
                                      <TableCell >{each.day24}</TableCell>
                                      <TableCell >{each.day25}</TableCell>
                                      <TableCell >{each.day26}</TableCell>
                                      <TableCell >{each.day27}</TableCell>
                                      <TableCell >{each.day28}</TableCell>
                                      <TableCell >{each.day29}</TableCell>
                                      <TableCell >{each.day30}</TableCell>
                                      <TableCell >{each.day31}</TableCell>

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
                      count={employeesAttendanceCount}
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

export default EmployeeAttendanceUpload