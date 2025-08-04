import React, { useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setUserId } from '../store/result.reducer'; // adjust path if needed
import { setUsername } from '../store/result.reducer'; // adjust path if needed
import { useNavigate } from 'react-router-dom'; 

const Login = () => {
  const dispatch = useDispatch();
  const [currentState, setCurrentState] = useState('Login');
  const [data, setData] = useState({ name: '', email: '', password: '' });

  const url = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

  const onChangeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate(); // 👈 Initialize this at the top

const onLogin = async (event) => {
  event.preventDefault();
  const endpoint = currentState === "Login" ? "/api/login" : "/api/register";

  const payload =
    currentState === "Login"
      ? { email: data.email, password: data.password }
      : { name: data.name, email: data.email, password: data.password };

  try {
    console.log("Submitting:", payload);
    console.log("Endpoint:", url + endpoint);

    const response = await axios.post(url + endpoint, payload);

    if (response.data.success) {
      dispatch(setUserId(response.data.user._id));
      dispatch(setUsername(response.data.user.name));
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", response.data.user.name); // ✅ ADD THIS LINE

      navigate('/dashboard'); // 👈 Redirect after login
    } else {
      alert(response.data.message || "Authentication failed");
    }
  } catch (err) {
    const errorMessage = err?.response?.data?.message || "Something went wrong. Please try again.";
    console.error("Login/Register Error:", err);
    alert(errorMessage);
    setData(prev => ({ ...prev, password: "" }));
  }
};

  return (
    <div className="fixed inset-0 z-10 bg-gray-900 border border-gray-700 rounded-xl shadow-xl p-6 grid">
      <form
        onSubmit={onLogin}
        className="place-self-center w-[90%] sm:w-[400px] bg-white text-gray-600 p-6 sm:p-8 rounded-2xl shadow-xl animate-fadeIn flex flex-col gap-5"
      >
        {/* Header */}
        <div className="flex justify-between items-center text-black">
          <h2 className="text-lg font-semibold">{currentState}</h2>
          <X
            className="w-5 h-5 text-gray-500 cursor-pointer"
            onClick={() =>  navigate('/')}
          />
        </div>

        {/* Inputs */}
        <div className="flex flex-col gap-4">
          {currentState === 'Sign Up' && (
            <input
              name="name"
              type="text"
              placeholder="Your name"
              value={data.name}
              onChange={onChangeHandler}
              required
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          )}
          <input
            name="email"
            type="email"
            placeholder="Your email"
            value={data.email}
            onChange={onChangeHandler}
            required
            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={data.password}
            onChange={onChangeHandler}
            required
            minLength={6}
            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded-md text-base font-medium hover:bg-blue-700 transition"
        >
          {currentState === 'Sign Up' ? "Create account" : "Login"}
        </button>

        {/* Agreement */}
        <div className="flex items-start gap-2 text-sm mt-2">
          <input type="checkbox" required className="mt-1" />
          <p>
            By continuing, I agree to the <span className="font-semibold">terms of use</span> & <span className="font-semibold">privacy policy</span>.
          </p>
        </div>

        {/* Switch login/signup */}
        {currentState === 'Login' ? (
          <p className="text-sm">
            Don't have an account?{' '}
            <span
              onClick={() => setCurrentState('Sign Up')}
              className="text-blue-600 font-semibold cursor-pointer"
            >
              Sign up here
            </span>
          </p>
        ) : (
          <p className="text-sm">
            Already have an account?{' '}
            <span
              onClick={() => setCurrentState('Login')}
              className="text-blue-600 font-semibold cursor-pointer"
            >
              Login here
            </span>
          </p>
        )}
      </form>
    </div>
  );
};

export default Login;
