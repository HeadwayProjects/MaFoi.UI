
import React, { useEffect, useState } from 'react'
import PageLoader from '../../shared/PageLoader'
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import { getActivities, getActs, getAllCompaniesDetails, getAssociateCompanies, getColumns, getForms, getLocations, getRules, getStates } from '../../../redux/features/inputModule.slice';
import { Box, Button, Drawer, FormControl, FormControlLabel, FormLabel, IconButton, InputAdornment, InputLabel, MenuItem, Modal, OutlinedInput, Radio, RadioGroup, Select as MSelect, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, TextField, Typography, Tooltip, makeStyles, Checkbox } from '@mui/material';
import { FaUpload, FaDownload } from "react-icons/fa";
import { IoMdAdd, IoMdClose, IoMdSearch } from "react-icons/io";
import { DEFAULT_OPTIONS_PAYLOAD, DEFAULT_PAYLOAD } from '../../common/Table';
import Icon from '../../common/Icon';
import { download, downloadFileContent, preventDefault } from '../../../utils/common';
import { ERROR_MESSAGES } from '../../../utils/constants';
import { toast } from 'react-toastify';
import { Alert } from 'react-bootstrap';
import { getLeaveConfiguration } from '../../../redux/features/leaveConfiguration.slice';
import { resetImportFileDetails, updateStateRegister, addStateRegister, getStateConfigurationDetails, resetAddStateConfigDetails, resetStateConfigDetails, deleteStateRegisterMapping, exportStateRegisterMapping, resetExportFileDetails, importStateRegisterMapping, getStateRegisterDownload ,resetstateRegisterDownloadDetails} from '../../../redux/features/stateRegister.slice';
import Select from "react-select";
import { EstablishmentTypes } from '../Masters/Master.constants';
import { RxCross2 } from "react-icons/rx";
import { each } from 'underscore';
import { relative } from 'path';
import { deleteActStateMappingForm } from '../../../redux/features/Stateactruleactivitymapping.slice';






const RegisterDownload = () => {

  const dispatch: any = useAppDispatch();

  const stateRegisterDownloadDetails = useAppSelector((state) => state.stateRegister.stateRegisterDownloadDetails)
   console.log('stateRegisterdownloadDetails', stateRegisterDownloadDetails)
  const formsDetails = useAppSelector((state) => state.inputModule.formsDetails)
  const statesDetails = useAppSelector((state) => state.inputModule.statesDetails)
  const stateConfigureDetails = useAppSelector((state) => state.stateRegister.stateConfigureDetails)
  const getColumnsDetails = useAppSelector((state) => state.inputModule.getColumnsDetails);
  const addStateRegisterDetails = useAppSelector((state) => state.stateRegister.addStateRegisterDetails)
  const updateStateRegisterDetails = useAppSelector((state) => state.stateRegister.updateStateRegisterDetails)
  const deleteStateRegisterMappingDetails = useAppSelector((state) => state.stateRegister.deleteStateRegisterMappingDetails)
  const exportFile = useAppSelector(state => state.stateRegister.exportFile);
  const importStateRegisterMappingDetails = useAppSelector((state) => state.stateRegister.importStateRegisterMappingDetails);

  const companiesDetails = useAppSelector((state) => state.inputModule.companiesDetails);
  const associateCompaniesDetails = useAppSelector((state) => state.inputModule.associateCompaniesDetails);
  const locationsDetails = useAppSelector((state) => state.inputModule.locationsDetails);

  // console.log(formsDetails, "formsDetails")

  const stateRegisterDownload = stateRegisterDownloadDetails.data.List
  const stateRegisterCount = stateRegisterDownloadDetails.data.Count

  console.log(stateRegisterCount);

  const companies = companiesDetails.data.list
  const associateCompanies = associateCompaniesDetails.data.list
  const locations = locationsDetails.data.list

  console.log(locations);

  const statesList = statesDetails && statesDetails.data.list
  const columnsList = getColumnsDetails && getColumnsDetails.data


  const loading = importStateRegisterMappingDetails.status === 'loading' || deleteStateRegisterMappingDetails.status === 'loading' || updateStateRegisterDetails.status === 'loading' || addStateRegisterDetails.status === 'loading' || formsDetails.status === 'loading' || stateRegisterDownloadDetails.status === 'loading' || stateConfigureDetails.status === 'loading' || getColumnsDetails.status === 'loading'

  const [stateValue, setStateValue] = React.useState('');
  const [type, setType] = React.useState('');

  const [registerType, setRegisterType] = React.useState('');
  const [processType, setProcessType] = React.useState<any>('');
  const [establishmentType, setEstablishmentType] = React.useState<any>('');

  const [company, setCompany] = React.useState('');
  const [associateCompany, setAssociateCompany] = React.useState('');
  const [stateName, setStateName] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [year, setYear] = React.useState('');
  const [month, setMonth] = React.useState<any>('');




  const [actName, setActName] = React.useState<any>('')
  const [ruleName, setRuleName] = React.useState<any>('')
  const [activityName, setActivityName] = React.useState<any>('')
  const [formName, setFormName] = React.useState<any>('');
  const [formFilePath, setFormFilePath] = React.useState<any>('');
  const [formNameValue, setFormNameValue] = React.useState<any>('');
  const [headerStartRow, setHeaderStartRow] = React.useState<any>('');
  const [headerEndRow, setHeaderEndRow] = React.useState<any>('');
  const [footerStartRow, setFooterStartRow] = React.useState<any>('');
  const [footerEndRow, setFooterEndRow] = React.useState<any>('');
  const [totalRowsPerPage, setTotalRowsPerPage] = React.useState<any>('');
  const [pageSize, setPageSize] = React.useState<any>('');
  const [pageOrientation, setPageOrientation] = React.useState<any>('');
  const [openPreviewModal, setOpenPreviewModal] = React.useState(false);
  const [openEditModal, setOpenEditModal] = React.useState(false);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [openImportFileUploadModal, setopenImportFileUploadModal] = React.useState(false);
  const [uploadError, setUploadError] = React.useState(false);
  const [uploadImportData, setUploadImportData] = React.useState<any>();

  const [tableData, setTableData] = React.useState<any>([]);
  const [newtableData, setnewTableData] = React.useState<any>([]);
  const [showInitialConfig, setShowInitialConfig] = React.useState<any>(false);
  const [showConfigTable, setShowConfigTable] = React.useState<any>(false);

  const [searchInput, setSearchInput] = React.useState('');
  const [activeSort, setActiveSort] = React.useState('name')
  const [sortType, setSortType] = React.useState<any>('asc')

  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [page, setPage] = React.useState(0);

  const [openAddModal, setOpenAddModal] = React.useState(false);
  const [openImportExportModal, setImportExportModal] = React.useState(false);
  const [openAddExport, setOpenAddExport] = React.useState(false)

  const [openViewModal, setOpenViewModal] = React.useState(false);
  const [selectedStateConfig, setSelectedStateConfig] = React.useState<any>({})

  const fromsList = formsDetails.data.list ? formsDetails.data.list : []
  const filteredFormsList = fromsList.filter((each: any) => each.filePath !== '' && each.formName !== '')

  const [isHovered, setIsHovered] = React.useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);


  // useEffect(() => {
  //   const stateRegisterdownloadDefaultPayload: any = {
  //     search: "",
  //     filters: [],
  //     pagination: {
  //       pageSize: 10,
  //       pageNumber: 1
  //     },
  //     sort: { columnName: 'Year', order: 'asc' },
  //     "includeCentral": true
  //   }
   
  //   dispatch(getStateRegisterDownload(stateRegisterdownloadDefaultPayload))
  //   const companiesPayload: any = { ...DEFAULT_OPTIONS_PAYLOAD, filters: [{ columnName: 'isParent', value: 'true' }] }
  //   dispatch(getAllCompaniesDetails(companiesPayload))
  // }, [])




  const handleChangeStateValue = (event: any) => {
    setType('')
    setStateValue(event.target.value)
    const stateRegisterPayload: any = {
      search: searchInput,
      filters: [
        {
          columnName: 'stateId',
          value: event.target.value
        },

      ],
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page + 1
      },
      sort: { columnName: 'stateId', order: 'asc' },
      "includeCentral": true
    }
    dispatch(getStateRegisterDownload(stateRegisterPayload))
  };



  const handleChangeSearchInput = (event: any) => {
    setSearchInput(event.target.value)
  }




  console.log(selectedStateConfig);
  console.log("tabledata", tableData);


  const handleChangeCompany = (event:any) => {
   // alert("hnle change company hitted");
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
      sort: { columnName: 'stateId', order: 'asc' },
      "includeCentral": true
    }
    dispatch(getStateRegisterDownload(payload))
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
      sort: { columnName: 'stateId', order: 'asc' },
      "includeCentral": true
    }
    dispatch(getStateRegisterDownload(payload))
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
      sort: { columnName: 'stateId', order: 'asc' },
      "includeCentral": true
    }
    dispatch(getStateRegisterDownload(payload))
  };

  const handleChangeYear = (event:any) => {
    setMonth('');
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
          value: location.split('^')[0]
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
      sort: { columnName: 'stateId', order: 'asc' },
      "includeCentral": true
    }
    dispatch(getStateRegisterDownload(payload))
  };

  const handleChangeMonth = (event:any) => {
    //alert(event.target.value);
    setMonth(event.target.value);
    //const monthKey = (monthList.findIndex((each) => each === event.target.value) + 1).toString()
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
          value: location.split('^')[0]
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
      sort: { columnName: 'stateId', order: 'asc' },
      "includeCentral": true
    }
    dispatch(getStateRegisterDownload(payload))
  };


  useEffect(() => {
    //alert("this use effect wa hitting")
    const stateRegisterDownloadDefaultPayload: any = {
      search: "",
      filters: [],
      pagination: {
        pageSize: 10,
        pageNumber: 1
      },
      sort: { columnName: 'stateId', order: 'asc' },
      "includeCentral": true
    }
    const statesPayload: any = { ...DEFAULT_OPTIONS_PAYLOAD }
    dispatch(getStateRegisterDownload(stateRegisterDownloadDefaultPayload))
    const companiesPayload: any = { ...DEFAULT_OPTIONS_PAYLOAD, filters: [{ columnName: 'isParent', value: 'true' }] }
    dispatch(getAllCompaniesDetails(companiesPayload))
    //dispatch(getStates(statesPayload))
  }, [])

  useEffect(() => {
   // alert("after getting company ocations");
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
    if (stateRegisterDownloadDetails.status === 'succeeded') {
//alert("this success  was hitted");
    } else if (stateRegisterDownloadDetails.status === 'failed') {
      toast.error(ERROR_MESSAGES.DEFAULT);
    }
  }, [stateRegisterDownloadDetails.status])


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
    const filters = []
    if (company) {
      filters.push({
        columnName: 'companyId',
        value: company
      })
    }
    if (associateCompany) {
      filters.push({
        columnName: 'associatecompanyId',
        value: associateCompany
      })
    }
    if (location) {
      filters.push({
        columnName:'locationId',
        value: location.split('^')[0]
      })
    }
    if (year) {
      filters.push({
        columnName:'year',
        value: year
      })
    }
    if (month) {
      filters.push({
        columnName:'month',
        value: month
      })
    }
    const payload: any = {
      search: searchInput,
      filters: filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page + 1
      },
      sort: { columnName: 'stateId', order: 'asc' },
      "includeCentral": true
    }
    dispatch(getStateRegisterDownload(payload))
  }

  const onClickClearSearch = () => {
    const filters = []
    if (company) {
      filters.push({
        columnName: 'companyId',
        value: company
      })
    }
    if (associateCompany) {
      filters.push({
        columnName: 'associatecompanyId',
        value: associateCompany
      })
    }
    if (location) {
      filters.push({
        columnName:'locationId',
        value: location.split('^')[0]
      })
    }
    if (year) {
      filters.push({
        columnName:'year',
        value: year
      })
    }
    if (month) {
      filters.push({
        columnName:'month',
        value: month
      })
    }
    const payload: any = {
      search: '',
      filters: filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page + 1
      },
      sort: { columnName: 'stateId', order: 'asc' },
      "includeCentral": true
    }
    dispatch(getStateRegisterDownload(payload))
    setSearchInput('')
  }

  const onClickSortState = () => {
    let sType = 'asc'
    setActiveSort('stateId');
    if (sortType === 'asc') {
      setSortType('desc')
      sType = 'desc'
    } else {
      setSortType('asc')
    }

    const filters = []
    if (stateValue) {
      filters.push({
        columnName: 'stateId',
        value: stateValue
      })
    }
    if (type) {
      filters.push({
        columnName: 'registerType',
        value: type
      })
    }

    const Payload: any = {
      search: searchInput,
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page + 1
      },
      sort: { columnName: 'stateId', order: sType },
      "includeCentral": true
    }
    dispatch(getStateRegisterDownload(Payload))

  }

  const onClickSortAct = () => {
    let sType = 'asc'
    setActiveSort('actId');
    if (sortType === 'asc') {
      setSortType('desc')
      sType = 'desc'
    } else {
      setSortType('asc')
    }

    const filters = []
    if (stateValue) {
      filters.push({
        columnName: 'stateId',
        value: stateValue
      })
    }
    if (type) {
      filters.push({
        columnName: 'registerType',
        value: type
      })
    }

    const Payload: any = {
      search: searchInput,
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page + 1
      },
      sort: { columnName: 'actId', order: sType },
      "includeCentral": true
    }
    dispatch(getStateRegisterDownload(Payload))

  }

  const onClickSortRule = () => {
    let sType = 'asc'
    setActiveSort('ruleId');
    if (sortType === 'asc') {
      setSortType('desc')
      sType = 'desc'
    } else {
      setSortType('asc')
    }

    const filters = []
    if (stateValue) {
      filters.push({
        columnName: 'stateId',
        value: stateValue
      })
    }
    if (type) {
      filters.push({
        columnName: 'registerType',
        value: type
      })
    }

    const Payload: any = {
      search: searchInput,
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page + 1
      },
      sort: { columnName: 'ruleId', order: sType },
      "includeCentral": true
    }
    dispatch(getStateRegisterDownload(Payload))

  }

  const onClickSortActivity = () => {
    let sType = 'asc'
    setActiveSort('activityId');
    if (sortType === 'asc') {
      setSortType('desc')
      sType = 'desc'
    } else {
      setSortType('asc')
    }

    const filters = []
    if (stateValue) {
      filters.push({
        columnName: 'stateId',
        value: stateValue
      })
    }
    if (type) {
      filters.push({
        columnName: 'registerType',
        value: type
      })
    }

    const Payload: any = {
      search: searchInput,
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page + 1
      },
      sort: { columnName: 'activityId', order: sType },
      "includeCentral": true
    }
    dispatch(getStateRegisterDownload(Payload))

  }

  const onClickSortForm = () => {
    let sType = 'asc'
    setActiveSort('form');
    if (sortType === 'asc') {
      setSortType('desc')
      sType = 'desc'
    } else {
      setSortType('asc')
    }

    const filters = []
    if (stateValue) {
      filters.push({
        columnName: 'stateId',
        value: stateValue
      })
    }
    if (type) {
      filters.push({
        columnName: 'registerType',
        value: type
      })
    }

    const Payload: any = {
      search: searchInput,
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page + 1
      },
      sort: { columnName: 'form', order: sType },
      "includeCentral": true
    }
    dispatch(getStateRegisterDownload(Payload))

  }

  const onClickSortRegisterType = () => {
    let sType = 'asc'
    setActiveSort('registerType');
    if (sortType === 'asc') {
      setSortType('desc')
      sType = 'desc'
    } else {
      setSortType('asc')
    }

    const filters = []
    if (stateValue) {
      filters.push({
        columnName: 'stateId',
        value: stateValue
      })
    }
    if (type) {
      filters.push({
        columnName: 'registerType',
        value: type
      })
    }

    const Payload: any = {
      search: searchInput,
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page + 1
      },
      sort: { columnName: 'registerType', order: sType },
      "includeCentral": true
    }
    dispatch(getStateRegisterDownload(Payload))

  }






 



  console.log(columnsList);

  const handleChangePage = (event: unknown, newPage: number) => {
    const filters = []
    if (company) {
      filters.push({
        columnName: 'companyId',
        value: company
      })
    }
    if (associateCompany) {
      filters.push({
        columnName: 'associatecompanyId',
        value: associateCompany
      })
    }
    if (location) {
      filters.push({
        columnName:'locationId',
        value: location.split('^')[0]
      })
    }
    if (year) {
      filters.push({
        columnName:'year',
        value: year
      })
    }
    if (month) {
      filters.push({
        columnName:'month',
        value: month
      })
    }
    const payload: any = {
      search: '',
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: newPage + 1
      },
      sort: { columnName: 'stateId', order: 'asc' },
      "includeCentral": true
    }

    dispatch(getStateRegisterDownload(payload))
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const filters = []
    if (company) {
      filters.push({
        columnName: 'companyId',
        value: company
      })
    }
    if (associateCompany) {
      filters.push({
        columnName: 'associatecompanyId',
        value: associateCompany
      })
    }
    if (location) {
      filters.push({
        columnName:'locationId',
        value: location.split('^')[0]
      })
    }
    if (year) {
      filters.push({
        columnName:'year',
        value: year
      })
    }
    if (month) {
      filters.push({
        columnName:'month',
        value: month
      })
    }
    const payload: any = {
      search: '',
      filters,
      pagination: {
        pageSize: parseInt(event.target.value, 10),
        pageNumber: 1
      },
      sort: { columnName: 'stateId', order: 'asc' },
      "includeCentral": true
    }

    dispatch(getStateRegisterDownload(payload))
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const resetStateValues = () => {
    setOpenAddModal(false)
    setShowInitialConfig(false)
    setShowConfigTable(false)
    setRegisterType('')
    setProcessType('')
    setStateName('')
    setActName('')
    setRuleName('')
    setActivityName('')
    setFormName('')
    setFormNameValue('')
    setHeaderStartRow('')
    setHeaderEndRow('')
    setFooterStartRow('')
    setFooterEndRow('')
    setTotalRowsPerPage('')
    setPageSize('')
    setPageOrientation('')
    setTableData([])
    dispatch(resetAddStateConfigDetails())
    dispatch(resetStateConfigDetails())
  }



  const onclickDownload=(each:any)=>{
    //alert(each.registerUrl);
    const url = each.RegisterUrl;
     
  // Create a new anchor element


  const link = document.createElement('a');
  link.href = url;
 
  // Set the download attribute to suggest a file name (optional)
  // This is the name the file will be downloaded as
  if(url!= null){
  link.download = url.split('/').pop(); // Use the file name from the URL
  // Append the anchor to the body
  document.body.appendChild(link);

  // Programmatically click the anchor
  link.click();

  // Remove the anchor from the document
  document.body.removeChild(link);
}
else{
  toast.info("file was null");
}

  }

 










  return (
    <div style={{ height: '100vh', backgroundColor: '#ffffff' }}>
     








      {loading ? <PageLoader>Loading...</PageLoader> :

        <div>
          <Box sx={{ paddingX: '20px', paddingY: '10px', }}>
            <div style={{ backgroundColor: '#E2E3F8', padding: '20px', borderRadius: '6px', boxShadow: '0px 6px 10px #CDD2D9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', marginTop: '10px' }}>
                <h5 style={{ font: 'normal normal normal 32px/40px Calibri' }}>Register Downloads</h5>
                {/* <Button onClick={onClickAdd} variant='contained' style={{ backgroundColor: '#0654AD', display: 'flex', alignItems: 'center' }}> <IoMdAdd /> &nbsp; Add</Button> */}
                <Button variant='contained' style={{ backgroundColor: '#0654AD', display: 'flex', alignItems: 'center' }}> <Icon name={'download'} text={'download'} /> &nbsp; Download</Button>
              </div>

              <div style={{ display: 'flex' }}>

                {/* <Box sx={{ mr: 1 }}>
                  <Typography mb={1}>States</Typography>
                  <FormControl sx={{ width: "220px", backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                    <MSelect
                      sx={{ '.MuiOutlinedInput-notchedOutline': { border: 0 } }}
                      value={stateValue}
                      displayEmpty
                      onChange={handleChangeStateValue}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            maxHeight: 200,
                            width: 230,
                            marginTop: "3px"
                          }
                        }
                      }}
                    >
                      <MenuItem disabled sx={{ display: 'none' }} value="">
                        Select state
                      </MenuItem>
                      {statesList && statesList.map((each: any) => {
                        return <MenuItem sx={{ width: '240px', whiteSpace: 'initial' }} value={each.id}>{each.name}</MenuItem>
                      })}
                    </MSelect>
                  </FormControl>
                </Box>

                <Box sx={{ mr: 1 }}>
                  <Typography mb={1}>Type</Typography>
                  <FormControl sx={{ width: "220px", backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                    <MSelect
                      sx={{ '.MuiOutlinedInput-notchedOutline': { border: 0 } }}
                      displayEmpty
                      value={type}
                      disabled={!stateValue}
                      onChange={handleChangeType}
                    >
                      <MenuItem disabled sx={{ display: 'none' }} value="">
                        Select Type
                      </MenuItem>
                      {['State', 'Central'].map((each: any) => {
                        return <MenuItem value={each}>{each}</MenuItem>
                      })}
                    </MSelect>
                  </FormControl>
                </Box>

                <Box sx={{ mr: 1 }}>
                  <Typography mb={1}>Search</Typography>
                  <FormControl sx={{ width: "220px", backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                    <InputLabel htmlFor="outlined-adornment-search">Search</InputLabel>
                    <OutlinedInput
                      value={searchInput}
                      onChange={handleChangeSearchInput}
                      sx={{ '.MuiOutlinedInput-notchedOutline': { border: 0 } }}
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
                </Box> */}

                <Box sx={{ width: '100%', mr: 1 }}>
                  <Typography mb={1}>Company</Typography>
                  <FormControl sx={{ width: '100%', maxWidth: '200px', backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                    <MSelect
                      sx={{ '.MuiOutlinedInput-notchedOutline': { border: 0 } }}
                      value={company}
                      displayEmpty
                      onChange={handleChangeCompany}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            maxHeight: 200,
                            width: 230,
                            marginTop: "3px"
                          }
                        }
                      }}
                    >
                      <MenuItem disabled sx={{ display: 'none' }} value="">
                        Select Company
                      </MenuItem>
                      {companies && companies.map((each: any) => {
                        return <MenuItem sx={{ width: '240px', whiteSpace: 'initial' }} value={each.id}>{each.name}</MenuItem>
                      })}
                    </MSelect>
                  </FormControl>
                </Box>

                <Box sx={{ width: '100%', mr: 1 }}>
                  <Typography mb={1}>Associate Company</Typography>
                  <FormControl sx={{ width: '100%', maxWidth: '200px', backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                    <MSelect
                      sx={{ '.MuiOutlinedInput-notchedOutline': { border: 0 } }}
                      displayEmpty
                      value={associateCompany}
                      disabled={!company}
                       onChange={handleChangeAssociateCompany}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            maxHeight: 200,
                            width: 230,
                            marginTop: "3px"
                          }
                        }
                      }}
                    >
                      <MenuItem disabled sx={{ display: 'none' }} value="">
                        Select Associate Company
                      </MenuItem>
                      {associateCompanies && associateCompanies.map((each: any) => {
                        return <MenuItem sx={{ width: '240px', whiteSpace: 'initial' }} value={each.id}>{each.name}</MenuItem>
                      })}
                    </MSelect>
                  </FormControl>
                </Box>

                {/* <Box sx={{ width: '100%', mr: 1 }}>
                  <Typography mb={1}>States</Typography>
                  <FormControl sx={{ width: '100%', maxWidth: '200px', backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                    <MSelect
                      sx={{ '.MuiOutlinedInput-notchedOutline': { border: 0 } }}
                      displayEmpty
                      value={stateName}
                      disabled={!associateCompany}
                     onChange={handleChangeStateName}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            maxHeight: 200,
                            width: 230,
                            marginTop: "3px"
                          }
                        }
                      }}
                    >
                      <MenuItem disabled sx={{ display: 'none' }} value="">
                        Select State
                      </MenuItem>
                      {/* {states && states.map((each: any) => {
                        return <MenuItem sx={{ width: '240px', whiteSpace: 'initial' }} value={each.id}>{each.name}</MenuItem>
                      })} 
                    </MSelect>
                  </FormControl>
                </Box> */}

                <Box sx={{ width: '100%', mr: 1 }}>
                  <Typography mb={1}>Location</Typography>
                  <FormControl sx={{ width: '100%', maxWidth: '200px', backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                    <MSelect
                      sx={{ '.MuiOutlinedInput-notchedOutline': { border: 0 } }}
                      displayEmpty
                      value={location}
                     
                       onChange={handleChangeLocation}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            maxHeight: 200,
                            width: 230,
                            marginTop: "3px"
                          }
                        }
                      }}
                    >
                      <MenuItem disabled sx={{ display: 'none' }} value="">
                        Select Location
                      </MenuItem>
                       {locations && locations.map((each: any) => {
                        const { id, name, code, cities }: any = each.location || {};
                        const { state } = cities || {};
                      
                          return <MenuItem sx={{ width: '240px', whiteSpace: 'initial' }} value={each.locationId}>{`${name} (${state.code}-${cities.code}-${code})`}</MenuItem>
                        
                      })} 
                    </MSelect>
                  </FormControl>
                </Box>

                <Box sx={{ width: '100%', mr: 1 }}>
                  <Typography mb={1}>Year</Typography>
                  <FormControl sx={{ width: '100%', maxWidth: '200px', backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                    <MSelect
                      sx={{ '.MuiOutlinedInput-notchedOutline': { border: 0 } }}
                      displayEmpty
                      value={year}
                      disabled={!location}
                       onChange={handleChangeYear}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            maxHeight: 200,
                            width: 150,
                            marginTop: "3px"
                          }
                        }
                      }}
                    >
                      <MenuItem disabled sx={{ display: 'none' }} value="">
                        Select Year
                      </MenuItem>
                      {yearsList && yearsList.map((each: any) =>
                        <MenuItem sx={{ width: '240px', whiteSpace: 'initial' }} value={each}>{each}</MenuItem>
                      )}
                    </MSelect>
                  </FormControl>
                </Box>

                <Box sx={{ width: '100%', mr: 1 }}>
                  <Typography mb={1}>Month</Typography>
                  <FormControl sx={{ width: '100%', maxWidth: '200px', backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                    <MSelect
                      sx={{ '.MuiOutlinedInput-notchedOutline': { border: 0 } }}
                      displayEmpty
                      value={month}
                      disabled={!year}
                       onChange={handleChangeMonth}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            maxHeight: 200,
                            width: 150,
                            marginTop: "3px"
                          }
                        }
                      }}
                    >
                      <MenuItem disabled sx={{ display: 'none' }} value="">
                        Select Month
                      </MenuItem>
                       {monthList && monthList.map((each: any) =>
                        <MenuItem sx={{ width: '240px', whiteSpace: 'initial' }} value={each}>{each}</MenuItem>
                      )} 
                    </MSelect>
                  </FormControl>
                </Box>

              </div>
            </div>
          </Box>

          <Box sx={{ paddingX: '20px' }}>
            {
              stateRegisterDownload && stateRegisterDownload.length <= 0 ?

                <Box sx={{ height: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Typography variant='h5'>No Records Found</Typography>
                </Box>
                :
                <>
                  <TableContainer sx={{ border: '1px solid #e6e6e6', marginTop: '10px', maxHeight: '385px', overflowY: 'scroll' }}>
                    <Table stickyHeader sx={{ minWidth: 650 }} aria-label="sticky table">
                      <TableHead sx={{ '.MuiTableCell-root': { backgroundColor: '#E7EEF7',fontWeight:'600' } }}>
                        <TableRow>
                          <TableCell><Checkbox/></TableCell>
                          <TableCell > <TableSortLabel active={activeSort === 'stateId'} direction={sortType} onClick={onClickSortState}>State</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel active={activeSort === 'actId'} direction={sortType} onClick={onClickSortAct}>Year</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel active={activeSort === 'ruleId'} direction={sortType} onClick={onClickSortRule}>Month</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel active={activeSort === 'activityId'} direction={sortType} onClick={onClickSortActivity}>Act</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel active={activeSort === 'activityId'} direction={sortType} onClick={onClickSortActivity}>Rule</TableSortLabel></TableCell>

                          <TableCell > <TableSortLabel active={activeSort === 'activityId'} direction={sortType} onClick={onClickSortActivity}>Activity</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel active={activeSort === 'form'} direction={sortType} onClick={onClickSortForm}>FormName</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel active={activeSort === 'registerType'} direction={sortType} onClick={onClickSortRegisterType}>Type</TableSortLabel></TableCell>
                          <TableCell >Download</TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>

                        {stateRegisterDownload && stateRegisterDownload.map((each: any, index: number) => (
                          <TableRow
                            key={index}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell><Checkbox/></TableCell>
                            <TableCell >{each.State && each.State.Name ? each.State.Name : 'NA'}</TableCell>
                            <TableCell >{each.Year && each.Year ? each.Year : 'NA'}</TableCell>
                            <TableCell >{each.Month && each.Month ? each.Month : 'NA'}</TableCell>
                            <TableCell >{each.Act && each.Act.Name ? each.Act.Name : 'NA'}</TableCell>
                            <TableCell >{each.Rule && each.Rule.Name ? each.Rule.Name : 'NA'}</TableCell>
                            <TableCell >{each.Activity && each.Activity.Name ? each.Activity.Name : 'NA'}</TableCell>
                            <TableCell >{each.FormName && each.FormName ? each.FormName : 'NA'}</TableCell>
                            <TableCell >{each.Type && each.Type ? each.Type : 'NA'}</TableCell>

                            <TableCell >
                              <Box sx={{ display: 'flex',justifyContent: "center" }}>
                                {/* <Icon action={() => onclickEdit(each)} style={{color:'#039BE5'}} type="button" name={'pencil'} text={'Edit'}/> */}
                               
                                <Icon style={{ color: '#0654AD' }} type="button" name={'download'} text={'download'}  action={() => onclickDownload(each)} />
                                
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
                        display: 'flex',
                        justifyContent: 'flex-end'
                      },
                      '.MuiTablePagination-displayedRows': {
                        margin: '0',
                      },
                      '.MuiTablePagination-selectLabel': {
                        margin: '0',
                      },
                      '.MuiTablePagination-spacer': {
                        display: 'none '
                      },
                      '.MuiTablePagination-input': {
                        marginRight: 'auto'
                      },
                    }}

                    labelRowsPerPage='Show'
                    labelDisplayedRows={(page) =>
                      `Showing ${page.from}-${page.to === -1 ? page.count : page.to} of ${page.count}`
                    }
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    component="div"
                    count={stateRegisterCount}
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

export default RegisterDownload