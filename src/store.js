import { combineReducers, configureStore } from "@reduxjs/toolkit";
import usereducers from "./Reducers/userSlice"
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'

const allreducers=combineReducers({"user":usereducers})
const persistConfig = {
  key: 'root',
  storage
}

const pers = persistReducer(persistConfig, allreducers)

export default  configureStore({
    reducer: pers,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  });