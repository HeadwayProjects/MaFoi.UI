import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { InputModuleService } from '../../backend/inputModule';

interface LeaveConfigurationState {
    leaveConfigurationDetails: {
        status: string,
        data: any,
        error: string | null
    },
    deleteHolidayDetails: {
        status: string,
        data: any,
        error: string | null
    },
    addHolidayDetails: {
        status: string,
        data: any,
        error: string | null
    },
    uploadHolidayDetails: {
        status: string,
        data: any,
        error: string | null
    },
    editHolidayDetails: {
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
    },
    deleteHolidayDetails: {
        status: 'idle',
        data: '',
        error: null
    },
    addHolidayDetails: {
        status: 'idle',
        data: '',
        error: null
    },
    uploadHolidayDetails: {
        status: 'idle',
        data: '',
        error: null
    },
    editHolidayDetails: {
        status: 'idle',
        data: '',
        error: null
    },
} as LeaveConfigurationState

export const getleaveConfiguration = createAsyncThunk('leaveConfiguration/getleaveConfiguration', async (data: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.fetchLeaveConfiguration(data);
})

export const deleteHoliday = createAsyncThunk('leaveConfiguration/deleteHoliday', async (id: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.deleteHoliday(id);
})

export const addHoliday = createAsyncThunk('leaveConfiguration/addHoliday', async (data: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.addHoliday(data);
})

export const uploadHoliday = createAsyncThunk('leaveConfiguration/uploadHoliday', async (data: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.uploadHoliday(data);
})

export const editHoliday = createAsyncThunk('leaveConfiguration/editHoliday', async (data: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.editHoliday(data);
})

export const leaveConfigurationSlice = createSlice({
    name: 'leaveConfiguration',
    initialState,
    reducers: {
        resetDeleteHolidayDetails: (state) => {
            state.deleteHolidayDetails = {
                status: 'idle',
                data: '',
                error: null
            }
        },
        resetAddHolidayDetails :  (state) => {
            state.addHolidayDetails = {
                status: 'idle',
                data: '',
                error: null
            }
        },
        resetUploadHolidayDetails :  (state) => {
            state.uploadHolidayDetails = {
                status: 'idle',
                data: '',
                error: null
            }
        },
        resetEditHolidayDetails: (state) => {
            state.editHolidayDetails = {
                status: 'idle',
                data: '',
                error: null
            }
        },
    },
    extraReducers: (builder) => builder
        .addCase(getleaveConfiguration.pending, (state) => {
            state.leaveConfigurationDetails.status = 'loading'
        })
        .addCase(getleaveConfiguration.fulfilled, (state, action: any) => {
            if(action.payload.data) {
                state.leaveConfigurationDetails.status = 'succeeded'
                state.leaveConfigurationDetails.data = action.payload.data
            } else {
                state.leaveConfigurationDetails.status = 'failed'
                state.leaveConfigurationDetails.error = action.payload.message;
            }
        })
        .addCase(getleaveConfiguration.rejected, (state, action: any) => {
            state.leaveConfigurationDetails.status = 'failed'
            state.leaveConfigurationDetails.error = action.error.message
        })
        
        .addCase(deleteHoliday.pending, (state) => {
            state.deleteHolidayDetails.status = 'loading'
        })
        .addCase(deleteHoliday.fulfilled, (state, action: any) => {
            if(action.payload) {
                state.deleteHolidayDetails.status = 'succeeded'
                state.deleteHolidayDetails.data = action.payload.data
            } else {
                state.deleteHolidayDetails.status = 'failed'
                state.deleteHolidayDetails.error = action.payload.message;
            }
        })
        .addCase(deleteHoliday.rejected, (state, action: any) => {
            state.deleteHolidayDetails.status = 'failed'
            state.deleteHolidayDetails.error = action.error.message
        })
       
        .addCase(addHoliday.pending, (state) => {
            state.addHolidayDetails.status = 'loading'
        })
        .addCase(addHoliday.fulfilled, (state, action: any) => {
            if(action.payload) {
                state.addHolidayDetails.status = 'succeeded'
                state.addHolidayDetails.data = action.payload.data
            } else {
                state.addHolidayDetails.status = 'failed'
                state.addHolidayDetails.error = action.payload.message;
            }
        })
        .addCase(addHoliday.rejected, (state, action: any) => {
            state.addHolidayDetails.status = 'failed'
            state.addHolidayDetails.error = action.error.message
        })

        .addCase(uploadHoliday.pending, (state) => {
            state.uploadHolidayDetails.status = 'loading'
        })
        .addCase(uploadHoliday.fulfilled, (state, action: any) => {
            if(action.payload) {
                state.uploadHolidayDetails.status = 'succeeded'
                state.uploadHolidayDetails.data = action.payload.data
            } else {
                state.uploadHolidayDetails.status = 'failed'
                state.uploadHolidayDetails.error = action.payload.message;
            }
        })
        .addCase(uploadHoliday.rejected, (state, action: any) => {
            state.uploadHolidayDetails.status = 'failed'
            state.uploadHolidayDetails.error = action.error.message
        })
        
        .addCase(editHoliday.pending, (state) => {
            state.editHolidayDetails.status = 'loading'
        })
        .addCase(editHoliday.fulfilled, (state, action: any) => {
            if(action.payload) {
                state.editHolidayDetails.status = 'succeeded'
                state.editHolidayDetails.data = action.payload.data
            } else {
                state.editHolidayDetails.status = 'failed'
                state.editHolidayDetails.error = action.payload.message;
            }
        })
        .addCase(editHoliday.rejected, (state, action: any) => {
            state.editHolidayDetails.status = 'failed'
            state.editHolidayDetails.error = action.error.message
        })
})
  
export const {resetDeleteHolidayDetails, resetAddHolidayDetails, resetUploadHolidayDetails, resetEditHolidayDetails } = leaveConfigurationSlice.actions

export default leaveConfigurationSlice.reducer