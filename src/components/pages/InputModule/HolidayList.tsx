import React, { useEffect, useState } from 'react'
import PageLoader from '../../shared/PageLoader'
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import { getAllCompaniesDetails, getAssociateCompanies, getLocations } from '../../../redux/features/inputModule.slice';
import { Box, Button, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, TextField, Typography } from '@mui/material';
import { FaUpload, FaDownload } from "react-icons/fa";
import { IoMdClose, IoMdSearch } from "react-icons/io";
import { DEFAULT_OPTIONS_PAYLOAD, DEFAULT_PAYLOAD } from '../../common/Table';
import { getHolidaysList } from '../../../redux/features/holidayList.slice';
import Icon from '../../common/Icon';

const HolidayList = () => {

  const dispatch = useAppDispatch();

  const holidayListDetails = useAppSelector((state) => state.holidayList.holidayListDetails)
  const companiesDetails = useAppSelector((state) => state.inputModule.companiesDetails);
  const associateCompaniesDetails = useAppSelector((state) => state.inputModule.associateCompaniesDetails);
  const locationsDetails = useAppSelector((state) => state.inputModule.locationsDetails);

  const holidays = holidayListDetails.data.list
  const holidaysCount = holidayListDetails.data.count
  const companies = companiesDetails.data.list
  const associateCompanies = associateCompaniesDetails.data.list
  const locations = locationsDetails.data.list

  const loading = holidayListDetails.status === 'loading' || companiesDetails.status === 'loading' || associateCompaniesDetails.status === 'loading' || locationsDetails.status === 'loading'

  const [company, setCompany] = React.useState('');
  const [associateCompany, setAssociateCompany] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [year, setYear] = React.useState('');
  const [month, setMonth] =  React.useState('');
  const [searchInput, setSearchInput] = React.useState('');
  const [activeSort, setActiveSort] = React.useState('name')
  const [sortType, setSortType] = React.useState<any>('asc')

  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [page, setPage] = React.useState(0);

  const handleChangeCompany = (event:any) => {
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

  useEffect(() => {
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

    const companiesPayload: any = { ...DEFAULT_OPTIONS_PAYLOAD, filters: [{ columnName: 'isParent', value: 'true' }] }
    dispatch(getHolidaysList(HolidayListDefaultPayload))
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
  }, [rowsPerPage, page])


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

  const onClickSortYear = () => {
    let type = 'asc'
    setActiveSort('year'); 
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
      sort: { columnName: 'year', order: type },
      "includeCentral": true
    }
    dispatch(getHolidaysList(HolidayListPayload))
    
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
      sort: { columnName: 'date', order: type },
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

  const onclickEdit = () => {
    console.log('clic')
  }

  const onclickDelete = () => {
    console.log('clic')
  }
 
  const onclickView = () => {
    console.log('clic')
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  

  return (
    <div style={{ height:'100vh', backgroundColor:'#ffffff'}}>
      {loading ? <PageLoader>Loading...</PageLoader> : 
      
        <div>
             <Box sx={{paddingX: '20px', paddingY:'10px',}}>
                <div style={{backgroundColor:'#E2E3F8', padding:'10px', borderRadius:'6px', boxShadow: '0px 6px 10px #CDD2D9'}}>
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px', marginTop:'10px'}}>
                        <h5 style={{marginLeft:'12px', font: 'normal normal normal 32px/40px Calibri' }}>Holiday List</h5>
                        <div style={{marginRight:'12px', display:'flex', alignItems:'center', width:'170px', justifyContent: 'space-between'}}>
                          <Button variant='contained' style={{backgroundColor:'#E9704B', display:'flex', alignItems:'center'}}> <FaUpload /> &nbsp; Upload</Button>
                          <div style={{display:'flex', justifyContent:'center', alignItems:'center', backgroundColor:'#ffffff',color:'#000000', border:'1px solid #000000', width:'40px', height:'30px', borderRadius:'8px'}}> <FaDownload /> </div>
                        </div>
                    </div>
                    <div style={{display:'flex'}}>

                      <FormControl sx={{ m: 1, width:"100%", backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                        <InputLabel id="demo-select-small-label" sx={{color:'#000000'}}>Company</InputLabel>
                        <Select
                          sx={{'.MuiOutlinedInput-notchedOutline': { border: 0 }}}
                          labelId="demo-select-small-label"
                          id="demo-select-small"
                          value={company}
                          label="Company"
                          onChange={handleChangeCompany}
                        >
                          {companies && companies.map((each:any) => {
                              return <MenuItem value={each.id}>{each.name}</MenuItem>
                          })}
                        </Select>
                      </FormControl>

                      <FormControl disabled={!company} sx={{ m: 1, width:"100%", backgroundColor:'#ffffff', borderRadius:'5px' }} size="small">
                        <InputLabel id="demo-select-small-label" sx={{color:'#000000'}}>Associate Company</InputLabel>
                        <Select
                          sx={{'.MuiOutlinedInput-notchedOutline': { border: 0 }}}
                          labelId="demo-select-small-label"
                          id="demo-select-small"
                          value={associateCompany}
                          label="Associate Company"
                          disabled={!company}
                          onChange={handleChangeAssociateCompany}
                        >
                          {associateCompanies && associateCompanies.map((each:any) => {
                              return <MenuItem value={each.id}>{each.name}</MenuItem>
                          })}
                        </Select>
                      </FormControl>

                      <FormControl disabled={!associateCompany} sx={{ m: 1, width:"100%", backgroundColor:'#ffffff', borderRadius:'5px' }} size="small">
                        <InputLabel id="demo-select-small-label" sx={{color:'#000000'}}>Locations</InputLabel>
                        <Select
                          sx={{'.MuiOutlinedInput-notchedOutline': { border: 0 }}}
                          labelId="demo-select-small-label"
                          id="demo-select-small"
                          value={location}
                          label="Locations"
                          disabled={!associateCompany}
                          onChange={handleChangeLocation}
                        >
                          {locations && locations.map((each:any) => {
                              const { id, name, code, cities }: any = each.location || {};
                              const { state } = cities || {};
                              return <MenuItem value={each.locationId}>{`${name} (${state.code}-${cities.code}-${code})`}</MenuItem>
                          })}
                        </Select>
                      </FormControl>

                      <FormControl disabled={!location} sx={{ m: 1, width:"100%", backgroundColor:'#ffffff', borderRadius:'5px' }} size="small">
                        <InputLabel id="demo-select-small-label" sx={{color:'#000000'}}>Year</InputLabel>
                        <Select
                          sx={{'.MuiOutlinedInput-notchedOutline': { border: 0 }}}
                          labelId="demo-select-small-label"
                          id="demo-select-small"
                          value={year}
                          label="Year"
                          disabled={!location}
                          onChange={handleChangeYear}
                        >
                          {yearsList && yearsList.map((each:any) => 
                            <MenuItem value={each}>{each}</MenuItem>
                          )}
                        </Select>
                      </FormControl>
                      
                      <FormControl disabled={!year} sx={{ m: 1, width:"100%", backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                        <InputLabel id="demo-select-small-label" sx={{color:'#000000'}}>Month</InputLabel>
                        <Select
                          sx={{'.MuiOutlinedInput-notchedOutline': { border: 0 }}}
                          labelId="demo-select-small-label"
                          id="demo-select-small"
                          value={month}
                          label="Month"
                          disabled={!year}
                          onChange={handleChangeMonth}
                        >
                          {monthList && monthList.map((each:any) => 
                            <MenuItem value={each}>{each}</MenuItem>
                          )}
                        </Select>
                      </FormControl>

                      <FormControl sx={{ m: 1, width:"100%", backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                        <InputLabel htmlFor="outlined-adornment-password">Search</InputLabel>
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

                    </div>
                </div>
             </Box>

            <Box sx={{paddingX: '20px'}}>
              {
                holidays && holidays.length <= 0 ? 

                <Box sx={{height:'60vh', display:'flex', justifyContent:'center', alignItems:'center'}}>
                  <Typography variant='h5'>No Records Found</Typography>
                </Box>
                : 
                <>
                  <TableContainer sx={{border:'1px solid #e6e6e6', marginTop:'10px', height:'385px', overflowY:'scroll'}}>
                          <Table stickyHeader  sx={{ minWidth: 650 }} aria-label="sticky table">
                              <TableHead sx={{'.MuiTableCell-root':{ backgroundColor:'#E7EEF7'}}}>
                                  <TableRow>
                                      <TableCell > <TableSortLabel active={activeSort === 'year'} direction={sortType} onClick={onClickSortYear}> year</TableSortLabel></TableCell>
                                      <TableCell > <TableSortLabel active={activeSort === 'date'} direction={sortType} onClick={onClickSortDate}> Date</TableSortLabel></TableCell>
                                      <TableCell > <TableSortLabel active={activeSort === 'name'} direction={sortType} onClick={onClickSortName}> Holiday Name</TableSortLabel></TableCell>
                                      <TableCell > <TableSortLabel active={activeSort === 'state'} direction={sortType} onClick={onClickSortState}> State</TableSortLabel></TableCell>
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
                                      <TableCell >{each.year}</TableCell>
                                      <TableCell >{`${each.day}-${each.month > 9 ? each.month : '0'+ each.month}-${each.year}`}</TableCell>
                                      <TableCell >{each.name}</TableCell>
                                      <TableCell >{each.state.name}</TableCell>
                                      <TableCell >{each.restricted ? 'Yes' : 'No'}</TableCell>
                                      <TableCell >
                                        <Box sx={{display:'flex', justifyContent:'space-between', width:'100px'}}>
                                          <Icon action={onclickEdit} style={{color:'#039BE5'}} type="button" name={'pencil'} text={'Edit'}/>
                                          <Icon action={onclickDelete} style={{color:'#EB1010'}} type="button" name={'trash'} text={'Delete'}/>
                                          <Icon action={onclickView}  style={{color:'#00C853'}} type="button" name={'eye'} text={'View'}/>
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
                        },
                        '.MuiTablePagination-displayedRows':{
                          margin:'0',
                          marginLeft:'1000px',
                        },
                        '.MuiTablePagination-selectLabel':{
                          margin:'0',
                        },
                        '.MuiTablePagination-spacer':{
                          display:'none '
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