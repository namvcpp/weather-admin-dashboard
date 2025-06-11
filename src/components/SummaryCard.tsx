import React from 'react';

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  bgColor?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  icon,
  change,
  trend = 'neutral',
  bgColor = 'bg-card',
}) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-success';
      case 'down':
        return 'text-danger';
      default:
        return 'text-secondary-foreground';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return '↑';
      case 'down':
        return '↓';
      default:
        return '→';
    }
  };

  return (
    <div className={`card ${bgColor} h-full`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-secondary-foreground">{title}</h3>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${getTrendColor()}`}>
              {getTrendIcon()} {change}
            </p>
          )}
        </div>
        <div className="p-2 rounded-full bg-secondary/50">{icon}</div>
      </div>
    </div>
  );
};

export default SummaryCard;
