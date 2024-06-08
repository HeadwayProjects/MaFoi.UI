import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { InputModuleService } from '../../backend/inputModule';

interface HolidayListState {
    holidayListDetails: {
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
    bulkDeleteHolidaysDetails: {
        status: string,
        data: any,
        error: string | null
    }
}

const initialState: HolidayListState = { 
    holidayListDetails: {
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
    bulkDeleteHolidaysDetails: {
        status: 'idle',
        data: '',
        error: null
    }
} as HolidayListState

export const getHolidaysList = createAsyncThunk('holidayList/getHolidaysList', async (data: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.fetchHolidaysList(data);
})

export const deleteHoliday = createAsyncThunk('holidayList/deleteHoliday', async (id: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.deleteHoliday(id);
})

export const addHoliday = createAsyncThunk('holidayList/addHoliday', async (data: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.addHoliday(data);
})

export const uploadHoliday = createAsyncThunk('holidayList/uploadHoliday', async (data: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.uploadHoliday(data);
})

export const editHoliday = createAsyncThunk('holidayList/editHoliday', async (data: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.editHoliday(data);
})

export const bulkDeleteHolidays = createAsyncThunk('holidayList/bulkDeleteHolidays', async (id: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.bulkDeleteHolidays(id);
})

export const holidayListSlice = createSlice({
    name: 'holidayList',
    initialState,
    reducers: {
        resetGetHolidayDetailsStatus: (state) => {
            state.holidayListDetails.status = 'idle'
        },
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
        resetBulkDeleteHolidaysDetails: (state) => {
            state.bulkDeleteHolidaysDetails = {
                status: 'idle',
                data: '',
                error: null
            }
        },
    },
    extraReducers: (builder) => builder
        .addCase(getHolidaysList.pending, (state) => {
            state.holidayListDetails.status = 'loading'
        })
        .addCase(getHolidaysList.fulfilled, (state, action: any) => {
            if(action.payload.data) {
                state.holidayListDetails.status = 'succeeded'
                state.holidayListDetails.data = action.payload.data
            } else {
                state.holidayListDetails.status = 'failed'
                state.holidayListDetails.error = action.payload.message;
            }
        })
        .addCase(getHolidaysList.rejected, (state, action: any) => {
            state.holidayListDetails.status = 'failed'
            state.holidayListDetails.error = action.error.message
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
        
        .addCase(bulkDeleteHolidays.pending, (state) => {
            state.bulkDeleteHolidaysDetails.status = 'loading'
        })
        .addCase(bulkDeleteHolidays.fulfilled, (state, action: any) => {
            if(action.payload) {
                state.bulkDeleteHolidaysDetails.status = 'succeeded'
                state.bulkDeleteHolidaysDetails.data = action.payload.data
            } else {
                state.bulkDeleteHolidaysDetails.status = 'failed'
                state.bulkDeleteHolidaysDetails.error = action.payload.message;
            }
        })
        .addCase(bulkDeleteHolidays.rejected, (state, action: any) => {
            state.bulkDeleteHolidaysDetails.status = 'failed'
            state.bulkDeleteHolidaysDetails.error = action.error.message
        })
})
  
export const {resetGetHolidayDetailsStatus, resetDeleteHolidayDetails, resetAddHolidayDetails, resetUploadHolidayDetails, resetEditHolidayDetails, resetBulkDeleteHolidaysDetails } = holidayListSlice.actions

export default holidayListSlice.reducer