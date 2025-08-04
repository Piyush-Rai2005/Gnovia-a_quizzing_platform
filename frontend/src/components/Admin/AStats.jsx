// components/StatsCard.js
const StatsCard = ({ title, value, color }) => {
  const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    red: 'text-red-600',
    yellow: 'text-yellow-600'
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      <p className={`text-3xl font-bold ${colorClasses[color] || 'text-gray-600'}`}>
        {value}
      </p>
    </div>
  );
};

export default StatsCard;