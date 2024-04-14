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

export const inputModuleSlice = createSlice({
    name: 'inputModule',
    initialState,
    reducers: {
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
       
})
  
export const { } = inputModuleSlice.actions

export default inputModuleSlice.reducer