import { query } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const month = searchParams.get('month');
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

    const employeesQuery = `
      SELECT
        emp_code,
        emp_name,
        ROUND(AVG(d_score::numeric), 2) as d_score,
        SUM(tasks_count::numeric) as total_trips,
        ROUND(AVG(weighted_count::numeric), 2) as weighted_units
      FROM public.eod_annotation
      ${whereClause}
      GROUP BY emp_code, emp_name
      ORDER BY d_score DESC
    `;

    const result = await query(employeesQuery, params);

    const employees = result.rows.map((row: any) => ({
      code: row.emp_code,
      name: row.emp_name,
      dScore: parseFloat(row.d_score) || 0,
      totalTrips: parseInt(row.total_trips) || 0,
      weightedUnits: parseFloat(row.weighted_units) || 0,
    }));

    return NextResponse.json({ employees });
  } catch (error) {
    console.error('Employees fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch employees' },
      { status: 500 }
    );
  }
}
