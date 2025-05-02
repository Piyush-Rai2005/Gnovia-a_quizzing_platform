import React, { useEffect, useState } from 'react';
import { getServerData } from '../helper/helper';

export default function ResultTable() {
  const [data,setData]=useState([])
  useEffect(()=>{
    getServerData(`${process.env.REACT_APP_SERVER_HOSTNAME}/api/result`, (res)=>{
      setData(res)
    })
  })
  return (
    <div className="mt-6 w-full overflow-x-auto">
      <table className="table-auto w-full border-collapse border border-gray-700 text-white">
        {/* Table Header */}
        <thead>
          <tr className="bg-gray-800 text-left border-b border-gray-600">
            <th className="px-4 py-2 text-sm font-semibold">Name</th>
            <th className="px-4 py-2 text-sm font-semibold">Attempts</th>
            <th className="px-4 py-2 text-sm font-semibold">Points</th>
            <th className="px-4 py-2 text-sm font-semibold">Result</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {!data ?? <div>No data found</div>}
          {
            data.map((v,i)=>(
              <tr className="bg-gray-900 border-b border-gray-700 hover:bg-gray-800" key={i}>
                <td className="px-4 py-3">{v?.username || ' '}</td>
                <td className="px-4 py-3">{v?.attempts || 0}</td>
                <td className="px-4 py-3">{v?.points || 0}</td>
                <td className="px-4 py-3 text-green-400">{v?.achieved || ""}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
}
