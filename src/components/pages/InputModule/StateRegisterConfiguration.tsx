import React, { useEffect, useState } from 'react'
import PageLoader from '../../shared/PageLoader'
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import { getActivities, getActs, getAllCompaniesDetails, getAssociateCompanies, getColumns, getForms, getLocations, getRules, getStates } from '../../../redux/features/inputModule.slice';
import { Box, Button, Drawer, FormControl, FormControlLabel, FormLabel, IconButton, InputAdornment, InputLabel, MenuItem, Modal, OutlinedInput, Radio, RadioGroup, Select as MSelect, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, TextField, Typography, Tooltip, makeStyles } from '@mui/material';
import { FaUpload, FaDownload } from "react-icons/fa";
import { IoMdAdd, IoMdClose, IoMdSearch } from "react-icons/io";
import { DEFAULT_OPTIONS_PAYLOAD, DEFAULT_PAYLOAD } from '../../common/Table';
import Icon from '../../common/Icon';
import { download, downloadFileContent, preventDefault } from '../../../utils/common';
import { ERROR_MESSAGES } from '../../../utils/constants';
import { toast } from 'react-toastify';
import { Alert } from 'react-bootstrap';
import { getLeaveConfiguration } from '../../../redux/features/leaveConfiguration.slice';
import { resetImportFileDetails,updateStateRegister,addStateRegister, getStateConfigurationDetails, getStateRegister, resetAddStateConfigDetails, resetStateConfigDetails,deleteStateRegisterMapping, exportStateRegisterMapping, resetExportFileDetails, importStateRegisterMapping } from '../../../redux/features/stateRegister.slice';
import Select from "react-select";
import { EstablishmentTypes } from '../Masters/Master.constants';
import { RxCross2 } from "react-icons/rx";
import { each } from 'underscore';
import { relative } from 'path';
import { deleteActStateMappingForm } from '../../../redux/features/Stateactruleactivitymapping.slice';



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
  height: '90vh',
  width: '97%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  // overflowY: 'hidden'// Add this if the content might overflow
  overflowY: 'scroll'
};


const deleteboxstyle = {
  position: 'absolute' as 'absolute',
  top: '25%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  
};

const customStyles = {
  control: (base: any) => ({
    ...base,
    maxHeight: 150,
    overflow: "auto"
  })
};

const StateRegisterConfiguration = () => {

  const dispatch: any = useAppDispatch();

  const stateRegisterDetails = useAppSelector((state) => state.stateRegister.stateRegisterDetails)
  // console.log('stateRegisterDetails', stateRegisterDetails)
  const formsDetails = useAppSelector((state) => state.inputModule.formsDetails)
  const statesDetails = useAppSelector((state) => state.inputModule.statesDetails)
  const stateConfigureDetails = useAppSelector((state) => state.stateRegister.stateConfigureDetails)
  const getColumnsDetails = useAppSelector((state) => state.inputModule.getColumnsDetails);
  const addStateRegisterDetails = useAppSelector((state) => state.stateRegister.addStateRegisterDetails)
  const updateStateRegisterDetails = useAppSelector((state) => state.stateRegister.updateStateRegisterDetails)
  const deleteStateRegisterMappingDetails = useAppSelector((state) => state.stateRegister.deleteStateRegisterMappingDetails)
  const exportFile = useAppSelector(state => state.stateRegister.exportFile);
  const  importStateRegisterMappingDetails = useAppSelector((state) => state.stateRegister.importStateRegisterMappingDetails);

  // console.log(formsDetails, "formsDetails")

  const stateRegister = stateRegisterDetails.data.List
  const stateRegisterCount = stateRegisterDetails.data.Count

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

  const loading = importStateRegisterMappingDetails.status === 'loading' ||   deleteStateRegisterMappingDetails.status === 'loading' ||  updateStateRegisterDetails.status === 'loading' || addStateRegisterDetails.status === 'loading' || formsDetails.status === 'loading' || stateRegisterDetails.status === 'loading' || stateConfigureDetails.status === 'loading' || getColumnsDetails.status === 'loading'

  const [stateValue, setStateValue] = React.useState('');
  const [type, setType] = React.useState('');
  const [EstablishmenttypeFilter, setEstablishmenttypeFilter] = React.useState('');

  const [registerType, setRegisterType] = React.useState('');
  const [processType, setProcessType] = React.useState<any>('');
  const [establishmentType, setEstablishmentType] = React.useState<any>('');
  const [stateName, setStateName] = React.useState<any>('');
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
  console.log(fromsList);
console.log(filteredFormsList);

  const [isHovered, setIsHovered] = React.useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);

  const [selectedstateconfigFormName,setSelectedStateConfigFormName] = React.useState('');
  const [selectedstateconfigForm,setSelectedStateConfigForm] = React.useState('');
  const [selectedstateconfigRegisterType,setSelectedStateConfigRegisterType] = React.useState('');

  // const [symbols, setSymbols] = React.useState<any>([])

  // const symbol = [', separation', '+ Addition', '- Substraction', '/ division', '* multiplication']

  const symbols = [
    { value: ',', label: ', separation' },
    { value: '+', label: '+ Addition' },
    { value: '-', label: '- Substraction' },
    { value: '/', label: '/ division' },
    { value: '*', label: '* multiplication' },
    { value: '&', label: '& Symbol' }
  ];





  const handleChangeStateValue = (event: any) => {
    setType('')
    setEstablishmenttypeFilter('');
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
    dispatch(getStateRegister(stateRegisterPayload))
  };

  const handleChangeType = (event: any) => {
    setType(event.target.value);
    setEstablishmenttypeFilter('');
    const stateRegisterPayload: any = {
      search: searchInput,
      filters: [
        {
          columnName: 'stateId',
          value: stateValue
        },
        {
          columnName: 'registerType',
          value: event.target.value
        }
      ],
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page + 1
      },
      sort: { columnName: 'StateId', order: 'asc' },
      "includeCentral": true
    }
    dispatch(getStateRegister(stateRegisterPayload))
  };

  const handleChangeEstablishmentType = (event: any) => {
    setEstablishmenttypeFilter(event.target.value);
    const stateRegisterPayload: any = {
      search: searchInput,
      filters: [
        {
          columnName: 'stateId',
          value: stateValue
        },
        {
          columnName: 'establishmentType',
          value: event.target.value
        }
       
      ],
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: page + 1
      },
      sort: { columnName: 'StateId', order: 'asc' },
      "includeCentral": true
    }
    dispatch(getStateRegister(stateRegisterPayload))
  };

  const handleChangeSearchInput = (event: any) => {
    setSearchInput(event.target.value)
  }

  const handleChangeStateName = (e: any) => {
    // dispatch(getForms({estalishmentType: establishmentType.value, stateId:  e.value}))

    const getformspayload: any = {
      search: "",
      filters: [
        {
          columnName: 'stateId',
          value: e.value
        },
        {
          columnName: 'EstablishmentType',
          value: establishmentType.value
        }
      ],
      pagination: {
        pageSize: 2000,
        pageNumber: 1
      },
      sort: { columnName: 'filePath', order: 'asc' },
      "includeCentral": true
    }

    dispatch(getForms(getformspayload))
    //   pagination: {
    //       pageSize: 20000,
    //       pageNumber: 1
    //   },
    //   filters: [{columnName: 'stateId', value: e.value},{columnName: 'EstablishmentType', value: establishmentType}],
    //   search: '',
    //   sort: { columnName: 'filePath', order: 'asc' }}
    // ))
    setStateName(e)
    setActName('')
    setRuleName('')
    setActivityName('')
    setFormName('')
  }

  const handleChangeColumnType = (event: any, fieldData: any) => {
    const newTableData = tableData.map((each: any) => {
      if (each.id === fieldData.id) {
        return { ...each, columnType: event.target.value }
      } else {
        return each
      }
    })
    setTableData(newTableData)
  }
  const [storeText, setStoreText] = useState<any>([])

  const handleChangeEzycompField = (event: any, fieldData: any) => {

    const ezycompFieldValue = getEzycompFieldById(fieldData.id);

    if (ezycompFieldValue != null) {

      const returnvalue = ezycompFieldValue + event.value;
      const newTableData = tableData.map((each: any) => {
        if (each.id === fieldData.id) {
          return { ...each, ezycompField: returnvalue }
        } else {
          return each
        }
      })
      setTableData(newTableData)
    }
    else {
      const newTableData = tableData.map((each: any) => {
        if (each.id === fieldData.id) {
          return { ...each, ezycompField: event.value }
        } else {
          return each
        }
      })
      setTableData(newTableData)

    }


  }

  const getEzycompFieldById = (id: any) => {
    const row = tableData.find((each: { id: any; }) => each.id === id);
    return row ? row.ezycompField : null;
  };

  const handleChangeopeator = (event: any, fieldData: any) => {

    // Usage
    const ezycompFieldValue = getEzycompFieldById(fieldData.id);

    const returnvalue = ezycompFieldValue + event.value;

    const newTableData = tableData.map((each: any) => {
      if (each.id === fieldData.id) {
        return { ...each, ezycompField: returnvalue }
      } else {
        return each
      }
    })
    setTableData(newTableData)
  }

  


  const handleClearEzycompField = (fieldData: any) => {

    const newTableData = tableData.map((each: any) => {
      if (each.id === fieldData.id) {
        return { ...each, ezycompField: '' };
      }
      return each;
    });
    setTableData(newTableData);

    // setSymbols(e.target.value)
  }



  const handleChangeStyle = (event: any, fieldData: any) => {
    const newTableData = tableData.map((each: any) => {
      if (each.id === fieldData.id) {
        return { ...each, style: event.target.value }
      } else {
        return each
      }
    })
    setTableData(newTableData)
  }

  const handleChangeFontName = (event: any, fieldData: any) => {
    const newTableData = tableData.map((each: any) => {
      if (each.id === fieldData.id) {
        return { ...each, fontName: event.value }
      } else {
        return each
      }
    })
    setTableData(newTableData)
  }

  const handleChangeFontSize = (event: any, fieldData: any) => {
    const newTableData = tableData.map((each: any) => {
      if (each.id === fieldData.id) {
        return { ...each, fontSize: event.target.value }
      } else {
        return each
      }
    })
    setTableData(newTableData)
  }



  const handleChangeFormula = (event: any, fieldData: any) => {
    const newTableData = tableData.map((each: any) => {
      if (each.id === fieldData.id) {
        return { ...each, formula: event.target.value }
      } else {
        return each
      }
    })
    setTableData(newTableData)
  }


  const handleChangeValueMerged = (event: any, fieldData: any) => {
    const newTableData = tableData.map((each: any) => {
      if (each.id === fieldData.id) {
        return { 
          ...each, 
          valueMerged: (event.target.value === 'Yes' ? true : false),
          valueMergedRange: "" , // Update valueMergedRange to 0 whenever valueMerged changes
          valueRowAddress : 0,
          valueColumnAddress:""

        }
      } else {
        return each
      }
    })
    setTableData(newTableData)
  }

  const handleChangeValueMergedRange = (event: any, fieldData: any) => {
    const newTableData = tableData.map((each: any) => {
      if (each.id === fieldData.id) {
        return { ...each, valueMergedRange: event.target.value }
      } else {
        return each
      }
    })
    setTableData(newTableData)
  }

  const handleChangeValueRow = (event: any, fieldData: any) => {
    // alert("handleChangeValueRow")
    // alert(event.target.value);
    const newTableData = tableData.map((each: any) => {
      if (each.id === fieldData.id) {
        return { ...each, valueRowAddress: event.target.value.trim()  }
      } else {
        return each
      }
    })
    setTableData(newTableData)
  }

  const handleChangeValueColumn = (event: any, fieldData: any) => {
    const newTableData = tableData.map((each: any) => {
      if (each.id === fieldData.id) {
        return { ...each, valueColumnAddress: event.target.value }
      } else {
        return each
      }
    })
    setTableData(newTableData)
  }

  const handleChangeComment = (event: any, fieldData: any) => {
    const newTableData = tableData.map((each: any) => {
      if (each.id === fieldData.id) {
        return { ...each, comments: event.target.value }
      } else {
        return each
      }
    })
    setTableData(newTableData)
  }


  const onchangeEzycompField =(event : any, fieldData:any) => {
    // alert("formaula hitted");
    // alert(fieldData.Id);
   
    const newTableData = selectedStateConfig.StateRegisterMappingDetails.map((each: any) => {
      if (each.Id === fieldData.Id) {
        return { ...each, EzycompField: event.target.value }
      } else {
        return each
      }
    })
    setSelectedStateConfig({
      ...selectedStateConfig,
      StateRegisterMappingDetails: newTableData
    });
  }





  ///////edit page funtcions

  const handleEditChangeColumnType = (event: any, fieldData: any) => {
    const newTableData = selectedStateConfig.StateRegisterMappingDetails.map((each: any) => {
      if (each.Id === fieldData.Id) {
        return { ...each, ColumnType: event.target.value }
      } else {
        return each
      }
    })
    setSelectedStateConfig({
      ...selectedStateConfig,
      StateRegisterMappingDetails: newTableData
    });
  }

  const getEditEzycompFieldById = (id: string) => {
   // alert('getedit'+id);
    // Assuming selectedStateConfig is properly defined and populated
    const fieldObject = selectedStateConfig.StateRegisterMappingDetails
        .find((each: { Id: string; }) => each.Id === id);
    
    if (fieldObject) {
        console.log(fieldObject); // Ensure the correct object is found
      //  alert('fieldObject.EzycompField'+fieldObject.EzycompField);
        return fieldObject.EzycompField; // Access the EzycompField property directly
    } else {
        console.log(`No matching object found for id: ${id}`);
        return ''; // Return null or handle the case where no object is found
    }
};



  const handleEditChangeEzycompField = (event: any, fieldData: any) => {
   // alert(fieldData.Id);
   const ezycompFieldValue = getEditEzycompFieldById(fieldData.Id);

   if (ezycompFieldValue != null) {

     const returnvalue = ezycompFieldValue + event.value;
      const newTableData = selectedStateConfig.StateRegisterMappingDetails.map((each: any) => {
        if (each.Id === fieldData.Id) {
          return { ...each, EzycompField: returnvalue }
        } else {
          return each
        }
      })
      setSelectedStateConfig({
        ...selectedStateConfig,
        StateRegisterMappingDetails: newTableData
      });
     // setTableData(selectedStateConfig.StateRegisterMappingDetails);
    }
    else {
      const newTableData = selectedStateConfig.StateRegisterMappingDetails.map((each: any) => {
        if (each.Id === fieldData.Id) {
          return { ...each, EzycompField: event.value }
        } else {
          return each
        }
      })
      setSelectedStateConfig({
        ...selectedStateConfig,
        StateRegisterMappingDetails: newTableData
      });
     // setTableData(selectedStateConfig.StateRegisterMappingDetails);

    }


  }
  


  const handleEditChangeopeator = (event: any, fieldData: any) => {
    const ezycompFieldValue = getEditEzycompFieldById(fieldData.Id);
    
    if (ezycompFieldValue != null) {

    const returnvalue = ezycompFieldValue + event.value;

    const newTableData = selectedStateConfig.StateRegisterMappingDetails.map((each: any) => {
      if (each.Id === fieldData.Id) {
        return { ...each, EzycompField: returnvalue }
      } else {
        return each
      }
    })
    setSelectedStateConfig({
      ...selectedStateConfig,
      StateRegisterMappingDetails: newTableData
    });
    //setTableData(selectedStateConfig.StateRegisterMappingDetails);
  }
    else {
      const newTableData = selectedStateConfig.StateRegisterMappingDetails.map((each: any) => {
        if (each.Id === fieldData.Id) {
          return { ...each, EzycompField: event.value }
        } else {
          return each
        }
      })
      setSelectedStateConfig({
        ...selectedStateConfig,
        StateRegisterMappingDetails: newTableData
      });
     // setTableData(selectedStateConfig.StateRegisterMappingDetails);
    }
  }



  const handleClearEditEzycompField = (fieldData: any) => {

    const newTableData = selectedStateConfig.StateRegisterMappingDetails.map((each: any) => {
      if (each.Id === fieldData.Id) {
        return { ...each, EzycompField: '' }
      } else {
        return each
      }
    })
    setSelectedStateConfig({
      ...selectedStateConfig,
      StateRegisterMappingDetails: newTableData
    });

  }

  const handleeditStylechange =(event : any, fieldData:any) => {

    const newTableData = selectedStateConfig.StateRegisterMappingDetails.map((each: any) => {
      if (each.Id === fieldData.Id) {
        return { ...each, Style: event.target.value }
      } else {
        return each
      }
    })
    setSelectedStateConfig({
      ...selectedStateConfig,
      StateRegisterMappingDetails: newTableData
    });

  }


  const handleeditFontnamechange =(event : any, fieldData:any) => {

    const newTableData = selectedStateConfig.StateRegisterMappingDetails.map((each: any) => {
      if (each.Id === fieldData.Id) {
        return { ...each, FontName: event.value }
      } else {
        return each
      }
    })
    setSelectedStateConfig({
      ...selectedStateConfig,
      StateRegisterMappingDetails: newTableData
    });
  }



  const handleeditFontsizechange =(event : any, fieldData:any) => {
    const newTableData = selectedStateConfig.StateRegisterMappingDetails.map((each: any) => {
      if (each.Id === fieldData.Id) {
        return { ...each, FontSize: event.target.value }
      } else {
        return each
      }
    })
    setSelectedStateConfig({
      ...selectedStateConfig,
      StateRegisterMappingDetails: newTableData
    });
  }

  const handleeditFormulachange =(event : any, fieldData:any) => {
    const newTableData = selectedStateConfig.StateRegisterMappingDetails.map((each: any) => {
      if (each.Id === fieldData.Id) {
        return { ...each, Formula: event.target.value }
      } else {
        return each
      }
    })
    setSelectedStateConfig({
      ...selectedStateConfig,
      StateRegisterMappingDetails: newTableData
    });
  }



  const handleeditChangeValueMerged = (event: any, fieldData: any) => {
    const newTableData = selectedStateConfig.StateRegisterMappingDetails.map((each: any) => {
      if (each.Id === fieldData.Id) {
        return { ...each, ValueMerged: (event.target.value === 'Yes' ? true : false), ValueMergedRange:'',ValueRowAddress:0,ValueColumnAddress:'' }
      } else {
        return each
      }
    })
    setSelectedStateConfig({
      ...selectedStateConfig,
      StateRegisterMappingDetails: newTableData
    });
  }

  const handleeditvalueMergedrangechange =(event : any, fieldData:any) => {
    const newTableData = selectedStateConfig.StateRegisterMappingDetails.map((each: any) => {
      if (each.Id === fieldData.Id) {
        return { ...each, ValueMergedRange: event.target.value }
      } else {
        return each
      }
    })
    setSelectedStateConfig({
      ...selectedStateConfig,
      StateRegisterMappingDetails: newTableData
    });
  }

  const handleeditvalueRowaddresschange =(event : any, fieldData:any) => {
    // alert("handleeditvalueRowaddresschange");
    // alert(event.target.value);
    const newTableData = selectedStateConfig.StateRegisterMappingDetails.map((each: any) => {
      if (each.Id === fieldData.Id) {
        return { ...each, ValueRowAddress: event.target.value.trim()  }
      } else {
        return each
      }
    })
    setSelectedStateConfig({
      ...selectedStateConfig,
      StateRegisterMappingDetails: newTableData
    });
  }
 

  const handleeditvalueColumnaddresschange =(event : any, fieldData:any) => {   
    const newTableData = selectedStateConfig.StateRegisterMappingDetails.map((each: any) => {
      if (each.Id === fieldData.Id) {
        return { ...each, ValueColumnAddress: event.target.value }
      } else {
        return each
      }
    })
    setSelectedStateConfig({
      ...selectedStateConfig,
      StateRegisterMappingDetails: newTableData
    });


  }

  const handleeditCommentschange =(event : any, fieldData:any) => {   
    const newTableData = selectedStateConfig.StateRegisterMappingDetails.map((each: any) => {
      if (each.Id === fieldData.Id) {
        return { ...each, Comments: event.target.value }
      } else {
        return each
      }
    })
    setSelectedStateConfig({
      ...selectedStateConfig,
      StateRegisterMappingDetails: newTableData
    });


  }



  const handleSaveEditMappingForm = () => {
  // Update selectedStateConfig.StateRegisterMappingDetails with ValueRowAddress set to '0' if it's null or empty
  const updatedStateRegisterMappingDetails = selectedStateConfig.StateRegisterMappingDetails.map((detail: any) => {
    const valueRowAddress = detail.ValueRowAddress;

    // Ensure valueRowAddress is a string and handle null/empty values
    const newValueRowAddress = valueRowAddress === null || String(valueRowAddress).trim() === "" ? "0" : String(valueRowAddress);

    return {
      ...detail,
      ValueRowAddress: newValueRowAddress
    };
  });

    setTableData(selectedStateConfig.StateRegisterMappingDetails);
    const StateRegisterMappingDetails = updatedStateRegisterMappingDetails.map((detail : any) => ({
      ezycompField: detail.EzycompField,
      columnType: detail.ColumnType,
      style: detail.Style,
      formula: detail.Formula,
      fontName: detail.FontName,
      fontSize: detail.FontSize,
      labelName: detail.LabelName,
      labelMerged: detail.LabelMerged,
      labelMergedRange: detail.LabelMergedRange,
      labelRowAddress: detail.LabelRowAddress,
      lableColumnAddress: detail.LabelColumnAddress,
      valueMerged: detail.ValueMerged,
      valueMergedRange: detail.ValueMergedRange,
      valueRowAddress: detail.ValueRowAddress === null ? 0 : detail.ValueRowAddress,
      valueColumnAddress: detail.ValueColumnAddress,
      stateRegisterConfigurationId: detail.StateRegisterConfigurationId,
      stateRegisterConfiguration: detail.StateRegisterConfiguration,
      id: detail.Id,
      createdDate: detail.CreatedDate,
      lastUpdatedDate: detail.LastUpdatedDate,
      comments : detail.Comments
    }));
  
    const payload = {
      id: selectedStateConfig.Id,
      registerType: selectedstateconfigRegisterType,
      stateId: selectedStateConfig.StateId,
      actId: selectedStateConfig.ActId,
      ruleId: selectedStateConfig.RuleId,
      activityId: selectedStateConfig.ActivityId,
      // formName: selectedStateConfig.FormName,
      formName :selectedstateconfigFormName,
      form: selectedstateconfigForm,
      headerStartRow: selectedStateConfig.HeaderStartRow,
      footerStartRow: selectedStateConfig.FooterStartRow,
      headerEndRow: selectedStateConfig.HeaderEndRow,
      footerEndRow: selectedStateConfig.FooterEndRow,
      totalRowsPerPage: selectedStateConfig.TotalRowsPerPage,
      processType: selectedStateConfig.ProcessType,
      filePath: selectedStateConfig.FilePath,
      pageSize: selectedStateConfig.PageSize,
      pageOrientation: selectedStateConfig.PageOrientation,
      StateRegisterMappingDetails: StateRegisterMappingDetails,
    };
  
    console.log(payload); // For debugging purposes
    dispatch(updateStateRegister(payload));
  };


  useEffect(() => {
    if (selectedStateConfig.FormName) {
      setSelectedStateConfigFormName(selectedStateConfig.FormName);
      setSelectedStateConfigForm(selectedStateConfig.Form)
      setSelectedStateConfigRegisterType(selectedStateConfig.RegisterType)
    }
  }, [selectedStateConfig.FormName]);
  

  console.log(selectedStateConfig);
  console.log("tabledata",tableData);

  useEffect(() => {
    const stateRegisterDefaultPayload: any = {
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
    dispatch(getStateRegister(stateRegisterDefaultPayload))
    dispatch(getStates(statesPayload))
  }, [])

  useEffect(() => {
    if (stateRegisterDetails.status === 'succeeded') {

    } else if (stateRegisterDetails.status === 'failed') {
      toast.error(ERROR_MESSAGES.DEFAULT);
    }
  }, [stateRegisterDetails.status])

  useEffect(() => {
    if (stateConfigureDetails.status === 'succeeded') {
      setShowInitialConfig(false)
      setShowConfigTable(true)
      setTableData(stateConfigureDetails.data)
      dispatch(getColumns(''))
    } else if (stateConfigureDetails.status === 'failed') {
      toast.error(ERROR_MESSAGES.DEFAULT);
    }
  }, [stateConfigureDetails.status])

  useEffect(() => {
      dispatch(getColumns(''))
  },[stateConfigureDetails])
  

 

  useEffect(() => {
    if (addStateRegisterDetails.status === 'succeeded') {
      resetStateValues()
      toast.success(`Added Successfully`)
     // alert(stateValue);
     // alert(type);
     setStateValue('');
      const stateRegisterDefaultPayload: any = {
        search: "",
        filters: [
         
        ],
        pagination: {
          pageSize: 10,
          pageNumber: 1
        },
        sort: { columnName: 'stateId', order: 'asc' },
        "includeCentral": true
      }
  console.log(stateRegisterDefaultPayload);

      dispatch(getStateRegister(stateRegisterDefaultPayload))
     
    } else if (addStateRegisterDetails.status === 'failed') {
      toast.error(ERROR_MESSAGES.DEFAULT);
    }
  }, [addStateRegisterDetails.status])

  const onClickSearch = () => {
    const filters = []
    if (stateValue) {
      filters.push({
        columnName: 'stateId',
        value: stateValue
      })
    }
    if (registerType) {
      filters.push({
        columnName: 'registerType',
        value: registerType
      })
    }
    if (EstablishmenttypeFilter) {
      filters.push({
        columnName: 'establishmentType',
        value: EstablishmenttypeFilter
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
    dispatch(getStateRegister(payload))
  }

  const onClickClearSearch = () => {
    const filters = []
    if (stateValue) {
      filters.push({
        columnName: 'stateId',
        value: stateValue
      })
    }
    if (registerType) {
      filters.push({
        columnName: 'registerType',
        value: registerType
      })
    }
    if (EstablishmenttypeFilter) {
      filters.push({
        columnName: 'establishmentType',
        value: EstablishmenttypeFilter
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
    dispatch(getStateRegister(payload))
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
    if (EstablishmenttypeFilter) {
      filters.push({
        columnName: 'establishmentType',
        value: EstablishmenttypeFilter
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
    dispatch(getStateRegister(Payload))

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
    if (EstablishmenttypeFilter) {
      filters.push({
        columnName: 'establishmentType',
        value: EstablishmenttypeFilter
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
    dispatch(getStateRegister(Payload))

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
    if (EstablishmenttypeFilter) {
      filters.push({
        columnName: 'establishmentType',
        value: EstablishmenttypeFilter
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
    dispatch(getStateRegister(Payload))

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
    if (EstablishmenttypeFilter) {
      filters.push({
        columnName: 'establishmentType',
        value: EstablishmenttypeFilter
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
    dispatch(getStateRegister(Payload))

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
    if (EstablishmenttypeFilter) {
      filters.push({
        columnName: 'establishmentType',
        value: EstablishmenttypeFilter
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
    dispatch(getStateRegister(Payload))

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
    if (EstablishmenttypeFilter) {
      filters.push({
        columnName: 'establishmentType',
        value: EstablishmenttypeFilter
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
    dispatch(getStateRegister(Payload))

  }


  const onClickAdd = () => {
    setShowInitialConfig(true)
    setOpenAddModal(true)
  }

  const onClickConfigure = () => {
   
    if (!registerType || !processType.value || !stateName || !actName || !ruleName || !activityName || !formName || !formNameValue) {
      return toast.error(ERROR_MESSAGES.FILL_ALL);
    } else {

      const payload = formName.value
      const testUrl = 'https://mafoi.s3.ap-south-1.amazonaws.com/inputtemplates/test3.xlsx'
      dispatch(getStateConfigurationDetails(payload))
    }
  }

  const onClickSave = () => {
    const updatedTableData = tableData.map((each: any) => {
      return {
        ...each,
        valueRowAddress: each.valueRowAddress === "" ? "0" : each.valueRowAddress
      };
    });

    const check = tableData.find((each: any) => each.columnType === '' || each.ezycompField === '' || each.style === '' || each.fontName === '' || each.fontSize === '' || each.formula === '')
    if (check || !registerType || !stateName || !actName || !ruleName || !activityName || !formNameValue || !formName || !headerStartRow || !headerEndRow )
      if (!registerType) {
        //return toast.error('Please Select and Fill All Fields');
      } else {
        const payload = {
          registerType,
          processType: processType.value,
          stateId: stateName.value,
          actId: actName.value,
          ruleId: ruleName.value,
          activityId: activityName.value,
          formName: formNameValue,
          form: formName.label,
          filePath: formName.value,
          headerStartRow,
          headerEndRow,
          footerStartRow,
          footerEndRow,
          totalRowsPerPage,
          pageSize,
          pageOrientation,
          stateRegisterMappings: updatedTableData
        }
        // console.log('payloda', payload)
        dispatch(addStateRegister(payload))
      }
  }


  const onclickEdit = (configDetails: any) => {
    setRegisterType(configDetails.RegisterType)
    setProcessType(configDetails.ProcessType)
    setStateName({ label: configDetails.State.Name, value: configDetails.StateId })
    setActName({ label: configDetails.Act.Name, value: configDetails.ActId })
    setRuleName({ label: configDetails.Rule.Name, value: configDetails.RuleId })
    setActivityName({ label: configDetails.Activity.Name, value: configDetails.ActivityId })
    setFormNameValue(configDetails.FormName)
    setFormName({ label: configDetails.Form, value: configDetails.Form })
    setShowInitialConfig(true)
    setOpenAddModal(true)
  }

  const onClickSubmitEdit = () => {

  }

  const onclickView = (stateConfig: any) => {
    // setSelectedStateConfig(stateConfig)
    // setOpenViewModal(true)
    
    setSelectedStateConfig(stateConfig)
    setOpenPreviewModal(true)
  
  }
  const onclickEditModelButton = (stateConfig: any) => {
    // setSelectedStateConfig(stateConfig)
    // setOpenViewModal(true)
    console.log(stateConfig);
    setSelectedStateConfig(stateConfig)
    //setTableData(stateConfig.StateRegisterMappingDetails)
    setOpenEditModal(true)
  
  }
  const onclickDeleteButton = (stateConfig: any) => {
    setSelectedStateConfig(stateConfig)
    setOpenDeleteModal(true);
  }


  console.log(columnsList);

  const handleChangePage = (event: unknown, newPage: number) => {
   // alert(stateValue);
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
    if (EstablishmenttypeFilter) {
      filters.push({
        columnName: 'establishmentType',
        value: EstablishmenttypeFilter
      })
    }
    const payload: any = {
      search: '',
      filters: [],
      pagination: {
        pageSize: rowsPerPage,
        pageNumber: newPage + 1
      },
      sort: { columnName: 'stateId', order: 'asc' },
      "includeCentral": true
    }

    dispatch(getStateRegister(payload))
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
 //   alert(stateValue);
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
    if (EstablishmenttypeFilter) {
      filters.push({
        columnName: 'establishmentType',
        value: EstablishmenttypeFilter
      })
    }
    const payload: any = {
      search: searchInput,
      filters,
      pagination: {
        pageSize: parseInt(event.target.value, 10),
        pageNumber: 1
      },
      sort: { columnName: 'stateId', order: 'asc' },
      "includeCentral": true
    }

    dispatch(getStateRegister(payload))
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

  // console.log('selecgtddd', selectedStateConfig)

  // console.log(tableData);
  // console.log("columnslist",columnsList);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setHoveredRow(null);
    setIsHovered(false);
  };

  const handleEditMouseEnter = (id:any) => {
    setHoveredRow(id);
   //setIsHovered(true);
  };

  const handleEditMouseLeave = (id:any) => {
    setHoveredRow(null);
    //setIsHovered(false);
  };

  
  const onClickConfirmDelete = () => {
    dispatch(deleteStateRegisterMapping(selectedStateConfig.Id))
  }

  useEffect(() => {
    if (deleteStateRegisterMappingDetails.status === 'succeeded') {
      toast.success(`${selectedStateConfig.Form} deleted successfully.`)
      setSelectedStateConfig('')
      dispatch(resetStateConfigDetails())
      setOpenDeleteModal(false)
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
      const stateRegisterDefaultPayload: any = {
        search: searchInput,
        filters: filters,
        pagination: {
          pageSize: 10,
          pageNumber: 1
        },
        sort: { columnName: 'stateId', order: 'asc' },
        "includeCentral": true
      }
  console.log(stateRegisterDefaultPayload);
   //  alert(stateValue);
    // alert(type);
      dispatch(getStateRegister(stateRegisterDefaultPayload))
     
    } else if (deleteStateRegisterMappingDetails.status === 'failed') {
      toast.error(ERROR_MESSAGES.DEFAULT);
    }
  }, [deleteStateRegisterMappingDetails.status])

  
  useEffect(() => {

    if (updateStateRegisterDetails.status === 'succeeded') {
      toast.success(`${selectedStateConfig.Form} Updated successfully.`)
      setSelectedStateConfig('')
      dispatch(resetStateConfigDetails())
      setOpenEditModal(false)
    
      setStateValue(stateValue);
      const filters = []
    if (stateValue) {
      filters.push({
        columnName: 'stateId',
        value: stateValue
      })
    }
    if (registerType) {
      filters.push({
        columnName: 'registerType',
        value: registerType
      })
    }
    if (EstablishmenttypeFilter) {
      filters.push({
        columnName: 'establishmentType',
        value: EstablishmenttypeFilter
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
      dispatch(getStateRegister(payload))
     
    } else if (updateStateRegisterDetails.status === 'failed') {
      toast.error(ERROR_MESSAGES.DEFAULT);
    }
  }, [updateStateRegisterDetails.status])



   const onClickConfigure2 = () => {
   // alert(formFilePath);
     setOpenAddModal(false);
     setImportExportModal(true);
    
  }

  const onClickExport = async (e:any) => {
    const payload = {
      registerType,
      processType: processType.value,
      stateId: stateName.value,
      actId: actName.value,
      ruleId: ruleName.value,
      activityId: activityName.value,
      selectedFormName : formName.label,
      formName: formNameValue,
      form: formName.label,
      filePath: formName.value,
      headerStartRow,
      headerEndRow,
      footerStartRow,
      footerEndRow,
      totalRowsPerPage,
      pageSize,
      pageOrientation,
      stateRegisterMappings: tableData
    }

    console.log(payload);
    
    preventDefault(e);
    const fileUrl = formFilePath;
    await dispatch(exportStateRegisterMapping(fileUrl)); 
    setOpenAddExport(true); 
    
  }

  const onClickExportTemplate = async (e:any) => {
 
    preventDefault(e);
    const fileUrl = formFilePath;

    // Open the URL in a new tab to download the file
    window.open(fileUrl, '_blank');
    
  }

  const onClickImport = async (e:any) => {
    setopenImportFileUploadModal(true);
  }


  useEffect(() => {
    if (exportFile.status === 'succeeded' && exportFile.data) {
        // const blob = new Blob([exportFile.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        // const link = document.createElement('a');
        // const objectURL = window.URL.createObjectURL(blob);

        // link.href = objectURL;
        // link.setAttribute('download', 'StateRegisterMappingDetails.xlsx');
        // document.body.appendChild(link);
        // link.click();
        // link.remove();
        const blob = new Blob([exportFile.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        link.href = url;
        link.setAttribute('download', 'StateRegisterMappingDetails.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        // const url = window.URL.createObjectURL(new Blob([exportFile.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
        // const link = document.createElement('a');
        // link.href = url;
        // // link.setAttribute('download', `${filename}.xlsx`);
        // link.setAttribute('download', 'StateRegisterMappingDetails.xlsx');
        // document.body.appendChild(link);
        // link.click();
        // link.remove();

        // Reset the state after download
        dispatch(resetExportFileDetails());
    }
}, [exportFile, dispatch]);


const downloadErrors = (e: any) => {
  preventDefault(e);
  // const data = importStateRegisterMappingDetails.data;
  // const blob = new Blob([data])
  // const URL = window.URL || window.webkitURL;
  // const downloadUrl = URL.createObjectURL(blob);
  // const a = document.createElement("a");
  // a.href = downloadUrl;
  // a.download = 'Errors.xlsx';
  // document.body.appendChild(a);
  // a.click();
  // document.body.removeChild(a);

  const response = importStateRegisterMappingDetails.data;

  // Ensure the response type is set to 'blob' when making the API call
  const data = response.data;
console.log(data.size);
  console.log(typeof data);
console.log(data.byteLength); // or data.length if it's an ArrayBuffer

  
  const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const link = document.createElement('a');
  const url = window.URL.createObjectURL(blob);
  link.href = url;
  link.setAttribute('download', 'Errors.xlsx');
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);



  // const data = importStateRegisterMappingDetails.data;
  // const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  // const link = document.createElement('a');
  // const url = window.URL.createObjectURL(blob);
  // link.href = url;
  // link.setAttribute('download', 'StateRegisterMappingDetails.xlsx');
  // document.body.appendChild(link);
  // link.click();
  // link.remove();
  // window.URL.revokeObjectURL(url);
}

const onClickSubmitImportUpload=()=>{

 // alert(actName);
  const formData = new FormData();
  const data = uploadImportData ? uploadImportData[0] : []
  formData.append('file', data);
  formData.append('RegisterType', registerType)
  formData.append('StateId', stateName.value)
  formData.append('ActId', actName.value)
  formData.append('RuleId', ruleName.value)
  formData.append('ActivityId', activityName.value)
  formData.append('FormName', formNameValue)
  formData.append('ProcessType', processType.value)
  formData.append('FilePath', formFilePath.value)
  formData.append('Form', formName)
  formData.append('HeaderStartRow', headerStartRow)
  formData.append('FooterStartRow', footerStartRow)
  formData.append('HeaderEndRow', headerEndRow)
  formData.append('FooterEndRow', headerEndRow)
  formData.append('TotalRowsPerPage', totalRowsPerPage)
  formData.append('PageSize', pageSize)
  formData.append('PageOrientation', pageOrientation)
  console.log(formData);
  setHeaderEndRow('');
  setHeaderStartRow('');
  setFooterEndRow('');
  setFooterStartRow('');

  setTotalRowsPerPage('');
setPageOrientation('');
setPageSize('');
  dispatch(importStateRegisterMapping(formData))
 
}




useEffect(() => {
  if(importStateRegisterMappingDetails.status === 'succeeded'){

    const response = importStateRegisterMappingDetails.data;

    // Ensure the response type is set to 'blob' when making the API call
    const data = response.data;
    console.log(data.size);
    if (data.size === 0) {
    toast.success("Mapping Done SUccessfully");
    dispatch(resetImportFileDetails());
    setopenImportFileUploadModal(false);
    setOpenAddExport(false);
    setOpenAddModal(false);
    setImportExportModal(false);
    setRegisterType('')
    setProcessType('')
    setEstablishmentType('')
    setStateName('')
    setActName('')
    setRuleName('')
    setActivityName('')
    setFormName('')
    setFormNameValue('')
    const stateRegisterDefaultPayload: any = {
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
    dispatch(getStateRegister(stateRegisterDefaultPayload))
    dispatch(getStates(statesPayload))
  }
  else {
    setUploadError(true)
    setUploadImportData({})
  }
  }else if (importStateRegisterMappingDetails.status === 'failed'){
    toast.error(ERROR_MESSAGES.DEFAULT);
  }
}, [importStateRegisterMappingDetails.status])

  return (
    <div style={{ height: '100vh', backgroundColor: '#ffffff' }}>
      {/* ImportUploadModal */}
      <Modal
        open={openImportFileUploadModal}
        onClose={() => { setopenImportFileUploadModal(false); setUploadError(false); setUploadImportData(null) }}
      >
        <Box sx={styleUploadModal}>
          <Box sx={{ backgroundColor: '#E2E3F8', padding: '10px', px: '20px', borderRadius: '6px', boxShadow: '0px 6px 10px #CDD2D9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ font: 'normal normal normal 32px/40px Calibri' }}>Upload Mapping File</Typography>
            <IconButton
              onClick={() => { setopenImportFileUploadModal(false); setUploadError(false); setUploadImportData(null) }}
            >
              <IoMdClose />
            </IconButton>
          </Box>

          {uploadError &&
            <Alert variant="danger" className="mx-4 my-4">
              There are few errors identified in the file uploaded. Correct the errors and upload again. <a href="/" onClick={downloadErrors}>Click here</a> to download the errors.
            </Alert>
          }
          <Box sx={{ padding: '20px', backgroundColor: '#ffffff', display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography mb={1} color={'#0F67B1'} fontWeight={'bold'} sx={{ font: 'normal normal normal 24px/28px Calibri' }}>Upload File <span style={{ color: 'red' }}>*</span></Typography>
              <input
                style={{ border: '1px solid #0F67B1', width: '500px', height: '40px', borderRadius: '5px' }}
                type="file"
                accept='.xlsx, .xls, .csv'
                onClick={(e: any) => e.target.value = ''}
                onChange={(e) => { console.log('chandeeddd', e.target.files); setUploadImportData(e.target.files) }}
              />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 5 }}>
            <Button variant='contained' disabled={!uploadImportData} onClick={onClickSubmitImportUpload}>Submit</Button>
          </Box>

          <Box sx={{ display: 'flex', padding: '20px', borderTop: '1px solid #6F6F6F', justifyContent: 'flex-end', alignItems: 'center', mt: 4 }}>
            <Button variant='contained' sx={{ backgroundColor: '#707070' }} onClick={() => { setopenImportFileUploadModal(false); setUploadError(false); setUploadImportData(null) }}>Cancel</Button>
          </Box>
        </Box>
      </Modal>

      {/* Import / Export Modal */}
       <Modal
        open={openImportExportModal}
        onClose={() => { setImportExportModal(false); resetStateValues() }}
      >

        <Box sx={style}>

          <Box sx={{ backgroundColor: '#E2E3F8', padding: '10px', px: '20px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ font: 'normal normal normal 32px/40px Calibri' }}>Excel Configure</Typography>
            <IconButton
              onClick={() => { setImportExportModal(false); resetStateValues() }}
            >
              <IoMdClose />
            </IconButton>
          </Box>
          <Box>
            <Button variant='contained' sx={{ margin: 2 }} onClick={onClickExport}>Export Mapping File</Button>
            <Button variant='contained' sx={{ margin: 2 }} onClick={onClickExportTemplate}>Export  Template</Button>
            {openAddExport &&
              <Box>
              
              <Box sx={{ display: 'flex' }} >
                <FormControl sx={{ m: 1, width: "100%", backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                  <FormLabel id="demo-select-small-label" sx={{ color: '#000000' }}>Header Start Row</FormLabel>
                  <OutlinedInput
                    sx={{
                      '& input::placeholder': {
                        fontSize: '14px'
                      }
                    }}
                    placeholder='Header Start Row'
                    value={headerStartRow}
                    onChange={(e) => setHeaderStartRow(e.target.value)}
                    id="outlined-adornment-name"
                    type='number'
                  />
                </FormControl>

                <FormControl sx={{ m: 1, width: "100%", backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                  <FormLabel id="demo-select-small-label" sx={{ color: '#000000' }}>Header End Row</FormLabel>
                  <OutlinedInput
                    sx={{
                      '& input::placeholder': {
                        fontSize: '14px'
                      }
                    }}
                    placeholder='Header End Row'
                    value={headerEndRow}
                    onChange={(e) => setHeaderEndRow(e.target.value)}
                    id="outlined-adornment-name"
                    type='number'
                  />
                </FormControl>

                <FormControl sx={{ m: 1, width: "100%", backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                  <FormLabel id="demo-select-small-label" sx={{ color: '#000000' }}>Footer Start Row</FormLabel>
                  <OutlinedInput
                    sx={{
                      '& input::placeholder': {
                        fontSize: '14px'
                      }
                    }}
                    placeholder='Footer Start Row'
                    value={footerStartRow}
                    onChange={(e) => setFooterStartRow(e.target.value)}
                    id="outlined-adornment-name"
                    type='number'
                  />
                </FormControl>

                <FormControl sx={{ m: 1, width: "100%", backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                  <FormLabel id="demo-select-small-label" sx={{ color: '#000000' }}>Footer End Row</FormLabel>
                  <OutlinedInput
                    sx={{
                      '& input::placeholder': {
                        fontSize: '14px'
                      }
                    }}
                    placeholder='Footer End Row'
                    value={footerEndRow}
                    onChange={(e) => setFooterEndRow(e.target.value)}
                    id="outlined-adornment-name"
                    type='number'
                  />
                </FormControl>

                <FormControl sx={{ m: 1, width: "100%", backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                  <FormLabel id="demo-select-small-label" sx={{ color: '#000000' }}>Total Rows Per Page</FormLabel>
                  <OutlinedInput
                    sx={{
                      '& input::placeholder': {
                        fontSize: '14px'
                      }
                    }}
                    placeholder='Total Rows Per Page'
                    value={totalRowsPerPage}
                    onChange={(e) => setTotalRowsPerPage(e.target.value)}
                    id="outlined-adornment-name"
                    type='number'
                  />
                </FormControl>

                <FormControl sx={{ m: 1, width: "100%", backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                  <FormLabel sx={{ color: '#000000' }}>Page Size</FormLabel>
                  <MSelect
                    value={pageSize}
                    displayEmpty
                    onChange={(e) => { setPageSize(e.target.value) }}
                  >
                    <MenuItem disabled sx={{ display: 'none' }} value="">
                      Select
                    </MenuItem>
                    {['A4', 'A6'].map((each: any) => {
                      return <MenuItem value={each}>{each}</MenuItem>
                    })}
                  </MSelect>
                </FormControl>

                <FormControl sx={{ m: 1, width: "100%", backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                  <FormLabel sx={{ color: '#000000' }}>Page Orientation</FormLabel>
                  <MSelect
                    value={pageOrientation}
                    displayEmpty
                    onChange={(e) => { setPageOrientation(e.target.value) }}
                  >
                    <MenuItem disabled sx={{ display: 'none' }} value="">
                      Select
                    </MenuItem>
                    {['LandScape', 'Portrait'].map((each: any) => {
                      return <MenuItem value={each}>{each}</MenuItem>
                    })}
                  </MSelect>
                </FormControl>

              </Box>
              <Button variant='contained' sx={ {margin: 2}} onClick={onClickImport}>Import</Button>
              </Box>
            
            }
        
            </Box>
          </Box>
</Modal>

      {/** Add Configure modal */}
      <Modal
        open={openAddModal}
        onClose={() => { setOpenAddModal(false); resetStateValues() }}
      >

        <Box sx={style}>

          <Box sx={{ backgroundColor: '#E2E3F8', padding: '10px', px: '20px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ font: 'normal normal normal 32px/40px Calibri' }}>Configure Register</Typography>
            <IconButton
              onClick={() => { setOpenAddModal(false); resetStateValues() }}
            >
              <IoMdClose />
            </IconButton>
          </Box>

          <Box sx={{ height: '100vh' }}>
            {showInitialConfig && <Box sx={{ padding: '20px', backgroundColor: '#ffffff', }}>

              <Box sx={{ display: 'flex' }}>
                <FormControl sx={{ m: 1, width: "100%", backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                  <FormLabel sx={{ color: '#000000' }}>Register Type</FormLabel>
                  <MSelect
                    value={registerType}
                    displayEmpty
                    onChange={(e) => { setRegisterType(e.target.value) }}
                  >
                    <MenuItem disabled sx={{ display: 'none' }} value="">
                      Select
                    </MenuItem>
                    {['State', 'Central'].map((each: any) => {
                      return <MenuItem value={each}>{each}</MenuItem>
                    })}
                  </MSelect>
                </FormControl>

                <FormControl sx={{ m: 1, width: "100%", backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                  <FormLabel sx={{ color: '#000000' }}>Process Type</FormLabel>
                  <Select
                    options={['Attendance', 'Employee', 'Leave', 'Wage'].map((each: any) => { return { label: each, value: each } })}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    value={processType}
                    styles={customStyles}
                    onChange={(e: any) => { setProcessType(e) }}
                  />
                </FormControl>

                <FormControl sx={{ m: 1, width: "100%", backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                  <FormLabel sx={{ color: '#000000' }}>Establishment Type</FormLabel>
                  <Select
                    options={EstablishmentTypes.map((each: any) => { return { label: each, value: each } })}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    value={establishmentType}
                    styles={customStyles}
                    onChange={(e: any) => { setEstablishmentType(e) }}
                  />
                </FormControl>

                <FormControl sx={{ m: 1, width: "100%", backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                  <FormLabel sx={{ color: '#000000' }}>State</FormLabel>
                  <Select
                    isDisabled={!establishmentType}
                    options={statesList && statesList.map((each: any) => { return { label: each.name, value: each.id } })}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    value={stateName}
                    styles={customStyles}
                    onChange={(e: any) => { handleChangeStateName(e) }}
                  />
                </FormControl>

              </Box>

              <FormControl sx={{ m: 1, width: "100%", backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                <FormLabel sx={{ color: '#000000' }}>Act &&  (ActivityName)</FormLabel>
                <Select
                  isDisabled={!stateName}
                  options={filteredFormsList && filteredFormsList.map((each: any) => { return { label: each.actRuleActivityMapping.act.name + "(" + each.actRuleActivityMapping.activity.name + ")", value: each.actRuleActivityMapping.act.id } })}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  value={actName}
                  styles={customStyles}
                  onChange={(e: any) => { setActName(e); setRuleName(''); setActivityName(''); setFormName('') }}
                />
              </FormControl>

              <FormControl sx={{ m: 1, width: "100%", backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                <FormLabel sx={{ color: '#000000' }}>Rule</FormLabel>
                <Select
                  isDisabled={!actName}
                  options={filteredFormsList && filteredFormsList.filter((each: any) => each.actRuleActivityMapping.actId === actName.value).map((each: any) => { return { label: each.actRuleActivityMapping.rule.name + ", (Section No. " + each.actRuleActivityMapping.rule.sectionNo + ", Rule No. " + each.actRuleActivityMapping.rule.ruleNo + ")", value: each.actRuleActivityMapping.rule.id } })}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  value={ruleName}
                  styles={customStyles}
                  onChange={(e: any) => { setRuleName(e); setActivityName(''); setFormName('') }}
                />
              </FormControl>

              <FormControl sx={{ m: 1, width: "100%", backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                <FormLabel sx={{ color: '#000000' }}>Activity</FormLabel>
                <Select
                  isDisabled={!ruleName}
                  options={filteredFormsList && filteredFormsList.filter((each: any) => each.actRuleActivityMapping.actId === actName.value && each.actRuleActivityMapping.ruleId === ruleName.value).map((each: any) => { return { label: each.actRuleActivityMapping.activity.name, value: each.actRuleActivityMapping.activity.id } })}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  value={activityName}
                  styles={customStyles}
                  onChange={(e: any) => { setActivityName(e); setFormName('') }}
                />
              </FormControl>

              <FormControl sx={{ m: 1, width: "100%", backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                <FormLabel sx={{ color: '#000000' }}>Form</FormLabel>
                <Select
                  isDisabled={!activityName}
                  options={filteredFormsList && filteredFormsList.filter((each: any) => each.actRuleActivityMapping.actId === actName.value && each.actRuleActivityMapping.ruleId === ruleName.value && each.actRuleActivityMapping.activityId === activityName.value).map((each: any) => { return { label: each.formName, value: each.filePath } })}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  value={formName}
                  styles={customStyles}
                  onChange={(e: any) => { setFormName(e) , setFormFilePath(e.value)}}
                />
              </FormControl>

              <FormControl sx={{ m: 1, width: "100%", backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                <FormLabel id="demo-radio-buttons-group-label" sx={{ color: '#000000' }}>Form Name</FormLabel>
                <OutlinedInput
                  sx={{
                    '& input::placeholder': {
                      fontSize: '14px'
                    }
                  }}
                  placeholder='Form Name'
                  value={formNameValue}
                  onChange={(e) => setFormNameValue(e.target.value)}
                  id="outlined-adornment-name"
                  type='text'
                />  
              </FormControl>

              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <Button variant='contained' onClick={onClickConfigure}  disabled={(!registerType || !processType || !establishmentType || !stateName || !ruleName || !activityName ||!formName ||!formNameValue) }>Configure-UI</Button>
                <Button variant='contained' sx={ {marginLeft: 10}} onClick={onClickConfigure2} disabled={(!registerType || !processType || !establishmentType || !stateName || !ruleName || !activityName ||!formName ||!formNameValue) }>Configure-Excel</Button>
              </Box>
            </Box>}

            <Box>
              {showConfigTable && tableData && tableData.length > 0 &&
                <Box sx={{ paddingX: '20px', display: 'flex', flexDirection: 'column', maxHeight: '77vh', overflowY: 'scroll' }}>

                  <Box>

                    <Box sx={{ display: 'flex' }}>
                      <FormControl sx={{ m: 1, width: "100%", backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                        <FormLabel id="demo-select-small-label" sx={{ color: '#000000' }}>Header Start Row</FormLabel>
                        <OutlinedInput
                          sx={{
                            '& input::placeholder': {
                              fontSize: '14px'
                            }
                          }}
                          placeholder='Header Start Row'
                          value={headerStartRow}
                          onChange={(e) => setHeaderStartRow(e.target.value)}
                          id="outlined-adornment-name"
                          type='number'
                        />
                      </FormControl>

                      <FormControl sx={{ m: 1, width: "100%", backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                        <FormLabel id="demo-select-small-label" sx={{ color: '#000000' }}>Header End Row</FormLabel>
                        <OutlinedInput
                          sx={{
                            '& input::placeholder': {
                              fontSize: '14px'
                            }
                          }}
                          placeholder='Header End Row'
                          value={headerEndRow}
                          onChange={(e) => setHeaderEndRow(e.target.value)}
                          id="outlined-adornment-name"
                          type='number'
                        />
                      </FormControl>

                      <FormControl sx={{ m: 1, width: "100%", backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                        <FormLabel id="demo-select-small-label" sx={{ color: '#000000' }}>Footer Start Row</FormLabel>
                        <OutlinedInput
                          sx={{
                            '& input::placeholder': {
                              fontSize: '14px'
                            }
                          }}
                          placeholder='Footer Start Row'
                          value={footerStartRow}
                          onChange={(e) => setFooterStartRow(e.target.value)}
                          id="outlined-adornment-name"
                          type='number'
                        />
                      </FormControl>

                      <FormControl sx={{ m: 1, width: "100%", backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                        <FormLabel id="demo-select-small-label" sx={{ color: '#000000' }}>Footer End Row</FormLabel>
                        <OutlinedInput
                          sx={{
                            '& input::placeholder': {
                              fontSize: '14px'
                            }
                          }}
                          placeholder='Footer End Row'
                          value={footerEndRow}
                          onChange={(e) => setFooterEndRow(e.target.value)}
                          id="outlined-adornment-name"
                          type='number'
                        />
                      </FormControl>

                      <FormControl sx={{ m: 1, width: "100%", backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                        <FormLabel id="demo-select-small-label" sx={{ color: '#000000' }}>Total Rows Per Page</FormLabel>
                        <OutlinedInput
                          sx={{
                            '& input::placeholder': {
                              fontSize: '14px'
                            }
                          }}
                          placeholder='Total Rows Per Page'
                          value={totalRowsPerPage}
                          onChange={(e) => setTotalRowsPerPage(e.target.value)}
                          id="outlined-adornment-name"
                          type='number'
                        />
                      </FormControl>

                      <FormControl sx={{ m: 1, width: "100%", backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                        <FormLabel sx={{ color: '#000000' }}>Page Size</FormLabel>
                        <MSelect
                          value={pageSize}
                          displayEmpty
                          onChange={(e) => { setPageSize(e.target.value) }}
                        >
                          <MenuItem disabled sx={{ display: 'none' }} value="">
                            Select
                          </MenuItem>
                          {['A4', 'A6'].map((each: any) => {
                            return <MenuItem value={each}>{each}</MenuItem>
                          })}
                        </MSelect>
                      </FormControl>

                      <FormControl sx={{ m: 1, width: "100%", backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                        <FormLabel sx={{ color: '#000000' }}>Page Orientation</FormLabel>
                        <MSelect
                          value={pageOrientation}
                          displayEmpty
                          onChange={(e) => { setPageOrientation(e.target.value) }}
                        >
                          <MenuItem disabled sx={{ display: 'none' }} value="">
                            Select
                          </MenuItem>
                          {['LandScape', 'Portrait'].map((each: any) => {
                            return <MenuItem value={each}>{each}</MenuItem>
                          })}
                        </MSelect>
                      </FormControl>

                    </Box>

                  </Box>

                  {tableData && tableData.length <= 0 ?
                    <Box sx={{ height: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <Typography variant='h5'>No Records Found</Typography>
                    </Box>
                    :
                    <>
                      <TableContainer sx={{ border: '1px solid #e6e6e6', marginTop: '10px', marginBottom: '10px', minHeight: '400px', maxHeight: '550px', overflowY: 'scroll' }}>
                        <Table stickyHeader sx={{ minWidth: 650 }} aria-label="sticky table">
                          <TableHead sx={{ '.MuiTableCell-root': { backgroundColor: '#E7EEF7' } }}>
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
                              <TableCell > Formula</TableCell>
                              <TableCell > Value Merged</TableCell>
                              <TableCell > Value Merged Range </TableCell>
                              <TableCell > Value Row Address </TableCell>
                              <TableCell > Value Column Address </TableCell>
                              <TableCell > Comments </TableCell>
                            </TableRow>
                          </TableHead>

                          <TableBody>

                            {tableData && tableData.map((each: any, index: number) => (
                              <TableRow
                                key={index}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                              >
                                <TableCell >{index + 1}</TableCell>
                                <TableCell >{each.labelName}</TableCell>
                                <TableCell >{each.labelMerged ? "Yes" : "No"}</TableCell>
                                <TableCell >{each.labelMergedRange ? each.labelMergedRange : 'NA'}</TableCell>
                                <TableCell >{!each.labelMerged ? each.labelRowAddress : 'NA'}</TableCell>
                                <TableCell >{!each.labelMerged ? each.lableColumnAddress : 'NA'}</TableCell>

                                {/** Column Type */}
                                <TableCell >
                                  <FormControl sx={{ m: 1, width: "100%", maxWidth: '120px', backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                                    <MSelect
                                      value={each.columnType ? each.columnType : ''}
                                      displayEmpty
                                      onChange={(e) => { handleChangeColumnType(e, each) }}
                                    >
                                      <MenuItem disabled sx={{ display: 'none' }} value="">
                                        Select Column type
                                      </MenuItem>
                                      {['Header', 'Footer', 'Detail', 'Formula'].map((each: any) => {
                                        return <MenuItem value={each}>{each}</MenuItem>
                                      })}
                                    </MSelect>
                                  </FormControl>
                                </TableCell>

                                {/** Ezycomp Field */}
                                <TableCell sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                  <FormControl sx={{
                                    m: 1, width: "100%", minWidth: '200px', backgroundColor: '#ffffff', borderRadius: '5px', display: 'flex',
                                    flexDirection: 'row'
                                  }} size="small">

                                    <Select
                                      options={columnsList ? columnsList.map((each: any) => { return { label: each, value: each } }) : []}
                                      className="basic-multi-select"
                                      classNamePrefix="select"
                                      value={each.ezycompField ? { label: each.ezycompField, value: each.ezycompField } : ''}
                                      styles={{
                                        control: (base: any) => ({
                                          ...base,
                                          maxHeight: 150,
                                          overflow: "auto",
                                          width: '200px'
                                        })
                                      }}
                                      onChange={(e) => handleChangeEzycompField(e, each)}

                                    />
                                
                                    <Select
                                      options={symbols ? symbols.map((each: any) => { return { label: each.label, value: each.value } }) : []}
                                      className=""
                                      classNamePrefix="select"
                                      value={each.value ? { label: each.label, value: each.value } : ''}

                                      id="demo-simple-select-autowidth"
                                      styles={{
                                        control: (base: any) => ({
                                          ...base,
                                          maxHeight: 150,
                                          overflow: "auto",
                                          width: '100px'
                                        })
                                      }}
                                      onChange={(e) => handleChangeopeator(e, each)}

                                    />
                                    

                                    {/*                                             
                                            <MSelect displayEmpty value={symbols} onClick={handleOnchangeSymbol}>
                                              {symbols.map((each: any) => {
                                                return <MenuItem value={each.value} key = {each.id}>{each.label}</MenuItem>
                                              })}
                                            </MSelect> */}

                                  </FormControl>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>

                                    <Tooltip
                                       key={each.Id}
                                      title={each.ezycompField} // Tooltip content is set to the ezycompField value
                                      //open={isHovered}
                                      open={hoveredRow === each.Id}
                                      disableFocusListener
                                      disableTouchListener
                                      placement="top"
                                      arrow
                                      PopperProps={{
                                        sx: {
                                          '& .MuiTooltip-tooltip': {
                                            backgroundColor: 'blue', // Change to your desired background color
                                            color: 'white', // Change to your desired text color
                                            fontSize: '16px', // Change to your desired font size
                                          },
                                          '& .MuiTooltip-arrow': {
                                            color: 'blue', // Ensure the arrow color matches the tooltip background
                                          },
                                        },
                                      }}
                                    >
                                      <TextField
                                        size="small"
                                        value={each.ezycompField}
                                        id={`textfield-${each.Id}`}
                                        sx={{
                                          // width: '100%', // Adjust width as needed
                                          width: '250px',
                                          fontSize: each.ezycompField.length > 20 ? '0.75rem' : '0.875rem', // Example condition for font size adjustment
                                          transition: 'font-size 0.3s ease-out', // Smooth transition for font size change
                                          '&:hover': {
                                            fontSize: '1rem', // Increase font size on hover
                                          },
                                          
                                        }}
                                        onMouseEnter={() => handleEditMouseEnter(each.Id)}
                                        onMouseLeave={handleMouseLeave}
                                      />
                                    </Tooltip>


                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                      {/* <Button>Add</Button> */}
                                      <Button> <RxCross2 onClick={() => handleClearEzycompField(each)} /> </Button>
                                    </Box>
                                  </Box>
                                </TableCell>

                                {/** Style */}
                                <TableCell >
                                  <FormControl sx={{ m: 1, width: "100%", maxWidth: '120px', backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                                    <MSelect
                                      value={each.style ? each.style : ''}
                                      displayEmpty
                                      onChange={(e) => { handleChangeStyle(e, each) }}
                                    >
                                      <MenuItem disabled sx={{ display: 'none' }} value="">
                                        Select Style
                                      </MenuItem>
                                      {['Bold', 'Italic', 'Underline'].map((each: any) => {
                                        return <MenuItem value={each}>{each}</MenuItem>
                                      })}
                                    </MSelect>
                                  </FormControl>
                                </TableCell>

                                {/** Font Name */}
                                <TableCell >
                                  <FormControl sx={{ m: 1, width: "100%", maxWidth: '190px', minWidth: '120px', backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                                    <Select
                                      options={fontList.map((each: any) => { return { label: each, value: each } })}
                                      className="basic-multi-select"
                                      classNamePrefix="select"
                                      value={each.fontName ? { label: each.fontName, value: each.fontName } : ''}
                                      styles={customStyles}
                                      onChange={(e) => handleChangeFontName(e, each)}
                                    />
                                  </FormControl>
                                </TableCell>

                                {/** Font Size */}
                                <TableCell >
                                  <FormControl sx={{ m: 1, width: "100%", maxWidth: '190px', minWidth: '70px', backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                                    <OutlinedInput
                                      sx={{
                                        '& input::placeholder': {
                                          fontSize: '14px'
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

                                {/** Formula */}
                                <TableCell >
                                  <FormControl sx={{ m: 1, width: "100%", maxWidth: '190px', minWidth: '160px', backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                                    <OutlinedInput
                                      sx={{
                                        '& input::placeholder': {
                                          fontSize: '14px'
                                        }
                                      }}
                                      type='text'
                                      placeholder='Formula'
                                      value={each.formula ? each.formula : ''}
                                      onChange={(e) => handleChangeFormula(e, each)}
                                      id="outlined-adornment-name"
                                    />
                                  </FormControl>
                                </TableCell>

                                {/** Value Merged */}
                                <TableCell >
                                  <FormControl sx={{ m: 1, width: "100%", maxWidth: '120px', backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                                    <MSelect
                                      value={each.valueMerged ? "Yes" : "No"}
                                      displayEmpty
                                      onChange={(e) => { handleChangeValueMerged(e, each) }}
                                    >
                                      <MenuItem disabled sx={{ display: 'none' }} value="">
                                        Select Value Merged
                                      </MenuItem>
                                      {['Yes', 'No'].map((each: any) => {
                                        return <MenuItem value={each}>{each}</MenuItem>
                                      })}
                                    </MSelect>
                                  </FormControl>
                                </TableCell>

                                {/** Value Merged Range*/}
                                <TableCell >
                                  <FormControl sx={{ m: 1, width: "100%", maxWidth: '190px', minWidth: '120px', backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                                    <OutlinedInput
                                      sx={{
                                        '& input::placeholder': {
                                          fontSize: '14px'
                                        },
                                        backgroundColor: !each.valueMerged ? '#EBEBE4' : '#ffffff'
                                      }}
                                      placeholder='Value Merged Range'
                                      disabled={!each.valueMerged}
                                      value={each.valueMergedRange ? each.valueMergedRange : ''}
                                      onChange={(e) => handleChangeValueMergedRange(e, each)}
                                      id="outlined-adornment-name"
                                      type='text'
                                    />
                                  </FormControl>
                                </TableCell>

                                {/** Value Row Address*/}
                                <TableCell >
                                  <FormControl sx={{ m: 1, width: "100%", maxWidth: '190px', minWidth: '120px', backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                                    <OutlinedInput
                                      sx={{
                                        '& input::placeholder': {
                                          fontSize: '14px'
                                        },
                                        backgroundColor: each.valueMerged ? '#EBEBE4' : '#ffffff'
                                      }}
                                      disabled={each.valueMerged}
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
                                  <FormControl sx={{ m: 1, width: "100%", maxWidth: '190px', minWidth: '120px', backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                                    <OutlinedInput
                                      sx={{
                                        '& input::placeholder': {
                                          fontSize: '14px'
                                        },
                                        backgroundColor: each.valueMerged ? '#EBEBE4' : '#ffffff'
                                      }}
                                      disabled={each.valueMerged}
                                      placeholder='Value Column'
                                      value={each.valueColumnAddress ? each.valueColumnAddress : ''}
                                      onChange={(e) => handleChangeValueColumn(e, each)}
                                      id="outlined-adornment-name"
                                      type='text'
                                    />
                                  </FormControl>
                                </TableCell>


                                  {/** Comments */}
                                  <TableCell >
                                  <FormControl sx={{ m: 1, width: "100%", maxWidth: '190px', minWidth: '120px', backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                                    <OutlinedInput
                                      sx={{
                                        '& input::placeholder': {
                                          fontSize: '14px'
                                        }
                                      }}
                                      type='text'
                                      placeholder='Comments'
                                      value={each.comments ? each.comments : ''}
                                      onChange={(e) => handleChangeComment(e, each)}
                                      id="outlined-adornment-name"
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
              <TableRow sx = {{position: 'sticky', bottom: 0}}>
                  {showConfigTable &&  <Button  sx={{ ml: 2, marginTop: '10px', marginBottom: '10px', alignSelf: 'flex-end', width: '200px' }} variant='contained' onClick={onClickSave}>Save</Button> }
              </TableRow>
              {/* {showConfigTable && <Button sx={{ ml: 2, marginTop: '10px', marginBottom: '10px', alignSelf: 'flex-end', width: '200px' }} variant='contained' onClick={onClickSave}>Save</Button>} */}
            </Box>
          </Box>

        </Box>

      </Modal>



      
      {/* Preview Modal */}
      <Modal
        open={openPreviewModal}
        onClose={() => {setOpenPreviewModal(false); setSelectedStateConfig({})}}
      >

        <Box sx={style}> 
          <Box sx={{ backgroundColor: '#E2E3F8', padding: '10px', px: '20px', borderRadius: '6px', boxShadow: '0px 6px 10px #CDD2D9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{display: "flex", flexDirection: "column"}}>
            <Typography sx={{ font: 'normal normal normal 32px/40px Calibri' }}> {selectedStateConfig.Form }  </Typography>
           
        
          
             
            </Box>
            

            
              <IconButton
                onClick={() => {setOpenPreviewModal(false); setSelectedStateConfig({})}}
              >
                <IoMdClose />
              </IconButton>
            </Box>
          

            <Box sx={{paddingX: '20px', display: 'flex', flexDirection:'column'}}>
              {
                selectedStateConfig.StateRegisterMappingDetails && selectedStateConfig.StateRegisterMappingDetails.length <= 0 ? 

                <Box sx={{height:'60vh', display:'flex', justifyContent:'center', alignItems:'center'}}>
                  <Typography variant='h5'>No Records Found</Typography>
                </Box>
                : 
                <>
                  <TableContainer sx={{border:'1px solid #e6e6e6', marginTop:'10px', maxHeight:'550px', overflowY:'scroll'}}>
                          <Table stickyHeader  sx={{ minWidth: 650 }} aria-label="sticky table">
                              <TableHead sx={{'.MuiTableCell-root':{ backgroundColor:'#E7EEF7'}}}>
                                  <TableRow>
                                      <TableCell > S.no</TableCell>
                                      <TableCell> Column Type</TableCell>
                                      <TableCell > LabelName</TableCell>
                                      <TableCell > LabelColumn</TableCell>
                                      <TableCell > LabelRow </TableCell>
                                      <TableCell > LabelMergedRange</TableCell>
                                      <TableCell sx={{ maxWidth: 200, wordWrap: 'break-word' }} > EzyCompField</TableCell>
                                      <TableCell > Formula</TableCell>
                                      <TableCell > ValueColumn</TableCell>
                                      <TableCell > ValueRow</TableCell>
                                      <TableCell > ValueMergedRange</TableCell>
                                      <TableCell > Style</TableCell>
                                      <TableCell > FontName</TableCell>
                                      <TableCell > FontSize</TableCell>
                                      <TableCell > Comments</TableCell>

                                      

                                  </TableRow>
                              </TableHead>

                              <TableBody>

                              {selectedStateConfig.StateRegisterMappingDetails && selectedStateConfig.StateRegisterMappingDetails.map((each: any, index: number) => (
                                  <TableRow
                                    key={each._id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >   
                                      <TableCell >{index+1}</TableCell>
                                      <TableCell >{each.ColumnType
                                      }</TableCell>
                                      <TableCell >{each.LabelName}</TableCell>
                                      <TableCell >{each.LabelColumnAddress}</TableCell>
                                      <TableCell >{each.LabelRowAddress  }</TableCell>
                                      <TableCell >{each.LabelMergedRange
                                      }</TableCell>
                                      <TableCell sx={{ maxWidth: 200, wordWrap: 'break-word' }} >{each.EzycompField ? each.EzycompField : 'NA'}</TableCell>
                                      <TableCell >{each.Formula  }</TableCell>
                                      <TableCell >{each.ValueColumnAddress
  }</TableCell>
                                      <TableCell >{each.ValueRowAddress
  }</TableCell>
                                      <TableCell >{each.ValueMergedRange
  }</TableCell>
  <TableCell >{each.Style
  }</TableCell>
  <TableCell >{each.FontName
  }</TableCell>
    <TableCell >{each.FontSize

                                  }</TableCell>
                                  <TableCell >{each.Comments
                                  }</TableCell>
                                    </TableRow>
                              ))}
                              </TableBody>
                          </Table>
                  </TableContainer>
                </>
              }
            </Box>

                <Box sx={{ display: 'flex', padding: '20px', borderTop: '1px solid #6F6F6F', justifyContent: 'space-between', alignItems: 'center', mt: 4 }}>
              <Button variant='contained' sx={{backgroundColor:'#707070'}} onClick={() => {setOpenPreviewModal(false); setSelectedStateConfig({})}}>Cancel</Button>
            </Box>
        


        </Box>

      </Modal>





 {/* Edit Modal */}
 <Modal
        open={openEditModal}
        onClose={() => {setOpenEditModal(false); setSelectedStateConfig({})}}
      >

        <Box sx={style}> 
          <Box sx={{
            backgroundColor: '#E2E3F8', padding: '5px', px: '10px', borderRadius: '6px', boxShadow: '0px 6px 10px #CDD2D9', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
}}>
            <Box sx={{display: "flex", flexDirection: "row"}}>


            {/* <Typography sx={{ font: 'normal normal normal 32px/40px Calibri' }}>Form :  {selectedStateConfig.FormName } </Typography> */}
            FormName: <FormControl sx={{ m: 1, maxWidth: "190px", minWidth: '150px', backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">                                           
                                            <OutlinedInput
                                             
                                             // value={selectedStateConfig.FormName}
                                              value={selectedstateconfigFormName}
                                              onChange={(e)=>setSelectedStateConfigFormName(e.target.value)}
                                             
                                              type='text'
                                            />
                                      </FormControl>
                                     Form : <FormControl sx={{ m: 1, maxWidth: "190px", minWidth: '150px', backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">                                           
                                            <OutlinedInput
                                             
                                             // value={selectedStateConfig.FormName}
                                              value={selectedstateconfigForm}
                                              onChange={(e)=>setSelectedStateConfigForm(e.target.value)}
                                             
                                              type='text'
                                            />
                                      </FormControl>
                                      Type : <FormControl sx={{ m: 1, maxWidth: "190px", minWidth: '150px', backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">                                           
                                            <OutlinedInput
                                             
                                             // value={selectedStateConfig.FormName}
                                              value={selectedstateconfigRegisterType}
                                              onChange={(e)=>setSelectedStateConfigRegisterType(e.target.value)}
                                             
                                              type='text'
                                            />
                                      </FormControl>

           
           
            </Box>
                      
              <IconButton
                onClick={() => {setOpenEditModal(false); setSelectedStateConfig({})}}
              >
                <IoMdClose />
              </IconButton>
            </Box>
          

          <Box sx={{ paddingX: '20px', display: 'flex', flexDirection: 'column' }}>
              {
                selectedStateConfig.StateRegisterMappingDetails && selectedStateConfig.StateRegisterMappingDetails.length <= 0 ? 

                <Box sx={{height:'60vh', display:'flex', justifyContent:'center', alignItems:'center'}}>
                  <Typography variant='h5'>No Records Found</Typography>
                </Box>
                : 
                <>
                  <TableContainer sx={{ border: '1px solid #e6e6e6', marginTop: '10px', maxHeight: '700px', overflowY: 'auto' }}>
                    <Table stickyHeader sx={{ minWidth: 650 }} aria-label="sticky table">
                      <TableHead sx={{ '.MuiTableCell-root': { backgroundColor: '#E7EEF7' }}}>
                                  <TableRow>
                                      <TableCell > S.no</TableCell>
                                      <TableCell > LabelName</TableCell>
                                      <TableCell > LabelColumn</TableCell>
                                      <TableCell > LabelRow </TableCell>
                                      <TableCell > Label Merged Range</TableCell>
                                      <TableCell > Column Type</TableCell>
                                      <TableCell sx={{ maxWidth: 200, wordWrap: 'break-word' }} > EzyCompField</TableCell>
                                      <TableCell > Style</TableCell>
                                      {/* <TableCell > Style</TableCell> */}
                                      <TableCell > FontName</TableCell>
                                      {/* <TableCell > FontName</TableCell> */}
                                      <TableCell > Font Size</TableCell>
                                      {/* <TableCell > Font Size</TableCell> */}
                                      <TableCell > Formula</TableCell>
                                      {/* <TableCell > Formula</TableCell> */}
                                      <TableCell > Value Merged </TableCell>
                                      <TableCell > Value Merged Range</TableCell>
                                      {/* <TableCell > ValueMergedRange</TableCell> */}
                                      <TableCell > Value Row</TableCell>
                                      {/* <TableCell > Value Row</TableCell> */}
                                      <TableCell > Value Column</TableCell>
                                      {/* <TableCell > Value Column</TableCell> */}
                                      <TableCell > Comments</TableCell>
                                      {/* <TableCell > Comments</TableCell> */}
                                  </TableRow>
                              </TableHead>


                              <TableBody>

                              {selectedStateConfig.StateRegisterMappingDetails && selectedStateConfig.StateRegisterMappingDetails.map((each: any, index: number) => (
                                  <TableRow
                                    key={each._id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >   
                                      <TableCell >{index+1}</TableCell>
                                      <TableCell >{each.LabelName}</TableCell>
                                      <TableCell >{each.LabelColumnAddress}</TableCell>
                                      <TableCell >{each.LabelRowAddress  }</TableCell>
                                      <TableCell >{each.LabelMergedRange
                                      }</TableCell>


                                       {/** Column Type */}
                                <TableCell >
                                  <FormControl sx={{ m: 1, width: "100%", maxWidth: '120px', backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                                    <MSelect
                                      value={each.ColumnType ? each.ColumnType : ''}
                                      displayEmpty
                                      onChange={(e) => { handleEditChangeColumnType(e, each) }}
                                    >
                                      <MenuItem disabled sx={{ display: 'none' }} value="">
                                        Select Column type
                                      </MenuItem>
                                      {['Header', 'Footer', 'Detail', 'Formula'].map((each: any) => {
                                        return <MenuItem value={each}>{each}</MenuItem>
                                      })}
                                    </MSelect>
                                  </FormControl>
                                </TableCell>

                                     
                                {/** Ezycomp Field */}
                                <TableCell sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                  <FormControl sx={{
                                    m: 1, width: "100%", minWidth: '200px', backgroundColor: '#ffffff', borderRadius: '5px', display: 'flex',
                                    flexDirection: 'row'
                                  }} size="small">

                                    <Select
                                      options={columnsList ? columnsList.map((each: any) => { return { label: each, value: each } }) : []}
                                      id={`outlined-adornment-${each._id}`}
                                      className="basic-multi-select"
                                      classNamePrefix="select"
                                      value={each.EzycompField ? { label: each.EzycompField, value: each.EzycompField } : ''}
                                      styles={{
                                        control: (base: any) => ({
                                          ...base,
                                          maxHeight: 150,
                                          overflow: "auto",
                                          width: '200px'
                                        })
                                      }}
                                      onChange={(e) => handleEditChangeEzycompField(e, each)}

                                    />
                                
                                    <Select
                                      options={symbols ? symbols.map((each: any) => { return { label: each.label, value: each.value } }) : []}
                                      className=""
                                      classNamePrefix="select"
                                      value={each.value ? { label: each.label, value: each.value } : ''}

                                      id="demo-simple-select-autowidth"
                                      styles={{
                                        control: (base: any) => ({
                                          ...base,
                                          maxHeight: 150,
                                          overflow: "auto",
                                          width: '100px'
                                        })
                                      }}
                                      onChange={(e) => handleEditChangeopeator(e, each)}

                                    />
                                    

                                    {/*                                             
                                            <MSelect displayEmpty value={symbols} onClick={handleOnchangeSymbol}>
                                              {symbols.map((each: any) => {
                                                return <MenuItem value={each.value} key = {each.id}>{each.label}</MenuItem>
                                              })}
                                            </MSelect> */}

                                  </FormControl>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>

                                    <Tooltip
                                      key={each.Id}
                                      title={each.EzycompField} // Tooltip content is set to the ezycompField value
                                      open={hoveredRow === each.Id}
                                     // open={isHovered}
                                      disableFocusListener
                                      disableTouchListener
                                      placement="top"
                                      arrow
                                      PopperProps={{
                                        sx: {
                                          '& .MuiTooltip-tooltip': {
                                            backgroundColor: 'blue', // Change to your desired background color
                                            color: 'white', // Change to your desired text color
                                            fontSize: '16px', // Change to your desired font size
                                          },
                                          '& .MuiTooltip-arrow': {
                                            color: 'blue', // Ensure the arrow color matches the tooltip background
                                          },
                                        },
                                      }}
                                    >
                                      <TextField
                                        size="small"
                                        value={each.EzycompField}
                                        id={`textfield-${each.Id}`}
                                        sx={{
                                          // width: '100%', // Adjust width as needed
                                          width: '250px',
                                          //fontSize: each.ezycompField.length > 20 ? '0.75rem' : '0.875rem', // Example condition for font size adjustment
                                          transition: 'font-size 0.3s ease-out', // Smooth transition for font size change
                                          '&:hover': {
                                            fontSize: '1rem', // Increase font size on hover
                                          },
                                          
                                        }}
                                        onMouseEnter={() => handleEditMouseEnter(each.Id)}
                                        onMouseLeave={handleEditMouseLeave}
                                      />
                                    </Tooltip>


                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                      {/* <Button>Add</Button> */}
                                      <Button> <RxCross2 onClick={() => handleClearEditEzycompField(each)} /> </Button>
                                    </Box>
                                  </Box>
                                </TableCell>


                                  {/** Style */}
                                  <TableCell >
                                  <FormControl sx={{ m: 1, width: "100%", maxWidth: '120px', backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                                    <MSelect
                                      value={each.Style ? each.Style : ''}
                                      displayEmpty
                                      onChange={(e) => { handleeditStylechange(e, each) }}
                                    >
                                      <MenuItem disabled sx={{ display: 'none' }} value="">
                                        Select Style
                                      </MenuItem>
                                      {['Bold', 'Italic', 'Underline'].map((each: any) => {
                                        return <MenuItem value={each}>{each}</MenuItem>
                                      })}
                                    </MSelect>
                                  </FormControl>
                                </TableCell>
                                      {/* <TableCell >{each.Style}</TableCell> */}


                                       {/** Font Name */}
                                <TableCell >
                                  <FormControl sx={{ m: 1, width: "100%", maxWidth: '190px', minWidth: '120px', backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                                    <Select
                                      options={fontList.map((each: any) => { return { label: each, value: each } })}
                                      className="basic-multi-select"
                                      classNamePrefix="select"
                                      value={each.FontName ? { label: each.FontName, value: each.FontName } : ''}
                                      styles={customStyles}
                                      onChange={(e) => handleeditFontnamechange(e, each)}
                                    />
                                  </FormControl>
                                </TableCell>
                                      {/* <TableCell >{each.FontName}</TableCell> */}


                                      {/** Font Size */}
                                <TableCell >
                                  <FormControl sx={{ m: 1, width: "100%", maxWidth: '20px', minWidth: '50px', backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                                    <OutlinedInput
                                      sx={{
                                        '& input::placeholder': {
                                          FontSize: '14px'
                                        }
                                      }}
                                      type='number'
                                      placeholder='Font Size'
                                      value={each.FontSize ? each.FontSize : ''}
                                      onChange={(e) => handleeditFontsizechange(e, each)}
                                      id="outlined-adornment-name"
                                    />
                                  </FormControl>
                                </TableCell>
                                      {/* <TableCell >{each.FontSize}</TableCell> */}

 {/** Formula */}
                                      <TableCell>
                                      <FormControl sx={{ m: 1, maxWidth: "190px", minWidth: '150px', backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">                                           
                                            <OutlinedInput
                                             
                                              value={each.Formula}
                                              onChange={(e)=>handleeditFormulachange(e,each)}
                                              id={`outlined-adornment-${each._id}`}
                                              type='text'
                                            />
                                      </FormControl>
                                      </TableCell>
                                      {/* <TableCell >{each.Formula  }</TableCell> */}



                                       {/** Value Merged */}
                                <TableCell >
                                  <FormControl sx={{ m: 1, width: "100%", maxWidth: '80px', backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                                    <MSelect
                                      value={each.ValueMerged ? "Yes" : "No"}
                                      displayEmpty
                                      onChange={(e) => { handleeditChangeValueMerged(e, each) }}
                                    >
                                      {/* <MenuItem disabled sx={{ display: 'none' }} value=""> */}
                                           <MenuItem disabled sx={{ display: 'none' }} > 
                                        Select Value Merged
                                      </MenuItem>
                                      {['Yes', 'No'].map((each: any) => {
                                        return <MenuItem value={each}>{each}</MenuItem>
                                      })}
                                    </MSelect>
                                  </FormControl>
                                </TableCell>

  {/** Value Merged Range*/}
                                <TableCell>
                                      <FormControl sx={{ m: 1, width: "100%", backgroundColor: '#ffffff',minWidth:'80px', borderRadius: '5px' }} size="small">
                                            <OutlinedInput
                                            placeholder='Value Merged Range'
                                            disabled={!each.ValueMerged}
                                              value={each.ValueMergedRange}
                                              onChange={(e)=>handleeditvalueMergedrangechange(e,each)}
                                              id={`outlined-adornment-${each._id}`}
                                              type='text'
                                            />
                                      </FormControl>
                                      </TableCell>
                                      {/* <TableCell >{each.ValueMergedRange}</TableCell> */}

                                        {/** Value Row Address*/}
                                      <TableCell>
                                      <FormControl sx={{ m: 1, width: "100%", backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                                            <OutlinedInput
                                            disabled={each.ValueMerged}
                                      placeholder='Value Row'
                                              value={each.ValueRowAddress ? each.ValueRowAddress : ''}
                                              onChange={(e)=>handleeditvalueRowaddresschange(e,each)}
                                              id={`outlined-adornment-${each._id}`}
                                              type='text'
                                            />
                                      </FormControl>
                                      </TableCell>
                                      {/* <TableCell >{each.ValueRowAddress}</TableCell> */}

 {/** Value Column Address*/}

                                      <TableCell>
                                      <FormControl sx={{ m: 1, width: "100%", backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                                            <OutlinedInput
                                              disabled={each.ValueMerged}
                                      placeholder='Value Column'
                                              value={each.ValueColumnAddress ? each.ValueColumnAddress : ''}
                                              onChange={(e)=>handleeditvalueColumnaddresschange(e,each)}
                                              id={`outlined-adornment-${each._id}`}
                                              type='text'
                                            />
                                      </FormControl>
                                      </TableCell>
                                       {/* <TableCell >{each.ValueColumnAddress}</TableCell> */}
 {/** Comments*/}
                                  <TableCell>
                                    <FormControl
                                      sx={{
                                        m: 1,
                                        maxWidth: "100%",
                                        minWidth: '180px',
                                        backgroundColor: '#ffffff',
                                        borderRadius: '5px'
                                      }}
                                      size="small"
                                    >
                                      <Tooltip
                                        key={each.Id}
                                        title={each.Comments} // Tooltip content is set to the comments value
                                        open={hoveredRow === each.Id}
                                        // open={isHovered}
                                        disableFocusListener
                                        disableTouchListener
                                        placement="top"
                                        arrow
                                        PopperProps={{
                                          sx: {
                                            '&.MuiTooltip-tooltip': {
                                              backgroundColor: 'blue', // Change to your desired background color
                                              color: 'white', // Change to your desired text color
                                              fontSize: '16px', // Change to your desired font size
                                            },
                                            '&.MuiTooltip-arrow': {
                                              color: 'blue', // Ensure the arrow color matches the tooltip background
                                            },
                                          },
                                        }}
                                      >
                                        <OutlinedInput
                                          value={each.Comments}
                                          sx={{
                                          
                                            fontSize: each.Comments ? (each.Comments.length > 20 ? '0.75rem' : '0.875rem') : '0.875rem', // Example condition for font size adjustment
                                            transition: 'font-size 0.3s ease-out', // Smooth transition for font size change
                                            '&:hover': {
                                              fontSize: '1rem', // Increase font size on hover
                                            },
                                          }}
                                          onChange={(e) => handleeditCommentschange(e, each)}
                                          id={`outlined-adornment-${each._id}`}
                                          type='text'
                                          onMouseEnter={() => handleEditMouseEnter(each.Id)}
                                          onMouseLeave={handleEditMouseLeave}
                                        />
                                      </Tooltip>
                                    </FormControl>
                                  </TableCell>
                                      
                                  {/* <TableCell >{each.Comments}</TableCell> */}
                                  
                                    </TableRow>
                              ))}
                              </TableBody>
                          </Table>
                  
                    
                     
          
                  
                  </TableContainer>
                     
                
                </>
              }
                      <TableRow sx={{ position: 'sticky', bottom: 0 }}>
                        <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Button variant='contained' sx={{ backgroundColor: '#707070' }} onClick={() => { setOpenEditModal(false); setSelectedStateConfig({}) }}>Cancel</Button>
                      <Button variant='contained' sx={{ backgroundColor: '#707070' }} onClick={() => handleSaveEditMappingForm()}>Save Changes</Button>
                        </Box>
                        </TableRow>
            </Box>


        </Box>

      </Modal>




       {/* Delete Modal */}
       <Modal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
      >
        <Box sx={deleteboxstyle}>
          <Box sx={{ backgroundColor: '#E2E3F8', padding: '10px', px: '20px', borderRadius: '6px', boxShadow: '0px 6px 10px #CDD2D9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ font: 'normal normal normal 32px/40px Calibri' }}>Delete Mapping</Typography>
            <IconButton
              onClick={() => setOpenDeleteModal(false)}
            >
              <IoMdClose />
            </IconButton>
          </Box>
          <Box sx={{ padding: '20px', backgroundColor: '#ffffff' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography >Are you sure you want to delete the  <h5>{selectedStateConfig.Form}</h5> &nbsp;</Typography>
              {/* <Typography variant='h5'>{selectedStateConfig.Form && holiday.name}</Typography> */}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
              <Button variant='outlined' color="error" onClick={() => setOpenDeleteModal(false)}>No</Button>
              <Button variant='contained' onClick={onClickConfirmDelete}>Yes</Button>
            </Box>
          </Box>
        </Box>
      </Modal>








      {/** View Modal */}
      <Drawer anchor='right' open={openViewModal}>
        <Box sx={{ height: '100%', width: 500, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ backgroundColor: '#E2E3F8', padding: '10px', px: '20px', borderRadius: '6px', boxShadow: '0px 6px 10px #CDD2D9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ font: 'normal normal normal 32px/40px Calibri' }}>View State Configuration</Typography>
            <IconButton
              onClick={() => { setOpenViewModal(false); setSelectedStateConfig({}) }}
            >
              <IoMdClose />
            </IconButton>
          </Box>

          {/* View Modal */}
          <>
            <Box sx={{ width: '100%', padding: '20px', height: '90vh', overflowY: 'scroll' }}>
              <Typography variant='h5' color='#0F67B1' sx={{ fontSize: '22px' }}>State</Typography>
              <Typography color="#000000" sx={{ fontSize: '20px' }} >{selectedStateConfig.State ? selectedStateConfig.State.Name : 'NA'}</Typography>

              <Typography variant='h5' color='#0F67B1' sx={{ fontSize: '22px', mt: 1 }}>Act</Typography>
              <Typography color="#000000" sx={{ fontSize: '20px' }} >{selectedStateConfig.Act ? selectedStateConfig.Act.Name : 'NA'}</Typography>

              <Typography variant='h5' color='#0F67B1' sx={{ fontSize: '22px', mt: 1 }}>Rule</Typography>
              <Typography color="#000000" sx={{ fontSize: '20px' }} >{selectedStateConfig.Rule ? selectedStateConfig.Rule.Name : 'NA'}</Typography>

              <Typography variant='h5' color='#0F67B1' sx={{ fontSize: '22px', mt: 1 }}>Activity</Typography>
              <Typography color="#000000" sx={{ fontSize: '20px' }} >{selectedStateConfig.Activity ? selectedStateConfig.Activity.Name : 'NA'}</Typography>

              <Typography variant='h5' color='#0F67B1' sx={{ fontSize: '22px', mt: 1 }}>Form Name</Typography>
              <Typography color="#000000" sx={{ fontSize: '20px' }} >{selectedStateConfig.Form}</Typography>

              {selectedStateConfig.StateRegisterMappingDetails && selectedStateConfig.StateRegisterMappingDetails.map((each: any, i: any) => {
                return (
                  <Box sx={{ border: '1px solid #CDD2D9', mt: 2 }}>
                    <Box display={'flex'}>
                      <Typography variant='h5' color='#0F67B1' sx={{ fontSize: '22px' }}>S.no: &nbsp; </Typography>
                      <Typography color="#000000" sx={{ fontSize: '20px' }} >{i + 1}</Typography>
                    </Box>

                    <Typography variant='h5' color='#0F67B1' sx={{ fontSize: '22px', mt: 1 }}>Label Name</Typography>
                    <Typography color="#000000" sx={{ fontSize: '20px' }} >{each.LabelName}</Typography>

                    <Typography variant='h5' color='#0F67B1' sx={{ fontSize: '22px', mt: 1 }}>Column Type</Typography>
                    <Typography color="#000000" sx={{ fontSize: '20px' }} >{each.ColumnType}</Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Typography
                        variant="h5"
                        color="#0F67B1"
                        sx={{ fontSize: '22px', mt: 1 }}
                      >
                        Ezycomp Field
                      </Typography>
                    <Typography color="#000000" sx={{ fontSize: '20px' }} >{each.EzycompField ? each.EzycompField : 'NA'}</Typography>
                    </Box>

                    <Typography variant='h5' color='#0F67B1' sx={{ fontSize: '22px', mt: 1 }}>Style</Typography>
                    <Typography color="#000000" sx={{ fontSize: '20px' }} >{each.Style}</Typography>

                    <Typography variant='h5' color='#0F67B1' sx={{ fontSize: '22px', mt: 1 }}>Font Name</Typography>
                    <Typography color="#000000" sx={{ fontSize: '20px' }} >{each.FontName}</Typography>

                    <Typography variant='h5' color='#0F67B1' sx={{ fontSize: '22px', mt: 1 }}>Font Size</Typography>
                    <Typography color="#000000" sx={{ fontSize: '20px' }} >{each.FontSize}</Typography>

                  </Box>
                )
              })}

            </Box>
            <Box sx={{ display: 'flex', padding: '20px', borderTop: '1px solid #6F6F6F', justifyContent: 'flex-end', alignItems: 'center', }}>
              <Button variant='contained' onClick={() => { setOpenViewModal(false); setSelectedStateConfig({}) }}>Cancel</Button>
            </Box>
          </>
        </Box>
      </Drawer>
      {loading ? <PageLoader>Loading...</PageLoader> :

        <div>
          <Box sx={{ paddingX: '20px', paddingY: '10px', }}>
            <div style={{ backgroundColor: '#E2E3F8', padding: '20px', borderRadius: '6px', boxShadow: '0px 6px 10px #CDD2D9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', marginTop: '10px' }}>
                <h5 style={{ font: 'normal normal normal 32px/40px Calibri' }}>State Register Configuration</h5>
                <Button onClick={onClickAdd} variant='contained' style={{ backgroundColor: '#0654AD', display: 'flex', alignItems: 'center' }}> <IoMdAdd /> &nbsp; Add</Button>
              </div>

              <div style={{ display: 'flex' }}>

                <Box sx={{ mr: 1 }}>
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
                  <Typography mb={1}>Establishment Type</Typography>
                  <FormControl sx={{ width: "220px", backgroundColor: '#ffffff', borderRadius: '5px' }} size="small">
                    <MSelect
                      sx={{ '.MuiOutlinedInput-notchedOutline': { border: 0 } }}
                      displayEmpty
                      value={EstablishmenttypeFilter}
                      disabled={!stateValue}
                      onChange={handleChangeEstablishmentType}
                    >
                      <MenuItem disabled sx={{ display: 'none' }} value="">
                        Select Type
                      </MenuItem>
                      {['BOCW','CLRA','Factory','ISM','SHOPS'].map((each: any) => {
                        return <MenuItem value={each}>{each}</MenuItem>
                      })}
                    </MSelect>
                  </FormControl>
                </Box>

                <Box sx={{ mr: 1 }}>
                  <Typography mb={1}>Search (Form)</Typography>
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
                </Box>

              </div>
            </div>
          </Box>

          <Box sx={{ paddingX: '20px' }}>
            {
              stateRegister && stateRegister.length <= 0 ?

                <Box sx={{ height: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Typography variant='h5'>No Records Found</Typography>
                </Box>
                :
                <>
                  <TableContainer sx={{ border: '1px solid #e6e6e6', marginTop: '10px', maxHeight: '380px', overflowY: 'scroll' }}>
                    <Table stickyHeader sx={{ minWidth: 650 }} aria-label="sticky table">
                      <TableHead sx={{ '.MuiTableCell-root': { backgroundColor: '#E7EEF7' } }}>
                        <TableRow>
                          <TableCell > <TableSortLabel active={activeSort === 'stateId'} direction={sortType} onClick={onClickSortState}>State</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel active={activeSort === 'actId'} direction={sortType} onClick={onClickSortAct}>Act</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel active={activeSort === 'ruleId'} direction={sortType} onClick={onClickSortRule}>Rule</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel active={activeSort === 'activityId'} direction={sortType} onClick={onClickSortActivity}>Activity</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel active={activeSort === 'form'} direction={sortType} onClick={onClickSortForm}>Form</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel active={activeSort === 'form'} direction={sortType} onClick={onClickSortForm}>FormName</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel active={activeSort === 'registerType'} direction={sortType} onClick={onClickSortRegisterType}>Type</TableSortLabel></TableCell>
                          <TableCell > <TableSortLabel active={activeSort === 'Formurl'} direction={sortType} onClick={onClickSortRegisterType}>FilePath</TableSortLabel></TableCell>
                          <TableCell > Actions</TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>

                        {stateRegister && stateRegister.map((each: any, index: number) => (
                          <TableRow
                            key={index}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell >{each.State && each.State.Name ? each.State.Name : 'NA'}</TableCell>
                            <TableCell >{each.Act && each.Act.Name ? each.Act.Name : 'NA'}</TableCell>
                            <TableCell >{each.Rule && each.Rule.Name+'/'+ each.Rule.RuleNo+', sec' + each.Rule.SectionNo ? each.Rule.Name+ '/'+each.Rule.RuleNo+', sec' + each.Rule.SectionNo : 'NA' }</TableCell>
                            <TableCell >{each.Activity && each.Activity.Name ? each.Activity.Name : 'NA'}</TableCell>
                            <TableCell >{each.Form && each.Form ? each.Form : 'NA'}</TableCell>
                            <TableCell >{each.FormName && each.FormName ? each.FormName : 'NA'}</TableCell>
                            <TableCell >{each.RegisterType && each.RegisterType ? each.RegisterType : 'NA'}</TableCell>
                            <TableCell >{each.FilePath && each.FilePath ? each.FilePath : 'NA'}</TableCell>

                            <TableCell >
                              <Box sx={{  display: 'flex', justifyContent: 'space-between', width: '50px'  }}>
                                {/* <Icon action={() => onclickEdit(each)} style={{color:'#039BE5'}} type="button" name={'pencil'} text={'Edit'}/> */}
                                <Icon action={() => onclickView(each)} style={{ color: '#00C853' }} type="button" name={'eye'} text={'View'} />
                                <Icon action={() => onclickEditModelButton(each)} style={{ color: '#039BE5' }} type="button" name={'pencil'} text={'Edit'} />
                                {/* <Icon action={() => onclickDeleteButton(each)} style={{ color: '#EB1010' }} type="button" name={'trash'} text={'Delete'} />
                               */}
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

export default StateRegisterConfiguration