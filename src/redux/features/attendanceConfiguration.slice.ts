import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { InputModuleService } from '../../backend/inputModule';

interface AttendanceConfigurationState {
    attendanceConfigurationDetails: {
        status: string,
        data: any,
        error: string | null
    },
}

const initialState: AttendanceConfigurationState = { 
    attendanceConfigurationDetails: {
        status: 'idle',
        data: '',
        error: null
    }
} as AttendanceConfigurationState

export const getAttendanceConfiguration = createAsyncThunk('attendanceConfiguration/getAttendanceConfiguration', async (data: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.fetchAttendanceConfiguration(data);
})

export const attendanceConfigurationSlice = createSlice({
    name: 'attendanceConfiguration',
    initialState,
    reducers: {
       
    },
    extraReducers: (builder) => builder
        .addCase(getAttendanceConfiguration.pending, (state) => {
            state.attendanceConfigurationDetails.status = 'loading'
        })
        .addCase(getAttendanceConfiguration.fulfilled, (state, action: any) => {
            if(action.payload.data) {
                state.attendanceConfigurationDetails.status = 'succeeded'
                state.attendanceConfigurationDetails.data = action.payload.data
            } else {
                state.attendanceConfigurationDetails.status = 'failed'
                state.attendanceConfigurationDetails.error = action.payload.message;
            }
        })
        .addCase(getAttendanceConfiguration.rejected, (state, action: any) => {
            state.attendanceConfigurationDetails.status = 'failed'
            state.attendanceConfigurationDetails.error = action.error.message
        })
        
})
  
export const { } = attendanceConfigurationSlice.actions

export default attendanceConfigurationSlice.reducer