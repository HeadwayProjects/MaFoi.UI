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
    employeesLeaveBalanceDetails: {
        status: string,
        data: any,
        error: string | null
    },
    employeesLeaveAvailedDetails: {
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
    employeesLeaveBalanceDetails: {
        status: 'idle',
        data: '',
        error: null
    },
    employeesLeaveAvailedDetails: {
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

export const getEmployeesLeaveBalance = createAsyncThunk('employeeMaster/getEmployeesLeaveBalance', async (data: any) => {
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
        
        .addCase(getEmployeesLeaveBalance.pending, (state) => {
            state.employeesLeaveBalanceDetails.status = 'loading'
        })
        .addCase(getEmployeesLeaveBalance.fulfilled, (state, action: any) => {
            if(action.payload.data) {
                state.employeesLeaveBalanceDetails.status = 'succeeded'
                state.employeesLeaveBalanceDetails.data = action.payload.data
            } else {
                state.employeesLeaveBalanceDetails.status = 'failed'
                state.employeesLeaveBalanceDetails.error = action.payload.message;
            }
        })
        .addCase(getEmployeesLeaveBalance.rejected, (state, action: any) => {
            state.employeesLeaveBalanceDetails.status = 'failed'
            state.employeesLeaveBalanceDetails.error = action.error.message
        })

        .addCase(getEmployeesLeaveAvailed.pending, (state) => {
            state.employeesLeaveAvailedDetails.status = 'loading'
        })
        .addCase(getEmployeesLeaveAvailed.fulfilled, (state, action: any) => {
            if(action.payload.data) {
                state.employeesLeaveAvailedDetails.status = 'succeeded'
                state.employeesLeaveAvailedDetails.data = action.payload.data
            } else {
                state.employeesLeaveAvailedDetails.status = 'failed'
                state.employeesLeaveAvailedDetails.error = action.payload.message;
            }
        })
        .addCase(getEmployeesLeaveAvailed.rejected, (state, action: any) => {
            state.employeesLeaveAvailedDetails.status = 'failed'
            state.employeesLeaveAvailedDetails.error = action.error.message
        })
})
  
export const { } = employeeMasterSlice.actions

export default employeeMasterSlice.reducer