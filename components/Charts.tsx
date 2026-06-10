'use client';

import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';

interface ChartsProps {
  filters: {
    month: string;
    department: string;
    subDept: string;
    employee: string;
    dateFrom: string;
    dateTo: string;
  };
}

interface TrendData {
  date: string;
  dateLabel: string;
  productivity: number;
  totalTrips: number;
}

const formatDateLabel = (dateStr: string, granularity: 'daily' | 'weekly' | 'monthly', allData?: any[]): string => {
  const date = new Date(dateStr);
  if (granularity === 'daily') {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } else if (granularity === 'weekly') {
    if (!allData) return dateStr;
    const sortedDates = allData.map(d => new Date(d.date)).sort((a, b) => a.getTime() - b.getTime());
    const weekIndex = sortedDates.findIndex(d => d.toDateString() === date.toDateString());
    const weekNum = Math.floor(weekIndex / 7) + 1;
    return `Week ${weekNum}`;
  } else {
    return date.toLocaleDateString('en-US', { month: 'short' });
  }
};

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
        if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
        if (filters.dateTo) params.append('dateTo', filters.dateTo);

        const response = await fetch(`/api/trends?${params}`);
        const result = await response.json();
        const rawData = result.trends || [];
        const formattedData = rawData.map((row: TrendData) => ({
          ...row,
          dateLabel: formatDateLabel(row.date, granularity, rawData),
        }));
        setData(formattedData);
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
      className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${
        granularity === value
          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  );

  const ChartCard = ({ title, description, children }: { title: string; description: string; children: React.ReactNode }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        </div>
        <div className="flex gap-1.5">
          <TabButton value="daily" label="D" />
          <TabButton value="weekly" label="W" />
          <TabButton value="monthly" label="M" />
        </div>
      </div>
      {loading ? (
        <div className="h-72 flex items-center justify-center">
          <p className="text-gray-400">Loading...</p>
        </div>
      ) : (
        children
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-2 gap-6 mt-8">
      {/* D Score Chart */}
      <ChartCard title="D Score Trend" description="Performance Score over time">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="dateLabel"
              tick={{ fontSize: 11 }}
              stroke="#999"
            />
            <YAxis stroke="#999" />
            <Tooltip
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              formatter={(value: any) => (value || 0).toFixed(2)}
            />
            <Line
              type="monotone"
              dataKey="dScore"
              stroke="#9333ea"
              strokeWidth={2.5}
              dot={{ fill: '#9333ea', r: 3 }}
              activeDot={{ r: 5 }}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Productivity & Trips Merged Chart */}
      <ChartCard title="Productivity & Trips" description="Weighted Units & Total Trips">
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={data} margin={{ top: 5, right: 30, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="dateLabel"
              tick={{ fontSize: 11 }}
              stroke="#999"
            />
            <YAxis stroke="#10b981" label={{ value: 'Weighted Units', angle: -90, position: 'insideLeft', fill: '#10b981' }} />
            <YAxis yAxisId="right" orientation="right" stroke="#f97316" label={{ value: 'Total Trips', angle: 90, position: 'insideRight', fill: '#f97316' }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              formatter={(value: any) => (value || 0).toFixed(2)}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="productivity"
              stroke="#10b981"
              strokeWidth={2.5}
              dot={{ fill: '#10b981', r: 3 }}
              activeDot={{ r: 5 }}
              name="Weighted Units"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="totalTrips"
              stroke="#f97316"
              strokeWidth={2.5}
              dot={{ fill: '#f97316', r: 3 }}
              activeDot={{ r: 5 }}
              name="Total Trips"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCard>

    </div>
  );
}
