'use client';

import { useEffect, useState } from 'react';

interface Employee {
  code: string;
  name: string;
  dScore: number;
  totalTrips: number;
  weightedUnits: number;
}

interface EmployeeListProps {
  filters: {
    month: string;
    department: string;
    subDept: string;
    employee: string;
    dateFrom: string;
    dateTo: string;
  };
}

export default function EmployeeList({ filters }: EmployeeListProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.month) params.append('month', filters.month);
        if (filters.subDept) params.append('subDept', filters.subDept);
        if (filters.employee) params.append('employee', filters.employee);
        if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
        if (filters.dateTo) params.append('dateTo', filters.dateTo);

        const response = await fetch(`/api/employees?${params}`);
        const result = await response.json();
        setEmployees(result.employees || []);
      } catch (error) {
        console.error('Failed to fetch employees:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [filters]);

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mt-8">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Employee Performance</h3>
        <p className="text-sm text-gray-500 mt-1">Ranked by D Score</p>
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <p className="text-gray-400">Loading...</p>
        </div>
      ) : employees.length === 0 ? (
        <p className="text-gray-400 text-center py-12">No employees found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gray-50">
                <th className="text-left py-4 px-6 font-bold text-gray-700">Employee Name</th>
                <th className="text-right py-4 px-6 font-bold text-gray-700">D Score</th>
                <th className="text-right py-4 px-6 font-bold text-gray-700">Weighted Units</th>
                <th className="text-right py-4 px-6 font-bold text-gray-700">Total Trips</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, idx) => (
                <tr key={emp.code} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-purple-50 hover:to-transparent transition">
                  <td className="py-4 px-6 text-gray-800 font-medium">{emp.name}</td>
                  <td className="py-4 px-6 text-right">
                    <span className="bg-gradient-to-r from-purple-100 to-purple-50 text-purple-800 px-4 py-2 rounded-lg font-bold text-sm">
                      {emp.dScore.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right text-gray-700 font-medium">{emp.weightedUnits.toFixed(2)}</td>
                  <td className="py-4 px-6 text-right text-gray-700 font-medium">{emp.totalTrips}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
