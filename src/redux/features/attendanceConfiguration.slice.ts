import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { InputModuleService } from '../../backend/inputModule';

interface AttendanceConfigurationState {
    attendanceConfigurationDetails: {
        status: string,
        data: any,
        error: string | null
    },
    uploadAttendanceDetails:{
        status: string,
        data: any,
        error: string | null
    },
    deleteAttendanceDetails: {
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
    },
    uploadAttendanceDetails: {
        status: 'idle',
        data: '',
        error: null
    },
    deleteAttendanceDetails: {
        status: 'idle',
        data: '',
        error: null
    },
} as AttendanceConfigurationState

export const getAttendanceConfiguration = createAsyncThunk('attendanceConfiguration/getAttendanceConfiguration', async (data: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.fetchAttendanceConfiguration(data);
})

export const uploadAttendance = createAsyncThunk('attendanceConfiguration/uploadAttendance', async (data: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.uploadAttendanceConfiguration(data);
})

export const deleteAttendance = createAsyncThunk('holidayList/deleteHoliday', async (id: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.deleteAttendanceConfiguration(id);
})

export const attendanceConfigurationSlice = createSlice({
    name: 'attendanceConfiguration',
    initialState,
    reducers: {
        resetUploadAttendanceDetails :  (state) => {
            state.uploadAttendanceDetails = {
                status: 'idle',
                data: '',
                error: null
            }
        },
        resetDeleteAttendanceDetails: (state) => {
            state.deleteAttendanceDetails = {
                status: 'idle',
                data: '',
                error: null
            }
        },
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
        
        .addCase(uploadAttendance.pending, (state) => {
            state.uploadAttendanceDetails.status = 'loading'
        })
        .addCase(uploadAttendance.fulfilled, (state, action: any) => {
            if(action.payload) {
                state.uploadAttendanceDetails.status = 'succeeded'
                state.uploadAttendanceDetails.data = action.payload.data
            } else {
                state.uploadAttendanceDetails.status = 'failed'
                state.uploadAttendanceDetails.error = action.payload.message;
            }
        })
        .addCase(uploadAttendance.rejected, (state, action: any) => {
            state.uploadAttendanceDetails.status = 'failed'
            state.uploadAttendanceDetails.error = action.error.message
        })

        .addCase(deleteAttendance.pending, (state) => {
            state.deleteAttendanceDetails.status = 'loading'
        })
        .addCase(deleteAttendance.fulfilled, (state, action: any) => {
            if(action.payload) {
                state.deleteAttendanceDetails.status = 'succeeded'
                state.deleteAttendanceDetails.data = action.payload.data
            } else {
                state.deleteAttendanceDetails.status = 'failed'
                state.deleteAttendanceDetails.error = action.payload.message;
            }
        })
        .addCase(deleteAttendance.rejected, (state, action: any) => {
            state.deleteAttendanceDetails.status = 'failed'
            state.deleteAttendanceDetails.error = action.error.message
        })
})
  
export const { resetUploadAttendanceDetails, resetDeleteAttendanceDetails } = attendanceConfigurationSlice.actions

export default attendanceConfigurationSlice.reducer