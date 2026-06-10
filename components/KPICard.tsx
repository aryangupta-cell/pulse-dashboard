'use client';

interface KPICardProps {
  title: string;
  value: number | string;
  color: string;
  icon: string;
  unit?: string;
}

export default function KPICard({ title, value, color, icon, unit = '' }: KPICardProps) {
  const borderColorClasses = {
    blue: 'border-t-4 border-t-blue-500',
    teal: 'border-t-4 border-t-teal-500',
    green: 'border-t-4 border-t-green-500',
    orange: 'border-t-4 border-t-orange-500',
    purple: 'border-t-4 border-t-purple-500',
  };

  const textColorClasses = {
    blue: 'text-blue-600',
    teal: 'text-teal-600',
    green: 'text-green-600',
    orange: 'text-orange-600',
    purple: 'text-purple-600',
  };

  const iconColorClasses = {
    blue: 'text-blue-400',
    teal: 'text-teal-400',
    green: 'text-green-400',
    orange: 'text-orange-400',
    purple: 'text-purple-400',
  };

  const borderColor = borderColorClasses[color as keyof typeof borderColorClasses] || borderColorClasses.blue;
  const textColor = textColorClasses[color as keyof typeof textColorClasses] || textColorClasses.blue;
  const iconColor = iconColorClasses[color as keyof typeof iconColorClasses] || iconColorClasses.blue;

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 flex-1 ${borderColor}`}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <span className={`${iconColor} text-lg`}>{icon}</span>
      </div>
      <p className={`${textColor} text-3xl font-bold`}>
        {value}{unit}
      </p>
    </div>
  );
}
