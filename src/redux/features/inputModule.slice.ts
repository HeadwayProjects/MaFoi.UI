import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { InputModuleService } from '../../backend/inputModule';

interface InputModuleState {
    companiesDetails: {
        status: string,
        data: any,
        error: string | null
    },
    associateCompaniesDetails: {
        status: string,
        data: any,
        error: string | null
    },
    locationsDetails: {
        status: string,
        data: any,
        error: string | null
    },
    statesDetails: {
        status: string,
        data: any,
        error: string | null
    },
    actsDetails: {
        status: string,
        data: any,
        error: string | null
    },
    activitiesDetails: {
        status: string,
        data: any,
        error: string | null
    },
    rulesDetails: {
        status: string,
        data: any,
        error: string | null
    },
    formsDetails: {
        status: string,
        data: any,
        error: string | null
    },
    configUploadDetails: {
        status: string,
        data: any,
        error: string | null
    },
    getColumnsDetails: {
        status: string,
        data: any,
        error: string | null
    },
    excelHeaderToDbColumnsDetails: {
        status: string,
        data: any,
        error: string | null
    },
    employeeUploadDetails: {
        status: string,
        data: any,
        error: string | null
    },
    employeeAttendanceUploadDetails: {
        status: string,
        data: any,
        error: string | null
    },
    employeeLeaveCreditUploadDetails: {
        status: string,
        data: any,
        error: string | null
    },
    employeeLeaveAvailedUploadDetails: {
        status: string,
        data: any,
        error: string | null
    },
    employeeWageUploadDetails: {
        status: string,
        data: any,
        error: string | null
    },
    configMappingDetails: {
        status: string,
        data: any,
        error: string | null
    }
}

const initialState: InputModuleState = { 
    companiesDetails: {
        status: 'idle',
        data: '',
        error: null
    },
    associateCompaniesDetails: {
        status: 'idle',
        data: '',
        error: null
    },
    locationsDetails: {
        status: 'idle',
        data: '',
        error: null
    },
    statesDetails: {
        status: 'idle',
        data: '',
        error: null
    },
    actsDetails: {
        status: 'idle',
        data: '',
        error: null
    },
    activitiesDetails: {
        status: 'idle',
        data: '',
        error: null
    }, 
    rulesDetails: {
        status: 'idle',
        data: '',
        error: null
    },
    formsDetails: {
        status: 'idle',
        data: '',
        error: null
    },
    configUploadDetails: {
        status: 'idle',
        data: '',
        error: null
    },
    getColumnsDetails: {
        status: 'idle',
        data: '',
        error: null
    },
    excelHeaderToDbColumnsDetails: {
        status: 'idle',
        data: '',
        error: null
    },
    employeeUploadDetails: {
        status: 'idle',
        data: '',
        error: null
    },
    employeeAttendanceUploadDetails: {
        status: 'idle',
        data: '',
        error: null
    },
    employeeLeaveCreditUploadDetails: {
        status: 'idle',
        data: '',
        error: null
    },
    employeeLeaveAvailedUploadDetails: {
        status: 'idle',
        data: '',
        error: null
    },
    employeeWageUploadDetails: {
        status: 'idle',
        data: '',
        error: null
    },
    configMappingDetails: {
        status: 'idle',
        data: '',
        error: null
    }
} as InputModuleState

export const getAllCompaniesDetails = createAsyncThunk('inputModule/getAllCompaniesDetails', async (data: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.fetchCompaniesDetails(data);
})

export const getAssociateCompanies = createAsyncThunk('inputModule/getAssociateCompaniesDetails', async (data: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.fetchAssociateCompaniesDetails(data);
})

export const getLocations = createAsyncThunk('inputModule/getLocations', async (data: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.getLocations(data);
})

export const getStates = createAsyncThunk('inputModule/getStates', async (data: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.getStatesDetails(data);
})

export const getActs = createAsyncThunk('inputModule/getActs', async (data: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.getActs(data)
})

export const getActivities = createAsyncThunk('inputModule/getActivities', async (data: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.getActivities(data)
})

export const getRules = createAsyncThunk('inputModule/getRules', async (data: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.getRules(data)
})

export const getForms = createAsyncThunk('inputModule/getForms', async (data: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.getForms(data)
})

export const configUpload = createAsyncThunk('inputModule/configUpload', async (data: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.configUpload(data);
})

export const getColumns = createAsyncThunk('inputModule/getColumns', async (type: string) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.getColumns(type);
})

export const callExcelHeaderToDbColumns = createAsyncThunk('inputModule/callExcelHeaderToDbColumns', async (data: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.callExcelHeaderToDbColumns(data);
})

export const employeeUpload = createAsyncThunk('inputModule/employeeUpload', async (data: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.employeeUpload(data);
})

export const employeeAttendanceUpload = createAsyncThunk('inputModule/employeeAttendanceUpload', async (data: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.employeeAttendanceUpload(data);
})

export const employeeLeaveCreditUpload = createAsyncThunk('inputModule/employeeLeaveBalanceUpload', async (data: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.employeeLeaveBalanceUpload(data);
})

export const employeeLeaveAvailedUpload = createAsyncThunk('inputModule/employeeLeaveAvailedUpload', async (data: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.employeeLeaveAvailedUpload(data);
})

export const employeeWageUpload = createAsyncThunk('inputModule/employeeWageUpload', async (data: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.employeeWageUpload(data);
})

export const getInputModuleMappingDetails = createAsyncThunk('inputModule/getInputModuleMappingDetails', async (data: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.getInputModuleMappingDetails(data);
})

export const inputModuleSlice = createSlice({
    name: 'inputModule',
    initialState,
    reducers: {
        resetConfigUploadDetails: (state) => {
            state.configUploadDetails = {
                status: 'idle',
                data: '',
                error: null
            }
        },
        resetGetColumnsDetails: (state) => {
            state.getColumnsDetails = {
                status: 'idle',
                data: '',
                error: null
            }
        },
        resetExcelHeaderToDbColumnsDetails: (state) => {
            state.excelHeaderToDbColumnsDetails = {
                status: 'idle',
                data: '',
                error: null
            }
        },
        resetEmployeeUploadDetails: (state) => {
            state.employeeUploadDetails = {
                status: 'idle',
                data: '',
                error: null
            }
        },
        resetEmployeeAttendanceUploadDetails: (state) => {
            state.employeeAttendanceUploadDetails = {
                status: 'idle',
                data: '',
                error: null
            }
        },
        resetEmployeeLeaveCreditUploadDetails: (state) => {
            state.employeeLeaveCreditUploadDetails = {
                status: 'idle',
                data: '',
                error: null
            }
        },
        resetEmployeeLeaveAvailedUploadDetails: (state) => {
            state.employeeLeaveAvailedUploadDetails = {
                status: 'idle',
                data: '',
                error: null
            }
        },
        resetEmployeeWageUploadDetails: (state) => {
            state.employeeWageUploadDetails = {
                status: 'idle',
                data: '',
                error: null
            }
        },
        resetGetConfigMappingDetails: (state) => {
            state.configMappingDetails= {
                status: 'idle',
                data: '',
                error: null
            }
        }
    },
    extraReducers: (builder) => builder
        .addCase(getAllCompaniesDetails.pending, (state) => {
            state.companiesDetails.status = 'loading'
        })
        .addCase(getAllCompaniesDetails.fulfilled, (state, action: any) => {
            if(action.payload) {
                state.companiesDetails.status = 'succeeded'
                state.companiesDetails.data = action.payload.data
            } else {
                state.companiesDetails.status = 'failed'
                state.companiesDetails.error = action.payload.message;
            }
        })
        .addCase(getAllCompaniesDetails.rejected, (state, action: any) => {
            state.companiesDetails.status = 'failed'
            state.companiesDetails.error = action.error.message
        })
        
        .addCase(getAssociateCompanies.pending, (state) => {
            state.associateCompaniesDetails.status = 'loading'
        })
        .addCase(getAssociateCompanies.fulfilled, (state, action: any) => {
            if(action.payload) {
                state.associateCompaniesDetails.status = 'succeeded'
                state.associateCompaniesDetails.data = action.payload.data
            } else {
                state.associateCompaniesDetails.status = 'failed'
                state.associateCompaniesDetails.error = action.payload.message;
            }
        })
        .addCase(getAssociateCompanies.rejected, (state, action: any) => {
            state.associateCompaniesDetails.status = 'failed'
            state.associateCompaniesDetails.error = action.error.message
        })

        .addCase(getLocations.pending, (state) => {
            state.locationsDetails.status = 'loading'
        })
        .addCase(getLocations.fulfilled, (state, action: any) => {
            if(action.payload) {
                state.locationsDetails.status = 'succeeded'
                state.locationsDetails.data = action.payload.data
            } else {
                state.locationsDetails.status = 'failed'
                state.locationsDetails.error = action.payload.message;
            }
        })
        .addCase(getLocations.rejected, (state, action: any) => {
            state.locationsDetails.status = 'failed'
            state.locationsDetails.error = action.error.message
        })

        .addCase(getStates.pending, (state) => {
            state.statesDetails.status = 'loading'
        })
        .addCase(getStates.fulfilled, (state, action: any) => {
            if(action.payload) {
                state.statesDetails.status = 'succeeded'
                state.statesDetails.data = action.payload.data
            } else {
                state.statesDetails.status = 'failed'
                state.statesDetails.error = action.payload.message;
            }
        })
        .addCase(getStates.rejected, (state, action: any) => {
            state.statesDetails.status = 'failed'
            state.statesDetails.error = action.error.message
        })
        
        .addCase(getActs.pending, (state) => {
            state.actsDetails.status = 'loading'
        })
        .addCase(getActs.fulfilled, (state, action: any) => {
            if(action.payload) {
                state.actsDetails.status = 'succeeded'
                state.actsDetails.data = action.payload.data
            } else {
                state.actsDetails.status = 'failed'
                state.actsDetails.error = action.payload.message;
            }
        })
        .addCase(getActs.rejected, (state, action: any) => {
            state.actsDetails.status = 'failed'
            state.actsDetails.error = action.error.message
        })

        .addCase(getActivities.pending, (state) => {
            state.activitiesDetails.status = 'loading'
        })
        .addCase(getActivities.fulfilled, (state, action: any) => {
            if(action.payload) {
                state.activitiesDetails.status = 'succeeded'
                state.activitiesDetails.data = action.payload.data
            } else {
                state.activitiesDetails.status = 'failed'
                state.activitiesDetails.error = action.payload.message;
            }
        })
        .addCase(getActivities.rejected, (state, action: any) => {
            state.activitiesDetails.status = 'failed'
            state.activitiesDetails.error = action.error.message
        })

        .addCase(getRules.pending, (state) => {
            state.rulesDetails.status = 'loading'
        })
        .addCase(getRules.fulfilled, (state, action: any) => {
            if(action.payload) {
                state.rulesDetails.status = 'succeeded'
                state.rulesDetails.data = action.payload.data
            } else {
                state.rulesDetails.status = 'failed'
                state.rulesDetails.error = action.payload.message;
            }
        })
        .addCase(getRules.rejected, (state, action: any) => {
            state.rulesDetails.status = 'failed'
            state.rulesDetails.error = action.error.message
        })
        
        .addCase(getForms.pending, (state) => {
            state.formsDetails.status = 'loading'
        })
        .addCase(getForms.fulfilled, (state, action: any) => {
            if(action.payload) {
                state.formsDetails.status = 'succeeded'
                state.formsDetails.data = action.payload.data
            } else {
                state.formsDetails.status = 'failed'
                state.formsDetails.error = action.payload.message;
            }
        })
        .addCase(getForms.rejected, (state, action: any) => {
            state.formsDetails.status = 'failed'
            state.formsDetails.error = action.error.message
        })

        .addCase(configUpload.pending, (state) => {
            state.configUploadDetails.status = 'loading'
        })
        .addCase(configUpload.fulfilled, (state, action: any) => {
            if(action.payload.data) {
                state.configUploadDetails.status = 'succeeded'
                state.configUploadDetails.data = action.payload.data
            } else {
                state.configUploadDetails.status = 'failed'
                state.configUploadDetails.error = action.payload.message;
            }
        })
        .addCase(configUpload.rejected, (state, action: any) => {
            state.configUploadDetails.status = 'failed'
            state.configUploadDetails.error = action.error.message
        })

        .addCase(getColumns.pending, (state) => {
            state.getColumnsDetails.status = 'loading'
        })
        .addCase(getColumns.fulfilled, (state, action: any) => {
            if(action.payload) {
                state.getColumnsDetails.status = 'succeeded'
                state.getColumnsDetails.data = action.payload.data
            } else {
                state.getColumnsDetails.status = 'failed'
                state.getColumnsDetails.error = action.payload.message;
            }
        })
        .addCase(getColumns.rejected, (state, action: any) => {
            state.getColumnsDetails.status = 'failed'
            state.getColumnsDetails.error = action.error.message
        })
        
        .addCase(callExcelHeaderToDbColumns.pending, (state) => {
            state.excelHeaderToDbColumnsDetails.status = 'loading'
        })
        .addCase(callExcelHeaderToDbColumns.fulfilled, (state, action: any) => {
            if(action.payload) {
                state.excelHeaderToDbColumnsDetails.status = 'succeeded'
                state.excelHeaderToDbColumnsDetails.data = action.payload.data
            } else {
                state.excelHeaderToDbColumnsDetails.status = 'failed'
                state.excelHeaderToDbColumnsDetails.error = action.payload.message;
            }
        })
        .addCase(callExcelHeaderToDbColumns.rejected, (state, action: any) => {
            state.excelHeaderToDbColumnsDetails.status = 'failed'
            state.excelHeaderToDbColumnsDetails.error = action.error.message
        })

        .addCase(employeeUpload.pending, (state) => {
            state.employeeUploadDetails.status = 'loading'
        })
        .addCase(employeeUpload.fulfilled, (state, action: any) => {
            if(action.payload.data) {
                state.employeeUploadDetails.status = 'succeeded'
                state.employeeUploadDetails.data = action.payload.data
            } else {
                state.employeeUploadDetails.status = 'failed'
                state.employeeUploadDetails.error = action.payload.message;
            }
        })
        .addCase(employeeUpload.rejected, (state, action: any) => {
            state.employeeUploadDetails.status = 'failed'
            state.employeeUploadDetails.error = action.error.message
        })

        .addCase(employeeAttendanceUpload.pending, (state) => {
            state.employeeAttendanceUploadDetails.status = 'loading'
        })
        .addCase(employeeAttendanceUpload.fulfilled, (state, action: any) => {
            if(action.payload.data) {
                state.employeeAttendanceUploadDetails.status = 'succeeded'
                state.employeeAttendanceUploadDetails.data = action.payload.data
            } else {
                state.employeeAttendanceUploadDetails.status = 'failed'
                state.employeeAttendanceUploadDetails.error = action.payload.message;
            }
        })
        .addCase(employeeAttendanceUpload.rejected, (state, action: any) => {
            state.employeeAttendanceUploadDetails.status = 'failed'
            state.employeeAttendanceUploadDetails.error = action.error.message
        })

        .addCase(employeeLeaveCreditUpload.pending, (state) => {
            state.employeeLeaveCreditUploadDetails.status = 'loading'
        })
        .addCase(employeeLeaveCreditUpload.fulfilled, (state, action: any) => {
            if(action.payload.data) {
                state.employeeLeaveCreditUploadDetails.status = 'succeeded'
                state.employeeLeaveCreditUploadDetails.data = action.payload.data
            } else {
                state.employeeLeaveCreditUploadDetails.status = 'failed'
                state.employeeLeaveCreditUploadDetails.error = action.payload.message;
            }
        })
        .addCase(employeeLeaveCreditUpload.rejected, (state, action: any) => {
            state.employeeLeaveCreditUploadDetails.status = 'failed'
            state.employeeLeaveCreditUploadDetails.error = action.error.message
        })

        .addCase(employeeLeaveAvailedUpload.pending, (state) => {
            state.employeeLeaveAvailedUploadDetails.status = 'loading'
        })
        .addCase(employeeLeaveAvailedUpload.fulfilled, (state, action: any) => {
            if(action.payload.data) {
                state.employeeLeaveAvailedUploadDetails.status = 'succeeded'
                state.employeeLeaveAvailedUploadDetails.data = action.payload.data
            } else {
                state.employeeLeaveAvailedUploadDetails.status = 'failed'
                state.employeeLeaveAvailedUploadDetails.error = action.payload.message;
            }
        })
        .addCase(employeeLeaveAvailedUpload.rejected, (state, action: any) => {
            state.employeeLeaveAvailedUploadDetails.status = 'failed'
            state.employeeLeaveAvailedUploadDetails.error = action.error.message
        })
        
        .addCase(employeeWageUpload.pending, (state) => {
            state.employeeWageUploadDetails.status = 'loading'
        })
        .addCase(employeeWageUpload.fulfilled, (state, action: any) => {
            if(action.payload.data) {
                state.employeeWageUploadDetails.status = 'succeeded'
                state.employeeWageUploadDetails.data = action.payload.data
            } else {
                state.employeeWageUploadDetails.status = 'failed'
                state.employeeWageUploadDetails.error = action.payload.message;
            }
        })
        .addCase(employeeWageUpload.rejected, (state, action: any) => {
            state.employeeWageUploadDetails.status = 'failed'
            state.employeeWageUploadDetails.error = action.error.message
        })
        
        .addCase(getInputModuleMappingDetails.pending, (state) => {
            state.configMappingDetails.status = 'loading'
        })
        .addCase(getInputModuleMappingDetails.fulfilled, (state, action: any) => {
            if(action.payload.data) {
                state.configMappingDetails.status = 'succeeded'
                state.configMappingDetails.data = action.payload.data
            } else {
                state.configMappingDetails.status = 'failed'
                state.configMappingDetails.error = action.payload.message;
            }
        })
        .addCase(getInputModuleMappingDetails.rejected, (state, action: any) => {
            state.configMappingDetails.status = 'failed'
            state.configMappingDetails.error = action.error.message
        })

})
  
export const { resetGetConfigMappingDetails, resetConfigUploadDetails, resetGetColumnsDetails, resetExcelHeaderToDbColumnsDetails, resetEmployeeUploadDetails, resetEmployeeAttendanceUploadDetails, resetEmployeeLeaveCreditUploadDetails, resetEmployeeLeaveAvailedUploadDetails, resetEmployeeWageUploadDetails } = inputModuleSlice.actions

export default inputModuleSlice.reducer