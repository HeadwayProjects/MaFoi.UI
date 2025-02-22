import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { InputModuleService } from '../../backend/inputModule';

interface StateConfigurationState {
    stateRegisterQueDetails: {
        status: string,
        data: any,
        error: string | null
    },
    stateRegisterQueDownloadDetails: {
        status: string,
        data: any,
        error: string | null
    },
    stateRegisterQueExcelandPdfDownloadDetails: {
        status: string,
        data: any,
        error: string | null
    },
    stateConfigureQueDetails: {
        status: string,
        data: any,
        error: string | null
    },
    addStateRegisterQueDetails: {
        status: string,
        data: any,
        error: string | null
    },
    updateStateRegisterQueDetails: {
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
        data: any,
        error: string | null
    }
}

const initialState: StateConfigurationState = { 
    stateRegisterQueDetails: {
        status: 'idle',
        data: '',
        error: null
    },
    stateRegisterQueDownloadDetails: {
        status: 'idle',
        data: '',
        error: null
    },
    stateRegisterQueExcelandPdfDownloadDetails: {
        status: 'idle',
        data: '',
        error: null
    },
    stateConfigureQueDetails: {
        status: 'idle',
        data: '',
        error: null
    },
    addStateRegisterQueDetails: {
        status: 'idle',
        data: '',
        error: null
    },
    updateStateRegisterQueDetails: {
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
        data: '',
        error: null
    }
} as StateConfigurationState

export const getStateRegisterQue = createAsyncThunk('stateRegisterQue/getstateRegisterQue', async (data: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.fetchStateRegisterQue(data);
})
export const getStateRegisterQueDownload = createAsyncThunk('stateRegisterQuedownload/getstateRegisterQueDownload', async (data: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.fetchStateRegisterQueDownload(data);
})
export const getstateRegisterQueExcelandPdfDownloadDetails = createAsyncThunk('stateRegisterQuedownload/GetExcelandPdfZipFileDownload', async (data: any) => {
    const inputModuleService = new InputModuleService();
    return await inputModuleService.fetchStateRegisterQueExcelandPdfDownload(data);
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




export const stateRegisterQueSlice = createSlice({
    name: 'stateRegisterQue',
    initialState,
    reducers: {
       resetStateConfigQueDetails: (state) => {
            state.stateConfigureQueDetails = {
                status: 'idle',
                data: '',
                error: null
            }
       },
       resetstateRegisterQueDownloadDetails: (state) => {
        state.stateRegisterQueDownloadDetails = {
            status: 'idle',
            data: '',
            error: null
        }
   },
   resetstateRegisterQueExcelandPdfDownloadDetails: (state) => {
    state.stateRegisterQueExcelandPdfDownloadDetails = {
        status: 'idle',
        data: '',
        error: null
    }
},
   resetstateRegisterQueDetails: (state) => {
    state.stateRegisterQueDetails = {
        status: 'idle',
        data: '',
        error: null
    }
},
       resetAddStateConfigDetails: (state) => {
        state.addStateRegisterQueDetails = {
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
        .addCase(getStateRegisterQue.pending, (state) => {
            state.stateRegisterQueDetails.status = 'loading'
        })
        .addCase(getStateRegisterQue.fulfilled, (state, action: any) => {
            if(action.payload.data) {
                state.stateRegisterQueDetails.status = 'succeeded'
                state.stateRegisterQueDetails.data = action.payload.data
            } else {
                state.stateRegisterQueDetails.status = 'failed'
                state.stateRegisterQueDetails.error = action.payload.message;
            }
        })
        .addCase(getStateRegisterQue.rejected, (state, action: any) => {
            state.stateRegisterQueDetails.status = 'failed'
            state.stateRegisterQueDetails.error = action.error.message
        })
        




        .addCase(getStateRegisterQueDownload.pending, (state) => {
            state.stateRegisterQueDownloadDetails.status = 'loading'
        })
        .addCase(getStateRegisterQueDownload.fulfilled, (state, action: any) => {
            if(action.payload.data) {
                state.stateRegisterQueDownloadDetails.status = 'succeeded'
                state.stateRegisterQueDownloadDetails.data = action.payload.data
            } else {
                state.stateRegisterQueDownloadDetails.status = 'failed'
                state.stateRegisterQueDownloadDetails.error = action.payload.message;
            }
        })
        .addCase(getStateRegisterQueDownload.rejected, (state, action: any) => {
            state.stateRegisterQueDownloadDetails.status = 'failed'
            state.stateRegisterQueDownloadDetails.error = action.error.message
        })


        .addCase(getstateRegisterQueExcelandPdfDownloadDetails.pending, (state) => {
            state.stateRegisterQueExcelandPdfDownloadDetails.status = 'loading'
        })
        .addCase(getstateRegisterQueExcelandPdfDownloadDetails.fulfilled, (state, action: any) => {
            if(action.payload.data) {
                state.stateRegisterQueExcelandPdfDownloadDetails.status = 'succeeded'
                state.stateRegisterQueExcelandPdfDownloadDetails.data = action.payload.data
            } else {
                state.stateRegisterQueExcelandPdfDownloadDetails.status = 'failed'
                state.stateRegisterQueExcelandPdfDownloadDetails.error = action.payload.message;
            }
        })
        .addCase(getstateRegisterQueExcelandPdfDownloadDetails.rejected, (state, action: any) => {
            state.stateRegisterQueExcelandPdfDownloadDetails.status = 'failed'
            state.stateRegisterQueExcelandPdfDownloadDetails.error = action.error.message
        })












        
        
        // .addCase(getStateConfigurationDetails.pending, (state) => {
        //     state.stateConfigureDetails.status = 'loading'
        // })
        // .addCase(getStateConfigurationDetails.fulfilled, (state, action: any) => {
        //     if(action.payload.data) {
        //         state.stateConfigureDetails.status = 'succeeded'
        //         state.stateConfigureDetails.data = action.payload.data
        //     } else {
        //         state.stateConfigureDetails.status = 'failed'
        //         state.stateConfigureDetails.error = action.payload.message;
        //     }
        // })
        // .addCase(getStateConfigurationDetails.rejected, (state, action: any) => {
        //     state.stateConfigureDetails.status = 'failed'
        //     state.stateConfigureDetails.error = action.error.message
        // })
        
        // .addCase(addStateRegister.pending, (state) => {
        //     state.addStateRegisterDetails.status = 'loading'
        // })
        // .addCase(addStateRegister.fulfilled, (state, action: any) => {
        //     if(action.payload.data) {
        //         state.addStateRegisterDetails.status = 'succeeded'
        //         state.addStateRegisterDetails.data = action.payload.data
        //     } else {
        //         state.addStateRegisterDetails.status = 'failed'
        //         state.addStateRegisterDetails.error = action.payload.message;
        //     }
        // })
        // .addCase(addStateRegister.rejected, (state, action: any) => {
        //     state.updateStateRegisterDetails.status = 'failed'
        //     state.updateStateRegisterDetails.error = action.error.message
        // })

        // .addCase(updateStateRegister.pending, (state) => {
        //     state.updateStateRegisterDetails.status = 'loading'
        // })
        // .addCase(updateStateRegister.fulfilled, (state, action: any) => {
        //     if(action.payload.data) {
        //         state.updateStateRegisterDetails.status = 'succeeded'
        //         state.updateStateRegisterDetails.data = action.payload.data
        //     } else {
        //         state.updateStateRegisterDetails.status = 'failed'
        //         state.updateStateRegisterDetails.error = action.payload.message;
        //     }
        // })
        // .addCase(updateStateRegister.rejected, (state, action: any) => {
        //     state.updateStateRegisterDetails.status = 'failed'
        //     state.updateStateRegisterDetails.error = action.error.message
        // })

        // .addCase(deleteStateRegisterMapping.pending, (state) => {
        //     state.deleteStateRegisterMappingDetails.status = 'loading'
        // })
        // .addCase(deleteStateRegisterMapping.fulfilled, (state, action: any) => {
        //     if(action.payload.data) {
        //         state.deleteStateRegisterMappingDetails.status = 'succeeded'
        //         state.deleteStateRegisterMappingDetails.data = action.payload.data
        //     } else {
        //         state.deleteStateRegisterMappingDetails.status = 'failed'
        //         state.deleteStateRegisterMappingDetails.error = action.payload.message;
        //     }
        // })
        // .addCase(deleteStateRegisterMapping.rejected, (state, action: any) => {
        //     state.deleteStateRegisterMappingDetails.status = 'failed'
        //     state.deleteStateRegisterMappingDetails.error = action.error.message
        // })
        // .addCase(exportStateRegisterMapping.pending, (state) => {
        //     state.exportFile.status = 'loading'
        // })
        // .addCase(exportStateRegisterMapping.fulfilled, (state, action: any) => {
        //     state.exportFile.status = 'succeeded'
        //     state.exportFile.data = action.payload
        // })
        // .addCase(exportStateRegisterMapping.rejected, (state, action: any) => {
        //     state.exportFile.status = 'failed'
        //     state.exportFile.error = action.error.message
        // })
        


        // .addCase(importStateRegisterMapping.pending, (state) => {
        //     state.importStateRegisterMappingDetails.status = 'loading'
        // })
        // .addCase(importStateRegisterMapping.fulfilled, (state, action: any) => {
        //     state.importStateRegisterMappingDetails.status = 'succeeded'
        //     state.importStateRegisterMappingDetails.data = action.payload
        // })
        // .addCase(importStateRegisterMapping.rejected, (state, action: any) => {
        //     state.importStateRegisterMappingDetails.status = 'failed'
        //     state.importStateRegisterMappingDetails.error = action.error.message
        // })
})
  
export const {  resetstateRegisterQueDetails,resetstateRegisterQueExcelandPdfDownloadDetails ,resetStateConfigQueDetails,resetstateRegisterQueDownloadDetails, resetImportFileDetails ,  resetExportFileDetails,resetAddStateConfigDetails,resetDeleteStateregisterMappingConfigDetails} = stateRegisterQueSlice.actions

export default stateRegisterQueSlice.reducer