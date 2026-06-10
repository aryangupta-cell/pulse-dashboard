import { query } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const granularity = searchParams.get('granularity') || 'daily'; // daily, weekly, monthly
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

    let dateGroup = 'date';
    if (granularity === 'weekly') {
      dateGroup = 'DATE_TRUNC(\'week\', date)::date';
    } else if (granularity === 'monthly') {
      dateGroup = 'DATE_TRUNC(\'month\', date)::date';
    }

    const trendsQuery = `
      SELECT
        ${dateGroup} as date,
        ROUND(AVG(weighted_count::numeric), 2) as productivity,
        SUM(tasks_count::numeric) as total_trips
      FROM public.eod_annotation
      ${whereClause}
      GROUP BY ${dateGroup}
      ORDER BY ${dateGroup} ASC
    `;

    const result = await query(trendsQuery, params);

    const trends = result.rows.map((row: any) => ({
      date: row.date.toISOString().split('T')[0],
      productivity: parseFloat(row.productivity) || 0,
      totalTrips: parseInt(row.total_trips) || 0,
    }));

    return NextResponse.json({ trends });
  } catch (error) {
    console.error('Trends fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trends' },
      { status: 500 }
    );
  }
}
