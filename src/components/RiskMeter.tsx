import React from 'react';
import { cn } from '@/lib/utils';
import type { RiskLevel } from '@/types';
import { Shield, ShieldAlert, ShieldX } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface RiskMeterProps {
  riskLevel: RiskLevel;
  riskScore: number;
  isAnalyzing?: boolean;
}

export const RiskMeter: React.FC<RiskMeterProps> = ({
  riskLevel,
  riskScore,
  isAnalyzing = false,
}) => {
  const { t } = useLanguage();

  const riskConfig = {
    low: {
      labelKey: 'risk.low',
      icon: Shield,
      bgClass: 'risk-low-bg',
      borderClass: 'border-risk-low',
      textClass: 'text-risk-low',
      ringClass: 'ring-risk-low/30',
    },
    medium: {
      labelKey: 'risk.medium',
      icon: ShieldAlert,
      bgClass: 'risk-medium-bg',
      borderClass: 'border-risk-medium',
      textClass: 'text-risk-medium',
      ringClass: 'ring-risk-medium/30',
    },
    high: {
      labelKey: 'risk.high',
      icon: ShieldX,
      bgClass: 'risk-high-bg',
      borderClass: 'border-risk-high',
      textClass: 'text-risk-high',
      ringClass: 'ring-risk-high/30',
    },
  };

  const config = riskConfig[riskLevel];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'relative rounded-2xl border-2 p-6 transition-all duration-500',
        config.bgClass,
        config.borderClass,
        isAnalyzing && 'animate-pulse-ring',
        riskLevel === 'high' && 'animate-shake shadow-glow-danger'
      )}
    >
      <div className="flex items-center gap-4">
        <div
          className={cn(
            'flex h-20 w-20 items-center justify-center rounded-full ring-4',
            config.bgClass,
            config.ringClass
          )}
        >
          <Icon className={cn('h-10 w-10', config.textClass)} strokeWidth={2.5} />
        </div>

        <div className="flex-1">
          <h2 className={cn('text-2xl font-bold', config.textClass)}>
            {isAnalyzing ? t('risk.analyzing') : t(config.labelKey)}
          </h2>
        </div>

        <div className="text-right">
          <div className={cn('text-4xl font-bold', config.textClass)}>
            {riskScore}%
          </div>
          <p className="text-sm text-muted-foreground">{t('risk.score')}</p>
        </div>
      </div>

      <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            riskLevel === 'low' && 'bg-risk-low',
            riskLevel === 'medium' && 'bg-risk-medium',
            riskLevel === 'high' && 'bg-risk-high'
          )}
          style={{ width: `${riskScore}%` }}
        />
      </div>
    </div>
  );
};
