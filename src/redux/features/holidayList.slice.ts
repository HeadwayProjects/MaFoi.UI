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

export const holidayListSlice = createSlice({
    name: 'holidayList',
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
    },
    extraReducers: (builder) => builder
        .addCase(getHolidaysList.pending, (state) => {
            state.holidayListDetails.status = 'loading'
        })
        .addCase(getHolidaysList.fulfilled, (state, action: any) => {
            if(action.payload) {
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
       
})
  
export const {resetDeleteHolidayDetails, resetAddHolidayDetails } = holidayListSlice.actions

export default holidayListSlice.reducer