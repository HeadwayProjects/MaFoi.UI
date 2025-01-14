// import React, { useEffect, useState } from 'react'
// import PageLoader from '../../shared/PageLoader'
// import { useAppDispatch, useAppSelector } from '../../../redux/hook';
// import { getAllCompaniesDetails, getAssociateCompanies, getLocations, getStates } from '../../../redux/features/inputModule.slice';
// import { Box, Button, Drawer, FormControl, FormControlLabel, FormLabel, IconButton, InputAdornment, InputLabel, MenuItem, Modal, OutlinedInput, Radio, RadioGroup, Select as MSelect, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, TextField, Typography,Chip,Checkbox } from '@mui/material';
// import { addHoliday, deleteHoliday, editHoliday, getHolidaysList, resetAddHolidayDetails, resetDeleteHolidayDetails, resetEditHolidayDetails, resetGetHolidayDetailsStatus, resetUploadHolidayDetails, uploadHoliday } from '../../../redux/features/holidayList.slice';

// import { getEmployeeBackendCount, getEmployeeDashboardCounts, getEmployeeInputDashboard, getErrorLogs, resetEmployeeBackendCountDetailsStatus, resetEmployeeDashboardCountsDetailsStatus, resetEmployeeInputDashboardDetailsStatus, resetErrorLogsDetailsStatus } from '../../../redux/features/dashboard.slice';
// import { FaCheck, FaCloudDownloadAlt, FaCloudUploadAlt, FaCode, FaRegEye, FaRegKeyboard } from 'react-icons/fa';
// import { FaRegCircleCheck } from 'react-icons/fa6'
// import { MdOutput } from "react-icons/md";
// import { getBasePath } from '../../../App';
// import { navigate } from 'raviger';
// import axios from 'axios';
// import { hasUserAccess } from '../../../backend/auth';
// import { USER_PRIVILEGES } from '../UserManagement/Roles/RoleConfiguration';
// import State from '../Masters/State';
// import JSZip from 'jszip';
// import { saveAs } from 'file-saver';
// import { getActivities, getActs,  getRules} from '../../../redux/features/inputModule.slice';
// import { FaUpload, FaDownload } from "react-icons/fa";
// import { IoMdAdd, IoMdClose, IoMdSearch } from "react-icons/io";
// import { DEFAULT_OPTIONS_PAYLOAD, DEFAULT_PAYLOAD } from '../../common/Table';
// import Icon from '../../common/Icon';
// import { download, downloadFileContent, preventDefault } from '../../../utils/common';
// import { ERROR_MESSAGES } from '../../../utils/constants';
// import { toast } from 'react-toastify';
// import { Alert } from 'react-bootstrap';
// import { getLeaveConfiguration } from '../../../redux/features/leaveConfiguration.slice';
// //import { resetImportFileDetails, updatestateRegisterQue, addstateRegisterQue, getStateConfigurationDetails, resetAddStateConfigDetails, resetStateConfigDetails, resetDeletestateRegisterQueMappingConfigDetails, resetExportFileDetails, getstateRegisterQueDownload ,resetstateRegisterQueDownloadDetails} from '../../../redux/features/stateRegisterQue.slice';

// import { EstablishmentTypes } from '../Masters/Master.constants';
// import { RxCross2 } from "react-icons/rx";
// import { each } from 'underscore';
// import { relative } from 'path';
// import { deleteActStateMappingForm } from '../../../redux/features/Stateactruleactivitymapping.slice';








// const InputsDashboard = () => {

//   const dispatch = useAppDispatch();

//   const employeeDashboardCountsDetails = useAppSelector((state) => state.inputDashboard.employeeDashboardCountsDetails)
//   const employeeInputDashboardDetails = useAppSelector((state) => state.inputDashboard.employeeInputDashboardDetails)
//   const employeeBackendCountDetails = useAppSelector((state) => state.inputDashboard.employeeBackendCountDetails)
//   const getErrorLogDetails = useAppSelector((state) => state.inputDashboard.errorLogsDetails);

//   const employeeCounts = employeeDashboardCountsDetails &&  employeeDashboardCountsDetails.data
//   const inputDashboardList = employeeInputDashboardDetails.data.inputList ? employeeInputDashboardDetails.data.inputList : []

//   const companiesDetails = useAppSelector((state) => state.inputModule.companiesDetails);
//   const associateCompaniesDetails = useAppSelector((state) => state.inputModule.associateCompaniesDetails);
//   const locationsDetails = useAppSelector((state) => state.inputModule.locationsDetails);
//   const statesDetails = useAppSelector((state) => state.inputModule.statesDetails);
//   const companies = companiesDetails && companiesDetails.data.list
//   const associateCompanies = associateCompaniesDetails && associateCompaniesDetails.data.list
//   const locations = locationsDetails && locationsDetails.data.list
//   const totalstates = statesDetails && statesDetails.data.list
//   let states = locations && locations.map((each:any) => {
//     const { id, name, code, cities }: any = each.location || {};
//     const { state } = cities || {};
//     return {name: state.name, id: state.id}
//   })

//   states = states && states.filter((each:any, index:any, self:any) => {
//     if(index === self.findIndex((t:any) => t.id === each.id)){
//       return each
//     }
//   })
  
//   const loading = employeeBackendCountDetails.status === 'loading' || employeeInputDashboardDetails.status === 'loading' || employeeDashboardCountsDetails.status === 'loading' || companiesDetails.status === 'loading' || associateCompaniesDetails.status === 'loading' || locationsDetails.status === 'loading' || statesDetails.status === 'loading'
//   const [downloading,setDownloading]= useState(false);

//   const [company, setCompany] = React.useState('');
//   const [associateCompany, setAssociateCompany] = React.useState('');
//   const [stateName, setStateName] = React.useState('');
//   const [location, setLocation] = useState<string[]>([]);
//   const [year, setYear] = React.useState('');
//   const [month, setMonth] =  React.useState<any>('');
//   const [establishmentType, setestablishmentType] =  React.useState<any>('');
//   const [locations1, setLocations1] = useState<any[]>([]); // Mock data for locations
  
//   const [companyName, setCompanyName] = React.useState('');
//   const [associateCompanyName, setAssociateCompanyName] = React.useState('');
//   const [locationName, setLocationName] = React.useState('');
    
//   const [selectedStateName, setSelectedStateName] = React.useState('');

//   const [showDashboardDetails, setShowDashboardDetails] = React.useState(true);
//   const [queue, setQueue] = React.useState(true);
//   const [queueNumbers, SetqueueNumbers] = React.useState<string[]>([]);
//   // const [errorLogs, setErrorLogs] = useState<FileDetails[]>([]);


//   // form register download 
  
  
//     const stateRegisterDownloadDetails = useAppSelector((state) => state.stateRegister.stateRegisterDownloadDetails)
//      console.log('stateRegisterdownloadDetails', stateRegisterDownloadDetails)
//     const formsDetails = useAppSelector((state) => state.inputModule.formsDetails)
//     const statesDetails2 = useAppSelector((state) => state.inputModule.statesDetails)
//     const stateConfigureDetails = useAppSelector((state) => state.stateRegister.stateConfigureDetails)
//     const getColumnsDetails = useAppSelector((state) => state.inputModule.getColumnsDetails);
//     const addStateRegisterDetails = useAppSelector((state) => state.stateRegister.addStateRegisterDetails)
//     const updateStateRegisterDetails = useAppSelector((state) => state.stateRegister.updateStateRegisterDetails)
//     const deleteStateRegisterMappingDetails = useAppSelector((state) => state.stateRegister.deleteStateRegisterMappingDetails)
//     const exportFile = useAppSelector(state => state.stateRegister.exportFile);
//     const importStateRegisterMappingDetails = useAppSelector((state) => state.stateRegister.importStateRegisterMappingDetails);
  
//     const companiesDetails2 = useAppSelector((state) => state.inputModule.companiesDetails);
//     const associateCompaniesDetails2 = useAppSelector((state) => state.inputModule.associateCompaniesDetails);
//     const locationsDetails2 = useAppSelector((state) => state.inputModule.locationsDetails);
  
//     // console.log(formsDetails, "formsDetails")
  
//     const stateRegisterDownload = stateRegisterDownloadDetails.data.List
//     const stateRegisterCount = stateRegisterDownloadDetails.data.Count
  
//     console.log(stateRegisterCount);
  
//     const companies2 = companiesDetails.data.list
//     const associateCompanies2 = associateCompaniesDetails.data.list
//     const locations2 = locationsDetails.data.list
  
//     console.log(locations);
  
//     const statesList = statesDetails && statesDetails.data.list
//     const columnsList = getColumnsDetails && getColumnsDetails.data
  
  
//     const loading2 = importStateRegisterMappingDetails.status === 'loading' || deleteStateRegisterMappingDetails.status === 'loading' || updateStateRegisterDetails.status === 'loading' || addStateRegisterDetails.status === 'loading' || formsDetails.status === 'loading' || stateRegisterDownloadDetails.status === 'loading' || stateConfigureDetails.status === 'loading' || getColumnsDetails.status === 'loading'
  
//     const [stateValue, setStateValue] = React.useState('');
//     const [type, setType] = React.useState('');

//     const [registerType, setRegisterType] = React.useState('');
//       const [processType, setProcessType] = React.useState<any>('');
    
//       const [company1, setCompany1] = React.useState('');
//       const [associateCompany1, setAssociateCompany1] = React.useState('');
//       const [stateName1, setStateName1] = React.useState('');
//       const [location1, setLocation1] = React.useState('');
//       const [year1, setYear1] = React.useState('');
//       const [month1, setMonth1] = React.useState<any>('');
    
    
    
    
//       const [actName, setActName] = React.useState<any>('')
//       const [ruleName, setRuleName] = React.useState<any>('')
//       const [activityName, setActivityName] = React.useState<any>('')
//       const [formName, setFormName] = React.useState<any>('');
//       const [formFilePath, setFormFilePath] = React.useState<any>('');
//       const [formNameValue, setFormNameValue] = React.useState<any>('');
//       const [headerStartRow, setHeaderStartRow] = React.useState<any>('');
//       const [headerEndRow, setHeaderEndRow] = React.useState<any>('');
//       const [footerStartRow, setFooterStartRow] = React.useState<any>('');
//       const [footerEndRow, setFooterEndRow] = React.useState<any>('');
//       const [totalRowsPerPage, setTotalRowsPerPage] = React.useState<any>('');
//       const [pageSize, setPageSize] = React.useState<any>('');
//       const [pageOrientation, setPageOrientation] = React.useState<any>('');
//       const [openPreviewModal, setOpenPreviewModal] = React.useState(false);
//       const [openEditModal, setOpenEditModal] = React.useState(false);
//       const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
//       const [openImportFileUploadModal, setopenImportFileUploadModal] = React.useState(false);
//       const [uploadError, setUploadError] = React.useState(false);
//       const [uploadImportData, setUploadImportData] = React.useState<any>();
    
//       const [tableData, setTableData] = React.useState<any>([]);
//       const [newtableData, setnewTableData] = React.useState<any>([]);
//       const [showInitialConfig, setShowInitialConfig] = React.useState<any>(false);
//       const [showConfigTable, setShowConfigTable] = React.useState<any>(false);
    
//       const [searchInput, setSearchInput] = React.useState('');
//       const [activeSort, setActiveSort] = React.useState('name')
//       const [sortType, setSortType] = React.useState<any>('asc')
    
//       const [rowsPerPage, setRowsPerPage] = React.useState(10)
//       const [page, setPage] = React.useState(0);
    
//       const [openAddModal, setOpenAddModal] = React.useState(false);
//       const [openImportExportModal, setImportExportModal] = React.useState(false);
//       const [openAddExport, setOpenAddExport] = React.useState(false)
    
//       const [openViewModal, setOpenViewModal] = React.useState(false);
//       const [selectedStateConfig, setSelectedStateConfig] = React.useState<any>({})
    
//       const fromsList = formsDetails.data.list ? formsDetails.data.list : []
//       const filteredFormsList = fromsList.filter((each: any) => each.filePath !== '' && each.formName !== '')
    
//       const [isHovered, setIsHovered] = React.useState(false);
//       const [hoveredRow, setHoveredRow] = useState(null);
    
    
//   console.log(selectedStateConfig);
//   console.log("tabledata", tableData);



















  
//   const storageObject = {
//     company,
//     associateCompany,
//     stateName,
//     locations1, // Array of selected locations
//     year,
//     month,
//     selectedStateName,
//     queue
//   };
//   console.log(storageObject);

//   const handleChangeCompany = (event:any) => {

//     const selectedCompanyId = event.target.value as string;
//     const selectedCompanyName = getCompanyNameById(selectedCompanyId, companies);
  
//    // setShowDashboardDetails(false)
//     setAssociateCompany('')
//     setStateName('')
//     setLocations1([])
//     setYear('')
//     setMonth('')
//     setCompany(event.target.value);
//     setCompanyName(selectedCompanyName);

//     //for table data
//     setAssociateCompany1(''); setLocation1(''); setYear1(''); setMonth1(''); setCompany1(event.target.value);
//     const payload: any =  { 
//       search: searchInput, 
//       filters: [
//         {
//           columnName:'companyId',
//           value: event.target.value
//         }
//       ],
//       pagination: {
//         pageSize: rowsPerPage,
//         pageNumber: page+1
//       },
//       sort: { columnName: 'stateId', order: 'asc' },
//       "includeCentral": true
//     }
//     dispatch(getstateRegisterQueDownload(payload))
//     //tabedata end
//   };
//   const getCompanyNameById = (id: string, companies: { id: string; name: string; }[]) => {
//     for (let i = 0; i < companies.length; i++) {
//       if (companies[i].id === id) {
//         return companies[i].name;
//       }
//     }
//     return '';
//   };

//   const handleChangeAssociateCompany = (event:any) => {
//     const selectedCompanyId = event.target.value as string;
//     const selectedCompanyName = getAssocCompanyNameById(selectedCompanyId, associateCompanies);
  
//     //alert(selectedCompanyName);
//  //   setShowDashboardDetails(false)
//  setLocation([]); // Reset locations
//     setYear('')
//     setMonth('')
//     setAssociateCompany(event.target.value);
//     setAssociateCompanyName(selectedCompanyName);


//     //for tabledata
//      setLocation1('')
//         setYear1('')
//         setMonth1('')
//         setAssociateCompany1(event.target.value);
//         const payload: any =  { 
//           search: searchInput, 
//           filters: [
//             {
//               columnName:'companyId',
//               value: company1
//             },
//             {
//               columnName:'associateCompanyId',
//               value: event.target.value
//             }
//           ],
//           pagination: {
//             pageSize: rowsPerPage,
//             pageNumber: page+1
//           },
//           sort: { columnName: 'stateId', order: 'asc' },
//           "includeCentral": true
//         }
//         dispatch(getstateRegisterQueDownload(payload))

//         //tabledata end
//   };
//   const getAssocCompanyNameById = (id: string, associateCompanies: { id: string; name: string; }[]) => {
//     for (let i = 0; i < associateCompanies.length; i++) {
//       if (associateCompanies[i].id === id) {
//         return associateCompanies[i].name;
//       }
//     }
//     return '';
//   };

//   const handleChangeStateName = (event:any) => {
//     const selectedStateId = event.target.value as string;
//     const selectedstateName = getStateNameById(selectedStateId, states);
//     setSelectedStateName(selectedstateName);
//   //  setShowDashboardDetails(false)
//     setYear('')
//     setMonth('')
//     setLocation([]); // Reset locations when the state changes
//     setLocations1([]);
//     setStateName(event.target.value);


//     //for table data 
//     setType('')
//         setStateName1(event.target.value)
//         const stateRegisterPayload: any = {
//           search: searchInput,
//           filters: [
//             {
//               columnName:'companyId',
//               value: company1
//             },
//             {
//               columnName:'associateCompanyId',
//               value: associateCompany1
//             },
//             {
//               columnName: 'stateId',
//               value: event.target.value
//             }
    
//           ],
//           pagination: {
//             pageSize: rowsPerPage,
//             pageNumber: page + 1
//           },
//           sort: { columnName: 'stateId', order: 'asc' },
//           "includeCentral": true
//         }
//         dispatch(getstateRegisterQueDownload(stateRegisterPayload))
//         //tabel data end
//   }

//   console.log("selstatename",selectedStateName)

//   const handleChangeLocation1 = (event: any) => {
//     alert(event.target.value);
//     const selectedLocations = event.target.value;
//     setLocations1(selectedLocations); // Store selected locations as an array

//     //for table data
//      setYear('')
//         setMonth('')
//         setLocation(event.target.value);
//         const locval = event.target.value;
//         const payload: any =  { 
//           search: searchInput, 
//           filters: [
//             {
//               columnName:'companyId',
//               value: company1
//             },
//             {
//               columnName:'associateCompanyId',
//               value: associateCompany1
//             },
//             {
//               columnName: 'stateId',
//               value: stateName1
//             },
//             {
//               columnName:'locationId',
//               value: event.target.value.split('^')[0]
//             }
//           ],
//           pagination: {
//             pageSize: rowsPerPage,
//             pageNumber: page+1
//           },
//           sort: { columnName: 'stateId', order: 'asc' },
//           "includeCentral": true
//         }
//         dispatch(getstateRegisterQueDownload(payload))
//         //table end 
//   };


//   const handleChangeLocation = (event:any) => {
//     const selectedCompanyId = event.target.value as string;
//    // alert(event.target.value);
//     const selectedCompanyName = getLocationById(selectedCompanyId, locations);
  
//   //  alert(selectedCompanyName);

//   //  setShowDashboardDetails(false)
//     setYear('')
//     setMonth('')
//     setLocation(event.target.value);
//     setLocationName(selectedCompanyName);
//   };

// const getLocationById = (id: string, locations: any[]) => {
//   for (let i = 0; i < locations.length; i++) {
//     if (locations[i].locationId === id) {
//       return locations[i].location.name;
//     }
//   }
//   return '';
// };

// const getStateNameById = (id: string, totalstates: { id: string; name: string; }[]) => {
//   for (let i = 0; i < totalstates.length; i++) {
//     if (totalstates[i].id === id) {
//       return totalstates[i].name;
//     }
//   }
//   return '';
// };

  
//   const handleChangeYear = (event:any) => {
//   //  setShowDashboardDetails(false)
//     setMonth('')
//     setYear(event.target.value.toString());

//     //for table data
//     setMonth1('')
//         setYear1(event.target.value.toString());
//         const payload: any =  { 
//           search: searchInput, 
//           filters: [
//             {
//               columnName:'companyId',
//               value: company1
//             },
//             {
//               columnName:'associateCompanyId',
//               value: associateCompany1
//             },
//             {
//               columnName:'locationId',
//               value: location1.split('^')[0]
//             },
//             {
//               columnName:'year',
//               value: event.target.value.toString()
//             }
//           ],
//           pagination: {
//             pageSize: rowsPerPage,
//             pageNumber: page+1
//           },
//           sort: { columnName: 'stateId', order: 'asc' },
//           "includeCentral": true
//         }
//         dispatch(getstateRegisterQueDownload(payload))
//   };
  
//   const handleChangeMonth = (event:any) => {
//   //  setShowDashboardDetails(false)
//   alert("hitted month");
//     setMonth(event.target.value);


//     //for table data
//      setMonth1(event.target.value);
//         //const monthKey = (monthList.findIndex((each) => each === event.target.value) + 1).toString()
//         const payload: any =  { 
//           search: searchInput, 
//           filters: [
//             {
//               columnName:'companyId',
//               value: company1
//             },
//             {
//               columnName:'associateCompanyId',
//               value: associateCompany1
//             },
//             {
//               columnName:'locationId',
//               value: location1.split('^')[0]
//             },
//             {
//               columnName:'year',
//               value: year1
//             },
//             {
//               columnName:'month',
//               value: event.target.value
//             }
//           ],
//           pagination: {
//             pageSize: rowsPerPage,
//             pageNumber: page+1
//           },
//           sort: { columnName: 'stateId', order: 'asc' },
//           "includeCentral": true
//         }
//         dispatch(getstateRegisterQueDownload(payload))
//         // table data end
    
//   };

//   const handleChangeEstablishmentType = (event:any)=>{
//     alert(event.target.value);
// setestablishmentType(event.target.value);

// const dashboardPayloadDefault: any =  { 
//   companyId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
//   associateCompanyId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
//   locationId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
//   stateId: '3fa85f64-5717-4562-b3fc-2c963f66afa6', 
//   year: 0, 
//   month: 'string',
// }

// const dashboardPayload: any =  { 
//   companyId: company,
//   associateCompanyId: associateCompany,
//   locationId: location,
//   stateId: stateName, 
//   year: year, 
//   month: event.target.value,
// }

// dispatch(getEmployeeDashboardCounts(dashboardPayload))
// dispatch(getEmployeeInputDashboard(dashboardPayload))
// dispatch(getEmployeeBackendCount(dashboardPayload))


// //for tabledate 

//     //const monthKey = (monthList.findIndex((each) => each === event.target.value) + 1).toString()
//     const payload: any =  { 
//       search: searchInput, 
//       filters: [
//         {
//           columnName:'companyId',
//           value: company1
//         },
//         {
//           columnName:'associateCompanyId',
//           value: associateCompany1
//         },
//         {
//           columnName:'locationId',
//           value: location1.split('^')[0]
//         },
//         {
//           columnName:'year',
//           value: year1
//         },
//         {
//           columnName:'month',
//           value: month1
//         },
//         {
//           columnName:'establishmenttype',
//           value: event.target.value
//         }
//       ],
//       pagination: {
//         pageSize: rowsPerPage,
//         pageNumber: page+1
//       },
//       sort: { columnName: 'stateId', order: 'asc' },
//       "includeCentral": true
//     }
//     dispatch(getstateRegisterQueDownload(payload))

//   }

//   useEffect(() => {

//     const companiesPayload: any = { ...DEFAULT_OPTIONS_PAYLOAD, filters: [{ columnName: 'isParent', value: 'true' }] }
//     dispatch(getAllCompaniesDetails(companiesPayload))
//   },[])

//   useEffect(() => {
//     const payload:any = { ...DEFAULT_OPTIONS_PAYLOAD, filters: [{ columnName: 'isParent', value: 'false' }, { columnName: 'parentCompanyId', value: company }] }
//     if(company){
//       dispatch(getAssociateCompanies(payload))
//     }
//   }, [company])

//   useEffect(() => {
//     const payload:any = {
//       ...DEFAULT_OPTIONS_PAYLOAD, filters: [
//           { columnName: 'companyId', value: associateCompany }],
//       sort: { columnName: 'locationName', order: 'asc' }
//     }
//     const statesPayload = {...DEFAULT_OPTIONS_PAYLOAD} 

//     if(associateCompany){
//       dispatch(getLocations(payload))
//       dispatch(getStates(statesPayload))
//     }
//   }, [associateCompany])

 


//   ///for TABLE DATA
//   useEffect(() => {
//       //alert("this use effect wa hitting")
//       const stateRegisterDownloadDefaultPayload: any = {
//         search: "",
//         filters: [],
//         pagination: {
//           pageSize: 10,
//           pageNumber: 1
//         },
//         sort: { columnName: 'stateId', order: 'asc' },
//         "includeCentral": true
//       }
//       const statesPayload: any = { ...DEFAULT_OPTIONS_PAYLOAD }
//       dispatch(getstateRegisterQueDownload(stateRegisterDownloadDefaultPayload))
//       const companiesPayload: any = { ...DEFAULT_OPTIONS_PAYLOAD, filters: [{ columnName: 'isParent', value: 'true' }] }
//       dispatch(getAllCompaniesDetails(companiesPayload))
//       //dispatch(getStates(statesPayload))
//     }, [])

//       useEffect(() => {
//        // alert("after getting company ocations");
//         const payload:any = { ...DEFAULT_OPTIONS_PAYLOAD, filters: [{ columnName: 'isParent', value: 'false' }, { columnName: 'parentCompanyId', value: company }] }
//         if(company1){
//           dispatch(getAssociateCompanies(payload))
//         }
//       }, [company1])

//         useEffect(() => {
//           const payload:any = {
//             ...DEFAULT_OPTIONS_PAYLOAD, filters: [
//                 { columnName: 'companyId', value: associateCompany1 }],
//             sort: { columnName: 'locationName', order: 'asc' }
//           }
//           const statesPayload = {...DEFAULT_OPTIONS_PAYLOAD} 
      
//           if(associateCompany1){
//             dispatch(getLocations(payload))
//             dispatch(getStates(statesPayload))
//           }
//         }, [associateCompany1])



//           useEffect(() => {
//             if (stateRegisterDownloadDetails.status === 'succeeded') {
//         //alert("this success  was hitted");
//             } else if (stateRegisterDownloadDetails.status === 'failed') {
//               toast.error(ERROR_MESSAGES.DEFAULT);
//             }
//           }, [stateRegisterDownloadDetails.status])


//             const handleChangePage = (event: unknown, newPage: number) => {
//               const filters = []
//               if (company1) {
//                 filters.push({
//                   columnName: 'companyId',
//                   value: company1
//                 })
//               }
//               if (associateCompany1) {
//                 filters.push({
//                   columnName: 'associatecompanyId',
//                   value: associateCompany1
//                 })
//               }
//               if (location1) {
//                 filters.push({
//                   columnName:'locationId',
//                   value: location1.split('^')[0]
//                 })
//               }
//               if (year) {
//                 filters.push({
//                   columnName:'year',
//                   value: year1
//                 })
//               }
//               if (month) {
//                 filters.push({
//                   columnName:'month',
//                   value: month1
//                 })
//               }
//               const payload: any = {
//                 search: '',
//                 filters,
//                 pagination: {
//                   pageSize: rowsPerPage,
//                   pageNumber: newPage + 1
//                 },
//                 sort: { columnName: 'stateId', order: 'asc' },
//                 "includeCentral": true
//               }
          
//               dispatch(getstateRegisterQueDownload(payload))
//               setPage(newPage);
//             };

//               const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
//                 const filters = []
//                 if (company1) {
//                   filters.push({
//                     columnName: 'companyId',
//                     value: company1
//                   })
//                 }
//                 if (associateCompany1) {
//                   filters.push({
//                     columnName: 'associatecompanyId',
//                     value: associateCompany1
//                   })
//                 }
//                 if (location) {
//                   filters.push({
//                     columnName:'locationId',
//                     value: location1.split('^')[0]
//                   })
//                 }
//                 if (year) {
//                   filters.push({
//                     columnName:'year',
//                     value: year1
//                   })
//                 }
//                 if (month) {
//                   filters.push({
//                     columnName:'month',
//                     value: month1
//                   })
//                 }
//                 const payload: any = {
//                   search: '',
//                   filters,
//                   pagination: {
//                     pageSize: parseInt(event.target.value, 10),
//                     pageNumber: 1
//                   },
//                   sort: { columnName: 'stateId', order: 'asc' },
//                   "includeCentral": true
//                 }
            
//                 dispatch(getstateRegisterQueDownload(payload))
//                 setRowsPerPage(parseInt(event.target.value, 10));
//                 setPage(0);
//               };

//                const onClickSortState = () => {
//                   let sType = 'asc'
//                   setActiveSort('stateId');
//                   if (sortType === 'asc') {
//                     setSortType('desc')
//                     sType = 'desc'
//                   } else {
//                     setSortType('asc')
//                   }
              
//                   const filters = []
//                   if (stateValue) {
//                     filters.push({
//                       columnName: 'stateId',
//                       value: stateValue
//                     })
//                   }
//                   if (type) {
//                     filters.push({
//                       columnName: 'registerType',
//                       value: type
//                     })
//                   }
              
//                   const Payload: any = {
//                     search: searchInput,
//                     filters,
//                     pagination: {
//                       pageSize: rowsPerPage,
//                       pageNumber: page + 1
//                     },
//                     sort: { columnName: 'stateId', order: sType },
//                     "includeCentral": true
//                   }
//                   dispatch(getstateRegisterQueDownload(Payload))
              
//                 }


//                 //table data end





//   const yearsList = []
//   const currentYear = new Date().getFullYear();

//   for (let i = currentYear; i >= 1950; i--) {
//     yearsList.push(i)
//   }

//   const monthList = [
//     "January",
//     "February",
//     "March",  
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ];

//   const EstablishmentTypesList = [
//     "BOCW",
//     "CLRA",
//     "Factory",  
//     "ISM",
//     "Shops"
//   ];

//   const onClickEmployeeUploadPreview = () => {
//     navigate(`${getBasePath()}/inputUploads/employeeMasterUpload`, {query: {company, associateCompany, location, stateName}});
//   }

//   const onClickLeaveAvailedPreview = () => {
//     navigate(`${getBasePath()}/inputUploads/employeeLeaveAvailedUpload`, { query: { company, associateCompany, location,stateName, year, month } });
//   }

//   const onClickleaveCreditedPreview = () => {
//     navigate(`${getBasePath()}/inputUploads/employeeLeaveCreditUpload`, { query: { company, associateCompany, location, stateName, year, month } });
//   }

//   const onClickEmployeeWagePreview = () => {
//     navigate(`${getBasePath()}/inputUploads/employeeWageUpload`, { query: { company, associateCompany, location, stateName, year, month } });
//   }

//   const onClickEmployeeAttendancePreview = () => {
   
//     navigate(`${getBasePath()}/inputUploads/employeeAttendanceUpload`, { query: { company, associateCompany, location, stateName, year, month } });
//   }
  



//   const handleProcessRegisters2 = async () => {
//     setDownloading(true);
//     let newQueueNumbers: string[] = [];
//     alert("1)");
//     try {
//       // Step 1: Get the access token
//       const params = new URLSearchParams();
//       params.append("grant_type", "password");
//       params.append("username", "admin");
//       params.append("password", "admin");
  
//       const tokenResponse = await axios.post(
//         "https://ezycomp1.buoyantworx.com/app/oauth/token",
//         params.toString(),
//         {
//           headers: {
//             "Content-Type": "application/x-www-form-urlencoded",
//             Authorization: "Basic " + btoa("client:secret"),
//             "User-Agent": "PostmanRuntime/7.39.0",
//             "Accept-Encoding": "gzip, deflate, br",
//             Connection: "keep-alive",
//           },
//         }
//       );
  
//       console.log("Access Token:", tokenResponse.data);
//       alert("1)");
//       const accessToken = tokenResponse.data.access_token;
//   alert("accesstoek"+accessToken);
//   const storageObject = {
//     company,
//     associateCompany,
//     stateName,
//     locations1, // Array of selected locations
//     year,
//     month,
//     selectedStateName,
//     queue
//   };
  
   
  
//       // Step 2: Hit the API for each location
//       for (const location of storageObject.locations1) {
//         alert("hitted que"+location)
//         const formResponse = await axios.post(
//           "https://ezycomp1.buoyantworx.com/app/rest/services/bws_Queue_Process_Schedular/processRequestedQueueForms",
//           {
//             companyID: storageObject.company,
//             associatedCompanyID: storageObject.associateCompany,
//             locationID: location,
//             stateID: storageObject.stateName,
//             year: storageObject.year,
//             month: storageObject.month,
//             queue: "true",
//             stateName : storageObject.selectedStateName,

//           },
//           {
//             headers: {
//               "Content-Type": "application/xml", // Ensure the Content-Type matches the cURL request
//               Authorization: `Bearer ${accessToken}`,
//               Cookie:
//                 "JSESSIONID=7D50AD68329785DF351FE423A440A45E; JSESSIONID=7CE95831E685227D3FED93436D4A7136",
//               Connection: "keep-alive",
//             },
//           }
//         );
  
//         console.log("Response for location:", location, formResponse.data);
   

//         // Extract QueueNo from the response body
//         const body = formResponse.data.body;
//         if (body && body.length > 0) {
//           body.forEach((item:any) => {
//             const match = item.match(/QueId\s*:\s*(\d+)/); // Updated regex to match 'QueId'
//             if (match && match[1]) {
//               newQueueNumbers.push(match[1]); // Add QueId to the temporary list
//             }
//           });
//         }
//       }
//   // Update the state with the new queue numbers
// SetqueueNumbers((prevQueueNumbers) => [...prevQueueNumbers, ...newQueueNumbers]);
// console.log(queueNumbers);
//      // Step 3: Display the QueueNo list to the user in a popup
// if (newQueueNumbers.length > 0) {
//   alert(`Queue Numbers received:\n${newQueueNumbers.join(", ")}`);
// } else {
//   alert('No Queue Numbers found.');
// }
//          setDownloading(false);
  
//     } catch (error) {
//       console.error("Error processing registers:", error);
//       alert("An error occurred while processing the registers.");
//       setDownloading(false); // Reset the downloading state even if there's an error
//     }
//   };

//   console.log(queueNumbers);
  


//   const DownloadErrorLogs=()=>{
//     // alert(company);
//     // alert(associateCompany);
//     // alert(stateName);
//     // alert(location);
//     // alert(year);
//     // alert(month);
//     const formData = new FormData();
    
//     formData.append('CompanyId',company );
//     formData.append('AssociateCompanyId', associateCompany)
//     //formData.append('LocationId', locations1)
//     formData.append('StateId', stateName)
//     formData.append('Year', year)
//     formData.append('Month', month)

//     console.log(formData);

//     dispatch(getErrorLogs(formData))
//   }

//   interface FileDetails {
//     filePath: string;
//     configType: string;
//   }
  
//   interface ApiResponse {
//     status: string;
//     list: FileDetails[];
//     message: string | null;
//   }

//   const onclickDownload=(file:any)=>{
//     //alert(each.registerUrl);
//     const url = file.filePath;

//    // alert(url);
     
//   // Create a new anchor element
//   const link = document.createElement('a');
//   link.href = url;
  
//   // Set the download attribute to suggest a file name (optional)
//   // This is the name the file will be downloaded as
//   link.download = url.split('/').pop(); // Use the file name from the URL

//   // Append the anchor to the body
//   document.body.appendChild(link);

//   // Programmatically click the anchor
//   link.click();

//   // Remove the anchor from the document
//   document.body.removeChild(link);
//   }

//   // Function to handle the download of all files
// const handleFileDownloads = async (files: FileDetails[]) => {
//   for (const file of files) {
//    // alert(file.filePath);
//     await onclickDownload(file);
//   }
// };



// // Function to download a single file
// // const downloadFile = async (file: FileDetails) => {
// //   try {
// //     const response = await axios.get(file.filePath, { responseType: 'blob' });
// //     const [year, month] = file.filePath.split('/').slice(-4, -2); // Adjust according to your filePath structure
// //     const newFileName = `${file.configType}-${year}-${month}.xlsx`;

// //     // Create a blob URL and open it to initiate download
// //     const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
// //     window.open(url);
    
// //     // Optionally, you can clean up the URL object after a delay
// //     setTimeout(() => {
// //       window.URL.revokeObjectURL(url);
// //     }, 10000);

// //     toast.success(`${newFileName} downloaded successfully`);
// //   } catch (error) {
// //     if (axios.isAxiosError(error)) {
// //       console.error(`Error downloading file from ${file.filePath}:`, error.toJSON());
// //       if (error.response) {
// //         console.error('Response data:', error.response.data);
// //         console.error('Response status:', error.response.status);
// //         console.error('Response headers:', error.response.headers);
// //       } else if (error.request) {
// //         console.error('Request was made but no response was received:', error.request);
// //       } else {
// //         console.error('Error in setup or configuration:', error.message);
// //       }
// //     } else {
// //       console.error('Unexpected error:', error);
// //     }
// //     toast.error('An error occurred while downloading the file.');
// //   }
// // };

// // Function to handle the download of all files
// // const handleFileDownloads = async (files: FileDetails[]) => {
// //   for (const file of files) {
// //     await downloadFile(file);
// //   }
// // };

//   useEffect(() => {
//     if (getErrorLogDetails.status === 'succeeded') {
//       (async () => {
//      //   alert('429 configuploadstatus hitted');
//        // alert(getErrorLogDetails.data.status);

//         if (getErrorLogDetails.data.status === 'Success') {
//           const files = getErrorLogDetails.data.list;
//           await handleFileDownloads(files);
//         }

//         if (getErrorLogDetails.data.status === 'Failure') {
//           toast.error('No files found');
//         }
//       })();
//     } else if (getErrorLogDetails.status === 'failed') {
//       toast.error('An error occurred while fetching data.');
//       dispatch(resetErrorLogsDetailsStatus());
//     }
//   }, [getErrorLogDetails.status, dispatch]);

  
  


//   return (
//     <div style={{ backgroundColor:'#ffffff', minHeight:'100vh'}}>
//       {loading ? <PageLoader>Loading...</PageLoader> : 
//       <div>
//         {downloading ? <PageLoader>Processing Registers...</PageLoader> :

//         <div style={{paddingBottom:'100px'}}>

//             {/* Filter Box*/}
//             <Box sx={{paddingX: '20px', paddingY:'10px',}}>
//               <div style={{backgroundColor:'#E2E3F8', padding:'20px', borderRadius:'6px', boxShadow: '0px 6px 10px #CDD2D9'}}>
//                   <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px', marginTop:'10px'}}>
//                       <h5 style={{ font: 'normal normal normal 32px/40px Calibri' }}>Register Module</h5>
//                   </div>
//                   <div style={{display:'flex'}}>

//                     <Box sx={{width:'100%', mr:1}}>
//                       <Typography mb={1}>Company</Typography>
//                       <FormControl sx={{ width:'100%', maxWidth:'200px', backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
//                         <MSelect
//                           sx={{'.MuiOutlinedInput-notchedOutline': { border: 0 }}}
//                           value={company}
//                           displayEmpty
//                       onChange={handleChangeCompany}
//                       MenuProps={{
//                         PaperProps: {
//                           sx: {
//                             maxHeight: 200,
//                             width: 230,
//                             marginTop: "3px"
//                           }
//                         }
//                       }}
//                         >
//                           <MenuItem disabled sx={{display:'none'}} value="">
//                             Select Company
//                           </MenuItem>
//                           {companies && companies.map((each:any) => {
//                               return <MenuItem sx={{width:'240px', whiteSpace:'initial'}} value={each.id}>{each.name}</MenuItem>
//                           })}
//                         </MSelect>
//                       </FormControl>
//                     </Box>

//                     <Box sx={{width:'100%', mr:1}}>
//                       <Typography mb={1}>Associate Company</Typography>
//                       <FormControl sx={{ width:'100%', maxWidth:'200px', backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
//                         <MSelect
//                           sx={{'.MuiOutlinedInput-notchedOutline': { border: 0 }}}
//                           displayEmpty
//                           value={associateCompany}
//                           disabled={!company}
//                       onChange={handleChangeAssociateCompany}
//                       MenuProps={{
//                         PaperProps: {
//                           sx: {
//                             maxHeight: 200,
//                             width: 230,
//                             marginTop: "3px"
//                           }
//                         }
//                       }}
//                         >
//                           <MenuItem disabled sx={{display:'none'}} value="">
//                             Select Associate Company
//                           </MenuItem>
//                           {associateCompanies && associateCompanies.map((each:any) => {
//                             return <MenuItem sx={{ width: '240px', whiteSpace: 'initial' }} value={each.id}>{each.name}</MenuItem>
//                           })}
//                         </MSelect>
//                       </FormControl>
//                     </Box>

//                     <Box sx={{width:'100%', mr:1}}>
//                       <Typography mb={1}>States</Typography>
//                       <FormControl sx={{ width:'100%', maxWidth:'200px', backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
//                         <MSelect
//                           sx={{'.MuiOutlinedInput-notchedOutline': { border: 0 }}}
//                           displayEmpty
//                           value={stateName}
//                           disabled={!associateCompany}
//                       onChange={handleChangeStateName}
//                       MenuProps={{
//                         PaperProps: {
//                           sx: {
//                             maxHeight: 200,
//                             width: 230,
//                             marginTop: "3px"
//                           }
//                         }
//                       }}
//                         >
//                           <MenuItem disabled sx={{display:'none'}} value="">
//                             Select State
//                           </MenuItem>
//                           {states && states.map((each:any) => {
//                             return <MenuItem sx={{ width: '240px', whiteSpace: 'initial' }} value={each.id}>{each.name}</MenuItem>
//                           })}
//                         </MSelect>
//                       </FormControl>
//                     </Box>

//                     <Box sx={{width:'100%', mr:1}}>
//                       <Typography mb={1}>Location</Typography>
//                       <FormControl sx={{ width:'100%', maxWidth:'200px', backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
//                         <MSelect
//                           sx={{'.MuiOutlinedInput-notchedOutline': { border: 0 }}}
//                           displayEmpty
//                           value={locations1}
//                           multiple // Enable multiple selection
//                           disabled={!stateName}
//                       onChange={handleChangeLocation1}
//                       input={<OutlinedInput />}
//                       renderValue={(selected) => (
//                         <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
//                         {selected.map((value: string) => {
//                           // Find the selected location by its ID
//                           const selectedLocation = locations.find((loc: any) => loc.locationId === value);
//                           // Display the location name if found
//                           return selectedLocation ? <Chip key={value} label={selectedLocation.location.name} /> : null;
//                         })}
//                       </Box>
//                       )}
//                       MenuProps={{
//                         PaperProps: {
//                           sx: {
//                             maxHeight: 200,
//                             width: 230,
//                             marginTop: "3px"
//                           }
//                         }
//                       }}
//                         >
//                           <MenuItem disabled sx={{display:'none'}} value="">
//                             Select Location
//                           </MenuItem>
//                           {locations && locations.map((each:any) => {
//                             const { id, name, code, cities }: any = each.location || {};
//                             const { state } = cities || {};
//                             if(state.id === stateName){
//                               return <MenuItem sx={{ width: '240px', whiteSpace: 'initial' }} value={each.locationId}>{`${name} (${state.code}-${cities.code}-${code})`}</MenuItem>
//                             }
//                           })}
//                         </MSelect>
//                       </FormControl>
//                     </Box>

//                     <Box sx={{width:'100%', mr:1}}>
//                       <Typography mb={1}>Year</Typography>
//                       <FormControl sx={{ width:'100%', maxWidth:'200px', backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
//                         <MSelect
//                           sx={{'.MuiOutlinedInput-notchedOutline': { border: 0 }}}
//                           displayEmpty
//                           value={year}
//                           disabled={!location}
//                       onChange={handleChangeYear}
//                       MenuProps={{
//                         PaperProps: {
//                           sx: {
//                             maxHeight: 200,
//                             width: 150,
//                             marginTop: "3px"
//                           }
//                         }
//                       }}
//                         >
//                           <MenuItem disabled sx={{display:'none'}} value="">
//                             Select Year
//                           </MenuItem>
//                           {yearsList && yearsList.map((each:any) => 
//                             <MenuItem sx={{ width: '240px', whiteSpace: 'initial' }} value={each}>{each}</MenuItem>
//                           )}
//                         </MSelect>
//                       </FormControl>
//                     </Box>

//                     <Box sx={{width:'100%', mr:1}}>
//                       <Typography mb={1}>Month</Typography>
//                       <FormControl sx={{ width:'100%', maxWidth:'200px', backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
//                         <MSelect
//                           sx={{'.MuiOutlinedInput-notchedOutline': { border: 0 }}}
//                           displayEmpty
//                           value={month}
//                           disabled={!year}
//                       onChange={handleChangeMonth}
//                       MenuProps={{
//                         PaperProps: {
//                           sx: {
//                             maxHeight: 200,
//                             width: 150,
//                             marginTop: "3px"
//                           }
//                         }
//                       }}
//                         >
//                           <MenuItem disabled sx={{display:'none'}} value="">
//                             Select Month
//                           </MenuItem>
//                           {monthList && monthList.map((each:any) => 
//                             <MenuItem sx={{ width: '240px', whiteSpace: 'initial' }} value={each}>{each}</MenuItem>
//                           )}
//                         </MSelect>
//                       </FormControl>
//                     </Box>

//                   <Box sx={{width:'100%', mr:1}}>
//                                     <Typography mb={1}>EstablishmentType</Typography>
//                                     <FormControl sx={{ width:'100%', maxWidth:'200px', backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
//                                       <MSelect
//                                         sx={{'.MuiOutlinedInput-notchedOutline': { border: 0 }}}
//                                         displayEmpty
//                                         value={establishmentType}
//                                         disabled={!month}
//                                     onChange={handleChangeEstablishmentType}
//                                     MenuProps={{
//                                       PaperProps: {
//                                         sx: {
//                                           maxHeight: 200,
//                                           width: 150,
//                                           marginTop: "3px"
//                                         }
//                                       }
//                                     }}
//                                       >
//                                         <MenuItem disabled sx={{display:'none'}} value="">
//                                           Select Type
//                                         </MenuItem>
//                                         {EstablishmentTypesList && EstablishmentTypesList.map((each:any) => 
//                                           <MenuItem sx={{ width: '240px', whiteSpace: 'initial' }} value={each}>{each}</MenuItem>
//                                         )}
//                                       </MSelect>
//                                     </FormControl>
//                                   </Box>

//                   </div>
//               </div>
//             </Box>

   

//             {/* Status Box */}
//             {showDashboardDetails && <Box sx={{paddingX: '20px', color:'#F3F4F8', mt:2, }}>
//               <Box sx={{display:'flex', justifyContent:'space-between', width:'100%', padding:'15px', background:'#EFEBFE 0% 0% no-repeat padding-box', boxShadow:'0px 6px 10px #00000029', borderRadius:'8px'}}>
                
             
                  
           

// {
//                       hasUserAccess(USER_PRIVILEGES.REGISTER_EMPLOYEE_DASHBOARD) &&
//                   <Button sx={{mt:2, width:'90%'}} variant='outlined' onClick={handleProcessRegisters2}>
//                     {/* <Typography padding={'8px'} color={'#0654AD'}> Process Registers</Typography> */}
//                     Process Que
//                   </Button>
//                   }


             

//               </Box>
//             </Box>}

//             <Box sx={{ paddingX: '20px' }}>
//             {
//               stateRegisterDownload && stateRegisterDownload.length <= 0 ?

//                 <Box sx={{ height: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//                   <Typography variant='h5'>No Records Found</Typography>
//                 </Box>
//                 :
//                 <>
//                   <TableContainer sx={{ border: '1px solid #e6e6e6', marginTop: '10px', maxHeight: '385px', overflowY: 'scroll' }}>
//                     <Table stickyHeader sx={{ minWidth: 650 }} aria-label="sticky table">
//                       <TableHead sx={{ '.MuiTableCell-root': { backgroundColor: '#E7EEF7',fontWeight:'600' } }}>
//                         <TableRow>
//                           <TableCell><Checkbox/></TableCell>
//                           <TableCell > <TableSortLabel active={activeSort === 'stateId'} direction={sortType} onClick={onClickSortState}>Company</TableSortLabel></TableCell>
//                           <TableCell > <TableSortLabel active={activeSort === 'actId'} direction={sortType} onClick={onClickSortState}>AssociateCompany</TableSortLabel></TableCell>
//                           <TableCell > <TableSortLabel active={activeSort === 'ruleId'} direction={sortType} onClick={onClickSortState}>State</TableSortLabel></TableCell>
//                           <TableCell > <TableSortLabel active={activeSort === 'activityId'} direction={sortType} onClick={onClickSortState}>Location</TableSortLabel></TableCell>
//                           <TableCell > <TableSortLabel active={activeSort === 'activityId'} direction={sortType} onClick={onClickSortState}>Year</TableSortLabel></TableCell>

//                           <TableCell > <TableSortLabel active={activeSort === 'activityId'} direction={sortType} onClick={onClickSortState}>Month</TableSortLabel></TableCell>
//                           <TableCell > <TableSortLabel active={activeSort === 'form'} direction={sortType} onClick={onClickSortState}>FormName</TableSortLabel></TableCell>
//                           <TableCell >Download</TableCell>
//                         </TableRow>
//                       </TableHead>

//                       <TableBody>

//                         {stateRegisterDownload && stateRegisterDownload.map((each: any, index: number) => (
//                           <TableRow
//                             key={index}
//                             sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
//                           >
//                             <TableCell><Checkbox/></TableCell>
//                             <TableCell >{each.company && each.State.Name ? each.State.Name : 'NA'}</TableCell>
//                             <TableCell >{each.Year && each.Year ? each.Year : 'NA'}</TableCell>
//                             <TableCell >{each.Month && each.Month ? each.Month : 'NA'}</TableCell>
//                             <TableCell >{each.Act && each.Act.Name ? each.Act.Name : 'NA'}</TableCell>
//                             <TableCell >{each.Rule && each.Rule.Name ? each.Rule.Name : 'NA'}</TableCell>
//                             <TableCell >{each.FormName && each.FormName ? each.FormName : 'NA'}</TableCell>
//                             <TableCell >{each.Type && each.Type ? each.Type : 'NA'}</TableCell>

//                             <TableCell >
//                               <Box sx={{ display: 'flex',justifyContent: "center" }}>
//                                 {/* <Icon action={() => onclickEdit(each)} style={{color:'#039BE5'}} type="button" name={'pencil'} text={'Edit'}/> */}
                               
//                                 <Icon style={{ color: '#0654AD' }} type="button" name={'download'} text={'download'}  action={() => onclickDownload(each)} />
                                
//                               </Box>
//                             </TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   </TableContainer>
//                   <TablePagination
//                     sx={{
//                       '.MuiTablePagination-toolbar': {
//                         backgroundColor: '#EFEBFE',
//                         height: '30px',
//                         display: 'flex',
//                         justifyContent: 'flex-end'
//                       },
//                       '.MuiTablePagination-displayedRows': {
//                         margin: '0',
//                       },
//                       '.MuiTablePagination-selectLabel': {
//                         margin: '0',
//                       },
//                       '.MuiTablePagination-spacer': {
//                         display: 'none '
//                       },
//                       '.MuiTablePagination-input': {
//                         marginRight: 'auto'
//                       },
//                     }}

//                     labelRowsPerPage='Show'
//                     labelDisplayedRows={(page) =>
//                       `Showing ${page.from}-${page.to === -1 ? page.count : page.to} of ${page.count}`
//                     }
//                     rowsPerPageOptions={[10, 25, 50, 100]}
//                     component="div"
//                     count={stateRegisterCount}
//                     rowsPerPage={rowsPerPage}
//                     page={page}
//                     onPageChange={handleChangePage}
//                     onRowsPerPageChange={handleChangeRowsPerPage}
//                   />
//                 </>
//             }
//           </Box>

            
//         </div>

//         //table data 
        

        
// }
// </div>



   
//       }

    
    
    
//     </div>
//   )
// }

// export default InputsDashboard





