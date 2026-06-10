'use client';

interface KPICardProps {
  title: string;
  value: number | string;
  color: string;
  icon: string;
  unit?: string;
}

export default function KPICard({ title, value, color, icon, unit = '' }: KPICardProps) {
  const displayValue = typeof value === 'number' ? Math.round(value) : value;
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

  const bgGradients = {
    blue: 'from-blue-50 to-blue-100/20',
    teal: 'from-teal-50 to-teal-100/20',
    green: 'from-green-50 to-green-100/20',
    orange: 'from-orange-50 to-orange-100/20',
    purple: 'from-purple-50 to-purple-100/20',
  };

  const bgGradient = bgGradients[color as keyof typeof bgGradients] || bgGradients.blue;

  return (
    <div className={`bg-gradient-to-br ${bgGradient} border border-gray-200 rounded-xl p-7 flex-1 hover:shadow-lg transition-all duration-300 ${borderColor}`}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-gray-600 text-sm font-semibold tracking-wide">{title}</p>
        </div>
        <span className={`${iconColor} text-3xl`}>{icon}</span>
      </div>
      <p className={`${textColor} text-4xl font-bold tracking-tight`}>
        {displayValue}{unit}
      </p>
    </div>
  );
}
