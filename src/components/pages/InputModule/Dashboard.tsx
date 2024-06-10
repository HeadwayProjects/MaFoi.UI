import React, { useEffect } from 'react'
import PageLoader from '../../shared/PageLoader'
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import { getAllCompaniesDetails, getAssociateCompanies, getLocations, getStates } from '../../../redux/features/inputModule.slice';
import { Box, Button, Drawer, FormControl, FormControlLabel, FormLabel, IconButton, InputAdornment, InputLabel, MenuItem, Modal, OutlinedInput, Radio, RadioGroup, Select, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, TextField, Typography } from '@mui/material';
import { DEFAULT_OPTIONS_PAYLOAD, DEFAULT_PAYLOAD } from '../../common/Table';
import { addHoliday, deleteHoliday, editHoliday, getHolidaysList, resetAddHolidayDetails, resetDeleteHolidayDetails, resetEditHolidayDetails, resetGetHolidayDetailsStatus, resetUploadHolidayDetails, uploadHoliday } from '../../../redux/features/holidayList.slice';

import { ERROR_MESSAGES } from '../../../utils/constants';
import { toast } from 'react-toastify';
import { getEmployeeBackendCount, getEmployeeDashboardCounts, getEmployeeInputDashboard, resetEmployeeBackendCountDetailsStatus, resetEmployeeDashboardCountsDetailsStatus, resetEmployeeInputDashboardDetailsStatus } from '../../../redux/features/dashboard.slice';
import { FaCheck, FaCloudDownloadAlt, FaCloudUploadAlt, FaCode, FaRegEye, FaRegKeyboard } from 'react-icons/fa';
import { FaRegCircleCheck } from 'react-icons/fa6'
import { MdOutput } from "react-icons/md";
import { IoMdClose } from 'react-icons/io';
import { getBasePath } from '../../../App';
import { navigate } from 'raviger';

const Dashboard = () => {

  const dispatch = useAppDispatch();

  const employeeDashboardCountsDetails = useAppSelector((state) => state.inputDashboard.employeeDashboardCountsDetails)
  const employeeInputDashboardDetails = useAppSelector((state) => state.inputDashboard.employeeInputDashboardDetails)
  const employeeBackendCountDetails = useAppSelector((state) => state.inputDashboard.employeeBackendCountDetails)

  const employeeCounts = employeeDashboardCountsDetails &&  employeeDashboardCountsDetails.data
  const inputDashboardList = employeeInputDashboardDetails.data.inputList ? employeeInputDashboardDetails.data.inputList : []

  const companiesDetails = useAppSelector((state) => state.inputModule.companiesDetails);
  const associateCompaniesDetails = useAppSelector((state) => state.inputModule.associateCompaniesDetails);
  const locationsDetails = useAppSelector((state) => state.inputModule.locationsDetails);
  const statesDetails = useAppSelector((state) => state.inputModule.statesDetails);
  const companies = companiesDetails && companiesDetails.data.list
  const associateCompanies = associateCompaniesDetails && associateCompaniesDetails.data.list
  const locations = locationsDetails && locationsDetails.data.list
  let states = locations && locations.map((each:any) => {
    const { id, name, code, cities }: any = each.location || {};
    const { state } = cities || {};
    return {name: state.name, id: state.id}
  })

  states = states && states.filter((each:any, index:any, self:any) => {
    if(index === self.findIndex((t:any) => t.id === each.id)){
      return each
    }
  })
  
  const loading = employeeBackendCountDetails.status === 'loading' || employeeInputDashboardDetails.status === 'loading' || employeeDashboardCountsDetails.status === 'loading' || companiesDetails.status === 'loading' || associateCompaniesDetails.status === 'loading' || locationsDetails.status === 'loading' || statesDetails.status === 'loading'

  const [company, setCompany] = React.useState('');
  const [associateCompany, setAssociateCompany] = React.useState('');
  const [stateName, setStateName] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [year, setYear] = React.useState('');
  const [month, setMonth] =  React.useState<any>('');

  const [showDashboardDetails, setShowDashboardDetails] = React.useState(false);

  const handleChangeCompany = (event:any) => {
    setShowDashboardDetails(false)
    setAssociateCompany('')
    setStateName('')
    setLocation('')
    setYear('')
    setMonth('')
    setCompany(event.target.value);
  };

  const handleChangeAssociateCompany = (event:any) => {
    setShowDashboardDetails(false)
    setLocation('')
    setYear('')
    setMonth('')
    setAssociateCompany(event.target.value);
  };

  const handleChangeStateName = (event:any) => {
    setShowDashboardDetails(false)
    setYear('')
    setMonth('')
    setLocation('')
    setStateName(event.target.value);
  }

  const handleChangeLocation = (event:any) => {
    setShowDashboardDetails(false)
    setYear('')
    setMonth('')
    setLocation(event.target.value);
  };
  
  const handleChangeYear = (event:any) => {
    setShowDashboardDetails(false)
    setMonth('')
    setYear(event.target.value.toString());
  };
  
  const handleChangeMonth = (event:any) => {
    setShowDashboardDetails(false)
    setMonth(event.target.value);
    const dashboardPayloadDefault: any =  { 
      companyId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      associateCompanyId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      locationId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      stateId: '3fa85f64-5717-4562-b3fc-2c963f66afa6', 
      year: 0, 
      month: 'string',
    }

    const dashboardPayload: any =  { 
      companyId: company,
      associateCompanyId: associateCompany,
      locationId: location,
      stateId: stateName, 
      year: year, 
      month: event.target.value,
    }

    dispatch(getEmployeeDashboardCounts(dashboardPayload))
    dispatch(getEmployeeInputDashboard(dashboardPayload))
    dispatch(getEmployeeBackendCount(dashboardPayload))
  };

  useEffect(() => {
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
    const payload:any = {
      ...DEFAULT_OPTIONS_PAYLOAD, filters: [
          { columnName: 'companyId', value: associateCompany }],
      sort: { columnName: 'locationName', order: 'asc' }
    }
    const statesPayload = {...DEFAULT_OPTIONS_PAYLOAD} 

    if(associateCompany){
      dispatch(getLocations(payload))
      dispatch(getStates(statesPayload))
    }
  }, [associateCompany])

  useEffect(() => {
    if(employeeDashboardCountsDetails.status === 'succeeded' || employeeInputDashboardDetails.status === 'succeeded' || employeeBackendCountDetails.status === 'succeeded'){
      setShowDashboardDetails(true)
    }
    if(employeeDashboardCountsDetails.status === 'succeeded'){
      
    }else if(employeeDashboardCountsDetails.status === 'failed' || employeeInputDashboardDetails.status === 'failed' || employeeBackendCountDetails.status === 'failed'){
      toast.error(ERROR_MESSAGES.DEFAULT);
      resetEmployeeDashboardCountsDetailsStatus()
      resetEmployeeInputDashboardDetailsStatus()
      resetEmployeeBackendCountDetailsStatus()
    }

  },[employeeBackendCountDetails.status, employeeInputDashboardDetails.status, employeeDashboardCountsDetails.status])

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

  const onClickEmployeeUploadPreview = () => {
    navigate(`${getBasePath()}/inputUploads/employeeMasterUpload`);
  }

  const onClickLeaveAvailedPreview = () => {
    navigate(`${getBasePath()}/inputUploads/employeeLeaveAvailedUpload`);
  }

  const onClickleaveCreditedPreview = () => {
    navigate(`${getBasePath()}/inputUploads/employeeLeaveCreditUpload`);
  }

  const onClickEmployeeWagePreview = () => {
    navigate(`${getBasePath()}/inputUploads/employeeWageUpload`);
  }

  const onClickEmployeeAttendancePreview = () => {
    navigate(`${getBasePath()}/inputUploads/employeeAttendanceUpload`);
  }
  

  return (
    <div style={{ backgroundColor:'#ffffff', minHeight:'100vh'}}>
      {loading ? <PageLoader>Loading...</PageLoader> : 
        <div style={{paddingBottom:'100px'}}>

            {/* Filter Box*/}
            <Box sx={{paddingX: '20px', paddingY:'10px',}}>
              <div style={{backgroundColor:'#E2E3F8', padding:'20px', borderRadius:'6px', boxShadow: '0px 6px 10px #CDD2D9'}}>
                  <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px', marginTop:'10px'}}>
                      <h5 style={{ font: 'normal normal normal 32px/40px Calibri' }}>Register Module</h5>
                  </div>
                  <div style={{display:'flex'}}>

                    <Box sx={{width:'100%', mr:1}}>
                      <Typography mb={1}>Company</Typography>
                      <FormControl sx={{ width:'100%', maxWidth:'200px', backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
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
                              return <MenuItem sx={{width:'240px', whiteSpace:'initial'}} value={each.id}>{each.name}</MenuItem>
                          })}
                        </Select>
                      </FormControl>
                    </Box>

                    <Box sx={{width:'100%', mr:1}}>
                      <Typography mb={1}>Associate Company</Typography>
                      <FormControl sx={{ width:'100%', maxWidth:'200px', backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
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

                    <Box sx={{width:'100%', mr:1}}>
                      <Typography mb={1}>States</Typography>
                      <FormControl sx={{ width:'100%', maxWidth:'200px', backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                        <Select
                          sx={{'.MuiOutlinedInput-notchedOutline': { border: 0 }}}
                          displayEmpty
                          value={stateName}
                          disabled={!associateCompany}
                          onChange={handleChangeStateName}
                        >
                          <MenuItem disabled sx={{display:'none'}} value="">
                            Select State
                          </MenuItem>
                          {states && states.map((each:any) => {
                            return <MenuItem value={each.id}>{each.name}</MenuItem>
                          })}
                        </Select>
                      </FormControl>
                    </Box>

                    <Box sx={{width:'100%', mr:1}}>
                      <Typography mb={1}>Location</Typography>
                      <FormControl sx={{ width:'100%', maxWidth:'200px', backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                        <Select
                          sx={{'.MuiOutlinedInput-notchedOutline': { border: 0 }}}
                          displayEmpty
                          value={location}
                          disabled={!stateName}
                          onChange={handleChangeLocation}
                        >
                          <MenuItem disabled sx={{display:'none'}} value="">
                            Select Location
                          </MenuItem>
                          {locations && locations.map((each:any) => {
                            const { id, name, code, cities }: any = each.location || {};
                            const { state } = cities || {};
                            if(state.id === stateName){
                              return <MenuItem value={each.locationId}>{`${name} (${state.code}-${cities.code}-${code})`}</MenuItem>
                            }
                          })}
                        </Select>
                      </FormControl>
                    </Box>

                    <Box sx={{width:'100%', mr:1}}>
                      <Typography mb={1}>Year</Typography>
                      <FormControl sx={{ width:'100%', maxWidth:'200px', backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                        <Select
                          sx={{'.MuiOutlinedInput-notchedOutline': { border: 0 }}}
                          displayEmpty
                          value={year}
                          disabled={!location}
                          onChange={handleChangeYear}
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

                    <Box sx={{width:'100%', mr:1}}>
                      <Typography mb={1}>Month</Typography>
                      <FormControl sx={{ width:'100%', maxWidth:'200px', backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                        <Select
                          sx={{'.MuiOutlinedInput-notchedOutline': { border: 0 }}}
                          displayEmpty
                          value={month}
                          disabled={!year}
                          onChange={handleChangeMonth}
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
                  </div>
              </div>
            </Box>

            {/* Counts Box*/}
            {showDashboardDetails && <Box sx={{paddingX: '20px', mt:2, display:'flex', justifyContent:'space-between'}}>
                
                {/* Employees Count*/}
                <Box sx={{width: '40%', background:'#EFEBFE 0% 0% no-repeat padding-box', borderRadius:'10px', border:'1px solid #E1DEEF'}}>

                    <Box sx={{ padding:'10px', display:'flex', justifyContent:'space-between'}}>
                      <Typography sx={{font: 'normal normal normal 22px/32px Calibri', color:'#0F105E'}}>Employees</Typography>
                      <Typography sx={{font: 'normal normal bold 22px/32px Calibri', color:'#0F105E'}}>{employeeCounts.employeeTotal ? employeeCounts.employeeTotal : "NA"}</Typography> 
                    </Box>

                    <Box sx={{borderBottom:'1px solid #707070', opacity:'0.1'}}></Box>

                    <Box sx={{display:'flex', justifyContent:'space-between'}}>
                          <Box sx={{padding:'10px'}}>
                            <Typography sx={{font: 'normal normal normal 22px/32px Calibri', color:'#6F6F6F'}}>New</Typography>
                            <Typography sx={{font: 'normal normal bold 22px/32px Calibri', color:'#0F105E'}}>{employeeCounts.employeeNewCount ? employeeCounts.employeeNewCount : "NA"}</Typography> 
                          </Box>
                          <Box sx={{borderRight:'1px solid #707070', opacity:'0.1'}}></Box>

                          <Box sx={{padding:'10px'}}>
                            <Typography sx={{font: 'normal normal normal 22px/32px Calibri', color:'#6F6F6F'}}>Existing</Typography>
                            <Typography sx={{font: 'normal normal bold 22px/32px Calibri', color:'#0F105E'}}>{employeeCounts.employeeExistingCount ? employeeCounts.employeeExistingCount : "NA"}</Typography> 
                          </Box>
                          <Box sx={{borderRight:'1px solid #707070', opacity:'0.1'}}></Box>

                          <Box sx={{padding:'10px'}}>
                            <Typography sx={{font: 'normal normal normal 22px/32px Calibri', color:'#6F6F6F'}}>Resigned</Typography>
                            <Typography sx={{font: 'normal normal bold 22px/32px Calibri', color:'#0F105E'}}>{employeeCounts.employeeResingedCount ? employeeCounts.employeeResingedCount : "NA"}</Typography> 
                          </Box>
                          <Box sx={{borderRight:'1px solid #707070', opacity:'0.1'}}></Box>

                          <Box sx={{padding:'10px'}}>
                            <Typography sx={{font: 'normal normal normal 22px/32px Calibri', color:'#6F6F6F'}}>Male</Typography>
                            <Typography sx={{font: 'normal normal bold 22px/32px Calibri', color:'#0F105E'}}>{employeeCounts.maleCount ? employeeCounts.maleCount : "NA" }</Typography> 
                          </Box>
                          <Box sx={{borderRight:'1px solid #707070', opacity:'0.1'}}></Box>

                          <Box sx={{padding:'10px'}}>
                            <Typography sx={{font: 'normal normal normal 22px/32px Calibri', color:'#6F6F6F'}}>Female</Typography>
                            <Typography sx={{font: 'normal normal bold 22px/32px Calibri', color:'#0F105E'}}>{employeeCounts.femaleCount ? employeeCounts.femaleCount : "NA"}</Typography> 
                          </Box>
                          <Box sx={{borderRight:'1px solid #707070', opacity:'0.1'}}></Box>

                    </Box>
                </Box>

                {/* Leaves Count*/}
                <Box sx={{width: '29%', background:'#EAF7FF 0% 0% no-repeat padding-box', borderRadius:'10px', border:'1px solid #E1DEEF'}}>

                    <Box sx={{ padding:'10px', display:'flex', justifyContent:'space-between'}}>
                      <Typography sx={{font: 'normal normal normal 22px/32px Calibri', color:'#0F105E'}}>Leave and Attendance</Typography>
                    </Box>
                    <Box sx={{borderBottom:'1px solid #707070', opacity:'0.1'}}></Box>

                    <Box sx={{display:'flex', justifyContent:'space-between'}}>
                          <Box sx={{padding:'10px'}}>
                            <Typography sx={{font: 'normal normal normal 22px/32px Calibri', color:'#6F6F6F'}}>Credit</Typography>
                            <Typography sx={{font: 'normal normal bold 22px/32px Calibri', color:'#0F105E'}}>{employeeCounts.leaveCreditCount ? employeeCounts.leaveCreditCount : "NA"}</Typography> 
                          </Box>
                          <Box sx={{borderRight:'1px solid #707070', opacity:'0.1'}}></Box>

                          <Box sx={{padding:'10px'}}>
                            <Typography sx={{font: 'normal normal normal 22px/32px Calibri', color:'#6F6F6F'}}>Availed</Typography>
                            <Typography sx={{font: 'normal normal bold 22px/32px Calibri', color:'#0F105E'}}>{employeeCounts.leaveUpdateCount ? employeeCounts.leaveUpdateCount : "NA"}</Typography> 
                          </Box>
                          <Box sx={{borderRight:'1px solid #707070', opacity:'0.1'}}></Box>

                          <Box sx={{padding:'10px'}}>
                            <Typography sx={{font: 'normal normal normal 22px/32px Calibri', color:'#6F6F6F'}}>Attendance</Typography>
                            <Typography sx={{font: 'normal normal bold 22px/32px Calibri', color:'#0F105E'}}>{employeeCounts.attendancePercentage ? employeeCounts.attendancePercentage : "NA"}</Typography> 
                          </Box>
                          <Box sx={{borderRight:'1px solid #707070', opacity:'0.1'}}></Box>

                    </Box>
                </Box>

                {/* Wages Count*/}
                <Box sx={{width: '29%', background:'#E7EEF7 0% 0% no-repeat padding-box', borderRadius:'10px', border:'1px solid #E1DEEF'}}>

                  <Box sx={{ padding:'10px', display:'flex', justifyContent:'space-between'}}>
                    <Typography sx={{font: 'normal normal normal 22px/32px Calibri', color:'#0F105E'}}>Wage</Typography>
                    <Typography sx={{font: 'normal normal bold 22px/32px Calibri', color:'#0F105E'}}>{employeeCounts.wageTotal ? employeeCounts.wageTotal : "NA"}</Typography> 
                  </Box>
                  <Box sx={{borderBottom:'1px solid #707070', opacity:'0.1'}}></Box>

                  <Box sx={{display:'flex', justifyContent:'space-between'}}>
                        <Box sx={{padding:'10px'}}>
                          <Typography sx={{font: 'normal normal normal 22px/32px Calibri', color:'#6F6F6F'}}>New</Typography>
                          <Typography sx={{font: 'normal normal bold 22px/32px Calibri', color:'#0F105E'}}>{employeeCounts.wageNewCount ? employeeCounts.wageNewCount : "NA"}</Typography> 
                        </Box>
                        <Box sx={{borderRight:'1px solid #707070', opacity:'0.1'}}></Box>

                        <Box sx={{padding:'10px'}}>
                          <Typography sx={{font: 'normal normal normal 22px/32px Calibri', color:'#6F6F6F'}}>Resigned</Typography>
                          <Typography sx={{font: 'normal normal bold 22px/32px Calibri', color:'#0F105E'}}>{employeeCounts.wageResignedCount ? employeeCounts.wageResignedCount : "NA"}</Typography> 
                        </Box>
                        <Box sx={{borderRight:'1px solid #707070', opacity:'0.1'}}></Box>

                        <Box sx={{padding:'10px'}}>
                          <Typography sx={{font: 'normal normal normal 22px/32px Calibri', color:'#6F6F6F'}}>F & F</Typography>
                          <Typography sx={{font: 'normal normal bold 22px/32px Calibri', color:'#0F105E'}}>{employeeCounts.wageFandFCount ? employeeCounts.wageFandFCount : "NA"}</Typography> 
                        </Box>
                        <Box sx={{borderRight:'1px solid #707070', opacity:'0.1'}}></Box>

                  </Box>
                </Box>

            </Box>}

            {/* Status Box */}
            {showDashboardDetails && <Box sx={{paddingX: '20px', color:'#F3F4F8', mt:2, }}>
              <Box sx={{display:'flex', justifyContent:'space-between', width:'100%', padding:'15px', background:'#EFEBFE 0% 0% no-repeat padding-box', boxShadow:'0px 6px 10px #00000029', borderRadius:'8px'}}>
                
                {/* Input Box */}
                <Box sx={{width:'25%', display:'flex', flexDirection:'column', alignItems:'center'}}>
                  <Box sx={{padding:'20px', width:'100%', height:'330px', background:'#1364FF 0% 0% no-repeat padding-box', boxShadow:'0px 6px 10px #00000029', borderRadius:'10px'}}>
                      
                      <Box sx={{display:'flex', alignItems:'center'}}>
                        <FaRegKeyboard style={{fontSize:'28px'}}/>
                        <Typography ml={2}> Input</Typography>
                      </Box>
                      
                      {inputDashboardList.length > 0 ? 
                        inputDashboardList.map((each:any) => {
                            let redirectFunction = onClickEmployeeUploadPreview
                            if(each.inputFiletype === 'Employee master'){
                              redirectFunction = onClickEmployeeUploadPreview
                            }else if(each.inputFiletype === 'Leave avail'){
                              redirectFunction = onClickLeaveAvailedPreview
                            }else if(each.inputFiletype === 'Leave credit'){
                              redirectFunction = onClickleaveCreditedPreview
                            }else if(each.inputFiletype === 'Employee Wage'){
                              redirectFunction = onClickEmployeeWagePreview
                            }else if(each.inputFiletype === 'Employee Attendance'){
                              redirectFunction = onClickEmployeeAttendancePreview
                            }
                            return (
                              <Box mt={1} sx={{display:'flex', justifyContent:'space-between', background:'#24C58A4D 0% 0% no-repeat padding-box', borderRadius:'8px', border:'1px solid #24C58A'}}>
                                                  <Typography padding={'8px'}> {each.inputFiletype}</Typography>
                                                  {each.status === 'Success' ? 
                                                    <Box sx={{display:'flex'}}>
                                                      <Box sx={{padding:'8px', background:'#05B474 0% 0% no-repeat padding-box', borderRadius:'8px', mr:1}}>
                                                        <FaCheck style={{fontSize:'20px'}}/>
                                                      </Box>
                                                      <Box sx={{padding:'8px', cursor:'pointer', background:'#0654AD 0% 0% no-repeat padding-box', borderRadius:'8px'}} onClick={redirectFunction}>
                                                        <FaRegEye style={{fontSize:'20px'}}/>
                                                      </Box>
                                                    </Box>
                                                    : 
                                                    <Box sx={{display:'flex'}}>
                                                      <Box sx={{padding:'8px', background:'#F11919 0% 0% no-repeat padding-box', borderRadius:'8px', mr:1}}>
                                                        <IoMdClose style={{fontSize:'20px'}}/>
                                                      </Box>
                                                      <Box sx={{padding:'8px', background:'#0654AD 0% 0% no-repeat padding-box', borderRadius:'8px'}}>
                                                        <FaCloudDownloadAlt style={{fontSize:'20px'}}/>
                                                      </Box>
                                                    </Box>
                                                  }
                                                </Box>
                            )
                        }) 
                        :
                        <Box>
                        <Typography mt={10} ml={12}> NA</Typography>
                        </Box>
                      }

                      {/* <Box mt={2} sx={{display:'flex', justifyContent:'space-between', background:'#24C58A4D 0% 0% no-repeat padding-box', borderRadius:'8px', border:'1px solid #24C58A'}}>
                        <Typography padding={'8px'}> Employee Upload</Typography>
                        {true ? 
                          <Box sx={{display:'flex'}}>
                            <Box sx={{padding:'8px', background:'#05B474 0% 0% no-repeat padding-box', borderRadius:'8px', mr:1}}>
                              <FaCheck style={{fontSize:'20px'}}/>
                            </Box>
                            <Box sx={{padding:'8px', cursor:'pointer', background:'#0654AD 0% 0% no-repeat padding-box', borderRadius:'8px'}} onClick={onClickEmployeeUploadPreview}>
                              <FaRegEye style={{fontSize:'20px'}}/>
                            </Box>
                          </Box>
                          : 
                          <Box sx={{display:'flex'}}>
                            <Box sx={{padding:'8px', background:'#F11919 0% 0% no-repeat padding-box', borderRadius:'8px', mr:1}}>
                              <IoMdClose style={{fontSize:'20px'}}/>
                            </Box>
                            <Box sx={{padding:'8px', background:'#0654AD 0% 0% no-repeat padding-box', borderRadius:'8px'}}>
                              <FaCloudDownloadAlt style={{fontSize:'20px'}}/>
                            </Box>
                          </Box>
                        }
                      </Box>

                      <Box mt={1} sx={{display:'flex', justifyContent:'space-between', background:'#24C58A4D 0% 0% no-repeat padding-box', borderRadius:'8px', border:'1px solid #24C58A'}}>
                        <Typography padding={'8px'}> Leave Credit</Typography>
                        {true ? 
                          <Box sx={{display:'flex'}}>
                            <Box sx={{padding:'8px', background:'#05B474 0% 0% no-repeat padding-box', borderRadius:'8px', mr:1}}>
                              <FaCheck style={{fontSize:'20px'}}/>
                            </Box>
                            <Box sx={{padding:'8px', cursor:'pointer', background:'#0654AD 0% 0% no-repeat padding-box', borderRadius:'8px'}} onClick={onClickleaveCreditedPreview}>
                              <FaRegEye style={{fontSize:'20px'}}/>
                            </Box>
                          </Box>
                          : 
                          <Box sx={{display:'flex'}}>
                            <Box sx={{padding:'8px', background:'#F11919 0% 0% no-repeat padding-box', borderRadius:'8px', mr:1}}>
                              <IoMdClose style={{fontSize:'20px'}}/>
                            </Box>
                            <Box sx={{padding:'8px', background:'#0654AD 0% 0% no-repeat padding-box', borderRadius:'8px'}}>
                              <FaCloudDownloadAlt style={{fontSize:'20px'}}/>
                            </Box>
                          </Box>
                        }
                      </Box>

                      <Box mt={1} sx={{display:'flex', justifyContent:'space-between', background:'#24C58A4D 0% 0% no-repeat padding-box', borderRadius:'8px', border:'1px solid #24C58A'}}>
                        <Typography padding={'8px'}>Leave Availed</Typography>
                        {true ? 
                          <Box sx={{display:'flex'}}>
                            <Box sx={{padding:'8px', background:'#05B474 0% 0% no-repeat padding-box', borderRadius:'8px', mr:1}}>
                              <FaCheck style={{fontSize:'20px'}}/>
                            </Box>
                            <Box sx={{padding:'8px', cursor:'pointer', background:'#0654AD 0% 0% no-repeat padding-box', borderRadius:'8px'}} onClick={onClickLeaveAvailedPreview}>
                              <FaRegEye style={{fontSize:'20px'}}/>
                            </Box>
                          </Box>
                          : 
                          <Box sx={{display:'flex'}}>
                            <Box sx={{padding:'8px', background:'#F11919 0% 0% no-repeat padding-box', borderRadius:'8px', mr:1}}>
                              <IoMdClose style={{fontSize:'20px'}}/>
                            </Box>
                            <Box sx={{padding:'8px', background:'#0654AD 0% 0% no-repeat padding-box', borderRadius:'8px'}}>
                              <FaCloudDownloadAlt style={{fontSize:'20px'}}/>
                            </Box>
                          </Box>
                        }
                      </Box>

                      <Box mt={1} sx={{display:'flex', justifyContent:'space-between', background:'#24C58A4D 0% 0% no-repeat padding-box', borderRadius:'8px', border:'1px solid #24C58A'}}>
                        <Typography padding={'8px'}>Employee Wage</Typography>
                        {true ? 
                          <Box sx={{display:'flex'}}>
                            <Box sx={{padding:'8px', background:'#05B474 0% 0% no-repeat padding-box', borderRadius:'8px', mr:1}}>
                              <FaCheck style={{fontSize:'20px'}}/>
                            </Box>
                            <Box sx={{padding:'8px', cursor:'pointer', background:'#0654AD 0% 0% no-repeat padding-box', borderRadius:'8px'}} onClick={onClickEmployeeWagePreview}>
                              <FaRegEye style={{fontSize:'20px'}}/>
                            </Box>
                          </Box>
                          : 
                          <Box sx={{display:'flex'}}>
                            <Box sx={{padding:'8px', background:'#F11919 0% 0% no-repeat padding-box', borderRadius:'8px', mr:1}}>
                              <IoMdClose style={{fontSize:'20px'}}/>
                            </Box>
                            <Box sx={{padding:'8px', background:'#0654AD 0% 0% no-repeat padding-box', borderRadius:'8px'}}>
                              <FaCloudDownloadAlt style={{fontSize:'20px'}}/>
                            </Box>
                          </Box>
                        }
                      </Box>

                      <Box mt={1} sx={{display:'flex', justifyContent:'space-between', background:'#24C58A4D 0% 0% no-repeat padding-box', borderRadius:'8px', border:'1px solid #24C58A'}}>
                        <Typography padding={'8px'}> Employee Attendance</Typography>
                        {true ? 
                          <Box sx={{display:'flex'}}>
                            <Box sx={{padding:'8px', background:'#05B474 0% 0% no-repeat padding-box', borderRadius:'8px', mr:1}}>
                              <FaCheck style={{fontSize:'20px'}}/>
                            </Box>
                            <Box sx={{padding:'8px', cursor:'pointer', background:'#0654AD 0% 0% no-repeat padding-box', borderRadius:'8px'}} onClick={onClickEmployeeAttendancePreview}>
                              <FaRegEye style={{fontSize:'20px'}}/>
                            </Box>
                          </Box>
                          : 
                          <Box sx={{display:'flex'}}>
                            <Box sx={{padding:'8px', background:'#F11919 0% 0% no-repeat padding-box', borderRadius:'8px', mr:1}}>
                              <IoMdClose style={{fontSize:'20px'}}/>
                            </Box>
                            <Box sx={{padding:'8px', background:'#0654AD 0% 0% no-repeat padding-box', borderRadius:'8px'}}>
                              <FaCloudDownloadAlt style={{fontSize:'20px'}}/>
                            </Box>
                          </Box>
                        }
                      </Box> */}

                  </Box>
                  
                  <Button sx={{mt:2, width:'90%'}} variant='outlined'>
                    {/* <Typography padding={'8px'} color={'#0654AD'}> Process Registers</Typography> */}
                    Process Registers
                  </Button>

                </Box>

                {/* Check list Box */}
                <Box sx={{width:'24%', display:'flex', flexDirection:'column', alignItems:'center'}}>
                  
                  <Box sx={{padding:'20px', width:'100%', height:'330px', background:'#222385 0% 0% no-repeat padding-box', boxShadow:'0px 6px 10px #00000029', borderRadius:'10px'}}>
                      <Box sx={{display:'flex', alignItems:'center'}}>
                        <FaRegCircleCheck style={{fontSize:'28px'}}/>
                        <Typography ml={2}> Check List</Typography>
                      </Box>

                      <Box mt={2} sx={{display:'flex', justifyContent:'space-between', alignItems:'center', background:'#055FC64D 0% 0% no-repeat padding-box', borderRadius:'8px', border:'1px solid #055FC6'}}>
                        <Typography padding={'8px'}> Employee Pan</Typography>
                        <Box sx={{padding:'8px', background:'#0654AD 0% 0% no-repeat padding-box', borderRadius:'8px'}}>
                          <FaCloudUploadAlt style={{fontSize:'20px'}}/>
                        </Box>
                      </Box>
                      
                      <Box mt={1} sx={{display:'flex', justifyContent:'space-between', alignItems:'center', background:'#055FC64D 0% 0% no-repeat padding-box', borderRadius:'8px', border:'1px solid #055FC6'}}>
                        <Typography padding={'8px'}> Aadhar</Typography>
                        <Box sx={{padding:'8px', background:'#0654AD 0% 0% no-repeat padding-box', borderRadius:'8px'}}>
                          <FaCloudUploadAlt style={{fontSize:'20px'}}/>
                        </Box>
                      </Box>

                      <Box mt={1} sx={{display:'flex', justifyContent:'space-between', alignItems:'center', background:'#055FC64D 0% 0% no-repeat padding-box', borderRadius:'8px', border:'1px solid #055FC6'}}>
                        <Typography padding={'8px'}> Gender</Typography>
                        <Box sx={{padding:'8px', background:'#0654AD 0% 0% no-repeat padding-box', borderRadius:'8px'}}>
                          <FaCloudUploadAlt style={{fontSize:'20px'}}/>
                        </Box>
                      </Box>

                      <Box mt={1} sx={{display:'flex', justifyContent:'space-between', alignItems:'center', background:'#055FC64D 0% 0% no-repeat padding-box', borderRadius:'8px', border:'1px solid #055FC6'}}>
                        <Typography padding={'8px'}> DOB</Typography>
                        <Box sx={{padding:'8px', background:'#0654AD 0% 0% no-repeat padding-box', borderRadius:'8px'}}>
                          <FaCloudUploadAlt style={{fontSize:'20px'}}/>
                        </Box>
                      </Box>

                      <Box mt={1} sx={{display:'flex', justifyContent:'space-between',  alignItems:'center', background:'#055FC64D 0% 0% no-repeat padding-box', borderRadius:'8px', border:'1px solid #055FC6'}}>
                        <Typography padding={'8px'}> DOB Mismatch in Aadhar</Typography>
                        <Box sx={{padding:'8px', background:'#0654AD 0% 0% no-repeat padding-box', borderRadius:'8px'}}>
                          <FaCloudUploadAlt style={{fontSize:'20px'}}/>
                        </Box>
                      </Box>

                  </Box>

                  <Box mt={2} sx={{width:'90%', display:'flex', justifyContent:'space-between', borderRadius:'8px', border:'1px solid #F25050'}}>
                    <Typography padding={'8px'} color={'#F11919'}> Download Error Logs</Typography>
                    <Box sx={{padding:'8px', background:'#F11919 0% 0% no-repeat padding-box', borderRadius:'8px'}}>
                      <FaCloudDownloadAlt style={{fontSize:'20px'}}/>
                    </Box>
                  </Box>

                </Box>

                {/* Backend Box */}
                <Box sx={{padding:'25px', width:'24%', height:'330px', background:'#0001BB 0% 0% no-repeat padding-box', boxShadow:'0px 6px 10px #00000029', borderRadius:'10px'}}>
                    <Box sx={{display:'flex', alignItems:'center'}}>
                      <FaCode style={{fontSize:'28px'}}/>
                      <Typography ml={2}> Back End</Typography>
                    </Box>
                    
                    <Box mt={2} display={'flex'} justifyContent={'space-between'}>
                      
                      <Box sx={{width:'50%', padding:'25px', display:'flex', flexDirection:'column', alignItems:'center', background:'#24C58A4D 0% 0% no-repeat padding-box', border:'1px solid #24C58A', borderRadius:'8px'}}>
                        <Box mt={2} sx={{padding:'8px', background:'#05B474 0% 0% no-repeat padding-box', borderRadius:'8px'}}>
                          <FaCheck style={{fontSize:'20px'}}/>
                        </Box>
                        <Typography mt={8}>55%</Typography>
                        <Typography>Completed</Typography>
                      </Box>

                      <Box ml={1} sx={{width:'50%', padding:'25px', display:'flex', flexDirection:'column', alignItems:'center', background:'#F250504D 0% 0% no-repeat padding-box;', border:'1px solid #F25050', borderRadius:'8px'}}>
                        <Box mt={2} sx={{padding:'8px', background:'#F11919 0% 0% no-repeat padding-box', borderRadius:'8px'}}>
                          <IoMdClose style={{fontSize:'20px'}}/>
                        </Box>
                        <Typography mt={8}>45%</Typography>
                        <Typography>Pending</Typography>
                      </Box>

                    </Box>
                    

                </Box>

                {/* Output Box */}
                <Box sx={{width:'24%', display:'flex', flexDirection:'column', alignItems:'center'}}>
                  
                  <Box sx={{padding:'20px', width:'100%', height:'330px', background:'#222385 0% 0% no-repeat padding-box', boxShadow:'0px 6px 10px #00000029', borderRadius:'10px'}}>
                      <Box sx={{display:'flex', alignItems:'center'}}>
                        <MdOutput style={{fontSize:'28px'}}/>
                        <Typography display={'flex'} alignItems={'center'} ml={2}> Output &nbsp;<Typography fontSize={'12px'}>(Downloads)</Typography></Typography>
                      </Box>

                      <Box mt={2} sx={{display:'flex', justifyContent:'space-between', alignItems:'center', background:'#055FC64D 0% 0% no-repeat padding-box', borderRadius:'8px', border:'1px solid #055FC6'}}>
                        <Typography padding={'8px'}> Registers</Typography>
                        <Box sx={{padding:'8px', background:'#0654AD 0% 0% no-repeat padding-box', borderRadius:'8px'}}>
                          <FaCloudDownloadAlt style={{fontSize:'20px'}}/>
                        </Box>
                      </Box>

                      <Box mt={1} sx={{display:'flex', justifyContent:'space-between', alignItems:'center', background:'#055FC64D 0% 0% no-repeat padding-box', borderRadius:'8px', border:'1px solid #055FC6'}}>
                        <Typography padding={'8px'}> Challans</Typography>
                        <Box sx={{padding:'8px', background:'#0654AD 0% 0% no-repeat padding-box', borderRadius:'8px'}}>
                          <FaCloudDownloadAlt style={{fontSize:'20px'}}/>
                        </Box>
                      </Box>

                      <Box mt={1} sx={{display:'flex', justifyContent:'space-between', alignItems:'center', background:'#055FC64D 0% 0% no-repeat padding-box', borderRadius:'8px', border:'1px solid #055FC6'}}>
                        <Typography padding={'8px'}> Notices</Typography>
                        <Box sx={{padding:'8px', background:'#0654AD 0% 0% no-repeat padding-box', borderRadius:'8px'}}>
                          <FaCloudDownloadAlt style={{fontSize:'20px'}}/>
                        </Box>
                      </Box>

                  </Box>

                  <Box mt={2} sx={{ width:'90%', display:'flex', justifyContent:'space-between', borderRadius:'8px', border:'1px solid #055FC6'}}>
                    <Typography padding={'8px'} color={'#0654AD'}> Download as ZIP</Typography>
                    <Box sx={{padding:'8px', background:'#0654AD 0% 0% no-repeat padding-box', borderRadius:'8px'}}>
                      <FaCloudDownloadAlt style={{fontSize:'20px'}}/>
                    </Box>
                  </Box>

                  <Box mt={2} sx={{ width:'90%', display:'flex', justifyContent:'space-between', borderRadius:'8px', border:'1px solid #055FC6'}}>
                    <Typography padding={'8px'} color={'#0654AD'}> Send Email</Typography>
                    <Box sx={{padding:'8px', background:'#0654AD 0% 0% no-repeat padding-box', borderRadius:'8px'}}>
                      <FaCloudDownloadAlt style={{fontSize:'20px'}}/>
                    </Box>
                  </Box>

                </Box>

              </Box>
            </Box>}

            
        </div>
      }
    </div>
  )
}

export default Dashboard