import React, { useEffect, useState } from 'react'
import PageLoader from '../../shared/PageLoader'
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import { callExcelHeaderToDbColumns, configUpload, employeeAttendanceUpload, employeeLeaveAvailedUpload, employeeLeaveBalanceUpload, employeeUpload, employeeWageUpload, getAllCompaniesDetails, getAssociateCompanies, getColumns, getLocations, getStates, resetConfigUploadDetails, resetEmployeeAttendanceUploadDetails, resetEmployeeLeaveAvailedUploadDetails, resetEmployeeLeaveBalanceUploadDetails, resetEmployeeUploadDetails, resetEmployeeWageUploadDetails, resetExcelHeaderToDbColumnsDetails, resetGetColumnsDetails } from '../../../redux/features/inputModule.slice';
import { Box, Button, Drawer, FormControl, FormControlLabel, FormLabel, IconButton, Select as MSelect, InputAdornment, InputLabel, MenuItem, Modal, OutlinedInput, Radio, RadioGroup, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, TextField, Typography } from '@mui/material';
import { DEFAULT_OPTIONS_PAYLOAD, DEFAULT_PAYLOAD } from '../../common/Table';
import { ERROR_MESSAGES } from '../../../utils/constants';
import { toast } from 'react-toastify';
import { IoMdClose } from 'react-icons/io';
import { Alert } from 'react-bootstrap';
import { download, downloadFileContent, preventDefault } from '../../../utils/common';
import { FaUpload } from 'react-icons/fa';
import Select from "react-select";
import { callSalaryComponentsExcelHeaderToDbColumns, resetSalaryConfigUploadDetails, resetSalaryExcelToDBColumnsDetails, resetSalaryUploadDetails, salaryComponentConfigUpload, salaryComponentUpload } from '../../../redux/features/salaryComponents.slice';

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

  const salaryConfigUploadDetails = useAppSelector((state) => state.salaryComponent.salaryConfigUploadDetails);
  const getColumnsDetails = useAppSelector((state) => state.inputModule.getColumnsDetails);
  const salaryExcelHeaderToDbColumnsDetails = useAppSelector((state) => state.salaryComponent.salaryExcelHeaderToDbColumnsDetails);
  const salaryUploadDetails = useAppSelector((state) => state.salaryComponent.salaryUploadDetails);

  const configurationList = salaryConfigUploadDetails && salaryConfigUploadDetails.data.list
  const columnsList = getColumnsDetails && getColumnsDetails.data

  const loading =  salaryUploadDetails.status === 'loading' || salaryConfigUploadDetails.status === 'loading' || getColumnsDetails.status === 'loading' || salaryExcelHeaderToDbColumnsDetails.status === 'loading' || companiesDetails.status === 'loading'

  const [company, setCompany] = React.useState('');
  const [year, setYear] = React.useState('');
  const [month, setMonth] =  React.useState<any>('');

  const [openUploadModal, setOpenUploadModal] = React.useState(false);
  const [uploadData, setUploadData] =  React.useState<any>();

  const [openMappingModal, setOpenMappingModal] = React.useState(false);
  
  const [tableData, setTableData] = React.useState<any>([])

  const handleChangeCompany = (event:any) => {
    setCompany(event.target.value);
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
  },[])

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

  const resetUploadDetails = () => {
    dispatch(resetSalaryConfigUploadDetails())
    dispatch(resetSalaryUploadDetails())
  }

  const resetStateValues = () => {
    dispatch(resetSalaryConfigUploadDetails())
    dispatch(resetGetColumnsDetails())
    dispatch(resetSalaryExcelToDBColumnsDetails())
    dispatch(resetSalaryUploadDetails())

    setOpenUploadModal(false)
    setOpenMappingModal(false)
    setCompany('')
    setYear('')
    setMonth('')
    setUploadData(null)
    setTableData([])
  }

  console.log('UploadDetails', salaryConfigUploadDetails, salaryUploadDetails, tableData)

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
      {loading ? <PageLoader>Loading...</PageLoader> : 
        <div >

            {/* Filter Box*/}
            <Box sx={{paddingX: '20px', paddingY:'10px',}}>
              <Box sx={{backgroundColor:'#E2E3F8', paddingX: '20px', paddingY:'10px', borderRadius:'6px', boxShadow: '0px 6px 10px #CDD2D9'}}>
                  <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px', marginTop:'5px'}}>
                      <h5 style={{ font: 'normal normal normal 32px/40px Calibri' }}>Salary Components</h5>
                      <Button onClick={onClickUpload} variant='contained' style={{marginRight:'10px', backgroundColor:'#E9704B', display:'flex', alignItems:'center'}}> <FaUpload /> &nbsp; Upload</Button>
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
            
           

        </div>
      }
    </div>
  )
}

export default SalaryComponents