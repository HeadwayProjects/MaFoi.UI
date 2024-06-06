aimport { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { InputModuleService } from '../../backend/inputModule';

interface LeaveConfigurationState {
    leaveConfigurationDetails: {
        status: string,
        data: any,
        error: string | null
    },
    uploadLeavesDetails:{
        status: string,
        data: any,
        error: string | null
    },
    deleteLeaveDetails: {
        status: string,
        data: any,
        error: string | null
    },
    addLeaveDetails: {
        status: string,
        data: any,
        error: string | null
    },
    editLeaveDetails: {
        status: string,
        data: any,
        error: string | null
    },
    bulkDeleteLeaveDetails: {
        status: string,
        data: any,
        error: string | null
    }
}

const initialState: LeaveConfigurationState = { 
    leaveConfigurationDetails: {
        status: 'idle',
        data: '',
        error: null
    },
    uploadLeavesDetails: {
        status: 'idle',
        data: '',
        error: null
    },
    deleteLeaveDetails: {
        status: 'idle',
        data: '',
        error: null
    },
    addLeaveDetails: {
        status: 'idle',
        data: '',
        error: null
    },
    editLeaveDetails: {
        status: 'idle',
        data: '',
        error: null
    },
    bulkDeleteLeaveDetails: {
        status: 'idle',
        data: '',
        error: null
    }
} as LeaveConfigurationState

export const getLeaveConfiguration = createAsyncThunk('leaveConfiguration/getleaveConfiguration', async (data: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.fetchLeaveConfiguration(data);
})

export const uploadLeaves = createAsyncThunk('leaveConfiguration/uploadLeaves', async (data: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.uploadLeaveConfiguration(data);
})

export const deleteLeave = createAsyncThunk('leaveConfiguration/deleteLeave', async (id: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.deleteLeaveConfiguration(id);
})

export const addLeave = createAsyncThunk('leaveConfiguration/addLeave', async (data: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.addLeaveConfiguration(data);
})

export const editLeave = createAsyncThunk('leaveConfiguration/editLeave', async (data: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.editLeaveConfiguration(data);
})
export const bulkDeleteLeaves = createAsyncThunk('Leave/bulkDeleteLeaves', async (id: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.bulkDeleteLeaves(id);
})

export const leaveConfigurationSlice = createSlice({
    name: 'leaveConfiguration',
    initialState,
    reducers: {
        resetGetLeaveDetailsStatus: (state) => {
            state.leaveConfigurationDetails.status = 'idle'
        },
        resetUploadLeavesDetails :  (state) => {
            state.uploadLeavesDetails = {
                status: 'idle',
                data: '',
                error: null
            }
        },
        resetDeleteLeaveDetails: (state) => {
            state.deleteLeaveDetails = {
                status: 'idle',
                data: '',
                error: null
            }
        },
        resetAddLeaveDetails: (state) => {
            state.addLeaveDetails = {
                status: 'idle',
                data: '',
                error: null
            }
        },
        resetEditLeaveDetails: (state) => {
            state.editLeaveDetails = {
                status: 'idle',
                data: '',
                error: null
            }
        },
        resetBulkDeleteLeaveDetails: (state) => {
            state.bulkDeleteLeaveDetails = {
                status: 'idle',
                data: '',
                error: null
            }
        },
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
        
        .addCase(uploadLeaves.pending, (state) => {
            state.uploadLeavesDetails.status = 'loading'
        })
        .addCase(uploadLeaves.fulfilled, (state, action: any) => {
            if(action.payload) {
                state.uploadLeavesDetails.status = 'succeeded'
                state.uploadLeavesDetails.data = action.payload.data
            } else {
                state.uploadLeavesDetails.status = 'failed'
                state.uploadLeavesDetails.error = action.payload.message;
            }
        })
        .addCase(uploadLeaves.rejected, (state, action: any) => {
            state.uploadLeavesDetails.status = 'failed'
            state.uploadLeavesDetails.error = action.error.message
        })

        .addCase(deleteLeave.pending, (state) => {
            state.deleteLeaveDetails.status = 'loading'
        })
        .addCase(deleteLeave.fulfilled, (state, action: any) => {
            if(action.payload) {
                state.deleteLeaveDetails.status = 'succeeded'
                state.deleteLeaveDetails.data = action.payload.data
            } else {
                state.deleteLeaveDetails.status = 'failed'
                state.deleteLeaveDetails.error = action.payload.message;
            }
        })
        .addCase(deleteLeave.rejected, (state, action: any) => {
            state.deleteLeaveDetails.status = 'failed'
            state.deleteLeaveDetails.error = action.error.message
        })

        .addCase(addLeave.pending, (state) => {
            state.addLeaveDetails.status = 'loading'
        })
        .addCase(addLeave.fulfilled, (state, action: any) => {
            if(action.payload) {
                state.addLeaveDetails.status = 'succeeded'
                state.addLeaveDetails.data = action.payload.data
            } else {
                state.addLeaveDetails.status = 'failed'
                state.addLeaveDetails.error = action.payload.message;
            }
        })
        .addCase(addLeave.rejected, (state, action: any) => {
            state.addLeaveDetails.status = 'failed'
            state.addLeaveDetails.error = action.error.message
        })

        .addCase(editLeave.pending, (state) => {
            state.editLeaveDetails.status = 'loading'
        })
        .addCase(editLeave.fulfilled, (state, action: any) => {
            if(action.payload) {
                state.editLeaveDetails.status = 'succeeded'
                state.editLeaveDetails.data = action.payload.data
            } else {
                state.editLeaveDetails.status = 'failed'
                state.editLeaveDetails.error = action.payload.message;
            }
        })
        .addCase(editLeave.rejected, (state, action: any) => {
            state.editLeaveDetails.status = 'failed'
            state.editLeaveDetails.error = action.error.message
        })
        
        .addCase(bulkDeleteLeaves.pending, (state) => {
            state.bulkDeleteLeaveDetails.status = 'loading'
        })
        .addCase(bulkDeleteLeaves.fulfilled, (state, action: any) => {
            if(action.payload) {
                state.bulkDeleteLeaveDetails.status = 'succeeded'
                state.bulkDeleteLeaveDetails.data = action.payload.data
            } else {
                state.bulkDeleteLeaveDetails.status = 'failed'
                state.bulkDeleteLeaveDetails.error = action.payload.message;
            }
        })
        .addCase(bulkDeleteLeaves.rejected, (state, action: any) => {
            state.bulkDeleteLeaveDetails.status = 'failed'
            state.bulkDeleteLeaveDetails.error = action.error.message
        })
})
  
export const { resetGetLeaveDetailsStatus, resetUploadLeavesDetails, resetBulkDeleteLeaveDetails, resetDeleteLeaveDetails, resetAddLeaveDetails, resetEditLeaveDetails} = leaveConfigurationSlice.actions

export default leaveConfigurationSlice.reducer