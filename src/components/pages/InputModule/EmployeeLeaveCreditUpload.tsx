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
import { getEmployees, getEmployeesAttendance, getEmployeesLeaveCredit } from '../../../redux/features/employeeMaster.slice';

const EmployeeLeaveCreditUpload = () => {

  const dispatch = useAppDispatch();

  const employeesLeaveCreditDetails = useAppSelector((state) => state.employeeMaster.employeesLeaveCreditDetails)

  const companiesDetails = useAppSelector((state) => state.inputModule.companiesDetails);
  const associateCompaniesDetails = useAppSelector((state) => state.inputModule.associateCompaniesDetails);
  const locationsDetails = useAppSelector((state) => state.inputModule.locationsDetails);

  const employeesLeaveCredit = employeesLeaveCreditDetails.data.list
  const employeesLeaveCreditCount = employeesLeaveCreditDetails.data.count 
  console.log("employeesLeaveCredit", employeesLeaveCredit, 'employeesLeaveCreditCount', employeesLeaveCreditCount)

  const companies = companiesDetails.data.list
  const associateCompanies = associateCompaniesDetails.data.list
  const locations = locationsDetails.data.list

  const loading =  employeesLeaveCreditDetails.status === 'loading' || companiesDetails.status === 'loading' || associateCompaniesDetails.status === 'loading' || locationsDetails.status === 'loading'

console.log('employeesLeaveCreditDetails',employeesLeaveCredit);

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
      sort: { columnName: 'EmployeeCode', order: 'asc' },
      "includeCentral": true
    }
    dispatch(getEmployeesLeaveCredit(payload))
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
      sort: { columnName: 'EmployeeCode', order: 'asc' },
      "includeCentral": true
    }
    dispatch(getEmployeesLeaveCredit(payload))
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
      sort: { columnName: 'EmployeeCode', order: 'asc' },
      "includeCentral": true
    }
    dispatch(getEmployeesLeaveCredit(payload))
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
      sort: { columnName: 'EmployeeCode', order: 'asc' },
      "includeCentral": true
    }
    dispatch(getEmployeesLeaveCredit(payload))
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
      sort: { columnName: 'EmployeeCode', order: 'asc' },
      "includeCentral": true
    }
    dispatch(getEmployeesLeaveCredit(payload))
  };

  const handleChangeSearchInput = (event:any) => {
    setSearchInput(event.target.value)
  }

  useEffect(() => {
    const employeesLeaveCreditPayload: any =  { 
      search: "",
      filters: [],
      pagination: {
        pageSize: 10,
        pageNumber: 1
      },
      sort: { columnName: 'EmployeeCode', order: 'asc' },
      "includeCentral": true
    }

    dispatch(getEmployeesLeaveCredit(employeesLeaveCreditPayload))
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
    if(employeesLeaveCreditDetails.status === 'succeeded'){

    }else if(employeesLeaveCreditDetails.status === 'failed'){
      alert("hittes");
      toast.error(ERROR_MESSAGES.DEFAULT);
    }
  },[employeesLeaveCreditDetails.status])

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
      sort: { columnName: 'EmployeeCode', order: 'asc' },
      "includeCentral": true
    }
    dispatch(getEmployeesLeaveCredit(payload))
  }

  const onClickClearSearch = () => {
    const payload: any =  { 
      search: '', 
      filters: [],
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page+1
      },
      sort: { columnName: 'EmployeeCode', order: 'asc' },
      "includeCentral": true
    }
    dispatch(getEmployeesLeaveCredit(payload))
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

    const payload: any =  { 
      search: searchInput, 
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page+1
      },
      sort: { columnName: 'employeeCode', order: type },
      "includeCentral": true
    }
    dispatch(getEmployeesLeaveCredit(payload))
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
    dispatch(getEmployeesLeaveCredit(payload))
    
  }

  const onClickSortPlElAlCredit = () => {
    let type = 'asc'
    setActiveSort('pL_EL_AL_MonthlyCredit'); 
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
      sort: { columnName: 'pL_EL_AL_MonthlyCredit', order: type },
      "includeCentral": true
    }
    dispatch(getEmployeesLeaveCredit(payload))
    
  }

  const onClickSortSlCredit= () => {
    let type = 'asc'
    setActiveSort('slMonthlyCredit'); 
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
      sort: { columnName: 'slMonthlyCredit', order: type },
      "includeCentral": true
    }
    dispatch(getEmployeesLeaveCredit(payload))
    
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


    const payload: any =  { 
      search: '', 
      filters: filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: newPage+1
      },
      sort: { columnName: 'EmployeeCode', order: 'asc' },
      "includeCentral": true
    }

    dispatch(getEmployeesLeaveCredit(payload))
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


    const payload: any =  { 
      search: '', 
      filters: filters,
      pagination: {
        pageSize: parseInt(event.target.value, 10),
        pageNumber: 1
      },
      sort: { columnName: 'EmployeeCode', order: 'asc' },
      "includeCentral": true
    }

    dispatch(getEmployeesLeaveCredit(payload))
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
                        <h5 style={{ font: 'normal normal normal 32px/40px Calibri' }}>Employee Leave Credit</h5>
                        {/* <button onClick={onClickExport} disabled={!employeesLeaveCredit} style={{display:'flex', justifyContent:'center', alignItems:'center', backgroundColor: !employeesLeaveCredit ? '#707070': '#ffffff' , color: !employeesLeaveCredit ? '#ffffff': '#000000', border:'1px solid #000000', width:'40px', height:'30px', borderRadius:'8px'}}> <FaDownload /> </button> */}
                    </div>
                    <div style={{display:'flex'}}>

                      <Box sx={{ mr:1}}>
                        <Typography mb={1}>Company</Typography>
                        <FormControl sx={{ width:'100%',maxWidth:'200px', backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                          <Select
                            sx={{'.MuiOutlinedInput-notchedOutline': { border: 0 }}}
                            value={company}
                            displayEmpty
                            onChange={handleChangeCompany}
                            MenuProps={{
                              PaperProps: {
                                sx: {
                                  maxHeight: 200,
                                  width: 150,
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
                                return <MenuItem  sx={{ width: '240px', whiteSpace: 'initial' }} value={each.id}>{each.name}</MenuItem>
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
                              return <MenuItem sx={{whiteSpace:"initial"}} value={each.locationId+'^'+ state.id}>{`${name} (${state.code}-${cities.code}-${code})`}</MenuItem>
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
                        <FormControl sx={{ width:'100%',maxWidth:'200px', backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
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

                      <Box sx={{ mr:1}}>
                        <Typography mb={1}>Search (Wage Month)</Typography>
                        <FormControl sx={{ width:'100%',maxWidth:'200px', backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
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
                employeesLeaveCredit && employeesLeaveCredit.length <= 0 ? 

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
                                      <TableCell > <TableSortLabel active={activeSort === 'wageMonth'} direction={sortType} onClick={onClickSortWageMonth}> Wage Year</TableSortLabel></TableCell>
                                      <TableCell > <TableSortLabel active={activeSort === 'wageMonth'} direction={sortType} onClick={onClickSortWageMonth}> Wage Month</TableSortLabel></TableCell>
                                      <TableCell > <TableSortLabel active={activeSort === 'pL_EL_AL_MonthlyCredit'} direction={sortType} onClick={onClickSortPlElAlCredit}> PL-EL-AL Credit</TableSortLabel></TableCell>
                                      <TableCell > <TableSortLabel active={activeSort === 'slMonthlyCredit'} direction={sortType} onClick={onClickSortSlCredit}> SL Credit</TableSortLabel></TableCell>
                                      {/* <TableCell > Actions</TableCell> */}
                                  </TableRow>
                              </TableHead>

                              <TableBody>
                              {employeesLeaveCredit && employeesLeaveCredit.map((each: any, index: number) => (
                                  <TableRow
                                  key={each._id}
                                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                  >   
                                      <TableCell >{each.employeeCode}</TableCell>
                                      <TableCell >{each.year}</TableCell>
                                      <TableCell >{each.wageMonth}</TableCell>
                                      <TableCell >{each.pL_EL_AL_MonthlyCredit}</TableCell>
                                      <TableCell >{each.slMonthlyCredit}</TableCell>
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
                      count={employeesLeaveCreditCount}
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

export default EmployeeLeaveCreditUpload