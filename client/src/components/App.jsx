
import '../styles/App.css';
import {createBrowserRouter, RouterProvider } from 'react-router-dom'
import Main from './Main.jsx'
import Quiz from './Quiz.jsx';
import Result from './Result.jsx';
import { CheckUserExist } from '../helper/helper.js';


const router = createBrowserRouter([
  {
    path :'/',
    element : <Main></Main>
  },
  {
    path: '/quiz',
    element :<CheckUserExist> <Quiz /></CheckUserExist>
  },
  {
    path : 'result',
    element : <CheckUserExist> <Result></Result> </CheckUserExist>
  }
])
function App() {
  return (
   <>
   <RouterProvider router={router}/>
   </>
  );
}

export default App;
