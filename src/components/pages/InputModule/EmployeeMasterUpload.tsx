import React, { useEffect } from 'react'
import { useGetCompanies } from '../../../backend/masters';
import { DEFAULT_OPTIONS_PAYLOAD } from '../../common/Table';
import { componentTypes } from '../../common/FormRenderer';
import { validatorTypes } from '@data-driven-forms/react-form-renderer';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import { getAllCompaniesDetails, getAssociateCompanies, getLocations } from '../../../redux/features/inputModule.slice';
import { Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { FaUpload, FaDownload  } from "react-icons/fa";

const EmployeeMasterUpload = () => {

  // const companies: any = []
  // const associateCompanies: any = []
  // const locations: any = []
  const years: any = []
  const months: any = []
  const dispatch = useAppDispatch();
  const companiesDetails = useAppSelector((state) => state.inputModule.companiesDetails);
  const associateCompaniesDetails = useAppSelector((state) => state.inputModule.associateCompaniesDetails);
  const locationsDetails = useAppSelector((state) => state.inputModule.locationsDetails);

  console.log('companiesDetails', companiesDetails)
  const companies = companiesDetails.data.list
  const associateCompanies = associateCompaniesDetails.data.list
  const locations = locationsDetails.data.list

  const [company, setCompany] = React.useState('');
  const [associateCompany, setAssociateCompany] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [year, setYear] = React.useState('');
  const [month, setMonth] =  React.useState('');
  
  const handleChangeCompany = (event:any) => {
    setCompany(event.target.value);
  };

  const handleChangeAssociateCompany = (event:any) => {
    setAssociateCompany(event.target.value);
  };

  const handleChangeLocation = (event:any) => {
    setLocation(event.target.value);
  };
  
  const handleChangeYear = (event:any) => {
    setYear(event.target.value);
  };
  
  const handleChangeMonth = (event:any) => {
    setMonth(event.target.value);
  };

  useEffect(() => {
    const payload:any = { ...DEFAULT_OPTIONS_PAYLOAD, filters: [{ columnName: 'isParent', value: 'true' }] }
    dispatch(getAllCompaniesDetails(payload))
  },[])

  useEffect(() => {
    const payload:any = { ...DEFAULT_OPTIONS_PAYLOAD, filters: [{ columnName: 'isParent', value: 'false' }, { columnName: 'parentCompanyId', value: company }] }
    dispatch(getAssociateCompanies(payload))
  }, [company])

  useEffect(() => {
    const payload:any ={
      ...DEFAULT_OPTIONS_PAYLOAD, filters: [
          { columnName: 'companyId', value: associateCompany }],
      sort: { columnName: 'locationName', order: 'asc' }
  }
    dispatch(getLocations(payload))
  }, [associateCompany])


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
  
  console.log("companies", companies)
  return (
    <>
      { companiesDetails.status === 'loading' ?
      (<div>loading</div>)
      :
      <div style={{height:'100vh', backgroundColor:'#ffffff', padding: '20px'}}>

        <div style={{backgroundColor:'#E2E3F8', padding:'10px', borderRadius:'6px', boxShadow:'5px 5px #ffffff'}}>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px', marginTop:'10px'}}>
                <h5 style={{marginLeft:'15px', fontWeight:'bold'}}>Employee Master</h5>
                <div style={{display:'flex', alignItems:'center', width:'170px', justifyContent: 'space-between'}}>
                  <Button variant='contained' style={{backgroundColor:'orange', display:'flex', alignItems:'center'}}> <FaUpload /> &nbsp; Upload</Button>
                  <div style={{display:'flex', justifyContent:'center', alignItems:'center', backgroundColor:'#ffffff',color:'#000000', border:'1px solid #000000', width:'40px', height:'30px', borderRadius:'8px'}}> <FaDownload /> </div>
                </div>
            </div>
            <div style={{display:'flex'}}>

              <FormControl sx={{ m: 1, width:"100%", backgroundColor:'#ffffff'}} size="small">
                <InputLabel id="demo-select-small-label">Company</InputLabel>
                <Select
                  sx={{border:'none'}}
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

              <FormControl sx={{ m: 1, width:"100%", backgroundColor:'#ffffff' }} size="small">
                <InputLabel id="demo-select-small-label">Associate Company</InputLabel>
                <Select
                  sx={{border:'none'}}
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

              <FormControl sx={{ m: 1, width:"100%", backgroundColor:'#ffffff' }} size="small">
                <InputLabel id="demo-select-small-label">Locations</InputLabel>
                <Select
                  sx={{border:'none'}}
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
                      return <MenuItem value={`${state.code}-${cities.code}-${code}`}>{`${name} (${state.code}-${cities.code}-${code})`}</MenuItem>
                  })}
                </Select>
              </FormControl>

              <FormControl sx={{ m: 1, width:"100%", backgroundColor:'#ffffff' }} size="small">
                <InputLabel id="demo-select-small-label">Year</InputLabel>
                <Select
                  sx={{border:'none'}}
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
              
              <FormControl sx={{ m: 1, width:"100%", backgroundColor:'#ffffff' }} size="small">
                <InputLabel id="demo-select-small-label">Month</InputLabel>
                <Select
                  sx={{border:'none'}}
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
               
            </div>
        </div>
      </div>
      }
    </>
  )
}

export default EmployeeMasterUpload