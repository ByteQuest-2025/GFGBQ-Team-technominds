import React from 'react';
import { cn } from '@/lib/utils';
import type { RiskLevel } from '@/types';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface GuidancePanelProps {
  riskLevel: RiskLevel;
  guidance: string[];
}

const riskConfig = {
  low: {
    icon: CheckCircle,
    bgClass: 'bg-success/10 border-success/30',
    iconClass: 'text-success',
    titleKey: 'guidance.allClear',
  },
  medium: {
    icon: AlertTriangle,
    bgClass: 'bg-warning/10 border-warning/30',
    iconClass: 'text-warning',
    titleKey: 'guidance.caution',
  },
  high: {
    icon: XCircle,
    bgClass: 'bg-danger/10 border-danger/30',
    iconClass: 'text-danger',
    titleKey: 'guidance.action',
  },
};

export const GuidancePanel: React.FC<GuidancePanelProps> = ({
  riskLevel,
  guidance,
}) => {
  const { t } = useLanguage();
  const config = riskConfig[riskLevel];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'rounded-2xl border-2 p-6 transition-all duration-300 animate-fade-in',
        config.bgClass
      )}
    >
      <div className="mb-4 flex items-center gap-3">
        <Icon className={cn('h-8 w-8', config.iconClass)} />
        <h3 className="text-xl font-bold">{t(config.titleKey)}</h3>
      </div>

      <ul className="space-y-3">
        {guidance.map((message, index) => (
          <li
            key={index}
            className={cn(
              'flex items-start gap-3 rounded-lg bg-card/50 p-4 text-lg font-medium transition-all',
              'animate-fade-in'
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {message}
          </li>
        ))}
      </ul>
    </div>
  );
};
