import StatsCard from './AStats';

const AdminDashboard = ({ dashboardStats }) => {
  const statsData = [
    {
      title: 'Total Quiz Sets',
      value: dashboardStats?.totalQuizSets || 0,
      color: 'blue'
    },
    {
      title: 'Active Quiz Sets',
      value: dashboardStats?.activeQuizSets || 0,
      color: 'green'
    },
    {
      title: 'Inactive Quiz Sets',
      value: dashboardStats?.inactiveQuizSets || 0,
      color: 'red'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsData.map((stat, index) => (
          <StatsCard 
            key={index}
            title={stat.title}
            value={stat.value}
            color={stat.color}
          />
        ))}
      </div>

      {dashboardStats?.recentQuizSets?.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mt-6">Recent Quiz Sets</h2>
          <ul className="mt-2 space-y-2">
            {dashboardStats.recentQuizSets.map((quiz, index) => (
              <li key={index} className="bg-white shadow p-3 rounded">
                <strong>{quiz.title}</strong> - {quiz.totalQuestions} Questions
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
