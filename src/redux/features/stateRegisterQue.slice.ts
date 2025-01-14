// import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
// import { InputModuleService } from '../../backend/inputModule';

// interface StateConfigurationState {
//     stateRegisterQueDetails: {
//         status: string,
//         data: any,
//         error: string | null
//     },
//     stateRegisterQueDownloadDetails: {
//         status: string,
//         data: any,
//         error: string | null
//     },
//     stateConfigureDetails: {
//         status: string,
//         data: any,
//         error: string | null
//     },
//     addstateRegisterQueDetails: {
//         status: string,
//         data: any,
//         error: string | null
//     },
//     updatestateRegisterQueDetails: {
//         status: string,
//         data: any,
//         error: string | null
//     } ,
//      deletestateRegisterQueMappingDetails: {
//         status: string,
//         data: any,
//         error: string | null
//     },
//     exportFile: {
//         status: string,
//         data: Blob | null,
//         error: string | null
//     }
//     ,
//     importstateRegisterQueMappingDetails: {
//         status: string,
//         data: any,
//         error: string | null
//     }
// }

// const initialState: StateConfigurationState = { 
//     stateRegisterQueDetails: {
//         status: 'idle',
//         data: '',
//         error: null
//     },
//     stateRegisterQueDownloadDetails: {
//         status: 'idle',
//         data: '',
//         error: null
//     },
//     stateConfigureDetails: {
//         status: 'idle',
//         data: '',
//         error: null
//     },
//     addstateRegisterQueDetails: {
//         status: 'idle',
//         data: '',
//         error: null
//     },
//     updatestateRegisterQueDetails: {
//         status: 'idle',
//         data: '',
//         error: null
//     },deletestateRegisterQueMappingDetails: {
//         status: 'idle',
//         data: '',
//         error: null
//     },
//     exportFile: {
//         status: 'idle',
//         data: null,
//         error: null
//     }
// ,
// importstateRegisterQueMappingDetails: {
//         status: 'idle',
//         data: '',
//         error: null
//     }
// } as StateConfigurationState

// export const getstateRegisterQue = createAsyncThunk('stateRegisterQue/getleaveConfiguration', async (data: any) => {
//     const inputModuleService = new InputModuleService();
//     return await inputModuleService.fetchStateRegisterQue(data);
// })
// export const getstateRegisterQueDownload = createAsyncThunk('stateRegisterQuedownload/getleaveConfiguration', async (data: any) => {
//     const inputModuleService = new InputModuleService();
//     return await inputModuleService.fetchStateRegisterQueDownload(data);
// })

// export const getStateConfigurationDetails = createAsyncThunk('inputModule/getStateConfigurationDetails', async (data: any) => {
//     const inputModuleService = new InputModuleService();
//     return await inputModuleService.getStateConfigurationDetails(data)
// })

// export const addstateRegisterQue = createAsyncThunk('inputModule/addstateRegisterQue', async (data: any) => {
//     const inputModuleService = new InputModuleService();
//     return await inputModuleService.addStateRegisterQue(data)
// })

// export const updatestateRegisterQue = createAsyncThunk('inputModule/updatestateRegisterQue', async (data: any) => {
//     const inputModuleService = new InputModuleService();
//     return await inputModuleService.updateStateRegisterQue(data)
// })

// export const deletestateRegisterQueMapping = createAsyncThunk('inputModule/deletestateRegisterQueMapping', async (id: any) => {

//     const inputModuleService = new InputModuleService();
//     return await inputModuleService.deleteStateRegisterMapping(id);
// })

// export const exportstateRegisterQueMapping = createAsyncThunk('stateRegisterQue/exportstateRegisterQueMapping', async (url: string) => {
//     const inputModuleService = new InputModuleService();
//     return await inputModuleService.exportStateRegisterMapping(url);
// })

// export const importstateRegisterQueMapping = createAsyncThunk('stateRegisterQue/importstateRegisterQueMapping', async (data: any) => {
//     const inputModuleService = new InputModuleService();
//     return await inputModuleService.importStateRegisterMapping(data)
// })




// export const stateRegisterQueSlice = createSlice({
//     name: 'stateRegisterQue',
//     initialState,
//     reducers: {
//        resetStateConfigDetails: (state) => {
//             state.stateConfigureDetails = {
//                 status: 'idle',
//                 data: '',
//                 error: null
//             }
//        },
//        resetstateRegisterQueDownloadDetails: (state) => {
//         state.stateRegisterQueDownloadDetails = {
//             status: 'idle',
//             data: '',
//             error: null
//         }
//    },
//        resetAddStateConfigDetails: (state) => {
//         state.addstateRegisterQueDetails = {
//             status: 'idle',
//             data: '',
//             error: null
//         }
//    }, resetDeletestateRegisterQueMappingConfigDetails: (state) => {
//     state.deletestateRegisterQueMappingDetails = {
//         status: 'idle',
//         data: '',
//         error: null
//     }
// }, resetImportFileDetails: (state) => {
//     state.deletestateRegisterQueMappingDetails = {
//         status: 'idle',
//         data: '',
//         error: null
//     }
// },

//        resetExportFileDetails: (state) => {
//             state.exportFile = {
//                 status: 'idle',
//                 data: null,
//                 error: null
//             }
//        }
//     },
//     extraReducers: (builder) => builder
//         .addCase(getstateRegisterQue.pending, (state) => {
//             state.stateRegisterQueDetails.status = 'loading'
//         })
//         .addCase(getstateRegisterQue.fulfilled, (state, action: any) => {
//             if(action.payload.data) {
//                 state.stateRegisterQueDetails.status = 'succeeded'
//                 state.stateRegisterQueDetails.data = action.payload.data
//             } else {
//                 state.stateRegisterQueDetails.status = 'failed'
//                 state.stateRegisterQueDetails.error = action.payload.message;
//             }
//         })
//         .addCase(getstateRegisterQue.rejected, (state, action: any) => {
//             state.stateRegisterQueDetails.status = 'failed'
//             state.stateRegisterQueDetails.error = action.error.message
//         })
        




//         .addCase(getstateRegisterQueDownload.pending, (state) => {
//             state.stateRegisterQueDownloadDetails.status = 'loading'
//         })
//         .addCase(getstateRegisterQueDownload.fulfilled, (state, action: any) => {
//             if(action.payload.data) {
//                 state.stateRegisterQueDownloadDetails.status = 'succeeded'
//                 state.stateRegisterQueDownloadDetails.data = action.payload.data
//             } else {
//                 state.stateRegisterQueDownloadDetails.status = 'failed'
//                 state.stateRegisterQueDownloadDetails.error = action.payload.message;
//             }
//         })
//         .addCase(getstateRegisterQueDownload.rejected, (state, action: any) => {
//             state.stateRegisterQueDownloadDetails.status = 'failed'
//             state.stateRegisterQueDownloadDetails.error = action.error.message
//         })












        
        
//         .addCase(getStateConfigurationDetails.pending, (state) => {
//             state.stateConfigureDetails.status = 'loading'
//         })
//         .addCase(getStateConfigurationDetails.fulfilled, (state, action: any) => {
//             if(action.payload.data) {
//                 state.stateConfigureDetails.status = 'succeeded'
//                 state.stateConfigureDetails.data = action.payload.data
//             } else {
//                 state.stateConfigureDetails.status = 'failed'
//                 state.stateConfigureDetails.error = action.payload.message;
//             }
//         })
//         .addCase(getStateConfigurationDetails.rejected, (state, action: any) => {
//             state.stateConfigureDetails.status = 'failed'
//             state.stateConfigureDetails.error = action.error.message
//         })
        
//         .addCase(addstateRegisterQue.pending, (state) => {
//             state.addstateRegisterQueDetails.status = 'loading'
//         })
//         .addCase(addstateRegisterQue.fulfilled, (state, action: any) => {
//             if(action.payload.data) {
//                 state.addstateRegisterQueDetails.status = 'succeeded'
//                 state.addstateRegisterQueDetails.data = action.payload.data
//             } else {
//                 state.addstateRegisterQueDetails.status = 'failed'
//                 state.addstateRegisterQueDetails.error = action.payload.message;
//             }
//         })
//         .addCase(addstateRegisterQue.rejected, (state, action: any) => {
//             state.updatestateRegisterQueDetails.status = 'failed'
//             state.updatestateRegisterQueDetails.error = action.error.message
//         })

//         .addCase(updatestateRegisterQue.pending, (state) => {
//             state.updatestateRegisterQueDetails.status = 'loading'
//         })
//         .addCase(updatestateRegisterQue.fulfilled, (state, action: any) => {
//             if(action.payload.data) {
//                 state.updatestateRegisterQueDetails.status = 'succeeded'
//                 state.updatestateRegisterQueDetails.data = action.payload.data
//             } else {
//                 state.updatestateRegisterQueDetails.status = 'failed'
//                 state.updatestateRegisterQueDetails.error = action.payload.message;
//             }
//         })
//         .addCase(updatestateRegisterQue.rejected, (state, action: any) => {
//             state.updatestateRegisterQueDetails.status = 'failed'
//             state.updatestateRegisterQueDetails.error = action.error.message
//         })

//         .addCase(deletestateRegisterQueMapping.pending, (state) => {
//             state.deletestateRegisterQueMappingDetails.status = 'loading'
//         })
//         .addCase(deletestateRegisterQueMapping.fulfilled, (state, action: any) => {
//             if(action.payload.data) {
//                 state.deletestateRegisterQueMappingDetails.status = 'succeeded'
//                 state.deletestateRegisterQueMappingDetails.data = action.payload.data
//             } else {
//                 state.deletestateRegisterQueMappingDetails.status = 'failed'
//                 state.deletestateRegisterQueMappingDetails.error = action.payload.message;
//             }
//         })
//         .addCase(deletestateRegisterQueMapping.rejected, (state, action: any) => {
//             state.deletestateRegisterQueMappingDetails.status = 'failed'
//             state.deletestateRegisterQueMappingDetails.error = action.error.message
//         })
//         .addCase(exportstateRegisterQueMapping.pending, (state) => {
//             state.exportFile.status = 'loading'
//         })
//         .addCase(exportstateRegisterQueMapping.fulfilled, (state, action: any) => {
//             state.exportFile.status = 'succeeded'
//             state.exportFile.data = action.payload
//         })
//         .addCase(exportstateRegisterQueMapping.rejected, (state, action: any) => {
//             state.exportFile.status = 'failed'
//             state.exportFile.error = action.error.message
//         })
        


//         .addCase(importstateRegisterQueMapping.pending, (state) => {
//             state.importstateRegisterQueMappingDetails.status = 'loading'
//         })
//         .addCase(importstateRegisterQueMapping.fulfilled, (state, action: any) => {
//             state.importstateRegisterQueMappingDetails.status = 'succeeded'
//             state.importstateRegisterQueMappingDetails.data = action.payload
//         })
//         .addCase(importstateRegisterQueMapping.rejected, (state, action: any) => {
//             state.importstateRegisterQueMappingDetails.status = 'failed'
//             state.importstateRegisterQueMappingDetails.error = action.error.message
//         })
// })
  
// export const {  resetstateRegisterQueDownloadDetails ,resetStateConfigDetails, resetImportFileDetails ,  resetExportFileDetails,resetAddStateConfigDetails,resetDeletestateRegisterQueMappingConfigDetails} = stateRegisterQueSlice.actions

// export default stateRegisterQueSlice.reducer