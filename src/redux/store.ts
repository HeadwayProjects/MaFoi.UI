import { configureStore } from '@reduxjs/toolkit'
import inputModuleSlice from './features/inputModule.slice'
import holidayListSlice from './features/holidayList.slice'

export const store = configureStore({
  reducer: {
    inputModule: inputModuleSlice,
    holidayList: holidayListSlice
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