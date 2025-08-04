  import React, { useRef } from 'react';
  import { useDispatch } from 'react-redux';
  import { Link } from 'react-router-dom';
  import { setUserId } from '../store/result.reducer';

  // import '../styles/index.css';

  export default function Main() {
    const inputRef = useRef(null);
    const dispatch = useDispatch();

    function startQuiz(){
      if(inputRef.current?.value){
        dispatch(setUserId(inputRef.current?.value))
      }
    }

    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl font-bold text-white border-2 border-green-400 p-2 inline-block mb-6">
          Quiz Application
        </h1>

        <h3 className="text-gray-300 text-lg space-y-2 mb-6 text-left max-w-md">
          First tell us whether you are a user or an admin.
        </h3>

        <button className="userlogin">
          <Link
            className="bg-yellow-500 text-black font-bold px-6 py-2 rounded hover:bg-yellow-600 transition duration-200"
            to={'login'} onClick={startQuiz}
          >
            UserLogin
          </Link>
        </button>

        <h3 className="text-gray-300 text-lg space-y-2 mb-6 text-left max-w-md"/>
        
        <button className="adminlogin">
          <Link
            className="bg-yellow-500 text-black font-bold px-6 py-2 rounded hover:bg-yellow-600 transition duration-200"
            to={'admin'} onClick={startQuiz}
          >
           AdminLogin
          </Link>
        </button>
      </div>
    );
  }
