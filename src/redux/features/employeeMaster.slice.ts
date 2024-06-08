import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { InputModuleService } from '../../backend/inputModule';

interface EmployeeMasterState {
    employeesDetails: {
        status: string,
        data: any,
        error: string | null
    },
    employeesAttendanceDetails: {
        status: string,
        data: any,
        error: string | null
    },
    employeesLeaveCreditDetails: {
        status: string,
        data: any,
        error: string | null
    },
    employeesLeaveAvailedDetails: {
        status: string,
        data: any,
        error: string | null
    },
    employeesWageDetails: {
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
    employeesAttendanceDetails: {
        status: 'idle',
        data: '',
        error: null
    },
    employeesLeaveCreditDetails: {
        status: 'idle',
        data: '',
        error: null
    },
    employeesLeaveAvailedDetails: {
        status: 'idle',
        data: '',
        error: null
    },
    employeesWageDetails: {
        status: 'idle',
        data: '',
        error: null
    }
} as EmployeeMasterState

export const getEmployees = createAsyncThunk('employeeMaster/getEmployees', async (data: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.getEmployees(data);
})

export const getEmployeesAttendance = createAsyncThunk('employeeMaster/getEmployeesAttendance', async (data: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.getEmployeesAttendance(data);
})

export const getEmployeesLeaveCredit = createAsyncThunk('employeeMaster/getEmployeesLeaveCredit', async (data: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.getEmployeesLeaveBalance(data);
})

export const getEmployeesLeaveAvailed = createAsyncThunk('employeeMaster/getEmployeesLeaveAvailed', async (data: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.getEmployeesLeaveAvailed(data);
})

export const getEmployeesWage = createAsyncThunk('employeeMaster/getEmployeesWage', async (data: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.getEmployeesWage(data);
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

        .addCase(getEmployeesAttendance.pending, (state) => {
            state.employeesAttendanceDetails.status = 'loading'
        })
        .addCase(getEmployeesAttendance.fulfilled, (state, action: any) => {
            if(action.payload.data) {
                state.employeesAttendanceDetails.status = 'succeeded'
                state.employeesAttendanceDetails.data = action.payload.data
            } else {
                state.employeesAttendanceDetails.status = 'failed'
                state.employeesAttendanceDetails.error = action.payload.message;
            }
        })
        .addCase(getEmployeesAttendance.rejected, (state, action: any) => {
            state.employeesAttendanceDetails.status = 'failed'
            state.employeesAttendanceDetails.error = action.error.message
        })
        
        .addCase(getEmployeesLeaveCredit.pending, (state) => {
            state.employeesLeaveCreditDetails.status = 'loading'
        })
        .addCase(getEmployeesLeaveCredit.fulfilled, (state, action: any) => {
            if(action.payload.data) {
                state.employeesLeaveCreditDetails.status = 'succeeded'
                state.employeesLeaveCreditDetails.data = action.payload.data
            } else {
                state.employeesLeaveCreditDetails.status = 'failed'
                state.employeesLeaveCreditDetails.error = action.payload.message;
            }
        })
        .addCase(getEmployeesLeaveCredit.rejected, (state, action: any) => {
            state.employeesLeaveCreditDetails.status = 'failed'
            state.employeesLeaveCreditDetails.error = action.error.message
        })

        .addCase(getEmployeesLeaveAvailed.pending, (state) => {
            state.employeesLeaveAvailedDetails.status = 'loading'
        })
        
        .addCase(getEmployeesWage.fulfilled, (state, action: any) => {
            if(action.payload.data) {
                state.employeesWageDetails.status = 'succeeded'
                state.employeesWageDetails.data = action.payload.data
            } else {
                state.employeesWageDetails.status = 'failed'
                state.employeesWageDetails.error = action.payload.message;
            }
        })
        .addCase(getEmployeesWage.rejected, (state, action: any) => {
            state.employeesWageDetails.status = 'failed'
            state.employeesWageDetails.error = action.error.message
        })
})
  
export const { } = employeeMasterSlice.actions

export default employeeMasterSlice.reducer