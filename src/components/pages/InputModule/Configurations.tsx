import React, { useEffect, useState } from 'react'
import PageLoader from '../../shared/PageLoader'
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import { callExcelHeaderToDbColumns, configUpload, employeeAttendanceUpload, employeeLeaveAvailedUpload, employeeLeaveCreditUpload, employeeUpload, employeeWageUpload, getAllCompaniesDetails, getAssociateCompanies, getColumns, getInputModuleMappingDetails, getLocations, getStates, resetConfigUploadDetails, resetEmployeeAttendanceUploadDetails, resetEmployeeLeaveAvailedUploadDetails, resetEmployeeLeaveCreditUploadDetails, resetEmployeeUploadDetails, resetEmployeeWageUploadDetails, resetExcelHeaderToDbColumnsDetails, resetGetColumnsDetails, resetGetConfigMappingDetails } from '../../../redux/features/inputModule.slice';
import { Box, Button, Drawer, FormControl, FormControlLabel, FormLabel, IconButton, Select as MSelect, InputAdornment, InputLabel, MenuItem, Modal, OutlinedInput, Radio, RadioGroup, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, TextField, Typography } from '@mui/material';
import { DEFAULT_OPTIONS_PAYLOAD, DEFAULT_PAYLOAD } from '../../common/Table';
import { ERROR_MESSAGES } from '../../../utils/constants';
import { toast } from 'react-toastify';
import { IoMdClose } from 'react-icons/io';
import { Alert } from 'react-bootstrap';
import { download, downloadFileContent, preventDefault } from '../../../utils/common';
import { FaUpload } from 'react-icons/fa';
import Select from "react-select";
import Companies from '../Masters/Companies/Companies';
import { faL } from '@fortawesome/free-solid-svg-icons';
import { hasUserAccess } from '../../../backend/auth';
import { USER_PRIVILEGES } from '../UserManagement/Roles/RoleConfiguration';

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
  const employeeUploadDetails = useAppSelector((state) => state.inputModule.employeeUploadDetails);
  const employeeAttendanceUploadDetails = useAppSelector((state) => state.inputModule.employeeAttendanceUploadDetails);
  const employeeLeaveCreditUploadDetails = useAppSelector((state) => state.inputModule.employeeLeaveCreditUploadDetails);
  const employeeLeaveAvailedUploadDetails = useAppSelector((state) => state.inputModule.employeeLeaveAvailedUploadDetails);
  const employeeWageUploadDetails = useAppSelector((state) => state.inputModule.employeeWageUploadDetails);
  const configMappingDetails = useAppSelector((state) => state.inputModule.configMappingDetails)

  const configMappingList = configMappingDetails && configMappingDetails.data.list

  const configurationList = configUploadDetails && configUploadDetails.data.list
  const columnsList = getColumnsDetails && getColumnsDetails.data

  const loading = configMappingDetails.status === 'loading' || employeeUploadDetails.status === 'loading' || employeeAttendanceUploadDetails.status === 'loading' || employeeLeaveCreditUploadDetails.status === 'loading' || employeeLeaveAvailedUploadDetails.status === 'loading' || employeeWageUploadDetails.status === 'loading' || configUploadDetails.status === 'loading' || getColumnsDetails.status === 'loading' || excelHeaderToDbColumnsDetails.status === 'loading' || companiesDetails.status === 'loading' || associateCompaniesDetails.status === 'loading' || locationsDetails.status === 'loading'

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

  const [openPreviewModal, setOpenPreviewModal] = React.useState(false);

  const [tableData, setTableData] = React.useState<any>([]);

  const [errorfilepath,setErrorFilePath]=React.useState('');

  const [showmappinglne,setShowMappingLine]= React.useState(false);

  const handleChangeConfigType = (event:any) => {
    setCompany('')
    setAssociateCompany('')
    setStateName('')
    setLocation('')
    setYear('')
    setMonth('')
    resetDataValues()
    setConfigType(event.target.value)
  }

  const handleChangeCompany = (event:any) => {
    setAssociateCompany('')
    setStateName('')
    setLocation('')
    setYear('')
    setMonth('')
    resetDataValues()
    setCompany(event.target.value);
  };

  const handleChangeAssociateCompany = (event:any) => {
    setStateName('')
    setLocation('')
    setYear('')
    setMonth('')
    resetDataValues()
    setAssociateCompany(event.target.value);
  };

  const handleChangeStateName = (event:any) => {
    setLocation('')
    setYear('')
    setMonth('')
    resetDataValues()
    setStateName(event.target.value);
  }

  const handleChangeLocation = (event:any) => {
    setYear('')
    setMonth('')
    resetDataValues()
    setLocation(event.target.value);
  };
  
  const handleChangeYear = (event:any) => {
    setMonth('')
    resetDataValues()
    setYear(event.target.value.toString());
  };
  
  const handleChangeMonth = (event:any) => {
    resetDataValues()
    setMonth(event.target.value);
  };

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

  useEffect(() => {
    setUploadError(false);

    resetStateValues()
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

  // useEffect(() => {
  //   if(employeeUploadDetails.status === 'succeeded'){
  //     if(employeeUploadDetails.data.key === 'FAILURE'){
  //       const formData = new FormData();
  //       const data = uploadData ? uploadData[0] : []
  //       formData.append('file', data);
  //       formData.append('Remarks', 'NA')
  //       formData.append('Year', year)
  //       formData.append('Month', month)
  //       formData.append('Mapped', 'false')
  //       formData.append('ConfigurationType', configType)
  //       formData.append('CompanyId', company)
  //       formData.append('AssociateCompanyId', associateCompany)
  //       formData.append('LocationId', location)
  //       formData.append('StateId', stateName)
  //       dispatch(configUpload(formData))
  //     }else{
  //       resetStateValues()
  //       toast.success(`Upload Successfull`)
  //     }
  //   }else if (employeeUploadDetails.status === 'failed'){
  //     toast.error(ERROR_MESSAGES.DEFAULT);
  //   }
  // }, [employeeUploadDetails.status])


  useEffect(() => {
    if(employeeUploadDetails.status === 'succeeded'){
     //alert("employeeUploadDetails hitted");
      console.log(employeeUploadDetails.data);
      if(employeeUploadDetails.data.status === 'NOTSETUP'){
       // alert("not set up hitted");
        const formData = new FormData();
        const data = uploadData ? uploadData[0] : []
        formData.append('file', data);
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
      else if(employeeUploadDetails.data.filePath!= null )
        {
         //alert("file path not null hitted")
  setUploadError(true);
  setErrorFilePath(employeeUploadDetails.data.filePath);
 // alert("employeeUploadDetails.data.filePath!= null hitted");
  dispatch(resetEmployeeUploadDetails());
      
      }
      else if (employeeUploadDetails.data.status === 'FAILURE'){
     // alert("employeeUploadDetails.status === 'FAILURE' hitted");
        //toast.error(ERROR_MESSAGES.DEFAULT);
        toast.error(employeeUploadDetails.data.statusMessage);
        dispatch(resetEmployeeUploadDetails());
        dispatch(resetConfigUploadDetails());
      }
      else if(employeeUploadDetails.data.status === 'SUCCESS'){
       // alert("employee sccess hitted")
        resetStateValues()
        //toast.success(`Employee Data Upload Successfull`)
        toast.success(employeeUploadDetails.data.statusMessage);
      }
     
    }
    else if (employeeUploadDetails.status === 'failed'){
    // alert("employeeUploadDetails.status === 'failed hitted");
      toast.error(ERROR_MESSAGES.DEFAULT);
      dispatch(resetEmployeeUploadDetails());
      dispatch(resetConfigUploadDetails());
    }
    
  }, [employeeUploadDetails.status])

  useEffect(() => {
    if(employeeAttendanceUploadDetails.status === 'succeeded'){
      //alert("employeeUploadDetails hitted");
        console.log(employeeAttendanceUploadDetails.data);
      if(employeeAttendanceUploadDetails.data.status === 'NOTSETUP'){
     // alert("not set up hitted");
        const formData = new FormData();
        const data = uploadData ? uploadData[0] : []
        formData.append('file', data);
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
      else if(employeeAttendanceUploadDetails.data.filePath!= null )
        {
         // alert("failpeath not null hitted");
  setUploadError(true);
  setErrorFilePath(employeeAttendanceUploadDetails.data.filePath);
  //alert("employeeUploadDetails.data.filePath!= null hitted");
 // dispatch(resetEmployeeAttendanceUploadDetails());
      
      }
      else if (employeeAttendanceUploadDetails.data.status === 'FAILURE'){
       // alert("employeeUploadDetails.status === 'FAILURE' hitted");
        //toast.error(ERROR_MESSAGES.DEFAULT);
        toast.error(employeeAttendanceUploadDetails.data.statusMessage);
        dispatch(resetEmployeeAttendanceUploadDetails());
        dispatch(resetConfigUploadDetails());
      }
      else if(employeeAttendanceUploadDetails.data.status === 'SUCCESS'){
         // alert("employee sccess hitted")
         resetStateValues()
         //toast.success(`Upload Successfull`)
         toast.success(employeeAttendanceUploadDetails.data.statusMessage);
       }
    }else if (employeeAttendanceUploadDetails.status === 'failed'){
      toast.error(ERROR_MESSAGES.DEFAULT);
      dispatch(resetEmployeeAttendanceUploadDetails());

      dispatch(resetConfigUploadDetails());
    }
  }, [employeeAttendanceUploadDetails.status])


  // useEffect(() => {
  //   if(employeeAttendanceUploadDetails.status === 'succeeded'){
  //     if(employeeAttendanceUploadDetails.data.key === 'FAILURE'){
  //       const formData = new FormData();
  //       const data = uploadData ? uploadData[0] : []
  //       formData.append('file', data);
  //       formData.append('Remarks', 'NA')
  //       formData.append('Year', year)
  //       formData.append('Month', month)
  //       formData.append('Mapped', 'false')
  //       formData.append('ConfigurationType', configType)
  //       formData.append('CompanyId', company)
  //       formData.append('AssociateCompanyId', associateCompany)
  //       formData.append('LocationId', location)
  //       formData.append('StateId', stateName)
  //       dispatch(configUpload(formData))
  //     }else{
  //       resetStateValues()
  //       toast.success(`Upload Successfull`)
  //     }
  //   }else if (employeeAttendanceUploadDetails.status === 'failed'){
  //     toast.error(ERROR_MESSAGES.DEFAULT);
  //   }
  // }, [employeeAttendanceUploadDetails.status])

  useEffect(() => {
    if(employeeLeaveCreditUploadDetails.status === 'succeeded'){
      if(employeeLeaveCreditUploadDetails.data.key === 'FAILURE'){
        const formData = new FormData();
        const data = uploadData ? uploadData[0] : []
        formData.append('file', data);
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
      }else{
        resetStateValues()
        toast.success(`Upload Successfull`)
      }
    }else if (employeeLeaveCreditUploadDetails.status === 'failed'){
      toast.error(ERROR_MESSAGES.DEFAULT);
    }
  }, [employeeLeaveCreditUploadDetails.status])

  useEffect(() => {
    if(employeeLeaveAvailedUploadDetails.status === 'succeeded'){
      if(employeeLeaveAvailedUploadDetails.data.key === 'FAILURE'){
        const formData = new FormData();
        const data = uploadData ? uploadData[0] : []
        formData.append('file', data);
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
      }else{
        resetStateValues()
        toast.success(`Upload Successfull`)
      }
    }else if (employeeLeaveAvailedUploadDetails.status === 'failed'){
      toast.error(ERROR_MESSAGES.DEFAULT);
    }
  }, [employeeLeaveAvailedUploadDetails.status])

  useEffect(() => {
    if(employeeWageUploadDetails.status === 'succeeded'){
      console.log(employeeUploadDetails.data);
      if(employeeWageUploadDetails.data.status === 'NOTSETUP'){
        //alert("employeewageupload details hitted");
        //alert(configType);
        const formData = new FormData();
        const data = uploadData ? uploadData[0] : []
        formData.append('file', data);
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
      else if(employeeWageUploadDetails.data.filePath!= null )
        {
               //alert("file path not null hitted")
  setUploadError(true);
  setErrorFilePath(employeeWageUploadDetails.data.filePath);
 // alert("employeeUploadDetails.data.filePath!= null hitted");
  dispatch(resetEmployeeWageUploadDetails());
        }
        else if (employeeWageUploadDetails.data.status === 'FAILURE'){
          // alert("employeeUploadDetails.status === 'FAILURE' hitted");
            // toast.error(ERROR_MESSAGES.DEFAULT);
            toast.error(employeeWageUploadDetails.data.statusMessage);
             dispatch(resetEmployeeWageUploadDetails());
             dispatch(resetConfigUploadDetails());
           }
           else if(employeeWageUploadDetails.data.status === 'SUCCESS'){
            // alert("employee sccess hitted")
             resetStateValues()
             //toast.success(`Wage Data Upload Successfull`)
             toast.success(employeeWageUploadDetails.data.statusMessage)
           }
        
    }else if (employeeWageUploadDetails.status === 'failed'){
      toast.error(ERROR_MESSAGES.DEFAULT);
      dispatch(resetEmployeeUploadDetails());
      dispatch(resetConfigUploadDetails());
    }
  }, [employeeWageUploadDetails.status])



  
  useEffect(() => {
    if(configUploadDetails.status === 'succeeded'){
   //alert("429 configuploadstatus hitted");
      setTableData(configUploadDetails.data.list)
      setShowMappingLine(true);
      resetUploadDetails()
      if(configType === 'Employee'){
        dispatch(getColumns('Employee'))
      }else if(configType === 'Employee Attendance'){
        dispatch(getColumns('employeeattendance'))
      }else if(configType === 'Leave Credit'){
        dispatch(getColumns('employeeleavecredit'))
      }else if(configType === 'Leave Availed'){
        dispatch(getColumns('employeeleaveavailed'))
      }else if(configType === 'Employee Wage'){
        dispatch(getColumns('employeewage'))
      }
      setOpenUploadModal(false)
    }
    else if(configUploadDetails.data.filePath!= null )
      {
setUploadError(true);
//alert("employeeUploadDetails.data.filePath!= null hitted"); 
    }
  else if (configUploadDetails.status === 'failed'){
    //alert(" 448 employeeUploadDetails.status === 'failed hitted");
    toast.error(ERROR_MESSAGES.DEFAULT);
    dispatch(resetEmployeeUploadDetails());
    dispatch(resetConfigUploadDetails());
  }
else if (configUploadDetails.status === 'failed'){
      toast.error(ERROR_MESSAGES.DEFAULT);
    }
  }, [configUploadDetails.status])




  useEffect(() => {
    if(excelHeaderToDbColumnsDetails.status === 'succeeded'){
       toast.success("Mappings Updated Successfully");
       toast.info("Upload the Data Now");
      setTableData([]);
      // alert("466excelheaderto db col hitted ")
      // const formData = new FormData();
      // const data = uploadData ? uploadData[0] : []
      // formData.append('file', data);
      // formData.append('Remarks', 'NA')
      // formData.append('Year', year)
      // formData.append('Month', month)
      // formData.append('Mapped', 'true')
      // formData.append('ConfigurationType', configType)
      // formData.append('CompanyId', company)
      // formData.append('AssociateCompanyId', associateCompany)
      // formData.append('LocationId', location)
      // formData.append('StateId', stateName)
      // if(configType === 'Employee'){
      //   dispatch(employeeUpload(formData))
      // }else if(configType === 'Employee attendance'){
      //   dispatch(employeeAttendanceUpload(formData))
      // }else if(configType === 'Leave credit'){
      //   dispatch(employeeLeaveCreditUpload(formData))
      // }else if(configType === 'Leave availed'){
      //   dispatch(employeeLeaveAvailedUpload(formData))
      // }else if(configType === 'Employee Wage'){
      //   dispatch(employeeWageUpload(formData))
      // }
    }else if(excelHeaderToDbColumnsDetails.status === 'failed'){
      toast.error(ERROR_MESSAGES.DEFAULT);
    }
  },[excelHeaderToDbColumnsDetails.status])

  
  useEffect(() => {
    if(configMappingDetails.status === 'succeeded'){
     //alert("495 config mapp details hitted")
      if(configMappingDetails.data.status !== 'FAILURE'){        
        setTableData(configMappingList)
      }
    }else if(configMappingDetails.status === 'failed'){
      toast.error(ERROR_MESSAGES.DEFAULT);
      resetGetConfigMappingDetails()
    }
  }, [configMappingDetails.status])

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

  const configurationTypes = ["Employee", "Leave Credit", 'Leave Availed', 'Employee Attendance', 'Employee Wage' ]

  const onClickUpload = () => {
    if(!company || !associateCompany || !stateName || !location || !year || !month || !configType){
      return toast.error(ERROR_MESSAGES.FILL_ALL);
    } else{
      setOpenUploadModal(true)
    }
  }

  const onClickSubmitUpload = () => {
    const formData = new FormData();
    const data = uploadData ? uploadData[0] : []
    formData.append('file', data);
    formData.append('Remarks', 'NA')
    formData.append('Year', year)
    formData.append('Month', month)
    formData.append('Mapped', 'false')
    formData.append('ConfigurationType', configType)
    formData.append('CompanyId', company)
    formData.append('AssociateCompanyId', associateCompany)
    formData.append('LocationId', location)
    formData.append('StateId', stateName)
    console.log(formData);
    if(configType === 'Employee'){
      dispatch(employeeUpload(formData))
    }else if(configType === 'Employee Attendance'){
      dispatch(employeeAttendanceUpload(formData))
    }else if(configType === 'Leave Credit'){
      dispatch(employeeLeaveCreditUpload(formData))
    }else if(configType === 'Leave Availed'){
      dispatch(employeeLeaveAvailedUpload(formData))
    }else if(configType === 'Employee Wage'){
      dispatch(employeeWageUpload(formData))
    }
  }
//  const configurationTypes = ["Employee", "Leave Credit", 'Leave Availed', 'Employee Attendance', 'Employee Wage' ]

  const onClickSave = () => {
    console.log('ttabbel', tableData)
    const check = tableData.find((each:any) => (each.employeeFieldName === null || each.employeeFieldName === ''))
    if(check){
      return toast.error('Please Select All Ezycomp Fields');
    } else{
     
      dispatch(callExcelHeaderToDbColumns({listExcelHeadertoDBColumnsMapp : tableData}))
      setShowMappingLine(false);
    }
  }

  const onClickPreview = () => {  
    if(!company || !associateCompany || !location || !configType){
      return toast.error(ERROR_MESSAGES.FILL_ALL);
    }else{
      const payload = {
        search: '', 
        filters: [
          {
            columnName:'ConfigurationType',
            value: configType
          },
          {
            columnName:'CompanyId',
            value: company
          },
          {
            columnName:'AssociateCompanyId',
            value: associateCompany
          },
          {
            columnName:'LocationId',
            value: location
          }
        ],
        pagination: {
          pageSize: 200,
          pageNumber: 1
        },
        sort: { columnName: 'companyId', order: 'asc' },
        "includeCentral": true
      }
      dispatch(getInputModuleMappingDetails(payload))
      setOpenPreviewModal(true)
    }
  }

  const downloadErrors = (e: any) => {
    preventDefault(e);
    // alert("dwn err hitted");
    // const response = employeeUploadDetails.data;
    // alert(response.filePath);
    // console.log("response in dnwnld error ",response);
    // console.log(response);


    // if(employeeUploadDetails.data.filePath!=null){
    //     const filename = 'ErrosList.xlsx'
    //   const filepath =  employeeUploadDetails.data.filePath;
    //   window.open(filepath, '_blank');
    // }
    // else if(employeeAttendanceUploadDetails.data.filePath!=null){
    //   alert("donwloaderrors hittsed")
    //   alert(employeeUploadDetails.data.filePath);

    //   const filepath =  employeeUploadDetails.data.filePath;
    //   alert(filepath);
    //   window.open(filepath, '_blank');
    // }
    
    
    const filepath = errorfilepath;
    // download('Sample Holidays.xlsx', url)

   // preventDefault(e);
   // const fileUrl = formFilePath;

    // Open the URL in a new tab to download the file
     window.open(filepath, '_blank');

    // if (filename && filepath) {
    //   const link = document.createElement('a');
    //   link.href = filepath;
    //   link.download = filename;
    //   link.target = "_blank"
    //   document.body.appendChild(link);
    //   link.click();
    //   document.body.removeChild(link);
 // }
}

  const downloadErrorsold = (e: any) => {
    preventDefault(e);
    const data: any = {};
    employeeUploadDetails.data.status
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
  console.log('leve dett', employeeLeaveCreditUploadDetails)

  const resetUploadDetails = () => {
    dispatch(resetConfigUploadDetails())
    dispatch(resetEmployeeUploadDetails())
    dispatch(resetEmployeeAttendanceUploadDetails())
    dispatch(resetEmployeeLeaveCreditUploadDetails())
    dispatch(resetEmployeeLeaveAvailedUploadDetails())
    dispatch(resetEmployeeWageUploadDetails())
  }

  const closeMappingPreview =()=>{
    //alert("hitted close mapping preview");
    dispatch(resetConfigUploadDetails())
    dispatch(resetGetColumnsDetails())
    dispatch(resetExcelHeaderToDbColumnsDetails())
    dispatch(resetEmployeeUploadDetails())  
    dispatch(resetEmployeeAttendanceUploadDetails())
    dispatch(resetEmployeeLeaveCreditUploadDetails())
    dispatch(resetEmployeeLeaveAvailedUploadDetails())
    dispatch(resetEmployeeWageUploadDetails())
    dispatch(resetGetConfigMappingDetails())
    setOpenPreviewModal(false);
    setOpenPreviewModal(false);
    setUploadData(null)
    setTableData([])
    setShowMappingLine(false);
  }

  const resetStateValues = () => {
    dispatch(resetConfigUploadDetails())
    dispatch(resetGetColumnsDetails())
    dispatch(resetExcelHeaderToDbColumnsDetails())
    dispatch(resetEmployeeUploadDetails())
    dispatch(resetEmployeeAttendanceUploadDetails())
    dispatch(resetEmployeeLeaveCreditUploadDetails())
    dispatch(resetEmployeeLeaveAvailedUploadDetails())
    dispatch(resetEmployeeWageUploadDetails())
    dispatch(resetGetConfigMappingDetails())

    setOpenUploadModal(false)
    setOpenPreviewModal(false)
    setConfigType('')
    setCompany('')
    setAssociateCompany('')
    setStateName('')
    setLocation('')
    setYear('')
    setMonth('')
    setUploadData(null)
    setTableData([])
  }

  const resetDataValues = () =>{
    dispatch(resetConfigUploadDetails())
    dispatch(resetGetColumnsDetails())
    dispatch(resetExcelHeaderToDbColumnsDetails())
    dispatch(resetEmployeeUploadDetails())
    setUploadData(null)
    setTableData([])
  } 

  // console.log('UploadDetails', configUploadDetails, employeeUploadDetails, tableData)
  // console.log("Company", company, "companies", companies)

  console.log('location', location, "locations", locations) 
  console.log('Associate', associateCompany, 'assoc', associateCompanies);
  
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
                  onClick={(e: any) => e.target.value = ''}
                  onChange={(e) => setUploadData(e.target.files)}
                />
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

      {/* Preview Modal */}
      <Modal
        open={openPreviewModal}
        onClose={() => {closeMappingPreview()}}
      >

        <Box sx={style}> 
          <Box sx={{ backgroundColor: '#E2E3F8', padding: '10px', px: '20px', borderRadius: '6px', boxShadow: '0px 6px 10px #CDD2D9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{display: "flex", flexDirection: "column"}}>
            <Typography sx={{ font: 'normal normal normal 32px/40px Calibri' }}> {configType} Mapping Details </Typography>
            {companies && companies.map((each: any) => {
              if (each.id == company) {
                return <Typography>Company Name &nbsp; &nbsp; &nbsp; &nbsp;: &nbsp; &nbsp; &nbsp; <span style={{ font: 'normal normal normal 24px/30px Calibri' }}>{each.name}</span> </Typography>
               }
            })} 
              <Box sx={{ display: "flex", alignItems: 'center'}} >
              {associateCompanies && associateCompanies.map((each: any) => {
                if (each.id == associateCompany) {
                  return <Typography>AssociateCompany &nbsp;: &nbsp; &nbsp; &nbsp; <span style={{ font: 'normal normal normal 24px/30px Calibri', marginRight: '20px' }}>{each.name}</span></Typography>
                }
              })}

              {locations && locations.map((each: any) => {
                const { name }: any = each.location; 
                if (each.locationId === location) {
                  return <Typography>Location &nbsp; : &nbsp; &nbsp; <span style={{ font: 'normal normal normal 24px/30px Calibri' }}>{name}</span> </Typography>
                }
              })}
            </Box>
          
             
            </Box>
            

            
              <IconButton
                onClick={() => {closeMappingPreview()}}
              >
                <IoMdClose />
              </IconButton>
            </Box>
          

            <Box sx={{paddingX: '20px', display: 'flex', flexDirection:'column'}}>
              {
                tableData && tableData.length <= 0 ? 

                <Box sx={{height:'60vh', display:'flex', justifyContent:'center', alignItems:'center'}}>
                  <Typography variant='h5'>No Records Found</Typography>
                </Box>
                : 
                <>
                  <TableContainer sx={{border:'1px solid #e6e6e6', marginTop:'10px', maxHeight:'380px', overflowY:'scroll'}}>
                          <Table stickyHeader  sx={{ minWidth: 650 }} aria-label="sticky table">
                              <TableHead sx={{'.MuiTableCell-root':{ backgroundColor:'#E7EEF7',fontWeight:'600'}}}>
                                  <TableRow>
                                      <TableCell > S.no</TableCell>
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
                                      <TableCell >{each.employeeFieldName}</TableCell>
                                      <TableCell >{each.mapped ? "Yes" : "No"}</TableCell>
                                    </TableRow>
                              ))}
                              </TableBody>
                          </Table>
                  </TableContainer>
                </>
              }
            </Box>

            <Box sx={{display:'flex', padding:'20px', borderTop:'1px solid #6F6F6F',justifyContent:'space-between', alignItems:'center', mt:4}}>
              <Button variant='contained' sx={{backgroundColor:'#707070'}} onClick={() => {resetStateValues()}}>Cancel</Button>
            </Box>

        </Box>

      </Modal>

      {loading ? <PageLoader>Loading...</PageLoader> : 
        <div >

            {/* Filter Box*/}
            <Box sx={{paddingX: '20px', paddingY:'10px',}}>
              <Box sx={{backgroundColor:'#E2E3F8', paddingX: '20px', paddingY:'10px', borderRadius:'6px', boxShadow: '0px 6px 10px #CDD2D9'}}>
                  <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px', marginTop:'5px'}}>
                      <h5 style={{ font: 'normal normal normal 32px/40px Calibri' }}>Input Module Uploads</h5>
                      {showmappinglne ? <p style={{ color: 'white', backgroundColor: 'rgb(6, 84, 173)', fontWeight: 'bold' }}>Do the Mappings , needed for first time uploading</p> : ""}
                      <Box sx={{marginRight:'12px', display:'flex', alignItems:'center', width:'260px', justifyContent: 'space-between'}}>
                       
                        <Button onClick={onClickPreview} disabled={!configType || !company || !associateCompany || !location} variant='contained' > Preview </Button>
                        {
                    hasUserAccess(USER_PRIVILEGES.ADD_INPUT_MODULE_UPLOAD) &&
                        <Button onClick={onClickUpload} variant='contained' style={{marginRight:'10px', backgroundColor:'#E9704B', display:'flex', alignItems:'center'}}> <FaUpload /> &nbsp; Upload</Button>
                  }

                        {/* <Button onClick={onClickUpload} variant='contained' style={{marginRight:'10px', backgroundColor:'#E9704B', display:'flex', alignItems:'center'}}> <FaUpload /> &nbsp; Upload</Button> */}
                      </Box>
                  </div>
                  <div style={{display:'flex', marginBottom:'10px'}}>

                  <Box sx={{width:'100%', mr:1}}>
                      <Typography mb={1}>Configuration Type</Typography>
                      <FormControl sx={{ width:'100%', maxWidth:'190px', backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                        <MSelect
                          sx={{'.MuiOutlinedInput-notchedOutline': { border: 0 }}}
                          displayEmpty
                          value={configType}
                      onChange={handleChangeConfigType}
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
                            Select Configuration Type
                          </MenuItem>
                          {configurationTypes && configurationTypes.map((each:any) => 
                            <MenuItem sx={{ width: '240px', whiteSpace: 'initial' }} value={each}>{each}</MenuItem>
                          )}
                        </MSelect>
                      </FormControl>
                    </Box>

                    <Box sx={{width:'100%', mr:1}}>
                      <Typography mb={1}>Company</Typography>
                      <FormControl sx={{ width:'100%', maxWidth:'190px', backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                        <MSelect
                          sx={{'.MuiOutlinedInput-notchedOutline': { border: 0 }}}
                          value={company}
                          displayEmpty
                          disabled={!configType}
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
                        </MSelect>
                      </FormControl>
                    </Box>

                    <Box sx={{width:'100%', mr:1}}>
                      <Typography mb={1}>Associate Company</Typography>
                      <FormControl sx={{ width:'100%', maxWidth:'190px', backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                        <MSelect
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
                        </MSelect>
                      </FormControl>
                    </Box>

                    <Box sx={{width:'100%', mr:1}}>
                      <Typography mb={1}>States</Typography>
                      <FormControl sx={{ width:'100%', maxWidth:'190px', backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                        <MSelect
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
                        </MSelect>
                      </FormControl>
                    </Box>

                    <Box sx={{width:'100%', mr:1}}>
                      <Typography mb={1}>Location</Typography>
                      <FormControl sx={{ width:'100%', maxWidth:'190px', backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                        <MSelect
                          sx={{'.MuiOutlinedInput-notchedOutline': { border: 0 }}}
                          displayEmpty
                          value={location}
                          disabled={!stateName}
                      onChange={handleChangeLocation}
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
                            Select Location
                          </MenuItem>
                          {locations && locations.map((each:any) => {
                            const { id, name, code, cities }: any = each.location || {};
                            const { state } = cities || {};
                            if(state.id === stateName){
                              return <MenuItem sx={{  whiteSpace: 'initial' }} value={each.locationId}>{`${name} (${state.code}-${cities.code}-${code})`}</MenuItem>
                            }
                          })}
                        </MSelect>
                      </FormControl>
                    </Box>

                    <Box sx={{width:'100%', mr:1}}>
                      <Typography mb={1}>Year</Typography>
                      <FormControl sx={{ width:'100%', maxWidth:'190px', backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                        <MSelect
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
                        </MSelect>
                      </FormControl>
                    </Box>

                    <Box sx={{width:'100%', mr:1}}>
                      <Typography mb={1}>Month</Typography>
                      <FormControl sx={{ width:'100%', maxWidth:'190px', backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
                        <MSelect
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
                            <MenuItem value={each.value}>{each.label}</MenuItem>
                          )}
                        </MSelect>
                      </FormControl>
                    </Box>

                  </div>
              </Box>
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
                                          <Select
                                            options={columnsList ? columnsList.map((each:any) => {return {label : each, value: each}}) : []}
                                            className="basic-multi-select"
                                            classNamePrefix="select"
                                            value={each.employeeFieldName ? {label: each.employeeFieldName, value: each.employeeFieldName} : ''}
                                            styles={customStyles}
                                            onChange={(e) => handleChangeEzycompField(e, each)}
                                        />
                                      </FormControl>
                                      </TableCell>
                                      <TableCell >{each.mapped ? "Yes" : "No"}</TableCell>
                                     </TableRow>
                              ))}
                              </TableBody>
                          </Table>
                  </TableContainer>
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
