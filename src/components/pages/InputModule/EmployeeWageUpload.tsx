import React, { useEffect } from 'react'
import PageLoader from '../../shared/PageLoader'
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import { getAllCompaniesDetails, getAssociateCompanies, getLocations } from '../../../redux/features/inputModule.slice';
import { Box, Button, Checkbox, Drawer, FormControl, FormControlLabel, FormLabel, IconButton, InputAdornment, InputLabel, MenuItem, Modal, OutlinedInput, Radio, RadioGroup, Select, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, TextField, Typography } from '@mui/material';
import { FaUpload, FaDownload } from "react-icons/fa";
import { IoMdAdd, IoMdClose, IoMdSearch } from "react-icons/io";
import { DEFAULT_OPTIONS_PAYLOAD, DEFAULT_PAYLOAD } from '../../common/Table';
import { addHoliday, deleteHoliday, editHoliday, getHolidaysList, resetAddHolidayDetails, resetBulkDeleteHolidaysDetails, resetDeleteHolidayDetails, resetEditHolidayDetails, resetUploadHolidayDetails, uploadHoliday } from '../../../redux/features/holidayList.slice';
import Icon from '../../common/Icon';
import { useExportEmployees, useExportEmployeesWage, useExportHolidayList } from '../../../backend/exports';
import { download, downloadFileContent, preventDefault } from '../../../utils/common';
import { ERROR_MESSAGES } from '../../../utils/constants';
import { toast } from 'react-toastify';
import { Alert } from 'react-bootstrap';
import { bulkDeleteEmployeeWage, getEmployees, getEmployeesAttendance, getEmployeesLeaveAvailed, getEmployeesLeaveCredit, getEmployeesWage } from '../../../redux/features/employeeMaster.slice';
import { navigate, useQueryParams } from 'raviger';
import { getBasePath } from '../../../App';
import { Console } from 'console';
import { hasUserAccess } from '../../../backend/auth';
import { USER_PRIVILEGES } from '../UserManagement/Roles/RoleConfiguration';

const style = {
  position: 'absolute' as 'absolute',
  top: '25%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
};

const EmployeeWageUpload = () => {

  const dispatch = useAppDispatch();

  const employeesWageDetails = useAppSelector((state) => state.employeeMaster.employeesWageDetails)



  const companiesDetails = useAppSelector((state) => state.inputModule.companiesDetails);
  const associateCompaniesDetails = useAppSelector((state) => state.inputModule.associateCompaniesDetails);
  const locationsDetails = useAppSelector((state) => state.inputModule.locationsDetails);
  const bulkDeleteEmployeeWageDetails = useAppSelector((state) => state.employeeMaster.bulkDeleteEmployeeWage)

  const uploadHolidayDetails = useAppSelector((state) => state.holidayList.uploadHolidayDetails)

  const { exportEmployeesWage, exporting } = useExportEmployeesWage((response: any) => {
    let filename = associateCompanyName+'_'+locationName+'_'+'Employee-Wage'+ '_'+year+'_'+month+ '.xlsx';

    downloadFileContent({
      name: filename,
      type: response.headers['content-type'],
      content: response.data
    });
  }, () => {
    toast.error(ERROR_MESSAGES.DEFAULT);
  });

  const employeesWage = employeesWageDetails.data.list
  const employeesWageCount = employeesWageDetails.data.count 
  console.log("employeesLeaveAvailed", employeesWage, 'employeesLeaveAvailedCount', employeesWageCount)


  const companies = companiesDetails.data.list
  const associateCompanies = associateCompaniesDetails.data.list
  const locations = locationsDetails.data.list

  const loading = exporting || uploadHolidayDetails.status === 'loading' || bulkDeleteEmployeeWageDetails.status === 'loading' ||employeesWageDetails.status === 'loading' || companiesDetails.status === 'loading' || associateCompaniesDetails.status === 'loading' || locationsDetails.status === 'loading'

  const [query] = useQueryParams();


  const [company, setCompany] = React.useState(query.company ? query.company : '');
  const [associateCompany, setAssociateCompany] = React.useState(query.associateCompany ? query.associateCompany : '');
  const [location, setLocation] = React.useState((query.location && query.stateName) ? (query.location + '^' + query.stateName) : '');

  const [year, setYear] = React.useState(query.year ? query.year : '');
  const [month, setMonth] = React.useState(query.month ? query.month : '');

  const [searchInput, setSearchInput] = React.useState('');
  const [activeSort, setActiveSort] = React.useState('code')
  const [sortType, setSortType] = React.useState<any>('asc')
  const [selectedWage, SetSelectedWage] = React.useState<any>([])
  const [openBulkDeleteModal, setOpenBulkDeleteModal] = React.useState(false);

  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [page, setPage] = React.useState(0);

  const [uploadError, setUploadError] = React.useState(false);
  const [openUploadModal, setOpenUploadModal] = React.useState(false);


  const [companyName, setCompanyName] = React.useState('');
  const [associateCompanyName, setAssociateCompanyName] = React.useState('');
  const [locationName, setLocationName] = React.useState('');
 
  const getCompanyNameById = (id: string, companies: { id: string; name: string; }[]) => {
    for (let i = 0; i < companies.length; i++) {
      if (companies[i].id === id) {
        return companies[i].name;
      }
    }
    return '';
  };

  const getAssocCompanyNameById = (id: string, associateCompanies: { id: string; name: string; }[]) => {
    for (let i = 0; i < associateCompanies.length; i++) {
      if (associateCompanies[i].id === id) {
        return associateCompanies[i].name;
      }
    }
    return '';
  };

  const getLocationById = (id: string, locations: any[]) => {
    for (let i = 0; i < locations.length; i++) {
      if (locations[i].locationId === id) {
        return locations[i].location.name;
      }
    }
    return '';
  };


  const handleChangeCompany = (event:any) => {
    setAssociateCompany(''); setLocation(''); setYear(''); setMonth(''); setCompany(event.target.value);
    const selectedCompanyId = event.target.value as string;
    const selectedCompanyName = getCompanyNameById(selectedCompanyId, companies);
    setCompanyName(selectedCompanyName);
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
    dispatch(getEmployeesWage(payload))
  };

  const handleChangeAssociateCompany = (event:any) => {
    const selectedCompanyId = event.target.value as string;
    const selectedCompanyName = getAssocCompanyNameById(selectedCompanyId, associateCompanies);
    setAssociateCompanyName(selectedCompanyName);
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
    dispatch(getEmployeesWage(payload))
  };

  const handleChangeLocation = (event:any) => {
    const selectedCompanyId =  event.target.value.split('^')[0] as string;
    // alert(event.target.value);
     const selectedCompanyName = getLocationById(selectedCompanyId, locations);
     setLocationName(selectedCompanyName);
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
        
          value:  event.target.value.split('^')[0]
        }
      ],
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page+1
      },
      sort: { columnName: 'EmployeeCode', order: 'asc' },
      "includeCentral": true
    }
    dispatch(getEmployeesWage(payload))
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
      sort: { columnName: 'EmployeeCode', order: 'asc' },
      "includeCentral": true
    }
    dispatch(getEmployeesWage(payload))
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
          value: location.split('^')[0]
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
    dispatch(getEmployeesWage(payload))
  };

  const handleChangeSearchInput = (event:any) => {
    setSearchInput(event.target.value)
  }

  useEffect(() => {
    const employeesWagePayload: any =  { 
      search: "",
      filters: [],
      pagination: {
        pageSize: 10,
        pageNumber: 1
      },
      sort: { columnName: 'EmployeeCode', order: 'asc' },
      "includeCentral": true
    }

    dispatch(getEmployeesWage(employeesWagePayload))
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
    if(employeesWageDetails.status === 'succeeded'){

    }else if(employeesWageDetails.status === 'failed'){
      toast.error(ERROR_MESSAGES.DEFAULT);
    }
  }, [employeesWageDetails.status])
  
  useEffect(() => {
    if (query.company && query.associateCompany && query.location && query.stateName && query.year && query.month) {
      const payload = {
        search: "",
        filters: [
          {
            columnName: 'companyId',
            value: query.company
          },
          {
            columnName: 'associateCompanyId',
            value: query.associateCompany
          },
          {
            columnName: 'locationId',
            value: query.location
          },
          {
            columnName: 'year',
            value: query.year
          },
          {
            columnName: 'month',
            value: query.month
          }
        ],
        pagination: {
          pageSize: 10,
          pageNumber: 1
        },
        sort: { columnName: 'code', order: 'asc' },
        "includeCentral": true
      }
      dispatch(getEmployees(payload))
    }
  }, [])

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
       value: location.split('^')[0]
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
      sort: { columnName: 'EmployeeCode', order: 'asc' },
      "includeCentral": true
    }
    dispatch(getEmployeesWage(payload))
  }

  const onClickClearSearch = () => {
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
       value: location.split('^')[0]
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
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page+1
      },
      sort: { columnName: 'EmployeeCode', order: 'asc' },
      "includeCentral": true
    }
    dispatch(getEmployeesWage(payload))
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
       value: location.split('^')[0]
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
    dispatch(getEmployeesWage(payload))
  }

  const onClickSortName = () => {
    let type = 'asc'
    setActiveSort('employeeName'); 
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
       value: location.split('^')[0]
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
      sort: { columnName: 'employeeName', order: type },
      "includeCentral": true
    }
    dispatch(getEmployeesWage(payload))
  }

  const onClickSortNoOfDays = () => {
    let type = 'asc'
    setActiveSort('noOfDays'); 
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
       value: location.split('^')[0]
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
      sort: { columnName: 'month', order: type },
      "includeCentral": true
    }
    dispatch(getEmployeesWage(payload))
    
  }

  const onClickSortStartDate = () => {
    let type = 'asc'
    setActiveSort('leaveStartDate'); 
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
       value: location.split('^')[0]
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
      sort: { columnName: 'standardDays', order: type },
      "includeCentral": true
    }
    dispatch(getEmployeesWage(payload))
    
  }

  const onClickSortEndDate= () => {
    let type = 'asc'
    setActiveSort('leaveEndDate'); 
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
       value: location.split('^')[0]
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
      sort: { columnName: 'workDays', order: type },
      "includeCentral": true
    }
    dispatch(getEmployeesWage(payload))
    
  }

  const onClickSortHouseRent = () => {
    let type = 'asc'
    setActiveSort('leaveEndDate');
    if (sortType === 'asc') {
      setSortType('desc')
      type = 'desc'
    } else {
      setSortType('asc')
    }

    const filters = []
    if (company) {
      filters.push({
        columnName: 'companyId',
        value: company
      })
    }
    if (associateCompany) {
      filters.push({
        columnName: 'associateCompanyId',
        value: associateCompany
      })
    }
    if (location) {
      filters.push({
        columnName: 'locationId',
       value: location.split('^')[0]
      })
    }
    if (year) {
      filters.push({
        columnName: 'year',
        value: year
      })
    }
    if (month) {
      filters.push({
        columnName: 'month',
        value: month
      })
    }

    const payload: any = {
      search: searchInput,
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page + 1
      },
      sort: { columnName: 'houseRentAllowance', order: type },
      "includeCentral": true
    }
    dispatch(getEmployeesWage(payload))

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
       value: location.split('^')[0]
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

    dispatch(getEmployeesWage(payload))
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
       value: location.split('^')[0]
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

    dispatch(getEmployeesWage(payload))
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  console.log('employeewasg: ', employeesWage);

  const onClickAllCheckBox = () => {
    if (selectedWage.length !== employeesWage.length) {
      const allIds = employeesWage && employeesWage.map((each: any) => each.id)
      SetSelectedWage(allIds)
    } else {
      SetSelectedWage([])
    }
  }
  const onClickIndividualCheckBox = (id: any) => {
    if (selectedWage.includes(id)) {
      const updatedSelectedWage: any = selectedWage.filter((each: any) => each != id)
      SetSelectedWage(updatedSelectedWage)
    } else {
      SetSelectedWage([...selectedWage, id])
    }
  }
  const onClickBulkDelete = () => {
    setOpenBulkDeleteModal(true)
  }

  const onClickConfirmBulkDelete = () => {
    dispatch(bulkDeleteEmployeeWage(selectedWage))
    let type = 'asc'
    setActiveSort('restricted');
    if (sortType === 'asc') {
      setSortType('desc')
      type = 'desc'
    } else {
      setSortType('asc')
    }
    setCompany('')
    setAssociateCompany('')
    setLocation('')
    setYear('')
    setMonth('')

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
       value: location.split('^')[0]
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

    const EmployeePayload: any = {
      search: searchInput,
      filters,
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page + 1
      },
      sort: { columnName: 'name', order: type },
      "includeCentral": true
    }
    dispatch(getEmployees(EmployeePayload))
  }


  useEffect(() => {
    if (bulkDeleteEmployeeWageDetails.status === 'succeeded') {
      toast.success(`EmployeeWage deleted successfully.`)
      SetSelectedWage([])
      dispatch(resetBulkDeleteHolidaysDetails())
      setOpenBulkDeleteModal(false);
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
         value: location.split('^')[0]
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
      const EmployeeDefaultPayload: any = {
        search: "",
        filters,
        pagination: {
          pageSize: 10,
          pageNumber: 1
        },
        sort: { columnName: 'name', order: 'asc' },
        "includeCentral": true
      }
      dispatch(getHolidaysList(EmployeeDefaultPayload))
    } else if (bulkDeleteEmployeeWageDetails.status === 'failed') {
      toast.error(ERROR_MESSAGES.DEFAULT);
    }
  }, [bulkDeleteEmployeeWageDetails.status])

  const onClickBackToDashboard = () => {
    navigate(`${getBasePath()}/inputUploads/dashboard`);
  }

  useEffect(() => {
    if (uploadHolidayDetails.status === 'succeeded') {
      if (uploadHolidayDetails.data.size === 0) {
        toast.success(`Holiday List Uploaded successfully.`)
        dispatch(resetUploadHolidayDetails())
        setOpenUploadModal(false)
        setUploadError(false)
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
           value: location.split('^')[0]
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
        const HolidayListDefaultPayload: any = {
          search: "",
          filters,
          pagination: {
            pageSize: 10,
            pageNumber: 1
          },
          sort: { columnName: 'name', order: 'asc' },
          "includeCentral": true
        }
        dispatch(getHolidaysList(HolidayListDefaultPayload))
      } else {
        setUploadError(true)
      }
    } else if (uploadHolidayDetails.status === 'failed') {
      toast.error(ERROR_MESSAGES.DEFAULT);
    }
  }, [uploadHolidayDetails])

  const onClickExport = () => {
    const filters = []
    if (company) {
      filters.push({
        columnName: 'companyId',
        value: company
      })
    }
    if (associateCompany) {
      filters.push({
        columnName: 'associateCompanyId',
        value: associateCompany
      })
    }
    if (location) {
      filters.push({
        columnName: 'locationId',
        value: location.split('^')[0]
      })
    }
    if (year) {
      filters.push({
        columnName: 'year',
        value: year
      })
    }
    if (month) {
      filters.push({
        columnName: 'month',
        value: month
      })
    }

    const employeesPayload: any = {
      search: searchInput,
      filters,
      pagination: null,
      sort: { columnName: "EmployeeCode", order: "asc" },
      "includeCentral": true
    }
    exportEmployeesWage({ ...employeesPayload, pagination: null });
  }


  return (
    <div style={{ height:'100vh', backgroundColor:'#ffffff'}}>

      <Modal
        open={openBulkDeleteModal}
        onClose={() => setOpenBulkDeleteModal(false)}
      >
        <Box sx={style}>
          <Box sx={{ backgroundColor: '#E2E3F8', padding: '10px', px: '20px', borderRadius: '6px', boxShadow: '0px 6px 10px #CDD2D9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ font: 'normal normal normal 32px/40px Calibri' }}>Delete Employees</Typography>
            <IconButton
              onClick={() => setOpenBulkDeleteModal(false)}
            >
              <IoMdClose />
            </IconButton>
          </Box>
          <Box sx={{ padding: '20px', backgroundColor: '#ffffff' }}>
            <Box>
              <Typography variant='h5'>There are {selectedWage.length} record(s) selected for deleting.</Typography>
              <Typography mt={2}>Are you sure you want to delete all of them ?</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
              <Button variant='outlined' color="error" onClick={() => setOpenBulkDeleteModal(false)}>No</Button>
              <Button variant='contained' onClick={onClickConfirmBulkDelete}>Yes</Button>
            </Box>
          </Box>
        </Box>
      </Modal>
      {loading ? <PageLoader>Loading...</PageLoader> : 
      
        <div>
             <Box sx={{paddingX: '20px', paddingY:'10px',}}>
                <div style={{backgroundColor:'#E2E3F8', padding:'20px', borderRadius:'6px', boxShadow: '0px 6px 10px #CDD2D9'}}>
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px', marginTop:'10px'}}>
                <h5 style={{ font: 'normal normal normal 32px/40px Calibri' }}>Employee Wage</h5>
                <div style={{ marginRight: '12px', display: 'flex', alignItems: 'center', width: '200px', justifyContent: 'space-between' }}>
                  {/* <Button onClick={onClickBackToDashboard} variant='contained'> Back To Dashboard</Button> */}
                  {
                  //   hasUserAccess(USER_PRIVILEGES.DELETE_EMPLOYEE_WAGE) &&
                  // <Button onClick={onClickBulkDelete} variant='contained' color='error' disabled={selectedWage && selectedWage.length === 0}> Bulk Delete</Button>
                   }
                  {/* <Button onClick={onClickBulkDelete} variant='contained' color='error' disabled={selectedWage && selectedWage.length === 0}> Bulk Delete</Button> */}
                        <button onClick={onClickExport} disabled={!year} style={{display:'flex', justifyContent:'center', alignItems:'center', backgroundColor: !company ? '#707070': '#ffffff' , color: !company ? '#ffffff': '#000000', border:'1px solid #000000', width:'40px', height:'30px', borderRadius:'8px'}}> <FaDownload /> </button>
                </div>
                    </div>
                    <div style={{display:'flex'}}>

                      <Box sx={{mr:1}}>
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
                                  width: 230,
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
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            maxHeight: 200,
                            width: 230,
                            // marginLeft: "21px", 
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

                      <Box sx={{ mr:1}}>
                        <Typography mb={1}>Location</Typography>
                        <FormControl sx={{ width:'100%', maxWidth:'200px',backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
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
                              return <MenuItem  sx={{whiteSpace:"initial"}} value={each.locationId+'^'+ state.id}>{`${name} (${state.code}-${cities.code}-${code})`}</MenuItem>
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
                        <FormControl sx={{ width:'100%', maxWidth:'200px',backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
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

                      <Box sx={{width:'100%', mr:1}}>
                        <Typography mb={1}>Search (Emp Code)</Typography>
                        <FormControl sx={{ width:'100%', backgroundColor:'#ffffff', borderRadius:'5px'}} size="small">
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
                employeesWage && employeesWage.length <= 0 ? 

                <Box sx={{height:'60vh', display:'flex', justifyContent:'center', alignItems:'center'}}>
                  <Typography variant='h5'>No Records Found</Typography>
                </Box>
                : 
                <>
                  <TableContainer sx={{border:'1px solid #e6e6e6', marginTop:'10px',  maxHeight:'380px', overflowY:'scroll'}}>
                          <Table stickyHeader  sx={{ minWidth: 650 }} aria-label="sticky table">
                              <TableHead sx={{'.MuiTableCell-root':{ backgroundColor:'#E7EEF7',fontWeight:'600'}}}>
                        <TableRow>
                          
                          <TableCell><Checkbox checked={(selectedWage && selectedWage.length) === (employeesWage && employeesWage.length)} onClick={onClickAllCheckBox} /></TableCell>
                                      <TableCell > <TableSortLabel active={activeSort === 'employeeCode'} direction={sortType} onClick={onClickSortCode}>Employee Code</TableSortLabel></TableCell>
                                      <TableCell > <TableSortLabel active={activeSort === 'noOfDays'} direction={sortType} onClick={onClickSortNoOfDays}>Month</TableSortLabel></TableCell>
                                      <TableCell > <TableSortLabel active={activeSort === 'leaveStartDate'} direction={sortType} onClick={onClickSortStartDate}>Present Days</TableSortLabel></TableCell>
                                      <TableCell > <TableSortLabel  direction={sortType} onClick={onClickSortEndDate}>WorkDays</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel    >Basic Wages</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel   >Basic Arrear</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel   >Fixed Gross</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel    >Gross Deduction</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel   >Gross Ded Arrear</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel    >DA </TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel   >DA Arreadr</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel    >Gross Earnings</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel   >Gross Earnings Arrear</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel    >ESi </TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel   >ESi Arrear</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel    >Conveyance Allo. </TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel   >Conveyance Arrear</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel    >HRA </TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel   >HRA Arrear</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel    >Spl Allow </TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel   >Spl Allow Arrear</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel    >Insurance </TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel    >Income Tax </TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel    >Fines </TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel    >Bonus </TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel    >OverTime </TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel    >OverTime Hrs</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel    >ProvidentFund </TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel    >Pf Arrear</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel    >Professional Tax </TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel    >Prof Tax Arrear</TableSortLabel></TableCell>
                         
                          <TableCell > <TableSortLabel    >Medical Allowance </TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel    >Net Patable </TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel    >Net Payable Arrear </TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel    >OverTime TakenDate</TableSortLabel></TableCell>
                         
                          <TableCell > <TableSortLabel    >Maternity Leave From Date</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel    >DOB Of Child</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel    >Maternity Paid Date</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel    >Maternity Advance Paid</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel    >Maternity Bonus</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel    >Cause Of Damege or Loss Date</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel    >Date Of Dedeuction Show Cause</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel    >Damage Loss Amount</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel    >No.Of Ded Installments</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel    >Date On which Ded Competed</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel    >Salary Adv Paid Date</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel    >Salary Advance</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel    >No.Of Adv Installments to be recovered</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel    >date on Adv Recovery Completed</TableSortLabel></TableCell>
                          
                          
                                      {/* <TableCell > Actions</TableCell> */}
                                  </TableRow>
                              </TableHead>

                              <TableBody>
                              {employeesWage && employeesWage.map((each: any, index: number) => (
                                  <TableRow
                                  key={each._id}
                                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >   
                                  <TableCell><Checkbox checked={selectedWage.includes(each.id)} onClick={() => onClickIndividualCheckBox(each.id)} /></TableCell>

                                      <TableCell >{each.employeeCode}</TableCell>
                                     
                                      <TableCell >{each.month}</TableCell>
                                      <TableCell >{each.presentDays}</TableCell>
                                      <TableCell >{each.workDays}</TableCell>
                                      <TableCell >{each.basicWages}</TableCell>
                                      <TableCell >{each.basicArrear}</TableCell>
                                      <TableCell >{each.fixedGross
                                      }</TableCell>
                                      <TableCell >{each.grossDeduction}</TableCell>
                                      <TableCell >{each.grossDeductionArrear}</TableCell>
                                      <TableCell >{each.dearnessAllowance}</TableCell>
                                      <TableCell >{each.dearnessArrear}</TableCell>
                                      <TableCell >{each.grossEarnings}</TableCell>
                                      <TableCell >{each.grossEarningsArrear}</TableCell>
                                      <TableCell >{each.esi}</TableCell>
                                      <TableCell >{each.esiArrear}</TableCell>
                                      <TableCell >{each.conveyanceAllowance}</TableCell>
                                      <TableCell >{each.conveyanceArreat}</TableCell>
                                      <TableCell >{each.houseRentAllowance}</TableCell>
                                      <TableCell >{each.houseRentArrear}</TableCell>
                                      <TableCell >{each.specialAllowance}</TableCell>
                                      <TableCell >{each.specialArrear}</TableCell>
                                      <TableCell >{each.insurance}</TableCell>
                                      <TableCell >{each.incomeTax}</TableCell>
                                      <TableCell >{each.fines}</TableCell>
                                      <TableCell >{each.bonus}</TableCell>
                                      <TableCell >{each.overtime}</TableCell>
                                      <TableCell >{each.overtimeHours}</TableCell>
                                      <TableCell >{each.providentFund}</TableCell>
                                      <TableCell >{each.providentFundArrear}</TableCell>
                                      <TableCell >{each.professionalTax}</TableCell>
                                      <TableCell >{each.professionTaxArrear}</TableCell>
                                      
                                      <TableCell >{each.medicalAllowance}</TableCell>
                                      <TableCell >{each.netPayable}</TableCell>
                                      <TableCell >{each.netPayableArrear}</TableCell>
                                      <TableCell >{each.overTimeTakenDate}</TableCell>
                                     
                                      <TableCell >{each.maternityLeaveFromDate}</TableCell>
                                      <TableCell >{each.dateOfBirthOfchild}</TableCell>
                                      <TableCell >{each.maternitypaidDate}</TableCell>
                                      <TableCell >{each.maternityAdvancePaid}</TableCell>
                                      <TableCell >{each.maternityBonus}</TableCell>
                                      <TableCell >{each.causeOFDamageOrLossDate}</TableCell>
                                      <TableCell >{each.dateOfDeductionShowCause}</TableCell>
                                      <TableCell >{each.damageLossAmount}</TableCell>
                                      <TableCell >{each.noofDeduction_Installmenttoberecovered}</TableCell>
                                      <TableCell >{each.dateonWhichDeductionCompleted}</TableCell>
                                      <TableCell >{each.advancePaidDate}</TableCell>
                                      <TableCell >{each.salaryAdvance}</TableCell>
                                      <TableCell >{each.noOFAdvInstallmentsToBeRecovered}</TableCell>

                                      <TableCell >{each.dateOnAdvRecoveryCompleted}</TableCell>
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
                      count={employeesWageCount}
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

export default EmployeeWageUpload