import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { InputModuleService } from '../../backend/inputModule';

interface LeaveConfigurationState {
    stateRegisterDetails: {
        status: string,
        data: any,
        error: string | null
    },
    stateConfigureDetails: {
        status: string,
        data: any,
        error: string | null
    },
}

const initialState: LeaveConfigurationState = { 
    stateRegisterDetails: {
        status: 'idle',
        data: '',
        error: null
    },
    stateConfigureDetails: {
        status: 'idle',
        data: '',
        error: null
    },
} as LeaveConfigurationState

export const getStateRegister = createAsyncThunk('stateRegister/getleaveConfiguration', async (data: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.fetchStateRegister(data);
})

export const getStateConfigurationDetails = createAsyncThunk('inputModule/getStateConfigurationDetails', async (data: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.getStateConfigurationDetails(data)
})

export const stateRegisterSlice = createSlice({
    name: 'stateRegister',
    initialState,
    reducers: {
       
    },
    extraReducers: (builder) => builder
        .addCase(getStateRegister.pending, (state) => {
            state.stateRegisterDetails.status = 'loading'
        })
        .addCase(getStateRegister.fulfilled, (state, action: any) => {
            if(action.payload.data) {
                state.stateRegisterDetails.status = 'succeeded'
                state.stateRegisterDetails.data = action.payload.data
            } else {
                state.stateRegisterDetails.status = 'failed'
                state.stateRegisterDetails.error = action.payload.message;
            }
        })
        .addCase(getStateRegister.rejected, (state, action: any) => {
            state.stateRegisterDetails.status = 'failed'
            state.stateRegisterDetails.error = action.error.message
        })
        
        .addCase(getStateConfigurationDetails.pending, (state) => {
            state.stateConfigureDetails.status = 'loading'
        })
        .addCase(getStateConfigurationDetails.fulfilled, (state, action: any) => {
            if(action.payload.data) {
                state.stateConfigureDetails.status = 'succeeded'
                state.stateConfigureDetails.data = action.payload.data
            } else {
                state.stateConfigureDetails.status = 'failed'
                state.stateConfigureDetails.error = action.payload.message;
            }
        })
        .addCase(getStateConfigurationDetails.rejected, (state, action: any) => {
            state.stateConfigureDetails.status = 'failed'
            state.stateConfigureDetails.error = action.error.message
        })
})
  
export const { } = stateRegisterSlice.actions

export default stateRegisterSlice.reducer