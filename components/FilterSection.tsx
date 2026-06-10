'use client';

import { useEffect, useState } from 'react';

interface FilterSectionProps {
  onFiltersChange: (filters: {
    month: string;
    department: string;
    subDept: string;
    employee: string;
    dateFrom: string;
    dateTo: string;
  }) => void;
}

interface FilterOptions {
  months: string[];
  departments: string[];
  subDepts: string[];
  employees: { code: string; name: string }[];
}

export default function FilterSection({ onFiltersChange }: FilterSectionProps) {
  const [filters, setFilters] = useState({
    month: 'All Months',
    department: 'All Departments',
    subDept: 'All Sub-depts',
    employee: 'All Employees',
    dateFrom: '',
    dateTo: '',
  });

  const [options, setOptions] = useState<FilterOptions>({
    months: [],
    departments: [],
    subDepts: [],
    employees: [],
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch('/api/filters');
        const data = await response.json();
        if (response.ok && data.months) {
          setOptions(data);
        } else {
          console.error('Invalid response:', data);
        }
      } catch (error) {
        console.error('Failed to fetch filter options:', error);
      }
    };

    fetchOptions();
  }, []);

  const handleFilterChange = (field: string, value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);

    onFiltersChange({
      month: newFilters.month === 'All Months' ? '' : newFilters.month,
      department: newFilters.department === 'All Departments' ? '' : newFilters.department,
      subDept: newFilters.subDept === 'All Sub-depts' ? '' : newFilters.subDept,
      employee: newFilters.employee === 'All Employees' ? '' : newFilters.employee,
      dateFrom: newFilters.dateFrom,
      dateTo: newFilters.dateTo,
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 mt-6 mb-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">Filters</h3>
      <div className="grid grid-cols-5 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            📅 Month
          </label>
          <select
            value={filters.month}
            onChange={(e) => handleFilterChange('month', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>All Months</option>
            {options.months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🏭 Sub-Department
          </label>
          <select
            value={filters.subDept}
            onChange={(e) => handleFilterChange('subDept', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>All Sub-depts</option>
            {options.subDepts.map((subDept) => (
              <option key={subDept} value={subDept}>
                {subDept}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            👤 Employee
          </label>
          <select
            value={filters.employee}
            onChange={(e) => handleFilterChange('employee', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>All Employees</option>
            {options.employees.map((emp) => (
              <option key={emp.code} value={emp.code}>
                {emp.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            📆 From Date
          </label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            📆 To Date
          </label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => handleFilterChange('dateTo', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}
