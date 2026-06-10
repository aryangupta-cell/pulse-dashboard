'use client';

import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ChartsProps {
  filters: {
    month: string;
    department: string;
    subDept: string;
    employee: string;
  };
}

interface TrendData {
  date: string;
  productivity: number;
  communication: number;
}

export default function Charts({ filters }: ChartsProps) {
  const [granularity, setGranularity] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [data, setData] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTrends = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append('granularity', granularity);
        if (filters.month) params.append('month', filters.month);
        if (filters.department) params.append('department', filters.department);
        if (filters.subDept) params.append('subDept', filters.subDept);
        if (filters.employee) params.append('employee', filters.employee);

        const response = await fetch(`/api/trends?${params}`);
        const result = await response.json();
        setData(result.trends || []);
      } catch (error) {
        console.error('Failed to fetch trends:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, [granularity, filters]);

  const TabButton = ({ value, label }: { value: typeof granularity; label: string }) => (
    <button
      onClick={() => setGranularity(value)}
      className={`px-4 py-2 font-medium rounded ${
        granularity === value
          ? 'bg-blue-600 text-white'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="grid grid-cols-2 gap-6 mt-6">
      {/* Productivity Trend Chart */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Productivity Trend</h3>
            <p className="text-sm text-gray-500 mt-1">Weighted Units over time</p>
          </div>
          <div className="flex gap-2">
            <TabButton value="daily" label="Daily" />
            <TabButton value="weekly" label="Weekly" />
            <TabButton value="monthly" label="Monthly" />
          </div>
        </div>
        {loading ? (
          <div className="h-80 flex items-center justify-center">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="productivity"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Total Trips Count Chart */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Total Trips Count</h3>
            <p className="text-sm text-gray-500 mt-1">Unique Trips over time</p>
          </div>
          <div className="flex gap-2">
            <TabButton value="daily" label="Daily" />
            <TabButton value="weekly" label="Weekly" />
            <TabButton value="monthly" label="Monthly" />
          </div>
        </div>
        {loading ? (
          <div className="h-80 flex items-center justify-center">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="totalTrips"
                stroke="#f97316"
                strokeWidth={2}
                dot={{ fill: '#f97316', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
