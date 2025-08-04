import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './AdminHeader.jsx';
import Navigation from './ANavigation.jsx';
import Dashboard from './AdminDashboard';
import QuizSets from './AQuizSet';
import CreateQuiz from './ACreateQuiz';
import AdminLogin from './AdminLogin.jsx';

const AdminPanel = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("adminToken"));
  const [adminName, setAdminName] = useState(localStorage.getItem("adminName") || "Admin");
  const [currentView, setCurrentView] = useState('dashboard');
  const [quizSets, setQuizSets] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const url = import.meta.env.VITE_BACKEND_URL;

  const fetchAdminData = async () => {
  try {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      console.warn("No admin token found");
      return;
    }

    const res = await axios.get(`${url}/api/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.data && res.data.success) {
      setDashboardStats(res.data.stats);
      setQuizSets(res.data.quizSets);
    } else {
      console.warn("Unexpected admin stats response", res.data);
    }

  } catch (err) {
    console.error("Failed to load admin data", err);
  }
};


  useEffect(() => {
    if (isLoggedIn) {
      fetchAdminData();
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminName");
    setIsLoggedIn(false);
  };

  const handleDeleteQuizSet = async (quizId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this quiz set?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.delete(`${url}/api/admin/quiz-sets/${quizId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 200) {
        alert("Quiz set deleted!");
        fetchAdminData();
      } else {
        alert("Failed to delete quiz set");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting quiz set");
    }
  };

  if (!isLoggedIn) {
    return <AdminLogin onLoginSuccess={(name) => {
  setIsLoggedIn(true);
  setAdminName(name); // Save name after login
  localStorage.setItem("adminName", name);
}} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header adminName={adminName} handleLogout={handleLogout} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Navigation currentView={currentView} setCurrentView={setCurrentView} />

        {currentView === 'dashboard' && dashboardStats && (
          <Dashboard dashboardStats={dashboardStats} />
        )}

        {currentView === 'quiz-sets' && (
          <QuizSets quizSets={quizSets} onDelete={handleDeleteQuizSet} />
        )}

        {currentView === 'create-quiz' && (
          <CreateQuiz
            setCurrentView={setCurrentView}
            loading={loading}
            setLoading={setLoading}
            onQuizSetCreated={() => {
              fetchAdminData();
              setCurrentView('quiz-sets');
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
