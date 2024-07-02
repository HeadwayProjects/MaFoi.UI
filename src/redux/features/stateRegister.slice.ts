import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { InputModuleService } from '../../backend/inputModule';

interface StateConfigurationState {
    stateRegisterDetails: {
        status: string,
        data: any,
        error: string | null
    },
    stateConfigureDetails: {
        status: string,
        data: any,
        error: string | null
    },
    addStateRegisterDetails: {
        status: string,
        data: any,
        error: string | null
    },
    updateStateRegisterDetails: {
        status: string,
        data: any,
        error: string | null
    } ,
     deleteStateRegisterMappingDetails: {
        status: string,
        data: any,
        error: string | null
    },
    exportFile: {
        status: string,
        data: Blob | null,
        error: string | null
    }
    ,
    importStateRegisterMappingDetails: {
        status: string,
        data: Blob | null,
        error: string | null
    }
}

const initialState: StateConfigurationState = { 
    stateRegisterDetails: {
        status: 'idle',
        data: '',
        error: null
    },
    stateConfigureDetails: {
        status: 'idle',
        data: '',
        error: null
    },
    addStateRegisterDetails: {
        status: 'idle',
        data: '',
        error: null
    },
    updateStateRegisterDetails: {
        status: 'idle',
        data: '',
        error: null
    },deleteStateRegisterMappingDetails: {
        status: 'idle',
        data: '',
        error: null
    },
    exportFile: {
        status: 'idle',
        data: null,
        error: null
    }
,
importStateRegisterMappingDetails: {
        status: 'idle',
        data: null,
        error: null
    }
} as StateConfigurationState

export const getStateRegister = createAsyncThunk('stateRegister/getleaveConfiguration', async (data: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.fetchStateRegister(data);
})

export const getStateConfigurationDetails = createAsyncThunk('inputModule/getStateConfigurationDetails', async (data: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.getStateConfigurationDetails(data)
})

export const addStateRegister = createAsyncThunk('inputModule/addStateRegister', async (data: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.addStateRegister(data)
})

export const updateStateRegister = createAsyncThunk('inputModule/updateStateRegister', async (data: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.updateStateRegister(data)
})

export const deleteStateRegisterMapping = createAsyncThunk('inputModule/deleteStateRegisterMapping', async (id: any) => {

    const inputModuleService = new InputModuleService();
    return await inputModuleService.deleteStateRegisterMapping(id);
})

export const exportStateRegisterMapping = createAsyncThunk('stateRegister/exportStateRegisterMapping', async (url: string) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.exportStateRegisterMapping(url);
})

export const importStateRegisterMapping = createAsyncThunk('stateRegister/importStateRegisterMapping', async (data: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.importStateRegisterMapping(data)
})




export const stateRegisterSlice = createSlice({
    name: 'stateRegister',
    initialState,
    reducers: {
       resetStateConfigDetails: (state) => {
            state.stateConfigureDetails = {
                status: 'idle',
                data: '',
                error: null
            }
       },
       resetAddStateConfigDetails: (state) => {
        state.addStateRegisterDetails = {
            status: 'idle',
            data: '',
            error: null
        }
   }, resetDeleteStateregisterMappingConfigDetails: (state) => {
    state.deleteStateRegisterMappingDetails = {
        status: 'idle',
        data: '',
        error: null
    }
}, resetImportFileDetails: (state) => {
    state.deleteStateRegisterMappingDetails = {
        status: 'idle',
        data: '',
        error: null
    }
},

       resetExportFileDetails: (state) => {
            state.exportFile = {
                status: 'idle',
                data: null,
                error: null
            }
       }
    },
    extraReducers: (builder) => builder
        .addCase(getStateRegister.pending, (state) => {
            state.stateRegisterDetails.status = 'loading'
        })
        .addCase(getStateRegister.fulfilled, (state, action: any) => {
            if(action.payload.data) {
                state.stateRegisterDetails.status = 'succeeded'
                state.stateRegisterDetails.data = action.payload.data
            } else {
                state.stateRegisterDetails.status = 'failed'
                state.stateRegisterDetails.error = action.payload.message;
            }
        })
        .addCase(getStateRegister.rejected, (state, action: any) => {
            state.stateRegisterDetails.status = 'failed'
            state.stateRegisterDetails.error = action.error.message
        })
        
        .addCase(getStateConfigurationDetails.pending, (state) => {
            state.stateConfigureDetails.status = 'loading'
        })
        .addCase(getStateConfigurationDetails.fulfilled, (state, action: any) => {
            if(action.payload.data) {
                state.stateConfigureDetails.status = 'succeeded'
                state.stateConfigureDetails.data = action.payload.data
            } else {
                state.stateConfigureDetails.status = 'failed'
                state.stateConfigureDetails.error = action.payload.message;
            }
        })
        .addCase(getStateConfigurationDetails.rejected, (state, action: any) => {
            state.stateConfigureDetails.status = 'failed'
            state.stateConfigureDetails.error = action.error.message
        })
        
        .addCase(addStateRegister.pending, (state) => {
            state.addStateRegisterDetails.status = 'loading'
        })
        .addCase(addStateRegister.fulfilled, (state, action: any) => {
            if(action.payload.data) {
                state.addStateRegisterDetails.status = 'succeeded'
                state.addStateRegisterDetails.data = action.payload.data
            } else {
                state.addStateRegisterDetails.status = 'failed'
                state.addStateRegisterDetails.error = action.payload.message;
            }
        })
        .addCase(addStateRegister.rejected, (state, action: any) => {
            state.updateStateRegisterDetails.status = 'failed'
            state.updateStateRegisterDetails.error = action.error.message
        })

        .addCase(updateStateRegister.pending, (state) => {
            state.updateStateRegisterDetails.status = 'loading'
        })
        .addCase(updateStateRegister.fulfilled, (state, action: any) => {
            if(action.payload.data) {
                state.updateStateRegisterDetails.status = 'succeeded'
                state.updateStateRegisterDetails.data = action.payload.data
            } else {
                state.updateStateRegisterDetails.status = 'failed'
                state.updateStateRegisterDetails.error = action.payload.message;
            }
        })
        .addCase(updateStateRegister.rejected, (state, action: any) => {
            state.updateStateRegisterDetails.status = 'failed'
            state.updateStateRegisterDetails.error = action.error.message
        })

        .addCase(deleteStateRegisterMapping.pending, (state) => {
            state.deleteStateRegisterMappingDetails.status = 'loading'
        })
        .addCase(deleteStateRegisterMapping.fulfilled, (state, action: any) => {
            if(action.payload.data) {
                state.deleteStateRegisterMappingDetails.status = 'succeeded'
                state.deleteStateRegisterMappingDetails.data = action.payload.data
            } else {
                state.deleteStateRegisterMappingDetails.status = 'failed'
                state.deleteStateRegisterMappingDetails.error = action.payload.message;
            }
        })
        .addCase(deleteStateRegisterMapping.rejected, (state, action: any) => {
            state.deleteStateRegisterMappingDetails.status = 'failed'
            state.deleteStateRegisterMappingDetails.error = action.error.message
        })
        .addCase(exportStateRegisterMapping.pending, (state) => {
            state.exportFile.status = 'loading'
        })
        .addCase(exportStateRegisterMapping.fulfilled, (state, action: any) => {
            state.exportFile.status = 'succeeded'
            state.exportFile.data = action.payload
        })
        .addCase(exportStateRegisterMapping.rejected, (state, action: any) => {
            state.exportFile.status = 'failed'
            state.exportFile.error = action.error.message
        })
        


        .addCase(importStateRegisterMapping.pending, (state) => {
            state.importStateRegisterMappingDetails.status = 'loading'
        })
        .addCase(importStateRegisterMapping.fulfilled, (state, action: any) => {
            state.importStateRegisterMappingDetails.status = 'succeeded'
            state.importStateRegisterMappingDetails.data = action.payload
        })
        .addCase(importStateRegisterMapping.rejected, (state, action: any) => {
            state.importStateRegisterMappingDetails.status = 'failed'
            state.importStateRegisterMappingDetails.error = action.error.message
        })
})
  
export const { resetStateConfigDetails, resetImportFileDetails ,  resetExportFileDetails,resetAddStateConfigDetails,resetDeleteStateregisterMappingConfigDetails} = stateRegisterSlice.actions

export default stateRegisterSlice.reducer