import {combineReducers, configureStore} from '@reduxjs/toolkit';
import questionReducer from './question.reducer.js';
import resultReducer from './result.reducer.js';
const rootReducer = combineReducers(
    {
        questions :questionReducer,
        result : resultReducer
    }
);
export const store = configureStore({reducer: rootReducer, devTools: true});