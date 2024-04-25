    import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { InputModuleService } from '../../backend/inputModule';

interface DashboardState {
    employeeDashboardCountsDetails: {
        status: string,
        data: any,
        error: string | null
    },
    employeeInputDashboardDetails: {
        status: string,
        data: any,
        error: string | null
    },
    employeeBackendCountDetails: {
        status: string,
        data: any,
        error: string | null
    }
}

const initialState: DashboardState = { 
    employeeDashboardCountsDetails: {
        status: 'idle',
        data: '',
        error: null
    },
    employeeInputDashboardDetails: {
        status: 'idle',
        data: '',
        error: null
    },
    employeeBackendCountDetails: {
        status: 'idle',
        data: '',
        error: null
    }
} as DashboardState

export const getEmployeeDashboardCounts = createAsyncThunk('inputDashboard/getEmployeeDashboardCounts', async (data: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.getEmployeeDashboardCounts(data);
})

export const getEmployeeInputDashboard = createAsyncThunk('inputDashboard/getEmployeeInputDashboard', async (data: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.getEmployeeInputDashboard(data);
})

export const getEmployeeBackendCount = createAsyncThunk('inputDashboard/getEmployeeBackendCount', async (data: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.getEmployeeBackendCount(data);
})

export const inputDashboardSlice = createSlice({
    name: 'inputDashboard',
    initialState,
    reducers: {
        resetEmployeeDashboardCountsDetailsStatus: (state) => {
            state.employeeDashboardCountsDetails.status = 'idle'
        },
        resetEmployeeInputDashboardDetailsStatus: (state) => {
            state.employeeInputDashboardDetails.status = 'idle'
        },
        resetEmployeeBackendCountDetailsStatus: (state) => {
            state.employeeBackendCountDetails.status = 'idle'
        },
    },
    extraReducers: (builder) => builder
        .addCase(getEmployeeDashboardCounts.pending, (state) => {
            state.employeeDashboardCountsDetails.status = 'loading'
        })
        .addCase(getEmployeeDashboardCounts.fulfilled, (state, action: any) => {
            if(action.payload.data) {
                state.employeeDashboardCountsDetails.status = 'succeeded'
                state.employeeDashboardCountsDetails.data = action.payload.data
            } else {
                state.employeeDashboardCountsDetails.status = 'failed'
                state.employeeDashboardCountsDetails.error = action.payload.message;
            }
        })
        .addCase(getEmployeeDashboardCounts.rejected, (state, action: any) => {
            state.employeeDashboardCountsDetails.status = 'failed'
            state.employeeDashboardCountsDetails.error = action.error.message
        })
        
        .addCase(getEmployeeInputDashboard.pending, (state) => {
            state.employeeInputDashboardDetails.status = 'loading'
        })
        .addCase(getEmployeeInputDashboard.fulfilled, (state, action: any) => {
            if(action.payload.data) {
                state.employeeInputDashboardDetails.status = 'succeeded'
                state.employeeInputDashboardDetails.data = action.payload.data
            } else {
                state.employeeInputDashboardDetails.status = 'failed'
                state.employeeInputDashboardDetails.error = action.payload.message;
            }
        })
        .addCase(getEmployeeInputDashboard.rejected, (state, action: any) => {
            state.employeeInputDashboardDetails.status = 'failed'
            state.employeeInputDashboardDetails.error = action.error.message
        })

        .addCase(getEmployeeBackendCount.pending, (state) => {
            state.employeeBackendCountDetails.status = 'loading'
        })
        .addCase(getEmployeeBackendCount.fulfilled, (state, action: any) => {
            if(action.payload.data) {
                state.employeeBackendCountDetails.status = 'succeeded'
                state.employeeBackendCountDetails.data = action.payload.data
            } else {
                state.employeeBackendCountDetails.status = 'failed'
                state.employeeBackendCountDetails.error = action.payload.message;
            }
        })
        .addCase(getEmployeeBackendCount.rejected, (state, action: any) => {
            state.employeeBackendCountDetails.status = 'failed'
            state.employeeBackendCountDetails.error = action.error.message
        })
})
  
export const { resetEmployeeDashboardCountsDetailsStatus, resetEmployeeInputDashboardDetailsStatus, resetEmployeeBackendCountDetailsStatus } = inputDashboardSlice.actions

export default inputDashboardSlice.reducer