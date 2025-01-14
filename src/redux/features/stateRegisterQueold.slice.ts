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
//     stateConfigureQueDetails: {
//         status: string,
//         data: any,
//         error: string | null
//     },
//     addStateRegisterQueDetails: {
//         status: string,
//         data: any,
//         error: string | null
//     },
//     updateStateRegisterQueDetails: {
//         status: string,
//         data: any,
//         error: string | null
//     } ,
//      deleteStateRegisterQueMappingDetails: {
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
//     importStateRegisterQueMappingDetails: {
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
//     stateConfigureQueDetails: {
//         status: 'idle',
//         data: '',
//         error: null
//     },
//     addStateRegisterQueDetails: {
//         status: 'idle',
//         data: '',
//         error: null
//     },
//     updateStateRegisterQueDetails: {
//         status: 'idle',
//         data: '',
//         error: null
//     },deleteStateRegisterQueMappingDetails: {
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
// importStateRegisterQueMappingDetails: {
//         status: 'idle',
//         data: '',
//         error: null
//     }
// } as StateConfigurationState

// export const getStateRegisterQue = createAsyncThunk('stateRegisterQue/getleaveConfiguration', async (data: any) => {
//     const inputModuleService = new InputModuleService();
//     return await inputModuleService.fetchStateRegisterQue(data);
// })
// export const getStateRegisterQueDownload = createAsyncThunk('stateRegisterQuedownload/getleaveConfiguration', async (data: any) => {
//     const inputModuleService = new InputModuleService();
//     return await inputModuleService.fetchStateRegisterQueDownload(data);
// })

// export const getStateConfigurationDetails = createAsyncThunk('inputModule/getStateConfigurationDetails', async (data: any) => {
//     const inputModuleService = new InputModuleService();
//     return await inputModuleService.getStateConfigurationDetails(data)
// })

// export const addStateRegisterQue = createAsyncThunk('inputModule/addStateRegisterQue', async (data: any) => {
//     const inputModuleService = new InputModuleService();
//     return await inputModuleService.addStateRegisterQue(data)
// })

// export const updateStateRegisterQue = createAsyncThunk('inputModule/updateStateRegisterQue', async (data: any) => {
//     const inputModuleService = new InputModuleService();
//     return await inputModuleService.updateStateRegisterQue(data)
// })

// // export const deleteStateRegisterQueMapping = createAsyncThunk('inputModule/deleteStateRegisterQueMapping', async (id: any) => {

// //     const inputModuleService = new InputModuleService();
// //     return await inputModuleService.deleteStateRegisterQueMapping(id);
// // })

// // export const exportStateRegisterQueMapping = createAsyncThunk('stateRegister/exportStateRegisterQueMapping', async (url: string) => {
// //     const inputModuleService = new InputModuleService();
// //     return await inputModuleService.exportStateRegisterQueMapping(url);
// // })

// // export const importStateRegisterQueMapping = createAsyncThunk('stateRegister/importStateRegisterQueMapping', async (data: any) => {
// //     const inputModuleService = new InputModuleService();
// //     return await inputModuleService.importStateRegisterQueMapping(data)
// // })




// export const stateRegisterQueSlice = createSlice({
//     name: 'stateRegisterQue',
//     initialState,
//     reducers: {
//        resetStateConfigDetails: (state) => {
//             state.stateConfigureQueDetails = {
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
//         state.addStateRegisterQueDetails = {
//             status: 'idle',
//             data: '',
//             error: null
//         }
//    }, resetDeleteStateregisterMappingConfigDetails: (state) => {
//     state.deleteStateRegisterQueMappingDetails = {
//         status: 'idle',
//         data: '',
//         error: null
//     }
// }, resetImportFileDetails: (state) => {
//     state.deleteStateRegisterQueMappingDetails = {
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
//         .addCase(getStateRegisterQue.pending, (state) => {
//             state.stateRegisterQueDetails.status = 'loading'
//         })
//         .addCase(getStateRegisterQue.fulfilled, (state, action: any) => {
//             if(action.payload.data) {
//                 state.stateRegisterQueDetails.status = 'succeeded'
//                 state.stateRegisterQueDetails.data = action.payload.data
//             } else {
//                 state.stateRegisterQueDetails.status = 'failed'
//                 state.stateRegisterQueDetails.error = action.payload.message;
//             }
//         })
//         .addCase(getStateRegisterQue.rejected, (state, action: any) => {
//             state.stateRegisterQueDetails.status = 'failed'
//             state.stateRegisterQueDetails.error = action.error.message
//         })
        




//         .addCase(getStateRegisterQueDownload.pending, (state) => {
//             state.stateRegisterQueDownloadDetails.status = 'loading'
//         })
//         .addCase(getStateRegisterQueDownload.fulfilled, (state, action: any) => {
//             if(action.payload.data) {
//                 state.stateRegisterQueDownloadDetails.status = 'succeeded'
//                 state.stateRegisterQueDownloadDetails.data = action.payload.data
//             } else {
//                 state.stateRegisterQueDownloadDetails.status = 'failed'
//                 state.stateRegisterQueDownloadDetails.error = action.payload.message;
//             }
//         })
//         .addCase(getStateRegisterQueDownload.rejected, (state, action: any) => {
//             state.stateRegisterQueDownloadDetails.status = 'failed'
//             state.stateRegisterQueDownloadDetails.error = action.error.message
//         })












        
        
//         .addCase(getStateConfigurationDetails.pending, (state) => {
//             state.stateConfigureQueDetails.status = 'loading'
//         })
//         .addCase(getStateConfigurationDetails.fulfilled, (state, action: any) => {
//             if(action.payload.data) {
//                 state.stateConfigureQueDetails.status = 'succeeded'
//                 state.stateConfigureQueDetails.data = action.payload.data
//             } else {
//                 state.stateConfigureQueDetails.status = 'failed'
//                 state.stateConfigureQueDetails.error = action.payload.message;
//             }
//         })
//         .addCase(getStateConfigurationDetails.rejected, (state, action: any) => {
//             state.stateConfigureQueDetails.status = 'failed'
//             state.stateConfigureQueDetails.error = action.error.message
//         })
        
//         .addCase(addStateRegisterQue.pending, (state) => {
//             state.addStateRegisterQueDetails.status = 'loading'
//         })
//         .addCase(addStateRegisterQue.fulfilled, (state, action: any) => {
//             if(action.payload.data) {
//                 state.addStateRegisterQueDetails.status = 'succeeded'
//                 state.addStateRegisterQueDetails.data = action.payload.data
//             } else {
//                 state.addStateRegisterQueDetails.status = 'failed'
//                 state.addStateRegisterQueDetails.error = action.payload.message;
//             }
//         })
//         .addCase(addStateRegisterQue.rejected, (state, action: any) => {
//             state.updateStateRegisterQueDetails.status = 'failed'
//             state.updateStateRegisterQueDetails.error = action.error.message
//         })

//         .addCase(updateStateRegisterQue.pending, (state) => {
//             state.updateStateRegisterQueDetails.status = 'loading'
//         })
//         .addCase(updateStateRegisterQue.fulfilled, (state, action: any) => {
//             if(action.payload.data) {
//                 state.updateStateRegisterQueDetails.status = 'succeeded'
//                 state.updateStateRegisterQueDetails.data = action.payload.data
//             } else {
//                 state.updateStateRegisterQueDetails.status = 'failed'
//                 state.updateStateRegisterQueDetails.error = action.payload.message;
//             }
//         })
//         .addCase(updateStateRegisterQue.rejected, (state, action: any) => {
//             state.updateStateRegisterQueDetails.status = 'failed'
//             state.updateStateRegisterQueDetails.error = action.error.message
//         })

//         // .addCase(deleteStateRegisterQueMapping.pending, (state) => {
//         //     state.deleteStateRegisterQueMappingDetails.status = 'loading'
//         // })
//         // .addCase(deleteStateRegisterQueMapping.fulfilled, (state, action: any) => {
//         //     if(action.payload.data) {
//         //         state.deleteStateRegisterQueMappingDetails.status = 'succeeded'
//         //         state.deleteStateRegisterQueMappingDetails.data = action.payload.data
//         //     } else {
//         //         state.deleteStateRegisterQueMappingDetails.status = 'failed'
//         //         state.deleteStateRegisterQueMappingDetails.error = action.payload.message;
//         //     }
//         // })
//         // .addCase(deleteStateRegisterQueMapping.rejected, (state, action: any) => {
//         //     state.deleteStateRegisterQueMappingDetails.status = 'failed'
//         //     state.deleteStateRegisterQueMappingDetails.error = action.error.message
//         // // })
//         // .addCase(exportStateRegisterQueMapping.pending, (state) => {
//         //     state.exportFile.status = 'loading'
//         // })
//         // .addCase(exportStateRegisterQueMapping.fulfilled, (state, action: any) => {
//         //     state.exportFile.status = 'succeeded'
//         //     state.exportFile.data = action.payload
//         // })
//         // .addCase(exportStateRegisterQueMapping.rejected, (state, action: any) => {
//         //     state.exportFile.status = 'failed'
//         //     state.exportFile.error = action.error.message
//         // })
        


//         // .addCase(importStateRegisterQueMapping.pending, (state) => {
//         //     state.importStateRegisterQueMappingDetails.status = 'loading'
//         // })
//         // .addCase(importStateRegisterQueMapping.fulfilled, (state, action: any) => {
//         //     state.importStateRegisterQueMappingDetails.status = 'succeeded'
//         //     state.importStateRegisterQueMappingDetails.data = action.payload
//         // })
//         // .addCase(importStateRegisterQueMapping.rejected, (state, action: any) => {
//         //     state.importStateRegisterQueMappingDetails.status = 'failed'
//         //     state.importStateRegisterQueMappingDetails.error = action.error.message
//         // })
// })
  
// export const {  resetstateRegisterQueDownloadDetails ,resetStateConfigDetails, resetImportFileDetails ,  resetExportFileDetails,resetAddStateConfigDetails,resetDeleteStateregisterMappingConfigDetails} = stateRegisterQueSlice.actions

// export default stateRegisterQueSlice.reducer