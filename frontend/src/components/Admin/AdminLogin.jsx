import React, { useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = ({ onLoginSuccess }) => {
  const [currentState, setCurrentState] = useState('Login');
  const [data, setData] = useState({ name: '', email: '', password: '', adminKey: '' });
  const navigate = useNavigate();

  const url = import.meta.env.VITE_BACKEND_URL;

  const onChangeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const endpoint = currentState === "Login" ? "/api/admin/login" : "/api/admin/register";
    try {
      const response = await axios.post(url + endpoint, data);
      console.log("Submitting form with data:", data);
      console.log("Response received:", response.data);

      if (response.data.success) {
        localStorage.setItem("adminToken", response.data.token);
        localStorage.setItem("adminName", response.data.admin.name);
        onLoginSuccess(response.data.admin.name); // ✅ Call parent with name
        navigate('/admin');
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      console.error("Request failed:", err);
      if (err.response) {
        alert(err.response.data.message || "Server error");
      } else {
        alert("Error: Could not complete request.");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-10 bg-gray-900 border border-gray-700 rounded-xl shadow-xl p-6 grid">
      <form
        onSubmit={onSubmit}
        className="place-self-center w-[90%] sm:w-[400px] bg-white text-gray-600 p-6 sm:p-8 rounded-2xl shadow-xl animate-fadeIn flex flex-col gap-5"
      >
        <div className="flex justify-between items-center text-black">
          <h2 className="text-lg font-semibold">
            {currentState === 'Sign Up' ? 'Admin Registration' : 'Admin Login'}
          </h2>
          <X className="w-5 h-5 text-gray-500 cursor-pointer" onClick={() => navigate('/')} />
        </div>

        <div className="flex flex-col gap-4">
          {currentState === 'Sign Up' && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Your name"
                value={data.name}
                onChange={onChangeHandler}
                required
                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <input
                type="text"
                name="adminKey"
                placeholder="Admin Secret Key"
                value={data.adminKey}
                onChange={onChangeHandler}
                required
                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder="Your email"
            value={data.email}
            onChange={onChangeHandler}
            required
            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={data.password}
            onChange={onChangeHandler}
            required
            minLength={6}
            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded-md text-base font-medium hover:bg-blue-700 transition"
        >
          {currentState === 'Sign Up' ? 'Register' : 'Login'}
        </button>

        <div className="flex items-start gap-2 text-sm mt-2">
          <input type="checkbox" required className="mt-1" />
          <p>
            By continuing, I agree to the <span className="font-semibold">terms of use</span> & <span className="font-semibold">privacy policy</span>.
          </p>
        </div>

        {currentState === 'Login' ? (
          <p className="text-sm">
            Don’t have an account?{' '}
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

export default AdminLogin;
