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
    <div className="bg-white p-6 rounded-lg border border-gray-200 mt-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">Employee Performance</h3>
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <p className="text-gray-500">Loading...</p>
        </div>
      ) : employees.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No employees found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Employee Name</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">D Score</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Total Trips</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Weighted Units</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.code} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-700">{emp.name}</td>
                  <td className="py-3 px-4 text-right">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                      {emp.dScore.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-gray-700">{emp.totalTrips}</td>
                  <td className="py-3 px-4 text-right text-gray-700">{emp.weightedUnits.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
