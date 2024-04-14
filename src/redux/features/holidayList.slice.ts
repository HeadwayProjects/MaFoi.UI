import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { InputModuleService } from '../../backend/inputModule';

interface HolidayListState {
    holidayListDetails: {
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
    }
} as HolidayListState

export const getHolidaysList = createAsyncThunk('holidayList/getHolidaysList', async (data: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.fetchHolidaysList(data);
})


export const holidayListSlice = createSlice({
    name: 'holidayList',
    initialState,
    reducers: {
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
       
})
  
export const { } = holidayListSlice.actions

export default holidayListSlice.reducer