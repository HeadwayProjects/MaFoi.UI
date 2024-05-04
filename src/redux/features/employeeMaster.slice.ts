import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { InputModuleService } from '../../backend/inputModule';

interface EmployeeMasterState {
    employeesDetails: {
        status: string,
        data: any,
        error: string | null
    }
}

const initialState: EmployeeMasterState = { 
    employeesDetails: {
        status: 'idle',
        data: '',
        error: null
    }
} as EmployeeMasterState

export const getEmployees = createAsyncThunk('employeeMaster/getEmployees', async (data: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.getEmployees(data);
})

export const employeeMasterSlice = createSlice({
    name: 'employeeMaster',
    initialState,
    reducers: {
       
    },
    extraReducers: (builder) => builder
        .addCase(getEmployees.pending, (state) => {
            state.employeesDetails.status = 'loading'
        })
        .addCase(getEmployees.fulfilled, (state, action: any) => {
            if(action.payload.data) {
                state.employeesDetails.status = 'succeeded'
                state.employeesDetails.data = action.payload.data
            } else {
                state.employeesDetails.status = 'failed'
                state.employeesDetails.error = action.payload.message;
            }
        })
        .addCase(getEmployees.rejected, (state, action: any) => {
            state.employeesDetails.status = 'failed'
            state.employeesDetails.error = action.error.message
        })
        
})
  
export const { } = employeeMasterSlice.actions

export default employeeMasterSlice.reducer