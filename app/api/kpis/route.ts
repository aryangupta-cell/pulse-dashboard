import { query } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const month = searchParams.get('month');
    const department = searchParams.get('department');
    const subDept = searchParams.get('subDept');
    const employee = searchParams.get('employee');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    let whereClause = 'WHERE 1=1';
    const params: any[] = [];

    if (month) {
      whereClause += ' AND TO_CHAR(date, \'YYYY-MM\') = $' + (params.length + 1);
      params.push(month);
    }
    if (department) {
      whereClause += ' AND department = $' + (params.length + 1);
      params.push(department);
    }
    if (subDept) {
      whereClause += ' AND sub_dept = $' + (params.length + 1);
      params.push(subDept);
    }
    if (employee) {
      whereClause += ' AND emp_code = $' + (params.length + 1);
      params.push(employee);
    }
    if (dateFrom) {
      whereClause += ' AND date >= $' + (params.length + 1);
      params.push(dateFrom);
    }
    if (dateTo) {
      whereClause += ' AND date <= $' + (params.length + 1);
      params.push(dateTo);
    }

    const kpiQuery = `
      SELECT
        COUNT(DISTINCT emp_code) as total_employees,
        COUNT(DISTINCT date) as total_working_days,
        ROUND(AVG(weighted_count::numeric), 2) as avg_weighted_units,
        SUM(tasks_count::numeric) as total_trips_count,
        ROUND(AVG(d_score::numeric), 2) as d_score
      FROM public.eod_annotation
      ${whereClause}
    `;

    const result = await query(kpiQuery, params);
    const data = result.rows[0];

    return NextResponse.json({
      totalEmployees: parseInt(data.total_employees) || 0,
      totalWorkingDays: parseInt(data.total_working_days) || 0,
      avgWeightedUnits: parseFloat(data.avg_weighted_units) || 0,
      totalTripsCount: parseInt(data.total_trips_count) || 0,
      dScore: parseFloat(data.d_score) || 0,
    });
  } catch (error) {
    console.error('KPI fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch KPIs' },
      { status: 500 }
    );
  }
}
