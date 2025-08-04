import './styles/App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './components/Login.jsx';
import Main from './components/Main.jsx';
import Quiz from './components/Quiz.jsx';
import Result from './components/Result.jsx';
import AdminPanel from './components/Admin/AdminPanel.jsx';
import { CheckUserExist } from './helper/helper.jsx';
import Multi from './components/MultiPlayer/Multi.jsx';
import UserDashboard from './components/UserDashboard.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Main />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/quiz/:setId',
    element: <Quiz />
  },
  {
    path: '/dashboard',
    element: <UserDashboard />
  },
  {
    path: '/socket/:setId',
    element: <Multi />
  },
  {
    path: '/result/:setId',
    element: (
      <CheckUserExist>
        <Result />
      </CheckUserExist>
    )
  },
  {
    path: '/admin',
    element: <AdminPanel />
  },
 
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
