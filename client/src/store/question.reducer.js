import { createSlice } from '@reduxjs/toolkit';


export const questionReducer =createSlice({
    name: 'questions',
    initialState:{
        id:0,
        queue: [],
        answers: [],
        trace: 0    
    },
    reducers:{
        startExamAction:(state, action)=>{
            let {question,answers} = action.payload
            return{
                ...state, //spread operator studied in chai and js//
                queue: question,
                answers
                /*Why use ...state?
                Immutable updates: Redux requires immutability, meaning you cannot directly modify the state object. Instead, you create a new object.
                Preserves other properties: Without ...state, you'd have to manually copy every property, which is cumbersome:*/
            }
        },
        moveNextAction :(state)=>{
            return{
                ...state,
                trace: state.trace+1
            }
        },
        movePrevAction :(state)=>{
            return{
                ...state,
                trace: state.trace-1
            }
        },
        resetAllAction :()=>{
            return{
                queue: [],
                answers: [],
                trace: 0
            }
        }
    }

})
export const {startExamAction,moveNextAction,movePrevAction,resetAllAction} = questionReducer.actions;

export default questionReducer.reducer;