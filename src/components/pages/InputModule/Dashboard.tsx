import React, { useEffect, useState } from 'react'
import PageLoader from '../../shared/PageLoader'
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import { getAllCompaniesDetails, getAssociateCompanies, getLocations, getStates } from '../../../redux/features/inputModule.slice';
import { Box, Button, Drawer, FormControl, FormControlLabel, FormLabel, IconButton, InputAdornment, InputLabel, MenuItem, Modal, OutlinedInput, Radio, RadioGroup, Select, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, TextField, Typography } from '@mui/material';
import { DEFAULT_OPTIONS_PAYLOAD, DEFAULT_PAYLOAD } from '../../common/Table';
import { addHoliday, deleteHoliday, editHoliday, getHolidaysList, resetAddHolidayDetails, resetDeleteHolidayDetails, resetEditHolidayDetails, resetGetHolidayDetailsStatus, resetUploadHolidayDetails, uploadHoliday } from '../../../redux/features/holidayList.slice';

import { ERROR_MESSAGES } from '../../../utils/constants';
import { toast } from 'react-toastify';
import { getEmployeeBackendCount, getEmployeeDashboardCounts, getEmployeeInputDashboard, getErrorLogs, resetEmployeeBackendCountDetailsStatus, resetEmployeeDashboardCountsDetailsStatus, resetEmployeeInputDashboardDetailsStatus, resetErrorLogsDetailsStatus } from '../../../redux/features/dashboard.slice';
import { FaCheck, FaCloudDownloadAlt, FaCloudUploadAlt, FaCode, FaRegEye, FaRegKeyboard } from 'react-icons/fa';
import { FaRegCircleCheck } from 'react-icons/fa6'
import { MdOutput } from "react-icons/md";
import { IoMdClose } from 'react-icons/io';
import { getBasePath } from '../../../App';
import { navigate } from 'raviger';
import axios from 'axios';
import { hasUserAccess } from '../../../backend/auth';
import { USER_PRIVILEGES } from '../UserManagement/Roles/RoleConfiguration';
import State from '../Masters/State';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';


const InputsDashboard = () => {

  const dispatch = useAppDispatch();

  const employeeDashboardCountsDetails = useAppSelector((state) => state.inputDashboard.employeeDashboardCountsDetails)
  const employeeInputDashboardDetails = useAppSelector((state) => state.inputDashboard.employeeInputDashboardDetails)
  const employeeBackendCountDetails = useAppSelector((state) => state.inputDashboard.employeeBackendCountDetails)
  const getErrorLogDetails = useAppSelector((state) => state.inputDashboard.errorLogsDetails);

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
  const [downloading,setDownloading]= useState(false);

  const [company, setCompany] = React.useState('');
  const [associateCompany, setAssociateCompany] = React.useState('');
  const [stateName, setStateName] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [year, setYear] = React.useState('');
  const [month, setMonth] =  React.useState<any>('');

  
  const [companyName, setCompanyName] = React.useState('');
  const [associateCompanyName, setAssociateCompanyName] = React.useState('');
  const [locationName, setLocationName] = React.useState('');

  const [showDashboardDetails, setShowDashboardDetails] = React.useState(true);
  // const [errorLogs, setErrorLogs] = useState<FileDetails[]>([]);

  const handleChangeCompany = (event:any) => {

    const selectedCompanyId = event.target.value as string;
    const selectedCompanyName = getCompanyNameById(selectedCompanyId, companies);
  
   // setShowDashboardDetails(false)
    setAssociateCompany('')
    setStateName('')
    setLocation('')
    setYear('')
    setMonth('')
    setCompany(event.target.value);
    setCompanyName(selectedCompanyName);
  };
  const getCompanyNameById = (id: string, companies: { id: string; name: string; }[]) => {
    for (let i = 0; i < companies.length; i++) {
      if (companies[i].id === id) {
        return companies[i].name;
      }
    }
    return '';
  };

  const handleChangeAssociateCompany = (event:any) => {
    const selectedCompanyId = event.target.value as string;
    const selectedCompanyName = getAssocCompanyNameById(selectedCompanyId, associateCompanies);
  
    //alert(selectedCompanyName);
 //   setShowDashboardDetails(false)
    setLocation('')
    setYear('')
    setMonth('')
    setAssociateCompany(event.target.value);
    setAssociateCompanyName(selectedCompanyName);
  };
  const getAssocCompanyNameById = (id: string, associateCompanies: { id: string; name: string; }[]) => {
    for (let i = 0; i < associateCompanies.length; i++) {
      if (associateCompanies[i].id === id) {
        return associateCompanies[i].name;
      }
    }
    return '';
  };

  const handleChangeStateName = (event:any) => {
  //  setShowDashboardDetails(false)
    setYear('')
    setMonth('')
    setLocation('')
    setStateName(event.target.value);
  }

  const handleChangeLocation = (event:any) => {
    const selectedCompanyId = event.target.value as string;
   // alert(event.target.value);
    const selectedCompanyName = getLocationById(selectedCompanyId, locations);
  
  //  alert(selectedCompanyName);

  //  setShowDashboardDetails(false)
    setYear('')
    setMonth('')
    setLocation(event.target.value);
    setLocationName(selectedCompanyName);
  };

const getLocationById = (id: string, locations: any[]) => {
  for (let i = 0; i < locations.length; i++) {
    if (locations[i].locationId === id) {
      return locations[i].location.name;
    }
  }
  return '';
};

  
  const handleChangeYear = (event:any) => {
  //  setShowDashboardDetails(false)
    setMonth('')
    setYear(event.target.value.toString());
  };
  
  const handleChangeMonth = (event:any) => {
  //  setShowDashboardDetails(false)
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
    resetEmployeeDashboardCountsDetailsStatus()
    resetEmployeeInputDashboardDetailsStatus()
    resetEmployeeBackendCountDetailsStatus()
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
      //setShowDashboardDetails(true)
    }
    if(employeeDashboardCountsDetails.status === 'succeeded'){
      
    }else if(employeeDashboardCountsDetails.status === 'failed' || employeeInputDashboardDetails.status === 'failed' || employeeBackendCountDetails.status === 'failed'){
      //toast.error(ERROR_MESSAGES.DEFAULT);
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
    navigate(`${getBasePath()}/inputUploads/employeeMasterUpload`, {query: {company, associateCompany, location, stateName}});
  }

  const onClickLeaveAvailedPreview = () => {
    navigate(`${getBasePath()}/inputUploads/employeeLeaveAvailedUpload`, { query: { company, associateCompany, location,stateName, year, month } });
  }

  const onClickleaveCreditedPreview = () => {
    navigate(`${getBasePath()}/inputUploads/employeeLeaveCreditUpload`, { query: { company, associateCompany, location, stateName, year, month } });
  }

  const onClickEmployeeWagePreview = () => {
    navigate(`${getBasePath()}/inputUploads/employeeWageUpload`, { query: { company, associateCompany, location, stateName, year, month } });
  }

  const onClickEmployeeAttendancePreview = () => {
   
    navigate(`${getBasePath()}/inputUploads/employeeAttendanceUpload`, { query: { company, associateCompany, location, stateName, year, month } });
  }
  

  const fileNames = [
    'FormARegofWages',
     'FormBRegofWages',
     'FormTPart1Regoffines',
     'FormTPart2RegofFines',
     'ESIForm11RegofAccident',
     'POW_Part2RegofDeduction',
     'POW_Part3RegofAdvance',
     'Form_1_RegisterForSuspendedEmployees',
     'Form_Q',
     'MaintainCombinedRegisterofMusterRollFormTPart2',
     'MaintainCombinedRegisterofMusterRollFormTPart1'
   ]

  // const fileNames2 = [
  //  //'fileFormARegofWages',
  //   'fileFormBRegofWages',
  //   'fileFormTPart1Regoffines',
  //   'fileFormTPart2RegofFines',
  //   'fileESIForm11RegofAccident',
  //   'filePOW_Part2RegofDeduction',
  //   'filePOW_Part3RegofAdvance',
  //   'fileForm_1_RegisterForSuspendedEmployees',
  //   'fileForm_Q',
  //   'fileMaintainCombinedRegisterofMusterRollFormTPart2',
  //   'fileMaintainCombinedRegisterofMusterRollFormTPart1'
  // ]

  // const fileUrls = [
  //   //'https://mafoi.s3.ap-south-1.amazonaws.com/templates/b21fb1d8-a634-4420-adc5-14361cd94790/Form A - reg of wages.xlsx',
  //   'https://mafoi.s3.ap-south-1.amazonaws.com/templates/8fde1c23-1927-4c36-a6f1-ef7416e81b6d/Form B.xlsx',
  //   'https://mafoi.s3.ap-south-1.amazonaws.com/templates/162c6d84-0e62-4cc7-8281-b8fac56e42d1/form T-Part-1.xlsx',
  //   //'https://mafoi.s3.ap-south-1.amazonaws.com/templates/ff9fb10f-14eb-402f-b094-1224267b0101/Form T-Part 2.xlsx',
  //   'https://mafoi.s3.ap-south-1.amazonaws.com/templates/919ccacd-e50d-4906-ad74-28aeb8fca1a7/ESI_Form 11_Reg of Accident.xlsx',
  //    'https://mafoi.s3.ap-south-1.amazonaws.com/templates/96d650d7-d1e1-476d-8728-385c9ed5a2cc/POW Form 2 for Deduction.xlsx',
  //    'https://mafoi.s3.ap-south-1.amazonaws.com/templates/f8c6ebf9-9f57-413d-a22b-c6b76e3c62a2/POW Form III Reg of Advance  .xlsx',
  //    'https://mafoi.s3.ap-south-1.amazonaws.com/templates/e5484c2d-884b-47b3-9e42-6392377f490a/Form 1.xlsx',
  //    'https://mafoi.s3.ap-south-1.amazonaws.com/templates/5eb524bb-04c4-4f39-b15d-fe462eb67b50/Form Q.xlsx',
  //    'https://mafoi.s3.ap-south-1.amazonaws.com/templates/162c6d84-0e62-4cc7-8281-b8fac56e42d1/form T-Part-1.xlsx',
  //    'https://mafoi.s3.ap-south-1.amazonaws.com/templates/ff9fb10f-14eb-402f-b094-1224267b0101/Form T-Part 2.xlsx'
    

  // ];

  const handleProcessRegisters=async ()=>{
    setDownloading(true);
    let parentcompanyid = company;
    let associatecompanyid = associateCompany;
    let stateid=stateName;
    let locationid= location;
    let yearid = year;
    const monthKey = (monthList.findIndex((each) => each === month) + 1).toString();
    const fileUrl = 'https://mafoi.s3.ap-south-1.amazonaws.com/templates/8fde1c23-1927-4c36-a6f1-ef7416e81b6d/Form B.xlsx';

    try {
      // Step 1: Get the access token
      const params = new URLSearchParams();
      params.append('grant_type', 'password');
      params.append('username', 'admin');
      params.append('password', 'admin');

      const tokenResponse = await axios.post('https://ezycomp.buoyantworx.com/oauth/token', params.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa('client:secret'),
          'User-Agent': 'PostmanRuntime/7.39.0',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive'
        }
      });

      console.log(tokenResponse.data);

      const accessToken = tokenResponse.data.access_token;

      for (const filename of fileNames) {

        let formResponseUrl= "";
      let fileUrl="";
        if(filename == 'FormBRegofWages'){
          fileUrl='https://mafoi.s3.ap-south-1.amazonaws.com/templates/8fde1c23-1927-4c36-a6f1-ef7416e81b6d/Form B.xlsx'
          formResponseUrl='https://ezycomp.buoyantworx.com/rest/services/bws_Reporting_Controller/fileFormBRegofWages';
        }
        else if(filename=='FormARegofWages'){
          fileUrl='https://mafoi.s3.ap-south-1.amazonaws.com/templates/b21fb1d8-a634-4420-adc5-14361cd94790/Form A - reg of wages.xlsx'
          formResponseUrl='https://ezycomp.buoyantworx.com/rest/services/bws_Reporting_Controller/fileFormARegofWages';
        }
        else if(filename=='FormTPart1Regoffines'){
          fileUrl='https://mafoi.s3.ap-south-1.amazonaws.com/templates/162c6d84-0e62-4cc7-8281-b8fac56e42d1/form T-Part-1.xlsx'
formResponseUrl='https://ezycomp.buoyantworx.com/rest/services/bws_Reporting_Controller/fileFormTPart1Regoffines';
        }
        else if(filename=='FormTPart2RegofFines'){
          fileUrl='https://mafoi.s3.ap-south-1.amazonaws.com/templates/ff9fb10f-14eb-402f-b094-1224267b0101/Form T-Part 2.xlsx'
        formResponseUrl='https://ezycomp.buoyantworx.com/rest/services/bws_Reporting_Controller/fileFormTPart2RegofFines';
        }
        else if(filename=='ESIForm11RegofAccident'){
            fileUrl='https://mafoi.s3.ap-south-1.amazonaws.com/templates/919ccacd-e50d-4906-ad74-28aeb8fca1a7/ESI_Form 11_Reg of Accident.xlsx'
          formResponseUrl='https://ezycomp.buoyantworx.com/rest/services/bws_Reporting_Controller/fileESIForm11RegofAccident';
        }
        else if(filename=='POW_Part2RegofDeduction'){
          fileUrl='https://mafoi.s3.ap-south-1.amazonaws.com/templates/96d650d7-d1e1-476d-8728-385c9ed5a2cc/POW Form 2 for Deduction.xlsx'
          formResponseUrl='https://ezycomp.buoyantworx.com/rest/services/bws_Reporting_Controller/filePOW_Part2RegofDeduction';
        }
        else if(filename=='POW_Part3RegofAdvance'){
          fileUrl='https://mafoi.s3.ap-south-1.amazonaws.com/templates/f8c6ebf9-9f57-413d-a22b-c6b76e3c62a2/POW Form III Reg of Advance  .xlsx'
        formResponseUrl='https://ezycomp.buoyantworx.com/rest/services/bws_Reporting_Controller/filePOW_Part3RegofAdvance';
        }
        else if(filename=='Form_1_RegisterForSuspendedEmployees'){
          fileUrl='https://mafoi.s3.ap-south-1.amazonaws.com/templates/e5484c2d-884b-47b3-9e42-6392377f490a/Form 1.xlsx'
        formResponseUrl='https://ezycomp.buoyantworx.com/rest/services/bws_Reporting_Controller/fileForm_1_RegisterForSuspendedEmployees';
        }
        else if(filename=='Form_Q'){
          fileUrl='https://mafoi.s3.ap-south-1.amazonaws.com/templates/5eb524bb-04c4-4f39-b15d-fe462eb67b50/Form Q.xlsx'
          formResponseUrl='https://ezycomp.buoyantworx.com/rest/services/bws_Reporting_Controller/fileForm_Q';
        }
        else if(filename=='MaintainCombinedRegisterofMusterRollFormTPart2'){
          fileUrl='https://mafoi.s3.ap-south-1.amazonaws.com/templates/ff9fb10f-14eb-402f-b094-1224267b0101/Form T-Part 2.xlsx'
        formResponseUrl='https://ezycomp.buoyantworx.com/rest/services/bws_Reporting_Controller/fileMaintainCombinedRegisterofMusterRollFormTPart2';
        }
        else if(filename=='MaintainCombinedRegisterofMusterRollFormTPart1'){
            fileUrl='https://mafoi.s3.ap-south-1.amazonaws.com/templates/162c6d84-0e62-4cc7-8281-b8fac56e42d1/form T-Part-1.xlsx'
          formResponseUrl='https://ezycomp.buoyantworx.com/rest/services/bws_Reporting_Controller/fileMaintainCombinedRegisterofMusterRollFormTPart1';
          }
        else{
          formResponseUrl='https://ezycomp.buoyantworx.com/rest/services/bws_Reporting_Controller/fileFormBRegofWages';
        }
          
console.log('filrUrl',fileUrl);        
console.log('formResonseUrl',formResponseUrl);
      const formResponse = await axios.post(
      formResponseUrl,
        {
          companyID: company,
          associatedCompanyID: associateCompany,
          stateId: stateName,
          locationID: location,
          formURL: fileUrl,
          year: year,
          month: "January"
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
    
  

      console.log(formResponse.data.body);

      const filedownloadresponseURL= formResponse.data.body;
     // alert('filedownloadresponseURL : ' +filedownloadresponseURL);

       // Extract the fileRef from the URL in the formResponse
       const fileRefMatch = filedownloadresponseURL.match(/fileRef=([^&]+)/);
       if (!fileRefMatch) {
         throw new Error('fileRef not found in form response');
       }
       const fileRef = decodeURIComponent(fileRefMatch[1]);
       console.log('fileRef', fileRef);

      // alert(fileRef);

       // Step 3: Use the file reference to download the file
       const fileDownloadResponse = await axios.get('https://ezycomp.buoyantworx.com/rest/files', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        params: {
          fileRef: fileRef
        },
        responseType: 'blob' // Ensure binary data handling
      });

      // Verify the content of the response
      console.log('fileDownloadResponse', fileDownloadResponse);

      // Step 4: Create a link to download the file
      const url = window.URL.createObjectURL(new Blob([fileDownloadResponse.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
      const link = document.createElement('a');
      link.href = url;
      // link.setAttribute('download', `${filename}.xlsx`);
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success(`${filename} downloaded successfully`);

    }
    setDownloading(false);
  } catch (error) {
    console.error('Error processing registers:', error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        message: error.message,
        name: error.name,
        code: error.code,
        config: error.config,
        request: error.request,
        response: error.response ? {
          data: error.response.data,
          status: error.response.status,
          headers: error.response.headers,
        } : null,
      });
    toast.error("Error in downloading files");
    setDownloading(false);
  }
}

  }


  const handleProcessRegisters2=async ()=>{
    let fileUrl = '';
    if(stateName == '912da48d-630f-4cdb-9b24-d27cda14fc03'){
      fileUrl = 'https://ezycomp.buoyantworx.com/rest/services/bws_TN_Reporting_Controller/getAllTamilNaduForms';
    }
    else if(stateName == '59b24896-1f55-4037-b631-c699dd9fd2bc')
      {
        fileUrl = 'https://ezycomp.buoyantworx.com/rest/services/bws_Reporting_Controller/getAllKarnatakaForms';
    }
    else if(stateName == '827e4dd8-079e-4c4f-a7ef-783c52926226')
      {
        fileUrl = 'https://ezycomp.buoyantworx.com/rest/services/BWS_AP_Controller/getAllAndraPradeshForms';
    }
    else if(stateName == '75144ed9-1a78-4a0d-8d69-6519a9908dc3')
      {
        fileUrl = 'https://ezycomp.buoyantworx.com/rest/services/BWS_Telangana_Controller/getAllTelanganaForms';
    }
    else if(stateName == '6ece4005-dff4-471b-aade-8139bba6b5e2')
      {
        fileUrl = 'https://ezycomp.buoyantworx.com/rest/services/bws_Kerala_Controller/getAllKeralaForms';
    }
    else{
      toast.error("State was Not Configured");
      return 
    }
    setDownloading(true);
    try {
      // Step 1: Get the access token
      const params = new URLSearchParams();
      params.append('grant_type', 'password');
      params.append('username', 'admin');
      params.append('password', 'admin');

      const tokenResponse = await axios.post('https://ezycomp.buoyantworx.com/oauth/token', params.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa('client:secret'),
          'User-Agent': 'PostmanRuntime/7.39.0',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive'
        }
      });

      console.log(tokenResponse.data);

      const accessToken = tokenResponse.data.access_token;

      // const formResponse = await axios.post(
      //   fileUrl,
      //   {
      //     companyID: company,
      //     associatedCompanyID: associateCompany,
      //     stateId: stateName,
      //     locationID: location,
      //     year: year,
      //     month: "March"
      //   },
      //   {
      //     headers: {
      //       'Content-Type': 'application/json',
      //       'Authorization': `Bearer ${accessToken}`,
      //       'Connection': `keep-alive`
      //     }
      //   }
      // );

       // Step 2: Make the request to get the Karnataka forms
    const formResponse = await axios.post(
      fileUrl,
      {
        companyID: company,
        associatedCompanyID: associateCompany,
        locationID: location,
        stateID: stateName,
        year: year,
        month: month
      },
      {
        headers: {
          'Content-Type': 'application/xml', // Ensure the Content-Type matches the cURL request
          'Authorization': `Bearer ${accessToken}`,
          'Cookie': 'JSESSIONID=7D50AD68329785DF351FE423A440A45E; JSESSIONID=7CE95831E685227D3FED93436D4A7136',
          'Connection': 'keep-alive'
        }
      }
    );
    
  

      console.log(formResponse.data.body);

      const filedownloadresponseURL= formResponse.data.body;
  //   alert('filedownloadresponseURL : ' +filedownloadresponseURL);

       // Extract the fileRef from the URL in the formResponse
      //  const fileRefMatch = filedownloadresponseURL.match(/fileRef=([^&]+)/);
      //  if (!fileRefMatch) {
      //    throw new Error('fileRef not found in form response');
      //  }
      //  const fileRef = decodeURIComponent(fileRefMatch[1]);
      //  console.log('fileRef', fileRef);

      // alert(fileRef);

       // Step 3: Use the file reference to download the file
       const fileDownloadResponse = await axios.get(filedownloadresponseURL, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        
        responseType: 'blob' // Ensure binary data handling
      });

      // Verify the content of the response
      console.log('fileDownloadResponse', fileDownloadResponse);

      // Step 4: Create a link to download the file
      const url = window.URL.createObjectURL(new Blob([fileDownloadResponse.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
      const link = document.createElement('a');
      link.href = url;
      let zipfilename = associateCompanyName+'_'+locationName+'_'+year+'_'+month+'.zip';


      link.setAttribute('download', zipfilename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success(`Registers Generated successfully`); 
    setDownloading(false);
  } catch (error) {
    console.error('Error processing registers:', error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        message: error.message,
        name: error.name,
        code: error.code,
        config: error.config,
        request: error.request,
        response: error.response ? {
          data: error.response.data,
          status: error.response.status,
          headers: error.response.headers,
        } : null,
      });
    toast.error("Error in downloading files");
    setDownloading(false);
  }
}

  }


  const DownloadErrorLogs=()=>{
    // alert(company);
    // alert(associateCompany);
    // alert(stateName);
    // alert(location);
    // alert(year);
    // alert(month);
    const formData = new FormData();
    
    formData.append('CompanyId',company );
    formData.append('AssociateCompanyId', associateCompany)
    formData.append('LocationId', location)
    formData.append('StateId', stateName)
    formData.append('Year', year)
    formData.append('Month', month)

    console.log(formData);

    dispatch(getErrorLogs(formData))
  }

  interface FileDetails {
    filePath: string;
    configType: string;
  }
  
  interface ApiResponse {
    status: string;
    list: FileDetails[];
    message: string | null;
  }

  const onclickDownload=(file:any)=>{
    //alert(each.registerUrl);
    const url = file.filePath;

   // alert(url);
     
  // Create a new anchor element
  const link = document.createElement('a');
  link.href = url;
  
  // Set the download attribute to suggest a file name (optional)
  // This is the name the file will be downloaded as
  link.download = url.split('/').pop(); // Use the file name from the URL

  // Append the anchor to the body
  document.body.appendChild(link);

  // Programmatically click the anchor
  link.click();

  // Remove the anchor from the document
  document.body.removeChild(link);
  }

  // Function to handle the download of all files
const handleFileDownloads = async (files: FileDetails[]) => {
  for (const file of files) {
   // alert(file.filePath);
    await onclickDownload(file);
  }
};



// Function to download a single file
// const downloadFile = async (file: FileDetails) => {
//   try {
//     const response = await axios.get(file.filePath, { responseType: 'blob' });
//     const [year, month] = file.filePath.split('/').slice(-4, -2); // Adjust according to your filePath structure
//     const newFileName = `${file.configType}-${year}-${month}.xlsx`;

//     // Create a blob URL and open it to initiate download
//     const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
//     window.open(url);
    
//     // Optionally, you can clean up the URL object after a delay
//     setTimeout(() => {
//       window.URL.revokeObjectURL(url);
//     }, 10000);

//     toast.success(`${newFileName} downloaded successfully`);
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       console.error(`Error downloading file from ${file.filePath}:`, error.toJSON());
//       if (error.response) {
//         console.error('Response data:', error.response.data);
//         console.error('Response status:', error.response.status);
//         console.error('Response headers:', error.response.headers);
//       } else if (error.request) {
//         console.error('Request was made but no response was received:', error.request);
//       } else {
//         console.error('Error in setup or configuration:', error.message);
//       }
//     } else {
//       console.error('Unexpected error:', error);
//     }
//     toast.error('An error occurred while downloading the file.');
//   }
// };

// Function to handle the download of all files
// const handleFileDownloads = async (files: FileDetails[]) => {
//   for (const file of files) {
//     await downloadFile(file);
//   }
// };

  useEffect(() => {
    if (getErrorLogDetails.status === 'succeeded') {
      (async () => {
     //   alert('429 configuploadstatus hitted');
       // alert(getErrorLogDetails.data.status);

        if (getErrorLogDetails.data.status === 'Success') {
          const files = getErrorLogDetails.data.list;
          await handleFileDownloads(files);
        }

        if (getErrorLogDetails.data.status === 'Failure') {
          toast.error('No files found');
        }
      })();
    } else if (getErrorLogDetails.status === 'failed') {
      toast.error('An error occurred while fetching data.');
      dispatch(resetErrorLogsDetailsStatus());
    }
  }, [getErrorLogDetails.status, dispatch]);

  
  


  return (
    <div style={{ backgroundColor:'#ffffff', minHeight:'100vh'}}>
      {loading ? <PageLoader>Loading...</PageLoader> : 
      <div>
        {downloading ? <PageLoader>Processing Registers...</PageLoader> :

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
                          <MenuItem disabled sx={{display:'none'}} value="">
                            Select Associate Company
                          </MenuItem>
                          {associateCompanies && associateCompanies.map((each:any) => {
                            return <MenuItem sx={{ width: '240px', whiteSpace: 'initial' }} value={each.id}>{each.name}</MenuItem>
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
                          <MenuItem disabled sx={{display:'none'}} value="">
                            Select State
                          </MenuItem>
                          {states && states.map((each:any) => {
                            return <MenuItem sx={{ width: '240px', whiteSpace: 'initial' }} value={each.id}>{each.name}</MenuItem>
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
                          <MenuItem disabled sx={{display:'none'}} value="">
                            Select Location
                          </MenuItem>
                          {locations && locations.map((each:any) => {
                            const { id, name, code, cities }: any = each.location || {};
                            const { state } = cities || {};
                            if(state.id === stateName){
                              return <MenuItem sx={{ width: '240px', whiteSpace: 'initial' }} value={each.locationId}>{`${name} (${state.code}-${cities.code}-${code})`}</MenuItem>
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
                          <MenuItem disabled sx={{display:'none'}} value="">
                            Select Year
                          </MenuItem>
                          {yearsList && yearsList.map((each:any) => 
                            <MenuItem sx={{ width: '240px', whiteSpace: 'initial' }} value={each}>{each}</MenuItem>
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
                          <MenuItem disabled sx={{display:'none'}} value="">
                            Select Month
                          </MenuItem>
                          {monthList && monthList.map((each:any) => 
                            <MenuItem sx={{ width: '240px', whiteSpace: 'initial' }} value={each}>{each}</MenuItem>
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
                     {/* <Typography sx={{font: 'normal normal bold 22px/32px Calibri', color:'#0F105E'}}>{employeeCounts.wageTotal ? employeeCounts.wageTotal : "NA"}</Typography>   */}
                     <Typography sx={{font: 'normal normal bold 22px/32px Calibri', color:'#0F105E'}}>{(employeeCounts.employeeExistingCount+employeeCounts.wageNewCount+employeeCounts.wageResignedCount) ? (employeeCounts.employeeExistingCount+employeeCounts.wageNewCount+employeeCounts.wageResignedCount) : "NA"}</Typography>  
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
                          <Typography sx={{font: 'normal normal normal 22px/32px Calibri', color:'#6F6F6F'}}>Existing</Typography>
                          <Typography sx={{font: 'normal normal bold 22px/32px Calibri', color:'#0F105E'}}>{employeeCounts.employeeExistingCount ? employeeCounts.employeeExistingCount : "NA"}</Typography> 
                        </Box>
                        <Box sx={{borderRight:'1px solid #707070', opacity:'0.1'}}></Box>

                        {/* <Box sx={{padding:'10px'}}>
                          <Typography sx={{font: 'normal normal normal 22px/32px Calibri', color:'#6F6F6F'}}>F & F</Typography>
                           <Typography sx={{font: 'normal normal bold 22px/32px Calibri', color:'#0F105E'}}>{employeeCounts.wageFandFCount ? employeeCounts.wageFandFCount : "NA"}</Typography>  
                        </Box> */}
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
                            let redirectFunction = onClickEmployeeAttendancePreview
                            if(each.inputFiletype === 'Employee'){
                              redirectFunction = onClickEmployeeUploadPreview
                            }else if(each.inputFiletype === 'Leave availed'){
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
                                                  {each.status === 'Completed' ? 
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
                  
                  {/*<Button sx={{mt:2, width:'90%'}} variant='outlined' onClick={handleProcessRegisters}>
                    {/* <Typography padding={'8px'} color={'#0654AD'}> Process Registers</Typography> 
                    Process Registers
                  </Button>*/}

{
                      hasUserAccess(USER_PRIVILEGES.REGISTER_EMPLOYEE_DASHBOARD) &&
                  <Button sx={{mt:2, width:'90%'}} variant='outlined' onClick={handleProcessRegisters2}>
                    {/* <Typography padding={'8px'} color={'#0654AD'}> Process Registers</Typography> */}
                    Process Registers
                  </Button>
                  }

                  
                  {/* <Button sx={{mt:2, width:'90%'}} variant='outlined' onClick={handleProcessRegisters2}>
                     <Typography padding={'8px'} color={'#0654AD'}> Process Registers</Typography> 
                    Process Registers
                  </Button> */}

                </Box>

                {/* Check list Box */}
                <Box sx={{width:'24%', display:'flex', flexDirection:'column', alignItems:'center'}}>
                  
                  <Box sx={{padding:'20px', width:'100%', height:'330px', background:'#222385 0% 0% no-repeat padding-box', boxShadow:'0px 6px 10px #00000029', borderRadius:'10px'}}>
                      <Box sx={{display:'flex', alignItems:'center'}}>
                        <FaRegCircleCheck style={{fontSize:'28px'}}/>
                        <Typography ml={2}> Check List</Typography>
                      </Box>

                      <Box mt={2} sx={{display:'flex', justifyContent:'space-between', alignItems:'center', background:'#055FC64D 0% 0% no-repeat padding-box', borderRadius:'8px', border:'1px solid #055FC6'}}>
                        <Typography padding={'8px'}> Employee Pan ( {employeeCounts.employeePanCount ? employeeCounts.employeePanCount : "0" } nos )</Typography>
                        <Box sx={{padding:'8px', background:'#0654AD 0% 0% no-repeat padding-box', borderRadius:'8px'}}>
                          <FaCloudUploadAlt style={{fontSize:'20px'}}/>
                        </Box>
                      </Box>
                      
                      <Box mt={1} sx={{display:'flex', justifyContent:'space-between', alignItems:'center', background:'#055FC64D 0% 0% no-repeat padding-box', borderRadius:'8px', border:'1px solid #055FC6'}}>
                        <Typography padding={'8px'}> Aadhar ( {employeeCounts.employeeAadharCount ? employeeCounts.employeeAadharCount : "0" } nos )</Typography>
                        <Box sx={{padding:'8px', background:'#0654AD 0% 0% no-repeat padding-box', borderRadius:'8px'}}>
                          <FaCloudUploadAlt style={{fontSize:'20px'}}/>
                        </Box>
                      </Box>

                      <Box mt={1} sx={{display:'flex', justifyContent:'space-between', alignItems:'center', background:'#055FC64D 0% 0% no-repeat padding-box', borderRadius:'8px', border:'1px solid #055FC6'}}>
                        <Typography padding={'8px'}> ESIC ( {employeeCounts.employeeESICount ? employeeCounts.employeeESICount : "0" } nos )</Typography>
                        <Box sx={{padding:'8px', background:'#0654AD 0% 0% no-repeat padding-box', borderRadius:'8px'}}>
                          <FaCloudUploadAlt style={{fontSize:'20px'}}/>
                        </Box>
                      </Box>

                      <Box mt={1} sx={{display:'flex', justifyContent:'space-between', alignItems:'center', background:'#055FC64D 0% 0% no-repeat padding-box', borderRadius:'8px', border:'1px solid #055FC6'}}>
                        <Typography padding={'8px'}> PF NO ( {employeeCounts.employeePFnumberCount ? employeeCounts.employeePFnumberCount : "0" } nos )</Typography>
                        <Box sx={{padding:'8px', background:'#0654AD 0% 0% no-repeat padding-box', borderRadius:'8px'}}>
                          <FaCloudUploadAlt style={{fontSize:'20px'}}/>
                        </Box>
                      </Box>

                      <Box mt={1} sx={{display:'flex', justifyContent:'space-between', alignItems:'center', background:'#055FC64D 0% 0% no-repeat padding-box', borderRadius:'8px', border:'1px solid #055FC6'}}>
                        <Typography padding={'8px'}>UAN NO ( {employeeCounts.employeeUANnumberCount ? employeeCounts.employeeUANnumberCount : "0" } nos )</Typography>
                        <Box sx={{padding:'8px', background:'#0654AD 0% 0% no-repeat padding-box', borderRadius:'8px'}}>
                          <FaCloudUploadAlt style={{fontSize:'20px'}}/>
                        </Box>
                      </Box>
                    

                      {/* <Box mt={1} sx={{display:'flex', justifyContent:'space-between', alignItems:'center', background:'#055FC64D 0% 0% no-repeat padding-box', borderRadius:'8px', border:'1px solid #055FC6'}}>
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
                      </Box> */}

                  </Box>

                  <Box mt={2} sx={{width:'90%', display:'flex', justifyContent:'space-between', borderRadius:'8px', border:'1px solid #F25050'}} onClick={() => {DownloadErrorLogs()}}>
                    <Typography padding={'8px'} color={'#F11919'}> Download Error Logs</Typography>
                    <Box sx={{padding:'8px', background:'#F11919 0% 0% no-repeat padding-box', borderRadius:'8px'}}>
                      <FaCloudDownloadAlt style={{fontSize:'20px'}}/>
                    </Box>
                  </Box>

                </Box>

                {/* Backend Box
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
                    

                </Box> */}

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

                      {/* <Box mt={1} sx={{display:'flex', justifyContent:'space-between', alignItems:'center', background:'#055FC64D 0% 0% no-repeat padding-box', borderRadius:'8px', border:'1px solid #055FC6'}}>
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
                      </Box> */}

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
      }
    </div>
  )
}

export default InputsDashboard





