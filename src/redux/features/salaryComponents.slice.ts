import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { InputModuleService } from '../../backend/inputModule';

interface SalaryComponentsState {
    salaryUploadDetails: {
        status: string,
        data: any,
        error: string | null
    },
    salaryConfigUploadDetails: {
        status: string,
        data: any,
        error: string | null
    },
    salaryExcelHeaderToDbColumnsDetails:{
        status: string,
        data: any,
        error: string | null
    }
}

const initialState: SalaryComponentsState = { 
    salaryUploadDetails: {
        status: 'idle',
        data: '',
        error: null
    },
    salaryConfigUploadDetails: {
        status: 'idle',
        data: '',
        error: null
    },
    salaryExcelHeaderToDbColumnsDetails:{
        status: 'idle',
        data: '',
        error: null
    }

} as SalaryComponentsState

export const salaryComponentUpload = createAsyncThunk('salaryComponent/salaryComponentUpload', async (data: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.salaryComponentUpload(data);
})

export const callSalaryComponentsExcelHeaderToDbColumns = createAsyncThunk('salaryComponent/callSalaryComponentsExcelHeaderToDbColumns', async (data: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.callSalaryComponentsExcelHeaderToDbColumns(data);
})

export const salaryComponentConfigUpload = createAsyncThunk('salaryComponent/salaryComponentConfigUpload', async (data: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.salaryComponentConfigUpload(data);
})

export const salaryComponentSlice = createSlice({
    name: 'salaryComponent',
    initialState,
    reducers: {
       resetSalaryUploadDetails: (state) => {
            state.salaryUploadDetails = {
                status: 'idle',
                data: '',
                error: null
            }
       },
       resetSalaryConfigUploadDetails: (state) => {
            state.salaryConfigUploadDetails = {
                status: 'idle',
                data: '',
                error: null
            }
        },
        resetSalaryExcelToDBColumnsDetails: (state) => {
            state.salaryExcelHeaderToDbColumnsDetails = {
                status: 'idle',
                data: '',
                error: null
            }
        }
    },
    extraReducers: (builder) => builder
        .addCase(salaryComponentUpload.pending, (state) => {
            state.salaryUploadDetails.status = 'loading'
        })
        .addCase(salaryComponentUpload.fulfilled, (state, action: any) => {
            if(action.payload.data) {
                state.salaryUploadDetails.status = 'succeeded'
                state.salaryUploadDetails.data = action.payload.data
            } else {
                state.salaryUploadDetails.status = 'failed'
                state.salaryUploadDetails.error = action.payload.message;
            }
        })
        .addCase(salaryComponentUpload.rejected, (state, action: any) => {
            state.salaryUploadDetails.status = 'failed'
            state.salaryUploadDetails.error = action.error.message
        })

        .addCase(salaryComponentConfigUpload.pending, (state) => {
            state.salaryConfigUploadDetails.status = 'loading'
        })
        .addCase(salaryComponentConfigUpload.fulfilled, (state, action: any) => {
            if(action.payload.data) {
                state.salaryConfigUploadDetails.status = 'succeeded'
                state.salaryConfigUploadDetails.data = action.payload.data
            } else {
                state.salaryConfigUploadDetails.status = 'failed'
                state.salaryConfigUploadDetails.error = action.payload.message;
            }
        })
        .addCase(salaryComponentConfigUpload.rejected, (state, action: any) => {
            state.salaryConfigUploadDetails.status = 'failed'
            state.salaryConfigUploadDetails.error = action.error.message
        })

        .addCase(callSalaryComponentsExcelHeaderToDbColumns.pending, (state) => {
            state.salaryExcelHeaderToDbColumnsDetails.status = 'loading'
        })
        .addCase(callSalaryComponentsExcelHeaderToDbColumns.fulfilled, (state, action: any) => {
            if(action.payload.data) {
                state.salaryExcelHeaderToDbColumnsDetails.status = 'succeeded'
                state.salaryExcelHeaderToDbColumnsDetails.data = action.payload.data
            } else {
                state.salaryExcelHeaderToDbColumnsDetails.status = 'failed'
                state.salaryExcelHeaderToDbColumnsDetails.error = action.payload.message;
            }
        })
        .addCase(callSalaryComponentsExcelHeaderToDbColumns.rejected, (state, action: any) => {
            state.salaryExcelHeaderToDbColumnsDetails.status = 'failed'
            state.salaryExcelHeaderToDbColumnsDetails.error = action.error.message
        })
        
})
  
export const { resetSalaryUploadDetails, resetSalaryConfigUploadDetails, resetSalaryExcelToDBColumnsDetails } = salaryComponentSlice.actions

export default salaryComponentSlice.reducer