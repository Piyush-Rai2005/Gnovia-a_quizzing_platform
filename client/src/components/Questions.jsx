import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux'


/**Custom hook */
import { useFetchQuestion } from "../hooks/FetchQuestion";
import { updateResult } from "../hooks/setResult";

export default function Questions({onChecked}) {
  const [checked, setChecked] = useState(undefined);
  const {trace} = useSelector(state=>state.questions);
  const result = useSelector(state=>state.result.result);
  const [{Loading, apiData, serverError},setData] = useFetchQuestion();


  const questions= useSelector(state=>state.questions.queue[state.questions.trace]);
  const dispatch = useDispatch();  

  useEffect(()=>{
    dispatch(updateResult({trace, checked}))
},[checked]);

  function onSelect(i) {
    
    onChecked(i);
    setChecked(i);
    dispatch(updateResult({trace, checked}))
  }

  if(Loading) return <h3 className="text-3xl font-bold text-white border-2 border-green-400 p-4 inline-block mb-6 rounded-md">isLoading</h3>
  if(serverError) return <h3 className="text-3xl font-bold text-white border-2 border-green-400 p-4 inline-block mb-6 rounded-md">{serverError || "Unknown Error"}</h3>


  return (
    <div className="questions flex flex-col items-center justify-center p-8 bg-gray-900 text-white rounded-lg">
      <h2 className="text-3xl font-bold text-white border-2 border-green-400 p-4 inline-block mb-6 rounded-md">
      {/* ? mark is an if else statement it only passes the data when avaiable and thus avoid erros */}
        {questions?.question}
      </h2>

      <ul className="space-y-6 w-full max-w-lg" key={questions?.id}>
        {questions?.options.map((q, i) => (
          <li
            key={i}
            className="flex items-center p-4 bg-gray-800 hover:bg-gray-700 rounded-lg cursor-pointer transition"
          >
            <input
              type="radio"
              value={false}
              name="options"
              id={`q${i}-option`}
              onChange={()=>onSelect(i)}
              className="w-5 h-5 text-green-500 focus:ring-2 focus:ring-green-400 accent-green-500 cursor-pointer"
            />
            <label
              htmlFor={`q${i}-option`}
              className="ml-4 text-lg font-medium text-gray-300 cursor-pointer"
              >
              </label>
              {q}
            <div className={`check ${result[trace] == i ? 'checked' : ''}`}></div>
          </li>
        ))}
      </ul>


    </div>
  );
}
