import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { InputModuleService } from '../../backend/inputModule';

interface EmployeeMasterState {
    employeesDetails: {
        status: string,
        data: any,
        error: string | null
    },
    employeeUploadDetails: {
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
    },
    employeeUploadDetails: {
        status: 'idle',
        data: '',
        error: null
    }
} as EmployeeMasterState

export const getEmployees = createAsyncThunk('employeeMaster/getEmployees', async (data: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.getEmployees(data);
})

export const employeeUpload = createAsyncThunk('employeeMaster/employeeUpload', async (data: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.employeeUpload(data);
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

        .addCase(employeeUpload.pending, (state) => {
            state.employeeUploadDetails.status = 'loading'
        })
        .addCase(employeeUpload.fulfilled, (state, action: any) => {
            if(action.payload.data) {
                state.employeeUploadDetails.status = 'succeeded'
                state.employeeUploadDetails.data = action.payload.data
            } else {
                state.employeeUploadDetails.status = 'failed'
                state.employeeUploadDetails.error = action.payload.message;
            }
        })
        .addCase(employeeUpload.rejected, (state, action: any) => {
            state.employeeUploadDetails.status = 'failed'
            state.employeeUploadDetails.error = action.error.message
        })
        
})
  
export const { } = employeeMasterSlice.actions

export default employeeMasterSlice.reducer