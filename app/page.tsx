'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import KPICard from '@/components/KPICard';
import FilterSection from '@/components/FilterSection';
import Charts from '@/components/Charts';
import EmployeeList from '@/components/EmployeeList';

interface KPIs {
  totalEmployees: number;
  totalWorkingDays: number;
  avgWeightedUnits: number;
  totalTripsCount: number;
  dScore: number;
}

export default function Dashboard() {
  const [kpis, setKpis] = useState<KPIs>({
    totalEmployees: 0,
    totalWorkingDays: 0,
    avgWeightedUnits: 0,
    totalTripsCount: 0,
    dScore: 0,
  });

  const [filters, setFilters] = useState({
    month: '',
    department: '',
    subDept: '',
    employee: '',
    dateFrom: '',
    dateTo: '',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKPIs = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.month) params.append('month', filters.month);
        if (filters.department) params.append('department', filters.department);
        if (filters.subDept) params.append('subDept', filters.subDept);
        if (filters.employee) params.append('employee', filters.employee);
        if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
        if (filters.dateTo) params.append('dateTo', filters.dateTo);

        const response = await fetch(`/api/kpis?${params}`);
        const data = await response.json();
        setKpis(data);
      } catch (error) {
        console.error('Failed to fetch KPIs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchKPIs();
  }, [filters]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-5 gap-4">
          <KPICard
            title="D Score"
            value={kpis.dScore}
            color="purple"
            icon="⭐"
          />
          <KPICard
            title="Avg Weighted Units"
            value={kpis.avgWeightedUnits}
            color="green"
            icon="📈"
          />
          <KPICard
            title="Total Trips Count"
            value={kpis.totalTripsCount}
            color="orange"
            icon="🚗"
          />
          <KPICard
            title="Total Employees"
            value={kpis.totalEmployees}
            color="blue"
            icon="👤"
          />
          <KPICard
            title="Total Working Days"
            value={kpis.totalWorkingDays}
            color="teal"
            icon="📅"
          />
        </div>

        {/* Filter Section */}
        <FilterSection onFiltersChange={setFilters} />

        {/* Charts */}
        <Charts filters={filters} />

        {/* Employee List */}
        <EmployeeList filters={filters} />
      </div>
    </div>
  );
}
