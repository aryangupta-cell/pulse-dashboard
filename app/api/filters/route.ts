import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const monthsResult = await query(`
      SELECT DISTINCT TO_CHAR(date, 'YYYY-MM') as month
      FROM public.eod_annotation
      ORDER BY month DESC
    `);

    const subDeptsResult = await query(`
      SELECT DISTINCT sub_dept FROM public.eod_annotation
      WHERE sub_dept IS NOT NULL
      ORDER BY sub_dept
    `);

    const employeesResult = await query(`
      SELECT DISTINCT emp_code, emp_name FROM public.eod_annotation
      ORDER BY emp_name
    `);

    return NextResponse.json({
      months: monthsResult.rows.map((r: any) => r.month),
      departments: [], // No department column in database
      subDepts: subDeptsResult.rows.map((r: any) => r.sub_dept),
      employees: employeesResult.rows.map((r: any) => ({
        code: r.emp_code,
        name: r.emp_name,
      })),
    });
  } catch (error) {
    console.error('Filters fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch filter options' },
      { status: 500 }
    );
  }
}
