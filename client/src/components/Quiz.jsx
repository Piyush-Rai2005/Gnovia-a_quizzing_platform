import React, {useState, useEffect } from 'react'
import Questions from './Questions'
import { MoveNextQuestion, MovePrevQuestion } from '../hooks/FetchQuestion';
import { PushAnswer } from '../hooks/setResult';
import { Navigate } from 'react-router-dom';


//import redux store//
import { useDispatch, useSelector } from 'react-redux'
export default function Quiz() {

  const [check, setChecked] = useState(undefined);
  
  const result=useSelector(state=>state.result.result)
  const {queue,trace}= useSelector(state=>state.questions);
  const dispatch = useDispatch();


  function onNext(){
    console.log('Next')

    // Push answer if not already recorded
    if(result.length === trace){
        dispatch(PushAnswer(check));
    }

    // Move to next question only if not at the last question
    if(trace < queue.length - 1){
        dispatch(MoveNextQuestion());
    }

    // Reset selected option
    setChecked(undefined);
}


  function onPrev(){
    if(trace >0){
      console.log('Prev')
      dispatch(MovePrevQuestion());
    }
  }
  function onChecked(check){
    console.log(check);
    setChecked(check)

  }
  //on fininshing the exam go to result page//
  if(result.length && result.length ===queue.length){
    return <Navigate to ={'/result'} replace={true}></Navigate>
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold text-white border-2 border-green-400 p-2 inline-block mb-6">
        Questions
      </h1>
      <Questions onChecked={onChecked}></Questions>
      <div className="flex justify-between w-full max-w-lg mt-6">
        { trace >0 ? <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-lg font-bold transition" onClick={onPrev}>
          Prev
        </button> : <></>}
        <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-bold transition" onClick={onNext}> 
          Next
        </button>
      </div>
    </div>
  )
}
