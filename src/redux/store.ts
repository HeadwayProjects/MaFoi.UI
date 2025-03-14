import { configureStore } from '@reduxjs/toolkit'
import inputModuleSlice from './features/inputModule.slice'
import holidayListSlice from './features/holidayList.slice'
import leaveConfigurationSlice from './features/leaveConfiguration.slice'
import attendanceConfigurationSlice from './features/attendanceConfiguration.slice'
import stateRegisterSlice from './features/stateRegister.slice'
import stateRegisterQueSlice from './features/stateRegisterQue.slice'
import inputDashboardSlice from './features/dashboard.slice'
import employeeMasterSlice from './features/employeeMaster.slice'
import salaryComponentSlice from './features/salaryComponents.slice'
import StateactruleactivitymappingSlice from './features/Stateactruleactivitymapping.slice'

export const store = configureStore({
  reducer: {
    inputModule: inputModuleSlice,
    holidayList: holidayListSlice,
    leaveConfiguration: leaveConfigurationSlice,
    attendanceConfiguration: attendanceConfigurationSlice,
    stateRegister: stateRegisterSlice,
    stateRegisterQue: stateRegisterQueSlice,
    inputDashboard: inputDashboardSlice,
    employeeMaster: employeeMasterSlice,
    salaryComponent: salaryComponentSlice,
    stateactruleactivitymapping:StateactruleactivitymappingSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch