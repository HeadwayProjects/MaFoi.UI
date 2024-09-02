import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { InputModuleService } from '../../backend/inputModule';

interface ActStateMappingFormState {
    deleteActStateMappingFormdetails : {
        status: string,
        data: any,
        error: string | null
    }
    
}

const initialState: ActStateMappingFormState = { 
    deleteActStateMappingFormdetails : {
        status: 'idle',
        data: '',
        error: null
    }
} as ActStateMappingFormState



export const deleteActStateMappingForm = createAsyncThunk('actStateMapping/DeleteForm', async (data: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.deleteActStateMappingForm(data);
})


export const actStateMappingSlice = createSlice({
    name: 'deleteActStateMappingFormdetails',
    initialState,
    reducers: {
        resetdeleteActStateMappingFormdetailsStatus: (state) => {
            state.deleteActStateMappingFormdetails.status = 'idle'
        }, 
        resetdeleteActStateMappingFormdetails: (state) => {
            state.deleteActStateMappingFormdetails = {
                status: 'idle',
                data: '',
                error: null
            }
        },
        
    },
    extraReducers: (builder) => builder
        .addCase(deleteActStateMappingForm.pending, (state) => {
            state.deleteActStateMappingFormdetails.status = 'loading'
        })
        .addCase(deleteActStateMappingForm.fulfilled, (state, action: any) => {
            if(action.payload.data) {
                state.deleteActStateMappingFormdetails.status = 'succeeded'
                state.deleteActStateMappingFormdetails.data = action.payload.data
            } else {
                state.deleteActStateMappingFormdetails.status = 'failed'
                state.deleteActStateMappingFormdetails.error = action.payload.message;
            }
        })
        .addCase(deleteActStateMappingForm.rejected, (state, action: any) => {
            state.deleteActStateMappingFormdetails.status = 'failed'
            state.deleteActStateMappingFormdetails.error = action.error.message
        })
        
       
        
})
  
export const {resetdeleteActStateMappingFormdetails,resetdeleteActStateMappingFormdetailsStatus } = actStateMappingSlice.actions

export default actStateMappingSlice.reducer