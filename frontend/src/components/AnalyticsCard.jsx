import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { mockAPI } from "../services/api";

export default function AnalyticsCard() {
  const [analyticsData, setAnalyticsData] = useState({
    reports: [],
    categories: []
  });
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState('reports'); // 'reports' or 'categories'

  useEffect(() => {
    const loadAnalyticsData = async () => {
      try {
        const data = await mockAPI.getAnalyticsData();
        setAnalyticsData(data);
      } catch (error) {
        console.error('Error loading analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalyticsData();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold">Analytics Dashboard</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setViewType('reports')}
            className={`px-3 py-1 text-sm rounded ${
              viewType === 'reports' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Reports
          </button>
          <button
            onClick={() => setViewType('categories')}
            className={`px-3 py-1 text-sm rounded ${
              viewType === 'categories' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Categories
          </button>
        </div>
      </div>

      {loading ? (
        <div className="h-48 flex items-center justify-center">
          <p className="text-gray-500">Loading analytics...</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          {viewType === 'reports' ? (
            <LineChart data={analyticsData.reports}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          ) : (
            <BarChart data={analyticsData.categories}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          )}
        </ResponsiveContainer>
      )}
      
      <div className="mt-3 text-sm text-gray-600">
        {viewType === 'reports' 
          ? 'Monthly report submissions trend' 
          : 'Report distribution by category'
        }
      </div>
    </div>
  );
}
