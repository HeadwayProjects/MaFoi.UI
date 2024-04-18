import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { InputModuleService } from '../../backend/inputModule';

interface LeaveConfigurationState {
    leaveConfigurationDetails: {
        status: string,
        data: any,
        error: string | null
    },
}

const initialState: LeaveConfigurationState = { 
    leaveConfigurationDetails: {
        status: 'idle',
        data: '',
        error: null
    }
} as LeaveConfigurationState

export const getLeaveConfiguration = createAsyncThunk('leaveConfiguration/getleaveConfiguration', async (data: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.fetchLeaveConfiguration(data);
})

export const leaveConfigurationSlice = createSlice({
    name: 'leaveConfiguration',
    initialState,
    reducers: {
       
    },
    extraReducers: (builder) => builder
        .addCase(getLeaveConfiguration.pending, (state) => {
            state.leaveConfigurationDetails.status = 'loading'
        })
        .addCase(getLeaveConfiguration.fulfilled, (state, action: any) => {
            if(action.payload.data) {
                state.leaveConfigurationDetails.status = 'succeeded'
                state.leaveConfigurationDetails.data = action.payload.data
            } else {
                state.leaveConfigurationDetails.status = 'failed'
                state.leaveConfigurationDetails.error = action.payload.message;
            }
        })
        .addCase(getLeaveConfiguration.rejected, (state, action: any) => {
            state.leaveConfigurationDetails.status = 'failed'
            state.leaveConfigurationDetails.error = action.error.message
        })
        
})
  
export const { } = leaveConfigurationSlice.actions

export default leaveConfigurationSlice.reducer