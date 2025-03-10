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
    },
    bulkDeleteEmployeeDetails: {
        status: string,
        data: any,
        error: string | null
    },
    bulkDeleteLeaveBalance: {
        status: string,
        data: any,
        error: string | null
    },
    bulkDeleteLeaveAvailed: {
        status: string,
        data: any,
        error: string | null
    },
    bulkDeleteEmployeeAttendance: {
        status: string,
        data: any,
        error: string | null
    },
    bulkDeleteEmployeeWage: {
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
    },
      bulkDeleteEmployeeDetails: {
        status: 'idle',
        data: '',
        error: null
    },
    bulkDeleteLeaveBalance: {
        status: 'idle',
        data: '',
        error: null
    },
    bulkDeleteLeaveAvailed: {
        status: 'idle',
        data: '',
        error: null
    },
    bulkDeleteEmployeeAttendance: {
        status: 'idle',
        data: '',
        error: null
    },
    bulkDeleteEmployeeWage: {
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
export const bulkDeleteEmployees = createAsyncThunk('employeeMaster/bulkDeleteEmployees', async (id: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.bulkDeleteEmployees(id);
})

export const bulkDeleteLeaveBalance = createAsyncThunk('employeeMaster/bulkDeleteLeaveBalance', async (id: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.bulkDeleteLeaveBalance(id);
})

export const bulkDeleteLeaveAvailed = createAsyncThunk('employeeMaster/bulkDeleteLeaveAvailed', async (id: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.bulkDeleteLeaveAvailed(id);
})

export const bulkDeleteEmployeeAttendance = createAsyncThunk('employeeMaster/bulkDeleteEmployeeAttendance', async (id: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.bulkDeleteEmployeeAttendance(id);
})

export const bulkDeleteEmployeeWage = createAsyncThunk('employeeMaster/bulkDeleteEmployeeWage', async (id: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.bulkDeleteEmployeeWage(id);
})


export const employeeMasterSlice = createSlice({
    name: 'employeeMaster',
    initialState,
    reducers: {
        resetBulkDeleteEmployees: (state) => {
            state.bulkDeleteEmployeeDetails = {
                status: 'idle',
                data: '',
                error: null
            }
        },
       
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


        

        .addCase(getEmployeesWage.pending, (state) => {
            state.employeesWageDetails.status = 'loading'
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

        
    
        .addCase(bulkDeleteEmployees.pending, (state) => {
            state.bulkDeleteEmployeeDetails.status = 'loading'
        })
        .addCase(bulkDeleteEmployees.fulfilled, (state, action: any) => {
            if (action.payload) {
                state.bulkDeleteEmployeeDetails.status = 'succeeded'
                state.bulkDeleteEmployeeDetails.data = action.payload.data
            } else {
                state.bulkDeleteEmployeeDetails.status = 'failed'
                state.bulkDeleteEmployeeDetails.error = action.payload.message;
            }
        })
        .addCase(bulkDeleteEmployees.rejected, (state, action: any) => {
            state.bulkDeleteEmployeeDetails.status = 'failed'
            state.bulkDeleteEmployeeDetails.error = action.error.message
        })
    
        .addCase(bulkDeleteLeaveBalance.pending, (state) => {
            state.bulkDeleteLeaveBalance.status = 'loading'
        })
        .addCase(bulkDeleteLeaveBalance.fulfilled, (state, action: any) => {
            if (action.payload) {
                state.bulkDeleteLeaveBalance.status = 'succeeded'
                state.bulkDeleteLeaveBalance.data = action.payload.data
            } else {
                state.bulkDeleteLeaveBalance.status = 'failed'
                state.bulkDeleteLeaveBalance.error = action.payload.message;
            }
        })
        .addCase(bulkDeleteLeaveBalance.rejected, (state, action: any) => {
            state.bulkDeleteLeaveBalance.status = 'failed'
            state.bulkDeleteLeaveBalance.error = action.error.message
        })
    
        .addCase(bulkDeleteLeaveAvailed.pending, (state) => {
            state.bulkDeleteLeaveAvailed.status = 'loading'
        })
        .addCase(bulkDeleteLeaveAvailed.fulfilled, (state, action: any) => {
            if (action.payload) {
                state.bulkDeleteLeaveAvailed.status = 'succeeded'
                state.bulkDeleteLeaveAvailed.data = action.payload.data
            } else {
                state.bulkDeleteLeaveAvailed.status = 'failed'
                state.bulkDeleteLeaveAvailed.error = action.payload.message;
            }
        })
        .addCase(bulkDeleteLeaveAvailed.rejected, (state, action: any) => {
            state.bulkDeleteLeaveAvailed.status = 'failed'
            state.bulkDeleteLeaveAvailed.error = action.error.message
        })
    
        .addCase(bulkDeleteEmployeeAttendance.pending, (state) => {
            state.bulkDeleteEmployeeAttendance.status = 'loading'
        })
        .addCase(bulkDeleteEmployeeAttendance.fulfilled, (state, action: any) => {
            if (action.payload) {
                state.bulkDeleteEmployeeAttendance.status = 'succeeded'
                state.bulkDeleteEmployeeAttendance.data = action.payload.data
            } else {
                state.bulkDeleteEmployeeAttendance.status = 'failed'
                state.bulkDeleteEmployeeAttendance.error = action.payload.message;
            }
        })
        .addCase(bulkDeleteEmployeeAttendance.rejected, (state, action: any) => {
            state.bulkDeleteEmployeeAttendance.status = 'failed'
            state.bulkDeleteEmployeeAttendance.error = action.error.message
        })
    
        .addCase(bulkDeleteEmployeeWage.pending, (state) => {
            state.bulkDeleteEmployeeWage.status = 'loading'
        })
        .addCase(bulkDeleteEmployeeWage.fulfilled, (state, action: any) => {
            if (action.payload) {
                state.bulkDeleteEmployeeWage.status = 'succeeded'
                state.bulkDeleteEmployeeWage.data = action.payload.data
            } else {
                state.bulkDeleteEmployeeWage.status = 'failed'
                state.bulkDeleteEmployeeWage.error = action.payload.message;
            }
        })
        .addCase(bulkDeleteEmployeeWage.rejected, (state, action: any) => {
            state.bulkDeleteEmployeeWage.status = 'failed'
            state.bulkDeleteEmployeeWage.error = action.error.message
        })

        
     
})

  
export const { resetBulkDeleteEmployees } = employeeMasterSlice.actions

export default employeeMasterSlice.reducer