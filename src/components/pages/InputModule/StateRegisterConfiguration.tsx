import React, { useEffect } from 'react'
import PageLoader from '../../shared/PageLoader'
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import { getActivities, getActs, getAllCompaniesDetails, getAssociateCompanies, getColumns, getForms, getLocations, getRules, getStates } from '../../../redux/features/inputModule.slice';
import { Box, Button, Drawer, FormControl, FormControlLabel, FormLabel, IconButton, InputAdornment, InputLabel, MenuItem, Modal, OutlinedInput, Radio, RadioGroup, Select as MSelect, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, TextField, Typography } from '@mui/material';
import { FaUpload, FaDownload } from "react-icons/fa";
import { IoMdAdd, IoMdClose, IoMdSearch } from "react-icons/io";
import { DEFAULT_OPTIONS_PAYLOAD, DEFAULT_PAYLOAD } from '../../common/Table';
import { addHoliday, deleteHoliday, editHoliday, getHolidaysList, resetAddHolidayDetails, resetDeleteHolidayDetails, resetEditHolidayDetails, resetUploadHolidayDetails, uploadHoliday } from '../../../redux/features/holidayList.slice';
import Icon from '../../common/Icon';
import { useExportHolidayList } from '../../../backend/exports';
import { download, downloadFileContent, preventDefault } from '../../../utils/common';
import { ERROR_MESSAGES } from '../../../utils/constants';
import { toast } from 'react-toastify';
import { Alert } from 'react-bootstrap';
import { getLeaveConfiguration } from '../../../redux/features/leaveConfiguration.slice';
import { getStateConfigurationDetails, getStateRegister } from '../../../redux/features/stateRegister.slice';
import Select from "react-select";

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

const StateRegisterConfiguration = () => {

  const dispatch: any = useAppDispatch();

  const stateRegisterDetails = useAppSelector((state) => state.stateRegister.stateRegisterDetails)

  const formsDetails = useAppSelector((state) => state.inputModule.formsDetails)
  const statesDetails = useAppSelector((state) => state.inputModule.statesDetails)
  const stateConfigureDetails = useAppSelector((state) => state.stateRegister.stateConfigureDetails)
  const getColumnsDetails = useAppSelector((state) => state.inputModule.getColumnsDetails);

  console.log(formsDetails, "formsDetails")
  

  
  const { exportHolidayList, exporting } = useExportHolidayList((response: any) => {
    downloadFileContent({
        name: 'HolidayList.xlsx',
        type: response.headers['content-type'],
        content: response.data
    });
  }, () => {
      toast.error(ERROR_MESSAGES.DEFAULT);
  });

  const stateRegister = stateRegisterDetails.data.list
  const stateRegisterCount = stateRegisterDetails.data.count

  const statesList = statesDetails && statesDetails.data.list
  const columnsList = getColumnsDetails && getColumnsDetails.data
  const fontList = ['Arial',
  'Arial Black',
  'Bahnschrift',
  'Calibri',
  'Cambria',
  'Cambria Math',
  'Candara',
  'Comic Sans MS',
  'Consolas',
  'Constantia',
  'Corbel',
  'Courier New',
  'Ebrima',
  'Franklin Gothic Medium',
  'Gabriola',
  'Gadugi',
  'Georgia',
  'HoloLens MDL2 Assets',
  'Impact',
  'Ink Free',
  'Javanese Text',
  'Leelawadee UI',
  'Lucida Console',
  'Lucida Sans Unicode',
  'Malgun Gothic',
  'Marlett',
  'Microsoft Himalaya',
  'Microsoft JhengHei',
  'Microsoft New Tai Lue',
  'Microsoft PhagsPa',
  'Microsoft Sans Serif',
  'Microsoft Tai Le',
  'Microsoft YaHei',
  'Microsoft Yi Baiti',
  'MingLiU-ExtB',
  'Mongolian Baiti',
  'MS Gothic',
  'MV Boli',
  'Myanmar Text',
  'Nirmala UI',
  'Palatino Linotype',
  'Segoe MDL2 Assets',
  'Segoe Print',
  'Segoe Script',
  'Segoe UI',
  'Segoe UI Historic',
  'Segoe UI Emoji',
  'Segoe UI Symbol',
  'SimSun',
  'Sitka',
  'Sylfaen',
  'Symbol',
  'Tahoma',
  'Times New Roman',
  'Trebuchet MS',
  'Verdana',
  'Webdings',
  'Wingdings',
  'Yu Gothic',]

  const loading = exporting || formsDetails.status === 'loading' || stateRegisterDetails.status === 'loading' || stateConfigureDetails.status === 'loading' || getColumnsDetails.status === 'loading'

  const [stateValue, setStateValue] = React.useState('');
  const [type, setType] = React.useState('');

  const [registerType, setRegisterType] = React.useState('');
  const [stateName, setStateName] = React.useState<any>('');
  const [actName, setActName] = React.useState<any>('')
  const [ruleName, setRuleName] = React.useState<any>('')
  const [activityName, setActivityName] = React.useState<any>('')
  const [formName, setFormName] = React.useState<any>('');
  const [formNameValue, setFormNameValue] = React.useState<any>('');

  const [tableData, setTableData] = React.useState<any>([]);
  const [showInitialConfig, setShowInitialConfig] = React.useState<any>(false);
  const [showConfigTable, setShowConfigTable] = React.useState<any>(false);

  const [company, setCompany] = React.useState('');
  const [associateCompany, setAssociateCompany] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [year, setYear] = React.useState('');
  const [month, setMonth] =  React.useState('');
  const [day, setDay] = React.useState('');
  const [name, setName] = React.useState('')

  const [searchInput, setSearchInput] = React.useState('');
  const [activeSort, setActiveSort] = React.useState('name')
  const [sortType, setSortType] = React.useState<any>('asc')

  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [page, setPage] = React.useState(0);

  const [holiday, setHoliday] = React.useState<any>({});

  const [optionalHoliday, setOptionalHoliday] = React.useState(true);
  const [restrictedHoliday, setRestrictedHoliday] = React.useState(true);

  const [openAddModal, setOpenAddModal] = React.useState(false);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);

  const fromsList = formsDetails.data.list ? formsDetails.data.list : []
  const filteredFormsList = fromsList.filter((each:any) => each.filePath !== '' && each.formName !== '')
  // const actsList = filteredFormsList ? filteredFormsList.map((each:any) => {return {name: each.actRuleActivityMapping.act.name, id: each.actRuleActivityMapping.act.id}}) : []
  // const rulesList = filteredFormsList ? filteredFormsList.map((each:any) => {if(each.actRuleActivityMapping.actId === (actName && actName.value)){return {name: each.actRuleActivityMapping.rule.name, id: each.actRuleActivityMapping.rule.id}}}) : []
  // const activitiesList = filteredFormsList ? filteredFormsList.map((each:any) => {if(each.actRuleActivityMapping.actId === (actName && actName.value) && each.actRuleActivityMapping.ruleId === (ruleName && ruleName.value)) {return {name: each.actRuleActivityMapping.activity.name, id: each.actRuleActivityMapping.activity.id}}}) : []

  console.log( 'actsList1',filteredFormsList.length, 'filteredFormsList', filteredFormsList)

  const formNameslist = filteredFormsList ? filteredFormsList.filter((each: any) => each.actRuleActivityMapping.actId === actName.value && each.actRuleActivityMapping.ruleId === ruleName.value && each.actRuleActivityMapping.activityId === activityName.value ): []
  console.log('act', actName, 'rule', ruleName, 'acgtivity', activityName, '\n formNameslist', formNameslist)

  const handleChangeStateValue = (event:any) => {
    setAssociateCompany('')
    setLocation('')
    setYear('')
    setMonth('')
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

  const handleChangeType = (event:any) => {
    setLocation('')
    setYear('')
    setMonth('')
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

  const handleChangeSearchInput = (event:any) => {
    setSearchInput(event.target.value)
  }

  const handleChangeStateName = (e:any) => {
    dispatch(getForms({
      pagination: {
          pageSize: 20000,
          pageNumber: 1
      },
      filters: [{columnName: 'stateId', value: e.value}],
      search: '',
      sort: { columnName: 'filePath', order: 'asc' }}
    ))
    setStateName(e)
    setActName('')
    setRuleName('')
    setActivityName('')
    setFormName('')
  }

  const handleChangeColumnType = (e:any, fieldData:any) => {
    console.log('eve',event)

  }



  
  const handleChangeEzycompField = (event:any, fieldData: any) => {
    console.log('eve',event)
    const newTableData = tableData.map((each:any) => {
      if(each.id === fieldData.id){
        return {...each, employeeFieldName: event.value, mapped: true}
      }else{
        return each
      }
    })
    console.log('new tb', newTableData)
    setTableData(newTableData)
  }

  const handleChangeStyle = (event:any, fieldData:any) => {
    console.log('eve',event)

  }
  
  const handleChangeFontName = (event:any, fieldData:any) => {
    console.log('eve',event)

  }

  const handleChangeFontSize = (event:any, fieldData:any) => {
    console.log('eve',event)

  }
  
  const handleChangeValueMerged = (event:any, fieldData:any) => {
    console.log('eve',event)

  }
  
  const handleChangeValueMergedRange = (event:any, fieldData:any) => {
    console.log('eve',event)

  }
  
  const handleChangeValueRow = (event:any, fieldData:any) => {
    console.log('eve',event)

  }

  const handleChangeValueColumn = (event:any, fieldData:any) => {
    console.log('eve',event)

  }

  useEffect(() => {
    const stateRegisterDefaultPayload: any =  { 
      search: "",
      filters: [],
      pagination: {
        pageSize: 10,
        pageNumber: 1
      },
      sort: { columnName: 'columnName', order: 'asc' },
      "includeCentral": true
    }

    const statesPayload: any = { ...DEFAULT_OPTIONS_PAYLOAD}
    dispatch(getStateRegister(stateRegisterDefaultPayload))
    dispatch(getStates(statesPayload))
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
    if(stateRegisterDetails.status === 'succeeded'){
     
    }else if(stateRegisterDetails.status === 'failed'){
      toast.error(ERROR_MESSAGES.DEFAULT);
    }
  },[stateRegisterDetails.status])

  useEffect(() => {
    if(stateConfigureDetails.status === 'succeeded'){
      setShowInitialConfig(false)
      setShowConfigTable(true)
      setTableData(stateConfigureDetails.data)
      dispatch(getColumns('Employee'))
    }else if(stateConfigureDetails.status === 'failed'){
      toast.error(ERROR_MESSAGES.DEFAULT);
    }
  }, [stateConfigureDetails.status])

  console.log('ftable data', tableData)
  const yearsList = []
  const currentYear = new Date().getFullYear();

  for (let i = currentYear; i >= 1950; i--) {
    yearsList.push(i)
  }

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
      sort: { columnName: activeSort, order: sortType },
      "includeCentral": true
    }
    exportHolidayList({ ...HolidayListPayload, pagination: null });
  }

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
    if(location){
      filters.push({
        columnName:'locationId',
        value: location
      })
    }

    const leaveConfigurationPayload: any =  { 
      search: searchInput, 
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page+1
      },
      sort: { columnName: 'ezycompLeave', order: type },
      "includeCentral": true
    }
    dispatch(getLeaveConfiguration(leaveConfigurationPayload))
    
  }

  const addButtonDisable = !name || !company || !associateCompany || !location || !year || !month || !day 

  const onClickAdd = () => {
    setShowInitialConfig(true)
    setOpenAddModal(true)
  }

  const onClickConfigure = () => {
    if(!registerType || !stateName || !actName || !ruleName || !activityName || !formName || !formNameValue){
      return toast.error(ERROR_MESSAGES.FILL_ALL);
    }else{
      const payload = formName.value
      const testUrl = 'https://mafoi.s3.ap-south-1.amazonaws.com/inputtemplates/test3.xlsx'
      dispatch(getStateConfigurationDetails(testUrl))
    }
  }

  const onClickSave = () => {
    console.log('save')
  }

  const onClickSubmitAdd = () => {
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
      name,
      optionalHoliday,
      companyId: company,
      associateCompanyId: associateCompany,
      locationId: location.split('^')[0],
      stateId: location.split('^')[1],
      year,
      month: monthKey,
      day,
      restricted:restrictedHoliday,
      remarks: ''
    }
    dispatch(addHoliday(payload))
  }

  const onclickEdit = (holiday:any) => {
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
    setName(holiday.name)
    setCompany(holiday.company.id)
    setAssociateCompany(holiday.associateCompany.id)
    setLocation(holiday.location.id+'^'+holiday.stateId)
    setYear(holiday.year)
    setMonth(monthKey)
    setDay(holiday.day)
    setOptionalHoliday(holiday.optionalHoliday)
    setRestrictedHoliday(holiday.restricted)
    setHoliday(holiday)
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

  const onclickView = (holiday:any) => {
    setOpenModal(true)
    setModalType('View')
    setHoliday(holiday)
  }

  const onclickDelete = (holiday:any) => {
    setHoliday(holiday)
    setOpenDeleteModal(true)
  }
 
  const onClickConfirmDelete = () => {
    dispatch(deleteHoliday(holiday.id))
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    const HolidayListPayload: any =  { 
      search: '', 
      filters: [],
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: newPage+1
      },
      sort: { columnName: 'name', order: 'asc' },
      "includeCentral": true
    }

    dispatch(getHolidaysList(HolidayListPayload))
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const HolidayListPayload: any =  { 
      search: '', 
      filters: [],
      pagination: {
        pageSize: parseInt(event.target.value, 10),
        pageNumber: 1
      },
      sort: { columnName: 'name', order: 'asc' },
      "includeCentral": true
    }

    dispatch(getHolidaysList(HolidayListPayload))
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div style={{ height:'100vh', backgroundColor:'#ffffff'}}>

      {/** Add Configure modal */}
      <Modal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
      >

        <Box sx={style}>

          <Box sx={{backgroundColor:'#E2E3F8', padding:'10px', px:'20px', borderRadius:'6px', boxShadow: '0px 6px 10px #CDD2D9', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <Typography sx={{font: 'normal normal normal 32px/40px Calibri'}}>Configure Register</Typography>
            <IconButton
              onClick={() => setOpenAddModal(false)}
            >
              <IoMdClose />
            </IconButton>
          </Box>

          {showInitialConfig && <Box sx={{padding:'20px', backgroundColor:'#ffffff'}}>
              <FormControl sx={{ m: 1, width:"100%", backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                <FormLabel  sx={{color:'#000000'}}>Register Type</FormLabel>
                <MSelect
                  value={registerType}
                  displayEmpty
                  onChange={(e) => {setRegisterType(e.target.value)}}
                >
                  <MenuItem disabled sx={{display:'none'}} value="">
                    Select
                  </MenuItem>
                  {['State', 'Central'].map((each:any) => {
                      return <MenuItem value={each}>{each}</MenuItem>
                  })}
                </MSelect>
              </FormControl>

              <FormControl sx={{ m: 1, width:"100%", backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                <FormLabel  sx={{color:'#000000'}}>State</FormLabel>
                <Select
                  options={statesList && statesList.map((each:any) => {return {label : each.name, value: each.id}})}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  value={stateName}
                  styles={customStyles}
                  onChange={(e:any) => {handleChangeStateName(e) }}
                />
              </FormControl>

              <FormControl sx={{ m: 1, width:"100%", backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                <FormLabel  sx={{color:'#000000'}}>Act</FormLabel>
                <Select
                  isDisabled={!stateName}
                  options={filteredFormsList && filteredFormsList.map((each:any) => {return {label: each.actRuleActivityMapping.act.name, value: each.actRuleActivityMapping.act.id}})}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  value={actName}
                  styles={customStyles}
                  onChange={(e:any) => {setActName(e); setRuleName(''); setActivityName(''); setFormName('')}}
                />
              </FormControl>

              <FormControl sx={{ m: 1, width:"100%", backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                <FormLabel  sx={{color:'#000000'}}>Rule</FormLabel>
                <Select
                  isDisabled={!actName}
                  options={filteredFormsList && filteredFormsList.filter((each:any) => each.actRuleActivityMapping.actId === actName.value).map((each:any) => {return {label: each.actRuleActivityMapping.rule.name, value: each.actRuleActivityMapping.rule.id}})}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  value={ruleName}
                  styles={customStyles}
                  onChange={(e:any) => {setRuleName(e); setActivityName(''); setFormName('')}}
                />
              </FormControl>

              <FormControl sx={{ m: 1, width:"100%", backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                <FormLabel  sx={{color:'#000000'}}>Activity</FormLabel>
                <Select
                  isDisabled={!ruleName}
                  options={filteredFormsList && filteredFormsList.filter((each:any) => each.actRuleActivityMapping.actId === actName.value && each.actRuleActivityMapping.ruleId === ruleName.value).map((each:any) => {return {label: each.actRuleActivityMapping.activity.name, value: each.actRuleActivityMapping.activity.id}})}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  value={activityName}
                  styles={customStyles}
                  onChange={(e:any) => {setActivityName(e); setFormName('')}}
                />
              </FormControl>  

              <FormControl sx={{ m: 1, width:"100%", backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                <FormLabel  sx={{color:'#000000'}}>Form</FormLabel>
                <Select
                  isDisabled={!activityName}
                  options={filteredFormsList && filteredFormsList.filter((each:any) => each.actRuleActivityMapping.actId === actName.value && each.actRuleActivityMapping.ruleId === ruleName.value && each.actRuleActivityMapping.activityId === activityName.value).map((each:any) => {return {label: each.formName, value: each.filePath}})}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  value={formName}
                  styles={customStyles}
                  onChange={(e:any) => {setFormName(e)}}
                />
              </FormControl>  

              <FormControl sx={{ m: 1, width:"100%", backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                <FormLabel id="demo-radio-buttons-group-label"  sx={{color:'#000000'}}>Form Name</FormLabel>
                <OutlinedInput
                  sx={{
                    '& input::placeholder':{
                      fontSize:'14px'
                    }
                  }}
                  placeholder='Form Name'
                  value={formNameValue}
                  onChange={(e) => setFormNameValue(e.target.value)}
                  id="outlined-adornment-name"
                  type='text'
                />
              </FormControl>

              <Box sx={{display:'flex', justifyContent:'space-between', alignItems:'center', mt:2}}>
                <Button variant='contained' onClick={onClickConfigure}>Configure</Button>
              </Box>
          </Box>}

          <Box>
              {showConfigTable && tableData &&  tableData.length > 0 && <Box sx={{paddingX: '20px', display: 'flex', flexDirection:'column'}}>
              
              {tableData && tableData.length <= 0 ? 

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
                                    <TableCell > Label Merged</TableCell>
                                    <TableCell > Label Merged Range </TableCell>
                                    <TableCell > Label Row Address </TableCell>
                                    <TableCell > Label Column Address </TableCell>
                                    <TableCell > Column Type</TableCell>
                                    <TableCell > Ezycomp Field</TableCell>
                                    <TableCell > Style</TableCell>
                                    <TableCell > Font Name</TableCell>
                                    <TableCell > Font Size</TableCell>
                                    <TableCell > Value Merged</TableCell>
                                    <TableCell > Value Merged Range </TableCell>
                                    <TableCell > Value Row Address </TableCell>
                                    <TableCell > Value Column Address </TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>

                            {tableData && tableData.map((each: any, index: number) => (
                                  <TableRow
                                    key={each._id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                  >   
                                    <TableCell >{index+1}</TableCell>
                                    <TableCell >{each.labelName}</TableCell>
                                    <TableCell >{each.labelMerged ? "Yes" : "No"}</TableCell>
                                    <TableCell >{each.labelMergedRange ? each.labelMergedRange : 'NA'}</TableCell>
                                    <TableCell >{!each.labelMerged ? each.labelRowAddress : 'NA'}</TableCell>
                                    <TableCell >{!each.labelMerged ? each.lableColumnAddress : 'NA'}</TableCell>

                                    {/** Column Type */}
                                    <TableCell >
                                      <FormControl sx={{ m: 1, width:"100%", maxWidth:'120px', backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                                        <MSelect
                                          value={each.columnType ? each.columnType : ''}
                                          displayEmpty
                                          onChange={(e) => {handleChangeColumnType(e, each)}}
                                        >
                                          <MenuItem disabled sx={{display:'none'}} value="">
                                            Select Column type
                                          </MenuItem>
                                          {['Header', 'Footer', 'Detail', 'Formula'].map((each:any) => {
                                              return <MenuItem value={each}>{each}</MenuItem>
                                          })}
                                        </MSelect>
                                      </FormControl>
                                    </TableCell>
                                    
                                    {/** Ezycomp Field */}
                                    <TableCell >
                                      <FormControl sx={{ m: 1, width:"100%", minWidth:'120px', backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                                        <Select
                                          options={columnsList ? columnsList.map((each:any) => {return {label : each, value: each}}): []}
                                          className="basic-multi-select"
                                          classNamePrefix="select"
                                          value={each.employeeFieldName ? {label: each.employeeFieldName, value: each.employeeFieldName} : ''}
                                          styles={customStyles}
                                          onChange={(e) => handleChangeEzycompField(e, each)}
                                        />
                                      </FormControl>
                                    </TableCell>

                                    {/** Style */}
                                    <TableCell >
                                      <FormControl sx={{ m: 1, width:"100%", maxWidth:'100px', backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                                        <MSelect
                                          value={each.style ? each.style : ''}
                                          displayEmpty
                                          onChange={(e) => {handleChangeStyle(e, each)}}
                                        >
                                          <MenuItem disabled sx={{display:'none'}} value="">
                                            Select Style
                                          </MenuItem>
                                          {['Bold', 'Italic', 'Underline'].map((each:any) => {
                                              return <MenuItem value={each}>{each}</MenuItem>
                                          })}
                                        </MSelect>
                                      </FormControl>
                                    </TableCell>

                                    {/** Font Name */}
                                    <TableCell > 
                                      <FormControl sx={{ m: 1, width:"100%", maxWidth:'190px', minWidth:'120px', backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                                        <Select
                                          options={fontList.map((each:any) => {return {label : each, value: each}})}
                                          className="basic-multi-select"
                                          classNamePrefix="select"
                                          value={each.fontName ? {label: each.fontName, value: each.fontName} : ''}
                                          styles={customStyles}
                                          onChange={(e) => handleChangeFontName(e, each)}
                                        />
                                      </FormControl>
                                    </TableCell>

                                    {/** Font Size */}
                                    <TableCell > 
                                      <FormControl sx={{ m: 1, width:"100%", maxWidth:'190px', minWidth:'120px', backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                                        <OutlinedInput
                                          sx={{
                                            '& input::placeholder':{
                                              fontSize:'14px'
                                            }
                                          }}
                                          type='number'
                                          placeholder='Font Size'
                                          value={each.fontSize ? each.fontSize : ''}
                                          onChange={(e) => handleChangeFontSize(e, each)}
                                          id="outlined-adornment-name"
                                        />
                                      </FormControl>
                                    </TableCell>

                                    {/** Value Merged */}
                                    <TableCell >
                                      <FormControl sx={{ m: 1, width:"100%", maxWidth:'120px', backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                                        <MSelect
                                          value={each.valueMerged ? (each.valueMerged ? "Yes" : "No") : ''}
                                          displayEmpty
                                          onChange={(e) => {handleChangeValueMerged(e, each)}}
                                        >
                                          <MenuItem disabled sx={{display:'none'}} value="">
                                            Select Value Merged
                                          </MenuItem>
                                          {['Yes', 'No'].map((each:any) => {
                                              return <MenuItem value={each}>{each}</MenuItem>
                                          })}
                                        </MSelect>
                                      </FormControl>
                                    </TableCell>

                                    {/** Value Merged Range*/}
                                    <TableCell > 
                                      <FormControl sx={{ m: 1, width:"100%", maxWidth:'190px', minWidth:'120px', backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                                        <OutlinedInput
                                          sx={{
                                            '& input::placeholder':{
                                              fontSize:'14px'
                                            }
                                          }}
                                          placeholder='Value Merged Range'
                                          value={each.valueMergedRange ? each.valueMergedRange : ''}
                                          onChange={(e) => handleChangeValueMergedRange(e, each)}
                                          id="outlined-adornment-name"
                                          type='text'
                                        />
                                      </FormControl>
                                    </TableCell>

                                    {/** Value Row Address*/}
                                    <TableCell > 
                                      <FormControl sx={{ m: 1, width:"100%", maxWidth:'190px', minWidth:'120px', backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                                        <OutlinedInput
                                          sx={{
                                            '& input::placeholder':{
                                              fontSize:'14px'
                                            }
                                          }}
                                          placeholder='Value Row'
                                          value={each.valueRowAddress ? each.valueRowAddress : ''}
                                          onChange={(e) => handleChangeValueRow(e, each)}
                                          id="outlined-adornment-name"
                                          type='text'
                                        />
                                      </FormControl>
                                    </TableCell>

                                    {/** Value Column Address*/}
                                    <TableCell > 
                                      <FormControl sx={{ m: 1, width:"100%", maxWidth:'190px', minWidth:'120px', backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                                        <OutlinedInput
                                          sx={{
                                            '& input::placeholder':{
                                              fontSize:'14px'
                                            }
                                          }}
                                          placeholder='Value Column'
                                          value={each.valueColumnAddress ? each.valueColumnAddress : ''}
                                          onChange={(e) => handleChangeValueColumn(e, each)}
                                          id="outlined-adornment-name"
                                          type='text'
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
              <Button sx={{marginTop:'20px', marginBottom:'10px', alignSelf:'flex-end', width:'200px'}} variant='contained' onClick={onClickSave}>Save</Button>  
              </Box>}

          </Box>

        </Box>

      </Modal>

      {/* Delete Modal */}
      <Modal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
      >
        <Box sx={style}>
          <Box sx={{backgroundColor:'#E2E3F8', padding:'10px', px:'20px', borderRadius:'6px', boxShadow: '0px 6px 10px #CDD2D9', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <Typography sx={{font: 'normal normal normal 32px/40px Calibri'}}>Delete Holiday List</Typography>
            <IconButton
              onClick={() => setOpenDeleteModal(false)}
            >
              <IoMdClose />
            </IconButton>
          </Box>
          <Box sx={{padding:'20px', backgroundColor:'#ffffff'}}>
            <Box sx={{display:'flex', alignItems:'center'}}>
              <Typography >Are you sure you want to delete the Holiday, &nbsp;</Typography>
              <Typography variant='h5'>{holiday && holiday.name}</Typography>
            </Box>
            <Box sx={{display:'flex', justifyContent:'space-between', alignItems:'center', mt:2}}>
              <Button variant='outlined' color="error" onClick={() => setOpenDeleteModal(false)}>No</Button>
              <Button variant='contained' onClick={onClickConfirmDelete}>Yes</Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      {loading ? <PageLoader>Loading...</PageLoader> : 
      
        <div>
             <Box sx={{paddingX: '20px', paddingY:'10px',}}>
                <div style={{backgroundColor:'#E2E3F8', padding:'20px', borderRadius:'6px', boxShadow: '0px 6px 10px #CDD2D9'}}>
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px', marginTop:'10px'}}>
                        <h5 style={{ font: 'normal normal normal 32px/40px Calibri' }}>State Register Configuration</h5>
                        <div style={{marginRight:'12px', display:'flex', alignItems:'center', width:'150px', justifyContent: 'space-between'}}>
                          <Button onClick={onClickAdd} variant='contained' style={{backgroundColor:'#0654AD', display:'flex', alignItems:'center'}}> <IoMdAdd /> &nbsp; Add</Button>
                          <button onClick={onClickExport} disabled={!stateRegister} style={{display:'flex', justifyContent:'center', alignItems:'center', backgroundColor: !stateRegister ? '#707070': '#ffffff' , color: !stateRegister ? '#ffffff': '#000000', border:'1px solid #000000', width:'40px', height:'30px', borderRadius:'8px'}}> <FaDownload /> </button>
                        </div>
                    </div>
                    <div style={{display:'flex'}}>

                      <Box sx={{ mr:1}}>
                        <Typography mb={1}>States</Typography>
                        <FormControl sx={{ width:"220px", backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                          <MSelect
                            sx={{'.MuiOutlinedInput-notchedOutline': { border: 0 }}}
                            value={company}
                            displayEmpty
                            onChange={handleChangeStateValue}
                          >
                            <MenuItem disabled sx={{display:'none'}} value="">
                              Select state
                            </MenuItem>
                            {statesList && statesList.map((each:any) => {
                                return <MenuItem value={each.id}>{each.name}</MenuItem>
                            })}
                          </MSelect>
                        </FormControl>
                      </Box>

                      <Box sx={{ mr:1}}>
                        <Typography mb={1}>Type</Typography>
                        <FormControl sx={{ width:"220px", backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                          <MSelect
                            sx={{'.MuiOutlinedInput-notchedOutline': { border: 0 }}}
                            displayEmpty
                            value={associateCompany}
                            disabled={!company}
                            onChange={handleChangeType}
                          >
                            <MenuItem disabled sx={{display:'none'}} value="">
                              Select Type
                            </MenuItem>
                            {['All', 'State', 'Central'].map((each:any) => {
                              return <MenuItem value={each.id}>{each.name}</MenuItem>
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
                stateRegister && stateRegister.length <= 0 ? 

                <Box sx={{height:'60vh', display:'flex', justifyContent:'center', alignItems:'center'}}>
                  <Typography variant='h5'>No Records Found</Typography>
                </Box>
                : 
                <>
                  <TableContainer sx={{border:'1px solid #e6e6e6', marginTop:'10px',  maxHeight:'385px', overflowY:'scroll'}}>
                          <Table stickyHeader  sx={{ minWidth: 650 }} aria-label="sticky table">
                              <TableHead sx={{'.MuiTableCell-root':{ backgroundColor:'#E7EEF7'}}}>
                                  <TableRow>
                                      <TableCell > <TableSortLabel active={activeSort === 'ezycompLeave'} direction={sortType} onClick={onClickSortEzycompLeave}> Ezycomp Leave</TableSortLabel></TableCell>

                                      <TableCell > Actions</TableCell>
                                  </TableRow>
                              </TableHead>

                              <TableBody>

                              {stateRegister && stateRegister.map((each: any, index: number) => (
                                  <TableRow
                                  key={each._id}
                                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                  >   
                                      <TableCell >{each.ezycompLeave}</TableCell>
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

export default StateRegisterConfiguration