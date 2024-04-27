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
       
        .addCase(configUpload.pending, (state) => {
            state.configUploadDetails.status = 'loading'
        })
        .addCase(configUpload.fulfilled, (state, action: any) => {
            if(action.payload.data.status === 'SUCCESS') {
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
})
  
export const { resetConfigUploadDetails, resetGetColumnsDetails, resetExcelHeaderToDbColumnsDetails } = inputModuleSlice.actions

export default inputModuleSlice.reducer