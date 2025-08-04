import React, { useEffect, useState } from 'react';
import { getServerData } from '../helper/helper';

export default function ResultTable() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const apiURL = `${import.meta.env.VITE_BACKEND_URL}/api/result/${localStorage.getItem('setId')}`;

    getServerData(apiURL, (res) => {
      console.log("Fetched result data:", res);  // Debugging line
      if (Array.isArray(res)) {
        setData(res);
      } else {
        setData([]);  // Or show error based on your preference
        console.error("Expected array but got:", res);
      }
    });
  }, []);

  return (
    <div className="mt-6 w-full overflow-x-auto">
      <table className="table-auto w-full border-collapse border border-gray-700 text-white">
        {/* Table Header */}
        <thead>
          <tr className="bg-gray-800 text-left border-b border-gray-600">
            <th className="px-4 py-2 text-sm font-semibold">Name</th>
            <th className="px-4 py-2 text-sm font-semibold">Attempts</th>
            <th className="px-4 py-2 text-sm font-semibold">Points</th>
            <th className="px-4 py-2 text-sm font-semibold">Status</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {Array.isArray(data) && data.length > 0 ? (
            data.map((v, i) => (
              <tr className="bg-gray-900 border-b border-gray-700 hover:bg-gray-800" key={i}>
                <td className="px-4 py-3">{v?.username || ' '}</td>
                <td className="px-4 py-3">{v?.attempts || 0}</td>
                <td className="px-4 py-3">{v?.points || 0}</td>
                <td className={`px-4 py-3 font-medium ${v?.achieved === 'Passed' ? 'text-green-400' : 'text-red-400'}`}>
                  {v?.achieved || ''}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center py-4 text-gray-400">No data found or invalid response format</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
