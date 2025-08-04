import { BarChart3, Eye, Plus } from 'lucide-react';

const Navigation = ({ currentView, setCurrentView }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'quiz-sets', label: 'Quiz Sets', icon: Eye },
    { id: 'create-quiz', label: 'Create Quiz', icon: Plus }
  ];

  return (
    <nav className="mb-8">
      <div className="flex space-x-4">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setCurrentView(id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
              currentView === id 
                ? 'bg-blue-500 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
