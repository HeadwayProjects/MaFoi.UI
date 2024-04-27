import React, { useEffect, useState } from 'react'
import PageLoader from '../../shared/PageLoader'
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import { callExcelHeaderToDbColumns, configUpload, getAllCompaniesDetails, getAssociateCompanies, getColumns, getLocations, getStates, resetConfigUploadDetails, resetExcelHeaderToDbColumnsDetails, resetGetColumnsDetails } from '../../../redux/features/inputModule.slice';
import { Box, Button, Drawer, FormControl, FormControlLabel, FormLabel, IconButton, Select as MSelect, InputAdornment, InputLabel, MenuItem, Modal, OutlinedInput, Radio, RadioGroup, Select, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, TextField, Typography } from '@mui/material';
import { DEFAULT_OPTIONS_PAYLOAD, DEFAULT_PAYLOAD } from '../../common/Table';
import { ERROR_MESSAGES } from '../../../utils/constants';
import { toast } from 'react-toastify';
import { IoMdClose } from 'react-icons/io';
import { Alert } from 'react-bootstrap';
import { download, downloadFileContent, preventDefault } from '../../../utils/common';
import { FaUpload } from 'react-icons/fa';

const styleUploadModal = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  boxShadow: 24,
};

const Configurations = () => {

  const dispatch = useAppDispatch();

  const companiesDetails = useAppSelector((state) => state.inputModule.companiesDetails);
  const associateCompaniesDetails = useAppSelector((state) => state.inputModule.associateCompaniesDetails);
  const locationsDetails = useAppSelector((state) => state.inputModule.locationsDetails);

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

  const configUploadDetails = useAppSelector((state) => state.inputModule.configUploadDetails);
  const getColumnsDetails = useAppSelector((state) => state.inputModule.getColumnsDetails);
  const excelHeaderToDbColumnsDetails = useAppSelector((state) => state.inputModule.excelHeaderToDbColumnsDetails);

  const configurationList = configUploadDetails && configUploadDetails.data.list
  const columnsList = getColumnsDetails && getColumnsDetails.data

  const loading = configUploadDetails.status === 'loading' || getColumnsDetails.status === 'loading' || excelHeaderToDbColumnsDetails.status === 'loading' || companiesDetails.status === 'loading' || associateCompaniesDetails.status === 'loading' || locationsDetails.status === 'loading'

  const [company, setCompany] = React.useState('');
  const [associateCompany, setAssociateCompany] = React.useState('');
  const [stateName, setStateName] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [year, setYear] = React.useState('');
  const [month, setMonth] =  React.useState<any>('');
  const [configType, setConfigType] = React.useState<any>('');

  const [openUploadModal, setOpenUploadModal] = React.useState(false);
  const [uploadData, setUploadData] =  React.useState<any>();
  const [uploadError, setUploadError] = React.useState(false);
  
  const [tableData, setTableData] = React.useState<any>([])

  const handleChangeCompany = (event:any) => {
    setAssociateCompany('')
    setStateName('')
    setLocation('')
    setYear('')
    setMonth('')
    setConfigType('')
    setCompany(event.target.value);
  };

  const handleChangeAssociateCompany = (event:any) => {
    setLocation('')
    setYear('')
    setMonth('')
    setConfigType('')
    setAssociateCompany(event.target.value);
  };

  const handleChangeStateName = (event:any) => {
    setYear('')
    setMonth('')
    setLocation('')
    setConfigType('')
    setStateName(event.target.value);
  }

  const handleChangeLocation = (event:any) => {
    setYear('')
    setMonth('')
    setConfigType('')
    setLocation(event.target.value);
  };
  
  const handleChangeYear = (event:any) => {
    setMonth('')
    setConfigType('')
    setYear(event.target.value.toString());
  };
  
  const handleChangeMonth = (event:any) => {
    setConfigType('')
    setMonth(event.target.value);
  };

  const handleChangeConfigType = (event:any) => {
    setConfigType(event.target.value)
  }

  const handleChangeEzycompField = (event:any, fieldData: any) => {
    const fieldValue = event.target.value
    const newTableData = tableData.map((each:any) => {
      if(each.id === fieldData.id){
        return {...each, employeeFieldName: fieldValue}
      }else{
        return each
      }
    })
    setTableData(newTableData)
  }

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
    if(associateCompany){
      dispatch(getLocations(payload))
    }
  }, [associateCompany])

  useEffect(() => {
    if(configUploadDetails.status === 'succeeded'){
      setTableData(configUploadDetails.data.list)
      dispatch(getColumns(configType))
      setOpenUploadModal(false)
      setUploadData(null)
      setUploadError(false)
    }else if (configUploadDetails.status === 'failed'){
      toast.error(ERROR_MESSAGES.DEFAULT);
    }
  }, [configUploadDetails.status])

  useEffect(() => {
    if(excelHeaderToDbColumnsDetails.status === 'succeeded'){
      dispatch(resetConfigUploadDetails())
      dispatch(resetGetColumnsDetails())
      dispatch(resetExcelHeaderToDbColumnsDetails())
      setCompany(''), setAssociateCompany(''), setStateName(''), setLocation(''), setYear(''), setMonth(''), setConfigType(''), setTableData([])
      toast.success(`Configuration Successfull`)
    }else if(excelHeaderToDbColumnsDetails.status === 'failed'){
      dispatch(resetConfigUploadDetails())
    }
  },[excelHeaderToDbColumnsDetails.status])

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

  const configurationTypes = ["Employee", "Leave balance", 'Leave availed', 'Employee attendance', 'Employee Wage' ]

  const onClickUpload = () => {
    if(!company || !associateCompany || !stateName || !location || !year || !month || !configType){
      return toast.error(ERROR_MESSAGES.FILL_ALL);
    } else{
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
    formData.append('ConfigurationType', configType)
    formData.append('CompanyId', company)
    formData.append('AssociateCompanyId', associateCompany)
    formData.append('LocationId', location)
    formData.append('StateId', stateName)

    dispatch(configUpload(formData))
  }

  const onClickSave = () => {
    const check = tableData.find((each:any) => each.employeeFieldName === null)
    if(check){
      return toast.error('Please Select All Ezycomp Fields');
    } else{
      console.log('table datttaa', tableData)
      dispatch(callExcelHeaderToDbColumns({listExcelHeadertoDBColumnsMapp : tableData}))
    }
  }

  const downloadSample = (e: any) => {
    preventDefault(e);
    download('Sample config.xlsx', 'https://mafoi.s3.ap-south-1.amazonaws.com/bulkuploadtemplates/ActsTemplate.xlsx')
  }
  
  const downloadErrors = (e: any) => {
    preventDefault(e);
    const data: any = {};
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

  console.log('resetConfigUploadDetails', configUploadDetails.data, columnsList)

  console.log("tableData", tableData)
  return (
    <div style={{ backgroundColor:'#ffffff', height:'100vh'}}>

      {/* Upload Modal */}
      <Modal
        open={openUploadModal}
        onClose={() => {setOpenUploadModal(false); setUploadError(false); setUploadData(null)}}
      >
        <Box sx={styleUploadModal}>
          <Box sx={{backgroundColor:'#E2E3F8', padding:'10px', px:'20px', borderRadius:'6px', boxShadow: '0px 6px 10px #CDD2D9', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <Typography sx={{font: 'normal normal normal 32px/40px Calibri'}}>Configuration Upload</Typography>
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
                <a href="/" style={{marginTop: '10px', width:'210px'}} onClick={downloadSample}>Dowload Sample Config</a>
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

      {loading ? <PageLoader>Loading...</PageLoader> : 
        <div >

            {/* Filter Box*/}
            <Box sx={{paddingX: '20px', paddingY:'10px',}}>
              <Box sx={{backgroundColor:'#E2E3F8', paddingX: '20px', paddingY:'10px', borderRadius:'6px', boxShadow: '0px 6px 10px #CDD2D9'}}>
                  <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px', marginTop:'5px'}}>
                      <h5 style={{ font: 'normal normal normal 32px/40px Calibri' }}>Configurations</h5>
                      <Button onClick={onClickUpload} variant='contained' style={{marginRight:'10px', backgroundColor:'#E9704B', display:'flex', alignItems:'center'}}> <FaUpload /> &nbsp; Upload</Button>
                  </div>
                  <div style={{display:'flex', marginBottom:'10px'}}>

                    <Box sx={{width:'100%', mr:1}}>
                      <Typography mb={1}>Company</Typography>
                      <FormControl sx={{ width:'100%', maxWidth:'190px', backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
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
                      <FormControl sx={{ width:'100%', maxWidth:'190px', backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
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
                      <FormControl sx={{ width:'100%', maxWidth:'190px', backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
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
                      <FormControl sx={{ width:'100%', maxWidth:'190px', backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
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
                      <FormControl sx={{ width:'100%', maxWidth:'190px', backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
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
                      <FormControl sx={{ width:'100%', maxWidth:'190px', backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
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
                            <MenuItem value={each.value}>{each.label}</MenuItem>
                          )}
                        </Select>
                      </FormControl>
                    </Box>

                    <Box sx={{width:'100%', mr:1}}>
                      <Typography mb={1}>Configuration Type</Typography>
                      <FormControl sx={{ width:'100%', maxWidth:'190px', backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                        <Select
                          sx={{'.MuiOutlinedInput-notchedOutline': { border: 0 }}}
                          displayEmpty
                          value={configType}
                          disabled={!month}
                          onChange={handleChangeConfigType}
                        >
                          <MenuItem disabled sx={{display:'none'}} value="">
                            Select Configuration Type
                          </MenuItem>
                          {configurationTypes && configurationTypes.map((each:any) => 
                            <MenuItem value={each}>{each}</MenuItem>
                          )}
                        </Select>
                      </FormControl>
                    </Box>

                  </div>
              </Box>
            </Box>
            
            {configurationList && <Box sx={{paddingX: '20px', display: 'flex', flexDirection:'column'}}>
              {
                configurationList && configurationList.length <= 0 ? 

                <Box sx={{height:'60vh', display:'flex', justifyContent:'center', alignItems:'center'}}>
                  <Typography variant='h5'>No Records Found</Typography>
                </Box>
                : 
                <>
                  <TableContainer sx={{border:'1px solid #e6e6e6', marginTop:'10px', maxHeight:'380px', overflowY:'scroll'}}>
                          <Table stickyHeader  sx={{ minWidth: 650 }} aria-label="sticky table">
                              <TableHead sx={{'.MuiTableCell-root':{ backgroundColor:'#E7EEF7'}}}>
                                  <TableRow>
                                      <TableCell >S.no</TableCell>
                                      <TableCell > Column Name</TableCell>
                                      <TableCell > Column Position</TableCell>
                                      <TableCell > Row Position</TableCell>
                                      <TableCell > Ezycomp Field</TableCell>
                                      <TableCell > Mapped</TableCell>
                                  </TableRow>
                              </TableHead>

                              <TableBody>

                              {tableData && tableData.map((each: any, index: number) => (
                                  <TableRow
                                  key={each._id}
                                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                  >   
                                      <TableCell >{index+1}</TableCell>
                                      <TableCell >{each.excelColumnHeaderName}</TableCell>
                                      <TableCell >{each.columnPosition}</TableCell>
                                      <TableCell >{each.rowPosition}</TableCell>
                                      <TableCell >
                                        <FormControl sx={{ m: 1, width:"100%", maxWidth:'190px', backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                                          <InputLabel id="demo-select-small-label" sx={{color:'#000000'}}>Ezycomp Field</InputLabel>
                                          <MSelect
                                            labelId="demo-select-small-label"
                                            id="demo-select-small"
                                            value={each.employeeFieldName ? each.employeeFieldName : ''}
                                            label="Ezycomp Field"
                                            onChange={(e) => {handleChangeEzycompField(e, each)}}
                                          >
                                            {columnsList && columnsList.map((each:any) => {
                                                return <MenuItem value={each}>{each}</MenuItem>
                                            })}
                                          </MSelect>
                                      </FormControl>
                                      </TableCell>
                                      <TableCell >{each.mapped ? "Yes" : "No"}</TableCell>
                                  </TableRow>
                              ))}
                              </TableBody>
                          </Table>
                  </TableContainer>
                  {/* <TablePagination   
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
                  /> */}
                </>
              }
              <Button sx={{marginTop:'20px', alignSelf:'flex-end', width:'200px'}} variant='contained' onClick={onClickSave}>Save</Button>  
            </Box>}

        </div>
      }
    </div>
  )
}

export default Configurations