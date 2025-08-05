'use client';

import { FC } from 'react';
import { Trophy, Crown, Bolt, Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { cn } from '@/utils/cn';

interface BadgeProps {
  variant: 'type' | 'status' | 'stage';
  value: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const CompetitionBadge: FC<BadgeProps> = ({ variant, value, size = 'md', className }) => {
  const getTypeConfig = (type: string) => {
    switch (type.toLowerCase()) {
      case 'league':
        return {
          icon: Trophy,
          colors: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
          label: 'League'
        };
      case 'knockout':
        return {
          icon: Crown,
          colors: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
          label: 'Knockout'
        };
      case 'hybrid':
        return {
          icon: Bolt,
          colors: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
          label: 'Hybrid'
        };
      default:
        return {
          icon: Trophy,
          colors: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
          label: type
        };
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'ongoing':
      case 'active':
        return {
          icon: Clock,
          colors: 'bg-green-500/10 text-green-600 border-green-500/20',
          label: 'Ongoing'
        };
      case 'completed':
      case 'finished':
        return {
          icon: CheckCircle,
          colors: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
          label: 'Completed'
        };
      case 'upcoming':
      case 'scheduled':
        return {
          icon: AlertCircle,
          colors: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
          label: 'Upcoming'
        };
      case 'cancelled':
      case 'canceled':
        return {
          icon: XCircle,
          colors: 'bg-red-500/10 text-red-600 border-red-500/20',
          label: 'Cancelled'
        };
      default:
        return {
          icon: Clock,
          colors: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
          label: status
        };
    }
  };

  const getStageConfig = (stage: string) => {
    return {
      icon: null,
      colors: 'bg-slate-500/10 text-slate-600 border-slate-500/20',
      label: stage
    };
  };

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs gap-1';
      case 'lg':
        return 'px-4 py-2 text-sm gap-2';
      default:
        return 'px-3 py-1.5 text-xs gap-1.5';
    }
  };

  const getIconSize = (size: string) => {
    switch (size) {
      case 'sm':
        return 'w-3 h-3';
      case 'lg':
        return 'w-5 h-5';
      default:
        return 'w-4 h-4';
    }
  };

  let config;
  switch (variant) {
    case 'type':
      config = getTypeConfig(value);
      break;
    case 'status':
      config = getStatusConfig(value);
      break;
    case 'stage':
      config = getStageConfig(value);
      break;
    default:
      config = getTypeConfig(value);
  }

  const Icon = config.icon;

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border font-medium transition-colors',
        config.colors,
        getSizeClasses(size),
        className
      )}
    >
      {Icon && <Icon className={getIconSize(size)} />}
      <span className="capitalize">{config.label}</span>
    </div>
  );
};

export default CompetitionBadge;
