import {useEffect,useState} from "react";
import { useDispatch } from "react-redux";
import * as Action from '../store/question.reducer';
// import data ,{answers} from "../database/data";
import { getServerData } from "../helper/helper";

/**fetch question hook to fetch api data and set values to store */

export const useFetchQuestion = (setId) => {
  const [getData, setData] = useState({ Loading: false, apiData: [], serverError: null });
  const dispatch = useDispatch();

  useEffect(() => {
    setData(prev => ({ ...prev, Loading: true }));

    (async () => {
      try {
        const { questions, quizTitle, quizType, timeLimit } = await getServerData(
          `${import.meta.env.VITE_BACKEND_URL}/api/quiz-set/questions/${setId}`
        );

        if (questions && questions.length > 0) {
          const answers = questions.map(q => q.answer); // Extract answers if needed
          
          dispatch(Action.startExamAction({
            question: questions,
            answers,
            quizTitle,
            quizType,
            timeLimit
          }));

          setData(prev => ({ ...prev, Loading: false, apiData: questions }));
        } else {
          throw new Error("No questions available");
        }
      } catch (error) {
        setData(prev => ({ ...prev, Loading: false, serverError: error }));
      }
    })();
  }, [dispatch, setId]);

  return [getData, setData];
};

//we cannot directly pass a hook inside a function , we can only pass a hook inside another hook//
export const MoveNextQuestion=()=>async(dispatch)=>{
    try{
        dispatch(Action.moveNextAction())
    }
    catch(error){
        console.log(error);
    }
}

export const MovePrevQuestion=()=>async(dispatch)=>{
    try{
        dispatch(Action.movePrevAction())
    }
    catch(error){
        console.log(error);
    }
}